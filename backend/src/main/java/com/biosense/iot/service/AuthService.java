package com.biosense.iot.service;

import com.biosense.iot.config.JwtService;
import com.biosense.iot.dto.AuthResponse;
import com.biosense.iot.entity.User;
import com.biosense.iot.exception.AuthException;
import com.biosense.iot.repository.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.Instant;
import java.util.List;
import java.util.Arrays;

import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final GoogleIdTokenVerifier verifier;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
            JwtService jwtService,
            @Value("${GOOGLE_CLIENT_ID}") String clientIds,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;

        // 🔍 DEBUG (puedes quitarlo después)
        System.out.println("CLIENT IDS RAW: " + clientIds);

        // ✅ Parse correcto (elimina espacios)
        List<String> audiences = Arrays.stream(clientIds.split(","))
                .map(String::trim)
                .toList();

        System.out.println("CLIENT IDS PARSED: " + audiences);

        this.verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(),
                new GsonFactory())
                .setAudience(audiences)
                .build();
    }

    /**
     * Registro manual con email y password.
     */
    public Mono<AuthResponse> registerManual(String email, String password, String name) {
        return userRepository.findByEmail(email)
                .flatMap(u -> Mono.<User>error(new AuthException("El usuario ya existe")))
                .switchIfEmpty(userRepository.save(User.builder()
                        .email(email)
                        .password(passwordEncoder.encode(password))
                        .fullName(name)
                        .createdAt(Instant.now())
                        .build()))
                .map(user -> AuthResponse.builder()
                        .accessToken(jwtService.generateToken(user.getEmail()))
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .build());
    }

    /**
     * Login manual con email y password.
     */
    public Mono<AuthResponse> loginManual(String email, String password) {
        return userRepository.findByEmail(email)
                .filter(user -> user.getPassword() != null && passwordEncoder.matches(password, user.getPassword()))
                .switchIfEmpty(Mono.error(new AuthException("Credenciales inválidas")))
                .map(user -> AuthResponse.builder()
                        .accessToken(jwtService.generateToken(user.getEmail()))
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .build());
    }

    /**
     * Login con Google
     */
    public Mono<AuthResponse> authenticateWithGoogle(String idTokenString) {

        return Mono.fromCallable(() -> {
            try {
                System.out.println("TOKEN RECIBIDO: " + idTokenString);

                GoogleIdToken token = verifier.verify(idTokenString);

                if (token == null) {
                    System.out.println("❌ TOKEN INVALIDO (verify returned null)");
                }

                return token;

            } catch (Exception e) {
                e.printStackTrace();
                throw new AuthException("Error al validar el token de Google: " + e.getMessage());
            }
        })
                .subscribeOn(Schedulers.boundedElastic())
                .flatMap(idToken -> {

                    if (idToken == null) {
                        return Mono.error(new AuthException("Token de Google inválido o expirado"));
                    }

                    GoogleIdToken.Payload payload = idToken.getPayload();

                    String googleId = payload.getSubject();
                    String email = payload.getEmail();
                    String name = (String) payload.get("name");

                    System.out.println("✅ EMAIL: " + email);
                    System.out.println("✅ AUD: " + payload.getAudience());
                    System.out.println("✅ ISS: " + payload.getIssuer());

                    return processUserUpsert(googleId, email, name)
                            .map(user -> AuthResponse.builder()
                                    .accessToken(jwtService.generateToken(user.getEmail()))
                                    .email(user.getEmail())
                                    .fullName(user.getFullName())
                                    .build());
                });
    }

    /**
     * Upsert usuario
     */
    private Mono<User> processUserUpsert(String googleId, String email, String name) {

        return userRepository.findByGoogleId(googleId)
                .switchIfEmpty(userRepository.findByEmail(email))
                .flatMap(existingUser -> {

                    boolean needsUpdate = false;

                    if (existingUser.getGoogleId() == null) {
                        existingUser.setGoogleId(googleId);
                        needsUpdate = true;
                    }

                    if (!existingUser.getEmail().equals(email)) {
                        existingUser.setEmail(email);
                        needsUpdate = true;
                    }

                    if (name != null && !name.equals(existingUser.getFullName())) {
                        existingUser.setFullName(name);
                        needsUpdate = true;
                    }

                    return needsUpdate
                            ? userRepository.save(existingUser)
                            : Mono.just(existingUser);
                })
                .switchIfEmpty(userRepository.save(User.builder()
                        .googleId(googleId)
                        .email(email)
                        .fullName(name)
                        .createdAt(Instant.now())
                        .build()));
    }
}