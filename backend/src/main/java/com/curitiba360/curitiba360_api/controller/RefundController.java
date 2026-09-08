package com.curitiba360.curitiba360_api.controller;

import com.curitiba360.curitiba360_api.model.RefundRequest;
import com.curitiba360.curitiba360_api.model.TicketItem;
import com.curitiba360.curitiba360_api.repository.RefundRepository;
import com.curitiba360.curitiba360_api.repository.TicketItemRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/refunds")
@RequiredArgsConstructor
public class RefundController {

    private final RefundRepository refundRepository;
    private final TicketItemRepository ticketItemRepository;

    @GetMapping
    public ResponseEntity<List<RefundRequest>> getAllRefunds(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String query
    ) {
        List<RefundRequest> all = refundRepository.findAllByOrderByRequestedAtDesc();

        return ResponseEntity.ok(all.stream().filter(r -> {
            boolean matchStatus = status == null || status.isBlank() || status.equalsIgnoreCase("ALL") ||
                    r.getStatus().equalsIgnoreCase(status);
            boolean matchQuery = query == null || query.isBlank() ||
                    r.getProtocolNumber().toLowerCase().contains(query.toLowerCase()) ||
                    r.getCustomerName().toLowerCase().contains(query.toLowerCase()) ||
                    r.getCustomerCpf().contains(query) ||
                    (r.getOrderNumber() != null && r.getOrderNumber().toLowerCase().contains(query.toLowerCase()));
            return matchStatus && matchQuery;
        }).toList());
    }

    @PostMapping
    public ResponseEntity<RefundRequest> createRefund(@RequestBody CreateRefundRequest request) {
        String protocol = "RMB-2026-" + String.format("%04d", new Random().nextInt(10000));

        RefundRequest refund = RefundRequest.builder()
                .protocolNumber(protocol)
                .orderNumber(request.getOrderNumber())
                .voucherCode(request.getVoucherCode())
                .customerName(request.getCustomerName())
                .customerCpf(request.getCustomerCpf())
                .customerEmail(request.getCustomerEmail())
                .attractionName(request.getAttractionName())
                .amount(request.getAmount())
                .reason(request.getReason())
                .withinLegalDeadline(request.isWithinLegalDeadline())
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "PIX")
                .pixKey(request.getPixKey())
                .status(request.isWithinLegalDeadline() ? "APPROVED" : "PENDING_REVIEW")
                .reviewedAt(request.isWithinLegalDeadline() ? LocalDateTime.now() : null)
                .reviewedBy(request.isWithinLegalDeadline() ? "Sistema (CDC 7 dias automático)" : null)
                .decisionNotes(request.isWithinLegalDeadline() ? "Estorno automático em conformidade com Art. 49 do CDC." : null)
                .build();

        RefundRequest saved = refundRepository.save(refund);

        // Se foi aprovado de imediato (CDC), cancelar o ticket
        if (saved.isWithinLegalDeadline() && saved.getVoucherCode() != null) {
            ticketItemRepository.findByVoucherCode(saved.getVoucherCode()).ifPresent(ticket -> {
                ticket.setStatus("CANCELLED");
                ticketItemRepository.save(ticket);
            });
        }

        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveRefund(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return refundRepository.findById(id).map(refund -> {
            refund.setStatus("APPROVED");
            refund.setReviewedAt(LocalDateTime.now());
            refund.setReviewedBy(body.getOrDefault("reviewerName", "Administrador"));
            refund.setDecisionNotes(body.getOrDefault("notes", "Estorno aprovado pela gerência comercial."));
            refundRepository.save(refund);

            // Cancelar voucher no banco
            if (refund.getVoucherCode() != null) {
                ticketItemRepository.findByVoucherCode(refund.getVoucherCode()).ifPresent(ticket -> {
                    ticket.setStatus("CANCELLED");
                    ticketItemRepository.save(ticket);
                });
            }

            return ResponseEntity.ok(refund);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectRefund(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return refundRepository.findById(id).map(refund -> {
            refund.setStatus("REJECTED");
            refund.setReviewedAt(LocalDateTime.now());
            refund.setReviewedBy(body.getOrDefault("reviewerName", "Administrador"));
            refund.setDecisionNotes(body.getOrDefault("notes", "Solicitação fora do prazo legal e não justificada por evento de força maior."));
            refundRepository.save(refund);
            return ResponseEntity.ok(refund);
        }).orElse(ResponseEntity.notFound().build());
    }

    @Data
    public static class CreateRefundRequest {
        private String orderNumber;
        private String voucherCode;
        private String customerName;
        private String customerCpf;
        private String customerEmail;
        private String attractionName;
        private java.math.BigDecimal amount;
        private String reason;
        private boolean withinLegalDeadline;
        private String paymentMethod;
        private String pixKey;
    }
}
