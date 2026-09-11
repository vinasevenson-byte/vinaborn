import React, { useState } from 'react';
import {
  Ticket,
  Users,
  Megaphone,
  Plus,
  Search,
  Filter,
  Copy,
  Check,
  Percent,
  DollarSign,
  TrendingUp,
  Tag,
  Share2,
  Calendar,
  ExternalLink,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  BarChart3,
  Send
} from 'lucide-react';

export function MarketingDashboard() {
  const [activeTab, setActiveTab] = useState('cupons'); // 'cupons' | 'afiliados' | 'campanhas'
  const [copiedCode, setCopiedCode] = useState(null);

  // Estados da Aba 1: Cupons
  const [coupons, setCoupons] = useState([
    {
      id: 1,
      code: 'CURITIBA360',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minPurchase: 0,
      maxUses: 1000,
      usedCount: 248,
      validUntil: '2026-12-31',
      active: true,
      category: 'Geral do Portal'
    },
    {
      id: 2,
      code: 'BEMVINDOCWB',
      discountType: 'FIXED',
      discountValue: 20,
      minPurchase: 100,
      maxUses: 500,
      usedCount: 184,
      validUntil: '2026-11-30',
      active: true,
      category: 'Novos Turistas'
    },
    {
      id: 3,
      code: 'AGENCIA-TURISMO',
      discountType: 'PERCENTAGE',
      discountValue: 12,
      minPurchase: 0,
      maxUses: 400,
      usedCount: 92,
      validUntil: '2027-03-31',
      active: true,
      category: 'Agências Parceiras'
    },
    {
      id: 4,
      code: 'OPERA15',
      discountType: 'PERCENTAGE',
      discountValue: 15,
      minPurchase: 50,
      maxUses: 300,
      usedCount: 65,
      validUntil: '2026-10-31',
      active: false,
      category: 'Atração: Ópera de Arame'
    }
  ]);
  const [searchCoupon, setSearchCoupon] = useState('');
  const [showNewCouponModal, setShowNewCouponModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    minPurchase: '0',
    maxUses: '500',
    validUntil: '',
    category: 'Geral do Portal'
  });

  // Estados da Aba 2: Afiliados & Promoters
  const [affiliates, setAffiliates] = useState([
    {
      id: 1,
      name: 'Curitiba Cult Blog',
      promoterCode: 'CULT360',
      utmSource: 'curitibacult',
      clicks: 4210,
      sales: 194,
      revenue: 16840,
      commissionRate: 8,
      commissionDue: 1347.20,
      status: 'Ativo'
    },
    {
      id: 2,
      name: 'Agência Serra Verde Express',
      promoterCode: 'SERRAV',
      utmSource: 'serraverde',
      clicks: 3120,
      sales: 142,
      revenue: 24850,
      commissionRate: 10,
      commissionDue: 2485.00,
      status: 'Ativo'
    },
    {
      id: 3,
      name: 'Perfil @ondeircuritiba',
      promoterCode: 'ONDEIRCWB',
      utmSource: 'instagram_ondeir',
      clicks: 5430,
      sales: 218,
      revenue: 18920,
      commissionRate: 7.5,
      commissionDue: 1419.00,
      status: 'Ativo'
    }
  ]);
  const [showAffiliateModal, setShowAffiliateModal] = useState(false);
  const [newAffiliate, setNewAffiliate] = useState({
    name: '',
    promoterCode: '',
    utmSource: '',
    commissionRate: 8
  });

  // Estados da Aba 3: Campanhas e Vitrine
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: 'Festival de Inverno Curitiba 360',
      type: 'E-mail + Banner Portal',
      audience: 'Base completa de turistas (14.200 leads)',
      status: 'Em Veiculação',
      ctr: '4.8%',
      conversions: 342,
      startDate: '2026-06-01',
      endDate: '2026-07-31'
    },
    {
      id: 2,
      name: 'Feriado Farroupilha / Sul em CWB',
      type: 'Disparo SMS + Push',
      audience: 'Turistas de SC e RS cadastrados (3.800 leads)',
      status: 'Agendado',
      ctr: '-',
      conversions: 0,
      startDate: '2026-09-18',
      endDate: '2026-09-22'
    },
    {
      id: 3,
      name: 'Semana Cultural no MON e Ópera',
      type: 'Destaque Vitrine Home',
      audience: 'Visitantes do portal público',
      status: 'Ativo',
      ctr: '6.2%',
      conversions: 189,
      startDate: '2026-09-01',
      endDate: '2026-09-30'
    }
  ]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.discountValue) return;

    const created = {
      id: Date.now(),
      code: newCoupon.code.toUpperCase(),
      discountType: newCoupon.discountType,
      discountValue: parseFloat(newCoupon.discountValue),
      minPurchase: parseFloat(newCoupon.minPurchase || 0),
      maxUses: parseInt(newCoupon.maxUses || 500),
      usedCount: 0,
      validUntil: newCoupon.validUntil || '2026-12-31',
      active: true,
      category: newCoupon.category
    };

    setCoupons([created, ...coupons]);
    setShowNewCouponModal(false);
    setNewCoupon({
      code: '',
      discountType: 'PERCENTAGE',
      discountValue: '',
      minPurchase: '0',
      maxUses: '500',
      validUntil: '',
      category: 'Geral do Portal'
    });
  };

  const handleCreateAffiliate = (e) => {
    e.preventDefault();
    if (!newAffiliate.name || !newAffiliate.promoterCode) return;

    const created = {
      id: Date.now(),
      name: newAffiliate.name,
      promoterCode: newAffiliate.promoterCode.toUpperCase(),
      utmSource: newAffiliate.utmSource.toLowerCase().replace(/\s+/g, '_') || 'afiliado',
      clicks: 0,
      sales: 0,
      revenue: 0,
      commissionRate: parseFloat(newAffiliate.commissionRate || 8),
      commissionDue: 0,
      status: 'Ativo'
    };

    setAffiliates([created, ...affiliates]);
    setShowAffiliateModal(false);
    setNewAffiliate({ name: '', promoterCode: '', utmSource: '', commissionRate: 8 });
  };

  const toggleCouponStatus = (id) => {
    setCoupons(coupons.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  const tabs = [
    { id: 'cupons', label: 'Cupons e Promoções', icon: Ticket, badge: coupons.length },
    { id: 'afiliados', label: 'Afiliados e Promoters', icon: Users, badge: affiliates.length },
    { id: 'campanhas', label: 'Campanhas e Vitrine', icon: Megaphone, badge: campaigns.length },
  ];

  const filteredCoupons = coupons.filter(c =>
    c.code.toLowerCase().includes(searchCoupon.toLowerCase()) ||
    c.category.toLowerCase().includes(searchCoupon.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header do Módulo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
              Módulo de Aquisição
            </span>
            <span className="text-xs font-semibold text-slate-400">• Topo e Meio de Funil</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Marketing e Aquisição</h1>
          <p className="text-sm text-slate-500">
            Centralize cupons, regras de comissão para afiliados (UTMs) e campanhas de conversão para o Curitiba 360.
          </p>
        </div>

        {/* Ação Primária de acordo com a aba */}
        <div>
          {activeTab === 'cupons' && (
            <button
              onClick={() => setShowNewCouponModal(true)}
              className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Cupom (WF-017)</span>
            </button>
          )}
          {activeTab === 'afiliados' && (
            <button
              onClick={() => setShowAffiliateModal(true)}
              className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Afiliado / Promoter</span>
            </button>
          )}
          {activeTab === 'campanhas' && (
            <button
              onClick={() => alert('Configuração de nova campanha de disparo / vitrine aberta!')}
              className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Campanha de Vitrine</span>
            </button>
          )}
        </div>
      </div>

      {/* 3 KPIs Executivos do Módulo de Marketing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 p-4.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Receita via Marketing</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">↑ 24,1%</span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">R$ 48.920,00</div>
          <p className="text-xs text-slate-400 mt-1">Gerados por cupons e parceiros promotores</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cupons Utilizados</span>
            <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">18,2% conversão</span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">524 resgates</div>
          <p className="text-xs text-slate-400 mt-1">Nos últimos 30 dias em 4 campanhas ativas</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Comissões Devidas</span>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">3 promotores</span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">R$ 5.251,20</div>
          <p className="text-xs text-slate-400 mt-1">Cálculo automatizado sobre R$ 60.610 em vendas</p>
        </div>
      </div>

      {/* Navegação por Abas Horizontais */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  group inline-flex items-center py-3.5 px-1 border-b-2 font-semibold text-sm transition-all cursor-pointer
                  ${isActive
                    ? 'border-sky-600 text-sky-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}
                `}
              >
                <Icon className={`mr-2 h-4 w-4 ${isActive ? 'text-sky-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ========================================================================= */}
      {/* ABA 1: CUPONS E PROMOÇÕES (MIGRADO DA OPERAÇÃO DE INGRESSOS)              */}
      {/* ========================================================================= */}
      {activeTab === 'cupons' && (
        <div className="space-y-4 animate-fade-in">
          {/* Barra de Filtros */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchCoupon}
                onChange={(e) => setSearchCoupon(e.target.value)}
                placeholder="Buscar código ou categoria..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Mostrando <strong>{filteredCoupons.length}</strong> cupons</span>
            </div>
          </div>

          {/* Tabela de Cupons */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-6">Código do Cupom</th>
                    <th className="py-3.5 px-6">Desconto</th>
                    <th className="py-3.5 px-6">Aplicação / Categoria</th>
                    <th className="py-3.5 px-6">Usos / Limite</th>
                    <th className="py-3.5 px-6">Validade</th>
                    <th className="py-3.5 px-6 text-center">Status</th>
                    <th className="py-3.5 px-6 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCoupons.map((coupon) => {
                    const usagePercent = Math.min(100, Math.round((coupon.usedCount / coupon.maxUses) * 100));
                    return (
                      <tr key={coupon.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md text-xs">
                              {coupon.code}
                            </span>
                            <button
                              onClick={() => copyToClipboard(coupon.code)}
                              className="text-slate-400 hover:text-slate-600 p-1 rounded transition-colors"
                              title="Copiar código"
                            >
                              {copiedCode === coupon.code ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>

                        <td className="py-3.5 px-6">
                          <span className="font-extrabold text-slate-800">
                            {coupon.discountType === 'PERCENTAGE'
                              ? `${coupon.discountValue}% OFF`
                              : `R$ ${coupon.discountValue.toFixed(2)} OFF`}
                          </span>
                          {coupon.minPurchase > 0 && (
                            <span className="block text-[11px] text-slate-400">
                              Mínimo: R$ {coupon.minPurchase.toFixed(2)}
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-6">
                          <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
                            {coupon.category}
                          </span>
                        </td>

                        <td className="py-3.5 px-6">
                          <div className="space-y-1 w-32">
                            <div className="flex justify-between text-xs text-slate-500 font-medium">
                              <span>{coupon.usedCount}</span>
                              <span>/ {coupon.maxUses}</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-sky-500 rounded-full"
                                style={{ width: `${usagePercent}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-6 text-xs text-slate-600 font-medium">
                          {coupon.validUntil}
                        </td>

                        <td className="py-3.5 px-6 text-center">
                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                            coupon.active
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}>
                            {coupon.active ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>

                        <td className="py-3.5 px-6 text-right">
                          <button
                            onClick={() => toggleCouponStatus(coupon.id)}
                            className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${
                              coupon.active
                                ? 'text-amber-700 hover:bg-amber-50'
                                : 'text-emerald-700 hover:bg-emerald-50'
                            }`}
                          >
                            {coupon.active ? 'Pausar' : 'Reativar'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 2: AFILIADOS E PROMOTERS                                              */}
      {/* ========================================================================= */}
      {activeTab === 'afiliados' && (
        <div className="space-y-4 animate-fade-in">
          {/* Painel de Geração Rápida de Links UTM */}
          <div className="bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-100 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Share2 className="w-4 h-4 text-sky-600" />
              <h3 className="text-sm font-bold text-slate-800">Gerador Rápido de Link Parametrizado (UTM)</h3>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Gere URLs rastreáveis com a atribuição de comissão para influenciadores, agências e canais de mídia parceiros.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-full sm:w-2/3 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-700 truncate">
                https://curitiba360.com.br/?utm_source=afiliado&utm_medium=promoter&utm_campaign=primavera2026
              </div>
              <button
                onClick={() => copyToClipboard('https://curitiba360.com.br/?utm_source=afiliado&utm_medium=promoter&utm_campaign=primavera2026')}
                className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors shrink-0 flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Link Parametrizado</span>
              </button>
            </div>
          </div>

          {/* Tabela de Afiliados */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-6">Nome do Parceiro</th>
                    <th className="py-3.5 px-6">Parâmetro UTM / Tag</th>
                    <th className="py-3.5 px-6 text-center">Cliques</th>
                    <th className="py-3.5 px-6 text-center">Vendas Geradas</th>
                    <th className="py-3.5 px-6">Faturamento</th>
                    <th className="py-3.5 px-6">Comissão</th>
                    <th className="py-3.5 px-6 text-right">Comissão Devida</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {affiliates.map((affiliate) => (
                    <tr key={affiliate.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-6 font-bold text-slate-800">
                        {affiliate.name}
                        <span className="block text-[11px] font-normal text-slate-400">
                          Código: {affiliate.promoterCode}
                        </span>
                      </td>

                      <td className="py-3.5 px-6">
                        <span className="font-mono text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                          utm_source={affiliate.utmSource}
                        </span>
                      </td>

                      <td className="py-3.5 px-6 text-center font-semibold text-slate-700">
                        {affiliate.clicks.toLocaleString('pt-BR')}
                      </td>

                      <td className="py-3.5 px-6 text-center">
                        <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                          {affiliate.sales}
                        </span>
                      </td>

                      <td className="py-3.5 px-6 font-bold text-slate-800">
                        R$ {affiliate.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>

                      <td className="py-3.5 px-6 text-xs text-slate-600 font-semibold">
                        {affiliate.commissionRate}%
                      </td>

                      <td className="py-3.5 px-6 text-right font-black text-emerald-600">
                        R$ {affiliate.commissionDue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 3: CAMPANHAS E VITRINE DO PORTAL                                      */}
      {/* ========================================================================= */}
      {activeTab === 'campanhas' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {campaigns.map((camp) => (
              <div key={camp.id} className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                      {camp.type}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      camp.status === 'Em Veiculação' || camp.status === 'Ativo'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {camp.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{camp.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{camp.audience}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">CTR Médio:</span>
                    <span className="font-bold text-slate-700">{camp.ctr}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Conversões Diretas:</span>
                    <span className="font-bold text-emerald-600">{camp.conversions} ingressos</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Período:</span>
                    <span className="text-slate-600">{camp.startDate} a {camp.endDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: NOVO CUPOM                                                         */}
      {/* ========================================================================= */}
      {showNewCouponModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Novo Cupom de Desconto</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Crie códigos promocionais com limite de usos e regras de desconto.
            </p>

            <form onSubmit={handleCreateCoupon} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Código do Cupom</label>
                <input
                  type="text"
                  required
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  placeholder="EX: PROMOVERAO26"
                  className="w-full px-3 py-2 text-sm font-mono uppercase rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Tipo</label>
                  <select
                    value={newCoupon.discountType}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
                  >
                    <option value="PERCENTAGE">Porcentagem (%)</option>
                    <option value="FIXED">Valor Fixo (R$)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Valor</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={newCoupon.discountValue}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: e.target.value })}
                    placeholder={newCoupon.discountType === 'PERCENTAGE' ? 'Ex: 15' : 'Ex: 25.00'}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Compra Mínima (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newCoupon.minPurchase}
                    onChange={(e) => setNewCoupon({ ...newCoupon, minPurchase: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Limite de Usos</label>
                  <input
                    type="number"
                    value={newCoupon.maxUses}
                    onChange={(e) => setNewCoupon({ ...newCoupon, maxUses: e.target.value })}
                    placeholder="500"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Validade</label>
                <input
                  type="date"
                  value={newCoupon.validUntil}
                  onChange={(e) => setNewCoupon({ ...newCoupon, validUntil: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewCouponModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm"
                >
                  Salvar Cupom
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: NOVO AFILIADO                                                      */}
      {/* ========================================================================= */}
      {showAffiliateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Novo Afiliado / Promoter</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Cadastre um parceiro ou canal e defina a comissão sobre as vendas.
            </p>

            <form onSubmit={handleCreateAffiliate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Nome ou Canal</label>
                <input
                  type="text"
                  required
                  value={newAffiliate.name}
                  onChange={(e) => setNewAffiliate({ ...newAffiliate, name: e.target.value })}
                  placeholder="Ex: Curitiba Gastronomia"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Código Promoter</label>
                  <input
                    type="text"
                    required
                    value={newAffiliate.promoterCode}
                    onChange={(e) => setNewAffiliate({ ...newAffiliate, promoterCode: e.target.value.toUpperCase() })}
                    placeholder="EX: GASTROCWB"
                    className="w-full px-3 py-2 text-xs font-mono uppercase rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Comissão (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newAffiliate.commissionRate}
                    onChange={(e) => setNewAffiliate({ ...newAffiliate, commissionRate: e.target.value })}
                    placeholder="8.0"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Parâmetro UTM Source</label>
                <input
                  type="text"
                  value={newAffiliate.utmSource}
                  onChange={(e) => setNewAffiliate({ ...newAffiliate, utmSource: e.target.value })}
                  placeholder="Ex: instagram_gastrocwb"
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAffiliateModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm"
                >
                  Cadastrar Afiliado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MarketingDashboard;
