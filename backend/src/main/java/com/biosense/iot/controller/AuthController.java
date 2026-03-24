package com.biosense.iot.controller;

import com.biosense.iot.dto.AuthResponse;
import com.biosense.iot.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

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
