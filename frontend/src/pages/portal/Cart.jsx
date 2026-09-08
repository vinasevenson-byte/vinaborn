import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, ShieldCheck, Ticket, QrCode, CheckCircle, Tag, CreditCard } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input, Card } from '../../components/ui/FormControls';

export const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, subtotal, discount, total, coupon, setCoupon } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('PIX');
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'CURITIBA360') {
      setCoupon({ code: 'CURITIBA360', percentage: 10 });
      setCouponError('');
    } else {
      setCouponError('Cupom inválido ou expirado. Teste o cupom: CURITIBA360');
    }
  };

  const handleFinishOrder = () => {
    const generatedVoucher = `VCH-CWB-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`;
    setVoucherCode(generatedVoucher);
    setOrderCompleted(true);
    clearCart();
  };

  if (orderCompleted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-8">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Compra Confirmada com Sucesso!</h1>
          <p className="text-slate-500">Seu voucher digital já está pronto para uso e enviado ao seu e-mail.</p>
        </div>

        <Card className="p-8 text-left border-2 border-sky-600 space-y-6 bg-gradient-to-b from-sky-50/50 to-white">
          <div className="flex justify-between items-start border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wider block">Voucher Oficial</span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">Curitiba 360 Pass</h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Código do Ingresso</span>
              <span className="font-mono font-bold text-sky-800 text-sm">{voucherCode}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-4">
            <div className="space-y-2 text-center sm:text-left">
              <p className="text-sm font-semibold text-slate-900">Titular: {user?.name || 'Visitante Autorizado'}</p>
              <p className="text-xs text-slate-500">Apresente este QR Code na entrada da atração</p>
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                STATUS: VÁLIDO PARA ENTRADA
              </span>
            </div>

            {/* Simulação do QR Code */}
            <div className="w-32 h-32 bg-white border-2 border-slate-900 p-2 rounded-xl flex flex-col items-center justify-center shadow-xs">
              <QrCode className="w-24 h-24 text-slate-900" />
              <span className="text-[9px] font-mono text-slate-600 font-bold mt-1">{voucherCode.slice(0, 12)}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
            <Link to="/backoffice/validacao" className="flex-1">
              <Button variant="secondary" className="w-full font-bold">
                Testar Validador de QR Code no Backoffice
              </Button>
            </Link>
            <Link to="/" className="flex-1">
              <Button variant="outline" className="w-full">
                Voltar à Página Inicial
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
          <Ticket className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Seu carrinho está vazio</h2>
          <p className="text-slate-500 text-sm">Explore as atrações e adicione ingressos para continuar.</p>
        </div>
        <Link to="/">
          <Button variant="primary" size="lg" className="font-bold">
            Explorar Atrações de Curitiba
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Continuar explorando atrações</span>
      </Link>

      <h1 className="text-3xl font-black text-slate-900 tracking-tight">Carrinho de Ingressos</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Coluna Esquerda: Itens do Carrinho */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row items-center gap-5 shadow-xs">
              <img
                src={item.coverImageUrl}
                alt={item.attractionName}
                className="w-24 h-24 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 space-y-1 text-center sm:text-left">
                <h3 className="font-bold text-slate-900 text-base">{item.attractionName}</h3>
                <p className="text-xs text-slate-500 font-medium">{item.categoryName} • Data: {item.visitDate}</p>
                <p className="text-sm font-black text-sky-700">
                  R$ {Number(item.price).toFixed(2).replace('.', ',')} un.
                </p>
              </div>

              {/* Quantidade */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-lg border border-slate-300 flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-slate-100"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold text-slate-900 text-sm">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-lg border border-slate-300 flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-slate-100"
                >
                  +
                </button>
              </div>

              {/* Total do Item */}
              <div className="text-right min-w-[90px]">
                <p className="font-black text-slate-900 text-base">
                  R$ {(Number(item.price) * item.quantity).toFixed(2).replace('.', ',')}
                </p>
              </div>

              {/* Remover */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Remover"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Coluna Direita: Resumo Financeiro & Pagamento */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
            <h3 className="text-xl font-black text-slate-900">Resumo do Pedido</h3>

            {/* Cupom */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase">Cupom de Desconto</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: CURITIBA360"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                />
                <Button type="submit" size="sm" variant="outline" className="font-bold">
                  Aplicar
                </Button>
              </div>
              {coupon && (
                <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Cupom aplicado: -{coupon.percentage}% de desconto!</span>
                </p>
              )}
              {couponError && <p className="text-xs text-rose-600">{couponError}</p>}
            </form>

            {/* Meio de Pagamento */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 uppercase">Forma de Pagamento</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('PIX')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    paymentMethod === 'PIX' ? 'border-sky-600 bg-sky-50 text-sky-700 ring-1 ring-sky-500' : 'border-slate-200 text-slate-700'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>PIX Instantâneo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    paymentMethod === 'CARD' ? 'border-sky-600 bg-sky-50 text-sky-700 ring-1 ring-sky-500' : 'border-slate-200 text-slate-700'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Cartão de Crédito</span>
                </button>
              </div>
            </div>

            {/* Totais */}
            <div className="space-y-2 pt-4 border-t border-slate-100 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Desconto (10%):</span>
                  <span>- R$ {discount.toFixed(2).replace('.', ',')}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-black text-slate-900 pt-2 border-t border-slate-100">
                <span>Total a Pagar:</span>
                <span>R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            <Button
              onClick={handleFinishOrder}
              variant="primary"
              size="lg"
              className="w-full font-bold py-3.5 shadow-md"
            >
              Finalizar Compra e Emitir Vouchers
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
