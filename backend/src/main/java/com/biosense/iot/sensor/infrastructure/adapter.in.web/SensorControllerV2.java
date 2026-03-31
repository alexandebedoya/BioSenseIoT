package com.biosense.iot.sensor.infrastructure.adapter.in.web;

import com.biosense.iot.dto.SensorReadingRequest;
import com.biosense.iot.sensor.domain.port.in.IngestSensorReadingUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/v2/sensors")
@RequiredArgsConstructor
public class SensorControllerV2 {

    private final IngestSensorReadingUseCase ingestSensorReadingUseCase;

    @PostMapping("/reading")
    public Mono<ResponseEntity<Object>> receiveReading(@RequestBody SensorReadingRequest request) {
        return ingestSensorReadingUseCase.execute(
                request.getMacAddress(),
                request.getMq4(),
                request.getMq7(),
                request.getMq135()
        )
        .map(reading -> ResponseEntity.ok((Object) Map.of(
                "status", "success", 
                "id", reading.getId(),
                "airQualityState", reading.getAirQualityState()
        )))
        .onErrorResume(e -> Mono.just(ResponseEntity.internalServerError().body((Object) Map.of("error", e.getMessage()))));
    }
}
