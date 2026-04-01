package com.biosense.iot.device.infrastructure.adapter.out.persistence;

import com.biosense.iot.device.domain.model.DeviceDomain;
import com.biosense.iot.device.domain.port.out.DeviceRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class R2dbcDeviceRepositoryAdapter implements DeviceRepositoryPort {

    private final DatabaseClient databaseClient;

    @Override
    public Mono<String> findLastActiveMacAddress() {
        return databaseClient.sql("SELECT d.mac_address FROM devices d " +
                         "JOIN sensor_readings sr ON d.id = sr.device_id " +
                         "WHERE sr.id = (SELECT MAX(id) FROM sensor_readings) " +
                         "LIMIT 1")
                .map(row -> row.get("mac_address", String.class))
                .first();
    }

    @Override
    public Mono<DeviceDomain> linkDeviceToUser(String macAddress, Integer userId) {
        return databaseClient.sql("UPDATE devices SET user_id = :userId, name = 'Mi BioSense' WHERE mac_address = :mac")
                .bind("userId", userId)
                .bind("mac", macAddress)
                .fetch()
                .rowsUpdated()
                .flatMap(rows -> databaseClient.sql("SELECT id, mac_address, name, user_id FROM devices WHERE mac_address = :mac")
                        .bind("mac", macAddress)
                        .map(row -> DeviceDomain.builder()
                                .id(row.get("id", Integer.class))
                                .macAddress(row.get("mac_address", String.class))
                                .name(row.get("name", String.class))
                                .userId(row.get("user_id", Integer.class))
                                .build())
                        .first());
    }

    @Override
    public Mono<Integer> findUserIdByEmail(String email) {
        return databaseClient.sql("SELECT id FROM users WHERE email = :email")
                .bind("email", email)
                .map(row -> row.get("id", Integer.class))
                .first();
    }
}
