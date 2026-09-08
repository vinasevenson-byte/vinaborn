package com.curitiba360.curitiba360_api.repository;

import com.curitiba360.curitiba360_api.model.TicketCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketCategoryRepository extends JpaRepository<TicketCategory, Long> {
    List<TicketCategory> findByAttractionId(Long attractionId);
}
