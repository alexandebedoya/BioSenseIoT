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
    public Mono<ResponseEntity<AuthResponse>> registerManual(@RequestBody AuthRequest request) {
        return authService.registerManual(request.getEmail(), request.getPassword(), request.getFullName())
                .map(ResponseEntity::ok)
                .onErrorResume(AuthException.class, e -> Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST).build()));
    }

    /**
     * Endpoint para login manual con Email y Password.
     */
    @PostMapping("/login")
    public Mono<ResponseEntity<AuthResponse>> loginManual(@RequestBody AuthRequest request) {
        return authService.loginManual(request.getEmail(), request.getPassword())
                .map(ResponseEntity::ok)
                .onErrorResume(AuthException.class, e -> Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()));
    }

    /**
     * Endpoint para intercambiar el idToken de Google por un JWT local.
     */
    @PostMapping("/google")
    public Mono<ResponseEntity<AuthResponse>> exchangeGoogleToken(@RequestBody Map<String, String> request) {
        String idToken = request.get("idToken");
        
        if (idToken == null || idToken.isEmpty()) {
            return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST).build());
        }

        return authService.authenticateWithGoogle(idToken)
                .map(ResponseEntity::ok)
                .onErrorResume(e -> {
                    // Si es AuthException retornamos 401 Unauthorized con el mensaje
                    return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
                });
    }
}
