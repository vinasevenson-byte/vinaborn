import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Ticket,
  CheckCircle2,
  DollarSign,
  Users,
  QrCode,
  ArrowUpRight,
  Calendar,
  AlertCircle,
  Plus
} from 'lucide-react';
import { Card, Badge } from '../../components/ui/FormControls';
import { Button } from '../../components/ui/Button';

export const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalRevenue: '148.520,00',
    monthlyRevenue: '42.350,00',
    todayRevenue: '3.890,00',
    activeTickets: 842,
    validatedToday: 127,
    totalAttractions: 5,
    salesChart: [
      { date: 'Seg', vendas: 34 },
      { date: 'Ter', vendas: 48 },
      { date: 'Qua', vendas: 62 },
      { date: 'Qui', vendas: 58 },
      { date: 'Sex', vendas: 112 },
      { date: 'Sáb', vendas: 215 },
      { date: 'Dom', vendas: 184 },
    ]
  });

  useEffect(() => {
    fetch('/api/dashboard/metrics')
      .then(res => res.json())
      .then(data => {
        setMetrics(prev => ({
          ...prev,
          totalRevenue: Number(data.totalRevenue).toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
          todayRevenue: Number(data.todayRevenue).toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
          activeTickets: data.activeTickets,
          validatedToday: data.validatedToday,
          totalAttractions: data.totalAttractions || 5,
          salesChart: data.salesChart || prev.salesChart
        }));
      })
      .catch(() => {
        // Dados locais já preenchidos
      });
  }, []);

  return (
    <div className="space-y-8">
      {/* Header com Ações Rápidas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Visão Consolidada (WF-002)</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Dashboard Operacional</h2>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/backoffice/validacao">
            <Button variant="secondary" className="font-bold gap-2">
              <QrCode className="w-4 h-4" />
              <span>Validar Ingresso (QR Code)</span>
            </Button>
          </Link>
          <Link to="/backoffice/atracoes">
            <Button variant="primary" className="font-bold gap-2">
              <Plus className="w-4 h-4" />
              <span>Nova Atração</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid de KPIs Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-white border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Vendas Hoje</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">R$ {metrics.todayRevenue}</h3>
              <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+18.4% vs. ontem</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Ingressos Ativos</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{metrics.activeTickets}</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Aguardando utilização</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Ticket className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Validados Hoje</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{metrics.validatedToday}</h3>
              <p className="text-xs text-emerald-600 font-semibold mt-1">Entrada na atração</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Atrações Ativas</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{metrics.totalAttractions}</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">100% integradas</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Gráfico Semanal e Atividades Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gráfico de Vendas */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Volume de Ingressos por Dia</h3>
              <p className="text-xs text-slate-500">Últimos 7 dias de operação comercial</p>
            </div>
            <Badge variant="primary">Semana Atual</Badge>
          </div>

          <div className="h-64 flex items-end justify-between gap-4 pt-8 px-4">
            {metrics.salesChart.map((bar, idx) => {
              const max = 250;
              const heightPercent = Math.min(100, Math.round((bar.vendas / max) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[11px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {bar.vendas}
                  </span>
                  <div className="w-full bg-slate-100 rounded-t-lg h-44 flex items-end">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-gradient-to-t from-sky-600 to-sky-400 rounded-t-lg group-hover:from-sky-500 group-hover:to-sky-300 transition-all"
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-slate-500">{bar.date}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notificações Operacionais e Alertas Anti-Cambista */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-900">Alertas Operacionais</h3>
            <Badge variant="warning">Ativos</Badge>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>2 Solicitações de Reembolso</span>
              </div>
              <p className="text-amber-800">Aguardando aprovação manual na fila do Backoffice.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-sky-600" />
                <span>Contrato Assinado via DocuSign</span>
              </div>
              <p className="text-sky-800">Agência Curitiba Tours aprovada para operar.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Ticket className="w-4 h-4 text-emerald-600" />
                <span>Lote 1 Esgotado: MON</span>
              </div>
              <p className="text-emerald-800">Transição automática para o 2º Lote ativada.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
