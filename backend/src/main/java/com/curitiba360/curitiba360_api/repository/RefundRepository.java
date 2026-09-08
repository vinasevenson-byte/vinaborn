package com.curitiba360.curitiba360_api.repository;

import com.curitiba360.curitiba360_api.model.RefundRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RefundRepository extends JpaRepository<RefundRequest, Long> {
    Optional<RefundRequest> findByProtocolNumber(String protocolNumber);
    List<RefundRequest> findByStatusOrderByRequestedAtDesc(String status);
    List<RefundRequest> findAllByOrderByRequestedAtDesc();
}
