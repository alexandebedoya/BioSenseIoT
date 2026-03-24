package com.biosense.iot.repository;

import com.biosense.iot.entity.User;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;

public interface UserRepository extends ReactiveCrudRepository<User, Integer> {
    Mono<User> findByEmail(String email);
    Mono<User> findByGoogleId(String googleId);
}
