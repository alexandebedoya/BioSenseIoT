package com.biosense.iot.auth.infrastructure.adapter.out.persistence;

import com.biosense.iot.auth.domain.model.UserDomain;
import com.biosense.iot.auth.domain.port.out.UserRepositoryPort;
import com.biosense.iot.entity.User;
import com.biosense.iot.repository.UserRepository;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class UserPersistenceAdapter implements UserRepositoryPort {

    private final UserRepository repository;

    public UserPersistenceAdapter(UserRepository repository) {
        this.repository = repository;
    }

    @Override
    public Mono<UserDomain> findByGoogleIdOrEmail(String googleId, String email) {
        return repository.findByGoogleId(googleId)
                .switchIfEmpty(repository.findByEmail(email))
                .map(this::toDomain);
    }

    @Override
    public Mono<UserDomain> save(UserDomain user) {
        return repository.save(toEntity(user))
                .map(this::toDomain);
    }

    private UserDomain toDomain(User entity) {
        return new UserDomain(
                entity.getId(),
                entity.getEmail(),
                entity.getFullName(),
                entity.getGoogleId(),
                entity.getPassword(),
                entity.getCreatedAt()
        );
    }

    private User toEntity(UserDomain domain) {
        return User.builder()
                .id(domain.getId())
                .email(domain.getEmail())
                .fullName(domain.getFullName())
                .googleId(domain.getGoogleId())
                .password(domain.getPassword())
                .createdAt(domain.getCreatedAt())
                .build();
    }
}
