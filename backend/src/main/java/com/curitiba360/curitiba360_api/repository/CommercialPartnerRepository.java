package com.curitiba360.curitiba360_api.repository;

import com.curitiba360.curitiba360_api.model.CommercialPartner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CommercialPartnerRepository extends JpaRepository<CommercialPartner, Long> {
    Optional<CommercialPartner> findByCnpj(String cnpj);
    List<CommercialPartner> findByStatus(String status);
    List<CommercialPartner> findAllByOrderByCreatedAtDesc();
}
