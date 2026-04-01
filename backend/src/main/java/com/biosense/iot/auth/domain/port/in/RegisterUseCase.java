package com.biosense.iot.auth.domain.port.in;

import com.biosense.iot.dto.AuthResponse;
import reactor.core.publisher.Mono;

public interface RegisterUseCase {
    Mono<AuthResponse> execute(String email, String password, String fullName);
}
