import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Search,
  AlertTriangle,
  UserX,
  UserCheck,
  Lock,
  Unlock,
  Eye,
  Clock,
  Ticket,
  CheckCircle2,
  RefreshCw,
  TrendingUp,
  Activity
} from 'lucide-react';
import { Card, Badge, Input } from '../../components/ui/FormControls';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';

export const AntiScalpingPanel = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({
    monitoredCpfs: 3,
    blockedCpfs: 1,
    highRiskAlerts: 1,
    interceptedTickets: 43
  });

  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const loadAlerts = () => {
    fetch('/api/anti-scalping/alerts')
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setAlerts(data);
        } else {
          throw new Error('Invalid data');
        }
        setLoading(false);
      })
      .catch(() => {
        setAlerts([
          {
            id: 1,
            cpf: "999.888.777-11",
            customerName: "Marcos Paulo de Oliveira",
            customerEmail: "marcos.oliveira@tempmail.com",
            purchasesThisMonth: 14,
            totalTransfers: 4,
            riskLevel: "HIGH",
            triggerReason: "Tentativa de compra de 14 ingressos do 1º lote promocional da Ópera com 3 cartões virtuais distintos no mesmo dia.",
            blocked: false,
            flaggedAt: "2026-09-08T08:15:00"
          },
          {
            id: 2,
            cpf: "444.555.666-00",
            customerName: "Ingressos CWB Promoções Eireli",
            customerEmail: "revenda.ingressos@contato.com",
            purchasesThisMonth: 22,
            totalTransfers: 9,
            riskLevel: "BLOCKED",
            triggerReason: "Revenda secundária não autorizada identificada com transferência em massa de vouchers digitais.",
            blocked: true,
            flaggedAt: "2026-09-04T16:20:00",
            blockedAt: "2026-09-04T16:25:00",
            blockedBy: "Administrador"
          },
          {
            id: 3,
            cpf: "123.456.789-99",
            customerName: "Juliana Costa Mendes",
            customerEmail: "juliana.mendes@email.com",
            purchasesThisMonth: 7,
            totalTransfers: 1,
            riskLevel: "MEDIUM",
            triggerReason: "Compra de 7 ingressos para familiares ultrapassando levemente o limite mensal de 6 por CPF.",
            blocked: false,
            flaggedAt: "2026-09-07T19:40:00"
          }
        ]);
        setLoading(false);
      });

    fetch('/api/anti-scalping/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => {});
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleToggleBlock = async (alert) => {
    setActionLoading(true);
    const endpoint = alert.blocked
      ? `/api/anti-scalping/unblock/${alert.id}`
      : `/api/anti-scalping/block/${alert.id}`;

    try {
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blockedBy: user?.name || 'Administrador' })
      });
      if (res.ok) {
        const updated = await res.json();
        setAlerts(prev => prev.map(a => a.id === updated.id ? updated : a));
      } else {
        throw new Error();
      }
    } catch {
      setAlerts(prev => prev.map(a => a.id === alert.id ? {
        ...a,
        blocked: !a.blocked,
        riskLevel: !a.blocked ? 'BLOCKED' : 'LOW',
        blockedAt: !a.blocked ? new Date().toISOString() : null,
        blockedBy: !a.blocked ? (user?.name || 'Administrador') : null
      } : a));
    } finally {
      setActionLoading(false);
      setShowDetailsModal(false);
    }
  };

  const safeAlerts = Array.isArray(alerts) ? alerts : [];
  const filteredAlerts = safeAlerts.filter(a => {
    const q = search.toLowerCase();
    return !q ||
      (a.cpf && a.cpf.includes(q)) ||
      (a.customerName && a.customerName.toLowerCase().includes(q)) ||
      (a.customerEmail && a.customerEmail.toLowerCase().includes(q));
  });

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
            Módulo de Segurança & Integridade (WF-060 / RF-040 / RN-038)
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Painel de Monitoramento Anti-Cambista
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Detecção algorítmica de compras em massa, transferências irregulares de titularidade e bloqueio preventivo de CPFs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={loadAlerts} variant="outline" className="font-bold text-xs gap-1.5 bg-white shadow-xs">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Atualizar Varredura</span>
          </Button>
        </div>
      </div>

      {/* Regras Ativas de Segurança */}
      <Card className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white border-0 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-sm">Regras Anti-Cambista Ativas (RN-038)</h4>
              <p className="text-slate-300 text-[11px]">Algoritmo de varredura heurística executando a cada transação.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] font-semibold text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Limite de <strong>6 ingressos</strong> por CPF/Mês</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Máximo de <strong>2 transferências</strong> por voucher</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Bloqueio de IP com compras concorrentes</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <Card className="p-5 border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CPFs sob Monitoramento</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{alerts.length}</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Alertas de Alto Risco</p>
              <h3 className="text-2xl font-black text-amber-600 mt-1">
                {alerts.filter(a => a.riskLevel === 'HIGH').length}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CPFs Bloqueados</p>
              <h3 className="text-2xl font-black text-rose-600 mt-1">
                {alerts.filter(a => a.blocked).length}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <UserX className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ingressos Interceptados</p>
              <h3 className="text-2xl font-black text-emerald-700 mt-1">
                {alerts.reduce((acc, a) => acc + (a.purchasesThisMonth || 0), 0)}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Barra de Filtro */}
      <Card className="p-4 border-slate-200 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Filtrar por CPF, Nome do Comprador ou E-mail sob suspeita..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-sm outline-none placeholder:text-slate-400"
        />
      </Card>

      {/* Tabela de Alertas */}
      <Card className="overflow-hidden border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                <th className="py-3.5 px-6">CPF & Comprador</th>
                <th className="py-3.5 px-6">Compras no Mês</th>
                <th className="py-3.5 px-6">Transferências</th>
                <th className="py-3.5 px-6">Nível de Risco</th>
                <th className="py-3.5 px-6">Gatilho do Alerta</th>
                <th className="py-3.5 px-6 text-center">Status</th>
                <th className="py-3.5 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAlerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-mono font-black text-slate-900 text-xs">{alert.cpf}</div>
                    <div className="font-semibold text-slate-800 text-xs mt-0.5">{alert.customerName}</div>
                    <div className="text-[11px] text-slate-400">{alert.customerEmail}</div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className={`font-black text-sm ${
                        alert.purchasesThisMonth > 6 ? 'text-rose-600' : 'text-slate-900'
                      }`}>
                        {alert.purchasesThisMonth} un.
                      </span>
                      <span className="text-[10px] text-slate-400">(limite: 6)</span>
                    </div>
                    <div className="w-24 h-1.5 rounded-full bg-slate-100 overflow-hidden mt-1 border border-slate-200">
                      <div
                        className={`h-full rounded-full ${
                          alert.purchasesThisMonth > 6 ? 'bg-rose-500' : 'bg-sky-500'
                        }`}
                        style={{ width: `${Math.min(100, (alert.purchasesThisMonth / 6) * 100)}%` }}
                      />
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className={`font-black text-sm ${
                        alert.totalTransfers > 2 ? 'text-amber-600' : 'text-slate-900'
                      }`}>
                        {alert.totalTransfers}x
                      </span>
                      <span className="text-[10px] text-slate-400">(limite: 2)</span>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    {alert.riskLevel === 'HIGH' && (
                      <Badge variant="danger" className="font-bold">ALTO RISCO</Badge>
                    )}
                    {alert.riskLevel === 'MEDIUM' && (
                      <Badge variant="warning" className="font-bold">MÉDIO RISCO</Badge>
                    )}
                    {alert.riskLevel === 'BLOCKED' && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-white">
                        <Lock className="w-3 h-3" />
                        BLOQUEADO
                      </span>
                    )}
                    {alert.riskLevel === 'LOW' && (
                      <Badge variant="success" className="font-bold">NORMALIZADO</Badge>
                    )}
                  </td>

                  <td className="py-4 px-6 max-w-xs">
                    <p className="text-xs text-slate-600 truncate" title={alert.triggerReason}>
                      {alert.triggerReason}
                    </p>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                      Detectado em: {new Date(alert.flaggedAt).toLocaleString('pt-BR')}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-center">
                    {alert.blocked ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                        <ShieldX className="w-3 h-3" />
                        Bloqueado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <ShieldCheck className="w-3 h-3" />
                        Ativo
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-6 text-right space-x-2">
                    <Button
                      onClick={() => {
                        setSelectedAlert(alert);
                        setShowDetailsModal(true);
                      }}
                      variant="outline"
                      className="text-xs font-bold px-3 py-1.5"
                    >
                      Detalhes
                    </Button>

                    <button
                      onClick={() => handleToggleBlock(alert)}
                      className={`p-2 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer ${
                        alert.blocked
                          ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                          : 'text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200'
                      }`}
                      title={alert.blocked ? 'Desbloquear CPF' : 'Bloquear CPF Imediatamente'}
                    >
                      {alert.blocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                      <span>{alert.blocked ? 'Desbloquear' : 'Bloquear CPF'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal de Detalhes do Alerta */}
      {showDetailsModal && selectedAlert && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div>
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                Auditoria Anti-Cambista (WF-060)
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-0.5">
                Investigação de CPF: {selectedAlert.cpf}
              </h3>
              <p className="text-xs text-slate-500">Histórico de alertas e compras atípicas rastreadas pelo sistema.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Comprador:</span>
                <span className="font-bold text-slate-900">{selectedAlert.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">E-mail:</span>
                <span className="font-mono text-slate-800">{selectedAlert.customerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total de Ingressos este Mês:</span>
                <span className="font-black text-rose-600 text-sm">{selectedAlert.purchasesThisMonth} un.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Transferências de Titularidade:</span>
                <span className="font-bold text-amber-700">{selectedAlert.totalTransfers} vezes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status Atual:</span>
                <Badge variant={selectedAlert.blocked ? 'danger' : 'warning'}>
                  {selectedAlert.blocked ? 'BLOQUEIO PREVENTIVO ATIVO' : 'EM MONITORAMENTO'}
                </Badge>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-700 uppercase tracking-wider block">
                Gatilho Heurístico Registrado:
              </label>
              <div className="p-3 bg-rose-50 rounded-xl text-rose-900 border border-rose-200 leading-relaxed font-medium">
                {selectedAlert.triggerReason}
              </div>
            </div>

            <div className="flex gap-3 pt-3 border-t border-slate-100">
              <Button
                type="button"
                onClick={() => setShowDetailsModal(false)}
                variant="outline"
                className="flex-1 font-bold text-xs"
              >
                Fechar
              </Button>

              <Button
                type="button"
                onClick={() => handleToggleBlock(selectedAlert)}
                loading={actionLoading}
                variant={selectedAlert.blocked ? 'primary' : 'primary'}
                className={`flex-1 font-bold text-xs ${
                  selectedAlert.blocked ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {selectedAlert.blocked ? 'Desbloquear Acesso' : 'Confirmar Bloqueio de CPF'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
