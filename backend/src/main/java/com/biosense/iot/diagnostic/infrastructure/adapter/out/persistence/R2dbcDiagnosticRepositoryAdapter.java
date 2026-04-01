package com.biosense.iot.diagnostic.infrastructure.adapter.out.persistence;

import com.biosense.iot.diagnostic.domain.model.DiagnosticDomain;
import com.biosense.iot.diagnostic.domain.port.out.DiagnosticRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.time.Instant;

@Component
@RequiredArgsConstructor
public class R2dbcDiagnosticRepositoryAdapter implements DiagnosticRepositoryPort {

    private final DatabaseClient databaseClient;

    @Override
    public Mono<DiagnosticDomain> findLatestByUserId(Integer userId) {
        return databaseClient.sql("SELECT ad.*, sr.mq4_value, sr.mq7_value, sr.mq135_value FROM ai_diagnostics ad " +
                         "JOIN sensor_readings sr ON ad.reading_id = sr.id " +
                         "WHERE ad.user_id = :userId " +
                         "ORDER BY ad.timestamp DESC LIMIT 1")
                .bind("userId", userId)
                .map(row -> DiagnosticDomain.builder()
                        .diagnosticText(row.get("diagnostic_text", String.class))
                        .severity(row.get("severity", String.class))
                        .recommendation(row.get("recommendation", String.class))
                        .timestamp(row.get("timestamp", Instant.class))
                        .mq4(row.get("mq4_value", Double.class))
                        .mq7(row.get("mq7_value", Double.class))
                        .mq135(row.get("mq135_value", Double.class))
                        .build())
                .first();
    }

    @Override
    public Mono<Integer> findUserIdByEmail(String email) {
        return databaseClient.sql("SELECT id FROM users WHERE email = :email")
                .bind("email", email)
                .map(row -> row.get("id", Integer.class))
                .first();
    }
}
