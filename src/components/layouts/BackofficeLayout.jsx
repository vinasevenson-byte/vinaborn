import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  UserCheck,
  FileSignature,
  Settings,
  Ticket,
  QrCode,
  RotateCcw,
  BarChart3,
  ShieldAlert,
  FileText,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ChevronDown,
  Landmark,
  Megaphone,
  Magnet
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ErrorBoundary } from '../common/ErrorBoundary';

export const BackofficeLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Ordem rigorosa alinhada ao SRS
  const menuItems = [
    { label: 'Dashboard', path: '/backoffice', icon: LayoutDashboard, badge: null },
    { label: 'Gestão de Usuários', path: '/backoffice/usuarios', icon: Users, badge: null },
    { label: 'Parceiros Comerciais', path: '/backoffice/parceiros', icon: Building2, badge: '2' },
    { label: 'Gestão de Agências', path: '/backoffice/agencias', icon: Briefcase, badge: null },
    { label: 'Gestão de Agentes', path: '/backoffice/agentes', icon: UserCheck, badge: null },
    { label: 'Gestão de Contratos', path: '/backoffice/contratos', icon: FileSignature, badge: null },
    { label: 'Configurações Comerciais', path: '/backoffice/configuracoes', icon: Settings, badge: null },
    { label: 'Gestão de Atrações', path: '/backoffice/atracoes', icon: Landmark, badge: null },
    { label: 'Ingressos', path: '/backoffice/ingressos', icon: Ticket, badge: 'WF-017' },
    { label: 'Validação de Ingressos', path: '/backoffice/validacao', icon: QrCode, badge: 'QR' },
    { label: 'Fila de Reembolsos', path: '/backoffice/reembolsos', icon: RotateCcw, badge: '5' },
    { label: 'Relatórios Financeiros', path: '/backoffice/relatorios', icon: BarChart3, badge: null },
    { label: 'Controle Anti-Cambista', path: '/backoffice/anti-cambista', icon: ShieldAlert, badge: null },
    { label: 'Marketing', path: '/backoffice/marketing', icon: Megaphone, badge: 'NOVO', section: 'Tração e Vendas' },
    { label: 'Remarketing', path: '/backoffice/remarketing', icon: Magnet, badge: 'NOVO' },
    { label: 'Conteúdo (CMS)', path: '/backoffice/cms', icon: FileText, badge: null },
    { label: 'Notificações', path: '/backoffice/notificacoes', icon: Bell, badge: null },
  ];

  return (
    <div className="min-h-screen flex bg-slate-100 text-slate-900">
      {/* Sidebar Lateral */}
      <aside
        className={`bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-all duration-300 fixed inset-y-0 left-0 z-50 ${
          collapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Topo da Sidebar */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800">
          {!collapsed ? (
            <Link to="/backoffice" className="flex items-center gap-3 py-1">
              <img
                src="/logos/official_curitiba360_horizontal.png"
                alt="Curitiba 360"
                className="h-10 object-contain max-w-[200px]"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  360
                </div>
                <div>
                  <span className="font-extrabold text-base text-white tracking-tight block">CURITIBA 360</span>
                  <span className="text-[9px] text-sky-400 font-semibold tracking-wider uppercase block">Experiências • Cultura</span>
                </div>
              </div>
            </Link>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white font-bold text-lg mx-auto">
              360
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={collapsed ? "Expandir Menu" : "Recolher Menu"}
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Itens de Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <React.Fragment key={item.path}>
                {item.section && !collapsed && (
                  <div className="mt-5 mb-2 px-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {item.section}
                  </div>
                )}
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                    isActive
                      ? 'bg-sky-600 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                  {!collapsed && <span className="truncate flex-1">{item.label}</span>}
                  {!collapsed && item.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.badge === 'NOVO'
                        ? 'bg-[#009de2] text-white shadow-xs'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Rodapé da Sidebar: Ir para o Portal */}
        <div className="p-4 border-t border-slate-800">
          <Link
            to="/"
            target="_blank"
            className={`flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800 ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <ExternalLink className="w-4 h-4 text-sky-400" />
            {!collapsed && <span>Ver Portal Público</span>}
          </Link>
        </div>
      </aside>

      {/* Área Principal */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? 'pl-20' : 'pl-72'}`}>
        {/* Topbar Superior */}
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200 h-20 px-8 flex items-center justify-between shadow-xs">
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">Painel Administrativo</h1>
            <p className="text-xs text-slate-500">Visão geral do Curitiba 360</p>
          </div>

          <div className="flex items-center gap-5">
            {/* Seletor de Data */}
            <div className="relative hidden md:block">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-700 bg-white shadow-xs transition-colors">
                <span>Hoje</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            {/* Status de Atualização */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Atualizado há 2 min</span>
            </div>

            {/* Notificações */}
            <button className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white">
                3
              </span>
            </button>

            {/* Perfil do Usuário */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="w-10 h-10 rounded-full bg-sky-700 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                A
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-bold text-slate-900 leading-tight">Administrador</p>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 inline-block mt-0.5">
                  ADMIN
                </span>
              </div>
              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
                title="Encerrar Sessão"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Conteúdo Dinâmico */}
        <main className="flex-1 p-8">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};
