package com.biosense.iot.device.infrastructure.adapter.in.web;

import com.biosense.iot.auth.infrastructure.security.jwt.JwtAdapter;
import com.biosense.iot.device.domain.port.in.LinkDeviceUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/v2/devices")
@RequiredArgsConstructor
public class DeviceControllerV2 {

    private final LinkDeviceUseCase linkDeviceUseCase;
    private final JwtAdapter jwtAdapter;

    @PostMapping("/link-auto")
    public Mono<ResponseEntity<Object>> linkDeviceAuto(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtAdapter.extractUsername(token);

        return linkDeviceUseCase.execute(email)
                .map(device -> ResponseEntity.ok((Object) Map.of(
                        "status", "success",
                        "message", "Dispositivo sincronizado con éxito",
                        "mac", device.getMacAddress()
                )))
                .onErrorResume(e -> Mono.just(ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))));
    }
}
