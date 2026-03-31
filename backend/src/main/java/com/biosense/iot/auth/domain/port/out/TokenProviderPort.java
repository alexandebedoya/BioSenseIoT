package com.biosense.iot.auth.domain.port.out;

public interface TokenProviderPort {
    String generateToken(String email);
}
