package com.biosense.iot.repository;

import com.biosense.iot.entity.SensorReading;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;

public interface SensorReadingRepository extends ReactiveCrudRepository<SensorReading, Long> {
    @Query("SELECT sr.* FROM sensor_readings sr " +
           "JOIN devices d ON sr.device_id = d.id " +
           "WHERE d.user_id = :userId " +
           "ORDER BY sr.timestamp DESC LIMIT 1")
    Mono<SensorReading> findLatestByUserId(Integer userId);
}
