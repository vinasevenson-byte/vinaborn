package com.curitiba360.curitiba360_api.config;

import com.curitiba360.curitiba360_api.model.*;
import com.curitiba360.curitiba360_api.repository.AttractionRepository;
import com.curitiba360.curitiba360_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AttractionRepository attractionRepository;
    private final com.curitiba360.curitiba360_api.repository.CommercialPartnerRepository partnerRepository;
    private final com.curitiba360.curitiba360_api.repository.AgencyRepository agencyRepository;
    private final com.curitiba360.curitiba360_api.repository.ContractRepository contractRepository;
    private final com.curitiba360.curitiba360_api.repository.TicketCategoryRepository ticketCategoryRepository;
    private final com.curitiba360.curitiba360_api.repository.TicketBatchRepository ticketBatchRepository;
    private final com.curitiba360.curitiba360_api.repository.CouponRepository couponRepository;
    private final com.curitiba360.curitiba360_api.repository.TicketItemRepository ticketItemRepository;
    private final com.curitiba360.curitiba360_api.repository.OrderRepository orderRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            seedUsers();
        }
        if (attractionRepository.count() == 0) {
            seedAttractions();
        }
        if (partnerRepository.count() == 0) {
            seedPartnersAndAgencies();
        }
        if (ticketCategoryRepository.count() == 0) {
            seedTicketsAndBatches();
        }
        if (couponRepository.count() == 0) {
            seedCoupons();
        }
    }

    private void seedUsers() {
        User admin = User.builder()
                .name("Administrador Curitiba 360")
                .email("admin@curitiba360.com.br")
                .password(passwordEncoder.encode("admin123"))
                .cpf("111.222.333-44")
                .phone("(41) 99999-0001")
                .role(Role.ADMIN)
                .active(true)
                .build();

        User partner = User.builder()
                .name("Parceiro Ópera de Arame")
                .email("parceiro@curitiba360.com.br")
                .password(passwordEncoder.encode("parceiro123"))
                .cpf("222.333.444-55")
                .phone("(41) 99999-0002")
                .role(Role.PARTNER)
                .active(true)
                .build();

        User tourist = User.builder()
                .name("Vinicius Turista")
                .email("turista@curitiba360.com.br")
                .password(passwordEncoder.encode("turista123"))
                .cpf("333.444.555-66")
                .phone("(41) 99999-0003")
                .role(Role.TOURIST)
                .active(true)
                .build();

        userRepository.saveAll(List.of(admin, partner, tourist));
    }

    private void seedAttractions() {
        Attraction botanico = Attraction.builder()
                .name("Jardim Botânico de Curitiba")
                .slug("jardim-botanico-curitiba")
                .summary("O mais famoso cartão-postal da capital paranaense, com sua icônica estufa de ferro e vidro e jardins em estilo francês.")
                .description("Inaugurado em 1991, o Jardim Botânico Francisca Maria Garfunkel Rischbieter conta com 278 mil metros quadrados de área verde, a clássica estufa de três abóbadas inspirada no Palácio de Cristal de Londres, Museu Botânico, trilhas ecológicas e o Jardim das Sensações.")
                .category("PARQUE")
                .address("Rua Engenheiro Ostoja Roguski, 3501")
                .neighborhood("Jardim Botânico")
                .coverImageUrl("https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=1200&q=80")
                .featured(true)
                .active(true)
                .googleRating(4.9)
                .reviewsCount(34200)
                .ticketStartingPrice(new BigDecimal("0.00"))
                .latitude(-25.4428)
                .longitude(-49.2394)
                .build();

        Attraction opera = Attraction.builder()
                .name("Ópera de Arame e Vale da Música")
                .slug("opera-de-arame")
                .summary("Estrutura tubular transparente sobre um lago cercada por vegetação exuberante e palco flutuante com música instrumental ao vivo.")
                .description("Montada em estrutura tubular com teto transparente de policarbonato, a Ópera de Arame foi construída em apenas 75 dias. Integrada à Pedreira Paulo Leminski, abriga o projeto Vale da Música, exposições artísticas e espetáculos memoráveis.")
                .category("SHOW")
                .address("Rua João Gava, 970")
                .neighborhood("Abranches")
                .coverImageUrl("https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80")
                .featured(true)
                .active(true)
                .googleRating(4.8)
                .reviewsCount(21500)
                .ticketStartingPrice(new BigDecimal("15.00"))
                .latitude(-25.3850)
                .longitude(-49.2764)
                .build();

        Attraction mon = Attraction.builder()
                .name("Museu Oscar Niemeyer (MON / Museu do Olho)")
                .slug("museu-oscar-niemeyer")
                .summary("Um dos maiores complexos de arte da América Latina, com arquitetura arrojada projetada pelo gênio Oscar Niemeyer.")
                .description("Conhecido carinhosamente como Museu do Olho por seu design inconfundível, o MON abriga mais de 14 mil obras de artes visuais, arquitetura, design e fotografia, além de um café charmoso e parque externo arborizado.")
                .category("MUSEU")
                .address("Rua Marechal Hermes, 999")
                .neighborhood("Centro Cívico")
                .coverImageUrl("https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80")
                .featured(true)
                .active(true)
                .googleRating(4.8)
                .reviewsCount(28900)
                .ticketStartingPrice(new BigDecimal("30.00"))
                .latitude(-25.4103)
                .longitude(-49.2667)
                .build();

        Attraction trem = Attraction.builder()
                .name("Passeio de Trem da Serra do Mar (Curitiba - Morretes)")
                .slug("passeio-trem-serra-do-mar")
                .summary("Uma das 10 viagens de trem mais espetaculares do planeta pela Mata Atlântica preservada, com pontes, túneis e viadutos históricos.")
                .description("Descida épica pela ferrovia centenária inaugurada em 1885 pelos irmãos Rebouças. A viagem cruza a Serra do Mar Paranaense em meio a cachoeiras e penhascos vertiginosos, com chegada na charmosa cidade histórica de Morretes e degustação do tradicional Barreado.")
                .category("PASSEIO")
                .address("Av. Presidente Affonso Camargo, 330")
                .neighborhood("Jardim Botânico")
                .coverImageUrl("https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?auto=format&fit=crop&w=1200&q=80")
                .featured(true)
                .active(true)
                .googleRating(4.9)
                .reviewsCount(18400)
                .ticketStartingPrice(new BigDecimal("175.00"))
                .latitude(-25.4358)
                .longitude(-49.2558)
                .build();

        Attraction tangua = Attraction.builder()
                .name("Parque Tanguá")
                .slug("parque-tangua")
                .summary("Mirante monumental a 65 metros de altura sobre uma antiga pedreira desativada, com túnel artificial e o pôr do sol mais disputado da cidade.")
                .description("Parte do projeto de preservação da bacia do Rio Barigui, o Parque Tanguá possui mirante com torre em estilo francês, espelho d'água com chafarizes, ciclovia e pista de caminhada em meio a paredões de rocha.")
                .category("PARQUE")
                .address("Rua Oswaldo Maciel, 97")
                .neighborhood("Taboão")
                .coverImageUrl("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80")
                .featured(true)
                .active(true)
                .googleRating(4.9)
                .reviewsCount(24700)
                .ticketStartingPrice(new BigDecimal("0.00"))
                .latitude(-25.3789)
                .longitude(-49.2831)
                .build();

        attractionRepository.saveAll(List.of(botanico, opera, mon, trem, tangua));
    }

    private void seedPartnersAndAgencies() {
        // Parceiro 1: Ativo
        CommercialPartner madalosso = CommercialPartner.builder()
                .companyName("Restaurante Madalosso Ltda")
                .tradeName("Madalosso Santa Felicidade")
                .cnpj("76.123.456/0001-89")
                .contactPerson("Carlos Madalosso")
                .email("contato@madalosso.com.br")
                .phone("(41) 3372-2121")
                .address("Av. Manoel Ribas, 5875 - Santa Felicidade")
                .city("Curitiba")
                .state("PR")
                .bankName("Banco Itaú (341)")
                .bankAgency("0452")
                .bankAccount("19823-4")
                .pixKey("76.123.456/0001-89")
                .status("ACTIVE")
                .approvedBy("Administrador")
                .approvedAt(java.time.LocalDateTime.now())
                .build();

        // Parceiro 2: Pendente de Aprovação (WF-058 Estado 2)
        CommercialPartner serraVerde = CommercialPartner.builder()
                .companyName("Serra Verde Express Trens Turísticos S/A")
                .tradeName("Serra Verde Express")
                .cnpj("02.987.654/0001-10")
                .contactPerson("Adonai Arruda Filho")
                .email("comercial@serraverdeexpress.com.br")
                .phone("(41) 3888-3488")
                .address("Av. Presidente Affonso Camargo, 330")
                .city("Curitiba")
                .state("PR")
                .bankName("Banco do Brasil (001)")
                .bankAgency("1520-2")
                .bankAccount("38491-0")
                .pixKey("financeiro@serraverdeexpress.com.br")
                .status("PENDING_APPROVAL")
                .build();

        partnerRepository.saveAll(List.of(madalosso, serraVerde));

        // Agência 1: Ativa com comissão apurada
        Agency cwbTours = Agency.builder()
                .companyName("Curitiba City Tour & Receptivo Ltda")
                .tradeName("CWB City Tours")
                .cnpj("18.444.555/0001-22")
                .cadastur("18.044.555/0001-PR")
                .contactPerson("Fernanda Oliveira")
                .email("operacoes@cwbtours.com.br")
                .phone("(41) 98822-1100")
                .address("Rua XV de Novembro, 1200 - Centro")
                .city("Curitiba")
                .state("PR")
                .commissionRate(new BigDecimal("12.00")) // 12%
                .status("ACTIVE")
                .approvedAt(java.time.LocalDateTime.now())
                .totalSalesVolume(new BigDecimal("48600.00"))
                .totalCommissionAccumulated(new BigDecimal("5832.00"))
                .bankName("Santander (033)")
                .bankAgency("3041")
                .bankAccount("1300892-1")
                .pixKey("18.444.555/0001-22")
                .build();

        // Agência 2: Pendente de Aprovação (WF-048 Estado 2)
        Agency paranaViagens = Agency.builder()
                .companyName("Paraná Turismo e Eventos Eireli")
                .tradeName("Paraná Viagens")
                .cnpj("24.777.888/0001-99")
                .cadastur("24.077.888/0001-PR")
                .contactPerson("Roberto Mendes")
                .email("roberto@paranaviagens.com.br")
                .phone("(41) 99111-4455")
                .address("Rua Comendador Araújo, 450 - Batel")
                .city("Curitiba")
                .state("PR")
                .commissionRate(new BigDecimal("10.00"))
                .status("PENDING_APPROVAL")
                .build();

        agencyRepository.saveAll(List.of(cwbTours, paranaViagens));

        // Contratos DocuSign vinculados
        Contract ctrMadalosso = Contract.builder()
                .contractNumber("CTR-PARC-001-2026")
                .title("Contrato de Parceria Comercial e Vendas - Restaurante Madalosso")
                .entityType("PARTNER")
                .entityId(1L)
                .entityName("Restaurante Madalosso Ltda")
                .docusignEnvelopeId("DOCUSIGN-ENV-8841-MADALOSSO")
                .status("ACTIVE")
                .signedDate(java.time.LocalDate.now().minusMonths(2))
                .validUntil(java.time.LocalDate.now().plusMonths(10))
                .documentPdfUrl("/docs/contratos/madalosso-parceria.pdf")
                .build();

        Contract ctrCwbTours = Contract.builder()
                .contractNumber("CTR-AGEN-001-2026")
                .title("Contrato de Credenciamento e Comissionamento - CWB City Tours")
                .entityType("AGENCY")
                .entityId(1L)
                .entityName("Curitiba City Tour & Receptivo Ltda")
                .docusignEnvelopeId("DOCUSIGN-ENV-9912-CWBCITYTOURS")
                .status("ACTIVE")
                .signedDate(java.time.LocalDate.now().minusMonths(1))
                .validUntil(java.time.LocalDate.now().plusMonths(11))
                .documentPdfUrl("/docs/contratos/cwb-tours-credenciamento.pdf")
                .build();

        contractRepository.saveAll(List.of(ctrMadalosso, ctrCwbTours));
    }

    private void seedTicketsAndBatches() {
        List<Attraction> attractions = attractionRepository.findAll();
        if (attractions.isEmpty()) return;

        Attraction opera = attractions.stream()
                .filter(a -> a.getSlug().contains("opera"))
                .findFirst()
                .orElse(attractions.get(0));

        Attraction mon = attractions.stream()
                .filter(a -> a.getSlug().contains("mon") || a.getSlug().contains("niemeyer"))
                .findFirst()
                .orElse(attractions.size() > 1 ? attractions.get(1) : attractions.get(0));

        Attraction trem = attractions.stream()
                .filter(a -> a.getSlug().contains("trem"))
                .findFirst()
                .orElse(attractions.size() > 2 ? attractions.get(2) : attractions.get(0));

        // Categorias e Lotes para Ópera de Arame
        TicketCategory catOperaInteira = TicketCategory.builder()
                .attraction(opera)
                .name("Ingresso Inteira - Acesso Geral")
                .description("Acesso completo à Ópera de Arame e deck do Vale da Música")
                .requiresDocumentProof(false)
                .build();
        ticketCategoryRepository.save(catOperaInteira);

        TicketBatch batchOpera1 = TicketBatch.builder()
                .category(catOperaInteira)
                .name("1º Lote Antecipado")
                .price(new BigDecimal("15.00"))
                .originalPrice(new BigDecimal("20.00"))
                .totalQuantity(300)
                .availableQuantity(48)
                .active(true)
                .build();

        TicketBatch batchOpera2 = TicketBatch.builder()
                .category(catOperaInteira)
                .name("2º Lote Regular")
                .price(new BigDecimal("20.00"))
                .originalPrice(new BigDecimal("25.00"))
                .totalQuantity(500)
                .availableQuantity(500)
                .active(true)
                .build();

        TicketCategory catOperaMeia = TicketCategory.builder()
                .attraction(opera)
                .name("Meia-Entrada (Estudante / Idoso / PCD / Professor)")
                .description("Válido mediante apresentação de comprovação legal na catraca")
                .requiresDocumentProof(true)
                .build();
        ticketCategoryRepository.save(catOperaMeia);

        TicketBatch batchOperaMeia = TicketBatch.builder()
                .category(catOperaMeia)
                .name("Lote Promocional Meia")
                .price(new BigDecimal("7.50"))
                .originalPrice(new BigDecimal("10.00"))
                .totalQuantity(200)
                .availableQuantity(85)
                .active(true)
                .build();

        // Categorias e Lotes para MON
        TicketCategory catMonInteira = TicketCategory.builder()
                .attraction(mon)
                .name("Ingresso Inteira - Exposições MON")
                .description("Acesso a todas as salas expositivas e ao Olho")
                .requiresDocumentProof(false)
                .build();
        ticketCategoryRepository.save(catMonInteira);

        TicketBatch batchMon1 = TicketBatch.builder()
                .category(catMonInteira)
                .name("1º Lote Cultural")
                .price(new BigDecimal("30.00"))
                .originalPrice(new BigDecimal("35.00"))
                .totalQuantity(400)
                .availableQuantity(145)
                .active(true)
                .build();

        TicketCategory catMonMeia = TicketCategory.builder()
                .attraction(mon)
                .name("Meia-Entrada MON")
                .description("Desconto legal obrigatório")
                .requiresDocumentProof(true)
                .build();
        ticketCategoryRepository.save(catMonMeia);

        TicketBatch batchMonMeia = TicketBatch.builder()
                .category(catMonMeia)
                .name("Lote Único Meia")
                .price(new BigDecimal("15.00"))
                .originalPrice(new BigDecimal("15.00"))
                .totalQuantity(250)
                .availableQuantity(180)
                .active(true)
                .build();

        // Categorias e Lotes para Passeio de Trem
        TicketCategory catTremTuristica = TicketCategory.builder()
                .attraction(trem)
                .name("Classe Turística (Curitiba - Morretes)")
                .description("Viagem panorâmica pela Serra do Mar com serviço de bordo e guia")
                .requiresDocumentProof(false)
                .build();
        ticketCategoryRepository.save(catTremTuristica);

        TicketBatch batchTrem1 = TicketBatch.builder()
                .category(catTremTuristica)
                .name("1º Lote Serra do Mar")
                .price(new BigDecimal("175.00"))
                .originalPrice(new BigDecimal("195.00"))
                .totalQuantity(150)
                .availableQuantity(22)
                .active(true)
                .build();

        TicketBatch batchTrem2 = TicketBatch.builder()
                .category(catTremTuristica)
                .name("2º Lote Alta Temporada")
                .price(new BigDecimal("195.00"))
                .originalPrice(new BigDecimal("210.00"))
                .totalQuantity(250)
                .availableQuantity(250)
                .active(true)
                .build();

        ticketBatchRepository.saveAll(List.of(
                batchOpera1, batchOpera2, batchOperaMeia,
                batchMon1, batchMonMeia,
                batchTrem1, batchTrem2
        ));

        // Criar Pedidos e Ingressos Emitidos para visualização e validação (WF-017, WF-018, WF-031)
        User tourist = userRepository.findByEmail("turista@curitiba360.com.br").orElse(null);
        if (tourist != null) {
            Order order1 = Order.builder()
                    .orderNumber("CWB-2026-00421")
                    .customer(tourist)
                    .totalAmount(new BigDecimal("190.00"))
                    .discountAmount(new BigDecimal("0.00"))
                    .paymentMethod("PIX")
                    .status("PAID")
                    .createdAt(java.time.LocalDateTime.now().minusDays(1))
                    .build();
            orderRepository.save(order1);

            TicketItem ticket1 = TicketItem.builder()
                    .order(order1)
                    .attraction(opera)
                    .voucherCode("VCH-CWB-2026-9811")
                    .holderName("Vinicius Turista da Silva")
                    .holderDocument("333.444.555-66")
                    .categoryName("Ingresso Inteira - Acesso Geral")
                    .price(new BigDecimal("15.00"))
                    .visitDate(java.time.LocalDate.now().plusDays(2))
                    .status("VALID")
                    .build();

            TicketItem ticket2 = TicketItem.builder()
                    .order(order1)
                    .attraction(trem)
                    .voucherCode("VCH-CWB-2026-9812")
                    .holderName("Mariana Souza Santos")
                    .holderDocument("444.555.666-77")
                    .categoryName("Classe Turística (Curitiba - Morretes)")
                    .price(new BigDecimal("175.00"))
                    .visitDate(java.time.LocalDate.now().plusDays(2))
                    .status("VALID")
                    .build();

            Order order2 = Order.builder()
                    .orderNumber("CWB-2026-00398")
                    .customer(tourist)
                    .totalAmount(new BigDecimal("30.00"))
                    .discountAmount(BigDecimal.ZERO)
                    .paymentMethod("CREDIT_CARD")
                    .status("PAID")
                    .createdAt(java.time.LocalDateTime.now().minusDays(3))
                    .build();
            orderRepository.save(order2);

            TicketItem ticket3 = TicketItem.builder()
                    .order(order2)
                    .attraction(mon)
                    .voucherCode("VCH-CWB-2026-4412")
                    .holderName("Carlos Alberto Rocha")
                    .holderDocument("555.666.777-88")
                    .categoryName("Ingresso Inteira - Exposições MON")
                    .price(new BigDecimal("30.00"))
                    .visitDate(java.time.LocalDate.now().minusDays(1))
                    .status("USED")
                    .usedAt(java.time.LocalDateTime.now().minusHours(5))
                    .validatedBy("Catraca MON - Portaria Principal")
                    .build();

            Order order3 = Order.builder()
                    .orderNumber("CWB-2026-00215")
                    .customer(tourist)
                    .totalAmount(new BigDecimal("15.00"))
                    .discountAmount(BigDecimal.ZERO)
                    .paymentMethod("PIX")
                    .status("CANCELLED")
                    .createdAt(java.time.LocalDateTime.now().minusDays(7))
                    .build();
            orderRepository.save(order3);

            TicketItem ticket4 = TicketItem.builder()
                    .order(order3)
                    .attraction(opera)
                    .voucherCode("VCH-CWB-2026-3390")
                    .holderName("Renata Figueiredo")
                    .holderDocument("666.777.888-99")
                    .categoryName("Meia-Entrada (Estudante / Idoso)")
                    .price(new BigDecimal("15.00"))
                    .visitDate(java.time.LocalDate.now().minusDays(6))
                    .status("CANCELLED")
                    .build();

            ticketItemRepository.saveAll(List.of(ticket1, ticket2, ticket3, ticket4));
        }
    }

    private void seedCoupons() {
        Coupon c1 = Coupon.builder()
                .code("CURITIBA360")
                .discountType("PERCENTAGE")
                .discountValue(new BigDecimal("10.00"))
                .minPurchaseAmount(BigDecimal.ZERO)
                .maxUses(1000)
                .usedCount(142)
                .validFrom(java.time.LocalDate.now().minusDays(30))
                .validUntil(java.time.LocalDate.now().plusMonths(6))
                .active(true)
                .build();

        Coupon c2 = Coupon.builder()
                .code("CWBVERAO")
                .discountType("FIXED")
                .discountValue(new BigDecimal("20.00"))
                .minPurchaseAmount(new BigDecimal("100.00"))
                .maxUses(300)
                .usedCount(45)
                .validFrom(java.time.LocalDate.now().minusDays(10))
                .validUntil(java.time.LocalDate.now().plusMonths(3))
                .active(true)
                .build();

        Coupon c3 = Coupon.builder()
                .code("AGENCIA-CWB10")
                .discountType("PERCENTAGE")
                .discountValue(new BigDecimal("12.00"))
                .agencyId(1L)
                .agencyName("CWB City Tours")
                .maxUses(500)
                .usedCount(88)
                .validFrom(java.time.LocalDate.now().minusDays(20))
                .validUntil(java.time.LocalDate.now().plusMonths(12))
                .active(true)
                .build();

        Coupon c4 = Coupon.builder()
                .code("OPERA15")
                .discountType("PERCENTAGE")
                .discountValue(new BigDecimal("15.00"))
                .attractionId(2L)
                .attractionName("Ópera de Arame e Vale da Música")
                .maxUses(200)
                .usedCount(19)
                .validFrom(java.time.LocalDate.now().minusDays(5))
                .validUntil(java.time.LocalDate.now().plusMonths(2))
                .active(true)
                .build();

        couponRepository.saveAll(List.of(c1, c2, c3, c4));
    }
}

