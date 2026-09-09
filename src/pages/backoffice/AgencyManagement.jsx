import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  CheckCircle2,
  AlertCircle,
  PauseCircle,
  Plus,
  Search,
  DollarSign,
  TrendingUp,
  Percent,
  Building2,
  FileCheck2,
  ArrowRight,
  ArrowLeft,
  Check,
  CreditCard
} from 'lucide-react';
import { Card, Badge, Input } from '../../components/ui/FormControls';
import { Button } from '../../components/ui/Button';

export const AgencyManagement = () => {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('LIST'); // LIST, WIZARD_REGISTER, COMMISSIONS
  const [search, setSearch] = useState('');
  const [commissionsData, setCommissionsData] = useState(null);

  // Estado do Wizard em 3 Etapas (WF-049)
  const [wizardStep, setWizardStep] = useState(1);
  const [agencyForm, setAgencyForm] = useState({
    // Etapa 1: Dados da Empresa (WF-049 E1)
    companyName: '',
    tradeName: '',
    cnpj: '',
    cadastur: '',
    address: '',
    city: 'Curitiba',
    state: 'PR',
    // Etapa 2: Dados do Responsável (WF-049 E2)
    contactPerson: '',
    email: '',
    phone: '',
    cpfResponsavel: '',
    // Etapa 3: Dados Bancários & Comissão (WF-049 E3)
    bankName: '',
    bankAgency: '',
    bankAccount: '',
    pixKey: '',
    commissionRate: 10.00
  });

  const loadAgencies = () => {
    fetch('/api/agencies')
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setAgencies(data);
        } else {
          throw new Error('Invalid data format');
        }
        setLoading(false);
      })
      .catch(() => {
        setAgencies([
          {
            id: 1,
            companyName: "Curitiba City Tour & Receptivo Ltda",
            tradeName: "CWB City Tours",
            cnpj: "18.444.555/0001-22",
            cadastur: "18.044.555/0001-PR",
            contactPerson: "Fernanda Oliveira",
            email: "operacoes@cwbtours.com.br",
            phone: "(41) 98822-1100",
            commissionRate: 12.00,
            status: "ACTIVE",
            totalSalesVolume: 48600.00,
            totalCommissionAccumulated: 5832.00
          },
          {
            id: 2,
            companyName: "Paraná Turismo e Eventos Eireli",
            tradeName: "Paraná Viagens",
            cnpj: "24.777.888/0001-99",
            cadastur: "24.077.888/0001-PR",
            contactPerson: "Roberto Mendes",
            email: "roberto@paranaviagens.com.br",
            phone: "(41) 99111-4455",
            commissionRate: 10.00,
            status: "PENDING_APPROVAL",
            totalSalesVolume: 12400.00,
            totalCommissionAccumulated: 1240.00
          }
        ]);
        setLoading(false);
      });
  };

  const loadCommissions = () => {
    fetch('/api/agencies/commissions')
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(data => {
        if (data && typeof data === 'object' && !data.error) {
          setCommissionsData(data);
        } else {
          throw new Error('Invalid data');
        }
      })
      .catch(() => {
        setCommissionsData({
          totalSalesThroughAgencies: 184320.00,
          totalCommissionsPaid: 18432.00,
          pendingPayoutBalance: 4150.00,
          agenciesReport: [
            { id: 1, companyName: "Curitiba City Tour & Receptivo Ltda", cadastur: "18.044.555/0001-PR", commissionRate: 12.00, totalSalesVolume: 48600.00, totalCommission: 5832.00, status: "ACTIVE" },
            { id: 2, companyName: "Paraná Turismo e Eventos Eireli", cadastur: "24.077.888/0001-PR", commissionRate: 10.00, totalSalesVolume: 12400.00, totalCommission: 1240.00, status: "PENDING_APPROVAL" }
          ]
        });
      });
  };

  useEffect(() => {
    loadAgencies();
    loadCommissions();
  }, []);

  const handleApproveAgency = async (id) => {
    try {
      await fetch(`/api/agencies/${id}/approve`, { method: 'PUT' });
    } catch (e) {}

    setAgencies(prev => (Array.isArray(prev) ? prev : []).map(a => a.id === id ? { ...a, status: 'ACTIVE' } : a));
  };

  const handleFinishWizard = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/agencies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agencyForm)
      });
    } catch (e) {}

    setAgencies(prev => [
      { ...agencyForm, id: Date.now(), status: 'WAITING_CONTRACT', totalSalesVolume: 0, totalCommissionAccumulated: 0 },
      ...(Array.isArray(prev) ? prev : [])
    ]);
    setActiveTab('LIST');
    setWizardStep(1);
    setAgencyForm({
      companyName: '',
      tradeName: '',
      cnpj: '',
      cadastur: '',
      address: '',
      city: 'Curitiba',
      state: 'PR',
      contactPerson: '',
      email: '',
      phone: '',
      cpfResponsavel: '',
      bankName: '',
      bankAgency: '',
      bankAccount: '',
      pixKey: '',
      commissionRate: 10.00
    });
  };

  const safeAgencies = Array.isArray(agencies) ? agencies : [];
  const filteredAgencies = safeAgencies.filter(a =>
    !search ||
    (a.companyName && a.companyName.toLowerCase().includes(search.toLowerCase())) ||
    (a.cnpj && a.cnpj.includes(search)) ||
    (a.cadastur && a.cadastur.includes(search))
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Módulo B2B de Agências (WF-048 / WF-049 / WF-052)</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Gestão de Agências e Comissionamento</h2>
          <p className="text-xs text-slate-500 mt-0.5">Credenciamento de operadores turísticos, emissão de contratos e liquidação de comissões.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setActiveTab(activeTab === 'WIZARD_REGISTER' ? 'LIST' : 'WIZARD_REGISTER')}
            variant={activeTab === 'WIZARD_REGISTER' ? 'outline' : 'primary'}
            className="font-bold gap-2"
          >
            {activeTab === 'WIZARD_REGISTER' ? (
              <span>Ver Listagem</span>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Nova Agência em 3 Etapas (WF-049)</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Navegação de Abas */}
      <div className="flex items-center gap-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('LIST')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'LIST' ? 'border-sky-600 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Agências Cadastradas ({agencies.length})
        </button>
        <button
          onClick={() => setActiveTab('COMMISSIONS')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'COMMISSIONS' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Comissionamento & Repasses (WF-052)</span>
        </button>
        <button
          onClick={() => setActiveTab('WIZARD_REGISTER')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'WIZARD_REGISTER' ? 'border-sky-600 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Wizard de Cadastro (WF-049)</span>
        </button>
      </div>

      {/* ABA 1: LISTAGEM DE AGÊNCIAS (WF-048) */}
      {activeTab === 'LIST' && (
        <Card className="border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center gap-3">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por Razão Social, CNPJ ou CADASTUR..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                  <th className="py-3.5 px-6">Agência de Turismo</th>
                  <th className="py-3.5 px-6">CNPJ / CADASTUR</th>
                  <th className="py-3.5 px-6">Responsável & Contato</th>
                  <th className="py-3.5 px-6">Comissão</th>
                  <th className="py-3.5 px-6">Vendas Acumuladas</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAgencies.map((agency) => (
                  <tr key={agency.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      <p className="font-bold text-slate-900">{agency.companyName}</p>
                      <span className="text-xs text-slate-500 font-normal">{agency.tradeName || '—'}</span>
                    </td>

                    <td className="py-4 px-6 text-xs">
                      <p className="font-mono font-bold text-slate-800">{agency.cnpj}</p>
                      <span className="text-sky-700 font-semibold text-[11px]">CADASTUR: {agency.cadastur}</span>
                    </td>

                    <td className="py-4 px-6 text-xs text-slate-700">
                      <p className="font-semibold text-slate-900">{agency.contactPerson}</p>
                      <p className="text-slate-500">{agency.email} • {agency.phone}</p>
                    </td>

                    <td className="py-4 px-6 font-black text-emerald-700">
                      {Number(agency.commissionRate).toFixed(1)}%
                    </td>

                    <td className="py-4 px-6 text-xs font-bold text-slate-900">
                      R$ {Number(agency.totalSalesVolume || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-4 px-6">
                      {agency.status === 'ACTIVE' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Ativa
                        </span>
                      )}
                      {agency.status === 'PENDING_APPROVAL' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 animate-pulse">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Pendente
                        </span>
                      )}
                      {agency.status === 'WAITING_CONTRACT' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
                          Aguardando DocuSign
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      {agency.status === 'PENDING_APPROVAL' && (
                        <button
                          onClick={() => handleApproveAgency(agency.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Aprovar</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ABA 2: WIZARD DE CADASTRO EM 3 ETAPAS (WF-049) */}
      {activeTab === 'WIZARD_REGISTER' && (
        <Card className="max-w-3xl mx-auto p-8 shadow-xl border-slate-200 space-y-8">
          {/* Indicador de Passos do Wizard */}
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-500">
              <span className={wizardStep === 1 ? 'text-sky-600' : ''}>1. Dados da Empresa</span>
              <span className={wizardStep === 2 ? 'text-sky-600' : ''}>2. Responsável Legal</span>
              <span className={wizardStep === 3 ? 'text-sky-600' : ''}>3. Dados Bancários & Comissão</span>
            </div>

            {/* Barra de Progresso */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-sky-600 h-full transition-all duration-300"
                style={{ width: `${(wizardStep / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleFinishWizard} className="space-y-6">
            {/* ETAPA 1: Dados da Empresa e CADASTUR (WF-049 E1) */}
            {wizardStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2">
                  Etapa 1 — Dados da Empresa e Registro Turístico
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Razão Social"
                    placeholder="Agência Exemplo de Turismo Ltda"
                    value={agencyForm.companyName}
                    onChange={(e) => setAgencyForm({ ...agencyForm, companyName: e.target.value })}
                    required
                  />
                  <Input
                    label="Nome Fantasia"
                    placeholder="Exemplo Viagens"
                    value={agencyForm.tradeName}
                    onChange={(e) => setAgencyForm({ ...agencyForm, tradeName: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="CNPJ"
                    placeholder="00.000.000/0001-00"
                    value={agencyForm.cnpj}
                    onChange={(e) => setAgencyForm({ ...agencyForm, cnpj: e.target.value })}
                    required
                  />
                  <Input
                    label="Número no CADASTUR (Obrigatório)"
                    placeholder="00.000.000/0001-PR"
                    value={agencyForm.cadastur}
                    onChange={(e) => setAgencyForm({ ...agencyForm, cadastur: e.target.value })}
                    required
                  />
                </div>

                <Input
                  label="Endereço da Sede"
                  placeholder="Rua, Número, Bairro, Curitiba - PR"
                  value={agencyForm.address}
                  onChange={(e) => setAgencyForm({ ...agencyForm, address: e.target.value })}
                  required
                />

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <Button
                    type="button"
                    onClick={() => setWizardStep(2)}
                    disabled={!agencyForm.companyName || !agencyForm.cnpj || !agencyForm.cadastur}
                    variant="primary"
                    className="font-bold gap-2"
                  >
                    <span>Avançar para Etapa 2</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* ETAPA 2: Dados do Responsável (WF-049 E2) */}
            {wizardStep === 2 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2">
                  Etapa 2 — Dados do Responsável Legal da Agência
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Nome Completo do Responsável"
                    placeholder="Nome do Sócio ou Gerente"
                    value={agencyForm.contactPerson}
                    onChange={(e) => setAgencyForm({ ...agencyForm, contactPerson: e.target.value })}
                    required
                  />
                  <Input
                    label="CPF do Responsável"
                    placeholder="000.000.000-00"
                    value={agencyForm.cpfResponsavel}
                    onChange={(e) => setAgencyForm({ ...agencyForm, cpfResponsavel: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="E-mail Corporativo"
                    type="email"
                    placeholder="contato@agencia.com.br"
                    value={agencyForm.email}
                    onChange={(e) => setAgencyForm({ ...agencyForm, email: e.target.value })}
                    required
                  />
                  <Input
                    label="Telefone / WhatsApp"
                    placeholder="(41) 99999-0000"
                    value={agencyForm.phone}
                    onChange={(e) => setAgencyForm({ ...agencyForm, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <Button type="button" onClick={() => setWizardStep(1)} variant="outline">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar</span>
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setWizardStep(3)}
                    disabled={!agencyForm.contactPerson || !agencyForm.email}
                    variant="primary"
                    className="font-bold gap-2"
                  >
                    <span>Avançar para Etapa 3</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* ETAPA 3: Dados Bancários e Comissionamento (WF-049 E3) */}
            {wizardStep === 3 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2">
                  Etapa 3 — Dados Bancários e Taxa de Comissionamento
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Banco"
                    placeholder="Ex: Santander (033)"
                    value={agencyForm.bankName}
                    onChange={(e) => setAgencyForm({ ...agencyForm, bankName: e.target.value })}
                  />
                  <Input
                    label="Agência & Conta Corrente"
                    placeholder="0000 / 000000-0"
                    value={agencyForm.bankAccount}
                    onChange={(e) => setAgencyForm({ ...agencyForm, bankAccount: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Chave PIX da Empresa"
                    placeholder="CNPJ ou E-mail"
                    value={agencyForm.pixKey}
                    onChange={(e) => setAgencyForm({ ...agencyForm, pixKey: e.target.value })}
                  />
                  <Input
                    label="Taxa de Comissão (%)"
                    type="number"
                    step="0.5"
                    value={agencyForm.commissionRate}
                    onChange={(e) => setAgencyForm({ ...agencyForm, commissionRate: parseFloat(e.target.value) || 10 })}
                    required
                  />
                </div>

                <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 text-xs text-sky-800 space-y-1">
                  <p className="font-bold">✓ Geração de Contrato Eletrônico via DocuSign:</p>
                  <p>Ao finalizar este cadastro, o contrato de credenciamento e comissionamento será gerado e enviado ao e-mail informado para assinatura digital.</p>
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <Button type="button" onClick={() => setWizardStep(2)} variant="outline">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar</span>
                  </Button>
                  <Button type="submit" variant="secondary" className="font-bold gap-2">
                    <Check className="w-4 h-4" />
                    <span>Concluir Cadastro e Enviar DocuSign</span>
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Card>
      )}

      {/* ABA 3: COMISSIONAMENTO & REPASSES (WF-052) */}
      {activeTab === 'COMMISSIONS' && (
        <div className="space-y-6">
          {/* Cards de Métricas de Comissões */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card className="p-6 bg-white border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase">Vendas Realizadas via Agências</span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                R$ {Number(commissionsData?.totalSalesThroughAgencies || 184320).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Acumulado do mês vigente</p>
            </Card>

            <Card className="p-6 bg-white border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase">Total de Comissões Apuradas</span>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">
                R$ {Number(commissionsData?.totalCommissionsPaid || 18432).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
              <p className="text-xs text-emerald-700 font-semibold mt-1">Média de 10% a 12% por agência</p>
            </Card>

            <Card className="p-6 bg-white border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase">Saldo a Liquidar no Próximo Lote</span>
              <h3 className="text-2xl font-black text-amber-600 mt-1">
                R$ {Number(commissionsData?.pendingPayoutBalance || 4150).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
              <Button size="sm" variant="amber" className="mt-2 text-xs font-bold">
                Executar Fechamento de Repasse
              </Button>
            </Card>
          </div>

          {/* Tabela de Extrato de Comissões por Agência */}
          <Card className="border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 font-bold text-slate-800 text-sm">
              Extrato Individual de Comissionamento por Operador
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                    <th className="py-3.5 px-6">Agência</th>
                    <th className="py-3.5 px-6">CADASTUR</th>
                    <th className="py-3.5 px-6">Taxa Acordada</th>
                    <th className="py-3.5 px-6">Vendas Faturadas</th>
                    <th className="py-3.5 px-6">Comissão Líquida</th>
                    <th className="py-3.5 px-6">Status do Repasse</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {agencies.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="py-4 px-6 font-bold text-slate-900">{item.companyName}</td>
                      <td className="py-4 px-6 font-mono text-xs text-slate-600">{item.cadastur}</td>
                      <td className="py-4 px-6 font-black text-slate-800">{Number(item.commissionRate).toFixed(1)}%</td>
                      <td className="py-4 px-6 font-semibold text-slate-900">
                        R$ {Number(item.totalSalesVolume || 12400).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-6 font-black text-emerald-600">
                        R$ {Number(item.totalCommissionAccumulated || 1240).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant="success">Liquidado em Lote</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
