package com.biosense.iot.repository;

import com.biosense.iot.entity.HealthCondition;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

public interface HealthConditionRepository extends ReactiveCrudRepository<HealthCondition, Integer> {
    @Query("SELECT hc.name FROM health_conditions hc " +
           "JOIN user_health_mapping uhm ON hc.id = uhm.condition_id " +
           "WHERE uhm.user_id = :userId")
    Flux<String> findNamesByUserId(Integer userId);
}
