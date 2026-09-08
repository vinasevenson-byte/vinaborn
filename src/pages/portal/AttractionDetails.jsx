import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, Calendar, Clock, ShieldCheck, ArrowLeft, ShoppingBag, CheckCircle, Ticket } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge, Card } from '../../components/ui/FormControls';
import { useCart } from '../../contexts/CartContext';

export const AttractionDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [attraction, setAttraction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    fetch(`/api/attractions/slug/${slug}`)
      .then(res => res.json())
      .then(data => {
        setAttraction(data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback para visualização completa
        setAttraction({
          id: 2,
          name: "Ópera de Arame e Vale da Música",
          slug: "opera-de-arame",
          summary: "Estrutura tubular transparente sobre um lago cercada por vegetação exuberante e palco flutuante com música instrumental ao vivo.",
          description: "Montada em estrutura tubular com teto transparente de policarbonato, a Ópera de Arame foi construída em apenas 75 dias. Integrada à Pedreira Paulo Leminski, abriga o projeto Vale da Música, com apresentações musicais diárias ao vivo em um palco flutuante em meio à natureza.",
          category: "SHOW",
          address: "Rua João Gava, 970 - Abranches, Curitiba - PR",
          coverImageUrl: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80",
          googleRating: 4.8,
          reviewsCount: 21500,
          ticketStartingPrice: 15.00,
          categories: [
            { id: 1, name: "Inteira", price: 15.00, description: "Acesso completo à Ópera de Arame e Vale da Música" },
            { id: 2, name: "Meia-Entrada (Estudante / Idoso)", price: 7.50, description: "Necessária comprovação documental na entrada" },
            { id: 3, name: "Morador de Curitiba e RMC", price: 10.00, description: "Desconto especial apresentando comprovante de residência" }
          ]
        });
        setLoading(false);
      });
  }, [slug]);

  if (loading || !attraction) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-500 mt-4">Carregando detalhes da atração...</p>
      </div>
    );
  }

  const currentCategories = attraction.categories || [
    { id: 1, name: "Inteira", price: attraction.ticketStartingPrice || 15.00, description: "Acesso geral à atração" },
    { id: 2, name: "Meia-Entrada", price: (attraction.ticketStartingPrice || 15.00) / 2, description: "Estudantes, professores, idosos e PCD" }
  ];

  const selectedCategory = currentCategories.find(c => c.id === selectedCategoryId) || currentCategories[0];
  const totalPrice = Number(selectedCategory.price) * quantity;

  const handleAddToCart = () => {
    addToCart(attraction, selectedCategory, null, quantity, visitDate);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Botão Voltar */}
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar para todas as atrações</span>
      </Link>

      {/* Hero com Foto e Título */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Coluna Esquerda: Imagem e Descrição */}
        <div className="lg:col-span-2 space-y-8">
          <div className="relative rounded-3xl overflow-hidden shadow-lg h-96 bg-slate-100">
            <img
              src={attraction.coverImageUrl}
              alt={attraction.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <Badge variant="primary" className="bg-white/95 backdrop-blur text-sky-800 font-bold border-none px-3 py-1 text-xs">
                {attraction.category}
              </Badge>
            </div>
            <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-slate-800 flex items-center gap-1.5 shadow-md">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{attraction.googleRating}</span>
              <span className="text-slate-400 font-normal">({attraction.reviewsCount} avaliações no Google Places)</span>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {attraction.name}
            </h1>
            <p className="flex items-center gap-2 text-sm text-slate-500">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{attraction.address}</span>
            </p>
          </div>

          <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4 pt-4 border-t border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">Sobre a Experiência</h3>
            <p>{attraction.description}</p>
          </div>

          {/* Destaques e Informações Relevantes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-200">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-start gap-3">
              <Clock className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-900 uppercase">Horário</p>
                <p className="text-xs text-slate-500 mt-0.5">Terça a Domingo, 10h às 18h</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-start gap-3">
              <Ticket className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-900 uppercase">Acesso</p>
                <p className="text-xs text-slate-500 mt-0.5">Voucher digital no celular</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-900 uppercase">Garantia</p>
                <p className="text-xs text-slate-500 mt-0.5">Cancelamento grátis até 24h</p>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Caixa de Compra de Ingressos */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Garanta seu Acesso</span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">Selecionar Ingressos</h3>
            </div>

            {/* Seletor de Categoria */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase">Categoria do Ingresso</label>
              <div className="space-y-2">
                {currentCategories.map(cat => (
                  <label
                    key={cat.id}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`block p-3.5 rounded-xl border transition-all cursor-pointer ${
                      selectedCategoryId === cat.id
                        ? 'border-sky-600 bg-sky-50/50 shadow-xs ring-1 ring-sky-500'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-slate-900">{cat.name}</span>
                      <span className="font-black text-sm text-sky-700">
                        {Number(cat.price) > 0 ? `R$ ${Number(cat.price).toFixed(2).replace('.', ',')}` : 'Grátis'}
                      </span>
                    </div>
                    {cat.description && (
                      <p className="text-[11px] text-slate-500 mt-1">{cat.description}</p>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Data da Visita */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Data da Visita</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="date"
                  value={visitDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                />
              </div>
            </div>

            {/* Quantidade */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Quantidade de Ingressos</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-xl border border-slate-300 hover:bg-slate-100 flex items-center justify-center font-bold text-lg cursor-pointer"
                >
                  -
                </button>
                <span className="flex-1 text-center font-black text-lg text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-xl border border-slate-300 hover:bg-slate-100 flex items-center justify-center font-bold text-lg cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total e Botão */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-slate-500">Valor Total:</span>
                <span className="text-2xl font-black text-slate-900">
                  R$ {totalPrice.toFixed(2).replace('.', ',')}
                </span>
              </div>

              {addedSuccess ? (
                <div className="space-y-2">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 text-xs font-bold">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Ingresso adicionado ao seu carrinho!</span>
                  </div>
                  <Link to="/carrinho" className="block">
                    <Button variant="secondary" size="lg" className="w-full font-bold">
                      Ir para o Carrinho
                    </Button>
                  </Link>
                </div>
              ) : (
                <Button
                  onClick={handleAddToCart}
                  variant="primary"
                  size="lg"
                  className="w-full font-bold gap-2 py-3.5"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Adicionar ao Carrinho</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
