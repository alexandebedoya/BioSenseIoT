package com.biosense.iot.auth.application.usecase;

import com.biosense.iot.auth.domain.port.in.LoginUseCase;
import com.biosense.iot.auth.domain.port.out.UserRepositoryPort;
import com.biosense.iot.auth.domain.port.out.TokenProviderPort;
import com.biosense.iot.dto.AuthResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class LoginUseCaseImpl implements LoginUseCase {

    private final UserRepositoryPort userRepositoryPort;
    private final TokenProviderPort tokenProviderPort;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Mono<AuthResponse> execute(String email, String password) {
        return userRepositoryPort.findByEmail(email)
                .filter(user -> passwordEncoder.matches(password, user.getPassword()))
                .map(user -> new AuthResponse(
                        tokenProviderPort.generateToken(user.getEmail()),
                        user.getEmail(),
                        user.getFullName()
                ))
                .switchIfEmpty(Mono.error(new RuntimeException("Credenciales inválidas")));
    }
}
