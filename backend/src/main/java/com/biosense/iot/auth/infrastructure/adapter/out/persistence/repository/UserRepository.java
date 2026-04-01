package com.biosense.iot.auth.infrastructure.adapter.out.persistence.repository;

import com.biosense.iot.auth.infrastructure.adapter.out.persistence.entity.UserEntity;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;

public interface UserRepository extends ReactiveCrudRepository<UserEntity, Integer> {
    Mono<UserEntity> findByEmail(String email);
    Mono<UserEntity> findByGoogleId(String googleId);
}
