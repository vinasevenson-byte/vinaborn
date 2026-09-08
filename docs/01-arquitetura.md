# 01 — Arquitetura do Sistema: Curitiba 360

## 1. Visão Geral
O **Curitiba 360** é uma plataforma integrada de turismo, cultura e entretenimento de Curitiba e Região Metropolitana, composta por dois grandes ambientes:

1. **Portal Público (E-commerce / Vitrine Turística)**:
   - Destinado ao **Visitante** e ao **Turista**.
   - Vitrine de atrações, eventos, pacotes promocionais e pontos turísticos ("Conhecendo Curitiba").
   - Mapa interativo de atrações.
   - Carrinho de compras, cupom de desconto e checkout seguro (Cartão, PIX e Google Pay).
   - Área do Turista: Meus Ingressos (com QR Code / Voucher digital), Meus Favoritos, Transferência de Ingressos (com regras anti-cambismo) e Solicitação de Reembolso.
   - Auto-cadastro para Agências de Turismo e Parceiros Comerciais (formulário em 3 etapas com aprovação no Backoffice).

2. **Backoffice Administrativo e Operacional**:
   - Destinado a **Administradores**, **Parceiros Comerciais**, **Editores**, **Leitores**, **Agências** e **Agentes**.
   - Gestão de Usuários e Perfis de Acesso com controle granular (RBAC).
   - Gestão de Atrações (Cadastro em 3 etapas, Categorias de Ingressos, Lotes, Cupons normais e de Agência, Gráficos de Analytics GA4, Gestão Financeira, Despesas, Adiantamentos e Borderô).
   - Validação de Ingressos (Leitor de QR Code via câmera do dispositivo ou digitação manual).
   - Gestão de Parceiros Comerciais e Gestão de Agências (Estados de aprovação, bloqueio, suspensão).
   - Gestão de Agentes de Turismo (vinculados a agências, comissionamento e painel de vendas).
   - Operação Comercial e Comissionamento (Apuração de comissões, fechamento de períodos e repasses).
   - Gestão de Contratos de Atração e Agência com coleta de assinaturas via DocuSign.
   - Fila de Reembolsos com modais de aprovação total/parcial e estorno via Gateway.
   - Relatórios Financeiros Globais (9 relatórios completos com exportação em PDF e Excel/CSV).
   - Controle de Transferências / Painel Anti-Cambista (monitoramento por CPF e bloqueio manual).
   - CMS Institucional e Curadoria da Home (Banners, Atrações em Destaque, Avaliações do Google Places).
   - Central de Notificações (Templates de e-mail e push, réguas de automação e campanhas).

---

## 2. Stack Tecnológica

### Frontend
- **Framework Principal:** React (v18+) com **Vite** (alta velocidade de compilação e HMR).
- **Linguagem:** JavaScript / TypeScript.
- **Roteamento:** React Router DOM (v6+), separando rotas públicas (`/portal/...`) e rotas administrativas (`/backoffice/...`).
- **Estilização & UI:** Tailwind CSS + biblioteca de componentes reutilizáveis (Shadcn UI / Tailwind UI patterns) + ícones Lucide React.
- **Gerenciamento de Estado & Requisições:** TanStack React Query + Context API (para Autenticação e Carrinho) + Axios.
- **Validação de Formulários:** React Hook Form + Zod.
- **Utilitários:** `canvas-confetti` (confirmação), `qrcode.react` / `html5-qrcode` (geração e leitura de QR Code na câmera), `date-fns` (formatação de datas).

### Backend
- **Linguagem & Plataforma:** Java (v21 / v25 OpenJDK) com **Spring Boot 3**.
- **Segurança & Autenticação:** Spring Security + JWT (jjwt) com Access Token e Refresh Token, proteção CORS e criptografia BCrypt.
- **Camada de Dados & Persistência:** Spring Data JPA / Hibernate com PostgreSQL (e H2 embarcado para agilidade de desenvolvimento local).
- **Validação:** Jakarta Bean Validation (`@Valid`, `@NotNull`, `@NotBlank`, etc.).
- **Arquitetura:** RESTful API dividida em camadas (`Controller` -> `Service` -> `Repository` -> `Model/Entity`), com DTOs tipados.
- **Documentação de API:** OpenAPI 3 / Swagger (SpringDoc).

### Banco de Dados
- **SGBD:** PostgreSQL (desenvolvimento ágil com SQLite/PostgreSQL e migrations versionadas via Prisma ORM).
- **Modelagem:** Estrutura relacional normalizada para integridade de transações, ingressos, lotes e controle de estoque de ingressos em concorrência.

---

## 3. Estrutura de Diretórios Recomendada

```text
VINA_BORN/
│
├── frontend/                     # Aplicação React (Portal Público + Backoffice)
│   ├── public/
│   │   ├── favicon.ico
│   │   └── wireframes/           # Referência visual de telas
│   ├── src/
│   │   ├── assets/               # Imagens, logos, ícones vetoriais
│   │   ├── components/           # Componentes atômicos e reutilizáveis (Design System)
│   │   │   ├── ui/               # Botões, Inputs, Modais, Cards, Tabelas, Badges, Tabs
│   │   │   ├── layouts/          # Layout Portal (Header, Footer) e Layout Backoffice (Sidebar, Topbar)
│   │   │   └── feedback/         # Toasts, Loaders, Alertas, EmptyStates
│   │   ├── contexts/             # AuthContext, CartContext, NotificationContext
│   │   ├── hooks/                # useAuth, useCart, useDebounce, usePermission
│   │   ├── pages/
│   │   │   ├── portal/           # Telas do Portal Público (WF-001 a WF-022+)
│   │   │   │   ├── Home/
│   │   │   │   ├── AttractionDetails/
│   │   │   │   ├── Search/
│   │   │   │   ├── Cart/
│   │   │   │   ├── Checkout/
│   │   │   │   ├── OrderConfirmation/
│   │   │   │   ├── MyTickets/
│   │   │   │   └── Auth/
│   │   │   └── backoffice/       # Telas do Backoffice (WF-001 a WF-064+)
│   │   │       ├── Dashboard/
│   │   │       ├── Attractions/
│   │   │       ├── Agencies/
│   │   │       ├── Agents/
│   │   │       ├── Partners/
│   │   │       ├── Users/
│   │   │       ├── Contracts/
│   │   │       ├── Financial/
│   │   │       ├── Refunds/
│   │   │       ├── AntiScalping/
│   │   │       └── CMS/
│   │   ├── services/             # Chamadas de API organizadas por módulo (apiClient)
│   │   ├── routes/               # Definição de Rotas com Guards por Perfil (RBAC)
│   │   ├── utils/                # Formatadores de moeda (BRL), CPF/CNPJ, datas, validações
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/                      # API RESTful em Node.js
│   ├── src/
│   │   ├── config/               # Variáveis de ambiente, conexão do DB
│   │   ├── controllers/          # Tratam requisições HTTP e respostas
│   │   ├── services/             # Regras de negócio, cálculos, transações
│   │   ├── repositories/         # Consultas e persistência no banco de dados
│   │   ├── middlewares/          # Auth JWT, validação de RBAC, rate-limiting, error handler
│   │   ├── routes/               # Rotas separadas por domínio (/auth, /attractions, /orders...)
│   │   ├── utils/                # Helpers de QR Code, assinaturas, cálculos de comissão
│   │   └── server.js
│   ├── package.json
│   └── prisma/ (ou migrations/)  # Esquemas e scripts de migração do banco
│
├── database/                     # Seeds, diagramas ER e scripts de banco
│
└── docs/                         # Documentação, SRS, especificações e wireframes
    ├── 01-arquitetura.md
    ├── 02-requisitos.md
    ├── 03-banco-de-dados.md
    ├── 04-mapa-de-telas.md
    ├── 05-regras-do-projeto.md
    ├── wireframes-backoffice/
    └── wireframes-portal/
```

---

## 4. Estratégia de Perfis e Permissões (RBAC)

O sistema possui **8 perfis** formais:
1. **Administrador**: Acesso irrestrito a todos os módulos, relatórios globais, configurações financeiras e aprovações.
2. **Parceiro Comercial**: Visualiza e gerencia exclusivamente as suas atrações, ingressos, lotes, relatórios de vendas, repasses e conta GA4 vinculada.
3. **Editor**: Edição de conteúdo, atrações e CMS, sem acesso a dados financeiros sensíveis ou repasses.
4. **Leitor**: Apenas visualização de cadastros e relatórios permitidos, sem permissão de gravação/exclusão.
5. **Agência**: Acesso à Gestão de seus Agentes, Operação Comercial (vendas via agência), Cupons de Agência e extrato de Comissões.
6. **Agente**: Visualiza seu próprio painel de vendas, comissões individuais e emissão de ingressos/cupons autorizados.
7. **Turista**: Usuário final autenticado no Portal Público (compra, histórico de ingressos, transferência e favoritos).
8. **Visitante**: Usuário público não autenticado que navega pela vitrine de atrações.
