package com.biosense.iot.dto;

import com.biosense.iot.entity.Pet;
import com.biosense.iot.entity.SensorReading;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class DiagnosticContext {
    private SensorReading latestReading;
    private List<String> userConditions;
    private List<Pet> pets;
}
