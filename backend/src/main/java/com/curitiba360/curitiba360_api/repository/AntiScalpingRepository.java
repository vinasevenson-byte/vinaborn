package com.curitiba360.curitiba360_api.repository;

import com.curitiba360.curitiba360_api.model.AntiScalpingAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AntiScalpingRepository extends JpaRepository<AntiScalpingAlert, Long> {
    Optional<AntiScalpingAlert> findByCpf(String cpf);
    List<AntiScalpingAlert> findByBlockedTrue();
    List<AntiScalpingAlert> findAllByOrderByFlaggedAtDesc();
}
