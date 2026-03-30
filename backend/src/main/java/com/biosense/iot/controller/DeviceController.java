package com.biosense.iot.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/devices")
@RequiredArgsConstructor
public class DeviceController {

    private final DatabaseClient databaseClient;

    /**
     * Endpoint para vincular un dispositivo (basado en MAC) al usuario actual.
     */
    @PostMapping("/link")
    public Mono<ResponseEntity<Object>> linkDevice(@RequestBody Map<String, String> body) {
        String macAddress = body.get("macAddress");
        
        if (macAddress == null || macAddress.isEmpty()) {
            return Mono.just(ResponseEntity.badRequest().body(Map.of("error", "macAddress is required")));
        }

        return ReactiveSecurityContextHolder.getContext()
                .map(sc -> (Jwt) sc.getAuthentication().getPrincipal())
                .flatMap(jwt -> {
                    String email = jwt.getSubject();
                    
                    // 1. Obtener el ID del usuario
                    return databaseClient.sql("SELECT id FROM users WHERE email = :email")
                            .bind("email", email)
                            .map(row -> row.get("id", Integer.class))
                            .first()
                            .flatMap(userId -> 
                                // 2. Actualizar el dispositivo para vincularlo al usuario
                                // Usamos un Upsert por si el dispositivo no existe aún en la tabla devices
                                databaseClient.sql("INSERT INTO devices (mac_address, user_id, name) " +
                                                   "VALUES (:mac, :uid, 'Mi Sensor') " +
                                                   "ON CONFLICT (mac_address) DO UPDATE SET user_id = :uid")
                                        .bind("mac", macAddress)
                                        .bind("uid", userId)
                                        .fetch().rowsUpdated()
                            )
                            .map(updated -> ResponseEntity.ok((Object) Map.of("status", "success", "message", "Dispositivo vinculado correctamente")));
                })
                .onErrorResume(e -> Mono.just(ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()))));
    }
}
