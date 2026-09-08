package com.curitiba360.curitiba360_api.repository;

import com.curitiba360.curitiba360_api.model.Agency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AgencyRepository extends JpaRepository<Agency, Long> {
    Optional<Agency> findByCnpj(String cnpj);
    Optional<Agency> findByCadastur(String cadastur);
    List<Agency> findByStatus(String status);
    List<Agency> findAllByOrderByCreatedAtDesc();
}
