package com.biosense.iot.diagnostic.domain.port.out;

import com.biosense.iot.diagnostic.domain.model.DiagnosticDomain;
import reactor.core.publisher.Mono;

public interface DiagnosticRepositoryPort {
    Mono<DiagnosticDomain> findLatestByUserId(Integer userId);
    Mono<Integer> findUserIdByEmail(String email);
}
