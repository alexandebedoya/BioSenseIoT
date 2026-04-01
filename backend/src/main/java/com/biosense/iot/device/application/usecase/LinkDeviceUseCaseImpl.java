package com.biosense.iot.device.application.usecase;

import com.biosense.iot.device.domain.model.DeviceDomain;
import com.biosense.iot.device.domain.port.in.LinkDeviceUseCase;
import com.biosense.iot.device.domain.port.out.DeviceRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class LinkDeviceUseCaseImpl implements LinkDeviceUseCase {

    private final DeviceRepositoryPort deviceRepositoryPort;

    @Override
    public Mono<DeviceDomain> execute(String userEmail) {
        return deviceRepositoryPort.findUserIdByEmail(userEmail)
                .flatMap(userId -> deviceRepositoryPort.findLastActiveMacAddress()
                        .flatMap(mac -> deviceRepositoryPort.linkDeviceToUser(mac, userId)));
    }
}
