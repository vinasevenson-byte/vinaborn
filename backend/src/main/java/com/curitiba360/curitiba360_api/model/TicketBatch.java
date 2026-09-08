package com.curitiba360.curitiba360_api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "ticket_batches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketBatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    @JsonIgnore
    private TicketCategory category;

    @Column(nullable = false, length = 50)
    private String name; // ex: "1º Lote", "Lote Promocional"

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(precision = 10, scale = 2)
    private BigDecimal originalPrice;

    @Column(nullable = false)
    private Integer totalQuantity;

    @Column(nullable = false)
    private Integer availableQuantity;

    @Builder.Default
    private boolean active = true;

    public Long getCategoryId() {
        return category != null ? category.getId() : null;
    }

    public String getCategoryName() {
        return category != null ? category.getName() : null;
    }

    public String getAttractionName() {
        return (category != null && category.getAttraction() != null) ? category.getAttraction().getName() : null;
    }
}
