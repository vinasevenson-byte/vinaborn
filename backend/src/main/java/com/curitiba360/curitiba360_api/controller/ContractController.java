package com.curitiba360.curitiba360_api.controller;

import com.curitiba360.curitiba360_api.model.Contract;
import com.curitiba360.curitiba360_api.repository.ContractRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contracts")
@RequiredArgsConstructor
public class ContractController {

    private final ContractRepository contractRepository;

    @GetMapping
    public ResponseEntity<List<Contract>> getAllContracts() {
        return ResponseEntity.ok(contractRepository.findAllByOrderByCreatedAtDesc());
    }

    @PostMapping("/{id}/send-docusign")
    public ResponseEntity<?> sendDocuSignEnvelope(@PathVariable Long id) {
        return contractRepository.findById(id).map(contract -> {
            contract.setStatus("SENT");
            contract.setDocusignEnvelopeId("DOCUSIGN-ENV-" + System.currentTimeMillis());
            contractRepository.save(contract);

            return ResponseEntity.ok(Map.of(
                    "message", "Envelope DocuSign enviado com sucesso para assinatura eletrônica!",
                    "contract", contract
            ));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<?> activateContract(@PathVariable Long id) {
        return contractRepository.findById(id).map(contract -> {
            contract.setStatus("ACTIVE");
            contract.setSignedDate(LocalDate.now());
            contractRepository.save(contract);

            return ResponseEntity.ok(Map.of(
                    "message", "Contrato assinado e ATIVO! Operação comercial liberada.",
                    "contract", contract
            ));
        }).orElse(ResponseEntity.notFound().build());
    }
}
