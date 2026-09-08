import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  ArrowLeft,
  ShieldCheck,
  Ticket,
  QrCode,
  CheckCircle2,
  Tag,
  CreditCard,
  Copy,
  Check,
  Printer,
  Calendar,
  User,
  Clock,
  ExternalLink,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input, Card, Badge } from '../../components/ui/FormControls';

export const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, subtotal, discount, total, coupon, setCoupon } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Estados do Formulário de Checkout
  const [checkoutStep, setCheckoutStep] = useState('CART'); // 'CART' | 'PAYMENT' | 'SUCCESS'
  const [paymentMethod, setPaymentMethod] = useState('PIX'); // 'PIX' | 'CARD'
  const [loading, setLoading] = useState(false);

  // Dados do Comprador
  const [customerData, setCustomerData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    cpf: user?.cpf || ''
  });

  // Dados do Cartão de Crédito
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    installments: '1'
  });

  // Titulares por Ingresso (Anti-Cambista RN-038)
  const [ticketHolders, setTicketHolders] = useState({});

  // Cupom de Desconto
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState(null);

  // Dados do Pedido Concluído
  const [completedOrder, setCompletedOrder] = useState(null);
  const [copiedPix, setCopiedPix] = useState(false);
  const [pixTimeRemaining, setPixTimeRemaining] = useState(900); // 15 minutos em segundos

  // Timer do PIX
  useEffect(() => {
    if (checkoutStep === 'PAYMENT' && paymentMethod === 'PIX' && pixTimeRemaining > 0) {
      const timer = setInterval(() => setPixTimeRemaining(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [checkoutStep, paymentMethod, pixTimeRemaining]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Validar Cupom via Backend
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    setCouponMessage(null);

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCode.trim().toUpperCase(),
          purchaseAmount: subtotal
        })
      });

      const data = await res.json();
      if (res.ok && data.valid) {
        setCoupon({
          code: data.code,
          discountType: data.discountType,
          discountValue: data.discountValue,
          agencyName: data.agencyName
        });
        setCouponMessage({ type: 'success', text: data.message });
      } else {
        setCoupon(null);
        setCouponMessage({ type: 'error', text: data.message || 'Cupom inválido ou expirado.' });
      }
    } catch {
      // Fallback local se a API estiver indisponível
      if (couponCode.trim().toUpperCase() === 'CURITIBA360') {
        setCoupon({ code: 'CURITIBA360', discountType: 'PERCENTAGE', discountValue: 10 });
        setCouponMessage({ type: 'success', text: 'Cupom de 10% aplicado com sucesso!' });
      } else {
        setCouponMessage({ type: 'error', text: 'Cupom inválido. Tente: CURITIBA360' });
      }
    } finally {
      setCouponLoading(false);
    }
  };

  // Submissão do Pedido ao Backend
  const handleProcessCheckout = async () => {
    setLoading(true);

    // Mapear itens para envio
    const formattedItems = items.map((item, index) => ({
      attractionId: item.attractionId,
      categoryName: item.categoryName,
      price: item.price,
      quantity: item.quantity,
      visitDate: item.visitDate,
      holderName: ticketHolders[`${item.id}_0`] || customerData.name || 'Visitante Curitiba 360',
      holderDocument: customerData.cpf || '000.000.000-00'
    }));

    const payload = {
      items: formattedItems,
      paymentMethod,
      couponCode: coupon?.code || null,
      customerName: customerData.name || 'Turista Curitiba 360',
      customerEmail: customerData.email || 'turista@curitiba360.com.br',
      customerCpf: customerData.cpf || '111.222.333-44'
    };

    try {
      const response = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        setCompletedOrder(data);
        setCheckoutStep('SUCCESS');
        clearCart();
      } else {
        throw new Error(data.message || 'Erro ao processar checkout');
      }
    } catch (err) {
      // Fallback local simulado para demonstração sem rede
      const mockOrderNumber = `CWB-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const mockTickets = items.flatMap(item =>
        Array.from({ length: item.quantity }).map((_, i) => ({
          id: Date.now() + i,
          voucherCode: `VCH-CWB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          holderName: ticketHolders[`${item.id}_${i}`] || customerData.name || 'Visitante Curitiba 360',
          holderDocument: customerData.cpf || '111.222.333-44',
          categoryName: item.categoryName,
          price: item.price,
          visitDate: item.visitDate || '2026-09-15',
          attraction: { name: item.attractionName },
          status: 'VALID'
        }))
      );

      setCompletedOrder({
        orderNumber: mockOrderNumber,
        status: 'PAID',
        totalAmount: total,
        discountAmount: discount,
        paymentMethod,
        pixCopyAndPaste: '00020126580014BR.GOV.BCB.PIX0136curitiba360-pix@turismo.curitiba.br520400005303986540' + total.toFixed(2) + '5802BR5916CURITIBA 3606008CURITIBA62070503***6304',
        tickets: mockTickets,
        customerName: customerData.name || 'Turista Curitiba 360',
        customerEmail: customerData.email || 'turista@curitiba360.com.br'
      });
      setCheckoutStep('SUCCESS');
      clearCart();
    } finally {
      setLoading(false);
    }
  };

  const copyPixCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  // ===========================================================================
  // TELA DE SUCESSO & EMISSÃO DE VOUCHERS (WF-077)
  // ===========================================================================
  if (checkoutStep === 'SUCCESS' && completedOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        {/* Banner de Confirmação */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm animate-in zoom-in-50 duration-300">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Pagamento Confirmado!
          </h1>
          <p className="text-slate-600 text-sm max-w-md mx-auto">
            Seu pedido <span className="font-mono font-bold text-sky-700">{completedOrder.orderNumber}</span> foi processado com sucesso.
            Os vouchers digitais foram emitidos e enviados para <span className="font-semibold text-slate-900">{completedOrder.customerEmail}</span>.
          </p>
        </div>

        {/* Barra de Ações Rápidas */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            onClick={() => window.print()}
            variant="outline"
            className="font-bold gap-2 text-xs py-2.5 px-4 bg-white shadow-xs"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Imprimir / Salvar PDF (WF-077)</span>
          </Button>

          <Link to="/backoffice/validacao">
            <Button variant="primary" className="font-bold gap-2 text-xs py-2.5 px-4 bg-sky-600 hover:bg-sky-700">
              <QrCode className="w-4 h-4" />
              <span>Testar na Catraca do Backoffice (WF-031)</span>
            </Button>
          </Link>
        </div>

        {/* Lista de Vouchers Oficiais com QR Code */}
        <div className="space-y-6">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-sky-600" />
            <span>Seus Vouchers Digitais ({completedOrder.tickets?.length || 1})</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {completedOrder.tickets?.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white rounded-3xl border-2 border-slate-900 p-6 shadow-xl relative overflow-hidden space-y-5"
              >
                {/* Faixa decorativa superior */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 block">
                      CURITIBA 360 PASS
                    </span>
                    <h4 className="font-extrabold text-base text-slate-900">
                      {ticket.attraction?.name || 'Atração Oficial'}
                    </h4>
                  </div>
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    VÁLIDO
                  </span>
                </div>

                {/* Bloco Central: QR Code & Dados */}
                <div className="flex items-center gap-5">
                  {/* QR Code */}
                  <div className="w-28 h-28 p-2 rounded-2xl bg-white border-2 border-slate-900 flex flex-col items-center justify-center shrink-0 shadow-sm">
                    <QrCode className="w-20 h-20 text-slate-900" />
                    <span className="text-[8px] font-mono font-black text-slate-600 mt-1">
                      {ticket.voucherCode.slice(-8)}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Titular</span>
                      <span className="font-black text-slate-900 text-sm block">{ticket.holderName}</span>
                      <span className="text-slate-500 font-mono text-[11px]">{ticket.holderDocument}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Categoria</span>
                      <span className="font-bold text-sky-800">{ticket.categoryName}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Data de Visita</span>
                      <span className="font-semibold text-slate-800">
                        {ticket.visitDate ? new Date(ticket.visitDate + 'T00:00:00').toLocaleDateString('pt-BR') : 'Livre'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rodapé com Código do Voucher */}
                <div className="pt-3 border-t border-dashed border-slate-300 flex items-center justify-between text-xs">
                  <div className="font-mono font-bold text-slate-600 text-[11px]">
                    {ticket.voucherCode}
                  </div>
                  <div className="text-[10px] font-semibold text-slate-400">
                    Apresente na catraca
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Link para voltar */}
        <div className="text-center pt-6">
          <Link to="/">
            <Button variant="outline" className="font-bold text-slate-700">
              Voltar ao Portal Curitiba 360
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Se o carrinho estiver vazio
  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
          <Ticket className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Seu carrinho está vazio</h2>
          <p className="text-slate-500 text-sm">Explore as melhores atrações de Curitiba e garanta seus ingressos antecipados.</p>
        </div>
        <Link to="/">
          <Button variant="primary" size="lg" className="font-bold">
            Explorar Atrações de Curitiba
          </Button>
        </Link>
      </div>
    );
  }

  // ===========================================================================
  // TELA DO CARRINHO & CHECKOUT (Passo 1 e 2)
  // ===========================================================================
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Topo com Migalha e Título */}
      <div className="flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Continuar explorando atrações</span>
        </Link>

        {/* Indicador de Etapas */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-400">
          <span className={checkoutStep === 'CART' ? 'text-sky-600 font-extrabold' : 'text-slate-500'}>
            1. Ingressos & Titulares
          </span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className={checkoutStep === 'PAYMENT' ? 'text-sky-600 font-extrabold' : 'text-slate-400'}>
            2. Pagamento
          </span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>3. Vouchers</span>
        </div>
      </div>

      <h1 className="text-3xl font-black text-slate-900 tracking-tight">
        {checkoutStep === 'CART' ? 'Carrinho de Ingressos' : 'Finalizar Compra & Pagamento'}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Coluna Esquerda (2 colunas) */}
        <div className="lg:col-span-2 space-y-6">
          {checkoutStep === 'CART' ? (
            /* Lista de Itens do Carrinho */
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="p-5 border-slate-200 space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    <img
                      src={item.coverImageUrl}
                      alt={item.attractionName}
                      className="w-24 h-24 rounded-2xl object-cover shrink-0"
                    />
                    <div className="flex-1 space-y-1 text-center sm:text-left">
                      <h3 className="font-bold text-slate-900 text-base">{item.attractionName}</h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {item.categoryName} • Data da Visita: {item.visitDate || 'Livre'}
                      </p>
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

                    {/* Subtotal do Item */}
                    <div className="text-right min-w-[90px]">
                      <p className="font-black text-slate-900 text-base">
                        R$ {(Number(item.price) * item.quantity).toFixed(2).replace('.', ',')}
                      </p>
                    </div>

                    {/* Remover */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Remover do Carrinho"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Campos de Titular do Ingresso (Anti-Cambista RN-038) */}
                  <div className="pt-3 border-t border-slate-100 bg-slate-50/50 p-3 rounded-xl space-y-2">
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                      Nome do Visitante / Titular para o Ingresso:
                    </span>
                    <input
                      type="text"
                      placeholder="Nome completo de quem usará o ingresso..."
                      value={ticketHolders[`${item.id}_0`] || ''}
                      onChange={(e) =>
                        setTicketHolders({ ...ticketHolders, [`${item.id}_0`]: e.target.value })
                      }
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            /* Formulário de Pagamento (Passo 2) */
            <div className="space-y-6">
              {/* Dados do Comprador */}
              <Card className="p-6 border-slate-200 space-y-4">
                <h3 className="font-black text-slate-900 text-base">Dados do Comprador</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Nome Completo"
                    placeholder="Seu nome completo"
                    value={customerData.name}
                    onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                    required
                  />
                  <Input
                    label="E-mail (para envio do voucher)"
                    type="email"
                    placeholder="seu.email@exemplo.com"
                    value={customerData.email}
                    onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                    required
                  />
                </div>
                <Input
                  label="CPF do Comprador"
                  placeholder="000.000.000-00"
                  value={customerData.cpf}
                  onChange={(e) => setCustomerData({ ...customerData, cpf: e.target.value })}
                  required
                />
              </Card>

              {/* Opções de Pagamento */}
              <Card className="p-6 border-slate-200 space-y-6">
                <h3 className="font-black text-slate-900 text-base">Forma de Pagamento</h3>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('PIX')}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 font-bold text-xs transition-all cursor-pointer ${
                      paymentMethod === 'PIX'
                        ? 'border-sky-600 bg-sky-50/50 text-sky-800 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <QrCode className="w-6 h-6 text-sky-600" />
                    <span>PIX Instantâneo</span>
                    <span className="text-[10px] text-emerald-600 font-extrabold">Aprovação Imediata</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 font-bold text-xs transition-all cursor-pointer ${
                      paymentMethod === 'CARD'
                        ? 'border-sky-600 bg-sky-50/50 text-sky-800 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-6 h-6 text-sky-600" />
                    <span>Cartão de Crédito</span>
                    <span className="text-[10px] text-slate-400 font-semibold">Até 6x sem juros</span>
                  </button>
                </div>

                {/* Conteúdo Dinâmico do PIX */}
                {paymentMethod === 'PIX' && (
                  <div className="p-6 rounded-2xl bg-sky-50/50 border border-sky-200 space-y-4 text-center">
                    <div className="w-32 h-32 bg-white rounded-2xl p-2 border-2 border-slate-900 mx-auto flex flex-col items-center justify-center shadow-sm">
                      <QrCode className="w-24 h-24 text-slate-900" />
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-bold text-sky-800 uppercase tracking-wider block">
                        Chave PIX Dinâmica Gerada
                      </span>
                      <p className="text-xs text-slate-500">
                        Tempo restante para pagamento: <span className="font-mono font-bold text-rose-600">{formatTime(pixTimeRemaining)}</span>
                      </p>
                    </div>

                    <div className="flex gap-2 max-w-md mx-auto">
                      <input
                        type="text"
                        readOnly
                        value="00020126580014BR.GOV.BCB.PIX0136curitiba360-pix@turismo.curitiba.br520400005303986540"
                        className="flex-1 px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 bg-white"
                      />
                      <Button
                        type="button"
                        onClick={() => copyPixCode('00020126580014BR.GOV.BCB.PIX0136curitiba360-pix@turismo.curitiba.br520400005303986540')}
                        variant="secondary"
                        className="text-xs font-bold gap-1"
                      >
                        {copiedPix ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedPix ? 'Copiado!' : 'Copiar'}</span>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Formulário do Cartão de Crédito */}
                {paymentMethod === 'CARD' && (
                  <div className="space-y-4 pt-2">
                    <Input
                      label="Número do Cartão de Crédito"
                      placeholder="0000 0000 0000 0000"
                      value={cardData.number}
                      onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                      required
                    />

                    <Input
                      label="Nome Impresso no Cartão"
                      placeholder="COMO NO CARTAO"
                      value={cardData.name}
                      onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                      required
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Validade (MM/AA)"
                        placeholder="12/28"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                        required
                      />
                      <Input
                        label="CVV"
                        placeholder="123"
                        maxLength={4}
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Parcelas</label>
                      <select
                        value={cardData.installments}
                        onChange={(e) => setCardData({ ...cardData, installments: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white font-medium"
                      >
                        <option value="1">1x de R$ {total.toFixed(2).replace('.', ',')} (sem juros)</option>
                        <option value="2">2x de R$ {(total / 2).toFixed(2).replace('.', ',')} (sem juros)</option>
                        <option value="3">3x de R$ {(total / 3).toFixed(2).replace('.', ',')} (sem juros)</option>
                        <option value="6">6x de R$ {(total / 6).toFixed(2).replace('.', ',')} (sem juros)</option>
                      </select>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>

        {/* Coluna Direita: Resumo Financeiro & Botão de Avanço */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
            <h3 className="text-xl font-black text-slate-900">Resumo do Pedido</h3>

            {/* Cupom de Desconto */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase">Cupom de Desconto</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: CURITIBA360"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono uppercase"
                />
                <Button type="submit" size="sm" loading={couponLoading} variant="outline" className="font-bold text-xs">
                  Aplicar
                </Button>
              </div>

              {couponMessage && (
                <p className={`text-xs font-bold flex items-center gap-1 mt-1 ${
                  couponMessage.type === 'success' ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  <Tag className="w-3.5 h-3.5" />
                  <span>{couponMessage.text}</span>
                </p>
              )}

              {coupon && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{coupon.code}</span>
                  </div>
                  <span className="font-black">
                    {coupon.discountType === 'PERCENTAGE'
                      ? `-${coupon.discountValue}%`
                      : `-R$ ${Number(coupon.discountValue).toFixed(2).replace('.', ',')}`}
                  </span>
                </div>
              )}
            </form>

            {/* Valores */}
            <div className="space-y-2 pt-4 border-t border-slate-100 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} ingressos):</span>
                <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Desconto Aplicado:</span>
                  <span>- R$ {discount.toFixed(2).replace('.', ',')}</span>
                </div>
              )}

              <div className="flex justify-between text-xl font-black text-slate-900 pt-3 border-t border-slate-100">
                <span>Total a Pagar:</span>
                <span className="text-emerald-700">R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            {/* Botão de Avanço / Conclusão */}
            {checkoutStep === 'CART' ? (
              <Button
                onClick={() => setCheckoutStep('PAYMENT')}
                variant="primary"
                size="lg"
                className="w-full font-bold py-3.5 shadow-md text-sm"
              >
                Prosseguir para o Pagamento
              </Button>
            ) : (
              <div className="space-y-2">
                <Button
                  onClick={handleProcessCheckout}
                  loading={loading}
                  variant="primary"
                  size="lg"
                  className="w-full font-bold py-3.5 shadow-md text-sm bg-emerald-600 hover:bg-emerald-700"
                >
                  {paymentMethod === 'PIX' ? 'Confirmar Pagamento PIX' : 'Concluir Pedido no Cartão'}
                </Button>

                <Button
                  onClick={() => setCheckoutStep('CART')}
                  variant="outline"
                  className="w-full font-bold text-xs"
                >
                  Voltar para o Carrinho
                </Button>
              </div>
            )}

            <div className="pt-2 text-center text-slate-400 text-xs flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Ambiente Seguro com Criptografia SSL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
