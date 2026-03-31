package com.biosense.iot.auth.domain.port.in;

import com.biosense.iot.dto.AuthResponse;
import reactor.core.publisher.Mono;

public interface AuthenticateWithGoogleUseCase {
    Mono<AuthResponse> execute(String idToken);
}
