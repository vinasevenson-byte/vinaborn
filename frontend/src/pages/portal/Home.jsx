import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, MapPin, ArrowRight, Sparkles, Compass, ShieldCheck, Ticket, Calendar } from 'lucide-react';
import { Badge } from '../../components/ui/FormControls';
import { Button } from '../../components/ui/Button';

export const Home = () => {
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    fetch('/api/attractions')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        if (Array.isArray(data)) {
          setAttractions(data);
        } else {
          throw new Error('Not array');
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback com atrações de Curitiba
        setAttractions([
          {
            id: 1,
            name: "Jardim Botânico de Curitiba",
            slug: "jardim-botanico-curitiba",
            summary: "O mais famoso cartão-postal da capital paranaense, com sua icônica estufa de ferro e vidro e jardins em estilo francês.",
            category: "PARQUE",
            coverImageUrl: "https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=800&q=80",
            googleRating: 4.9,
            reviewsCount: 34200,
            ticketStartingPrice: 0.00,
            featured: true
          },
          {
            id: 2,
            name: "Ópera de Arame e Vale da Música",
            slug: "opera-de-arame",
            summary: "Estrutura tubular transparente sobre um lago cercada por vegetação exuberante e palco flutuante com música ao vivo.",
            category: "SHOW",
            coverImageUrl: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80",
            googleRating: 4.8,
            reviewsCount: 21500,
            ticketStartingPrice: 15.00,
            featured: true
          },
          {
            id: 3,
            name: "Museu Oscar Niemeyer (MON / Museu do Olho)",
            slug: "museu-oscar-niemeyer",
            summary: "Um dos maiores complexos de arte da América Latina, com arquitetura arrojada projetada por Oscar Niemeyer.",
            category: "MUSEU",
            coverImageUrl: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=800&q=80",
            googleRating: 4.8,
            reviewsCount: 28900,
            ticketStartingPrice: 30.00,
            featured: true
          },
          {
            id: 4,
            name: "Passeio de Trem da Serra do Mar (Curitiba - Morretes)",
            slug: "passeio-trem-serra-do-mar",
            summary: "Uma das 10 viagens de trem mais espetaculares do planeta pela Mata Atlântica preservada e viadutos históricos.",
            category: "PASSEIO",
            coverImageUrl: "https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?auto=format&fit=crop&w=800&q=80",
            googleRating: 4.9,
            reviewsCount: 18400,
            ticketStartingPrice: 175.00,
            featured: true
          },
          {
            id: 5,
            name: "Parque Tanguá",
            slug: "parque-tangua",
            summary: "Mirante monumental a 65 metros de altura sobre antiga pedreira com túnel artificial e pôr do sol inesquecível.",
            category: "PARQUE",
            coverImageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
            googleRating: 4.9,
            reviewsCount: 24700,
            ticketStartingPrice: 0.00,
            featured: true
          }
        ]);
        setLoading(false);
      });
  }, []);

  const categories = [
    { id: 'ALL', label: 'Todas as Categorias' },
    { id: 'PARQUE', label: '🌿 Parques e Bosques' },
    { id: 'SHOW', label: '🎭 Shows e Teatros' },
    { id: 'MUSEU', label: '🏛️ Museus e Arte' },
    { id: 'PASSEIO', label: '🚂 Passeios e Tours' },
    { id: 'GASTRONOMIA', label: '🍷 Gastronomia' },
  ];

  const safeAttractions = Array.isArray(attractions) ? attractions : [];
  const filteredAttractions = safeAttractions.filter(att => {
    const matchesSearch = att.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          att.summary?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || att.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Banner Oficial do Curitiba 360 */}
      <section className="relative bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Glow effect decorativo */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/15 text-xs font-semibold text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Viva Curitiba com todos os sentidos</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Descubra as Melhores Atrações e Reserve Seus Ingressos em um <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">Giro 360°</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Plataforma oficial integrada que conecta turistas, parques, espetáculos culturais, passeios históricos e a prefeitura em um ecossistema digital seguro.
          </p>

          {/* Barra de Busca Principal */}
          <div className="max-w-3xl mx-auto bg-white p-2 sm:p-2.5 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-2 border border-slate-200">
            <div className="flex items-center gap-3 px-4 w-full flex-1">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Qual experiência você quer viver hoje em Curitiba?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2.5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
              />
            </div>
            <Button size="lg" className="w-full sm:w-auto px-8 rounded-xl font-bold">
              Buscar Ingressos
            </Button>
          </div>
        </div>
      </section>

      {/* Seletor de Categorias / Filtros Rápidos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-sky-600 text-white shadow-sm scale-102'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Grade de Atrações e Ingressos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-600 font-bold text-xs uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>Experiências Imperdíveis</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Atrações e Pontos Turísticos em Destaque
            </h2>
          </div>
          <p className="text-sm text-slate-500">
            Mostrando <span className="font-bold text-slate-900">{filteredAttractions.length}</span> experiências disponíveis
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl h-96 animate-pulse border border-slate-200"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAttractions.map((att) => (
              <div
                key={att.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
              >
                {/* Imagem de Capa */}
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  <img
                    src={att.coverImageUrl}
                    alt={att.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant="primary" className="bg-white/90 backdrop-blur text-sky-800 border-none font-bold">
                      {att.category}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-full text-xs font-bold text-slate-800 flex items-center gap-1 shadow-xs">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{att.googleRating}</span>
                    <span className="text-slate-400 font-normal">({att.reviewsCount})</span>
                  </div>
                </div>

                {/* Conteúdo do Card */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-sky-600 transition-colors">
                      {att.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {att.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 uppercase font-semibold block">A partir de</span>
                      <span className="text-lg font-black text-slate-900">
                        {att.ticketStartingPrice > 0 ? (
                          `R$ ${Number(att.ticketStartingPrice).toFixed(2).replace('.', ',')}`
                        ) : (
                          <span className="text-emerald-600">Gratuito</span>
                        )}
                      </span>
                    </div>

                    <Link to={`/atracoes/${att.slug || att.id}`}>
                      <Button size="sm" variant="primary" className="font-semibold gap-1.5">
                        <span>Ver Ingressos</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Seção Pacotes de Experiências Promocionais */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-sky-700 to-indigo-800 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-4 max-w-2xl">
            <Badge variant="warning" className="bg-amber-400 text-slate-950 font-bold border-none uppercase">
              Economize até 30%
            </Badge>
            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Pacote Curitiba Cultural 360°
            </h3>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              Combine o Passeio de Trem para Morretes com acesso ao Museu Oscar Niemeyer e almoço típico no Restaurante Madalosso em um único voucher com desconto exclusivo.
            </p>
          </div>

          <Link to="/pacotes">
            <Button size="lg" className="bg-white text-sky-800 hover:bg-slate-100 font-bold shadow-lg shrink-0">
              Conhecer Todos os Pacotes
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
