package com.curitiba360.curitiba360_api.repository;

import com.curitiba360.curitiba360_api.model.Attraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttractionRepository extends JpaRepository<Attraction, Long> {
    Optional<Attraction> findBySlug(String slug);
    List<Attraction> findByFeaturedTrueAndActiveTrue();
    List<Attraction> findByActiveTrue();
    List<Attraction> findByCategoryAndActiveTrue(String category);
}
