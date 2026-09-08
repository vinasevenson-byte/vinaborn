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
import { PartnersManagement } from './pages/backoffice/PartnersManagement';
import { AgencyManagement } from './pages/backoffice/AgencyManagement';
import { ContractManagement } from './pages/backoffice/ContractManagement';
import { TicketManagement } from './pages/backoffice/TicketManagement';
import { RefundsManagement } from './pages/backoffice/RefundsManagement';
import { AntiScalpingPanel } from './pages/backoffice/AntiScalpingPanel';
import { FinancialReports } from './pages/backoffice/FinancialReports';
import { CmsManagement } from './pages/backoffice/CmsManagement';
import { NotificationCenter } from './pages/backoffice/NotificationCenter';
import { UsersManagement } from './pages/backoffice/UsersManagement';
import { CommercialSettings } from './pages/backoffice/CommercialSettings';
import { AgentsManagement } from './pages/backoffice/AgentsManagement';


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
              <Route path="ingressos" element={<TicketManagement />} />
              <Route path="usuarios" element={<UsersManagement />} />
              <Route path="parceiros" element={<PartnersManagement />} />
              <Route path="agencias" element={<AgencyManagement />} />
              <Route path="agentes" element={<AgentsManagement />} />
              <Route path="contratos" element={<ContractManagement />} />
              <Route path="configuracoes" element={<CommercialSettings />} />
              <Route path="reembolsos" element={<RefundsManagement />} />
              <Route path="relatorios" element={<FinancialReports />} />
              <Route path="anti-cambista" element={<AntiScalpingPanel />} />
              <Route path="cms" element={<CmsManagement />} />
              <Route path="notificacoes" element={<NotificationCenter />} />
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
