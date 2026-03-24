package com.biosense.iot.controller;

import com.biosense.iot.dto.DiagnosticResponse;
import com.biosense.iot.repository.AiDiagnosticRepository;
import com.biosense.iot.repository.SensorReadingRepository;
import com.biosense.iot.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/diagnostics")
@RequiredArgsConstructor
public class DiagnosticController {

    private final AiDiagnosticRepository diagnosticRepository;
    private final SensorReadingRepository readingRepository;
    private final UserRepository userRepository;

    @GetMapping("/latest")
    public Mono<DiagnosticResponse> getLatestDiagnostic() {
        return ReactiveSecurityContextHolder.getContext()
                .map(sc -> (Jwt) sc.getAuthentication().getPrincipal())
                .flatMap(jwt -> {
                    String email = jwt.getSubject();
                    return userRepository.findByEmail(email);
                })
                .flatMap(user -> diagnosticRepository.findFirstByUserIdOrderByTimestampDesc(user.getId()))
                .flatMap(diagnostic -> readingRepository.findById(diagnostic.getReadingId())
                        .map(reading -> DiagnosticResponse.builder()
                                .diagnosticText(diagnostic.getDiagnosticText())
                                .severity(diagnostic.getSeverity())
                                .recommendation(diagnostic.getRecommendation())
                                .timestamp(diagnostic.getTimestamp())
                                .mq4(reading.getMq4Value())
                                .mq7(reading.getMq7Value())
                                .mq135(reading.getMq135Value())
                                .build()))
                .switchIfEmpty(Mono.error(new RuntimeException("No diagnostics found for user")));
    }
}
