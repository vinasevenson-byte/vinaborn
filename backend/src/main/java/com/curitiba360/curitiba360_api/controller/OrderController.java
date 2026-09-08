package com.curitiba360.curitiba360_api.controller;

import com.curitiba360.curitiba360_api.model.*;
import com.curitiba360.curitiba360_api.repository.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderRepository orderRepository;
    private final TicketItemRepository ticketItemRepository;
    private final AttractionRepository attractionRepository;
    private final UserRepository userRepository;
    private final CouponRepository couponRepository;

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody CheckoutRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "O carrinho está vazio. Adicione ingressos para continuar."));
        }

        // 1. Identificar ou cadastrar o usuário comprador
        String email = request.getCustomerEmail() != null && !request.getCustomerEmail().isBlank()
                ? request.getCustomerEmail().trim().toLowerCase()
                : "turista@curitiba360.com.br";

        User customer = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = User.builder()
                    .name(request.getCustomerName() != null ? request.getCustomerName() : "Turista Curitiba 360")
                    .email(email)
                    .password("$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy") // default encoded
                    .cpf(request.getCustomerCpf() != null ? request.getCustomerCpf() : "000.000.000-00")
                    .role(Role.TOURIST)
                    .active(true)
                    .build();
            return userRepository.save(newUser);
        });

        // 2. Calcular subtotal dos itens
        BigDecimal subtotal = BigDecimal.ZERO;
        for (CheckoutItem item : request.getItems()) {
            BigDecimal itemTotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            subtotal = subtotal.add(itemTotal);
        }

        // 3. Aplicar cupom de desconto se fornecido
        BigDecimal discount = BigDecimal.ZERO;
        Coupon appliedCoupon = null;
        if (request.getCouponCode() != null && !request.getCouponCode().isBlank()) {
            var optCoupon = couponRepository.findByCodeAndActiveTrue(request.getCouponCode().trim().toUpperCase());
            if (optCoupon.isPresent()) {
                appliedCoupon = optCoupon.get();
                if ("PERCENTAGE".equalsIgnoreCase(appliedCoupon.getDiscountType())) {
                    discount = subtotal.multiply(appliedCoupon.getDiscountValue())
                            .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                } else {
                    discount = appliedCoupon.getDiscountValue();
                }
                if (discount.compareTo(subtotal) > 0) {
                    discount = subtotal;
                }
                appliedCoupon.setUsedCount(appliedCoupon.getUsedCount() + 1);
                couponRepository.save(appliedCoupon);
            }
        }

        BigDecimal total = subtotal.subtract(discount);
        if (total.compareTo(BigDecimal.ZERO) < 0) {
            total = BigDecimal.ZERO;
        }

        // 4. Gerar número de pedido único
        String orderNumber = "CWB-2026-" + String.format("%05d", new Random().nextInt(100000));

        String paymentMethod = request.getPaymentMethod() != null ? request.getPaymentMethod().toUpperCase() : "PIX";
        String status = "PAID"; // Instantâneo para aprovação de teste ou PIX imediato

        Order order = Order.builder()
                .orderNumber(orderNumber)
                .customer(customer)
                .totalAmount(total)
                .discountAmount(discount)
                .paymentMethod(paymentMethod)
                .status(status)
                .createdAt(LocalDateTime.now())
                .build();

        Order savedOrder = orderRepository.save(order);

        // 5. Emitir cada ingresso individualmente com código voucher único (WF-077)
        List<TicketItem> generatedTickets = new ArrayList<>();

        for (CheckoutItem item : request.getItems()) {
            Attraction attraction = null;
            if (item.getAttractionId() != null) {
                attraction = attractionRepository.findById(item.getAttractionId()).orElse(null);
            }
            if (attraction == null) {
                List<Attraction> all = attractionRepository.findAll();
                attraction = all.isEmpty() ? null : all.get(0);
            }

            LocalDate visitDate = item.getVisitDate() != null ? item.getVisitDate() : LocalDate.now().plusDays(3);

            for (int i = 0; i < item.getQuantity(); i++) {
                String randomVoucherPart = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
                String voucherCode = "VCH-CWB-2026-" + randomVoucherPart;

                String holderName = item.getHolderName() != null && !item.getHolderName().isBlank()
                        ? item.getHolderName()
                        : (customer.getName() != null ? customer.getName() : "Visitante Curitiba 360");

                String holderDoc = item.getHolderDocument() != null && !item.getHolderDocument().isBlank()
                        ? item.getHolderDocument()
                        : customer.getCpf();

                TicketItem ticket = TicketItem.builder()
                        .order(savedOrder)
                        .attraction(attraction)
                        .voucherCode(voucherCode)
                        .holderName(holderName)
                        .holderDocument(holderDoc)
                        .categoryName(item.getCategoryName() != null ? item.getCategoryName() : "Ingresso Geral")
                        .price(item.getPrice())
                        .visitDate(visitDate)
                        .status("VALID")
                        .createdAt(LocalDateTime.now())
                        .build();

                generatedTickets.add(ticketItemRepository.save(ticket));
            }
        }

        // 6. Chave PIX Copia e Cola / Payload EMV BR Code
        String pixCopyAndPaste = "00020126580014BR.GOV.BCB.PIX0136curitiba360-pix@turismo.curitiba.br520400005303986540"
                + String.format(Locale.US, "%.2f", total) + "5802BR5916CURITIBA 3606008CURITIBA62240520" + orderNumber + "6304F2E4";

        Map<String, Object> response = new HashMap<>();
        response.put("orderNumber", orderNumber);
        response.put("status", status);
        response.put("totalAmount", total);
        response.put("discountAmount", discount);
        response.put("paymentMethod", paymentMethod);
        response.put("pixCopyAndPaste", pixCopyAndPaste);
        response.put("tickets", generatedTickets);
        response.put("customerName", customer.getName());
        response.put("customerEmail", customer.getEmail());
        response.put("message", "Pedido finalizado com sucesso! Vouchers emitidos.");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{orderNumber}")
    public ResponseEntity<?> getOrderDetails(@PathVariable String orderNumber) {
        var optOrder = orderRepository.findByOrderNumber(orderNumber);
        if (optOrder.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Order order = optOrder.get();
        List<TicketItem> items = ticketItemRepository.findAll().stream()
                .filter(t -> t.getOrder() != null && t.getOrder().getId().equals(order.getId()))
                .toList();

        return ResponseEntity.ok(Map.of(
                "order", order,
                "tickets", items
        ));
    }

    @PostMapping("/{orderNumber}/confirm-pix")
    public ResponseEntity<?> confirmPixPayment(@PathVariable String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
                .map(order -> {
                    order.setStatus("PAID");
                    orderRepository.save(order);
                    return ResponseEntity.ok(Map.of(
                            "status", "PAID",
                            "message", "Pagamento via PIX confirmado com sucesso!"
                    ));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @Data
    public static class CheckoutRequest {
        private List<CheckoutItem> items;
        private String paymentMethod; // PIX ou CREDIT_CARD
        private String couponCode;
        private String customerName;
        private String customerEmail;
        private String customerCpf;
    }

    @Data
    public static class CheckoutItem {
        private Long attractionId;
        private String categoryName;
        private BigDecimal price;
        private Integer quantity;
        private LocalDate visitDate;
        private String holderName;
        private String holderDocument;
    }
}
