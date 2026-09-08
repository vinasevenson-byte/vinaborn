package com.curitiba360.curitiba360_api.controller;

import com.curitiba360.curitiba360_api.model.TicketItem;
import com.curitiba360.curitiba360_api.repository.TicketItemRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketValidationController {

    private final TicketItemRepository ticketItemRepository;

    @PostMapping("/validate")
    public ResponseEntity<?> validateTicket(@RequestBody ValidateTicketRequest request) {
        var optionalTicket = ticketItemRepository.findByVoucherCode(request.getVoucherCode());

        if (optionalTicket.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "valid", false,
                    "message", "Voucher não encontrado no sistema"
            ));
        }

        TicketItem ticket = optionalTicket.get();

        if ("USED".equalsIgnoreCase(ticket.getStatus())) {
            return ResponseEntity.badRequest().body(Map.of(
                    "valid", false,
                    "message", "Atenção: Este ingresso JÁ FOI UTILIZADO em " + ticket.getUsedAt(),
                    "ticket", ticket
            ));
        }

        if ("CANCELLED".equalsIgnoreCase(ticket.getStatus())) {
            return ResponseEntity.badRequest().body(Map.of(
                    "valid", false,
                    "message", "Atenção: Este ingresso foi CANCELADO",
                    "ticket", ticket
            ));
        }

        // Marcar como utilizado
        ticket.setStatus("USED");
        ticket.setUsedAt(LocalDateTime.now());
        ticket.setValidatedBy(request.getValidatorName() != null ? request.getValidatorName() : "Operador");
        ticketItemRepository.save(ticket);

        return ResponseEntity.ok(Map.of(
                "valid", true,
                "message", "Ingresso VALIDADO COM SUCESSO! Entrada Liberada.",
                "ticket", ticket
        ));
    }

    @Data
    public static class ValidateTicketRequest {
        private String voucherCode;
        private String validatorName;
    }
}
