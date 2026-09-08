package com.curitiba360.curitiba360_api.repository;

import com.curitiba360.curitiba360_api.model.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {
    Optional<Coupon> findByCodeAndActiveTrue(String code);
    Optional<Coupon> findByCode(String code);
    List<Coupon> findByAttractionId(Long attractionId);
    List<Coupon> findByAgencyId(Long agencyId);
    List<Coupon> findAllByOrderByCreatedAtDesc();
}
