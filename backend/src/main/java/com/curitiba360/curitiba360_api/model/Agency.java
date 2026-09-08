package com.curitiba360.curitiba360_api.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "agencies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Agency {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String companyName;

    @Column(length = 200)
    private String tradeName;

    @Column(nullable = false, unique = true, length = 18)
    private String cnpj;

    @Column(nullable = false, length = 30)
    private String cadastur; // Registro no CADASTUR / Ministério do Turismo

    @Column(nullable = false, length = 150)
    private String contactPerson;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(nullable = false, length = 20)
    private String phone;

    private String address;
    private String city;
    private String state;

    // Dados Bancários e Comissionamento
    private String bankName;
    private String bankAgency;
    private String bankAccount;
    private String pixKey;

    @Column(nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal commissionRate = new BigDecimal("10.00"); // 10.00%

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "PENDING_APPROVAL"; // PENDING_APPROVAL, WAITING_CONTRACT, ACTIVE, SUSPENDED

    @Column(length = 500)
    private String suspensionReason;

    @Column(precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal totalSalesVolume = BigDecimal.ZERO;

    @Column(precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal totalCommissionAccumulated = BigDecimal.ZERO;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime approvedAt;
}
