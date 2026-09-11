package com.curitiba360.curitiba360_api.controller;

import com.curitiba360.curitiba360_api.model.CommercialPartner;
import com.curitiba360.curitiba360_api.model.Contract;
import com.curitiba360.curitiba360_api.repository.CommercialPartnerRepository;
import com.curitiba360.curitiba360_api.repository.ContractRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/partners")
@RequiredArgsConstructor
public class CommercialPartnerController {

    private final CommercialPartnerRepository partnerRepository;
    private final ContractRepository contractRepository;

    @GetMapping
    public ResponseEntity<List<CommercialPartner>> getAllPartners(@RequestParam(required = false) String status) {
        if (status != null && !status.isBlank()) {
            return ResponseEntity.ok(partnerRepository.findByStatus(status.toUpperCase()));
        }
        return ResponseEntity.ok(partnerRepository.findAllByOrderByCreatedAtDesc());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommercialPartner> getPartnerById(@PathVariable Long id) {
        return partnerRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CommercialPartner> createPartner(@RequestBody CommercialPartner partner) {
        partner.setStatus("PENDING_APPROVAL");
        CommercialPartner saved = partnerRepository.save(partner);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approvePartner(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        return partnerRepository.findById(id).map(partner -> {
            partner.setStatus("ACTIVE");
            partner.setApprovedAt(LocalDateTime.now());
            partner.setApprovedBy("Administrador");
            partnerRepository.save(partner);

            // Gera contrato automático de parceria
            Contract contract = Contract.builder()
                    .contractNumber("CTR-PARC-" + partner.getId() + "-" + LocalDate.now().getYear())
                    .title("Termo de Parceria e Comercialização - " + partner.getCompanyName())
                    .entityType("PARTNER")
                    .entityId(partner.getId())
                    .entityName(partner.getCompanyName())
                    .docusignEnvelopeId("DOCUSIGN-ENV-" + System.currentTimeMillis())
                    .status("ACTIVE")
                    .signedDate(LocalDate.now())
                    .validUntil(LocalDate.now().plusYears(1))
                    .documentPdfUrl("/docs/contratos/termo-parceria-padrao.pdf")
                    .build();
            contractRepository.save(contract);

            return ResponseEntity.ok(Map.of(
                    "message", "Parceiro Comercial APROVADO com sucesso! Contrato gerado.",
                    "partner", partner,
                    "contract", contract
            ));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/suspend")
    public ResponseEntity<?> suspendPartner(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return partnerRepository.findById(id).map(partner -> {
            partner.setStatus("SUSPENDED");
            partner.setSuspensionReason(body.getOrDefault("reason", "Suspensão temporária determinada pela administração."));
            partnerRepository.save(partner);
            return ResponseEntity.ok(Map.of(
                    "message", "Parceiro Comercial SUSPENSO.",
                    "partner", partner
            ));
        }).orElse(ResponseEntity.notFound().build());
    }
}
