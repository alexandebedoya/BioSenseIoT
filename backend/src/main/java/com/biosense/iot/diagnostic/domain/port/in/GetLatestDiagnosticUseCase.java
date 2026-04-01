package com.biosense.iot.diagnostic.domain.port.in;

import com.biosense.iot.diagnostic.domain.model.DiagnosticDomain;
import reactor.core.publisher.Mono;

public interface GetLatestDiagnosticUseCase {
    Mono<DiagnosticDomain> execute(String userEmail);
}
