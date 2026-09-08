package com.curitiba360.curitiba360_api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "ticket_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnore
    private Order order;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "attraction_id", nullable = false)
    private Attraction attraction;

    @Column(nullable = false, unique = true, length = 36)
    private String voucherCode; // ex: VCH-CWB-7892-A1B2

    @Column(nullable = false, length = 150)
    private String holderName;

    @Column(length = 20)
    private String holderDocument;

    @Column(nullable = false, length = 100)
    private String categoryName; // "Inteira", "Meia-Entrada"

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    private LocalDate visitDate;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "VALID"; // VALID, USED, CANCELLED, TRANSFERRED

    private LocalDateTime usedAt;

    @Column(length = 100)
    private String validatedBy;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
