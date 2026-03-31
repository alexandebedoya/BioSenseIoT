package com.biosense.iot.sensor.infrastructure.adapter.out.persistence;

import com.biosense.iot.sensor.domain.model.SensorReadingDomain;
import com.biosense.iot.sensor.domain.port.out.DeviceRepositoryPort;
import com.biosense.iot.sensor.domain.port.out.SensorReadingRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class R2dbcSensorRepositoryAdapter implements DeviceRepositoryPort, SensorReadingRepositoryPort {

    private final DatabaseClient databaseClient;

    @Override
    public Mono<Integer> getOrCreateDeviceId(String macAddress) {
        return databaseClient.sql("SELECT id FROM devices WHERE mac_address = :mac")
                .bind("mac", macAddress)
                .map(row -> row.get("id", Integer.class))
                .first()
                .switchIfEmpty(
                    databaseClient.sql("INSERT INTO devices (mac_address, name, user_id) VALUES (:mac, 'ESP32 Sensor', 1) RETURNING id")
                        .bind("mac", macAddress)
                        .map(row -> row.get("id", Integer.class))
                        .first()
                );
    }

    @Override
    public Mono<SensorReadingDomain> save(SensorReadingDomain reading) {
        return databaseClient.sql("INSERT INTO sensor_readings (device_id, mq4_value, mq7_value, mq135_value) VALUES (:did, :mq4, :mq7, :mq135) RETURNING id")
                .bind("did", reading.getDeviceId())
                .bind("mq4", reading.getMq4())
                .bind("mq7", reading.getMq7())
                .bind("mq135", reading.getMq135())
                .map(row -> row.get("id", Long.class))
                .first()
                .map(id -> {
                    reading.setId(id);
                    return reading;
                });
    }
}
