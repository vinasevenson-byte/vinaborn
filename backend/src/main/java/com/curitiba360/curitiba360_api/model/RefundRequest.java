package com.curitiba360.curitiba360_api.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "refund_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefundRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String protocolNumber; // ex: RMB-2026-0041

    @Column(nullable = false, length = 30)
    private String orderNumber;

    @Column(length = 36)
    private String voucherCode;

    @Column(nullable = false, length = 150)
    private String customerName;

    @Column(nullable = false, length = 20)
    private String customerCpf;

    @Column(nullable = false, length = 100)
    private String customerEmail;

    @Column(length = 150)
    private String attractionName;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(columnDefinition = "TEXT")
    private String reason; // Motivo alegado pelo turista

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "PENDING_REVIEW"; // PENDING_REVIEW, APPROVED, REJECTED

    @Builder.Default
    private boolean withinLegalDeadline = false; // <= 7 dias do CDC

    private String paymentMethod; // PIX, CREDIT_CARD

    private String pixKey;

    private String reviewedBy;

    @Column(columnDefinition = "TEXT")
    private String decisionNotes;

    @Builder.Default
    private LocalDateTime requestedAt = LocalDateTime.now();

    private LocalDateTime reviewedAt;
}
