package com.biosense.iot.sensor.domain.port.out;

import reactor.core.publisher.Mono;

public interface DeviceRepositoryPort {
    Mono<Integer> getOrCreateDeviceId(String macAddress);
}
