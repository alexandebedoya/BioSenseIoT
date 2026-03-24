package com.biosense.iot.repository;

import com.biosense.iot.entity.AiDiagnostic;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;

public interface AiDiagnosticRepository extends ReactiveCrudRepository<AiDiagnostic, Integer> {
    Mono<AiDiagnostic> findFirstByUserIdOrderByTimestampDesc(Integer userId);
}
