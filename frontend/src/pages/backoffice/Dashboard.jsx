import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  Ticket,
  Users,
  Landmark,
  Handshake,
  AlertCircle,
  QrCode,
  Plus,
  FileText,
  Calendar,
  ChevronDown,
  Zap,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export const Dashboard = () => {
  // Filtros da tela
  const [metricTab, setMetricTab] = useState('Faturamento'); // 'Faturamento' | 'Ingressos' | 'Validações'
  const [periodTab, setPeriodTab] = useState('7 dias'); // '7 dias' | '30 dias' | '6 meses' | '1 ano'
  const [hoveredIndex, setHoveredIndex] = useState(6); // Default selecionado no Domingo (idx 6) como na imagem

  // Dados do Dashboard (conectados ou com fallbacks fiéis à imagem)
  const [data, setData] = useState({
    faturamentoHoje: 'R$ 38.450,00',
    faturamentoHojeDelta: '↑ 18,4%',
    ingressosVendidos: '1.842',
    ingressosVendidosDelta: '↑ 12,7%',
    clientesAtivos: '1.256',
    clientesAtivosDelta: '↑ 8,2%',
    atracoesAtivas: '18',
    lotesAbertos: '3 lotes abertos',
    parceirosAtivos: '32',
    parceirosAtivosDelta: '↑ 6,7%',
    pendencias: '7',
    pendenciasSubtext: 'aguardando ação',
    salesChart: [
      { day: 'Seg', date: '23/06', faturamento: 18200, faturamentoFormatted: 'R$ 18.200,00', ingressos: 1100, barHeight: 28, lineY: 68 },
      { day: 'Ter', date: '24/06', faturamento: 24500, faturamentoFormatted: 'R$ 24.500,00', ingressos: 1250, barHeight: 40, lineY: 62 },
      { day: 'Qua', date: '25/06', faturamento: 28100, faturamentoFormatted: 'R$ 28.100,00', ingressos: 1390, barHeight: 46, lineY: 56 },
      { day: 'Qui', date: '26/06', faturamento: 32400, faturamentoFormatted: 'R$ 32.400,00', ingressos: 1520, barHeight: 53, lineY: 50 },
      { day: 'Sex', date: '27/06', faturamento: 38900, faturamentoFormatted: 'R$ 38.900,00', ingressos: 1700, barHeight: 64, lineY: 42 },
      { day: 'Sáb', date: '28/06', faturamento: 44200, faturamentoFormatted: 'R$ 44.200,00', ingressos: 1880, barHeight: 73, lineY: 35 },
      { day: 'Dom', date: '29/06', faturamento: 48320, faturamentoFormatted: 'R$ 48.320,00', ingressos: 1984, barHeight: 80, lineY: 30 },
    ],
    attractionsPerformance: [
      { id: 1, name: 'MON', tickets: '842 ingressos', percentage: 92, image: '/images/mon-olho.jpg', colorClass: 'bg-sky-500' },
      { id: 2, name: 'Jardim Botânico', tickets: '621 ingressos', percentage: 76, image: '/images/jardim-botanico.jpg', colorClass: 'bg-emerald-500' },
      { id: 3, name: 'Ópera de Arame', tickets: '438 ingressos', percentage: 54, image: '/images/opera-de-arame.jpg', colorClass: 'bg-indigo-500' },
      { id: 4, name: 'Torre Panorâmica', tickets: '312 ingressos', percentage: 41, image: '/images/parque-tangua.jpg', colorClass: 'bg-amber-500' },
    ],
    recentActivities: [
      { id: 1, time: '21:08', title: 'Ingresso #89231 validado', detail: 'MON - Museu Oscar Niemeyer', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
      { id: 2, time: '21:04', title: 'Nova venda', detail: '2 ingressos - R$ 180,00', icon: Ticket, color: 'text-sky-500', bg: 'bg-sky-50' },
      { id: 3, time: '20:57', title: 'Novo parceiro cadastrado', detail: 'Curitiba Tours', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50' },
      { id: 4, time: '20:51', title: 'Solicitação de reembolso', detail: 'Pedido #92831', icon: RotateCcw, color: 'text-amber-500', bg: 'bg-amber-50' },
      { id: 5, time: '20:42', title: 'Novo lote ativado', detail: 'Ópera de Arame - Lote 2', icon: Ticket, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    ],
    financialSummary: {
      hoje: { valor: 'R$ 38.450,00', delta: '↑ 18,4%' },
      ontem: { valor: 'R$ 32.480,00', delta: '↑ 12,1%' },
      esteMes: { valor: 'R$ 82.450,00', delta: '↑ 15,3%' },
      mesAnterior: { valor: 'R$ 74.210,00', delta: '↑ 9,8%' },
      ticketMedio: 'R$ 72,40',
      taxas: 'R$ 6.820,00',
      reembolsos: 'R$ 1.240,00'
    },
    attentionItems: [
      { id: 1, count: 5, title: 'Reembolsos aguardando aprovação', detail: 'Na fila do Backoffice', action: 'Resolver →', link: '/backoffice/reembolsos', bg: 'bg-amber-500' },
      { id: 2, count: 2, title: 'Contratos aguardando assinatura', detail: 'Via DocuSign', action: 'Ver →', link: '/backoffice/contratos', bg: 'bg-sky-500' },
      { id: 3, count: 3, title: 'Atrações com lote próximo do fim', detail: 'MON, Ópera de Arame, Torre Panorâmica', action: 'Ver →', link: '/backoffice/ingressos', bg: 'bg-amber-400' },
      { id: 4, count: 1, title: 'Problema na integração', detail: 'Pagamento / Gateway', action: 'Ver →', link: '/backoffice/configuracoes', bg: 'bg-rose-500' }
    ]
  });

  // Tentar buscar métricas da API
  useEffect(() => {
    fetch('/api/dashboard/metrics')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(apiData => {
        if (apiData && typeof apiData === 'object') {
          setData(prev => ({
            ...prev,
            faturamentoHoje: apiData.faturamentoHoje || prev.faturamentoHoje,
            faturamentoHojeDelta: apiData.faturamentoHojeDelta || prev.faturamentoHojeDelta,
            ingressosVendidos: apiData.ingressosVendidos ? String(apiData.ingressosVendidos) : prev.ingressosVendidos,
            clientesAtivos: apiData.clientesAtivos ? String(apiData.clientesAtivos) : prev.clientesAtivos,
            atracoesAtivas: apiData.atracoesAtivas ? String(apiData.atracoesAtivas) : prev.atracoesAtivas,
            parceirosAtivos: apiData.parceirosAtivos ? String(apiData.parceirosAtivos) : prev.parceirosAtivos,
            pendencias: apiData.pendencias ? String(apiData.pendencias) : prev.pendencias,
          }));
        }
      })
      .catch(() => {});
  }, []);

  const activeBarData = data.salesChart[hoveredIndex] || data.salesChart[6];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Cabeçalho de Boas-Vindas + Ações Rápidas */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Bom dia, Administrador! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Aqui está o resumo do Curitiba 360. Acompanhe os principais indicadores e o que precisa de atenção.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Validar Ingresso (QR Code) */}
          <Link to="/backoffice/validacao">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors">
              <QrCode className="w-4 h-4" />
              <span>Validar Ingresso (QR Code)</span>
            </button>
          </Link>

          {/* + Nova Atração */}
          <Link to="/backoffice/atracoes">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors">
              <Plus className="w-4 h-4" />
              <span>Nova Atração</span>
            </button>
          </Link>

          {/* Relatório Financeiro */}
          <Link to="/backoffice/relatorios">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs sm:text-sm shadow-xs transition-colors">
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Relatório Financeiro</span>
            </button>
          </Link>
        </div>
      </div>

      {/* 2. Grid de 6 KPIs Principais */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* KPI 1: Faturamento (Hoje) */}
        <Link to="/backoffice/relatorios" className="group block focus:outline-none">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 hover:border-emerald-300 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-lg mb-3 shadow-xs">
              <DollarSign className="w-5 h-5" />
            </div>
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              FATURAMENTO (HOJE)
            </p>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1 tracking-tight">
              {data.faturamentoHoje}
            </h3>
            <p className="text-xs text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
              <span>{data.faturamentoHojeDelta}</span>
              <span className="text-slate-400 font-normal text-[11px]">vs. ontem</span>
            </p>
          </div>
        </Link>

        {/* KPI 2: Ingressos Vendidos */}
        <Link to="/backoffice/ingressos" className="group block focus:outline-none">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 hover:border-sky-300 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold text-lg mb-3 shadow-xs">
              <Ticket className="w-5 h-5" />
            </div>
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              INGRESSOS VENDIDOS
            </p>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1 tracking-tight">
              {data.ingressosVendidos}
            </h3>
            <p className="text-xs text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
              <span>{data.ingressosVendidosDelta}</span>
              <span className="text-slate-400 font-normal text-[11px]">vs. ontem</span>
            </p>
          </div>
        </Link>

        {/* KPI 3: Clientes Ativos */}
        <Link to="/backoffice/usuarios" className="group block focus:outline-none">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 hover:border-indigo-300 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-bold text-lg mb-3 shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              CLIENTES ATIVOS
            </p>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1 tracking-tight">
              {data.clientesAtivos}
            </h3>
            <p className="text-xs text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
              <span>{data.clientesAtivosDelta}</span>
              <span className="text-slate-400 font-normal text-[11px]">vs. ontem</span>
            </p>
          </div>
        </Link>

        {/* KPI 4: Atrações Ativas */}
        <Link to="/backoffice/atracoes" className="group block focus:outline-none">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 hover:border-amber-300 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg mb-3 shadow-xs">
              <Landmark className="w-5 h-5" />
            </div>
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              ATRAÇÕES ATIVAS
            </p>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1 tracking-tight">
              {data.atracoesAtivas}
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 font-medium">
              {data.lotesAbertos}
            </p>
          </div>
        </Link>

        {/* KPI 5: Parceiros Ativos */}
        <Link to="/backoffice/parceiros" className="group block focus:outline-none">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 hover:border-blue-300 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg mb-3 shadow-xs">
              <Handshake className="w-5 h-5" />
            </div>
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              PARCEIROS ATIVOS
            </p>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1 tracking-tight">
              {data.parceirosAtivos}
            </h3>
            <p className="text-xs text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
              <span>{data.parceirosAtivosDelta}</span>
              <span className="text-slate-400 font-normal text-[11px]">vs. ontem</span>
            </p>
          </div>
        </Link>

        {/* KPI 6: Pendências */}
        <a href="#requer-atencao" className="group block focus:outline-none">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 hover:border-rose-300 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold text-lg mb-3 shadow-xs">
              <AlertCircle className="w-5 h-5" />
            </div>
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              PENDÊNCIAS
            </p>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1 tracking-tight">
              {data.pendencias}
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 font-medium">
              {data.pendenciasSubtext}
            </p>
          </div>
        </a>
      </div>

      {/* 3. Linha Intermediária: Gráfico de Vendas & Faturamento + Atividade Recente */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Esquerda (2 colunas): Vendas e Faturamento */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            {/* Header do Gráfico */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    Vendas e Faturamento
                  </h3>
                  <p className="text-xs text-slate-500">
                    Evolução dos últimos 7 dias
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Abas de Métrica */}
                <div className="inline-flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  {['Faturamento', 'Ingressos', 'Validações'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setMetricTab(tab)}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        metricTab === tab ? 'bg-sky-600 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Abas de Período */}
                <div className="inline-flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  {['7 dias', '30 dias', '6 meses', '1 ano'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setPeriodTab(tab)}
                      className={`px-2.5 py-1.5 rounded-lg transition-all ${
                        periodTab === tab ? 'bg-white text-sky-700 font-bold shadow-xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Gráfico Visual de Barras + Curva de Ingressos (SVG Overlay) */}
            <div className="relative pt-6 pb-2">
              {/* Eixos Verticais */}
              <div className="flex justify-between text-[11px] font-semibold text-slate-400 absolute inset-x-0 top-6 pointer-events-none">
                <span>R$ 60 mil</span>
                <span>2.500</span>
              </div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-400 absolute inset-x-0 top-[30%] pointer-events-none">
                <span>R$ 45 mil</span>
                <span>2.000</span>
              </div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-400 absolute inset-x-0 top-[52%] pointer-events-none">
                <span>R$ 30 mil</span>
                <span>1.500</span>
              </div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-400 absolute inset-x-0 top-[74%] pointer-events-none">
                <span>R$ 15 mil</span>
                <span>1.000</span>
              </div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-400 absolute inset-x-0 bottom-12 pointer-events-none">
                <span>R$ 0</span>
                <span>0</span>
              </div>

              {/* Área de Linhas Guia */}
              <div className="h-64 mx-12 border-b border-slate-200 relative flex items-end justify-between px-3">
                {/* Linhas horizontais sutis */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none -z-0 opacity-40">
                  <div className="w-full border-b border-dashed border-slate-200"></div>
                  <div className="w-full border-b border-dashed border-slate-200"></div>
                  <div className="w-full border-b border-dashed border-slate-200"></div>
                  <div className="w-full border-b border-dashed border-slate-200"></div>
                  <div className="w-full"></div>
                </div>

                {/* SVG da Curva de Ingressos */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path
                    d="M 7 68 L 21 62 L 35 56 L 50 50 L 64 42 L 78 35 L 93 30"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Pontos da curva */}
                  {[
                    { cx: 7, cy: 68 },
                    { cx: 21, cy: 62 },
                    { cx: 35, cy: 56 },
                    { cx: 50, cy: 50 },
                    { cx: 64, cy: 42 },
                    { cx: 78, cy: 35 },
                    { cx: 93, cy: 30 },
                  ].map((pt, i) => (
                    <circle
                      key={i}
                      cx={pt.cx}
                      cy={pt.cy}
                      r={hoveredIndex === i ? '3.5' : '2.5'}
                      fill="#10b981"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                  ))}
                </svg>

                {/* Barras de Faturamento */}
                {data.salesChart.map((col, idx) => {
                  const isHovered = hoveredIndex === idx;

                  return (
                    <div
                      key={idx}
                      onMouseEnter={() => setHoveredIndex(idx)}
                      className="w-12 h-full flex flex-col justify-end items-center relative z-10 cursor-pointer group"
                    >
                      {/* Tooltip flutuante quando o mouse está sobre a barra (ou default no Domingo) */}
                      {isHovered && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white rounded-xl p-2.5 shadow-xl border border-slate-200/90 text-left z-30 min-w-[120px] pointer-events-none animate-fadeIn">
                          <p className="text-[11px] text-slate-500 font-semibold">{col.day}</p>
                          <p className="text-xs font-black text-slate-900 mt-0.5">{col.faturamentoFormatted}</p>
                          <p className="text-[11px] font-bold text-emerald-600 mt-0.5">{col.ingressos} ingressos</p>
                        </div>
                      )}

                      {/* Barra Azul */}
                      <div
                        style={{ height: `${col.barHeight}%` }}
                        className={`w-full rounded-t-md transition-all duration-200 ${
                          isHovered
                            ? 'bg-sky-600 shadow-md'
                            : 'bg-sky-500 group-hover:bg-sky-600'
                        }`}
                      ></div>
                    </div>
                  );
                })}
              </div>

              {/* Rótulos dos Dias no Eixo X */}
              <div className="flex justify-between mx-12 px-3 pt-3 text-center">
                {data.salesChart.map((col, idx) => (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    className="w-12 cursor-pointer"
                  >
                    <p className={`text-xs font-bold ${hoveredIndex === idx ? 'text-sky-600' : 'text-slate-700'}`}>
                      {col.day}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">{col.date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Legenda do Gráfico */}
            <div className="flex items-center justify-center gap-6 pt-4 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-sky-500"></span>
                <span>Faturamento</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span>Ingressos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Direita (1 coluna): Atividade Recente */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-sky-600" />
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Atividade Recente
                </h3>
              </div>
              <Link to="/backoffice/relatorios" className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline">
                Ver todas
              </Link>
            </div>

            {/* Timeline de Atividades */}
            <div className="mt-4 space-y-4">
              {data.recentActivities.map((act) => {
                const IconComponent = act.icon;
                return (
                  <div key={act.id} className="flex items-start gap-3 text-xs group">
                    <div className={`w-7 h-7 rounded-lg ${act.bg} ${act.color} flex items-center justify-center shrink-0 mt-0.5`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-bold text-slate-400">{act.time}</span>
                      </div>
                      <p className="font-bold text-slate-900 text-xs mt-0.5 leading-tight">{act.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{act.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Linha Inferior: 3 Cards (Desempenho das Atrações, Resumo Financeiro, Requer Atenção) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Desempenho das Atrações */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                  <Landmark className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                    Desempenho das Atrações
                  </h3>
                  <p className="text-[11px] text-slate-400">Top 4 - por vendas de ingressos</p>
                </div>
              </div>
              <Link to="/backoffice/atracoes" className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline">
                Ver todas
              </Link>
            </div>

            {/* Lista das 4 Atrações */}
            <div className="mt-4 space-y-4">
              {data.attractionsPerformance.map((item) => (
                <div key={item.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-8 h-8 rounded-lg object-cover shadow-xs border border-slate-100"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <div>
                        <p className="font-bold text-slate-900 leading-tight">{item.name}</p>
                        <p className="text-[11px] text-slate-400">{item.tickets}</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-700">{item.percentage}%</span>
                  </div>

                  {/* Barra de Progresso */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${item.percentage}%` }}
                      className={`h-full rounded-full ${item.colorClass}`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Resumo Financeiro */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                  <DollarSign className="w-4 h-4" />
                </div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                  Resumo Financeiro
                </h3>
              </div>
              <div className="relative">
                <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 bg-white hover:border-slate-300">
                  <span>Este mês</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Tabela de Valores Comparativos */}
            <div className="mt-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 font-medium">Hoje</span>
                <div className="flex items-center gap-3">
                  <strong className="text-slate-900 font-bold">{data.financialSummary.hoje.valor}</strong>
                  <span className="text-emerald-600 font-bold text-[11px]">{data.financialSummary.hoje.delta}</span>
                </div>
              </div>

              <div className="flex items-center justify-between py-1 border-t border-slate-50">
                <span className="text-slate-500 font-medium">Ontem</span>
                <div className="flex items-center gap-3">
                  <strong className="text-slate-900 font-bold">{data.financialSummary.ontem.valor}</strong>
                  <span className="text-emerald-600 font-bold text-[11px]">{data.financialSummary.ontem.delta}</span>
                </div>
              </div>

              <div className="flex items-center justify-between py-1 border-t border-slate-50">
                <span className="text-slate-500 font-medium">Este mês</span>
                <div className="flex items-center gap-3">
                  <strong className="text-slate-900 font-bold">{data.financialSummary.esteMes.valor}</strong>
                  <span className="text-emerald-600 font-bold text-[11px]">{data.financialSummary.esteMes.delta}</span>
                </div>
              </div>

              <div className="flex items-center justify-between py-1 border-t border-slate-50">
                <span className="text-slate-500 font-medium">Mês anterior</span>
                <div className="flex items-center gap-3">
                  <strong className="text-slate-900 font-bold">{data.financialSummary.mesAnterior.valor}</strong>
                  <span className="text-emerald-600 font-bold text-[11px]">{data.financialSummary.mesAnterior.delta}</span>
                </div>
              </div>
            </div>

            {/* 3 Caixas Inferiores */}
            <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-slate-100 text-center">
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-semibold">Ticket médio</p>
                <p className="text-xs font-black text-slate-900 mt-0.5">{data.financialSummary.ticketMedio}</p>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-semibold">Taxas</p>
                <p className="text-xs font-black text-slate-900 mt-0.5">{data.financialSummary.taxas}</p>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-semibold">Reembolsos</p>
                <p className="text-xs font-black text-slate-900 mt-0.5">{data.financialSummary.reembolsos}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Requer Atenção */}
        <div id="requer-atencao" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                  Requer atenção
                </h3>
              </div>
              <Link to="/backoffice/reembolsos" className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline">
                Ver todas
              </Link>
            </div>

            {/* 4 Linhas com Badges Numéricos e Links */}
            <div className="mt-4 space-y-3.5">
              {data.attentionItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs py-0.5 group">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full ${item.bg} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs`}>
                      {item.count}
                    </span>
                    <div>
                      <p className="font-bold text-slate-900 leading-tight group-hover:text-sky-600 transition-colors">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.detail}</p>
                    </div>
                  </div>

                  <Link
                    to={item.link}
                    className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline shrink-0 pl-2"
                  >
                    {item.action}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

