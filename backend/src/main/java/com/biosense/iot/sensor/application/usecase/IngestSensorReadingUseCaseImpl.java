package com.biosense.iot.sensor.application.usecase;

import com.biosense.iot.sensor.domain.model.SensorReadingDomain;
import com.biosense.iot.sensor.domain.port.in.IngestSensorReadingUseCase;
import com.biosense.iot.sensor.domain.port.out.DeviceRepositoryPort;
import com.biosense.iot.sensor.domain.port.out.SensorReadingRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class IngestSensorReadingUseCaseImpl implements IngestSensorReadingUseCase {

    private static final Logger log = LoggerFactory.getLogger(IngestSensorReadingUseCaseImpl.class);
    
    private final DeviceRepositoryPort deviceRepositoryPort;
    private final SensorReadingRepositoryPort sensorReadingRepositoryPort;

    @Override
    public Mono<SensorReadingDomain> execute(String macAddress, Double mq4, Double mq7, Double mq135) {
        return deviceRepositoryPort.getOrCreateDeviceId(macAddress)
                .flatMap(deviceId -> {
                    SensorReadingDomain reading = new SensorReadingDomain(deviceId, mq4, mq7, mq135);
                    
                    // Lógica de negocio: Notificar si el aire es peligroso
                    if (reading.getAirQualityState() == SensorReadingDomain.AirQualityState.DANGER) {
                        log.warn("¡ALERTA! Calidad del aire peligrosa detectada en dispositivo {}", macAddress);
                    }
                    
                    return sensorReadingRepositoryPort.save(reading);
                });
    }
}
