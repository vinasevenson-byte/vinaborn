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
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            seedUsers();
        }
        if (attractionRepository.count() == 0) {
            seedAttractions();
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
}
