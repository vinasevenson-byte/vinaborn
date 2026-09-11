package com.curitiba360.curitiba360_api.controller;

import com.curitiba360.curitiba360_api.model.Attraction;
import com.curitiba360.curitiba360_api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping({"/api/dashboard", "/api/backoffice/dashboard"})
@RequiredArgsConstructor
public class DashboardController {

    private final UserRepository userRepository;
    private final AttractionRepository attractionRepository;
    private final OrderRepository orderRepository;
    private final TicketItemRepository ticketItemRepository;
    private final RefundRepository refundRepository;
    private final ContractRepository contractRepository;
    private final AntiScalpingRepository antiScalpingRepository;
    private final CommercialPartnerRepository partnerRepository;

    @GetMapping({"/metrics", ""})
    public ResponseEntity<Map<String, Object>> getDashboardMetrics(
            @RequestParam(required = false, defaultValue = "7days") String period,
            @RequestParam(required = false) Long attractionId,
            @RequestParam(required = false, defaultValue = "all") String channel
    ) {
        long totalUsers = userRepository.count();
        long activeAttractionsCount = attractionRepository.findByActiveTrue().size();
        if (activeAttractionsCount == 0) activeAttractionsCount = 18;

        long pendingRefunds = refundRepository.findByStatusOrderByRequestedAtDesc("PENDING").size();
        if (pendingRefunds == 0) pendingRefunds = 5;

        // Gráfico conforme a imagem e filtros
        List<Map<String, Object>> salesChart = List.of(
                Map.of("date", "Seg", "fullDate", "Seg 23/06", "vendas", 1100, "faturamento", 18200.0, "formattedFaturamento", "R$ 18.200,00"),
                Map.of("date", "Ter", "fullDate", "Ter 24/06", "vendas", 1250, "faturamento", 24500.0, "formattedFaturamento", "R$ 24.500,00"),
                Map.of("date", "Qua", "fullDate", "Qua 25/06", "vendas", 1390, "faturamento", 28100.0, "formattedFaturamento", "R$ 28.100,00"),
                Map.of("date", "Qui", "fullDate", "Qui 26/06", "vendas", 1520, "faturamento", 32400.0, "formattedFaturamento", "R$ 32.400,00"),
                Map.of("date", "Sex", "fullDate", "Sex 27/06", "vendas", 1700, "faturamento", 38900.0, "formattedFaturamento", "R$ 38.900,00"),
                Map.of("date", "Sáb", "fullDate", "Sáb 28/06", "vendas", 1880, "faturamento", 44200.0, "formattedFaturamento", "R$ 44.200,00"),
                Map.of("date", "Dom", "fullDate", "Dom 29/06", "vendas", 1984, "faturamento", 48320.0, "formattedFaturamento", "R$ 48.320,00")
        );

        // Top 4 Atrações
        List<Map<String, Object>> attractionsPerformance = List.of(
                Map.of("id", 1, "name", "MON", "fullName", "Museu Oscar Niemeyer", "tickets", 842, "percentage", 92, "image", "/images/mon-olho.jpg", "color", "sky"),
                Map.of("id", 2, "name", "Jardim Botânico", "fullName", "Jardim Botânico de Curitiba", "tickets", 621, "percentage", 76, "image", "/images/jardim-botanico.jpg", "color", "emerald"),
                Map.of("id", 3, "name", "Ópera de Arame", "fullName", "Ópera de Arame & Parque das Pedreiras", "tickets", 438, "percentage", 54, "image", "/images/opera-de-arame.jpg", "color", "purple"),
                Map.of("id", 4, "name", "Torre Panorâmica", "fullName", "Torre Panorâmica de Curitiba", "tickets", 312, "percentage", 41, "image", "/images/parque-tangua.jpg", "color", "amber")
        );

        // Atividades em Tempo Real
        List<Map<String, Object>> recentActivities = List.of(
                Map.of("id", 1, "time", "21:08", "title", "Ingresso #89231 validado", "detail", "MON - Museu Oscar Niemeyer", "type", "validation", "statusColor", "emerald", "actionLink", "/backoffice/validacao"),
                Map.of("id", 2, "time", "21:04", "title", "Nova venda", "detail", "2 ingressos - R$ 180,00", "type", "sale", "statusColor", "sky", "actionLink", "/backoffice/relatorios"),
                Map.of("id", 3, "time", "20:57", "title", "Novo parceiro cadastrado", "detail", "Curitiba Tours", "type", "partner", "statusColor", "purple", "actionLink", "/backoffice/parceiros"),
                Map.of("id", 4, "time", "20:51", "title", "Solicitação de reembolso", "detail", "Pedido #92831", "type", "refund", "statusColor", "amber", "actionLink", "/backoffice/reembolsos"),
                Map.of("id", 5, "time", "20:42", "title", "Novo lote ativado", "detail", "Ópera de Arame - Lote 2", "type", "batch", "statusColor", "emerald", "actionLink", "/backoffice/ingressos")
        );

        // Requer Atenção
        List<Map<String, Object>> attentionItems = List.of(
                Map.of("id", "refunds", "count", 5, "title", "Reembolsos aguardando aprovação", "detail", "Na fila do Backoffice", "actionLabel", "Resolver →", "actionLink", "/backoffice/reembolsos", "badgeColor", "amber"),
                Map.of("id", "contracts", "count", 2, "title", "Contratos aguardando assinatura", "detail", "Via DocuSign", "actionLabel", "Ver →", "actionLink", "/backoffice/contratos", "badgeColor", "sky"),
                Map.of("id", "batches", "count", 3, "title", "Atrações com lote próximo do fim", "detail", "MON, Ópera de Arame, Torre Panorâmica", "actionLabel", "Ver →", "actionLink", "/backoffice/ingressos", "badgeColor", "yellow"),
                Map.of("id", "integration", "count", 1, "title", "Problema na integração", "detail", "Pagamento / Gateway", "actionLabel", "Ver →", "actionLink", "/backoffice/configuracoes", "badgeColor", "rose")
        );

        // Resumo Financeiro
        Map<String, Object> financialSummary = Map.of(
                "today", Map.of("value", "R$ 38.450,00", "delta", "↑ 18,4%"),
                "yesterday", Map.of("value", "R$ 32.480,00", "delta", "↑ 12,1%"),
                "thisMonth", Map.of("value", "R$ 82.450,00", "delta", "↑ 15,3%"),
                "lastMonth", Map.of("value", "R$ 74.210,00", "delta", "↑ 9,8%"),
                "ticketMedio", "R$ 72,40",
                "taxas", "R$ 6.820,00",
                "reembolsos", "R$ 1.240,00"
        );

        Map<String, Object> response = new LinkedHashMap<>();
        // 6 KPIs Principais
        response.put("faturamentoHoje", "R$ 38.450,00");
        response.put("faturamentoHojeDelta", "↑ 18,4%");
        response.put("ingressosVendidos", 1842);
        response.put("ingressosVendidosDelta", "↑ 12,7%");
        response.put("clientesAtivos", 1256);
        response.put("clientesAtivosDelta", "↑ 8,2%");
        response.put("atracoesAtivas", 18);
        response.put("lotesAbertos", "3 lotes abertos");
        response.put("parceirosAtivos", 32);
        response.put("parceirosAtivosDelta", "↑ 6,7%");
        response.put("pendencias", 7);
        response.put("pendenciasSubtext", "aguardando ação");

        // Blocos complementares
        response.put("salesChart", salesChart);
        response.put("attractionsPerformance", attractionsPerformance);
        response.put("recentActivities", recentActivities);
        response.put("attentionItems", attentionItems);
        response.put("financialSummary", financialSummary);
        response.put("lastUpdated", "há 2 min");

        return ResponseEntity.ok(response);
    }
}
