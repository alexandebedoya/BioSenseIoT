package com.biosense.iot.auth.infrastructure.adapter.out.security;

import com.biosense.iot.auth.domain.port.out.TokenProviderPort;
import com.biosense.iot.config.JwtService;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenAdapter implements TokenProviderPort {

    private final JwtService jwtService;

    public JwtTokenAdapter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public String generateToken(String email) {
        return jwtService.generateToken(email);
    }
}
