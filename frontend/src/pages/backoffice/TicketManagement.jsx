import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Tag,
  Percent,
  DollarSign,
  Building2,
  Calendar,
  User,
  QrCode,
  Copy,
  Check,
  Eye,
  Trash2,
  Power,
  ChevronRight,
  Sparkles,
  BarChart2
} from 'lucide-react';
import { Card, Badge, Input } from '../../components/ui/FormControls';
import { Button } from '../../components/ui/Button';

export const TicketManagement = () => {
  const [activeTab, setActiveTab] = useState('batches'); // 'batches' | 'issued' | 'coupons'
  const [copiedCode, setCopiedCode] = useState(null);

  // Estados da Aba 1: Lotes de Ingressos (WF-019)
  const [batches, setBatches] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchForm, setBatchForm] = useState({
    name: '',
    categoryId: '',
    price: '',
    originalPrice: '',
    totalQuantity: ''
  });

  // Estados da Aba 2: Ingressos Emitidos (WF-017 / WF-018)
  const [issuedTickets, setIssuedTickets] = useState([]);
  const [searchTicket, setSearchTicket] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketDetailsModal, setShowTicketDetailsModal] = useState(false);
  const [loadingTickets, setLoadingTickets] = useState(true);

  // Estados da Aba 3: Cupons de Desconto (WF-021 a WF-024)
  const [coupons, setCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(true);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponModalType, setCouponModalType] = useState('GENERAL'); // 'GENERAL' (WF-023) | 'AGENCY' (WF-024)
  const [couponForm, setCouponForm] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    minPurchaseAmount: '0.00',
    maxUses: '500',
    agencyId: '',
    agencyName: '',
    attractionId: '',
    attractionName: '',
    validUntil: ''
  });

  // Carregar dados das APIs com fallbacks defensivos
  const loadData = () => {
    // 1. Lotes
    fetch('/api/tickets/management/batches')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        if (Array.isArray(data)) {
          setBatches(data);
        } else {
          throw new Error('Not array');
        }
        setLoadingBatches(false);
      })
      .catch(() => {
        setBatches([
          {
            id: 1,
            name: "1º Lote Antecipado",
            categoryName: "Ingresso Inteira - Acesso Geral",
            attractionName: "Ópera de Arame e Vale da Música",
            price: 15.00,
            originalPrice: 20.00,
            totalQuantity: 300,
            availableQuantity: 48,
            active: true
          },
          {
            id: 2,
            name: "2º Lote Regular",
            categoryName: "Ingresso Inteira - Acesso Geral",
            attractionName: "Ópera de Arame e Vale da Música",
            price: 20.00,
            originalPrice: 25.00,
            totalQuantity: 500,
            availableQuantity: 500,
            active: true
          },
          {
            id: 3,
            name: "Lote Promocional Meia",
            categoryName: "Meia-Entrada (Estudante / Idoso / PCD)",
            attractionName: "Ópera de Arame e Vale da Música",
            price: 7.50,
            originalPrice: 10.00,
            totalQuantity: 200,
            availableQuantity: 85,
            active: true
          },
          {
            id: 4,
            name: "1º Lote Serra do Mar",
            categoryName: "Classe Turística (Curitiba - Morretes)",
            attractionName: "Passeio de Trem da Serra do Mar",
            price: 175.00,
            originalPrice: 195.00,
            totalQuantity: 150,
            availableQuantity: 22,
            active: true
          }
        ]);
        setLoadingBatches(false);
      });

    // 2. Categorias para o modal
    fetch('/api/tickets/management/categories')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          throw new Error('Not array');
        }
      })
      .catch(() => {
        setCategories([
          { id: 1, name: "Ingresso Inteira - Acesso Geral" },
          { id: 2, name: "Meia-Entrada (Estudante / Idoso / PCD)" },
          { id: 3, name: "Classe Turística (Curitiba - Morretes)" },
          { id: 4, name: "Ingresso Inteira - Exposições MON" }
        ]);
      });

    // 3. Ingressos Emitidos
    fetch('/api/tickets/management/issued')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        if (Array.isArray(data)) {
          setIssuedTickets(data);
        } else {
          throw new Error('Not array');
        }
        setLoadingTickets(false);
      })
      .catch(() => {
        setIssuedTickets([
          {
            id: 1,
            voucherCode: "VCH-CWB-2026-9811",
            holderName: "Vinicius Turista da Silva",
            holderDocument: "333.444.555-66",
            categoryName: "Ingresso Inteira - Acesso Geral",
            price: 15.00,
            visitDate: "2026-09-12",
            status: "VALID",
            attraction: { name: "Ópera de Arame e Vale da Música" },
            createdAt: "2026-09-08T09:30:00"
          },
          {
            id: 2,
            voucherCode: "VCH-CWB-2026-9812",
            holderName: "Mariana Souza Santos",
            holderDocument: "444.555.666-77",
            categoryName: "Classe Turística (Curitiba - Morretes)",
            price: 175.00,
            visitDate: "2026-09-15",
            status: "VALID",
            attraction: { name: "Passeio de Trem da Serra do Mar" },
            createdAt: "2026-09-08T09:30:00"
          },
          {
            id: 3,
            voucherCode: "VCH-CWB-2026-4412",
            holderName: "Carlos Alberto Rocha",
            holderDocument: "555.666.777-88",
            categoryName: "Ingresso Inteira - Exposições MON",
            price: 30.00,
            visitDate: "2026-09-07",
            status: "USED",
            usedAt: "2026-09-07T14:22:10",
            validatedBy: "Catraca MON - Portaria Principal",
            attraction: { name: "Museu Oscar Niemeyer (MON)" },
            createdAt: "2026-09-05T11:00:00"
          },
          {
            id: 4,
            voucherCode: "VCH-CWB-2026-3390",
            holderName: "Renata Figueiredo",
            holderDocument: "666.777.888-99",
            categoryName: "Meia-Entrada (Estudante / Idoso)",
            price: 15.00,
            visitDate: "2026-09-02",
            status: "CANCELLED",
            attraction: { name: "Ópera de Arame e Vale da Música" },
            createdAt: "2026-09-01T16:15:00"
          }
        ]);
        setLoadingTickets(false);
      });

    // 4. Cupons
    fetch('/api/coupons')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        if (Array.isArray(data)) {
          setCoupons(data);
        } else {
          throw new Error('Not array');
        }
        setLoadingCoupons(false);
      })
      .catch(() => {
        setCoupons([
          {
            id: 1,
            code: "CURITIBA360",
            discountType: "PERCENTAGE",
            discountValue: 10.00,
            minPurchaseAmount: 0.00,
            maxUses: 1000,
            usedCount: 142,
            validUntil: "2026-12-31",
            active: true
          },
          {
            id: 2,
            code: "CWBVERAO",
            discountType: "FIXED",
            discountValue: 20.00,
            minPurchaseAmount: 100.00,
            maxUses: 300,
            usedCount: 45,
            validUntil: "2026-11-30",
            active: true
          },
          {
            id: 3,
            code: "AGENCIA-CWB10",
            discountType: "PERCENTAGE",
            discountValue: 12.00,
            agencyId: 1,
            agencyName: "CWB City Tours",
            maxUses: 500,
            usedCount: 88,
            validUntil: "2027-03-31",
            active: true
          },
          {
            id: 4,
            code: "OPERA15",
            discountType: "PERCENTAGE",
            discountValue: 15.00,
            attractionName: "Ópera de Arame e Vale da Música",
            maxUses: 200,
            usedCount: 19,
            validUntil: "2026-10-31",
            active: true
          }
        ]);
        setLoadingCoupons(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Submissão de Novo Lote (WF-020)
  const handleCreateBatch = async (e) => {
    e.preventDefault();
    const payload = {
      name: batchForm.name,
      categoryId: Number(batchForm.categoryId) || (categories[0]?.id || 1),
      price: parseFloat(batchForm.price),
      originalPrice: batchForm.originalPrice ? parseFloat(batchForm.originalPrice) : parseFloat(batchForm.price),
      totalQuantity: parseInt(batchForm.totalQuantity)
    };

    try {
      const res = await fetch('/api/tickets/management/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const saved = await res.json();
        setBatches(prev => [saved, ...prev]);
      } else {
        throw new Error('Falha');
      }
    } catch {
      // Fallback local
      const selectedCat = categories.find(c => c.id === Number(batchForm.categoryId)) || categories[0];
      setBatches(prev => [
        {
          id: Date.now(),
          ...payload,
          categoryName: selectedCat?.name || "Ingresso Geral",
          attractionName: "Ópera de Arame e Vale da Música",
          availableQuantity: payload.totalQuantity,
          active: true
        },
        ...prev
      ]);
    }

    setShowBatchModal(false);
    setBatchForm({ name: '', categoryId: '', price: '', originalPrice: '', totalQuantity: '' });
  };

  // Toggle de Status do Lote
  const handleToggleBatch = async (id) => {
    try {
      await fetch(`/api/tickets/management/batches/${id}/toggle-status`, { method: 'PUT' });
    } catch {}

    setBatches(prev =>
      prev.map(b => (b.id === id ? { ...b, active: !b.active } : b))
    );
  };

  // Submissão de Cupom (WF-023 / WF-024)
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    const payload = {
      code: couponForm.code.toUpperCase().trim(),
      discountType: couponForm.discountType,
      discountValue: parseFloat(couponForm.discountValue),
      minPurchaseAmount: parseFloat(couponForm.minPurchaseAmount) || 0,
      maxUses: parseInt(couponForm.maxUses) || 500,
      agencyId: couponModalType === 'AGENCY' ? (couponForm.agencyId ? Number(couponForm.agencyId) : 1) : null,
      agencyName: couponModalType === 'AGENCY' ? (couponForm.agencyName || 'CWB City Tours') : null,
      validUntil: couponForm.validUntil || null,
      active: true
    };

    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const saved = await res.json();
        setCoupons(prev => [saved, ...prev]);
      } else {
        throw new Error();
      }
    } catch {
      setCoupons(prev => [{ id: Date.now(), ...payload, usedCount: 0 }, ...prev]);
    }

    setShowCouponModal(false);
    setCouponForm({
      code: '',
      discountType: 'PERCENTAGE',
      discountValue: '',
      minPurchaseAmount: '0.00',
      maxUses: '500',
      agencyId: '',
      agencyName: '',
      attractionId: '',
      attractionName: '',
      validUntil: ''
    });
  };

  const handleToggleCoupon = async (id) => {
    try {
      await fetch(`/api/coupons/${id}/toggle-status`, { method: 'PUT' });
    } catch {}
    setCoupons(prev => prev.map(c => (c.id === id ? { ...c, active: !c.active } : c)));
  };

  const handleDeleteCoupon = async (id) => {
    if (!confirm('Deseja realmente remover este cupom?')) return;
    try {
      await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
    } catch {}
    setCoupons(prev => prev.filter(c => c.id !== id));
  };

  // Filtro de Ingressos Emitidos
  const safeBatches = Array.isArray(batches) ? batches : [];
  const safeIssuedTickets = Array.isArray(issuedTickets) ? issuedTickets : [];
  const safeCoupons = Array.isArray(coupons) ? coupons : [];

  const filteredTickets = safeIssuedTickets.filter(t => {
    const q = searchTicket.toLowerCase();
    const matchesQuery =
      !q ||
      t.voucherCode?.toLowerCase().includes(q) ||
      t.holderName?.toLowerCase().includes(q) ||
      t.holderDocument?.toLowerCase().includes(q);
    const matchesStatus = filterStatus === 'ALL' || t.status?.toUpperCase() === filterStatus;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
            Módulo de Ingressos & Capacidade (WF-017 a WF-024)
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Gestão de Ingressos, Lotes e Cupons
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitore lotes por atração, pesquise ingressos emitidos e gerencie regras de cupons promocionais e de agências.
          </p>
        </div>

        {/* Botão de Ação contextualizado pela aba */}
        <div className="flex items-center gap-2">
          {activeTab === 'batches' && (
            <Button
              onClick={() => setShowBatchModal(true)}
              variant="primary"
              className="font-bold gap-2 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Criar Novo Lote (WF-020)</span>
            </Button>
          )}

          {activeTab === 'coupons' && (
            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  setCouponModalType('GENERAL');
                  setShowCouponModal(true);
                }}
                variant="outline"
                className="font-bold gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Cupom Geral (WF-023)</span>
              </Button>
              <Button
                onClick={() => {
                  setCouponModalType('AGENCY');
                  setShowCouponModal(true);
                }}
                variant="primary"
                className="font-bold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Cupom de Agência (WF-024)</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Navegação por Abas */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('batches')}
          className={`pb-3.5 px-5 font-bold text-sm flex items-center gap-2 transition-all relative ${
            activeTab === 'batches'
              ? 'text-sky-600 border-b-2 border-sky-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Lotes & Estoque por Categoria</span>
          <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
            {safeBatches.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('issued')}
          className={`pb-3.5 px-5 font-bold text-sm flex items-center gap-2 transition-all relative ${
            activeTab === 'issued'
              ? 'text-sky-600 border-b-2 border-sky-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>Ingressos Emitidos & Vouchers</span>
          <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {safeIssuedTickets.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('coupons')}
          className={`pb-3.5 px-5 font-bold text-sm flex items-center gap-2 transition-all relative ${
            activeTab === 'coupons'
              ? 'text-sky-600 border-b-2 border-sky-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Cupons Promocionais & Agências</span>
          <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            {safeCoupons.length}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* ABA 1: LOTES E ESTOQUE POR CATEGORIA (WF-019 / WF-020)                   */}
      {/* ========================================================================= */}
      {activeTab === 'batches' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card className="p-5 border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total de Lotes Ativos</p>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">
                    {safeBatches.filter(b => b.active).length}
                  </h3>
                </div>
                <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                  <BarChart2 className="w-5 h-5" />
                </div>
              </div>
            </Card>

            <Card className="p-5 border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Capacidade Total Alocada</p>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">
                    {safeBatches.reduce((acc, b) => acc + (b.totalQuantity || 0), 0).toLocaleString('pt-BR')}
                  </h3>
                </div>
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Ticket className="w-5 h-5" />
                </div>
              </div>
            </Card>

            <Card className="p-5 border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ingressos Vendidos</p>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">
                    {safeBatches.reduce((acc, b) => acc + ((b.totalQuantity || 0) - (b.availableQuantity || 0)), 0).toLocaleString('pt-BR')}
                  </h3>
                </div>
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
            </Card>
          </div>

          <Card className="overflow-hidden border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                    <th className="py-3.5 px-6">Lote & Categoria</th>
                    <th className="py-3.5 px-6">Atração Vinculada</th>
                    <th className="py-3.5 px-6">Preço Unitário</th>
                    <th className="py-3.5 px-6 w-64">Estoque & Vendas</th>
                    <th className="py-3.5 px-6 text-center">Status</th>
                    <th className="py-3.5 px-6 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {safeBatches.map((batch) => {
                    const sold = (batch.totalQuantity || 0) - (batch.availableQuantity || 0);
                    const percentSold = Math.min(100, Math.round((sold / (batch.totalQuantity || 1)) * 100));

                    return (
                      <tr key={batch.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-bold text-slate-900">{batch.name}</div>
                          <div className="text-xs text-slate-500 font-medium">{batch.categoryName || 'Categoria Geral'}</div>
                        </td>

                        <td className="py-4 px-6">
                          <span className="font-medium text-slate-700 text-xs bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 inline-block">
                            {batch.attractionName || 'Atração Geral'}
                          </span>
                        </td>

                        <td className="py-4 px-6">
                          <div className="font-extrabold text-slate-900 text-base">
                            R$ {Number(batch.price).toFixed(2).replace('.', ',')}
                          </div>
                          {batch.originalPrice && batch.originalPrice > batch.price && (
                            <span className="text-[11px] text-slate-400 line-through">
                              R$ {Number(batch.originalPrice).toFixed(2).replace('.', ',')}
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-6">
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-bold">
                              <span className="text-slate-600">{batch.availableQuantity} disponíveis</span>
                              <span className="text-slate-400">{percentSold}% vendido</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  percentSold > 85 ? 'bg-amber-500' : 'bg-sky-500'
                                }`}
                                style={{ width: `${percentSold}%` }}
                              />
                            </div>
                            <div className="text-[10px] text-slate-400 font-semibold">
                              Total alocado: {batch.totalQuantity} un.
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6 text-center">
                          {batch.active ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              Ativo
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-300">
                              <XCircle className="w-3 h-3" />
                              Inativo
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleToggleBatch(batch.id)}
                            className={`p-2 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 ${
                              batch.active
                                ? 'text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200'
                                : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                            }`}
                            title={batch.active ? 'Desativar Lote' : 'Ativar Lote'}
                          >
                            <Power className="w-3.5 h-3.5" />
                            <span>{batch.active ? 'Pausar' : 'Ativar'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 2: INGRESSOS EMITIDOS & VOUCHERS (WF-017 / WF-018)                   */}
      {/* ========================================================================= */}
      {activeTab === 'issued' && (
        <div className="space-y-6">
          {/* Barra de Filtros */}
          <Card className="p-4 border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 flex items-center gap-3">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Pesquisar por Código Voucher (ex: VCH-CWB...), Nome do Titular ou CPF..."
                value={searchTicket}
                onChange={(e) => setSearchTicket(e.target.value)}
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
                <option value="VALID">Válidos para Visita</option>
                <option value="USED">Já Utilizados (Catraca)</option>
                <option value="CANCELLED">Cancelados / Estornados</option>
              </select>
            </div>
          </Card>

          {/* Listagem em Tabela */}
          <Card className="overflow-hidden border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                    <th className="py-3.5 px-6">Código Voucher</th>
                    <th className="py-3.5 px-6">Titular do Ingresso</th>
                    <th className="py-3.5 px-6">Atração & Categoria</th>
                    <th className="py-3.5 px-6">Data de Visita</th>
                    <th className="py-3.5 px-6">Valor Pago</th>
                    <th className="py-3.5 px-6 text-center">Status</th>
                    <th className="py-3.5 px-6 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200 text-xs tracking-wide">
                            {ticket.voucherCode}
                          </span>
                          <button
                            onClick={() => copyToClipboard(ticket.voucherCode)}
                            className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
                            title="Copiar Código"
                          >
                            {copiedCode === ticket.voucherCode ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900">{ticket.holderName}</div>
                        <div className="text-xs text-slate-400 font-mono">{ticket.holderDocument || 'CPF Não Informado'}</div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-800 text-xs">
                          {ticket.attraction?.name || 'Atração Curitiba'}
                        </div>
                        <div className="text-xs text-slate-500">{ticket.categoryName}</div>
                      </td>

                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {ticket.visitDate ? new Date(ticket.visitDate + 'T00:00:00').toLocaleDateString('pt-BR') : 'Data Livre'}
                        </span>
                      </td>

                      <td className="py-4 px-6 font-black text-slate-900">
                        R$ {Number(ticket.price).toFixed(2).replace('.', ',')}
                      </td>

                      <td className="py-4 px-6 text-center">
                        {ticket.status === 'VALID' && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            Válido
                          </span>
                        )}
                        {ticket.status === 'USED' && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                            <Clock className="w-3 h-3" />
                            Utilizado
                          </span>
                        )}
                        {ticket.status === 'CANCELLED' && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                            <XCircle className="w-3 h-3" />
                            Cancelado
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <Button
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setShowTicketDetailsModal(true);
                          }}
                          variant="outline"
                          className="text-xs font-bold px-3 py-1.5 gap-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-sky-600" />
                          <span>Detalhes (WF-018)</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 3: CUPONS DE DESCONTO (WF-021 a WF-024)                              */}
      {/* ========================================================================= */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          {/* Banner de Migração Estratégica para Marketing */}
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Novo Módulo de Aquisição: Marketing & Cupons
                </p>
                <p className="text-[11px] text-slate-500">
                  A inteligência de cupons, geração de links com UTMs de afiliados e campanhas de conversão agora contam com um módulo dedicado no menu lateral.
                </p>
              </div>
            </div>
            <Link
              to="/backoffice/marketing"
              className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors shrink-0 flex items-center gap-1.5"
            >
              <span>Ir para Marketing</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Card className="overflow-hidden border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                    <th className="py-3.5 px-6">Código do Cupom</th>
                    <th className="py-3.5 px-6">Tipo & Desconto</th>
                    <th className="py-3.5 px-6">Canal / Agência Vinculada</th>
                    <th className="py-3.5 px-6">Utilizações / Limite</th>
                    <th className="py-3.5 px-6">Validade</th>
                    <th className="py-3.5 px-6 text-center">Status</th>
                    <th className="py-3.5 px-6 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {safeCoupons.map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-300 text-sm tracking-wide">
                            {coupon.code}
                          </span>
                          <button
                            onClick={() => copyToClipboard(coupon.code)}
                            className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
                            title="Copiar Código"
                          >
                            {copiedCode === coupon.code ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="font-black text-emerald-700 text-base flex items-center gap-1">
                          {coupon.discountType === 'PERCENTAGE' ? (
                            <>
                              <span>{Number(coupon.discountValue).toFixed(0)}% OFF</span>
                              <Percent className="w-4 h-4 text-emerald-600" />
                            </>
                          ) : (
                            <>
                              <span>R$ {Number(coupon.discountValue).toFixed(2).replace('.', ',')} OFF</span>
                              <DollarSign className="w-4 h-4 text-emerald-600" />
                            </>
                          )}
                        </div>
                        {coupon.minPurchaseAmount > 0 && (
                          <div className="text-[11px] text-slate-400 font-semibold">
                            Mínimo: R$ {Number(coupon.minPurchaseAmount).toFixed(2).replace('.', ',')}
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        {coupon.agencyName ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold">
                            <Building2 className="w-3.5 h-3.5" />
                            {coupon.agencyName} (WF-024)
                          </span>
                        ) : coupon.attractionName ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold">
                            <Ticket className="w-3.5 h-3.5" />
                            {coupon.attractionName}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200 text-xs font-semibold">
                            Geral / Portal Curitiba 360 (WF-023)
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-800 text-xs">
                          {coupon.usedCount || 0} / {coupon.maxUses || 'Ilimitado'} usos
                        </div>
                        <div className="w-32 h-1.5 rounded-full bg-slate-100 overflow-hidden mt-1 border border-slate-200">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{
                              width: `${Math.min(100, Math.round(((coupon.usedCount || 0) / (coupon.maxUses || 1)) * 100))}%`
                            }}
                          />
                        </div>
                      </td>

                      <td className="py-4 px-6 text-xs font-semibold text-slate-600">
                        {coupon.validUntil ? new Date(coupon.validUntil + 'T00:00:00').toLocaleDateString('pt-BR') : 'Sem data limite'}
                      </td>

                      <td className="py-4 px-6 text-center">
                        {coupon.active ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            Ativo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-300">
                            Pausado
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right space-x-1">
                        <button
                          onClick={() => handleToggleCoupon(coupon.id)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded transition-colors"
                          title={coupon.active ? 'Pausar Cupom' : 'Reativar Cupom'}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCoupon(coupon.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          title="Excluir Cupom"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL WF-020: CRIAR NOVO LOTE                                            */}
      {/* ========================================================================= */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div>
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                Configuração de Capacidade (WF-020)
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-0.5">Criar Novo Lote de Ingressos</h3>
              <p className="text-xs text-slate-500">Defina os parâmetros de estoque e preço por categoria.</p>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-4">
              <Input
                label="Nome do Lote"
                placeholder="Ex: 1º Lote Antecipado / Lote Promocional de Natal"
                value={batchForm.name}
                onChange={(e) => setBatchForm({ ...batchForm, name: e.target.value })}
                required
              />

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Categoria do Ingresso</label>
                <select
                  value={batchForm.categoryId}
                  onChange={(e) => setBatchForm({ ...batchForm, categoryId: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-sky-500 font-medium"
                  required
                >
                  <option value="">Selecione a Categoria...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Preço de Venda (R$)"
                  type="number"
                  step="0.50"
                  placeholder="0,00"
                  value={batchForm.price}
                  onChange={(e) => setBatchForm({ ...batchForm, price: e.target.value })}
                  required
                />
                <Input
                  label="Preço Original (R$ - opcional)"
                  type="number"
                  step="0.50"
                  placeholder="Para efeito 'De/Por'"
                  value={batchForm.originalPrice}
                  onChange={(e) => setBatchForm({ ...batchForm, originalPrice: e.target.value })}
                />
              </div>

              <Input
                label="Quantidade Total de Ingressos do Lote"
                type="number"
                placeholder="Ex: 500"
                value={batchForm.totalQuantity}
                onChange={(e) => setBatchForm({ ...batchForm, totalQuantity: e.target.value })}
                required
              />

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <Button type="button" onClick={() => setShowBatchModal(false)} variant="outline" className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" className="flex-1 font-bold">
                  Salvar Lote
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL WF-018: DETALHES DO INGRESSO EMITIDO & VOUCHER                     */}
      {/* ========================================================================= */}
      {showTicketDetailsModal && selectedTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                Auditoria de Ingresso (WF-018)
              </span>
              <h3 className="text-xl font-black text-slate-900">Voucher Digital Curitiba 360</h3>
              <p className="text-xs text-slate-500">Dados cadastrais e histórico de validação de catraca</p>
            </div>

            {/* Cartão do Voucher com QR Code */}
            <div className="bg-gradient-to-b from-slate-50 to-sky-50/40 rounded-2xl p-6 border border-slate-200 text-center space-y-4">
              <div className="inline-block p-4 bg-white rounded-2xl border-2 border-slate-900 shadow-sm">
                <QrCode className="w-32 h-32 text-slate-900 mx-auto" />
                <div className="text-center font-mono font-black text-xs text-slate-900 tracking-wider mt-2">
                  {selectedTicket.voucherCode}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-black text-slate-900">{selectedTicket.attraction?.name || 'Atração Curitiba'}</div>
                <div className="text-xs font-semibold text-sky-700 bg-sky-100 px-3 py-0.5 rounded-full inline-block">
                  {selectedTicket.categoryName}
                </div>
              </div>
            </div>

            {/* Tabela de Atributos */}
            <div className="space-y-3 text-xs divide-y divide-slate-100">
              <div className="flex justify-between pt-2">
                <span className="text-slate-500">Titular:</span>
                <span className="font-bold text-slate-900">{selectedTicket.holderName}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-500">Documento / CPF:</span>
                <span className="font-mono font-semibold text-slate-800">{selectedTicket.holderDocument || 'Não informado'}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-500">Data Agendada:</span>
                <span className="font-bold text-slate-900">
                  {selectedTicket.visitDate ? new Date(selectedTicket.visitDate + 'T00:00:00').toLocaleDateString('pt-BR') : 'Data Livre'}
                </span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-500">Valor Pago:</span>
                <span className="font-black text-emerald-700 text-sm">
                  R$ {Number(selectedTicket.price).toFixed(2).replace('.', ',')}
                </span>
              </div>
              <div className="flex justify-between pt-2 items-center">
                <span className="text-slate-500">Status Atual:</span>
                <span>
                  {selectedTicket.status === 'VALID' && (
                    <Badge variant="success">VÁLIDO PARA ACESSO</Badge>
                  )}
                  {selectedTicket.status === 'USED' && (
                    <Badge variant="primary">UTILIZADO</Badge>
                  )}
                  {selectedTicket.status === 'CANCELLED' && (
                    <Badge variant="danger">CANCELADO</Badge>
                  )}
                </span>
              </div>

              {selectedTicket.usedAt && (
                <div className="p-3 rounded-xl bg-sky-50 border border-sky-100 text-sky-900 space-y-1 mt-2">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                    <span>Check-in Realizado</span>
                  </div>
                  <div className="text-[11px]">
                    Validação em: {new Date(selectedTicket.usedAt).toLocaleString('pt-BR')}
                  </div>
                  <div className="text-[11px] font-semibold text-sky-700">
                    Ponto de Acesso: {selectedTicket.validatedBy || 'Catraca Principal'}
                  </div>
                </div>
              )}
            </div>

            <Button
              type="button"
              onClick={() => setShowTicketDetailsModal(false)}
              variant="outline"
              className="w-full font-bold"
            >
              Fechar Detalhes
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL WF-023 / WF-024: CRIAR CUPOM GERAL OU DE AGÊNCIA                   */}
      {/* ========================================================================= */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div>
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                {couponModalType === 'AGENCY' ? 'Módulo de Comissionamento (WF-024)' : 'Marketing & Campanhas (WF-023)'}
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-0.5">
                {couponModalType === 'AGENCY' ? 'Novo Cupom Exclusivo de Agência' : 'Novo Cupom Promocional Geral'}
              </h3>
              <p className="text-xs text-slate-500">
                {couponModalType === 'AGENCY'
                  ? 'Vincule as vendas ao CNPJ/Cadastur da agência para apuração automática de comissões.'
                  : 'Crie cupons globais ou segmentados por atração para campanhas públicas.'}
              </p>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <Input
                label="Código do Cupom"
                placeholder={couponModalType === 'AGENCY' ? 'Ex: AGENCIA-CWB10' : 'Ex: CURITIBA2026'}
                value={couponForm.code}
                onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                required
              />

              {couponModalType === 'AGENCY' && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Agência Credenciada Vinculada</label>
                  <select
                    value={couponForm.agencyId}
                    onChange={(e) => {
                      const id = e.target.value;
                      const name = id === '1' ? 'CWB City Tours' : 'Paraná Viagens';
                      setCouponForm({ ...couponForm, agencyId: id, agencyName: name });
                    }}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-sky-500 font-medium"
                    required
                  >
                    <option value="">Selecione a Agência...</option>
                    <option value="1">CWB City Tours (CNPJ: 18.444.555/0001-22 - 12% comissão)</option>
                    <option value="2">Paraná Viagens (CNPJ: 24.777.888/0001-99 - 10% comissão)</option>
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Tipo de Desconto</label>
                  <select
                    value={couponForm.discountType}
                    onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-sky-500 font-medium"
                  >
                    <option value="PERCENTAGE">Percentual (%)</option>
                    <option value="FIXED">Valor Fixo (R$)</option>
                  </select>
                </div>

                <Input
                  label="Valor do Desconto"
                  type="number"
                  step="0.50"
                  placeholder={couponForm.discountType === 'PERCENTAGE' ? 'Ex: 10 (%)' : 'Ex: 15,00 (R$)'}
                  value={couponForm.discountValue}
                  onChange={(e) => setCouponForm({ ...couponForm, discountValue: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Valor Mínimo da Compra (R$)"
                  type="number"
                  step="1.00"
                  placeholder="0,00"
                  value={couponForm.minPurchaseAmount}
                  onChange={(e) => setCouponForm({ ...couponForm, minPurchaseAmount: e.target.value })}
                />
                <Input
                  label="Limite de Usos"
                  type="number"
                  placeholder="500"
                  value={couponForm.maxUses}
                  onChange={(e) => setCouponForm({ ...couponForm, maxUses: e.target.value })}
                />
              </div>

              <Input
                label="Data de Validade (opcional)"
                type="date"
                value={couponForm.validUntil}
                onChange={(e) => setCouponForm({ ...couponForm, validUntil: e.target.value })}
              />

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <Button type="button" onClick={() => setShowCouponModal(false)} variant="outline" className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" className="flex-1 font-bold">
                  Criar Cupom
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
