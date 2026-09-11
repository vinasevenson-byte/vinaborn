import React, { useState, useEffect } from 'react';
import {
  Ticket,
  Users,
  Megaphone,
  Activity,
  CheckCircle,
  XCircle,
  Plus,
  Search,
  Copy,
  Check,
  Share2,
  TrendingUp,
  Tag,
  DollarSign,
  Percent,
  Calendar,
  Sparkles,
  RefreshCw,
  Send,
  Database
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function MarketingDashboard() {
  const [activeTab, setActiveTab] = useState('cupons'); // 'cupons' | 'afiliados' | 'campanhas'
  
  // Novos estados para a gestão de dados do Supabase
  const [cupons, setCupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const [searchCoupon, setSearchCoupon] = useState('');

  // Modal / Drawer de Criação de Cupom
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    codigo: '',
    tipo_desconto: 'percentual',
    valor_desconto: '',
    quantidade_maxima: '',
    data_validade: ''
  });

  // Estados da Aba 2: Afiliados & Promoters
  const [affiliates, setAffiliates] = useState([
    {
      id: 'p1',
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
      id: 'p2',
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
      id: 'p3',
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
      id: 'c1',
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
      id: 'c2',
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
      id: 'c3',
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

  const tabs = [
    { id: 'cupons', label: 'Cupons e Promoções', icon: Ticket, count: cupons.length },
    { id: 'afiliados', label: 'Afiliados e Promoters', icon: Users, count: affiliates.length },
    { id: 'campanhas', label: 'Campanhas e Vitrine', icon: Megaphone, count: campaigns.length },
  ];

  // Efeito para buscar os dados assim que a aba de cupons for ativada
  useEffect(() => {
    if (activeTab === 'cupons') {
      fetchCupons();
    }
  }, [activeTab]);

  async function fetchCupons() {
    setLoading(true);
    // Fazemos a query com relacionamentos implícitos no Supabase
    const { data, error } = await supabase
      .from('cupons')
      .select(`
        id,
        codigo,
        tipo_desconto,
        valor_desconto,
        quantidade_usos,
        quantidade_maxima,
        ativo,
        campanhas (nome),
        promotores (nome)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erro ao buscar cupons:", error);
    } else {
      setCupons(data || []);
    }
    setLoading(false);
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggleStatus = async (cupom) => {
    const novoStatus = !cupom.ativo;
    await supabase.from('cupons').update({ ativo: novoStatus }).eq('id', cupom.id);
    setCupons(cupons.map(c => c.id === cupom.id ? { ...c, ativo: novoStatus } : c));
  };

  const handleCreateCupom = async (e) => {
    e.preventDefault();
    if (!formData.codigo || !formData.valor_desconto) return;

    setIsSubmitting(true);

    const payload = {
      codigo: formData.codigo.toUpperCase().trim(),
      tipo_desconto: formData.tipo_desconto,
      valor_desconto: parseFloat(formData.valor_desconto),
      quantidade_maxima: formData.quantidade_maxima ? parseInt(formData.quantidade_maxima) : null,
      quantidade_usos: 0,
      data_validade: formData.data_validade ? new Date(formData.data_validade).toISOString() : null,
      ativo: true
    };

    const { error } = await supabase.from('cupons').insert([payload]);

    if (!error) {
      await fetchCupons();
      setIsModalOpen(false);
      setFormData({
        codigo: '',
        tipo_desconto: 'percentual',
        valor_desconto: '',
        quantidade_maxima: '',
        data_validade: ''
      });
    } else {
      console.error('Erro ao criar cupom:', error);
      alert('Erro ao salvar cupom no Supabase.');
    }
    setIsSubmitting(false);
  };

  const handleCreateAffiliate = (e) => {
    e.preventDefault();
    if (!newAffiliate.name || !newAffiliate.promoterCode) return;

    const created = {
      id: 'p' + (affiliates.length + 1),
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

  const filteredCupons = cupons.filter(c =>
    (c.codigo || '').toLowerCase().includes(searchCoupon.toLowerCase()) ||
    (c.campanhas?.nome || '').toLowerCase().includes(searchCoupon.toLowerCase()) ||
    (c.promotores?.nome || '').toLowerCase().includes(searchCoupon.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header do Módulo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200 flex items-center gap-1.5">
              <Database className="w-3 h-3 text-sky-600" />
              Módulo de Aquisição • Supabase Conectado
            </span>
            <span className="text-xs font-semibold text-slate-400">• Topo e Meio de Funil</span>
          </div>
          <h1 className="text-2xl font-bold text-[#001736] mt-1">Marketing e Aquisição</h1>
          <p className="text-sm text-gray-500">
            Gerencie cupons integrados ao PostgreSQL, parceiros afiliados com UTMs e campanhas de conversão.
          </p>
        </div>

        {/* Botão de Ação Primária */}
        <div className="flex items-center gap-2">
          {activeTab === 'cupons' && (
            <>
              <button
                onClick={() => fetchCupons()}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Recarregar do Supabase"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-sky-600' : ''}`} />
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#009de2] hover:bg-[#008bc9] text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Novo Cupom</span>
              </button>
            </>
          )}
          {activeTab === 'afiliados' && (
            <button
              onClick={() => setShowAffiliateModal(true)}
              className="bg-[#009de2] hover:bg-[#008bc9] text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Novo Promotor</span>
            </button>
          )}
          {activeTab === 'campanhas' && (
            <button
              onClick={() => alert('Configuração de nova campanha de vitrine aberta!')}
              className="bg-[#009de2] hover:bg-[#008bc9] text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Nova Campanha</span>
            </button>
          )}
        </div>
      </div>

      {/* 3 KPIs Executivos do Módulo de Marketing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Receita via Marketing</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">↑ 24,1%</span>
          </div>
          <div className="text-2xl font-black text-[#001736] mt-2">R$ 48.920,00</div>
          <p className="text-xs text-gray-400 mt-1">Gerados por cupons e parceiros promotores</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Cupons Ativos</span>
            <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">
              {cupons.filter(c => c.ativo).length} de {cupons.length}
            </span>
          </div>
          <div className="text-2xl font-black text-[#001736] mt-2">
            {cupons.reduce((acc, c) => acc + (c.quantidade_usos || 0), 0)} usos
          </div>
          <p className="text-xs text-gray-400 mt-1">Sincronizado diretamente com a tabela PostgreSQL</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Comissões Devidas</span>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">3 promotores</span>
          </div>
          <div className="text-2xl font-black text-[#001736] mt-2">R$ 5.251,20</div>
          <p className="text-xs text-gray-400 mt-1">Comissões sobre R$ 60.610 em vendas atribuídas</p>
        </div>
      </div>

      {/* Navegação por Abas */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer
                  ${isActive 
                    ? 'border-[#009de2] text-[#009de2]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                <Icon className={`mr-2 h-5 w-5 ${isActive ? 'text-[#009de2]' : 'text-gray-400 group-hover:text-gray-500'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-sky-100 text-sky-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Área de Conteúdo */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
        
        {/* ========================================================================= */}
        {/* CONTEÚDO: CUPONS ATUALIZADO COM TABELA REAL DO SUPABASE                   */}
        {/* ========================================================================= */}
        {activeTab === 'cupons' && (
          <div className="animate-fade-in space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-lg font-bold text-[#001736]">Gestão de Cupons (WF-017)</h2>
                <p className="text-gray-500 text-sm">Controle de descontos e promoções ativas integradas ao Supabase.</p>
              </div>

              {/* Barra de Filtro Rápido */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchCoupon}
                  onChange={(e) => setSearchCoupon(e.target.value)}
                  placeholder="Filtrar por código ou origem..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#009de2]"
                />
              </div>
            </div>
            
            {/* Tabela de Dados */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Código</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Desconto</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Usos / Limite</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Origem (Campanha/Promoter)</th>
                    <th className="px-6 py-3.5 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                        <Activity className="w-6 h-6 animate-spin mx-auto mb-2 text-[#009de2]" />
                        Carregando cupons do banco de dados...
                      </td>
                    </tr>
                  ) : filteredCoupons.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                        <Ticket className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        Nenhum cupom cadastrado ainda.
                      </td>
                    </tr>
                  ) : (
                    filteredCoupons.map((cupom) => (
                      <tr key={cupom.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-[#001736]">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[#009de2] bg-sky-50 px-2.5 py-1 rounded border border-sky-200 text-xs">
                              {cupom.codigo}
                            </span>
                            <button
                              onClick={() => copyToClipboard(cupom.codigo)}
                              className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
                              title="Copiar código"
                            >
                              {copiedCode === cupom.codigo ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-800">
                          {cupom.tipo_desconto === 'percentual' 
                            ? `${cupom.valor_desconto}% OFF` 
                            : `R$ ${Number(cupom.valor_desconto).toFixed(2).replace('.', ',')} OFF`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <span className="font-semibold text-slate-800">{cupom.quantidade_usos || 0}</span>{' '}
                          <span className="text-gray-400 text-xs">{cupom.quantidade_maxima ? `/ ${cupom.quantidade_maxima}` : '(Ilimitado)'}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {cupom.campanhas?.nome ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                              Campanha: {cupom.campanhas.nome}
                            </span>
                          ) : cupom.promotores?.nome ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                              Promoter: {cupom.promotores.nome}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">Geral do Portal</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {cupom.ativo ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                              <CheckCircle className="w-3 h-3 mr-1" /> Ativo
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                              <XCircle className="w-3 h-3 mr-1" /> Inativo
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleToggleStatus(cupom)}
                            className={`text-xs font-bold px-2.5 py-1 rounded transition-colors ${
                              cupom.ativo 
                                ? 'text-amber-700 hover:bg-amber-50' 
                                : 'text-emerald-700 hover:bg-emerald-50'
                            }`}
                          >
                            {cupom.ativo ? 'Pausar' : 'Ativar'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* CONTEÚDO: AFILIADOS E PROMOTERS                                           */}
        {/* ========================================================================= */}
        {activeTab === 'afiliados' && (
          <div className="animate-fade-in space-y-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h2 className="text-lg font-bold text-[#001736]">Programa de Afiliados</h2>
                <p className="text-gray-500 text-sm">Geração de links rastreáveis (UTM) e cálculo automático de comissões.</p>
              </div>
            </div>

            {/* Painel de Geração de Links UTM */}
            <div className="bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-100 rounded-xl p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <Share2 className="w-4 h-4 text-[#009de2]" />
                <h3 className="text-sm font-bold text-[#001736]">Gerador Rápido de Link Parametrizado (UTM)</h3>
              </div>
              <p className="text-xs text-gray-600 mb-3">
                Gere URLs com atribuição de comissão para influenciadores e parceiros divulgarem as atrações de Curitiba.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="w-full sm:w-2/3 bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono text-gray-700 truncate">
                  https://curitiba360.com.br/?utm_source=afiliado&utm_medium=promoter&utm_campaign=primavera2026
                </div>
                <button
                  onClick={() => copyToClipboard('https://curitiba360.com.br/?utm_source=afiliado&utm_medium=promoter&utm_campaign=primavera2026')}
                  className="w-full sm:w-auto bg-[#009de2] hover:bg-[#008bc9] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Link</span>
                </button>
              </div>
            </div>

            {/* Tabela de Afiliados */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nome do Parceiro</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Parâmetro UTM</th>
                    <th className="px-6 py-3.5 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Cliques</th>
                    <th className="px-6 py-3.5 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Vendas</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Faturamento</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Comissão</th>
                    <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Comissão Devida</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {affiliates.map((aff) => (
                    <tr key={aff.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-[#001736]">
                        {aff.name}
                        <span className="block text-[11px] font-normal text-gray-400">Código: {aff.promoterCode}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                          utm_source={aff.utmSource}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-gray-700">
                        {aff.clicks.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-bold text-slate-800 bg-gray-100 px-2 py-0.5 rounded">
                          {aff.sales}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800">
                        R$ {aff.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-gray-600">
                        {aff.commissionRate}%
                      </td>
                      <td className="px-6 py-4 text-right font-black text-emerald-600">
                        R$ {aff.commissionDue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* CONTEÚDO: CAMPANHAS E VITRINE                                             */}
        {/* ========================================================================= */}
        {activeTab === 'campanhas' && (
          <div className="animate-fade-in space-y-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h2 className="text-lg font-bold text-[#001736]">Campanhas e Vitrine</h2>
                <p className="text-gray-500 text-sm">Gestão de destaques no portal público e disparos promocionais.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {campaigns.map((camp) => (
                <div key={camp.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
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
                    <h3 className="font-bold text-[#001736] text-base">{camp.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{camp.audience}</p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400 font-medium">CTR Médio:</span>
                      <span className="font-bold text-gray-700">{camp.ctr}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400 font-medium">Conversões Diretas:</span>
                      <span className="font-bold text-emerald-600">{camp.conversions} ingressos</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400 font-medium">Período:</span>
                      <span className="text-gray-600">{camp.startDate} a {camp.endDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL / DRAWER: NOVO CUPOM (INTEGRADO AO SUPABASE)                       */}
      {/* ========================================================================= */}
      {/* MODAL DE NOVO CUPOM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-[#001736]">Cadastrar Novo Cupom</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCupom} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código do Cupom</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: VERAO20"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009de2] focus:border-transparent outline-none uppercase font-mono"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009de2] outline-none bg-white text-sm"
                    value={formData.tipo_desconto}
                    onChange={(e) => setFormData({ ...formData, tipo_desconto: e.target.value })}
                  >
                    <option value="percentual">Percentual (%)</option>
                    <option value="fixo">Valor Fixo (R$)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    placeholder="Ex: 20"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009de2] outline-none text-sm"
                    value={formData.valor_desconto}
                    onChange={(e) => setFormData({ ...formData, valor_desconto: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Limite de Usos</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Ex: 500 (Vazio = Ilimitado)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009de2] outline-none text-sm"
                    value={formData.quantidade_maxima}
                    onChange={(e) => setFormData({ ...formData, quantidade_maxima: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Validade</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009de2] outline-none text-sm text-gray-700"
                    value={formData.data_validade}
                    onChange={(e) => setFormData({ ...formData, data_validade: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#009de2] rounded-lg hover:bg-[#008bc9] transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar Cupom'}
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
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <h3 className="text-lg font-bold text-[#001736]">Novo Afiliado / Promoter</h3>
            <p className="text-xs text-gray-500 mt-1 mb-4">
              Cadastre um parceiro ou canal e defina a comissão sobre as vendas.
            </p>

            <form onSubmit={handleCreateAffiliate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Nome ou Canal</label>
                <input
                  type="text"
                  required
                  value={newAffiliate.name}
                  onChange={(e) => setNewAffiliate({ ...newAffiliate, name: e.target.value })}
                  placeholder="Ex: Curitiba Gastronomia"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#009de2] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Código Promoter</label>
                  <input
                    type="text"
                    required
                    value={newAffiliate.promoterCode}
                    onChange={(e) => setNewAffiliate({ ...newAffiliate, promoterCode: e.target.value.toUpperCase() })}
                    placeholder="EX: GASTROCWB"
                    className="w-full px-3 py-2 text-xs font-mono uppercase rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#009de2] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Comissão (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newAffiliate.commissionRate}
                    onChange={(e) => setNewAffiliate({ ...newAffiliate, commissionRate: e.target.value })}
                    placeholder="8.0"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#009de2] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Parâmetro UTM Source</label>
                <input
                  type="text"
                  value={newAffiliate.utmSource}
                  onChange={(e) => setNewAffiliate({ ...newAffiliate, utmSource: e.target.value })}
                  placeholder="Ex: instagram_gastrocwb"
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#009de2] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAffiliateModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#009de2] hover:bg-[#008bc9] text-white px-5 py-2 rounded-lg text-xs font-bold transition-colors shadow-xs"
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
