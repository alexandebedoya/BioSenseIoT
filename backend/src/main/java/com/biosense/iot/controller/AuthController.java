package com.biosense.iot.controller;

import com.biosense.iot.dto.AuthResponse;
import com.biosense.iot.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

import com.biosense.iot.dto.AuthRequest;
import com.biosense.iot.exception.AuthException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Endpoint para registro manual con Email y Password.
     */
    @PostMapping("/register")
    public Mono<ResponseEntity<?>> registerManual(@RequestBody AuthRequest request) {
        return authService.registerManual(request.getEmail(), request.getPassword(), request.getFullName())
                .map(ResponseEntity::ok)
                .onErrorResume(AuthException.class, e -> 
                    Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()))))
                .onErrorResume(e -> 
                    Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Error interno del servidor"))));
    }

    /**
     * Endpoint para login manual con Email y Password.
     */
    @PostMapping("/login")
    public Mono<ResponseEntity<?>> loginManual(@RequestBody AuthRequest request) {
        return authService.loginManual(request.getEmail(), request.getPassword())
                .map(ResponseEntity::ok)
                .onErrorResume(AuthException.class, e -> 
                    Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()))))
                .onErrorResume(e -> 
                    Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Error de conexión con el servidor"))));
    }

    /**
     * Endpoint para intercambiar el idToken de Google por un JWT local.
     */
    @PostMapping("/google")
    public Mono<ResponseEntity<?>> exchangeGoogleToken(@RequestBody Map<String, String> request) {
        String idToken = request.get("idToken");
        
        if (idToken == null || idToken.isEmpty()) {
            return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "idToken no proporcionado")));
        }

        return authService.authenticateWithGoogle(idToken)
                .map(ResponseEntity::ok)
                .onErrorResume(e -> {
                    System.err.println("Error en Google Auth: " + e.getMessage());
                    return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage())));
                });
    }
}
