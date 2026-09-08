package com.curitiba360.curitiba360_api.controller;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CmsAndNotificationController {

    // Simulação em memória com dados ricos para CMS e Notificações
    private static final List<Map<String, Object>> BANNERS = new ArrayList<>(List.of(
            new HashMap<>(Map.of(
                    "id", 1L,
                    "title", "Festival de Primavera na Ópera de Arame",
                    "subtitle", "Música instrumental flutuante no Vale da Música todos os finais de semana.",
                    "imageUrl", "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80",
                    "linkUrl", "/atracoes/opera-de-arame",
                    "ctaText", "Garantir Ingresso",
                    "active", true,
                    "order", 1
            )),
            new HashMap<>(Map.of(
                    "id", 2L,
                    "title", "Descida Histórica da Serra do Mar de Trem",
                    "subtitle", "Viva a mais espetacular ferrovia do Brasil rumo a Morretes.",
                    "imageUrl", "https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?auto=format&fit=crop&w=1200&q=80",
                    "linkUrl", "/atracoes/passeio-trem-serra-do-mar",
                    "ctaText", "Ver Horários e Lotes",
                    "active", true,
                    "order", 2
            )),
            new HashMap<>(Map.of(
                    "id", 3L,
                    "title", "Exposições Internacionais no Museu do Olho (MON)",
                    "subtitle", "Mais de 14 mil obras de arte na maior estrutura Niemeyer do sul.",
                    "imageUrl", "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80",
                    "linkUrl", "/atracoes/museu-oscar-niemeyer",
                    "ctaText", "Comprar Antecipado",
                    "active", true,
                    "order", 3
            ))
    ));

    private static final List<Map<String, Object>> GOOGLE_REVIEWS = new ArrayList<>(List.of(
            new HashMap<>(Map.of(
                    "id", 1L,
                    "authorName", "Beatriz Alencar",
                    "rating", 5,
                    "comment", "Experiência impecável! Comprei pelo Curitiba 360, recebi o voucher com QR Code no mesmo minuto e a catraca da Ópera de Arame liberou em 2 segundos.",
                    "attractionName", "Ópera de Arame",
                    "date", "Há 3 dias",
                    "featuredOnHome", true
            )),
            new HashMap<>(Map.of(
                    "id", 2L,
                    "authorName", "Thiago Mendonça (São Paulo)",
                    "rating", 5,
                    "comment", "O passeio de trem para Morretes é surreal de lindo. A facilidade de comprar online com desconto de cupom de agência valeu demais a pena!",
                    "attractionName", "Trem da Serra do Mar",
                    "date", "Há 1 semana",
                    "featuredOnHome", true
            )),
            new HashMap<>(Map.of(
                    "id", 3L,
                    "authorName", "Camila G. Silveira",
                    "rating", 5,
                    "comment", "Jardim Botânico é um cartão-postal obrigatório de Curitiba. Estufa limpa, jardins floridos e ótimo suporte no site.",
                    "attractionName", "Jardim Botânico",
                    "date", "Há 2 semanas",
                    "featuredOnHome", true
            ))
    ));

    private static final List<Map<String, Object>> NOTIFICATION_TEMPLATES = new ArrayList<>(List.of(
            new HashMap<>(Map.of(
                    "id", 1L,
                    "channel", "EMAIL",
                    "triggerEvent", "ORDER_COMPLETED",
                    "name", "Voucher Digital com QR Code de Acesso",
                    "subject", "Seus Ingressos Curitiba 360 chegaram! [{{numero_pedido}}]",
                    "slaTarget", "Até 2 minutos (RN-034.08)",
                    "active", true
            )),
            new HashMap<>(Map.of(
                    "id", 2L,
                    "channel", "WHATSAPP_SMS",
                    "triggerEvent", "BEFORE_24H",
                    "name", "Lembrete de Visita & Previsão do Tempo",
                    "subject", "Lembrete: Seu passeio em Curitiba é amanhã!",
                    "slaTarget", "Disparo às 08:00 do dia anterior",
                    "active", true
            )),
            new HashMap<>(Map.of(
                    "id", 3L,
                    "channel", "EMAIL",
                    "triggerEvent", "POST_VISIT_24H",
                    "name", "Pesquisa NPS e Avaliação Google Places",
                    "subject", "Como foi seu passeio? Conte-nos sua experiência!",
                    "slaTarget", "24h após check-in na catraca",
                    "active", true
            ))
    ));

    private static final List<Map<String, Object>> NOTIFICATION_LOGS = new ArrayList<>(List.of(
            Map.of("id", 101L, "recipient", "vinicius.turista@email.com", "template", "Voucher Digital com QR Code", "channel", "EMAIL", "status", "DELIVERED", "sentAt", "10:14:02", "duration", "0.8s"),
            Map.of("id", 102L, "recipient", "(41) 98822-1100", "template", "Lembrete de Visita 24h", "channel", "WHATSAPP", "status", "DELIVERED", "sentAt", "09:45:11", "duration", "0.4s"),
            Map.of("id", 103L, "recipient", "fernanda.souza@email.com", "template", "Confirmação de Estorno PIX", "channel", "EMAIL", "status", "DELIVERED", "sentAt", "09:12:44", "duration", "1.1s")
    ));

    // --- Endpoints de Banners ---
    @GetMapping("/cms/banners")
    public ResponseEntity<List<Map<String, Object>>> getBanners() {
        return ResponseEntity.ok(BANNERS);
    }

    @PostMapping("/cms/banners")
    public ResponseEntity<?> createBanner(@RequestBody Map<String, Object> bannerData) {
        long newId = BANNERS.size() + 1L;
        bannerData.put("id", newId);
        bannerData.put("active", true);
        bannerData.put("order", BANNERS.size() + 1);
        BANNERS.add(new HashMap<>(bannerData));
        return ResponseEntity.ok(bannerData);
    }

    @PutMapping("/cms/banners/{id}/toggle")
    public ResponseEntity<?> toggleBanner(@PathVariable Long id) {
        for (Map<String, Object> b : BANNERS) {
            if (b.get("id").equals(id)) {
                boolean active = (boolean) b.get("active");
                b.put("active", !active);
                return ResponseEntity.ok(b);
            }
        }
        return ResponseEntity.notFound().build();
    }

    // --- Endpoints de Avaliações Google Places ---
    @GetMapping("/cms/reviews")
    public ResponseEntity<List<Map<String, Object>>> getReviews() {
        return ResponseEntity.ok(GOOGLE_REVIEWS);
    }

    @PutMapping("/cms/reviews/{id}/toggle-feature")
    public ResponseEntity<?> toggleReviewFeature(@PathVariable Long id) {
        for (Map<String, Object> r : GOOGLE_REVIEWS) {
            if (r.get("id").equals(id)) {
                boolean featured = (boolean) r.get("featuredOnHome");
                r.put("featuredOnHome", !featured);
                return ResponseEntity.ok(r);
            }
        }
        return ResponseEntity.notFound().build();
    }

    // --- Endpoints de Notificações ---
    @GetMapping("/notifications/templates")
    public ResponseEntity<List<Map<String, Object>>> getTemplates() {
        return ResponseEntity.ok(NOTIFICATION_TEMPLATES);
    }

    @GetMapping("/notifications/logs")
    public ResponseEntity<List<Map<String, Object>>> getNotificationLogs() {
        return ResponseEntity.ok(NOTIFICATION_LOGS);
    }

    @PostMapping("/notifications/test-send")
    public ResponseEntity<?> testNotification(@RequestBody Map<String, String> body) {
        String recipient = body.getOrDefault("recipient", "turista@curitiba360.com.br");
        String templateName = body.getOrDefault("templateName", "Voucher Digital");

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Disparo de teste realizado com sucesso para " + recipient + " em conformidade com o SLA RN-034.08.",
                "deliveryTimeMs", 640,
                "timestamp", LocalDateTime.now().toString()
        ));
    }
}
