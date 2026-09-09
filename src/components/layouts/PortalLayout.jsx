import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, MapPin, Search, Compass, ShieldCheck, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { ErrorBoundary } from '../common/ErrorBoundary';

export const PortalLayout = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Banner de Acesso Rápido ao Backoffice / Boas-vindas */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Plataforma Oficial de Turismo de Curitiba e Região Metropolitana</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/backoffice" className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-medium transition-colors">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Acessar Backoffice Administrativo</span>
          </Link>
          <span className="text-slate-600">|</span>
          <span>PT-BR (R$)</span>
        </div>
      </div>

      {/* Header Principal */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
          {/* Logo Oficial */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/logos/curitiba360_official_header_logo.png"
              alt="Curitiba 360"
              className="h-12 w-auto object-contain group-hover:scale-102 transition-transform"
            />
          </Link>

          {/* Links de Navegação */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
            <Link to="/" className="hover:text-sky-600 transition-colors">Início</Link>
            <Link to="/atracoes" className="hover:text-sky-600 transition-colors">Atrações</Link>
            <Link to="/pacotes" className="hover:text-sky-600 transition-colors">Pacotes</Link>
            <Link to="/conhecendo-curitiba" className="hover:text-sky-600 transition-colors flex items-center gap-1">
              <Compass className="w-4 h-4 text-emerald-600" />
              Conhecendo Curitiba
            </Link>
            <Link to="/mapa" className="hover:text-sky-600 transition-colors flex items-center gap-1">
              <MapPin className="w-4 h-4 text-rose-500" />
              Mapa
            </Link>
          </nav>

          {/* Ações: Carrinho e Usuário */}
          <div className="flex items-center gap-4">
            <Link
              to="/carrinho"
              className="relative p-2.5 rounded-full text-slate-600 hover:text-sky-600 hover:bg-slate-100 transition-colors"
              title="Ver Carrinho"
            >
              <ShoppingBag className="w-6 h-6" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-sky-600 text-white font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {count}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-slate-900 leading-tight">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.role}</p>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Sair da Conta"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-sky-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors shadow-xs"
              >
                <User className="w-4 h-4" />
                <span>Entrar / Cadastrar</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Conteúdo da Página */}
      <main className="flex-1">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>

      {/* Rodapé Oficial */}
      <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white font-bold text-lg">
                360
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">CURITIBA 360</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Conectando turistas, atrações históricas, cultura, parques e a melhor gastronomia da capital mais verde do Brasil.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">Experiências</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/atracoes?categoria=PARQUE" className="hover:text-white transition-colors">Parques e Bosques</Link></li>
              <li><Link to="/atracoes?categoria=SHOW" className="hover:text-white transition-colors">Shows e Teatros</Link></li>
              <li><Link to="/atracoes?categoria=MUSEU" className="hover:text-white transition-colors">Museus e Galerias</Link></li>
              <li><Link to="/atracoes?categoria=PASSEIO" className="hover:text-white transition-colors">Passeios e City Tours</Link></li>
              <li><Link to="/pacotes" className="hover:text-white transition-colors">Combos Promocionais</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">Parceiros & Agências</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/cadastro-agencia" className="hover:text-white transition-colors">Credenciamento de Agências</Link></li>
              <li><Link to="/cadastro-parceiro" className="hover:text-white transition-colors">Cadastre sua Atração</Link></li>
              <li><Link to="/backoffice" className="hover:text-white transition-colors">Área do Parceiro Comercial</Link></li>
              <li><Link to="/termos" className="hover:text-white transition-colors">Termos de Parceria</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">Segurança & Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/politica-privacidade" className="hover:text-white transition-colors">Privacidade e LGPD</Link></li>
              <li><Link to="/termos-uso" className="hover:text-white transition-colors">Condições de Uso</Link></li>
              <li><Link to="/reembolsos" className="hover:text-white transition-colors">Política de Cancelamento</Link></li>
              <li><Link to="/anti-cambismo" className="hover:text-white transition-colors">Regras Anti-Cambismo</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          © 2026 Curitiba 360. Todos os direitos reservados. Projeto em conformidade com a LGPD e regulamentações do turismo.
        </div>
      </footer>
    </div>
  );
};
