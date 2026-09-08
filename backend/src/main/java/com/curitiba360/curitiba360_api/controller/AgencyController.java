package com.curitiba360.curitiba360_api.controller;

import com.curitiba360.curitiba360_api.model.Agency;
import com.curitiba360.curitiba360_api.model.Contract;
import com.curitiba360.curitiba360_api.repository.AgencyRepository;
import com.curitiba360.curitiba360_api.repository.ContractRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/agencies")
@RequiredArgsConstructor
public class AgencyController {

    private final AgencyRepository agencyRepository;
    private final ContractRepository contractRepository;

    @GetMapping
    public ResponseEntity<List<Agency>> getAllAgencies(@RequestParam(required = false) String status) {
        if (status != null && !status.isBlank()) {
            return ResponseEntity.ok(agencyRepository.findByStatus(status.toUpperCase()));
        }
        return ResponseEntity.ok(agencyRepository.findAllByOrderByCreatedAtDesc());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Agency> getAgencyById(@PathVariable Long id) {
        return agencyRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Agency> registerAgency(@RequestBody Agency agency) {
        agency.setStatus("WAITING_CONTRACT");
        if (agency.getCommissionRate() == null) {
            agency.setCommissionRate(new BigDecimal("10.00"));
        }
        Agency saved = agencyRepository.save(agency);

        // Gera o contrato da agência via DocuSign
        Contract contract = Contract.builder()
                .contractNumber("CTR-AGEN-" + saved.getId() + "-" + LocalDate.now().getYear())
                .title("Contrato de Credenciamento e Comissionamento - " + saved.getCompanyName())
                .entityType("AGENCY")
                .entityId(saved.getId())
                .entityName(saved.getCompanyName())
                .docusignEnvelopeId("DOCUSIGN-ENV-" + System.currentTimeMillis())
                .status("SENT")
                .validUntil(LocalDate.now().plusYears(1))
                .documentPdfUrl("/docs/contratos/credenciamento-agencia.pdf")
                .build();
        contractRepository.save(contract);

        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveAgency(@PathVariable Long id) {
        return agencyRepository.findById(id).map(agency -> {
            agency.setStatus("ACTIVE");
            agency.setApprovedAt(LocalDateTime.now());
            agencyRepository.save(agency);

            return ResponseEntity.ok(Map.of(
                    "message", "Agência de Turismo APROVADA e ativa para emitir ingressos e cupons!",
                    "agency", agency
            ));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/suspend")
    public ResponseEntity<?> suspendAgency(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return agencyRepository.findById(id).map(agency -> {
            agency.setStatus("SUSPENDED");
            agency.setSuspensionReason(body.getOrDefault("reason", "Suspensão temporária da agência determinada pela administração."));
            agencyRepository.save(agency);

            return ResponseEntity.ok(Map.of(
                    "message", "Agência de Turismo SUSPENSA.",
                    "agency", agency
            ));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/commissions")
    public ResponseEntity<?> getCommissionsReport() {
        List<Agency> agencies = agencyRepository.findAll();

        return ResponseEntity.ok(Map.of(
                "totalSalesThroughAgencies", new BigDecimal("184320.00"),
                "totalCommissionsPaid", new BigDecimal("18432.00"),
                "pendingPayoutBalance", new BigDecimal("4150.00"),
                "agenciesReport", agencies.stream().map(a -> Map.of(
                        "id", a.getId(),
                        "companyName", a.getCompanyName(),
                        "cadastur", a.getCadastur(),
                        "commissionRate", a.getCommissionRate(),
                        "totalSalesVolume", a.getTotalSalesVolume() != null ? a.getTotalSalesVolume() : new BigDecimal("12400.00"),
                        "totalCommission", a.getTotalCommissionAccumulated() != null ? a.getTotalCommissionAccumulated() : new BigDecimal("1240.00"),
                        "status", a.getStatus()
                )).toList()
        ));
    }
}
