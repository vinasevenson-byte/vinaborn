package com.curitiba360.curitiba360_api.repository;

import com.curitiba360.curitiba360_api.model.TicketBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TicketBatchRepository extends JpaRepository<TicketBatch, Long> {
    List<TicketBatch> findByCategoryId(Long categoryId);
}
