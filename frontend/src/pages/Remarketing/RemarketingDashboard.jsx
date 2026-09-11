import React, { useState } from 'react';
import {
  ShoppingCart,
  Activity,
  Users,
  TrendingUp,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Download,
  Send,
  Zap,
  Tag,
  DollarSign,
  ShieldCheck,
  RefreshCcw,
  Sparkles,
  ExternalLink,
  MessageCircle
} from 'lucide-react';

export function RemarketingDashboard() {
  const [activeTab, setActiveTab] = useState('carrinho'); // 'carrinho' | 'pixels' | 'audiencias' | 'upsell'

  // Estados Aba 1: Carrinho Abandonado
  const [abandonedCarts, setAbandonedCarts] = useState([
    {
      id: 1,
      customerName: 'Fernanda Meirelles',
      customerEmail: 'fernanda.m@gmail.com',
      customerPhone: '(41) 99234-1188',
      items: '2x Ópera de Arame (Inteira)',
      totalValue: 30.00,
      abandonedAt: 'Há 45 minutos',
      stage: 'Initiate Checkout',
      recoveryStatus: 'E-mail 30m Enviado',
      statusColor: 'sky'
    },
    {
      id: 2,
      customerName: 'Rodrigo Brandão',
      customerEmail: 'rodrigo.b@hotmail.com',
      customerPhone: '(11) 98765-4321',
      items: '3x Trem Morretes (Turística) + Almoço',
      totalValue: 525.00,
      abandonedAt: 'Há 3 horas',
      stage: 'Add to Cart',
      recoveryStatus: 'Aguardando SMS 24h',
      statusColor: 'amber'
    },
    {
      id: 3,
      customerName: 'Camila Albuquerque',
      customerEmail: 'camila.albu@uol.com.br',
      customerPhone: '(47) 99123-8877',
      items: '4x Museu Oscar Niemeyer (MON)',
      totalValue: 120.00,
      abandonedAt: 'Há 1 dia',
      stage: 'Initiate Checkout',
      recoveryStatus: 'Recuperado via Cupom 5%',
      statusColor: 'emerald'
    }
  ]);
  const [showCartRuleModal, setShowCartRuleModal] = useState(false);

  // Estados Aba 2: Pixels & Tracking
  const [pixels, setPixels] = useState([
    {
      id: 1,
      platform: 'Meta Ads (Facebook & Instagram)',
      pixelId: '984392018293019',
      events: ['PageView', 'ViewContent', 'AddToCart', 'InitiateCheckout', 'Purchase'],
      status: 'Ativo',
      lastEvent: 'Há 12 segundos',
      matchRate: '94.2%'
    },
    {
      id: 2,
      platform: 'Google Analytics 4 (GA4)',
      pixelId: 'G-CWB360TOUR',
      events: ['page_view', 'view_item', 'add_to_cart', 'begin_checkout', 'purchase'],
      status: 'Ativo',
      lastEvent: 'Há 5 segundos',
      matchRate: '98.7%'
    },
    {
      id: 3,
      platform: 'Google Ads Conversion',
      pixelId: 'AW-1092837461',
      events: ['conversion_purchase', 'begin_checkout'],
      status: 'Ativo',
      lastEvent: 'Há 2 minutos',
      matchRate: '92.0%'
    },
    {
      id: 4,
      platform: 'TikTok Pixel',
      pixelId: 'TT-CWB-982187',
      events: ['CompletePayment', 'InitiateCheckout'],
      status: 'Inativo',
      lastEvent: 'Não conectado',
      matchRate: '-'
    }
  ]);
  const [showPixelModal, setShowPixelModal] = useState(false);

  // Estados Aba 3: Audiências Inteligentes
  const [audiences, setAudiences] = useState([
    {
      id: 1,
      name: 'Alta Intenção: Visualizou atração 3x sem comprar',
      size: '2.450 usuários',
      criteria: 'Page views >= 3 nos últimos 7 dias sem pedido associado',
      conversionRate: '14.8%',
      lastExport: '10/09/2026'
    },
    {
      id: 2,
      name: 'Compradores VIP (Ticket Alto)',
      size: '890 clientes',
      criteria: 'Pedidos > R$ 300,00 nos últimos 6 meses',
      conversionRate: '28.4%',
      lastExport: '08/09/2026'
    },
    {
      id: 3,
      name: 'Turistas Interestaduais em Feriados',
      size: '5.120 clientes',
      criteria: 'Origem SP/SC/RS com compras em datas comemorativas',
      conversionRate: '19.1%',
      lastExport: '02/09/2026'
    }
  ]);

  // Estados Aba 4: Upsell Pós-Venda
  const [upsells, setUpsells] = useState([
    {
      id: 1,
      name: 'Estacionamento Oficial com 20% OFF',
      trigger: 'Aprovado para Ópera de Arame ou MON',
      price: 'R$ 20,00',
      acceptanceRate: '22.4%',
      revenueGenerated: 8420.00,
      active: true
    },
    {
      id: 2,
      name: 'Combo Copo Colecionável CWB 360 + Bebida',
      trigger: 'Aprovado para Vale da Música / Ópera',
      price: 'R$ 25,00',
      acceptanceRate: '18.1%',
      revenueGenerated: 4650.00,
      active: true
    },
    {
      id: 3,
      name: 'Seguro Chuva & Reagendamento Sem Custos',
      trigger: 'Qualquer atração ao ar livre',
      price: 'R$ 8,00',
      acceptanceRate: '31.5%',
      revenueGenerated: 5890.00,
      active: true
    }
  ]);

  const tabs = [
    { id: 'carrinho', label: 'Carrinho Abandonado', icon: ShoppingCart, badge: abandonedCarts.length },
    { id: 'pixels', label: 'Pixels e Tracking', icon: Activity, badge: pixels.filter(p => p.status === 'Ativo').length },
    { id: 'audiencias', label: 'Audiências Inteligentes', icon: Users, badge: audiences.length },
    { id: 'upsell', label: 'Upsell Pós-Venda', icon: TrendingUp, badge: upsells.filter(u => u.active).length },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header do Módulo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Módulo de Retenção
            </span>
            <span className="text-xs font-semibold text-slate-400">• Fundo de Funil & LTV</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Remarketing e Retenção</h1>
          <p className="text-sm text-slate-500">
            Recupere checkouts não concluídos, gerencie pixels de rastreamento e otimize a receita pós-venda (Upsell).
          </p>
        </div>

        {/* Ação Primária de acordo com a aba */}
        <div>
          {activeTab === 'carrinho' && (
            <button
              onClick={() => setShowCartRuleModal(true)}
              className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Régua de Automação</span>
            </button>
          )}
          {activeTab === 'pixels' && (
            <button
              onClick={() => setShowPixelModal(true)}
              className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Conectar Novo Pixel</span>
            </button>
          )}
          {activeTab === 'audiencias' && (
            <button
              onClick={() => alert('Criação de nova audiência comportamental aberta!')}
              className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Criar Segmento Inteligente</span>
            </button>
          )}
          {activeTab === 'upsell' && (
            <button
              onClick={() => alert('Criação de nova oferta de upsell pós-venda aberta!')}
              className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Oferta de Pós-Venda</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 KPIs Executivos do Módulo de Remarketing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 p-4.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Taxa de Recuperação</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">↑ 3,4%</span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">24,8%</div>
          <p className="text-xs text-slate-400 mt-1">Checkouts recuperados pelas réguas automáticas</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Receita Salva</span>
            <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">Este mês</span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">R$ 14.320,00</div>
          <p className="text-xs text-slate-400 mt-1">58 compras finalizadas após abandono</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Carrinhos em Fila</span>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">Em aberto</span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">42 carrinhos</div>
          <p className="text-xs text-slate-400 mt-1">Nas etapas de 30m e 24h de régua</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upsell Pós-Venda</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">+ R$ 28,50</span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">16,2% conv.</div>
          <p className="text-xs text-slate-400 mt-1">Incremento de ticket médio por transação</p>
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
      {/* ABA 1: RECUPERAÇÃO DE CARRINHO ABANDONADO                                 */}
      {/* ========================================================================= */}
      {activeTab === 'carrinho' && (
        <div className="space-y-4 animate-fade-in">
          {/* Card de Régua de Automação Visual */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Régua Ativa de Recuperação de Carrinho
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Disparos automatizados disparados a partir de eventos temporais no banco de dados.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 rounded-full w-fit">
                ● Cron Job & Edge Ativos
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Passo 1 • 30 minutos</span>
                  <span className="text-sky-400 font-bold">E-mail</span>
                </div>
                <div className="font-semibold text-xs text-white mt-1">Lembrete de Ingresso Reservado</div>
                <p className="text-[11px] text-slate-400 mt-1">"Seus ingressos continuam reservados por pouco tempo."</p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Passo 2 • 24 horas</span>
                  <span className="text-emerald-400 font-bold">SMS + WhatsApp</span>
                </div>
                <div className="font-semibold text-xs text-white mt-1">Cupom de Desconto 5% OFF</div>
                <p className="text-[11px] text-slate-400 mt-1">"Finalize agora com o cupom VOLTA5 exclusivo."</p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Passo 3 • 48 horas</span>
                  <span className="text-amber-400 font-bold">Push Notification</span>
                </div>
                <div className="font-semibold text-xs text-white mt-1">Alerta de Virada de Lote</div>
                <p className="text-[11px] text-slate-400 mt-1">"Últimas horas antes do aumento de valor do lote."</p>
              </div>
            </div>
          </div>

          {/* Tabela de Carrinhos Abandonados */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-6">Cliente</th>
                    <th className="py-3.5 px-6">Itens no Checkout</th>
                    <th className="py-3.5 px-6">Valor Total</th>
                    <th className="py-3.5 px-6">Tempo Decorrido</th>
                    <th className="py-3.5 px-6">Etapa da Régua</th>
                    <th className="py-3.5 px-6 text-right">Ação Rápida</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {abandonedCarts.map((cart) => (
                    <tr key={cart.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="font-bold text-slate-800">{cart.customerName}</div>
                        <div className="text-xs text-slate-400">{cart.customerEmail} • {cart.customerPhone}</div>
                      </td>

                      <td className="py-3.5 px-6 font-medium text-slate-700 text-xs">
                        {cart.items}
                      </td>

                      <td className="py-3.5 px-6 font-black text-slate-900">
                        R$ {cart.totalValue.toFixed(2).replace('.', ',')}
                      </td>

                      <td className="py-3.5 px-6 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {cart.abandonedAt}
                        </span>
                      </td>

                      <td className="py-3.5 px-6">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                          cart.statusColor === 'emerald'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : cart.statusColor === 'sky'
                            ? 'bg-sky-50 text-sky-700 border-sky-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {cart.recoveryStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-6 text-right">
                        <button
                          onClick={() => alert(`Enviando mensagem de recuperação para ${cart.customerName}...`)}
                          className="text-xs font-bold text-sky-600 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Disparar Manual</span>
                        </button>
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
      {/* ABA 2: PIXELS E TRACKING                                                  */}
      {/* ========================================================================= */}
      {activeTab === 'pixels' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pixels.map((pix) => (
              <div key={pix.id} className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-slate-900 text-base">{pix.platform}</span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      pix.status === 'Ativo'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {pix.status}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-slate-400 block">ID do Pixel / Tag</span>
                      <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded inline-block">
                        {pix.pixelId}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs text-slate-400 block mb-1">Eventos Padrão Mapeados</span>
                      <div className="flex flex-wrap gap-1">
                        {pix.events.map((evt, idx) => (
                          <span key={idx} className="text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200 px-1.5 py-0.5 rounded">
                            {evt}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Último disparo: <strong className="text-slate-700">{pix.lastEvent}</strong></span>
                  <button
                    onClick={() => alert(`Configurações de ${pix.platform} abertas!`)}
                    className="text-sky-600 font-bold hover:underline"
                  >
                    Configurar →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 3: AUDIÊNCIAS INTELIGENTES                                            */}
      {/* ========================================================================= */}
      {activeTab === 'audiencias' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Segmentos Dinâmicos de Retargeting</h3>
                <p className="text-xs text-slate-500 mt-0.5">Listas calculadas em tempo real para exportação Lookalike e campanhas de conversão.</p>
              </div>
              <button
                onClick={() => alert('Exportando todos os públicos em CSV...')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar Todos (CSV)</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {audiences.map((aud) => (
                <div key={aud.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{aud.name}</h4>
                      <span className="text-xs font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full">
                        {aud.size}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Regra de corte: {aud.criteria}</p>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Última sincronização: {aud.lastExport} • Conversão histórica: <strong className="text-emerald-600">{aud.conversionRate}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => alert(`Exportando CSV do público ${aud.name} para Meta Lookalike...`)}
                      className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      <span>Meta Ads (CSV)</span>
                    </button>
                    <button
                      onClick={() => alert(`Criando campanha direcionada para o público ${aud.name}...`)}
                      className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Disparar Campanha</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 4: UPSELL E CROSS-SELL PÓS-VENDA                                      */}
      {/* ========================================================================= */}
      {activeTab === 'upsell' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upsells.map((upsell) => (
              <div key={upsell.id} className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      {upsell.price}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600">
                      {upsell.acceptanceRate} aceitação
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base">{upsell.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">Gatilho: {upsell.trigger}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Total gerado: <strong className="text-slate-800">R$ {upsell.revenueGenerated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                  </span>
                  <button
                    onClick={() => alert(`Editando oferta ${upsell.name}...`)}
                    className="text-xs font-bold text-sky-600 hover:underline"
                  >
                    Editar Oferta
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: NOVA RÉGUA DE AUTOMAÇÃO                                           */}
      {/* ========================================================================= */}
      {showCartRuleModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Nova Régua de Carrinho</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Configure o gatilho de tempo e o canal para recuperar checkouts não concluídos.
            </p>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Nome da Automação</label>
                <input
                  type="text"
                  placeholder="Ex: Lembrete Urgente 1 Hora"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Tempo após abandono</label>
                  <select className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white">
                    <option>15 minutos</option>
                    <option>30 minutos</option>
                    <option>1 hora</option>
                    <option>24 horas</option>
                    <option>48 horas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Canal de Envio</label>
                  <select className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white">
                    <option>E-mail Transacional</option>
                    <option>SMS</option>
                    <option>WhatsApp Business API</option>
                    <option>Web Push Notification</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Cupom de Incentivo (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: VOLTA5 (5% OFF)"
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCartRuleModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert('Nova automação de carrinho abandonado criada!');
                    setShowCartRuleModal(false);
                  }}
                  className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm"
                >
                  Ativar Régua
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: NOVO PIXEL                                                         */}
      {/* ========================================================================= */}
      {showPixelModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Conectar Novo Pixel</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Insira o identificador de rastreamento do evento ou produtor.
            </p>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Plataforma</label>
                <select className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white">
                  <option>Meta Pixel (Facebook/Instagram)</option>
                  <option>Google Analytics 4 (GA4)</option>
                  <option>Google Ads Tag</option>
                  <option>TikTok Pixel</option>
                  <option>Pinterest Tag</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">ID do Pixel / Tag</label>
                <input
                  type="text"
                  placeholder="Ex: 984392018293019 ou G-XXXXXXX"
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPixelModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert('Pixel conectado com sucesso!');
                    setShowPixelModal(false);
                  }}
                  className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm"
                >
                  Salvar Pixel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RemarketingDashboard;
