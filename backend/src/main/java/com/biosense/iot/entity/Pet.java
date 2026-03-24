package com.biosense.iot.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("pets")
public class Pet {
    @Id
    private Integer id;
    private Integer userId;
    private String name;
    private String species;
    private String breed;
    private String vulnerabilities;
    private Instant createdAt;
}
