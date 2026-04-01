package com.biosense.iot.diagnostic.infrastructure.adapter.in.web;

import com.biosense.iot.auth.infrastructure.security.jwt.JwtAdapter;
import com.biosense.iot.diagnostic.domain.model.DiagnosticDomain;
import com.biosense.iot.diagnostic.domain.port.in.GetLatestDiagnosticUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v2/diagnostics")
@RequiredArgsConstructor
public class DiagnosticControllerV2 {

    private final GetLatestDiagnosticUseCase getLatestDiagnosticUseCase;
    private final JwtAdapter jwtAdapter;

    @GetMapping("/latest")
    public Mono<ResponseEntity<DiagnosticDomain>> getLatestDiagnostic(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtAdapter.extractUsername(token);

        return getLatestDiagnosticUseCase.execute(email)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
}
