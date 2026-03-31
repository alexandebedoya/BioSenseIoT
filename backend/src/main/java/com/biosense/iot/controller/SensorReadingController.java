package com.biosense.iot.controller;

import com.biosense.iot.config.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/sensors")
@RequiredArgsConstructor
public class SensorReadingController {

    private final DatabaseClient databaseClient;
    private final JwtService jwtService;

    /**
     * Obtiene la última lectura del dispositivo del usuario logueado.
     */
    @GetMapping("/latest")
    public Mono<ResponseEntity<Object>> getLatestReading(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtService.extractUsername(token);

        return databaseClient.sql("SELECT id FROM users WHERE email = :email")
                .bind("email", email)
                .map(row -> row.get("id", Integer.class))
                .first()
                .flatMap(userId -> 
                    databaseClient.sql("SELECT sr.* FROM sensor_readings sr " +
                                     "JOIN devices d ON sr.device_id = d.id " +
                                     "WHERE d.user_id = :userId " +
                                     "ORDER BY sr.created_at DESC LIMIT 1")
                            .bind("userId", userId)
                            .map((row, metadata) -> Map.of(
                                "mq4", row.get("mq4_value", Double.class),
                                "mq7", row.get("mq7_value", Double.class),
                                "mq135", row.get("mq135_value", Double.class),
                                "deviceId", row.get("device_id", Integer.class)
                            ))
                            .first()
                )
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
}
