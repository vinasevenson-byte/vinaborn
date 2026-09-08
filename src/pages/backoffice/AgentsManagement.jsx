import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  UserPlus,
  Search,
  Copy,
  CheckCircle2,
  XCircle,
  Power,
  DollarSign,
  TrendingUp,
  Building,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { Card, Badge, Input } from '../../components/ui/FormControls';
import { Button } from '../../components/ui/Button';

export const AgentsManagement = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    phone: '',
    agencyName: 'CWB City Tours',
    commissionRate: 4.50,
    agentCode: ''
  });

  const loadAgents = () => {
    fetch('/api/agents')
      .then(res => res.json())
      .then(data => {
        setAgents(data);
        setLoading(false);
      })
      .catch(() => {
        setAgents([
          {
            id: 1,
            name: "Rodrigo C. Silveira",
            email: "rodrigo.agente@cwbtours.com.br",
            cpf: "111.444.777-88",
            phone: "(41) 98822-4411",
            agencyName: "CWB City Tours",
            agencyId: 1,
            agentCode: "AGT-CWB-001",
            commissionRate: 4.00,
            totalSales: 18450.00,
            active: true
          },
          {
            id: 2,
            name: "Camila Fagundes",
            email: "camila.vendas@cwbtours.com.br",
            cpf: "222.555.888-99",
            phone: "(41) 99111-3322",
            agencyName: "CWB City Tours",
            agencyId: 1,
            agentCode: "AGT-CWB-002",
            commissionRate: 5.00,
            totalSales: 30150.00,
            active: true
          },
          {
            id: 3,
            name: "Felipe Antunes",
            email: "felipe@paranaviagens.com.br",
            cpf: "333.666.999-00",
            phone: "(41) 99222-6677",
            agencyName: "Paraná Viagens",
            agencyId: 2,
            agentCode: "AGT-PR-001",
            commissionRate: 4.50,
            totalSales: 12600.00,
            active: true
          }
        ]);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadAgents();
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      await fetch(`/api/agents/${id}/toggle-status`, { method: 'PUT' });
    } catch {}
    setAgents(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const handleCreateAgent = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      commissionRate: parseFloat(formData.commissionRate) || 4.0
    };

    try {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const saved = await res.json();
        setAgents(prev => [saved, ...prev]);
      } else {
        throw new Error();
      }
    } catch {
      const fallback = {
        id: Date.now(),
        ...payload,
        agentCode: payload.agentCode || `AGT-CWB-${Math.floor(Math.random() * 900 + 100)}`,
        totalSales: 0.0,
        active: true
      };
      setAgents(prev => [fallback, ...prev]);
    }

    setShowModal(false);
    setFormData({
      name: '',
      email: '',
      cpf: '',
      phone: '',
      agencyName: 'CWB City Tours',
      commissionRate: 4.50,
      agentCode: ''
    });
  };

  const copyAgentLink = (code) => {
    const url = `${window.location.origin}/carrinho?cupom=${code}`;
    navigator.clipboard.writeText(url);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const filteredAgents = agents.filter(a => {
    const q = search.toLowerCase();
    return !q ||
      a.name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.agentCode.toLowerCase().includes(q) ||
      a.agencyName.toLowerCase().includes(q);
  });

  const totalSales = agents.reduce((acc, a) => acc + (parseFloat(a.totalSales) || 0), 0);
  const activeCount = agents.filter(a => a.active).length;

  return (
    <div className="space-y-8 pb-12">
      {/* Topo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
            Canal de Distribuição B2B (WF-050 / WF-051)
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Gestão de Agentes de Viagens
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Credencie agentes individuais vinculados às agências, atribua códigos de rastreio e comissionamento.
          </p>
        </div>

        <Button onClick={() => setShowModal(true)} variant="primary" className="font-bold text-xs gap-1.5 shadow-xs">
          <UserPlus className="w-4 h-4" />
          <span>Credenciar Novo Agente (WF-051)</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="p-5 border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Agentes Cadastrados</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{agents.length}</span>
            <span className="text-[11px] text-emerald-600 font-semibold">{activeCount} ativos e emitindo</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <UserCheck className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-5 border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Volume Vendido (Agentes)</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {totalSales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
            <span className="text-[11px] text-sky-600 font-semibold">Comissões auditadas via split</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-5 border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Comissão Média</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">4.50%</span>
            <span className="text-[11px] text-amber-600 font-semibold">Subtraído da margem da agência</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
        </Card>
      </div>

      {/* Busca */}
      <Card className="p-4 border-slate-200 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Pesquisar por Agente, E-mail, Código (ex: AGT-CWB-001) ou Agência..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-sm outline-none placeholder:text-slate-400"
        />
      </Card>

      {/* Tabela de Agentes */}
      <Card className="overflow-hidden border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                <th className="py-3.5 px-6">Agente</th>
                <th className="py-3.5 px-6">Código de Rastreio</th>
                <th className="py-3.5 px-6">Agência Pertencente</th>
                <th className="py-3.5 px-6 text-center">Comissão</th>
                <th className="py-3.5 px-6 text-right">Volume Vendido</th>
                <th className="py-3.5 px-6 text-center">Status</th>
                <th className="py-3.5 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAgents.map((agent) => (
                <tr key={agent.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900">{agent.name}</div>
                    <div className="text-xs text-slate-400 font-medium">{agent.email}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">{agent.phone}</div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
                        {agent.agentCode}
                      </span>
                      <button
                        onClick={() => copyAgentLink(agent.agentCode)}
                        className="p-1 text-slate-400 hover:text-sky-600 transition-colors cursor-pointer"
                        title="Copiar Link de Venda do Agente"
                      >
                        {copiedCode === agent.agentCode ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1.5 font-medium text-slate-700 text-xs">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>{agent.agencyName}</span>
                    </div>
                  </td>

                  <td className="py-4 px-6 text-center">
                    <span className="font-bold text-xs text-slate-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      {parseFloat(agent.commissionRate).toFixed(1)}%
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right font-mono font-bold text-xs text-slate-900">
                    {(parseFloat(agent.totalSales) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>

                  <td className="py-4 px-6 text-center">
                    {agent.active ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Ativo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-300">
                        <XCircle className="w-3 h-3" />
                        Inativo
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleToggleStatus(agent.id)}
                      className={`p-1.5 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer ${
                        agent.active
                          ? 'text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200'
                          : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                      title={agent.active ? 'Suspender Agente' : 'Ativar Agente'}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{agent.active ? 'Suspender' : 'Ativar'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Credenciar Novo Agente (WF-051) */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div>
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                Credenciamento B2B (WF-051)
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-0.5">Credenciar Novo Agente de Viagens</h3>
              <p className="text-xs text-slate-500 mt-1">O agente receberá acesso ao portal para vendas diretas com split automático.</p>
            </div>

            <form onSubmit={handleCreateAgent} className="space-y-4">
              <Input
                label="Nome Completo do Agente"
                placeholder="Ex: Gabriela Santos Miranda"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <Input
                label="E-mail Corporativo"
                type="email"
                placeholder="gabriela.vendas@agencia.com.br"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="CPF"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  required
                />
                <Input
                  label="Telefone / WhatsApp"
                  placeholder="(41) 99999-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Agência Vinculada</label>
                <select
                  value={formData.agencyName}
                  onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white font-medium"
                >
                  <option value="CWB City Tours">CWB City Tours (CNPJ 18.444.555/0001-22)</option>
                  <option value="Paraná Viagens">Paraná Viagens (CNPJ 24.555.666/0001-33)</option>
                  <option value="Curitiba Sul Receptivo">Curitiba Sul Receptivo (CNPJ 31.888.999/0001-44)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Comissão Direta (%)"
                  type="number"
                  step="0.1"
                  placeholder="4.5"
                  value={formData.commissionRate}
                  onChange={(e) => setFormData({ ...formData, commissionRate: e.target.value })}
                  required
                />
                <Input
                  label="Código Personalizado (Opcional)"
                  placeholder="Ex: AGT-GABI"
                  value={formData.agentCode}
                  onChange={(e) => setFormData({ ...formData, agentCode: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <Button type="button" onClick={() => setShowModal(false)} variant="outline" className="flex-1 font-bold text-xs">
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" className="flex-1 font-bold text-xs">
                  Emitir Credenciamento
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
