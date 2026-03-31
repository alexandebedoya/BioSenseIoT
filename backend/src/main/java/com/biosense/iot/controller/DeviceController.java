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
     * Vincula un dispositivo (MAC) al usuario logueado.
     */
    @PostMapping("/link")
    public Mono<ResponseEntity<Object>> linkDevice(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> request) {
        
        String token = authHeader.replace("Bearer ", "");
        String email = jwtService.extractUsername(token);
        String macAddress = request.get("macAddress");

        return databaseClient.sql("SELECT id FROM users WHERE email = :email")
                .bind("email", email)
                .map(row -> row.get("id", Integer.class))
                .first()
                .flatMap(userId -> 
                    // Actualizamos el dispositivo para que pertenezca a este usuario
                    databaseClient.sql("UPDATE devices SET user_id = :userId WHERE mac_address = :mac")
                            .bind("userId", userId)
                            .bind("mac", macAddress)
                            .fetch()
                            .rowsUpdated()
                            .flatMap(rows -> {
                                if (rows == 0) {
                                    // Si el dispositivo no existe en la DB (nunca ha enviado datos), lo creamos
                                    return databaseClient.sql("INSERT INTO devices (mac_address, name, user_id) VALUES (:mac, 'Mi BioSense', :userId)")
                                            .bind("mac", macAddress)
                                            .bind("userId", userId)
                                            .then(Mono.just(ResponseEntity.ok((Object) Map.of("message", "Dispositivo creado y vinculado"))));
                                }
                                return Mono.just(ResponseEntity.ok((Object) Map.of("message", "Dispositivo vinculado exitosamente")));
                            })
                )
                .onErrorResume(e -> Mono.just(ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))));
    }
}
