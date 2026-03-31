package com.biosense.iot.sensor.domain.port.out;

import com.biosense.iot.sensor.domain.model.SensorReadingDomain;
import reactor.core.publisher.Mono;

public interface SensorReadingRepositoryPort {
    Mono<SensorReadingDomain> save(SensorReadingDomain reading);
}
