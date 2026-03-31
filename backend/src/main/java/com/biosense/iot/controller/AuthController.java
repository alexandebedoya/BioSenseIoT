package com.biosense.iot.controller;

import com.biosense.iot.dto.AuthResponse;
import com.biosense.iot.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

import com.biosense.iot.dto.AuthRequest;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public Mono<ResponseEntity<AuthResponse>> registerManual(@RequestBody AuthRequest request) {
        return authService.registerManual(request.getEmail(), request.getPassword(), request.getFullName())
                .map(ResponseEntity::ok);
    }

    @PostMapping("/login")
    public Mono<ResponseEntity<AuthResponse>> loginManual(@RequestBody AuthRequest request) {
        return authService.loginManual(request.getEmail(), request.getPassword())
                .map(ResponseEntity::ok);
    }

    @PostMapping("/google")
    public Mono<ResponseEntity<AuthResponse>> exchangeGoogleToken(@RequestBody Map<String, String> request) {
        String idToken = request.get("idToken");
        return authService.authenticateWithGoogle(idToken)
                .map(ResponseEntity::ok);
    }
}
