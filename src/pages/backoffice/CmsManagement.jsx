import React, { useState, useEffect } from 'react';
import {
  FileText,
  Image,
  Star,
  Plus,
  Eye,
  Trash2,
  Power,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  MapPin,
  Globe
} from 'lucide-react';
import { Card, Badge, Input } from '../../components/ui/FormControls';
import { Button } from '../../components/ui/Button';

export const CmsManagement = () => {
  const [activeTab, setActiveTab] = useState('banners'); // 'banners' | 'reviews' | 'pages'

  // Estados dos Banners (WF-054)
  const [banners, setBanners] = useState([]);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [bannerForm, setBannerForm] = useState({
    title: '',
    subtitle: '',
    imageUrl: 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=1200&q=80',
    linkUrl: '/atracoes',
    ctaText: 'Ver Detalhes'
  });

  // Estados das Avaliações (WF-055)
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch('/api/cms/banners')
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setBanners(data);
        } else {
          throw new Error('Invalid data');
        }
      })
      .catch(() => {
        setBanners([
          {
            id: 1,
            title: "Festival de Primavera na Ópera de Arame",
            subtitle: "Música instrumental flutuante no Vale da Música todos os finais de semana.",
            imageUrl: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80",
            linkUrl: "/atracoes/opera-de-arame",
            ctaText: "Garantir Ingresso",
            active: true
          },
          {
            id: 2,
            title: "Descida Histórica da Serra do Mar de Trem",
            subtitle: "Viva a mais espetacular ferrovia do Brasil rumo a Morretes.",
            imageUrl: "https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?auto=format&fit=crop&w=800&q=80",
            linkUrl: "/atracoes/passeio-trem-serra-do-mar",
            ctaText: "Ver Horários e Lotes",
            active: true
          }
        ]);
      });

    fetch('/api/cms/reviews')
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setReviews(data);
        } else {
          throw new Error('Invalid data');
        }
      })
      .catch(() => {
        setReviews([
          {
            id: 1,
            authorName: "Beatriz Alencar",
            rating: 5,
            comment: "Experiência impecável! Comprei pelo Curitiba 360, recebi o voucher com QR Code no mesmo minuto e a catraca da Ópera de Arame liberou em 2 segundos.",
            attractionName: "Ópera de Arame",
            date: "Há 3 dias",
            featuredOnHome: true
          },
          {
            id: 2,
            authorName: "Thiago Mendonça (São Paulo)",
            rating: 5,
            comment: "O passeio de trem para Morretes é surreal de lindo. A facilidade de comprar online com desconto de cupom de agência valeu demais a pena!",
            attractionName: "Trem da Serra do Mar",
            date: "Há 1 semana",
            featuredOnHome: true
          }
        ]);
      });
  }, []);

  const handleToggleBanner = async (id) => {
    try {
      await fetch(`/api/cms/banners/${id}/toggle`, { method: 'PUT' });
    } catch {}
    setBanners(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
  };

  const handleToggleReviewFeature = async (id) => {
    try {
      await fetch(`/api/cms/reviews/${id}/toggle-feature`, { method: 'PUT' });
    } catch {}
    setReviews(prev => prev.map(r => r.id === id ? { ...r, featuredOnHome: !r.featuredOnHome } : r));
  };

  const handleCreateBanner = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/cms/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bannerForm)
      });
      if (res.ok) {
        const saved = await res.json();
        setBanners(prev => [...prev, saved]);
      } else {
        throw new Error();
      }
    } catch {
      setBanners(prev => [...prev, { ...bannerForm, id: Date.now(), active: true }]);
    }
    setShowBannerModal(false);
    setBannerForm({
      title: '',
      subtitle: '',
      imageUrl: 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=1200&q=80',
      linkUrl: '/atracoes',
      ctaText: 'Ver Detalhes'
    });
  };

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
            Módulo de Conteúdo & Vitrine (WF-054 / WF-055 / RF-032 e RF-033)
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            CMS Institucional & Curadoria
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gerencie os banners da página inicial, a moderação de avaliações Google Places e as páginas institucionais.
          </p>
        </div>

        {activeTab === 'banners' && (
          <Button
            onClick={() => setShowBannerModal(true)}
            variant="primary"
            className="font-bold text-xs gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Banner Promocional</span>
          </Button>
        )}
      </div>

      {/* Navegação por Abas */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('banners')}
          className={`pb-3.5 px-5 font-bold text-sm flex items-center gap-2 transition-all relative ${
            activeTab === 'banners'
              ? 'text-sky-600 border-b-2 border-sky-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Image className="w-4 h-4" />
          <span>Banners da Home (WF-054)</span>
          <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
            {banners.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3.5 px-5 font-bold text-sm flex items-center gap-2 transition-all relative ${
            activeTab === 'reviews'
              ? 'text-sky-600 border-b-2 border-sky-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>Curadoria Google Places (WF-055)</span>
          <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            {reviews.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('pages')}
          className={`pb-3.5 px-5 font-bold text-sm flex items-center gap-2 transition-all relative ${
            activeTab === 'pages'
              ? 'text-sky-600 border-b-2 border-sky-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Páginas Institucionais & LGPD</span>
        </button>
      </div>

      {/* ABA 1: BANNERS (WF-054) */}
      {activeTab === 'banners' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(Array.isArray(banners) ? banners : []).map((banner) => (
            <Card key={banner.id} className="overflow-hidden border-slate-200 p-0 shadow-md flex flex-col justify-between">
              <div className="relative h-48 w-full bg-slate-900">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-5 flex flex-col justify-end">
                  <span className="text-[10px] font-black uppercase tracking-wider text-sky-400">
                    Banner Ativo na Vitrine
                  </span>
                  <h3 className="font-black text-lg text-white leading-tight mt-1">
                    {banner.title}
                  </h3>
                  <p className="text-xs text-slate-200 mt-0.5 line-clamp-1">
                    {banner.subtitle}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-white flex items-center justify-between border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block">Destino do Botão:</span>
                  <span className="font-mono text-sky-700 font-bold">{banner.linkUrl}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleBanner(banner.id)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors ${
                      banner.active
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-300'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{banner.active ? 'Ativo' : 'Oculto'}</span>
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ABA 2: AVALIAÇÕES GOOGLE PLACES (WF-055) */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <Card className="p-4 bg-amber-50/60 border-amber-200 text-amber-900 text-xs flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <strong>Curadoria de Prova Social:</strong> Selecione quais resenhas públicas de visitantes reais do Google Maps serão destacadas na Home do Curitiba 360.
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(Array.isArray(reviews) ? reviews : []).map((rev) => (
              <Card key={rev.id} className="p-5 border-slate-200 space-y-3 bg-white shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>

                  <span className="text-[11px] text-slate-400 font-medium">{rev.date}</span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "{rev.comment}"
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{rev.authorName}</span>
                    <span className="text-[11px] text-slate-400">{rev.attractionName}</span>
                  </div>

                  <button
                    onClick={() => handleToggleReviewFeature(rev.id)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                      rev.featuredOnHome
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${rev.featuredOnHome ? 'fill-amber-500 text-amber-500' : ''}`} />
                    <span>{rev.featuredOnHome ? 'Destaque na Home' : 'Oculto da Home'}</span>
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ABA 3: PÁGINAS INSTITUCIONAIS */}
      {activeTab === 'pages' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Card className="p-5 border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">Termos de Uso e Compra</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Regras de comercialização, ingressos nominais e condições de cancelamento.
            </p>
            <Button variant="outline" className="w-full text-xs font-bold">
              Editar Termos
            </Button>
          </Card>

          <Card className="p-5 border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">Privacidade e LGPD</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Consentimento de dados, política de cookies e proteção de dados cadastrais.
            </p>
            <Button variant="outline" className="w-full text-xs font-bold">
              Editar Política LGPD
            </Button>
          </Card>

          <Card className="p-5 border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">Regras de Meia-Entrada</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Documentações comprobatórias aceitas nas catracas de Curitiba e Paraná.
            </p>
            <Button variant="outline" className="w-full text-xs font-bold">
              Editar Regulamento
            </Button>
          </Card>
        </div>
      )}

      {/* Modal Novo Banner (WF-054) */}
      {showBannerModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div>
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                Vitrine Digital (WF-054)
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-0.5">Criar Novo Banner Promocional</h3>
            </div>

            <form onSubmit={handleCreateBanner} className="space-y-4">
              <Input
                label="Título de Destaque"
                placeholder="Ex: Feriado Imperial na Serra do Mar"
                value={bannerForm.title}
                onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                required
              />

              <Input
                label="Subtítulo / Descrição Rápida"
                placeholder="Ex: Garanta seus assentos na litorina de luxo..."
                value={bannerForm.subtitle}
                onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                required
              />

              <Input
                label="URL da Imagem de Fundo (HD)"
                value={bannerForm.imageUrl}
                onChange={(e) => setBannerForm({ ...bannerForm, imageUrl: e.target.value })}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Link de Destino"
                  placeholder="/atracoes/slug"
                  value={bannerForm.linkUrl}
                  onChange={(e) => setBannerForm({ ...bannerForm, linkUrl: e.target.value })}
                  required
                />
                <Input
                  label="Texto do Botão CTA"
                  placeholder="Ex: Comprar Agora"
                  value={bannerForm.ctaText}
                  onChange={(e) => setBannerForm({ ...bannerForm, ctaText: e.target.value })}
                  required
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <Button type="button" onClick={() => setShowBannerModal(false)} variant="outline" className="flex-1 font-bold text-xs">
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" className="flex-1 font-bold text-xs">
                  Salvar Banner
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
