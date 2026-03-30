package com.biosense.iot.dto;

import lombok.Data;

@Data
public class SensorReadingRequest {
    private String macAddress; // Identificador del dispositivo
    private Double mq4;        // Gas Natural
    private Double mq7;        // Monóxido
    private Double mq135;      // Calidad de Aire
    private String status;     // Mensaje de estado (NUEVO)
}
