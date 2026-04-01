package com.biosense.iot.auth.infrastructure.adapter.in.web;

import com.biosense.iot.auth.domain.port.in.AuthenticateWithGoogleUseCase;
import com.biosense.iot.auth.domain.port.in.LoginUseCase;
import com.biosense.iot.auth.domain.port.in.RegisterUseCase;
import com.biosense.iot.dto.AuthResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/v2/auth")
@RequiredArgsConstructor
public class AuthControllerV2 {

    private static final Logger log = LoggerFactory.getLogger(AuthControllerV2.class);
    private final AuthenticateWithGoogleUseCase authenticateWithGoogleUseCase;
    private final LoginUseCase loginUseCase;
    private final RegisterUseCase registerUseCase;

    @PostMapping("/google")
    public Mono<ResponseEntity<AuthResponse>> exchangeGoogleToken(@RequestBody Map<String, String> request) {
        String idToken = request.get("idToken");
        if (idToken == null || idToken.isEmpty()) {
            return Mono.just(ResponseEntity.badRequest().build());
        }
        return authenticateWithGoogleUseCase.execute(idToken)
                .map(ResponseEntity::ok);
    }

    @PostMapping("/login")
    public Mono<ResponseEntity<AuthResponse>> login(@RequestBody Map<String, String> request) {
        return loginUseCase.execute(request.get("email"), request.get("password"))
                .map(ResponseEntity::ok)
                .onErrorResume(e -> Mono.just(ResponseEntity.status(401).build()));
    }

    @PostMapping("/register")
    public Mono<ResponseEntity<AuthResponse>> register(@RequestBody Map<String, String> request) {
        return registerUseCase.execute(request.get("email"), request.get("password"), request.get("fullName"))
                .map(ResponseEntity::ok)
                .onErrorResume(e -> Mono.just(ResponseEntity.badRequest().build()));
    }
}
