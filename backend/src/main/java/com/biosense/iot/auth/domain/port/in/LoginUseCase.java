package com.biosense.iot.auth.domain.port.in;

import com.biosense.iot.dto.AuthResponse;
import reactor.core.publisher.Mono;

public interface LoginUseCase {
    Mono<AuthResponse> execute(String email, String password);
}
