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
import java.util.Collections;

import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final GoogleIdTokenVerifier verifier;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, 
                       JwtService jwtService, 
                       @Value("${google.client.id}") String clientId,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(clientId))
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
                        .token(jwtService.generateToken(user.getEmail()))
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
                        .token(jwtService.generateToken(user.getEmail()))
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .build());
    }

    /**
     * Valida el idToken de Google y realiza el upsert del usuario.
     * Retorna un AuthResponse con el JWT firmado y datos básicos del usuario.
     */
    public Mono<AuthResponse> authenticateWithGoogle(String idTokenString) {
        return Mono.fromCallable(() -> {
                    try {
                        return verifier.verify(idTokenString);
                    } catch (Exception e) {
                        throw new AuthException("Error al validar el token de Google: " + e.getMessage());
                    }
                })
                .subscribeOn(Schedulers.boundedElastic())
                .flatMap(idToken -> {
                    if (idToken == null) {
                        return Mono.error(new AuthException("Token de Google inválido o expirado"));
                    }
                    
                    GoogleIdToken.Payload payload = idToken.getPayload();
                    // 'sub' es el ID único e inmutable del usuario en Google
                    String googleId = payload.getSubject(); 
                    String email = payload.getEmail();
                    String name = (String) payload.get("name");

                    return processUserUpsert(googleId, email, name)
                            .map(user -> AuthResponse.builder()
                                    .token(jwtService.generateToken(user.getEmail()))
                                    .email(user.getEmail())
                                    .fullName(user.getFullName())
                                    .build());
                });
    }

    /**
     * Realiza un Upsert (Update or Insert) basado en el google_id.
     * Si el email cambia en Google, se actualiza en nuestra DB.
     */
    private Mono<User> processUserUpsert(String googleId, String email, String name) {
        return userRepository.findByGoogleId(googleId)
                .flatMap(existingUser -> {
                    boolean needsUpdate = false;
                    if (!existingUser.getEmail().equals(email)) {
                        existingUser.setEmail(email);
                        needsUpdate = true;
                    }
                    if (name != null && !name.equals(existingUser.getFullName())) {
                        existingUser.setFullName(name);
                        needsUpdate = true;
                    }
                    
                    if (needsUpdate) {
                        return userRepository.save(existingUser);
                    }
                    return Mono.just(existingUser);
                })
                .switchIfEmpty(userRepository.save(User.builder()
                        .googleId(googleId)
                        .email(email)
                        .fullName(name)
                        .createdAt(Instant.now())
                        .build()));
    }
}
