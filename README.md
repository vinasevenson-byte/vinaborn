# Curitiba 360 — Sistema Integrado de Turismo & Bilhetagem

Plataforma oficial de turismo, entretenimento e comercialização de ingressos de Curitiba e Região Metropolitana, composta por:
1. **Portal Público (E-commerce do Turista e Cidadão)** — 49 Telas
2. **Backoffice Administrativo e Operacional** — 71 Telas
3. **Backend API RESTful em Java 21 / Spring Boot 3**

---

## 🛠️ Stack Tecnológica

- **Frontend:** React 18, Vite, Tailwind CSS v4, React Router DOM v6, Lucide React Icons.
- **Backend:** Java (OpenJDK 25/21), Spring Boot 3, Spring Security, Spring Data JPA, Hibernate, JWT (jjwt), Lombok.
- **Banco de Dados:** H2 Database (em arquivo persistente local para desenvolvimento ágil) / PostgreSQL (em produção).

---

## 🚀 Como Executar o Projeto

### 1. Iniciar o Backend (Java Spring Boot)
Em um terminal, execute:
```bash
cd backend
.\mvnw.cmd spring-boot:run
```
* A API estará rodando em: `http://localhost:8080`
* Console visual do Banco H2: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:file:./data/curitiba360db`)

### 2. Iniciar o Frontend (React com Vite)
Em outro terminal, execute:
```bash
cd frontend
npm run dev
```
* O sistema abrirá em: `http://localhost:5173`

---

## 🔑 Credenciais Pré-Cadastradas para Testes (DataInitializer)

| Perfil | E-mail | Senha | Módulos com Acesso |
|---|---|---|---|
| **Administrador** | `admin@curitiba360.com.br` | `admin123` | Acesso total ao Backoffice e Portal |
| **Parceiro Comercial** | `parceiro@curitiba360.com.br` | `parceiro123` | Dashboard, Suas Atrações e Lotes |
| **Turista** | `turista@curitiba360.com.br` | `turista123` | Vitrine, Compra e Meus Vouchers |

*(Na tela de login há botões de preenchimento rápido com 1 clique para testar qualquer um desses perfis instantaneamente).*

---

## 📂 Documentação e Engenharia de Software (Pasta `docs/`)

- [`docs/01-arquitetura.md`](./docs/01-arquitetura.md) — Visão geral, stack tecnológica e estrutura de pastas.
- [`docs/02-requisitos.md`](./docs/02-requisitos.md) — Requisitos funcionais formais do Backoffice (`RF-001` a `RF-040`) e Portal (`RF-041` a `RF-066`).
- [`docs/03-banco-de-dados.md`](./docs/03-banco-de-dados.md) — Modelagem do banco, diagrama ER e dicionário de dados.
- [`docs/04-mapa-de-telas.md`](./docs/04-mapa-de-telas.md) — Mapeamento detalhado das **120 telas** (71 Backoffice + 49 Portal Público).
- [`docs/05-regras-do-projeto.md`](./docs/05-regras-do-projeto.md) — Constituição técnica e diretrizes de desenvolvimento.
