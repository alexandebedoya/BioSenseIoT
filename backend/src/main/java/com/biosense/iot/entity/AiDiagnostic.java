package com.biosense.iot.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("ai_diagnostics")
public class AiDiagnostic {
    @Id
    private Integer id;
    private Integer userId;
    private Long readingId;
    private String diagnosticText;
    private String severity;
    private String recommendation;
    private Instant timestamp;
}
