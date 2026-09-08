package com.curitiba360.curitiba360_api.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "attractions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attraction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, unique = true, length = 220)
    private String slug;

    @Column(nullable = false, length = 500)
    private String summary;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 50)
    private String category;

    private String address;
    private String neighborhood;
    
    @Builder.Default
    private String city = "Curitiba";
    
    @Builder.Default
    private String state = "PR";

    private Double latitude;
    private Double longitude;

    @Column(length = 500)
    private String coverImageUrl;

    @Builder.Default
    private boolean featured = false;

    @Builder.Default
    private boolean active = true;

    @Builder.Default
    private Double googleRating = 4.8;

    @Builder.Default
    private Integer reviewsCount = 1250;

    private BigDecimal ticketStartingPrice;

    @OneToMany(mappedBy = "attraction", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<TicketCategory> categories = new ArrayList<>();

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
