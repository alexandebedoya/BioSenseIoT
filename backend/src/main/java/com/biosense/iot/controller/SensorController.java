package com.biosense.iot.controller;

import com.biosense.iot.dto.SensorReadingRequest;
import com.biosense.iot.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import org.springframework.r2dbc.core.DatabaseClient;

import java.util.Map;

@RestController
@RequestMapping("/api/sensors")
@RequiredArgsConstructor
public class SensorController {

    private final DatabaseClient databaseClient;

    /**
     * Endpoint para que el ESP32 envíe sus lecturas directamente.
     */
    @PostMapping("/reading")
    public Mono<ResponseEntity<Object>> receiveReading(@RequestBody SensorReadingRequest request) {
        // 1. Buscar el device_id basado en la MAC o crearlo si no existe (Upsert simplificado)
        return databaseClient.sql("SELECT id FROM devices WHERE mac_address = :mac")
                .bind("mac", request.getMacAddress())
                .map(row -> row.get("id", Integer.class))
                .first()
                .flatMap(deviceId -> saveReading(deviceId, request))
                .switchIfEmpty(
                    // Si el dispositivo no existe, lo creamos vinculado a un usuario por defecto (el ID 1) para pruebas
                    databaseClient.sql("INSERT INTO devices (mac_address, name, user_id) VALUES (:mac, 'ESP32 Sensor', 1) RETURNING id")
                        .bind("mac", request.getMacAddress())
                        .map(row -> row.get("id", Integer.class))
                        .first()
                        .flatMap(newDeviceId -> saveReading(newDeviceId, request))
                )
                .map(id -> ResponseEntity.ok((Object) Map.of("status", "success", "id", id)))
                .onErrorResume(e -> Mono.just(ResponseEntity.internalServerError().body((Object) Map.of("error", e.getMessage()))));
    }

    private Mono<Long> saveReading(Integer deviceId, SensorReadingRequest request) {
        return databaseClient.sql("INSERT INTO sensor_readings (device_id, mq4_value, mq7_value, mq135_value) VALUES (:did, :mq4, :mq7, :mq135) RETURNING id")
                .bind("did", deviceId)
                .bind("mq4", request.getMq4())
                .bind("mq7", request.getMq7())
                .bind("mq135", request.getMq135())
                .map(row -> row.get("id", Long.class))
                .first();
    }
}
