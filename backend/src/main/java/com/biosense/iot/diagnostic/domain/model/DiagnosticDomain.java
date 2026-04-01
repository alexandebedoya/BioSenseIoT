package com.biosense.iot.diagnostic.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiagnosticDomain {
    private String diagnosticText;
    private String severity;
    private String recommendation;
    private Instant timestamp;
    private Double mq4;
    private Double mq7;
    private Double mq135;
}
