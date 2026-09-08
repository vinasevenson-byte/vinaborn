package com.curitiba360.curitiba360_api.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "contracts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String contractNumber; // CTR-2026-0042

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 30)
    private String entityType; // PARTNER ou AGENCY

    @Column(nullable = false)
    private Long entityId;

    @Column(nullable = false, length = 150)
    private String entityName;

    @Column(length = 100)
    private String docusignEnvelopeId;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "SENT"; // DRAFT, SENT, SIGNED, ACTIVE, CANCELLED

    private LocalDate signedDate;
    private LocalDate validUntil;

    @Column(length = 500)
    private String documentPdfUrl;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
