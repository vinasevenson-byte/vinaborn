import React, { useState, useEffect } from 'react';
import {
  FileSignature,
  Send,
  CheckCircle2,
  Clock,
  Download,
  Search,
  Plus,
  ExternalLink,
  ShieldCheck,
  Building2,
  Briefcase
} from 'lucide-react';
import { Card, Badge, Input } from '../../components/ui/FormControls';
import { Button } from '../../components/ui/Button';

export const ContractManagement = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadContracts = () => {
    fetch('/api/contracts')
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setContracts(data);
        } else {
          throw new Error('Invalid data');
        }
        setLoading(false);
      })
      .catch(() => {
        setContracts([
          {
            id: 1,
            contractNumber: "CTR-PARC-001-2026",
            title: "Contrato de Parceria Comercial e Vendas - Restaurante Madalosso",
            entityType: "PARTNER",
            entityName: "Restaurante Madalosso Ltda",
            docusignEnvelopeId: "DOCUSIGN-ENV-8841-MADALOSSO",
            status: "ACTIVE",
            signedDate: "2026-07-15",
            validUntil: "2027-07-15",
            documentPdfUrl: "/docs/contratos/madalosso-parceria.pdf"
          },
          {
            id: 2,
            contractNumber: "CTR-AGEN-001-2026",
            title: "Contrato de Credenciamento e Comissionamento - CWB City Tours",
            entityType: "AGENCY",
            entityName: "Curitiba City Tour & Receptivo Ltda",
            docusignEnvelopeId: "DOCUSIGN-ENV-9912-CWBCITYTOURS",
            status: "ACTIVE",
            signedDate: "2026-08-01",
            validUntil: "2027-08-01",
            documentPdfUrl: "/docs/contratos/cwb-tours-credenciamento.pdf"
          },
          {
            id: 3,
            contractNumber: "CTR-PARC-002-2026",
            title: "Termo de Credenciamento - Serra Verde Express",
            entityType: "PARTNER",
            entityName: "Serra Verde Express Trens Turísticos S/A",
            docusignEnvelopeId: "DOCUSIGN-ENV-7712-SERRAVERDE",
            status: "SENT",
            validUntil: "2027-09-01",
            documentPdfUrl: "/docs/contratos/serra-verde-termo.pdf"
          }
        ]);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadContracts();
  }, []);

  const handleSendDocuSign = async (id) => {
    try {
      await fetch(`/api/contracts/${id}/send-docusign`, { method: 'POST' });
    } catch (e) {}

    setContracts(prev => (Array.isArray(prev) ? prev : []).map(c => 
      c.id === id ? { ...c, status: 'SENT', docusignEnvelopeId: `DOCUSIGN-ENV-${Date.now()}` } : c
    ));
  };

  const handleActivateContract = async (id) => {
    try {
      await fetch(`/api/contracts/${id}/activate`, { method: 'PUT' });
    } catch (e) {}

    setContracts(prev => (Array.isArray(prev) ? prev : []).map(c => 
      c.id === id ? { ...c, status: 'ACTIVE', signedDate: new Date().toISOString().split('T')[0] } : c
    ));
  };

  const safeContracts = Array.isArray(contracts) ? contracts : [];
  const filteredContracts = safeContracts.filter(c =>
    !search ||
    (c.title && c.title.toLowerCase().includes(search.toLowerCase())) ||
    (c.contractNumber && c.contractNumber.toLowerCase().includes(search.toLowerCase())) ||
    (c.entityName && c.entityName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Módulo Jurídico e Contratual (WF-007 / WF-008)</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Gestão de Contratos (DocuSign)</h2>
          <p className="text-xs text-slate-500 mt-0.5">Assinatura eletrônica de termos de parceria com atrações e contratos de agências.</p>
        </div>

        <Button variant="primary" className="font-bold gap-2">
          <Plus className="w-4 h-4" />
          <span>Novo Contrato (WF-008)</span>
        </Button>
      </div>

      {/* Tabela de Contratos */}
      <Card className="border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por número do contrato, título ou empresa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                <th className="py-3.5 px-6">Contrato</th>
                <th className="py-3.5 px-6">Tipo / Entidade</th>
                <th className="py-3.5 px-6">Envelope DocuSign</th>
                <th className="py-3.5 px-6">Vigência</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredContracts.map((ctr) => (
                <tr key={ctr.id} className="hover:bg-slate-50/50">
                  <td className="py-4 px-6 font-bold text-slate-900">
                    <p className="text-sm">{ctr.title}</p>
                    <span className="font-mono text-xs text-sky-700">{ctr.contractNumber}</span>
                  </td>

                  <td className="py-4 px-6 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      {ctr.entityType === 'PARTNER' ? (
                        <>
                          <Building2 className="w-3.5 h-3.5 text-sky-600" />
                          <span>Parceiro Comercial</span>
                        </>
                      ) : (
                        <>
                          <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Agência de Turismo</span>
                        </>
                      )}
                    </div>
                    <p className="text-slate-500 mt-0.5">{ctr.entityName}</p>
                  </td>

                  <td className="py-4 px-6 text-xs font-mono text-slate-600">
                    {ctr.docusignEnvelopeId || 'Aguardando envio'}
                  </td>

                  <td className="py-4 px-6 text-xs text-slate-600">
                    {ctr.signedDate ? `Assinado em ${ctr.signedDate}` : 'Pendente de assinatura'}
                  </td>

                  <td className="py-4 px-6">
                    {ctr.status === 'ACTIVE' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Ativo / Assinado
                      </span>
                    )}
                    {ctr.status === 'SENT' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 animate-pulse">
                        <Clock className="w-3.5 h-3.5" />
                        Enviado via DocuSign
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-6 text-right space-x-2">
                    {ctr.status === 'SENT' && (
                      <button
                        onClick={() => handleActivateContract(ctr.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        title="Simular Assinatura e Ativação"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Ativar</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleSendDocuSign(ctr.id)}
                      className="p-1.5 text-slate-400 hover:text-sky-600 rounded-md transition-colors"
                      title="Reenviar Envelope DocuSign"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
