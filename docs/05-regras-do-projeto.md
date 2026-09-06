# 05 — Regras do Projeto (Constituição Técnica)

Este documento estabelece as diretrizes irrevogáveis de arquitetura, desenvolvimento e boas práticas para toda a construção do sistema **Curitiba 360**. Toda alteração no código deverá respeitar rigorosamente os 10 princípios abaixo:

---

## 🏛️ Os 10 Mandamentos do Projeto

1. **Respeitar a Arquitetura em Fases:**
   - Não pular etapas. O desenvolvimento segue rigorosamente o fluxo:
     `Documentação/Contratos -> Banco & Backend -> Design System & Layout Base -> Telas por Módulos`.

2. **Não Duplicar Componentes (Reaproveitamento Mandatório):**
   - Antes de criar qualquer novo componente visual, verificar a pasta `src/components/ui/` e os layouts existentes. Botões, modais, formulários, tabelas, filtros e badges devem ser padronizados e reutilizados.

3. **Fidelidade Rigorosa aos Wireframes e Requisitos (SRS):**
   - Toda tela deve implementar os campos, botões, estados vazios e comportamentos descritos no respectivo wireframe (`WF-xxx`) e documento de requisitos (`RF-xxx`).

4. **Nenhum Dado Fictício Desconectado (Contratos Tipados):**
   - Todo formulário e listagem deve consumir modelos reais de dados através de services centralizados (`src/services/`). Quando dados mockados forem necessários temporariamente, eles devem respeitar a tipagem estrita do banco de dados e da API.

5. **Isolamento de Ambientes (Portal vs. Backoffice):**
   - O Portal Público (`/portal` ou `/`) e o Backoffice (`/backoffice`) possuem layouts, permissões e temas distintos, porém compartilham a mesma biblioteca base de componentes utilitários e serviços de API.

6. **Segurança e Controle de Acesso por Perfil (RBAC):**
   - Toda rota protegida do Backoffice deve ser envelopada pelo componente de proteção de rotas (`ProtectedRoute`), validando o perfil do usuário logado (Administrador, Parceiro, Editor, Leitor, Agência, Agente).

7. **Consistência Visual e Responsividade:**
   - Todas as interfaces devem ser 100% responsivas (Desktop, Tablet e Mobile), utilizando classes utilitárias do Tailwind CSS, mantendo espaçamentos harmônicos, tipografia legível e contraste acessível (WCAG AA).

8. **Tratamento Universal de Erros e Feedbacks:**
   - Toda ação assíncrona (envio de formulário, exclusão, busca) deve conter:
     - Indicador visual de carregamento (*Loading State / Skeleton*);
     - Tratamento de sucesso (*Toast* de confirmação);
     - Tratamento de falha (*Toast* ou alerta de erro explicativo em português).

9. **Preservação de Código e Não-Regressão:**
   - Ao adicionar ou editar uma tela ou funcionalidade, nenhuma funcionalidade ou tela anterior pode ser quebrada ou ter sua assinatura alterada sem justificativa técnica prévia.

10. **Testabilidade e Commits Atômicos:**
    - Cada módulo implementado deve ser validado localmente e versionado no Git com mensagens claras e semânticas (ex: `feat(backoffice): implementar cadastro de atrações WF-013 a WF-015`).
