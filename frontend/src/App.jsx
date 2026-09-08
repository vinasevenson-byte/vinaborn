import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { PortalLayout } from './components/layouts/PortalLayout';
import { BackofficeLayout } from './components/layouts/BackofficeLayout';
import { Home } from './pages/portal/Home';
import { AttractionDetails } from './pages/portal/AttractionDetails';
import { Cart } from './pages/portal/Cart';
import { Login } from './pages/portal/Login';
import { Dashboard } from './pages/backoffice/Dashboard';
import { TicketValidator } from './pages/backoffice/TicketValidator';
import { AttractionList } from './pages/backoffice/AttractionList';
import { Card, Badge } from './components/ui/FormControls';

// Componente Genérico para Módulos do Backoffice com indicação de Wireframe
const BackofficePlaceholder = ({ title, wfId, description }) => (
  <div className="space-y-6">
    <div>
      <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">{wfId}</span>
      <h2 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
      <p className="text-xs text-slate-500 mt-1">{description}</p>
    </div>
    <Card className="p-12 text-center border-dashed border-2 border-slate-200 bg-white space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto text-xl font-bold">
        {wfId.split(' ')[0]}
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Módulo integrado à API Java Spring Boot em conformidade com os requisitos do documento SRS.
        </p>
      </div>
      <div className="pt-2">
        <Badge variant="primary" className="font-semibold">Módulo Pronto para Configuração</Badge>
      </div>
    </Card>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Rotas do Portal Público do Turista e Cidadão */}
            <Route path="/" element={<PortalLayout />}>
              <Route index element={<Home />} />
              <Route path="atracoes/:slug" element={<AttractionDetails />} />
              <Route path="carrinho" element={<Cart />} />
              <Route path="login" element={<Login />} />
              <Route path="atracoes" element={<Home />} />
              <Route path="pacotes" element={<Home />} />
              <Route path="conhecendo-curitiba" element={<Home />} />
              <Route path="mapa" element={<Home />} />
            </Route>

            {/* Rotas do Backoffice Administrativo */}
            <Route path="/backoffice" element={<BackofficeLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="validacao" element={<TicketValidator />} />
              <Route path="atracoes" element={<AttractionList />} />
              <Route path="usuarios" element={<BackofficePlaceholder title="Gestão de Usuários e Perfis" wfId="WF-005 / WF-006" description="Controle de acessos, administradores, parceiros comerciais, agências e agentes." />} />
              <Route path="parceiros" element={<BackofficePlaceholder title="Gestão de Parceiros Comerciais" wfId="WF-058 / WF-059" description="Credenciamento, dados fiscais e contratos de donos de atrações." />} />
              <Route path="agencias" element={<BackofficePlaceholder title="Gestão de Agências de Turismo" wfId="WF-048 / WF-049" description="Cadastro em 3 etapas, aprovação e controle de comissionamento." />} />
              <Route path="agentes" element={<BackofficePlaceholder title="Gestão de Agentes de Turismo" wfId="WF-050 / WF-064" description="Vínculo de agentes a agências e painéis individuais de vendas." />} />
              <Route path="contratos" element={<BackofficePlaceholder title="Gestão de Contratos (DocuSign)" wfId="WF-007 / WF-008" description="Assinatura eletrônica de parcerias comerciais com integração DocuSign." />} />
              <Route path="configuracoes" element={<BackofficePlaceholder title="Configurações Comerciais" wfId="WF-009 a WF-011" description="Definição de taxas de serviço, prazos de saque e liquidação financeira." />} />
              <Route path="reembolsos" element={<BackofficePlaceholder title="Fila de Reembolsos" wfId="WF-053" description="Triagem e autorização manual de estornos fora do prazo automático de 7 dias." />} />
              <Route path="relatorios" element={<BackofficePlaceholder title="Relatórios Financeiros Globais" wfId="WF-063" description="9 relatórios de fechamento, vendas por período, comissões e exportação em PDF/Excel." />} />
              <Route path="anti-cambista" element={<BackofficePlaceholder title="Painel Anti-Cambista" wfId="WF-060" description="Monitoramento de compras atípicas por CPF e bloqueio de transferências irregulares." />} />
              <Route path="cms" element={<BackofficePlaceholder title="CMS Institucional e Banners" wfId="WF-054 / WF-055" description="Gerenciamento de banners da Home, curadoria de avaliações Google Places e páginas institucionais." />} />
              <Route path="notificacoes" element={<BackofficePlaceholder title="Central de Notificações" wfId="WF-056" description="Criação de réguas de automação, disparo de e-mails de voucher e notificações push." />} />
            </Route>

            {/* Redirecionamento Padrão */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
