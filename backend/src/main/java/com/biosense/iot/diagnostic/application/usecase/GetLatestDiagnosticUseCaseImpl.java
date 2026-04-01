package com.biosense.iot.diagnostic.application.usecase;

import com.biosense.iot.diagnostic.domain.model.DiagnosticDomain;
import com.biosense.iot.diagnostic.domain.port.in.GetLatestDiagnosticUseCase;
import com.biosense.iot.diagnostic.domain.port.out.DiagnosticRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class GetLatestDiagnosticUseCaseImpl implements GetLatestDiagnosticUseCase {

    private final DiagnosticRepositoryPort diagnosticRepositoryPort;

    @Override
    public Mono<DiagnosticDomain> execute(String userEmail) {
        return diagnosticRepositoryPort.findUserIdByEmail(userEmail)
                .flatMap(diagnosticRepositoryPort::findLatestByUserId);
    }
}
