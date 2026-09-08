package com.curitiba360.curitiba360_api.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "commercial_partners")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommercialPartner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String companyName; // Razão Social

    @Column(length = 200)
    private String tradeName; // Nome Fantasia

    @Column(nullable = false, unique = true, length = 18)
    private String cnpj;

    @Column(nullable = false, length = 150)
    private String contactPerson;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(nullable = false, length = 20)
    private String phone;

    private String address;
    private String city;
    private String state;

    // Dados Bancários para Repasse
    private String bankName;
    private String bankAgency;
    private String bankAccount;
    private String pixKey;

    @Column(length = 50)
    private String ga4MeasurementId; // Google Analytics 4

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "PENDING_APPROVAL"; // PENDING_APPROVAL, ACTIVE, SUSPENDED, REJECTED

    @Column(length = 500)
    private String suspensionReason;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime approvedAt;
    private String approvedBy;
}
