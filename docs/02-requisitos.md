# 02 — Requisitos Funcionais e Regras de Negócio: Curitiba 360

Este documento sintetiza os requisitos funcionais formais extraídos dos documentos de SRS do Backoffice e do Portal Público.

---

## 1. Módulos e Requisitos do Backoffice (RF-001 a RF-040)

| ID RF | Nome do Requisito | Módulo | Descrição Resumida |
|---|---|---|---|
| **RF-001** | Autenticação e Recuperação de Senha | MOD-01 Autenticação | Login com e-mail/senha, bloqueio após 5 tentativas falhas, recuperação via token expira em 30 min. |
| **RF-002** | Estrutura de Navegação e Menu | Plataforma | Menu lateral responsivo com colapso, ordenação conforme perfil de acesso (RBAC). |
| **RF-003** | Dashboard Consolidado | MOD-02 Dashboard | Cards de métricas (vendas hoje, mês, ticket médio, ingressos ativos), gráfico temporal de vendas. |
| **RF-004** | Listagem de Atrações | MOD-09 Atrações | Tabela paginada, filtros por categoria/status/parceiro, ações rápidas (ativar/desativar, ver detalhes). |
| **RF-005** | Perfil do Usuário e Integração GA4 | MOD-01 Autenticação | Gestão de dados cadastrais, alteração de senha e vínculo de conta Google Analytics 4. |
| **RF-006** | Gestão de Usuários do Sistema | MOD-03 Usuários | Listagem de usuários internos, busca por nome/email/perfil, ativação e inativação lógica. |
| **RF-007** | Cadastro e Edição de Usuários | MOD-03 Usuários | Formulário de criação/edição com definição de perfil (Administrador, Editor, Leitor, Parceiro). |
| **RF-008** | Gestão de Contratos de Atração | MOD-07 Contratos | Criação de contratos de parceria, anexo de PDF, integração DocuSign para coleta de assinaturas. |
| **RF-009** | Gestão de Contratos de Agência | MOD-07 Contratos | Emissão e acompanhamento de contrato com Agência. Status "Ativo" libera vendas da agência. |
| **RF-010** | Condições Comerciais (Taxas) | MOD-08 Configurações | Definição de taxas de comissão padrão e personalizadas por atração ou parceiro comercial. |
| **RF-011** | Informações Financeiras e Saques | MOD-08 Configurações | Parâmetros de repasse, prazos de liquidação, dados bancários para repasse aos parceiros. |
| **RF-012** | Cadastro de Atração (Etapa 1 - Dados Gerais) | MOD-09 Atrações | Nome, resumo, descrição completa, parceiro responsável, endereço, coordenadas no mapa. |
| **RF-013** | Cadastro de Atração (Etapa 2 - Mídia e Horários) | MOD-09 Atrações | Upload de foto de capa, galeria de fotos, dias e horários de funcionamento, regras de visita. |
| **RF-014** | Cadastro de Atração (Etapa 3 - Categorias) | MOD-09 Atrações | Definição de categorias de público (Adulto, Estudante, Idoso, Morador CWB) e documentação exigida. |
| **RF-015** | Gestão de Lotes de Ingressos | MOD-14 Ingressos | Criação de lotes por categoria, preço por lote, quantidade disponível e período de vigência. |
| **RF-016** | Pesquisa de Ingressos Emitidos | MOD-14 Ingressos | Busca avançada por código do voucher, CPF do comprador, data de compra e atração. |
| **RF-017** | Detalhes do Ingresso Emitido | MOD-14 Ingressos | Exibição de histórico do voucher: data de emissão, status (Válido, Utilizado, Cancelado, Transferido). |
| **RF-018** | Gestão de Cupons de Desconto | MOD-14 Ingressos | Criação de cupons percentuais ou em valor fixo, limite de usos, data de validade e cupons por agência. |
| **RF-019** | Gráficos e Analytics da Atração | MOD-16 Analytics | Visualização de acessos, conversão e dados de audiência sincronizados com a API do Google Analytics 4. |
| **RF-020** | Gestão de Usuários da Atração | MOD-09 Atrações | Vinculação de operadores e validadores específicos para aquela atração. |
| **RF-021** | Gestão de Imagens e Galeria | MOD-09 Atrações | Ordenação drag-and-drop de fotos da atração, definição de foto principal para a vitrine. |
| **RF-022** | Relatórios Financeiros da Atração | MOD-17 Finanças Atração | Vendas por período, abandono de carrinho, cortesias emitidas e demonstrativo de receitas. |
| **RF-023** | Resumo de Despesas e Negociação | MOD-17 Finanças Atração | Registro de custos operacionais e histórico de negociações financeiras da atração. |
| **RF-024** | Solicitação e Autorização de Repasse | MOD-17 Finanças Atração | Fluxo de solicitação de repasse pelo parceiro e autorização/execução pelo administrador. |
| **RF-025** | Validação de Ingressos via QR Code | MOD-15 Validação | Leitor de câmera do dispositivo para leitura instantânea do voucher com feedback sonoro e visual. |
| **RF-026** | Gestão de Agências de Turismo | MOD-05 Agências | Listagem, aprovação de auto-cadastro, bloqueio/suspensão e histórico de vendas da agência. |
| **RF-027** | Cadastro e Edição de Agência | MOD-05 Agências | Formulário de dados cadastrais (CNPJ, Razão Social), responsável e dados bancários. |
| **RF-028** | Gestão de Agentes de Turismo | MOD-06 Agentes | Cadastro de agentes subordinados a uma agência, transferência de agência e bloqueio em cascata. |
| **RF-029** | Operação Comercial (Agência/Agente) | MOD-05 Agências | Painel de vendas do canal indireto, cancelamento de venda dentro da janela legal de 24h. |
| **RF-030** | Comissionamento e Fechamento | MOD-05 Agências | Apuração automática de percentuais devidos a agências/agentes e geração do lote de repasse. |
| **RF-031** | Fila de Reembolsos | MOD-10 Reembolsos | Triagem de solicitações manuais de estorno, aprovação integral ou parcial com estorno no gateway. |
| **RF-032** | CMS de Páginas Institucionais | MOD-13 CMS | Editor de conteúdo para Termos de Uso, Política de Privacidade, FAQ e Quem Somos. |
| **RF-033** | CMS Home e Curadoria | MOD-13 CMS | Configuração de banners do carrossel, seleção manual de atrações imperdíveis e moderação do Google Places. |
| **RF-034** | Central de Notificações | MOD-14 Notificações | Criação de templates de e-mail e push, gatilhos de eventos automáticos e disparos manuais. |
| **RF-035** | Painel de Notificações Recebidas | Plataforma | Ícone de sino com avisos em tempo real para administradores e parceiros comerciais. |
| **RF-036** | Gestão de Parceiros Comerciais | MOD-04 Parceiros | Listagem de empresas parceiras, status de aprovação cadastral e bloqueio. |
| **RF-037** | Cadastro de Parceiro Comercial | MOD-04 Parceiros | Formulário detalhado com validação de CNPJ, contratos vinculados e contatos comerciais. |
| **RF-038** | Painel Anti-Cambista e Transferências | MOD-12 Anti-Cambismo | Monitoramento de transferências atípicas por CPF, bloqueio preventivo e limite por período. |
| **RF-039** | Relatórios Financeiros Globais | MOD-11 Relatórios Globais | 9 relatórios consolidados (vendas, comissões, cancelamentos, borderô) com exportação PDF/Excel. |
| **RF-040** | Gestão de Pacotes de Ingressos | MOD-09 Atrações | Criação de combos com ingressos de múltiplas atrações parceiras com desconto agressivo. |

---

## 2. Módulos e Requisitos do Portal Público (RF-041 a RF-066)

| ID RF | Nome do Requisito | Área | Descrição Resumida |
|---|---|---|---|
| **RF-041** | Home Page / Vitrine Turística | Portal | Carrossel de banners, categorias em destaque, lista de imperdíveis e avaliações curadas. |
| **RF-042** | Autenticação do Turista | Portal | Login com e-mail e senha, "Lembrar-me" e recuperação de senha por e-mail com token. |
| **RF-043** | Login Social com Google | Portal | Autenticação via Google OAuth 2.0 (criação automática ou vínculo de conta de turista). |
| **RF-044** | Cadastro de Turista | Portal | Formulário de criação de conta com validação de CPF e aceite obrigatório de termos LGPD. |
| **RF-045** | Pesquisa e Busca Global | Portal | Campo de pesquisa com autocomplete por nome da atração, categoria ou ponto turístico. |
| **RF-046** | Filtros Avançados de Pesquisa | Portal | Filtros por data, faixa de preço, categoria de atração, acessibilidade e ordenação. |
| **RF-047** | Página de Detalhes da Atração | Portal | Fotos em alta resolução, carrossel de fotos, horários, localização com mapa, regras de acesso. |
| **RF-048** | Seleção de Ingressos e Datas | Portal | Calendário de agendamento, seletor de quantidade por categoria (Adulto, Meia, etc.) e cálculo em tempo real. |
| **RF-049** | Carrinho de Compras | Portal | Lista de ingressos selecionados, temporizador de reserva de estoque (15 min), aplicação de cupom. |
| **RF-050** | Checkout e Identificação de Portadores | Portal | Dados de faturamento e preenchimento opcional do nome/documento de cada portador do ingresso. |
| **RF-051** | Pagamento via Cartão de Crédito | Portal | Integração transparente com gateway, parcelamento conforme regras comerciais e tokenização. |
| **RF-052** | Pagamento via PIX | Portal | Geração instantânea de QR Code dinâmico e código "Copia e Cola" com tempo de expiração de 15 min. |
| **RF-053** | Pagamento via Google Pay | Portal | Carteira digital para checkout rápido em dispositivos móveis e navegadores compatíveis. |
| **RF-054** | Tela de Pedido Confirmado e Voucher | Portal | Exibição do resumo da compra, botão de download do voucher em PDF e código QR Code legível. |
| **RF-055** | Área do Turista: Meus Ingressos | Portal | Listagem de vouchers ativos, utilizados e expirados, com opção de reimpressão ou visualização offline. |
| **RF-056** | Transferência de Ingresso (Anti-Cambismo) | Portal | Envio de voucher para outro CPF/e-mail cadastrado, respeitando limites máximos por usuário/período. |
| **RF-057** | Solicitação de Cancelamento/Reembolso | Portal | Turista solicita cancelamento direto na plataforma dentro do prazo de arrependimento legal (7 dias). |
| **RF-058** | Área do Turista: Meus Favoritos | Portal | Lista de atrações salvas com coração, persistidas no banco para usuários autenticados. |
| **RF-059** | Auto-cadastro de Agências de Turismo | Portal | Formulário público em 3 etapas para agências se cadastrarem e enviarem documentos para análise. |
| **RF-060** | Auto-cadastro de Parceiros Comerciais | Portal | Formulário público em 3 etapas para proprietários de atrações solicitarem credenciamento. |
| **RF-061** | Mapa Interativo de Curitiba | Portal | Mapa interativo com pins das atrações, filtros visuais por tipo de experiência e rotas sugeridas. |
| **RF-062** | Vitrine de Pacotes de Ingressos | Portal | Página dedicada aos combos turísticos ("Conhecendo Curitiba", "Circuito Cultural", etc.). |
| **RF-063** | Banner de Consentimento de Cookies (LGPD) | Portal | Modal/Banner inferior com opções de aceite essencial ou completo e link para a política. |
| **RF-064** | Seletor de Idioma (PT-BR e EN) | Portal | Alternância bilíngue da interface para atender turistas estrangeiros. |
| **RF-065** | Central de Ajuda e FAQ Dinâmico | Portal | Perguntas frequentes categorizadas alimentadas pelo módulo de CMS do Backoffice. |
| **RF-066** | Página "Conhecendo Curitiba" | Portal | Conteúdo editorial com roteiros turísticos, história dos pontos mais icônicos e dicas da cidade. |
