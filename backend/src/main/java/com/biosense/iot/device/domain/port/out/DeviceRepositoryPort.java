package com.biosense.iot.device.domain.port.out;

import com.biosense.iot.device.domain.model.DeviceDomain;
import reactor.core.publisher.Mono;

public interface DeviceRepositoryPort {
    Mono<String> findLastActiveMacAddress();
    Mono<DeviceDomain> linkDeviceToUser(String macAddress, Integer userId);
    Mono<Integer> findUserIdByEmail(String email);
}
