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
@Table("sensor_readings")
public class SensorReading {
    @Id
    private Long id;
    private Integer deviceId;
    private Double mq4Value;
    private Double mq7Value;
    private Double mq135Value;
    private Instant timestamp;
}
