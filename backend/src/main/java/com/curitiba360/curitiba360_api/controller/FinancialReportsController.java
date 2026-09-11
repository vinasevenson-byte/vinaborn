package com.curitiba360.curitiba360_api.controller;

import com.curitiba360.curitiba360_api.model.Order;
import com.curitiba360.curitiba360_api.model.TicketItem;
import com.curitiba360.curitiba360_api.repository.AgencyRepository;
import com.curitiba360.curitiba360_api.repository.OrderRepository;
import com.curitiba360.curitiba360_api.repository.TicketItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class FinancialReportsController {

    private final OrderRepository orderRepository;
    private final TicketItemRepository ticketItemRepository;
    private final AgencyRepository agencyRepository;

    @GetMapping("/summary")
    public ResponseEntity<?> getFinancialSummary(
            @RequestParam(required = false, defaultValue = "MONTH") String period
    ) {
        List<Order> orders = orderRepository.findAll();
        List<TicketItem> tickets = ticketItemRepository.findAll();

        BigDecimal grossVolume = orders.stream()
                .filter(o -> o != null && "PAID".equalsIgnoreCase(o.getStatus()))
                .map(o -> o.getTotalAmount() != null ? o.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, (a, b) -> a.add(b));

        BigDecimal discountsGiven = orders.stream()
                .filter(o -> o != null && "PAID".equalsIgnoreCase(o.getStatus()))
                .map(o -> o.getDiscountAmount() != null ? o.getDiscountAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, (a, b) -> a.add(b));

        // Taxa da plataforma Curitiba 360 (Take Rate médio 10%)
        BigDecimal platformTakeRate = grossVolume.multiply(new BigDecimal("0.10")).setScale(2, RoundingMode.HALF_UP);

        // Comissões devidas a agências (média 12% sobre vendas com cupom de agência)
        BigDecimal agencyCommissions = grossVolume.multiply(new BigDecimal("0.055")).setScale(2, RoundingMode.HALF_UP);

        // Repasses líquidos a parceiros comerciais
        BigDecimal partnerPayouts = grossVolume.subtract(platformTakeRate).subtract(agencyCommissions);

        long paidOrdersCount = orders.stream().filter(o -> o != null && "PAID".equalsIgnoreCase(o.getStatus())).count();
        BigDecimal avgTicket = paidOrdersCount > 0
                ? grossVolume.divide(BigDecimal.valueOf(paidOrdersCount), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        return ResponseEntity.ok(Map.of(
                "grossVolume", grossVolume,
                "discountsGiven", discountsGiven,
                "platformRevenue", platformTakeRate,
                "agencyCommissions", agencyCommissions,
                "partnerPayouts", partnerPayouts,
                "totalTransactions", paidOrdersCount,
                "averageTicket", avgTicket,
                "totalTicketsIssued", tickets.size(),
                "totalAgencies", agencyRepository.count()
        ));
    }

    @GetMapping("/sales-by-attraction")
    public ResponseEntity<List<Map<String, Object>>> getSalesByAttraction() {
        List<TicketItem> tickets = ticketItemRepository.findAll();
        Map<String, List<TicketItem>> grouped = new HashMap<>();

        for (TicketItem t : tickets) {
            String attractionName = t.getAttraction() != null ? t.getAttraction().getName() : "Outros";
            grouped.computeIfAbsent(attractionName, k -> new ArrayList<>()).add(t);
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<String, List<TicketItem>> entry : grouped.entrySet()) {
            String name = entry.getKey();
            List<TicketItem> list = entry.getValue();

            BigDecimal total = list.stream()
                    .map(t -> (t != null && t.getPrice() != null) ? t.getPrice() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, (a, b) -> a.add(b));

            long validCount = list.stream().filter(t -> t != null && "VALID".equalsIgnoreCase(t.getStatus())).count();
            long usedCount = list.stream().filter(t -> t != null && "USED".equalsIgnoreCase(t.getStatus())).count();
            long cancelledCount = list.stream().filter(t -> t != null && "CANCELLED".equalsIgnoreCase(t.getStatus())).count();

            result.add(Map.of(
                    "attractionName", name,
                    "totalSales", total,
                    "ticketsCount", list.size(),
                    "validCount", validCount,
                    "usedCount", usedCount,
                    "cancelledCount", cancelledCount
            ));
        }

        return ResponseEntity.ok(result);
    }

    @GetMapping("/payment-methods")
    public ResponseEntity<?> getPaymentMethodsBreakdown() {
        List<Order> orders = orderRepository.findAll().stream()
                .filter(o -> o != null && "PAID".equalsIgnoreCase(o.getStatus()))
                .toList();

        BigDecimal pixTotal = orders.stream()
                .filter(o -> o != null && "PIX".equalsIgnoreCase(o.getPaymentMethod()))
                .map(o -> o.getTotalAmount() != null ? o.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, (a, b) -> a.add(b));

        BigDecimal cardTotal = orders.stream()
                .filter(o -> o != null && !"PIX".equalsIgnoreCase(o.getPaymentMethod()))
                .map(o -> o.getTotalAmount() != null ? o.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, (a, b) -> a.add(b));

        long pixCount = orders.stream().filter(o -> "PIX".equalsIgnoreCase(o.getPaymentMethod())).count();
        long cardCount = orders.stream().filter(o -> !"PIX".equalsIgnoreCase(o.getPaymentMethod())).count();

        return ResponseEntity.ok(Map.of(
                "pix", Map.of("amount", pixTotal, "count", pixCount, "mdrFeeRate", "0.99%"),
                "card", Map.of("amount", cardTotal, "count", cardCount, "mdrFeeRate", "2.89%")
        ));
    }

    @GetMapping(value = "/export-csv", produces = "text/csv; charset=UTF-8")
    public ResponseEntity<byte[]> exportFinancialCsv() {
        List<Order> orders = orderRepository.findAll();

        StringBuilder csv = new StringBuilder();
        csv.append("Numero Pedido;Cliente;CPF;Metodo Pagamento;Valor Total (R$);Desconto (R$);Status;Data Criacao\n");

        for (Order o : orders) {
            csv.append(o.getOrderNumber()).append(";")
                    .append(o.getCustomer() != null ? o.getCustomer().getName() : "N/A").append(";")
                    .append(o.getCustomer() != null ? o.getCustomer().getCpf() : "N/A").append(";")
                    .append(o.getPaymentMethod()).append(";")
                    .append(String.format(Locale.GERMANY, "%.2f", o.getTotalAmount())).append(";")
                    .append(String.format(Locale.GERMANY, "%.2f", o.getDiscountAmount())).append(";")
                    .append(o.getStatus()).append(";")
                    .append(o.getCreatedAt()).append("\n");
        }

        byte[] bytes = csv.toString().getBytes(StandardCharsets.ISO_8859_1); // padrão Excel no Brasil

        HttpHeaders headers = new HttpHeaders();
        headers.setContentDispositionFormData("attachment", "curitiba360_fechamento_financeiro.csv");
        headers.setContentType(MediaType.parseMediaType("text/csv; charset=ISO-8859-1"));

        return ResponseEntity.ok().headers(headers).body(bytes);
    }
}
