package com.curitiba360.curitiba360_api.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "anti_scalping_alerts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AntiScalpingAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    private String cpf;

    @Column(nullable = false, length = 150)
    private String customerName;

    @Column(length = 100)
    private String customerEmail;

    @Builder.Default
    private Integer purchasesThisMonth = 0; // Limite RN-038: máx 6 ingressos/mês

    @Builder.Default
    private Integer totalTransfers = 0; // Limite RN-038: máx 2 transferências/voucher

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String riskLevel = "MEDIUM"; // LOW, MEDIUM, HIGH, BLOCKED

    @Column(columnDefinition = "TEXT")
    private String triggerReason;

    @Builder.Default
    private boolean blocked = false;

    @Builder.Default
    private LocalDateTime flaggedAt = LocalDateTime.now();

    private LocalDateTime blockedAt;

    private String blockedBy;
}
