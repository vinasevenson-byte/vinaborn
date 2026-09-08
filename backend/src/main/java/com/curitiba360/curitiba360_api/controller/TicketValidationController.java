package com.curitiba360.curitiba360_api.controller;

import com.curitiba360.curitiba360_api.model.TicketItem;
import com.curitiba360.curitiba360_api.repository.TicketItemRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketValidationController {

    private final TicketItemRepository ticketItemRepository;

    @PostMapping("/validate")
    public ResponseEntity<?> validateTicket(@RequestBody ValidateTicketRequest request) {
        if (request.getVoucherCode() == null || request.getVoucherCode().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "valid", false,
                    "message", "Código do voucher não informado"
            ));
        }

        var optionalTicket = ticketItemRepository.findByVoucherCode(request.getVoucherCode().trim());

        if (optionalTicket.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "valid", false,
                    "message", "Voucher não encontrado no sistema. Verifique a digitação ou procure a bilheteria."
            ));
        }

        TicketItem ticket = optionalTicket.get();

        // 1. Verificação de Atração (RN-025.02)
        if (request.getAttractionId() != null && ticket.getAttraction() != null) {
            if (!ticket.getAttraction().getId().equals(request.getAttractionId())) {
                return ResponseEntity.badRequest().body(Map.of(
                        "valid", false,
                        "message", "ATENÇÃO: Ingresso emitido para outra atração (" + ticket.getAttraction().getName() + "). Entrada Não Autorizada nesta catraca!",
                        "ticket", ticket
                ));
            }
        }

        // 2. Verificação de Status: Já Utilizado
        if ("USED".equalsIgnoreCase(ticket.getStatus())) {
            return ResponseEntity.badRequest().body(Map.of(
                    "valid", false,
                    "message", "ALERTA DE DUPLICIDADE: Este ingresso JÁ FOI UTILIZADO em " +
                            (ticket.getUsedAt() != null ? ticket.getUsedAt() : "horário anterior") +
                            " no ponto " + (ticket.getValidatedBy() != null ? ticket.getValidatedBy() : "Portaria"),
                    "ticket", ticket
            ));
        }

        // 3. Verificação de Status: Cancelado / Estornado
        if ("CANCELLED".equalsIgnoreCase(ticket.getStatus())) {
            return ResponseEntity.badRequest().body(Map.of(
                    "valid", false,
                    "message", "INGRESSO CANCELADO / REEMBOLSADO. Entrada Negada.",
                    "ticket", ticket
            ));
        }

        // 4. Verificação de Data de Visita (se configurada)
        if (ticket.getVisitDate() != null) {
            LocalDate today = LocalDate.now();
            if (ticket.getVisitDate().isBefore(today)) {
                return ResponseEntity.badRequest().body(Map.of(
                        "valid", false,
                        "message", "INGRESSO EXPIRADO: A data agendada para visitação era " + ticket.getVisitDate(),
                        "ticket", ticket
                ));
            }
        }

        // 5. Sucesso: Marcar atomicamente como utilizado
        ticket.setStatus("USED");
        ticket.setUsedAt(LocalDateTime.now());
        ticket.setValidatedBy(request.getValidatorName() != null ? request.getValidatorName() : "Catraca Principal");
        ticketItemRepository.save(ticket);

        return ResponseEntity.ok(Map.of(
                "valid", true,
                "message", "INGRESSO VÁLIDO! Entrada Autorizada.",
                "ticket", ticket
        ));
    }

    @GetMapping("/validate/stats")
    public ResponseEntity<?> getValidationStats(@RequestParam(required = false) Long attractionId) {
        List<TicketItem> tickets = ticketItemRepository.findAll();

        long totalUsed = tickets.stream()
                .filter(t -> "USED".equalsIgnoreCase(t.getStatus()))
                .filter(t -> attractionId == null || (t.getAttraction() != null && t.getAttraction().getId().equals(attractionId)))
                .count();

        long totalValid = tickets.stream()
                .filter(t -> "VALID".equalsIgnoreCase(t.getStatus()))
                .filter(t -> attractionId == null || (t.getAttraction() != null && t.getAttraction().getId().equals(attractionId)))
                .count();

        long totalCancelled = tickets.stream()
                .filter(t -> "CANCELLED".equalsIgnoreCase(t.getStatus()))
                .filter(t -> attractionId == null || (t.getAttraction() != null && t.getAttraction().getId().equals(attractionId)))
                .count();

        return ResponseEntity.ok(Map.of(
                "totalUsed", totalUsed,
                "totalValid", totalValid,
                "totalCancelled", totalCancelled,
                "totalIssued", tickets.size()
        ));
    }

    @PostMapping("/validate/batch-sync")
    public ResponseEntity<?> syncOfflineValidations(@RequestBody List<OfflineValidationRecord> records) {
        List<Map<String, Object>> results = new ArrayList<>();

        for (OfflineValidationRecord record : records) {
            var optionalTicket = ticketItemRepository.findByVoucherCode(record.getVoucherCode());
            if (optionalTicket.isPresent()) {
                TicketItem ticket = optionalTicket.get();
                if ("VALID".equalsIgnoreCase(ticket.getStatus())) {
                    ticket.setStatus("USED");
                    ticket.setUsedAt(record.getValidatedAt() != null ? record.getValidatedAt() : LocalDateTime.now());
                    ticket.setValidatedBy(record.getValidatorName() != null ? record.getValidatorName() : "Contingência Offline");
                    ticketItemRepository.save(ticket);
                    results.add(Map.of("code", record.getVoucherCode(), "synced", true));
                } else {
                    results.add(Map.of("code", record.getVoucherCode(), "synced", false, "reason", "Status anterior: " + ticket.getStatus()));
                }
            } else {
                results.add(Map.of("code", record.getVoucherCode(), "synced", false, "reason", "Voucher não encontrado"));
            }
        }

        return ResponseEntity.ok(Map.of(
                "syncedCount", results.stream().filter(r -> Boolean.TRUE.equals(r.get("synced"))).count(),
                "details", results
        ));
    }

    @Data
    public static class ValidateTicketRequest {
        private String voucherCode;
        private String validatorName;
        private Long attractionId;
    }

    @Data
    public static class OfflineValidationRecord {
        private String voucherCode;
        private String validatorName;
        private LocalDateTime validatedAt;
    }
}
