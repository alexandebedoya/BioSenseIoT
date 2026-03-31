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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);
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

        List<String> audiences = Arrays.stream(clientIds.split(","))
                .map(String::trim)
                .toList();

        this.verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(),
                new GsonFactory())
                .setAudience(audiences)
                .build();
        
        log.info("AuthService inicializado con {} audiencias de Google", audiences.size());
    }

    public Mono<AuthResponse> registerManual(String email, String password, String name) {
        return userRepository.findByEmail(email)
                .flatMap(u -> Mono.<User>error(new AuthException("El usuario ya existe")))
                .switchIfEmpty(userRepository.save(User.builder()
                        .email(email)
                        .password(passwordEncoder.encode(password))
                        .fullName(name)
                        .createdAt(Instant.now())
                        .build()))
                .map(this::mapToResponse);
    }

    public Mono<AuthResponse> loginManual(String email, String password) {
        return userRepository.findByEmail(email)
                .filter(user -> user.getPassword() != null && passwordEncoder.matches(password, user.getPassword()))
                .switchIfEmpty(Mono.error(new AuthException("Credenciales inválidas")))
                .map(this::mapToResponse);
    }

    public Mono<AuthResponse> authenticateWithGoogle(String idTokenString) {
        return Mono.fromCallable(() -> {
            try {
                return verifier.verify(idTokenString);
            } catch (Exception e) {
                log.error("Error al verificar token de Google", e);
                throw new AuthException("Error en la validación con Google");
            }
        })
        .subscribeOn(Schedulers.boundedElastic())
        .flatMap(idToken -> {
            if (idToken == null) return Mono.error(new AuthException("Token de Google inválido"));
            
            GoogleIdToken.Payload payload = idToken.getPayload();
            log.info("Login exitoso con Google: {}", payload.getEmail());
            
            return processUserUpsert(payload.getSubject(), payload.getEmail(), (String) payload.get("name"))
                    .map(this::mapToResponse);
        });
    }

    private Mono<User> processUserUpsert(String googleId, String email, String name) {
        return userRepository.findByGoogleId(googleId)
                .switchIfEmpty(userRepository.findByEmail(email))
                .flatMap(user -> {
                    user.setGoogleId(googleId);
                    user.setFullName(name != null ? name : user.getFullName());
                    return userRepository.save(user);
                })
                .switchIfEmpty(userRepository.save(User.builder()
                        .googleId(googleId)
                        .email(email)
                        .fullName(name)
                        .createdAt(Instant.now())
                        .build()));
    }

    private AuthResponse mapToResponse(User user) {
        return AuthResponse.builder()
                .accessToken(jwtService.generateToken(user.getEmail()))
                .email(user.getEmail())
                .fullName(user.getFullName())
                .build();
    }
}
