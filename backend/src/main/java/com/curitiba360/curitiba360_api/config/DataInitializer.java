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
}

