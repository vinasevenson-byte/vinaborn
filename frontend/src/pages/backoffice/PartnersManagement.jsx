import React, { useState, useEffect } from 'react';
import {
  Building2,
  CheckCircle2,
  AlertCircle,
  PauseCircle,
  FileSignature,
  Search,
  Plus,
  Eye,
  Filter,
  ExternalLink,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';
import { Card, Badge, Input } from '../../components/ui/FormControls';
import { Button } from '../../components/ui/Button';

export const PartnersManagement = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, PENDING_APPROVAL, ACTIVE, SUSPENDED
  const [search, setSearch] = useState('');
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [suspensionReason, setSuspensionReason] = useState('');

  const [formData, setFormData] = useState({
    companyName: '',
    tradeName: '',
    cnpj: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: 'Curitiba',
    state: 'PR',
    bankName: '',
    bankAgency: '',
    bankAccount: '',
    pixKey: ''
  });

  const loadPartners = () => {
    fetch('/api/partners')
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setPartners(data);
        } else {
          throw new Error('Invalid data format');
        }
        setLoading(false);
      })
      .catch(() => {
        setPartners([
          {
            id: 1,
            companyName: "Restaurante Madalosso Ltda",
            tradeName: "Madalosso Santa Felicidade",
            cnpj: "76.123.456/0001-89",
            contactPerson: "Carlos Madalosso",
            email: "contato@madalosso.com.br",
            phone: "(41) 3372-2121",
            address: "Av. Manoel Ribas, 5875 - Santa Felicidade",
            city: "Curitiba",
            state: "PR",
            bankName: "Banco Itaú (341)",
            bankAgency: "0452",
            bankAccount: "19823-4",
            pixKey: "76.123.456/0001-89",
            status: "ACTIVE",
            approvedBy: "Administrador",
            approvedAt: "2026-08-10T14:30:00"
          },
          {
            id: 2,
            companyName: "Serra Verde Express Trens Turísticos S/A",
            tradeName: "Serra Verde Express",
            cnpj: "02.987.654/0001-10",
            contactPerson: "Adonai Arruda Filho",
            email: "comercial@serraverdeexpress.com.br",
            phone: "(41) 3888-3488",
            address: "Av. Presidente Affonso Camargo, 330",
            city: "Curitiba",
            state: "PR",
            bankName: "Banco do Brasil (001)",
            bankAgency: "1520-2",
            bankAccount: "38491-0",
            pixKey: "financeiro@serraverdeexpress.com.br",
            status: "PENDING_APPROVAL",
            createdAt: "2026-09-02T10:15:00"
          }
        ]);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadPartners();
  }, []);

  const handleApprove = async () => {
    if (!selectedPartner) return;
    try {
      await fetch(`/api/partners/${selectedPartner.id}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (e) {}

    setPartners(prev => prev.map(p => 
      p.id === selectedPartner.id ? { ...p, status: 'ACTIVE', approvedBy: 'Administrador' } : p
    ));
    setShowApproveModal(false);
    setSelectedPartner(null);
  };

  const handleSuspend = async () => {
    if (!selectedPartner) return;
    try {
      await fetch(`/api/partners/${selectedPartner.id}/suspend`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: suspensionReason })
      });
    } catch (e) {}

    setPartners(prev => prev.map(p => 
      p.id === selectedPartner.id ? { ...p, status: 'SUSPENDED', suspensionReason } : p
    ));
    setShowSuspendModal(false);
    setSelectedPartner(null);
    setSuspensionReason('');
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    } catch (e) {}

    setPartners(prev => [
      { ...formData, id: Date.now(), status: 'PENDING_APPROVAL', createdAt: new Date().toISOString() },
      ...prev
    ]);
    setShowCreateModal(false);
  };

  const safePartners = Array.isArray(partners) ? partners : [];
  const filteredPartners = safePartners.filter(p => {
    const matchesTab = activeTab === 'ALL' || p.status === activeTab;
    const matchesSearch = !search ||
                          (p.companyName && p.companyName.toLowerCase().includes(search.toLowerCase())) ||
                          (p.cnpj && p.cnpj.includes(search)) ||
                          (p.tradeName && p.tradeName.toLowerCase().includes(search.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const pendingCount = safePartners.filter(p => p.status === 'PENDING_APPROVAL').length;

  return (
    <div className="space-y-8">
      {/* Header com Ações */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Módulo de Parceiros (WF-058 / WF-059)</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Gestão de Parceiros Comerciais</h2>
          <p className="text-xs text-slate-500 mt-0.5">Credenciamento de atrações turísticas, auditoria documental e aprovação de contratos.</p>
        </div>

        <Button onClick={() => setShowCreateModal(true)} variant="primary" className="font-bold gap-2">
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Parceiro (WF-059)</span>
        </Button>
      </div>

      {/* Abas de Filtragem de Status */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'ALL'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Todos os Parceiros ({partners.length})
        </button>

        <button
          onClick={() => setActiveTab('PENDING_APPROVAL')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'PENDING_APPROVAL'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Pendentes de Aprovação</span>
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-800">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('ACTIVE')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'ACTIVE'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Ativos ({partners.filter(p => p.status === 'ACTIVE').length})
        </button>

        <button
          onClick={() => setActiveTab('SUSPENDED')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'SUSPENDED'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Suspensos ({partners.filter(p => p.status === 'SUSPENDED').length})
        </button>
      </div>

      {/* Tabela de Listagem */}
      <Card className="border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por Razão Social, Nome Fantasia ou CNPJ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                <th className="py-3.5 px-6">Empresa / Razão Social</th>
                <th className="py-3.5 px-6">CNPJ</th>
                <th className="py-3.5 px-6">Responsável & Contato</th>
                <th className="py-3.5 px-6">Dados Bancários / PIX</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Ações Operacionais</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPartners.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-semibold text-slate-900">
                    <p className="font-bold text-slate-900">{item.companyName}</p>
                    <span className="text-xs text-slate-500 font-normal">{item.tradeName || '—'}</span>
                  </td>

                  <td className="py-4 px-6 font-mono text-xs text-slate-700">
                    {item.cnpj}
                  </td>

                  <td className="py-4 px-6 text-xs text-slate-700">
                    <p className="font-semibold text-slate-900">{item.contactPerson}</p>
                    <p className="text-slate-500">{item.email} • {item.phone}</p>
                  </td>

                  <td className="py-4 px-6 text-xs text-slate-600">
                    <p className="font-medium text-slate-800">{item.bankName || 'Não informado'}</p>
                    <span className="text-slate-400">PIX: {item.pixKey || 'Não cadastrada'}</span>
                  </td>

                  <td className="py-4 px-6">
                    {item.status === 'ACTIVE' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Ativo
                      </span>
                    )}
                    {item.status === 'PENDING_APPROVAL' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 animate-pulse">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        Pendente de Aprovação
                      </span>
                    )}
                    {item.status === 'SUSPENDED' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <PauseCircle className="w-3.5 h-3.5" />
                        Suspenso
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-6 text-right space-x-2">
                    {item.status === 'PENDING_APPROVAL' && (
                      <button
                        onClick={() => {
                          setSelectedPartner(item);
                          setShowApproveModal(true);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Aprovar</span>
                      </button>
                    )}

                    {item.status === 'ACTIVE' && (
                      <button
                        onClick={() => {
                          setSelectedPartner(item);
                          setShowSuspendModal(true);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                      >
                        <PauseCircle className="w-3.5 h-3.5" />
                        <span>Suspender</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal de Aprovação de Parceiro */}
      {showApproveModal && selectedPartner && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-xl font-black text-slate-900">Aprovar Credenciamento</h3>
              <p className="text-xs text-slate-500">
                Você está prestes a aprovar <strong className="text-slate-800">{selectedPartner.companyName}</strong>.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">CNPJ:</span>
                <span className="font-mono font-bold text-slate-900">{selectedPartner.cnpj}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Responsável:</span>
                <span className="font-bold text-slate-900">{selectedPartner.contactPerson}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-emerald-700 font-semibold">
                <span>Efeito:</span>
                <span>Gera Contrato DocuSign e libera cadastro de atrações.</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setShowApproveModal(false)} variant="outline" className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleApprove} variant="secondary" className="flex-1 font-bold">
                Confirmar Aprovação
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Suspensão com Motivo (WF-048 Estado 9) */}
      {showSuspendModal && selectedPartner && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <PauseCircle className="w-7 h-7" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-xl font-black text-slate-900">Suspender Parceiro Comercial</h3>
              <p className="text-xs text-slate-500">
                A suspensão bloqueia a venda de novos ingressos deste parceiro temporariamente.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase">Motivo da Suspensão (Opcional):</label>
              <textarea
                rows={3}
                placeholder="Ex: Pendência de documentação societária ou renovação de alvará..."
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
              ></textarea>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setShowSuspendModal(false)} variant="outline" className="flex-1">
                Voltar
              </Button>
              <Button onClick={handleSuspend} variant="danger" className="flex-1 font-bold">
                Confirmar Suspensão
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Cadastro de Parceiro (WF-059) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div>
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Formulário de Credenciamento (WF-059)</span>
              <h3 className="text-xl font-black text-slate-900 mt-0.5">Cadastrar Parceiro Comercial</h3>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Razão Social"
                  placeholder="Empresa Exemplo Ltda"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  required
                />
                <Input
                  label="Nome Fantasia"
                  placeholder="Exemplo Turismo"
                  value={formData.tradeName}
                  onChange={(e) => setFormData({ ...formData, tradeName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="CNPJ"
                  placeholder="00.000.000/0001-00"
                  value={formData.cnpj}
                  onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                  required
                />
                <Input
                  label="Responsável Legal"
                  placeholder="Nome do representante"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="E-mail Corporativo"
                  type="email"
                  placeholder="contato@empresa.com.br"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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

              <Input
                label="Endereço Comercial"
                placeholder="Rua, Número, Bairro, Curitiba - PR"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />

              <div className="pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-700 block mb-2 uppercase">Dados Bancários para Repasse:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    label="Banco"
                    placeholder="Ex: Itaú (341)"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  />
                  <Input
                    label="Agência & Conta"
                    placeholder="0000 / 00000-0"
                    value={formData.bankAccount}
                    onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                  />
                  <Input
                    label="Chave PIX"
                    placeholder="CNPJ ou E-mail"
                    value={formData.pixKey}
                    onChange={(e) => setFormData({ ...formData, pixKey: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <Button type="button" onClick={() => setShowCreateModal(false)} variant="outline" className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" className="flex-1 font-bold">
                  Cadastrar Parceiro
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
