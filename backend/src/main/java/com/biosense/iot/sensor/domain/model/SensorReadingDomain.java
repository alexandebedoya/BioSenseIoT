package com.biosense.iot.sensor.domain.model;

import java.time.Instant;

public class SensorReadingDomain {
    private Long id;
    private Integer deviceId;
    private Double mq4;   // Metano
    private Double mq7;   // Monóxido de Carbono
    private Double mq135; // Calidad del Aire (Amoniaco, Alcohol, Humo)
    private Instant timestamp;

    public enum AirQualityState {
        CLEAN, WARNING, DANGER
    }

    public SensorReadingDomain(Integer deviceId, Double mq4, Double mq7, Double mq135) {
        this.deviceId = deviceId;
        this.mq4 = mq4;
        this.mq7 = mq7;
        this.mq135 = mq135;
        this.timestamp = Instant.now();
    }

    // Lógica de Negocio: Determinación de estado basada en umbrales
    public AirQualityState getAirQualityState() {
        if (mq7 > 200 || mq135 > 400) return AirQualityState.DANGER;
        if (mq7 > 100 || mq135 > 200) return AirQualityState.WARNING;
        return AirQualityState.CLEAN;
    }

    // Getters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getDeviceId() { return deviceId; }
    public Double getMq4() { return mq4; }
    public Double getMq7() { return mq7; }
    public Double getMq135() { return mq135; }
    public Instant getTimestamp() { return timestamp; }
}
