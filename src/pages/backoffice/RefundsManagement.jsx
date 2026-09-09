import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  DollarSign,
  FileText,
  User,
  Ticket,
  Calendar,
  ShieldAlert,
  Eye,
  Check,
  Building2
} from 'lucide-react';
import { Card, Badge, Input } from '../../components/ui/FormControls';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';

export const RefundsManagement = () => {
  const { user } = useAuth();
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED'
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [decisionNotes, setDecisionNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const loadRefunds = () => {
    fetch('/api/refunds')
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setRefunds(data);
        } else {
          throw new Error('Invalid data');
        }
        setLoading(false);
      })
      .catch(() => {
        setRefunds([
          {
            id: 1,
            protocolNumber: "RMB-2026-0041",
            orderNumber: "CWB-2026-00215",
            voucherCode: "VCH-CWB-2026-3390",
            customerName: "Lucas Andrade da Silva",
            customerCpf: "111.999.888-77",
            customerEmail: "lucas.andrade@email.com",
            attractionName: "Ópera de Arame e Vale da Música",
            amount: 30.00,
            reason: "Tive um imprevisto médico comprovado por atestado anexo e não poderei comparecer a Curitiba na data programada.",
            withinLegalDeadline: false,
            paymentMethod: "PIX",
            pixKey: "111.999.888-77",
            status: "PENDING_REVIEW",
            requestedAt: "2026-09-08T08:30:00"
          },
          {
            id: 2,
            protocolNumber: "RMB-2026-0038",
            orderNumber: "CWB-2026-00421",
            voucherCode: "VCH-CWB-2026-1102",
            customerName: "Fernanda Souza Meireles",
            customerCpf: "222.888.777-66",
            customerEmail: "fernanda.souza@email.com",
            attractionName: "Passeio de Trem da Serra do Mar",
            amount: 175.00,
            reason: "Direito de arrependimento nos 7 dias conforme Artigo 49 do CDC.",
            withinLegalDeadline: true,
            paymentMethod: "PIX",
            pixKey: "fernanda.souza@email.com",
            status: "APPROVED",
            reviewedBy: "Sistema (CDC 7 dias automático)",
            decisionNotes: "Estorno automático liquidado via chave PIX em conformidade com o prazo legal.",
            requestedAt: "2026-09-07T11:00:00",
            reviewedAt: "2026-09-07T11:00:15"
          },
          {
            id: 3,
            protocolNumber: "RMB-2026-0032",
            orderNumber: "CWB-2026-00109",
            voucherCode: "VCH-CWB-2026-8840",
            customerName: "Rodrigo Martins",
            customerCpf: "333.777.666-55",
            customerEmail: "rodrigo.martins@email.com",
            attractionName: "Museu Oscar Niemeyer (MON)",
            amount: 30.00,
            reason: "Choveu no dia do passeio e desisti de ir.",
            withinLegalDeadline: false,
            paymentMethod: "CREDIT_CARD",
            status: "REJECTED",
            reviewedBy: "Administrador Comercial",
            decisionNotes: "Condições climáticas comuns não configuram motivo de força maior para cancelamento fora do prazo de 7 dias.",
            requestedAt: "2026-09-05T09:15:00",
            reviewedAt: "2026-09-06T14:30:00"
          }
        ]);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadRefunds();
  }, []);

  const handleDecision = async (status) => {
    if (!selectedRefund) return;
    setActionLoading(true);

    const endpoint = status === 'APPROVED'
      ? `/api/refunds/${selectedRefund.id}/approve`
      : `/api/refunds/${selectedRefund.id}/reject`;

    const body = {
      reviewerName: user?.name || 'Administrador',
      notes: decisionNotes || (status === 'APPROVED' ? 'Estorno aprovado pela gerência.' : 'Solicitação indeferida.')
    };

    try {
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        const updated = await res.json();
        setRefunds(prev => prev.map(r => r.id === updated.id ? updated : r));
      } else {
        throw new Error();
      }
    } catch {
      setRefunds(prev => prev.map(r => r.id === selectedRefund.id ? {
        ...r,
        status,
        reviewedBy: user?.name || 'Administrador',
        decisionNotes: body.notes,
        reviewedAt: new Date().toISOString()
      } : r));
    } finally {
      setActionLoading(false);
      setShowModal(false);
      setSelectedRefund(null);
      setDecisionNotes('');
    }
  };

  const safeRefunds = Array.isArray(refunds) ? refunds : [];
  const filteredRefunds = safeRefunds.filter(r => {
    const q = search.toLowerCase();
    const matchesQuery = !q ||
      (r.protocolNumber && r.protocolNumber.toLowerCase().includes(q)) ||
      (r.customerName && r.customerName.toLowerCase().includes(q)) ||
      (r.customerCpf && r.customerCpf.includes(q)) ||
      (r.orderNumber && r.orderNumber.toLowerCase().includes(q));

    const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;
    return matchesQuery && matchesStatus;
  });

  const pendingCount = safeRefunds.filter(r => r.status === 'PENDING_REVIEW').length;
  const approvedTotal = safeRefunds
    .filter(r => r.status === 'APPROVED')
    .reduce((acc, r) => acc + (Number(r.amount) || 0), 0);

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
            Módulo Financeiro & SAC (WF-053 / RF-036)
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Fila de Reembolsos & Estornos
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Triagem de cancelamentos fora do prazo legal de 7 dias (CDC) e auditoria de devoluções bancárias.
          </p>
        </div>

        {pendingCount > 0 && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 px-3.5 py-1.5 rounded-xl text-xs font-bold animate-pulse">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{pendingCount} solicitação(ões) pendente(s) de análise manual</span>
          </div>
        )}
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="p-5 border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pendentes de Decisão</p>
              <h3 className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Estornado este Mês</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                R$ {approvedTotal.toFixed(2).replace('.', ',')}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Regra Geral CDC Art. 49</p>
              <h3 className="text-sm font-black text-sky-700 mt-1">7 Dias Corridos</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Estorno 100% automático</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Barra de Filtros */}
      <Card className="p-4 border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Pesquisar por Protocolo (ex: RMB-2026...), Nome, CPF ou Pedido..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="ALL">Todos os Status</option>
            <option value="PENDING_REVIEW">Pendentes de Triagem</option>
            <option value="APPROVED">Estornos Aprovados</option>
            <option value="REJECTED">Solicitações Rejeitadas</option>
          </select>
        </div>
      </Card>

      {/* Tabela de Listagem */}
      <Card className="overflow-hidden border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                <th className="py-3.5 px-6">Protocolo & Data</th>
                <th className="py-3.5 px-6">Turista / Requerente</th>
                <th className="py-3.5 px-6">Atração & Pedido</th>
                <th className="py-3.5 px-6">Valor Solicitado</th>
                <th className="py-3.5 px-6">Enquadramento Legal</th>
                <th className="py-3.5 px-6 text-center">Status</th>
                <th className="py-3.5 px-6 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRefunds.map((refund) => (
                <tr key={refund.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-mono font-black text-sky-800 text-xs bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200 block w-fit">
                      {refund.protocolNumber}
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-1">
                      {new Date(refund.requestedAt).toLocaleString('pt-BR')}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900">{refund.customerName}</div>
                    <div className="text-xs text-slate-400 font-mono">{refund.customerCpf}</div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="font-semibold text-slate-800 text-xs">{refund.attractionName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">Pedido: {refund.orderNumber}</div>
                  </td>

                  <td className="py-4 px-6 font-black text-slate-900 text-base">
                    R$ {Number(refund.amount).toFixed(2).replace('.', ',')}
                  </td>

                  <td className="py-4 px-6">
                    {refund.withinLegalDeadline ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Check className="w-3 h-3" />
                        CDC 7 Dias (Automático)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <AlertCircle className="w-3 h-3" />
                        Fora do Prazo (Triagem)
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-6 text-center">
                    {refund.status === 'PENDING_REVIEW' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                        <Clock className="w-3 h-3" />
                        Pendente
                      </span>
                    )}
                    {refund.status === 'APPROVED' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        Aprovado
                      </span>
                    )}
                    {refund.status === 'REJECTED' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                        <XCircle className="w-3 h-3" />
                        Rejeitado
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <Button
                      onClick={() => {
                        setSelectedRefund(refund);
                        setDecisionNotes(refund.decisionNotes || '');
                        setShowModal(true);
                      }}
                      variant="outline"
                      className="text-xs font-bold px-3 py-1.5 gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-sky-600" />
                      <span>Analisar (WF-053)</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ========================================================================= */}
      {/* MODAL WF-053: TRIAGEM E ANÁLISE DE REEMBOLSO                             */}
      {/* ========================================================================= */}
      {showModal && selectedRefund && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                  Triagem de Reembolso (WF-053)
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                  Protocolo: {selectedRefund.protocolNumber}
                </h3>
              </div>
              <Badge variant={selectedRefund.withinLegalDeadline ? 'success' : 'warning'}>
                {selectedRefund.withinLegalDeadline ? 'Prazo Legal CDC' : 'Fora do Prazo'}
              </Badge>
            </div>

            {/* Dados da Solicitação */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Turista:</span>
                <span className="font-bold text-slate-900">{selectedRefund.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">CPF:</span>
                <span className="font-mono text-slate-800">{selectedRefund.customerCpf}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Atração:</span>
                <span className="font-semibold text-slate-900">{selectedRefund.attractionName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Valor a Estornar:</span>
                <span className="font-black text-emerald-700 text-sm">
                  R$ {Number(selectedRefund.amount).toFixed(2).replace('.', ',')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Chave PIX de Devolução:</span>
                <span className="font-mono font-bold text-sky-800">{selectedRefund.pixKey || 'Mesma conta pagadora'}</span>
              </div>
            </div>

            {/* Motivo Alegado */}
            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-700 uppercase tracking-wider block">
                Motivo Informado pelo Cliente:
              </label>
              <div className="p-3 bg-slate-100 rounded-xl text-slate-700 leading-relaxed border border-slate-200">
                "{selectedRefund.reason || 'Sem justificativa informada'}"
              </div>
            </div>

            {/* Alerta Legal se Fora do Prazo */}
            {!selectedRefund.withinLegalDeadline && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Atenção:</strong> Solicitação recebida após o período de arrependimento legal (7 dias). A aprovação requer comprovação de caso fortuito ou força maior.
                </span>
              </div>
            )}

            {/* Parecer do Auditor */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-700 uppercase tracking-wider block">
                Parecer do Gestor / Justificativa da Decisão:
              </label>
              <textarea
                rows={3}
                value={decisionNotes}
                onChange={(e) => setDecisionNotes(e.target.value)}
                placeholder="Insira as notas de auditoria justificando a concessão ou indeferimento do estorno..."
                className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-3 pt-3 border-t border-slate-100">
              <Button
                type="button"
                onClick={() => setShowModal(false)}
                variant="outline"
                className="flex-1 text-xs font-bold"
              >
                Voltar
              </Button>

              {selectedRefund.status === 'PENDING_REVIEW' && (
                <>
                  <Button
                    type="button"
                    onClick={() => handleDecision('REJECTED')}
                    loading={actionLoading}
                    variant="outline"
                    className="flex-1 text-xs font-bold text-rose-700 border-rose-200 hover:bg-rose-50"
                  >
                    Rejeitar
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleDecision('APPROVED')}
                    loading={actionLoading}
                    variant="primary"
                    className="flex-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-700"
                  >
                    Aprovar Estorno
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
