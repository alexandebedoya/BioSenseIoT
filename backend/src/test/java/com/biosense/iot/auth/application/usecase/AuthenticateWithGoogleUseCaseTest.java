package com.biosense.iot.auth.application.usecase;

import com.biosense.iot.auth.domain.model.GoogleIdentity;
import com.biosense.iot.auth.domain.model.UserDomain;
import com.biosense.iot.auth.domain.port.out.GoogleAuthPort;
import com.biosense.iot.auth.domain.port.out.TokenProviderPort;
import com.biosense.iot.auth.domain.port.out.UserRepositoryPort;
import com.biosense.iot.dto.AuthResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.time.Instant;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthenticateWithGoogleUseCaseTest {

    @Mock private GoogleAuthPort googleAuthPort;
    @Mock private UserRepositoryPort userRepositoryPort;
    @Mock private TokenProviderPort tokenProviderPort;

    private AuthenticateWithGoogleUseCaseImpl useCase;

    @BeforeEach
    void setUp() {
        useCase = new AuthenticateWithGoogleUseCaseImpl(googleAuthPort, userRepositoryPort, tokenProviderPort);
    }

    @Test
    void shouldCreateNewUserAndReturnTokenWhenUserDoesNotExist() {
        // Arrange
        String mockIdToken = "valid-token";
        GoogleIdentity identity = new GoogleIdentity("google-id", "test@example.com", "Test User");
        UserDomain newUser = new UserDomain(1, "test@example.com", "Test User", "google-id", null, Instant.now());

        when(googleAuthPort.verifyToken(mockIdToken)).thenReturn(Mono.just(identity));
        when(userRepositoryPort.findByGoogleIdOrEmail(anyString(), anyString())).thenReturn(Mono.empty());
        when(userRepositoryPort.save(any(UserDomain.class))).thenReturn(Mono.just(newUser));
        when(tokenProviderPort.generateToken(anyString())).thenReturn("jwt-token");

        // Act & Assert
        StepVerifier.create(useCase.execute(mockIdToken))
                .expectNextMatches(response -> 
                    response.getEmail().equals("test@example.com") &&
                    response.getAccessToken().equals("jwt-token")
                )
                .verifyComplete();

        verify(userRepositoryPort, times(1)).save(any(UserDomain.class));
    }

    @Test
    void shouldUpdateExistingUserAndReturnTokenWhenUserExists() {
        // Arrange
        String mockIdToken = "valid-token";
        GoogleIdentity identity = new GoogleIdentity("google-id", "updated@example.com", "Updated Name");
        UserDomain existingUser = new UserDomain(1, "old@example.com", "Old Name", "google-id", null, Instant.now());

        when(googleAuthPort.verifyToken(mockIdToken)).thenReturn(Mono.just(identity));
        when(userRepositoryPort.findByGoogleIdOrEmail(anyString(), anyString())).thenReturn(Mono.just(existingUser));
        when(userRepositoryPort.save(any(UserDomain.class))).thenReturn(Mono.just(existingUser));
        when(tokenProviderPort.generateToken(anyString())).thenReturn("jwt-token");

        // Act & Assert
        StepVerifier.create(useCase.execute(mockIdToken))
                .expectNextMatches(response -> response.getEmail().equals("updated@example.com"))
                .verifyComplete();

        verify(userRepositoryPort, times(1)).save(existingUser);
    }
}
