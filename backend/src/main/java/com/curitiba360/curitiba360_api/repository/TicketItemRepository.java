package com.curitiba360.curitiba360_api.repository;

import com.curitiba360.curitiba360_api.model.TicketItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TicketItemRepository extends JpaRepository<TicketItem, Long> {
    Optional<TicketItem> findByVoucherCode(String voucherCode);
    List<TicketItem> findByAttractionId(Long attractionId);
    long countByStatus(String status);
    long countByStatusAndAttractionId(String status, Long attractionId);
}
