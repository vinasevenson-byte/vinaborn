package com.curitiba360.curitiba360_api.controller;

import com.curitiba360.curitiba360_api.model.Coupon;
import com.curitiba360.curitiba360_api.repository.CouponRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponRepository couponRepository;

    @GetMapping
    public ResponseEntity<List<Coupon>> getAllCoupons() {
        return ResponseEntity.ok(couponRepository.findAllByOrderByCreatedAtDesc());
    }

    @PostMapping
    public ResponseEntity<Coupon> createCoupon(@RequestBody Coupon coupon) {
        if (coupon.getCode() != null) {
            coupon.setCode(coupon.getCode().toUpperCase().trim());
        }
        Coupon saved = couponRepository.save(coupon);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validateCoupon(@RequestBody ValidateCouponRequest request) {
        if (request.getCode() == null || request.getCode().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("valid", false, "message", "Código do cupom não informado"));
        }

        var optionalCoupon = couponRepository.findByCodeAndActiveTrue(request.getCode().toUpperCase().trim());

        if (optionalCoupon.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("valid", false, "message", "Cupom inválido ou expirado"));
        }

        Coupon coupon = optionalCoupon.get();

        if (coupon.getMaxUses() != null && coupon.getUsedCount() >= coupon.getMaxUses()) {
            return ResponseEntity.badRequest().body(Map.of("valid", false, "message", "Este cupom já atingiu o limite máximo de utilizações"));
        }

        return ResponseEntity.ok(Map.of(
                "valid", true,
                "code", coupon.getCode(),
                "discountType", coupon.getDiscountType(),
                "discountValue", coupon.getDiscountValue(),
                "agencyName", coupon.getAgencyName() != null ? coupon.getAgencyName() : "",
                "message", "Cupom aplicado com sucesso!"
        ));
    }

    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleCouponStatus(@PathVariable Long id) {
        return couponRepository.findById(id)
                .map(coupon -> {
                    coupon.setActive(!coupon.isActive());
                    couponRepository.save(coupon);
                    return ResponseEntity.ok(coupon);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCoupon(@PathVariable Long id) {
        return couponRepository.findById(id)
                .map(coupon -> {
                    couponRepository.delete(coupon);
                    return ResponseEntity.ok(Map.of("message", "Cupom removido com sucesso"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @Data
    public static class ValidateCouponRequest {
        private String code;
        private BigDecimal purchaseAmount;
    }
}
