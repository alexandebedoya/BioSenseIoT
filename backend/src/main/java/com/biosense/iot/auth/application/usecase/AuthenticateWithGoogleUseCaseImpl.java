package com.biosense.iot.auth.application.usecase;

import com.biosense.iot.auth.domain.model.UserDomain;
import com.biosense.iot.auth.domain.port.in.AuthenticateWithGoogleUseCase;
import com.biosense.iot.auth.domain.port.out.GoogleAuthPort;
import com.biosense.iot.auth.domain.port.out.TokenProviderPort;
import com.biosense.iot.auth.domain.port.out.UserRepositoryPort;
import com.biosense.iot.dto.AuthResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.Instant;

@Service
public class AuthenticateWithGoogleUseCaseImpl implements AuthenticateWithGoogleUseCase {

    private static final Logger log = LoggerFactory.getLogger(AuthenticateWithGoogleUseCaseImpl.class);

    private final GoogleAuthPort googleAuthPort;
    private final UserRepositoryPort userRepositoryPort;
    private final TokenProviderPort tokenProviderPort;

    public AuthenticateWithGoogleUseCaseImpl(
            GoogleAuthPort googleAuthPort,
            UserRepositoryPort userRepositoryPort,
            TokenProviderPort tokenProviderPort) {
        this.googleAuthPort = googleAuthPort;
        this.userRepositoryPort = userRepositoryPort;
        this.tokenProviderPort = tokenProviderPort;
    }

    @Override
    public Mono<AuthResponse> execute(String idToken) {
        return googleAuthPort.verifyToken(idToken)
                .flatMap(identity -> {
                    log.info("Procesando identidad de Google: {}", identity.email());
                    return userRepositoryPort.findByGoogleIdOrEmail(identity.googleId(), identity.email())
                            .flatMap(existingUser -> {
                                existingUser.updateInfo(identity.email(), identity.name());
                                return userRepositoryPort.save(existingUser);
                            })
                            .switchIfEmpty(Mono.defer(() -> {
                                UserDomain newUser = new UserDomain();
                                newUser.setGoogleId(identity.googleId());
                                newUser.setEmail(identity.email());
                                newUser.setFullName(identity.name());
                                newUser.setCreatedAt(Instant.now());
                                return userRepositoryPort.save(newUser);
                            }));
                })
                .map(user -> AuthResponse.builder()
                        .accessToken(tokenProviderPort.generateToken(user.getEmail()))
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .build());
    }
}
