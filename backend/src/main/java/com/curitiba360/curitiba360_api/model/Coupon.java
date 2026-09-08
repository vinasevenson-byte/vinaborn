package com.curitiba360.curitiba360_api.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code; // ex: CURITIBA360, CWBTOURS15

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String discountType = "PERCENTAGE"; // PERCENTAGE ou FIXED

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal discountValue; // ex: 10.00 (10%) ou 15.00 (R$ 15)

    @Column(precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal minPurchaseAmount = BigDecimal.ZERO;

    private Long attractionId; // Nulo se for cupom global do portal
    private String attractionName;

    private Long agencyId; // Nulo se for cupom geral, preenchido se for cupom de agência (WF-024)
    private String agencyName;

    @Builder.Default
    private Integer maxUses = 500;

    @Builder.Default
    private Integer usedCount = 0;

    private LocalDate validFrom;
    private LocalDate validUntil;

    @Builder.Default
    private boolean active = true;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
