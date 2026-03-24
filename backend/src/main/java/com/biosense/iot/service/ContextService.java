package com.biosense.iot.service;

import com.biosense.iot.dto.DiagnosticContext;
import com.biosense.iot.repository.HealthConditionRepository;
import com.biosense.iot.repository.PetRepository;
import com.biosense.iot.repository.SensorReadingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class ContextService {

    private final SensorReadingRepository sensorReadingRepository;
    private final HealthConditionRepository healthConditionRepository;
    private final PetRepository petRepository;

    /**
     * Consolidates data for AI diagnostics:
     * Latest reading + User health conditions + Pet data
     */
    public Mono<DiagnosticContext> getConsolidatedContext(Integer userId) {
        return Mono.zip(
                sensorReadingRepository.findLatestByUserId(userId),
                healthConditionRepository.findNamesByUserId(userId).collectList(),
                petRepository.findAllByUserId(userId).collectList()
        ).map(tuple -> DiagnosticContext.builder()
                .latestReading(tuple.getT1())
                .userConditions(tuple.getT2())
                .pets(tuple.getT3())
                .build());
    }
}
