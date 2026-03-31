package com.biosense.iot.auth.domain.port.out;

import com.biosense.iot.auth.domain.model.UserDomain;
import reactor.core.publisher.Mono;

public interface UserRepositoryPort {
    Mono<UserDomain> findByGoogleIdOrEmail(String googleId, String email);
    Mono<UserDomain> save(UserDomain user);
}
