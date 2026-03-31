package com.biosense.iot.auth.domain.port.out;

import com.biosense.iot.auth.domain.model.GoogleIdentity;
import reactor.core.publisher.Mono;

public interface GoogleAuthPort {
    Mono<GoogleIdentity> verifyToken(String idToken);
}
