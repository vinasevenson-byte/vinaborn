import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, ExternalLink, Star, MapPin, Eye, CheckCircle2, Ticket } from 'lucide-react';
import { Card, Badge, Input } from '../../components/ui/FormControls';
import { Button } from '../../components/ui/Button';

export const AttractionList = () => {
  const navigate = useNavigate();
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    summary: '',
    description: '',
    category: 'PARQUE',
    address: '',
    ticketStartingPrice: 0,
    coverImageUrl: 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=800&q=80',
    featured: true
  });

  const loadAttractions = () => {
    fetch('/api/attractions')
      .then(res => res.json())
      .then(data => {
        setAttractions(data);
        setLoading(false);
      })
      .catch(() => {
        setAttractions([
          {
            id: 1,
            name: "Jardim Botânico de Curitiba",
            category: "PARQUE",
            ticketStartingPrice: 0.00,
            active: true,
            googleRating: 4.9,
            coverImageUrl: "https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=300&q=80"
          },
          {
            id: 2,
            name: "Ópera de Arame e Vale da Música",
            category: "SHOW",
            ticketStartingPrice: 15.00,
            active: true,
            googleRating: 4.8,
            coverImageUrl: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=300&q=80"
          },
          {
            id: 3,
            name: "Museu Oscar Niemeyer (MON)",
            category: "MUSEU",
            ticketStartingPrice: 30.00,
            active: true,
            googleRating: 4.8,
            coverImageUrl: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=300&q=80"
          }
        ]);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadAttractions();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/attractions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } catch (err) {
      // Ignorar caso fallback
    }

    setAttractions(prev => [
      ...prev,
      { ...formData, id: Date.now(), active: true, googleRating: 5.0 }
    ]);
    setShowModal(false);
    setFormData({
      name: '',
      summary: '',
      description: '',
      category: 'PARQUE',
      address: '',
      ticketStartingPrice: 0,
      coverImageUrl: 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=800&q=80',
      featured: true
    });
  };

  const filtered = attractions.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Módulo de Atrações (WF-012)</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Gestão de Atrações</h2>
          <p className="text-xs text-slate-500 mt-0.5">Cadastre, edite lotes de ingressos e gerencie a vitrine turística.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => navigate('/backoffice/ingressos')} variant="outline" className="font-bold gap-2">
            <Ticket className="w-4 h-4 text-sky-600" />
            <span>Lotes & Cupons (WF-019)</span>
          </Button>

          <Button onClick={() => setShowModal(true)} variant="primary" className="font-bold gap-2">
            <Plus className="w-4 h-4" />
            <span>Cadastrar Nova Atração (WF-013)</span>
          </Button>
        </div>
      </div>

      {/* Tabela de Listagem */}
      <Card className="overflow-hidden border-slate-200">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Filtrar por nome da atração..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                <th className="py-3.5 px-6">Atração</th>
                <th className="py-3.5 px-6">Categoria</th>
                <th className="py-3.5 px-6">Preço Inicial</th>
                <th className="py-3.5 px-6">Avaliação Google</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 flex items-center gap-3 font-semibold text-slate-900">
                    <img
                      src={item.coverImageUrl}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <span>{item.name}</span>
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant="primary">{item.category}</Badge>
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-900">
                    {Number(item.ticketStartingPrice) > 0
                      ? `R$ ${Number(item.ticketStartingPrice).toFixed(2).replace('.', ',')}`
                      : 'Gratuito'}
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 font-bold text-slate-700">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      {item.googleRating || 4.8}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      Ativa
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button className="p-1.5 text-slate-400 hover:text-sky-600 rounded-md transition-colors" title="Editar">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors" title="Excluir">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal de Cadastro de Atração (WF-013) */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div>
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Formulário em Etapas (WF-013)</span>
              <h3 className="text-xl font-black text-slate-900 mt-0.5">Cadastrar Nova Atração</h3>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <Input
                label="Nome da Atração"
                placeholder="Ex: Bosque Alemão"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Categoria</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-sky-500 font-medium"
                >
                  <option value="PARQUE">Parques e Bosques</option>
                  <option value="SHOW">Shows e Teatros</option>
                  <option value="MUSEU">Museus e Arte</option>
                  <option value="PASSEIO">Passeios e Tours</option>
                  <option value="GASTRONOMIA">Gastronomia</option>
                </select>
              </div>

              <Input
                label="Resumo (para os cards da vitrine)"
                placeholder="Breve frase que resume o local..."
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                required
              />

              <Input
                label="Endereço Completo"
                placeholder="Rua, Número, Bairro, Curitiba - PR"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />

              <Input
                label="Preço Inicial do Ingresso (R$)"
                type="number"
                step="0.50"
                value={formData.ticketStartingPrice}
                onChange={(e) => setFormData({ ...formData, ticketStartingPrice: parseFloat(e.target.value) || 0 })}
                required
              />

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <Button type="button" onClick={() => setShowModal(false)} variant="outline" className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" className="flex-1 font-bold">
                  Salvar Atração
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
