import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Download,
  Printer,
  Calendar,
  Filter,
  Building2,
  Briefcase,
  Ticket,
  Percent,
  CreditCard,
  QrCode,
  RotateCcw,
  Tag,
  CheckCircle2,
  FileSpreadsheet,
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, Badge } from '../../components/ui/FormControls';
import { Button } from '../../components/ui/Button';

export const FinancialReports = () => {
  const [selectedReportId, setSelectedReportId] = useState('1'); // 1 a 9
  const [selectedPeriod, setSelectedPeriod] = useState('MONTH'); // 'TODAY' | 'WEEK' | 'MONTH' | 'YEAR'
  const [summary, setSummary] = useState({
    grossVolume: 124800.00,
    discountsGiven: 6420.00,
    platformRevenue: 12480.00,
    agencyCommissions: 6864.00,
    partnerPayouts: 105456.00,
    totalTransactions: 684,
    averageTicket: 182.45,
    totalTicketsIssued: 940
  });

  const [salesByAttraction, setSalesByAttraction] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState({
    pix: { amount: 81120.00, count: 480, mdrFeeRate: "0.99%" },
    card: { amount: 43680.00, count: 204, mdrFeeRate: "2.89%" }
  });

  // Catálogo dos 9 Relatórios Globais do Backoffice (WF-063 / RF-039)
  const reportCatalog = [
    { id: '1', title: '1. Vendas por Período & Atração', icon: BarChart3, desc: 'Faturamento bruto, volume de ingressos e ticket médio.' },
    { id: '2', title: '2. Comissões de Agências', icon: Briefcase, desc: 'Repasses contratuais de 10% a 12% por agência credenciada.' },
    { id: '3', title: '3. Borderô de Repasses a Parceiros', icon: Building2, desc: 'Valores líquidos devidos aos operadores de atrações.' },
    { id: '4', title: '4. Conciliação por Meio de Pagamento', icon: CreditCard, desc: 'MDR e prazos de liquidação (PIX D+1 vs Cartão D+30).' },
    { id: '5', title: '5. Reembolsos & Arrependimento CDC', icon: RotateCcw, desc: 'Índice de cancelamentos, estornos e motivos do SAC.' },
    { id: '6', title: '6. Conversão de Cupons & Campanhas', icon: Tag, desc: 'Eficácia promocional de cupons gerais e de agências.' },
    { id: '7', title: '7. Frequência de Catraca & No-Show', icon: QrCode, desc: 'Taxa de comparecimento e horários de pico.' },
    { id: '8', title: '8. DRE Operacional da Plataforma', icon: TrendingUp, desc: 'Demonstrativo de Receitas, Custos de Gateway e Margem Líquida.' },
    { id: '9', title: '9. Fechamento Fiscal & ISS Curitiba', icon: FileSpreadsheet, desc: 'Base de cálculo para tributação municipal (ISS 2% a 5%).' },
  ];

  useEffect(() => {
    fetch('/api/reports/summary')
      .then(res => res.json())
      .then(data => setSummary(data))
      .catch(() => {});

    fetch('/api/reports/sales-by-attraction')
      .then(res => res.json())
      .then(data => setSalesByAttraction(data))
      .catch(() => {
        setSalesByAttraction([
          { attractionName: "Passeio de Trem da Serra do Mar", totalSales: 68250.00, ticketsCount: 390, validCount: 340, usedCount: 45, cancelledCount: 5 },
          { attractionName: "Ópera de Arame e Vale da Música", totalSales: 28400.00, ticketsCount: 320, validCount: 280, usedCount: 36, cancelledCount: 4 },
          { attractionName: "Museu Oscar Niemeyer (MON)", totalSales: 19800.00, ticketsCount: 160, validCount: 140, usedCount: 18, cancelledCount: 2 },
          { attractionName: "Restaurante Madalosso (Pacotes)", totalSales: 8350.00, ticketsCount: 70, validCount: 65, usedCount: 5, cancelledCount: 0 }
        ]);
      });

    fetch('/api/reports/payment-methods')
      .then(res => res.json())
      .then(data => setPaymentMethods(data))
      .catch(() => {});
  }, []);

  const handleDownloadCsv = () => {
    window.open('/api/reports/export-csv', '_blank');
  };

  return (
    <div className="space-y-8">
      {/* Topo com Título e Ações de Exportação */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
            Módulo de Inteligência & Fechamento Contábil (WF-063 / RF-039)
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Relatórios Financeiros Globais
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Consolidação dos 9 relatórios regulatórios, borderôs de liquidação, comissões de agências e exportação fiscal.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Seletor de Período */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 p-1 rounded-xl shadow-xs text-xs font-bold">
            <Calendar className="w-3.5 h-3.5 text-slate-400 ml-2" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-transparent pr-3 py-1 outline-none text-slate-700 cursor-pointer font-bold"
            >
              <option value="MONTH">Mês Atual (Setembro/2026)</option>
              <option value="WEEK">Últimos 7 Dias</option>
              <option value="YEAR">Ano de 2026 Completo</option>
            </select>
          </div>

          <Button
            onClick={handleDownloadCsv}
            variant="outline"
            className="text-xs font-bold gap-1.5 bg-white shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Exportar Planilha (CSV)</span>
          </Button>

          <Button
            onClick={() => window.print()}
            variant="primary"
            className="text-xs font-bold gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Relatório</span>
          </Button>
        </div>
      </div>

      {/* Cards de Métricas Consolidadas (DRE Sintético) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-5 border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Volume Bruto (GMV)</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                R$ {Number(summary.grossVolume).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+18.4% vs mês anterior</span>
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Receita Líquida (Take Rate)</p>
              <h3 className="text-2xl font-black text-emerald-700 mt-1">
                R$ {Number(summary.platformRevenue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                10% média de taxa operacional
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Repasses a Parceiros</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                R$ {Number(summary.partnerPayouts).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                Líquido após taxas e comissões
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Comissões de Agências</p>
              <h3 className="text-2xl font-black text-amber-600 mt-1">
                R$ {Number(summary.agencyCommissions).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                12 agências comissionadas ativas
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Grade de Seleção dos 9 Relatórios do Catálogo */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
          Catálogo dos 9 Relatórios do Sistema (WF-063):
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-2">
          {reportCatalog.map((report) => {
            const Icon = report.icon;
            const isSelected = selectedReportId === report.id;
            return (
              <button
                key={report.id}
                onClick={() => setSelectedReportId(report.id)}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-sky-600 bg-sky-600 text-white shadow-md ring-2 ring-sky-300'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-sky-600'}`} />
                  <span className={`text-[10px] font-black ${isSelected ? 'text-sky-200' : 'text-slate-400'}`}>
                    #{report.id}
                  </span>
                </div>
                <div className="font-extrabold text-xs truncate" title={report.title}>
                  {report.title.split('. ')[1]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conteúdo Dinâmico do Relatório Selecionado */}
      <Card className="p-6 border-slate-200 bg-white space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
              Relatório Ativo
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">
              {reportCatalog.find(r => r.id === selectedReportId)?.title}
            </h3>
            <p className="text-xs text-slate-500">
              {reportCatalog.find(r => r.id === selectedReportId)?.desc}
            </p>
          </div>

          <Badge variant="primary" className="font-bold">
            Período: Setembro / 2026
          </Badge>
        </div>

        {/* Tabela do Relatório 1: Vendas por Atração */}
        {selectedReportId === '1' && (
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                    <th className="py-3.5 px-6">Atração Turística</th>
                    <th className="py-3.5 px-6">Ingressos Vendidos</th>
                    <th className="py-3.5 px-6">Utilizados na Catraca</th>
                    <th className="py-3.5 px-6">Taxa de Uso (%)</th>
                    <th className="py-3.5 px-6 text-right">Faturamento Bruto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {salesByAttraction.map((item, i) => {
                    const usagePercent = Math.round(((item.usedCount || 0) / (item.ticketsCount || 1)) * 100);
                    return (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6 font-bold text-slate-900">
                          {item.attractionName}
                        </td>
                        <td className="py-4 px-6 font-semibold text-slate-700">
                          {item.ticketsCount} un.
                        </td>
                        <td className="py-4 px-6 font-semibold text-emerald-700">
                          {item.usedCount} un.
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-700">{usagePercent}%</span>
                            <div className="w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className="h-full bg-sky-500 rounded-full"
                                style={{ width: `${usagePercent}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right font-black text-slate-900 text-base">
                          R$ {Number(item.totalSales).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Relatório 4: Conciliação Meios de Pagamento */}
        {selectedReportId === '4' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border-slate-200 bg-sky-50/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <QrCode className="w-5 h-5 text-sky-600" />
                  <span>PIX Instantâneo (Banco Central)</span>
                </div>
                <Badge variant="success">Liquidação D+1</Badge>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Volume Transacionado:</span>
                  <span className="font-black text-slate-900 text-sm">
                    R$ {Number(paymentMethods.pix.amount).toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Transações Confirmadas:</span>
                  <span className="font-bold text-slate-800">{paymentMethods.pix.count} pedidos</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Taxa MDR Negociada:</span>
                  <span className="font-bold text-emerald-700">{paymentMethods.pix.mdrFeeRate}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-slate-200 bg-purple-50/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                  <span>Cartões de Crédito (Visa / Master / Elo)</span>
                </div>
                <Badge variant="neutral">Liquidação D+30</Badge>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Volume Transacionado:</span>
                  <span className="font-black text-slate-900 text-sm">
                    R$ {Number(paymentMethods.card.amount).toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Transações Confirmadas:</span>
                  <span className="font-bold text-slate-800">{paymentMethods.card.count} pedidos</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Taxa MDR Negociada:</span>
                  <span className="font-bold text-purple-700">{paymentMethods.card.mdrFeeRate}</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Relatório 8: DRE Operacional */}
        {selectedReportId === '8' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex justify-between font-bold text-sm text-slate-900">
                <span>(+) RECEITA BRUTA OPERACIONAL (GMV)</span>
                <span>R$ {Number(summary.grossVolume).toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between text-rose-600 font-semibold pl-4">
                <span>(-) Custos de Gateway e MDR Adquirente</span>
                <span>- R$ {(Number(summary.grossVolume) * 0.018).toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between text-amber-600 font-semibold pl-4">
                <span>(-) Comissões Repassadas às Agências</span>
                <span>- R$ {Number(summary.agencyCommissions).toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between text-purple-600 font-semibold pl-4">
                <span>(-) Repasses Líquidos aos Parceiros das Atrações</span>
                <span>- R$ {Number(summary.partnerPayouts).toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between font-black text-base text-emerald-700 pt-3 border-t border-slate-200">
                <span>(=) MARGEM OPERACIONAL LÍQUIDA CURITIBA 360</span>
                <span>R$ {Number(summary.platformRevenue).toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Outros relatórios do catálogo */}
        {!['1', '4', '8'].includes(selectedReportId) && (
          <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900">Relatório Consolidado Disponível para Exportação</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Os dados deste demonstrativo são atualizados no fechamento contábil diário. Você pode visualizá-lo ou baixá-lo em planilha formatada.
            </p>
            <div className="pt-2">
              <Button onClick={handleDownloadCsv} variant="primary" className="text-xs font-bold gap-1.5">
                <Download className="w-3.5 h-3.5" />
                <span>Baixar Dados Deste Relatório (CSV)</span>
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
