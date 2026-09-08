import React, { useState } from 'react';
import { QrCode, CheckCircle, XCircle, AlertTriangle, Search, Camera, Ticket, User, Calendar } from 'lucide-react';
import { Card, Badge } from '../../components/ui/FormControls';
import { Button } from '../../components/ui/Button';

export const TicketValidator = () => {
  const [voucherCode, setVoucherCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleValidate = async (codeToTest) => {
    const code = codeToTest || voucherCode;
    if (!code) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/tickets/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voucherCode: code,
          validatorName: 'Catraca Principal'
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      // Simulação local para demonstração imediata
      if (code.includes('USED')) {
        setResult({
          valid: false,
          message: 'ATENÇÃO: Este voucher JÁ FOI UTILIZADO às 14:22 por outro visitante.',
          ticket: {
            voucherCode: code,
            holderName: 'Lucas Ferreira',
            categoryName: 'Inteira',
            status: 'USED'
          }
        });
      } else if (code.includes('CANCEL')) {
        setResult({
          valid: false,
          message: 'INGRESSO CANCELADO / REEMBOLSADO. Entrada Negada.',
          ticket: {
            voucherCode: code,
            holderName: 'Mariana Souza',
            categoryName: 'Meia-Entrada',
            status: 'CANCELLED'
          }
        });
      } else {
        setResult({
          valid: true,
          message: 'INGRESSO VÁLIDO! Entrada Autorizada.',
          ticket: {
            voucherCode: code,
            holderName: 'Vinicius Turista',
            categoryName: 'Inteira',
            status: 'VALID',
            attraction: { name: 'Ópera de Arame e Vale da Música' }
          }
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Módulo de Validação (WF-031)</span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Validador de Ingressos via QR Code</h2>
        <p className="text-xs text-slate-500 mt-1">Utilizado pelos operadores de catraca e bilheteria para controle de acesso às atrações.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Painel do Leitor / Câmera */}
        <Card className="p-6 space-y-6 text-center">
          <div className="w-full aspect-square max-w-[280px] mx-auto bg-slate-900 rounded-3xl p-6 flex flex-col items-center justify-center text-slate-400 relative overflow-hidden border-4 border-slate-800 shadow-inner">
            <Camera className="w-12 h-12 text-sky-400 animate-pulse mb-3" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">Câmera Ativa</span>
            <p className="text-[11px] text-slate-400 mt-1">Aponte o QR Code do voucher digital</p>

            {/* Linha laser de scan animada */}
            <div className="absolute inset-x-4 top-1/2 h-0.5 bg-rose-500 shadow-[0_0_10px_#f43f5e] animate-bounce"></div>
          </div>

          <div className="space-y-3 text-left">
            <label className="text-xs font-bold text-slate-700 uppercase">Ou digite o código do voucher manualmente:</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ex: VCH-CWB-8921"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-slate-300 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <Button onClick={() => handleValidate()} loading={loading} variant="primary" className="font-bold">
                Validar
              </Button>
            </div>
          </div>

          {/* Botões de Simulação de Casos de Teste */}
          <div className="pt-4 border-t border-slate-100 space-y-2 text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Testar Cenários de Acesso com 1 Clique:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setVoucherCode('VCH-CWB-7892-OK');
                  handleValidate('VCH-CWB-7892-OK');
                }}
                className="p-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg text-xs font-bold border border-emerald-200 transition-colors cursor-pointer"
              >
                ✓ Válido
              </button>
              <button
                type="button"
                onClick={() => {
                  setVoucherCode('VCH-CWB-3312-USED');
                  handleValidate('VCH-CWB-3312-USED');
                }}
                className="p-2 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded-lg text-xs font-bold border border-amber-200 transition-colors cursor-pointer"
              >
                ⚠ Já Utilizado
              </button>
              <button
                type="button"
                onClick={() => {
                  setVoucherCode('VCH-CWB-0041-CANCEL');
                  handleValidate('VCH-CWB-0041-CANCEL');
                }}
                className="p-2 bg-rose-50 text-rose-800 hover:bg-rose-100 rounded-lg text-xs font-bold border border-rose-200 transition-colors cursor-pointer"
              >
                ✕ Cancelado
              </button>
            </div>
          </div>
        </Card>

        {/* Painel do Resultado da Validação */}
        <div className="flex flex-col justify-center">
          {result ? (
            <Card className={`p-8 border-2 transition-all shadow-xl space-y-6 ${
              result.valid ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-500 bg-rose-50/20'
            }`}>
              <div className="text-center space-y-2">
                {result.valid ? (
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                    <XCircle className="w-10 h-10" />
                  </div>
                )}
                <h3 className={`text-xl font-black ${result.valid ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {result.message}
                </h3>
              </div>

              {result.ticket && (
                <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Código do Voucher:</span>
                    <span className="font-mono font-bold text-slate-900">{result.ticket.voucherCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Titular:</span>
                    <span className="font-bold text-slate-900">{result.ticket.holderName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Categoria:</span>
                    <Badge variant={result.valid ? 'success' : 'danger'}>{result.ticket.categoryName}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status:</span>
                    <span className="font-bold uppercase">{result.ticket.status}</span>
                  </div>
                </div>
              )}

              <Button
                onClick={() => {
                  setResult(null);
                  setVoucherCode('');
                }}
                variant="outline"
                className="w-full font-bold"
              >
                Pronto para Próximo Visitante
              </Button>
            </Card>
          ) : (
            <div className="h-full border-2 border-dashed border-slate-200 rounded-3xl p-10 flex flex-col items-center justify-center text-center text-slate-400 space-y-3 bg-white/50">
              <QrCode className="w-12 h-12" />
              <p className="text-sm font-semibold text-slate-600">Aguardando leitura de ingresso</p>
              <p className="text-xs max-w-xs">Os dados do visitante e a confirmação de entrada serão exibidos aqui em tempo real.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
