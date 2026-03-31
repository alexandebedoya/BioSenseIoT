package com.biosense.iot.auth.infrastructure.adapter.in.web;

import com.biosense.iot.auth.domain.port.in.AuthenticateWithGoogleUseCase;
import com.biosense.iot.dto.AuthResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

/**
 * Adaptador de entrada Web (V2) siguiendo Clean Architecture.
 * Este controlador es independiente de la implementación de la lógica de negocio.
 */
@RestController
@RequestMapping("/api/v2/auth")
@RequiredArgsConstructor
public class AuthControllerV2 {

    private static final Logger log = LoggerFactory.getLogger(AuthControllerV2.class);
    private final AuthenticateWithGoogleUseCase authenticateWithGoogleUseCase;

    /**
     * Nuevo endpoint de autenticación con Google.
     * Delegación pura al caso de uso de dominio.
     */
    @PostMapping("/google")
    public Mono<ResponseEntity<AuthResponse>> exchangeGoogleToken(@RequestBody Map<String, String> request) {
        String idToken = request.get("idToken");
        
        if (idToken == null || idToken.isEmpty()) {
            log.warn("Intento de login con Google sin idToken en V2");
            return Mono.just(ResponseEntity.badRequest().build());
        }

        log.info("Iniciando flujo de autenticación Google V2 (Clean Architecture)");
        
        return authenticateWithGoogleUseCase.execute(idToken)
                .map(ResponseEntity::ok)
                .doOnError(e -> log.error("Error en flujo Auth V2: {}", e.getMessage()));
    }
}
