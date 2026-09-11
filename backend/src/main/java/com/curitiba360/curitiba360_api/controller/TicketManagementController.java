package com.curitiba360.curitiba360_api.controller;

import com.curitiba360.curitiba360_api.model.TicketBatch;
import com.curitiba360.curitiba360_api.model.TicketCategory;
import com.curitiba360.curitiba360_api.model.TicketItem;
import com.curitiba360.curitiba360_api.repository.TicketBatchRepository;
import com.curitiba360.curitiba360_api.repository.TicketCategoryRepository;
import com.curitiba360.curitiba360_api.repository.TicketItemRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets/management")
@RequiredArgsConstructor
public class TicketManagementController {

    private final TicketBatchRepository ticketBatchRepository;
    private final TicketCategoryRepository ticketCategoryRepository;
    private final TicketItemRepository ticketItemRepository;

    @GetMapping("/batches")
    public ResponseEntity<List<TicketBatch>> getAllBatches() {
        return ResponseEntity.ok(ticketBatchRepository.findAll());
    }

    @GetMapping("/categories")
    public ResponseEntity<List<TicketCategory>> getAllCategories() {
        return ResponseEntity.ok(ticketCategoryRepository.findAll());
    }

    @PostMapping("/batches")
    public ResponseEntity<?> createBatch(@RequestBody CreateBatchRequest request) {
        TicketCategory category = null;
        if (request.getCategoryId() != null) {
            category = ticketCategoryRepository.findById(request.getCategoryId()).orElse(null);
        }
        if (category == null) {
            // fallback: find first category or bad request
            List<TicketCategory> allCats = ticketCategoryRepository.findAll();
            if (!allCats.isEmpty()) {
                category = allCats.get(0);
            } else {
                return ResponseEntity.badRequest().body(Map.of("message", "Nenhuma categoria de ingresso encontrada"));
            }
        }

        TicketBatch batch = TicketBatch.builder()
                .category(category)
                .name(request.getName())
                .price(request.getPrice())
                .originalPrice(request.getOriginalPrice() != null ? request.getOriginalPrice() : request.getPrice())
                .totalQuantity(request.getTotalQuantity())
                .availableQuantity(request.getTotalQuantity())
                .active(true)
                .build();

        TicketBatch saved = ticketBatchRepository.save(batch);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/batches/{id}/toggle-status")
    public ResponseEntity<?> toggleBatchStatus(@PathVariable Long id) {
        return ticketBatchRepository.findById(id)
                .map(batch -> {
                    batch.setActive(!batch.isActive());
                    ticketBatchRepository.save(batch);
                    return ResponseEntity.ok(batch);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/issued")
    public ResponseEntity<List<TicketItem>> searchIssuedTickets(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long attractionId
    ) {
        List<TicketItem> allTickets = ticketItemRepository.findAll();

        return ResponseEntity.ok(allTickets.stream().filter(t -> {
            boolean matchQuery = query == null || query.isBlank() ||
                    (t.getVoucherCode() != null && t.getVoucherCode().toLowerCase().contains(query.toLowerCase())) ||
                    (t.getHolderName() != null && t.getHolderName().toLowerCase().contains(query.toLowerCase()));
            boolean matchStatus = status == null || status.isBlank() || status.equalsIgnoreCase("ALL") ||
                    (t.getStatus() != null && t.getStatus().equalsIgnoreCase(status));
            boolean matchAttraction = attractionId == null ||
                    (t.getAttraction() != null && t.getAttraction().getId().equals(attractionId));

            return matchQuery && matchStatus && matchAttraction;
        }).toList());
    }

    @GetMapping("/issued/{id}")
    public ResponseEntity<TicketItem> getTicketDetails(@PathVariable Long id) {
        return ticketItemRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/issued/{id}/status")
    public ResponseEntity<?> updateTicketStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        return ticketItemRepository.findById(id)
                .map(ticket -> {
                    if (newStatus != null) {
                        ticket.setStatus(newStatus.toUpperCase());
                        ticketItemRepository.save(ticket);
                    }
                    return ResponseEntity.ok(ticket);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @Data
    public static class CreateBatchRequest {
        private String name;
        private Long categoryId;
        private BigDecimal price;
        private BigDecimal originalPrice;
        private Integer totalQuantity;
    }
}
