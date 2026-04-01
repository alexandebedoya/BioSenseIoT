package com.biosense.iot.auth.application.usecase;

import com.biosense.iot.auth.domain.model.UserDomain;
import com.biosense.iot.auth.domain.port.in.RegisterUseCase;
import com.biosense.iot.auth.domain.port.out.UserRepositoryPort;
import com.biosense.iot.auth.domain.port.out.TokenProviderPort;
import com.biosense.iot.dto.AuthResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class RegisterUseCaseImpl implements RegisterUseCase {

    private final UserRepositoryPort userRepositoryPort;
    private final TokenProviderPort tokenProviderPort;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Mono<AuthResponse> execute(String email, String password, String fullName) {
        return userRepositoryPort.findByEmail(email)
                .flatMap(exists -> Mono.<AuthResponse>error(new RuntimeException("El usuario ya existe")))
                .switchIfEmpty(Mono.defer(() -> {
                    UserDomain newUser = new UserDomain(
                            null,
                            email,
                            fullName,
                            null,
                            passwordEncoder.encode(password),
                            Instant.now()
                    );
                    return userRepositoryPort.save(newUser)
                            .map(user -> new AuthResponse(
                                    tokenProviderPort.generateToken(user.getEmail()),
                                    user.getEmail(),
                                    user.getFullName()
                            ));
                }));
    }
}
