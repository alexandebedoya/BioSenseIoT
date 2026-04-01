package com.biosense.iot.device.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeviceDomain {
    private Integer id;
    private String macAddress;
    private String name;
    private Integer userId;
}
