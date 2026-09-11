package com.curitiba360.curitiba360_api.repository;

import com.curitiba360.curitiba360_api.model.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {
    Optional<Contract> findByContractNumber(String contractNumber);
    List<Contract> findByEntityTypeAndEntityId(String entityType, Long entityId);
    List<Contract> findByStatus(String status);
    List<Contract> findAllByOrderByCreatedAtDesc();
}
