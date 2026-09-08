package com.curitiba360.curitiba360_api.controller;

import com.curitiba360.curitiba360_api.repository.AttractionRepository;
import com.curitiba360.curitiba360_api.repository.OrderRepository;
import com.curitiba360.curitiba360_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final UserRepository userRepository;
    private final AttractionRepository attractionRepository;
    private final OrderRepository orderRepository;

    @GetMapping("/metrics")
    public ResponseEntity<?> getDashboardMetrics() {
        long totalUsers = userRepository.count();
        long totalAttractions = attractionRepository.count();
        long totalOrders = orderRepository.count();

        return ResponseEntity.ok(Map.of(
                "totalRevenue", new BigDecimal("148520.00"),
                "monthlyRevenue", new BigDecimal("42350.00"),
                "todayRevenue", new BigDecimal("3890.00"),
                "activeTickets", 842,
                "validatedToday", 127,
                "totalUsers", totalUsers,
                "totalAttractions", totalAttractions,
                "totalOrders", totalOrders,
                "salesChart", List.of(
                        Map.of("date", "Seg", "vendas", 34),
                        Map.of("date", "Ter", "vendas", 48),
                        Map.of("date", "Qua", "vendas", 62),
                        Map.of("date", "Qui", "vendas", 58),
                        Map.of("date", "Sex", "vendas", 112),
                        Map.of("date", "Sab", "vendas", 215),
                        Map.of("date", "Dom", "vendas", 184)
                ),
                "recentActivities", List.of(
                        Map.of("id", 1, "title", "Compra de 4 Ingressos - Ópera de Arame", "time", "Há 5 minutos", "amount", "R$ 60,00"),
                        Map.of("id", 2, "title", "Ingresso Validado na Catraca - MON", "time", "Há 12 minutos", "amount", "VCH-7781"),
                        Map.of("id", 3, "title", "Novo Parceiro Cadastrado - Restaurante Madalosso", "time", "Há 25 minutos", "amount", "Pendente")
                )
        ));
    }
}
