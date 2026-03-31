package com.biosense.iot.controller;

import com.biosense.iot.config.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/devices")
@RequiredArgsConstructor
public class DeviceController {

    private final DatabaseClient databaseClient;
    private final JwtService jwtService;

    /**
     * Vincula automáticamente el último dispositivo activo. 
     * Si el dispositivo ya tenía dueño, se transfiere al nuevo usuario (basado en posesión física actual).
     */
    @PostMapping("/link-auto")
    public Mono<ResponseEntity<Object>> linkDeviceAuto(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtService.extractUsername(token);

        return databaseClient.sql("SELECT id FROM users WHERE email = :email")
                .bind("email", email)
                .map(row -> row.get("id", Integer.class))
                .first()
                .flatMap(userId -> 
                    // BUSCAR EL DISPOSITIVO QUE ENVIÓ DATOS EN LOS ÚLTIMOS 60 SEGUNDOS
                    databaseClient.sql("SELECT mac_address FROM sensor_readings sr " +
                                     "JOIN devices d ON sr.device_id = d.id " +
                                     "WHERE sr.created_at > NOW() - INTERVAL '60 seconds' " +
                                     "ORDER BY sr.created_at DESC LIMIT 1")
                            .map(row -> row.get("mac_address", String.class))
                            .first()
                            .flatMap(mac -> 
                                // Transferencia de propiedad: Cambiamos el user_id al nuevo usuario
                                databaseClient.sql("UPDATE devices SET user_id = :userId, name = 'Mi BioSense' WHERE mac_address = :mac")
                                        .bind("userId", userId)
                                        .bind("mac", mac)
                                        .then()
                                        .then(Mono.just(ResponseEntity.ok((Object) Map.of(
                                            "status", "success",
                                            "message", "Dispositivo reclamado y vinculado: " + mac
                                        ))))
                            )
                            .switchIfEmpty(Mono.just(ResponseEntity.status(404).body(Map.of("error", "No se detectó ningún BioSense activo. Enciéndelo y espera 10 segundos."))))
                )
                .onErrorResume(e -> Mono.just(ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))));
    }
}
