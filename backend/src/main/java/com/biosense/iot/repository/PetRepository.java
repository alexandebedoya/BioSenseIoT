package com.biosense.iot.repository;

import com.biosense.iot.entity.Pet;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

public interface PetRepository extends ReactiveCrudRepository<Pet, Integer> {
    Flux<Pet> findAllByUserId(Integer userId);
}
