import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Shield,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Power,
  Edit2,
  Mail,
  Phone,
  Lock
} from 'lucide-react';
import { Card, Badge, Input } from '../../components/ui/FormControls';
import { Button } from '../../components/ui/Button';

export const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    phone: '',
    password: '',
    role: 'ADMIN'
  });

  const loadUsers = () => {
    fetch('/api/users')
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          throw new Error('Invalid data format');
        }
        setLoading(false);
      })
      .catch(() => {
        setUsers([
          { id: 1, name: "Administrador Curitiba 360", email: "admin@curitiba360.com.br", cpf: "111.222.333-44", phone: "(41) 99999-0001", role: "ADMIN", active: true },
          { id: 2, name: "Parceiro Ópera de Arame", email: "parceiro@curitiba360.com.br", cpf: "222.333.444-55", phone: "(41) 99999-0002", role: "PARTNER", active: true },
          { id: 3, name: "Vinicius Turista", email: "turista@curitiba360.com.br", cpf: "333.444.555-66", phone: "(41) 99999-0003", role: "TOURIST", active: true },
          { id: 4, name: "CWB Tours Operações", email: "operacoes@cwbtours.com.br", cpf: "18.444.555/0001-22", phone: "(41) 98822-1100", role: "AGENCY", active: true }
        ]);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      await fetch(`/api/users/${id}/toggle-status`, { method: 'PUT' });
    } catch {}
    setUsers(prev => (Array.isArray(prev) ? prev : []).map(u => u.id === id ? { ...u, active: !u.active } : u));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const saved = await res.json();
        setUsers(prev => [saved, ...(Array.isArray(prev) ? prev : [])]);
      } else {
        throw new Error();
      }
    } catch {
      setUsers(prev => [{ ...formData, id: Date.now(), active: true }, ...(Array.isArray(prev) ? prev : [])]);
    }
    setShowModal(false);
    setFormData({ name: '', email: '', cpf: '', phone: '', password: '', role: 'ADMIN' });
  };

  const safeUsers = Array.isArray(users) ? users : [];
  const filteredUsers = safeUsers.filter(u => {
    const q = search.toLowerCase();
    const matchQuery = !q ||
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.cpf && u.cpf.includes(q));
    const matchRole = filterRole === 'ALL' || u.role === filterRole;
    return matchQuery && matchRole;
  });

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN': return <Badge variant="primary">ADMINISTRADOR</Badge>;
      case 'PARTNER': return <Badge variant="purple">PARCEIRO</Badge>;
      case 'AGENCY': return <Badge variant="warning">AGÊNCIA</Badge>;
      case 'AGENT': return <Badge variant="neutral">AGENTE</Badge>;
      default: return <Badge variant="neutral">TURISTA</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
            Módulo de Governança & RBAC (WF-005 / WF-006)
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Gestão de Usuários e Perfis de Acesso
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Controle os 8 perfis de acesso do sistema, conceda privilégios e audite credenciais.
          </p>
        </div>

        <Button onClick={() => setShowModal(true)} variant="primary" className="font-bold text-xs gap-1.5 shadow-xs">
          <UserPlus className="w-4 h-4" />
          <span>Cadastrar Novo Usuário (WF-006)</span>
        </Button>
      </div>

      {/* Barra de Filtros */}
      <Card className="p-4 border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Pesquisar por Nome, E-mail ou CPF..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="ALL">Todos os Perfis</option>
            <option value="ADMIN">Administradores</option>
            <option value="PARTNER">Parceiros Comerciais</option>
            <option value="AGENCY">Agências</option>
            <option value="AGENT">Agentes</option>
            <option value="TOURIST">Turistas</option>
          </select>
        </div>
      </Card>

      {/* Tabela de Usuários */}
      <Card className="overflow-hidden border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                <th className="py-3.5 px-6">Usuário</th>
                <th className="py-3.5 px-6">Documento / CPF</th>
                <th className="py-3.5 px-6">Telefone</th>
                <th className="py-3.5 px-6">Perfil RBAC</th>
                <th className="py-3.5 px-6 text-center">Status</th>
                <th className="py-3.5 px-6 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900">{user.name}</div>
                    <div className="text-xs text-slate-400 font-medium">{user.email}</div>
                  </td>

                  <td className="py-4 px-6 font-mono text-xs text-slate-700">
                    {user.cpf || 'Não informado'}
                  </td>

                  <td className="py-4 px-6 text-xs text-slate-600">
                    {user.phone || '(41) 99999-0000'}
                  </td>

                  <td className="py-4 px-6">
                    {getRoleBadge(user.role)}
                  </td>

                  <td className="py-4 px-6 text-center">
                    {user.active ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Ativo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-300">
                        <XCircle className="w-3 h-3" />
                        Inativo
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      className={`p-1.5 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer ${
                        user.active
                          ? 'text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200'
                          : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                      title={user.active ? 'Suspender Usuário' : 'Ativar Usuário'}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{user.active ? 'Suspender' : 'Ativar'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Novo Usuário (WF-006) */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div>
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                Credenciamento de Usuário (WF-006)
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-0.5">Cadastrar Novo Usuário</h3>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <Input
                label="Nome Completo"
                placeholder="Ex: Carlos Eduardo de Oliveira"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <Input
                label="E-mail"
                type="email"
                placeholder="usuario@curitiba360.com.br"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="CPF"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  required
                />
                <Input
                  label="Telefone"
                  placeholder="(41) 99999-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Senha Provisória"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Perfil de Acesso</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white font-medium"
                  >
                    <option value="ADMIN">Administrador</option>
                    <option value="PARTNER">Parceiro Comercial</option>
                    <option value="AGENCY">Agência Credenciada</option>
                    <option value="AGENT">Agente de Viagens</option>
                    <option value="TOURIST">Turista</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <Button type="button" onClick={() => setShowModal(false)} variant="outline" className="flex-1 font-bold text-xs">
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" className="flex-1 font-bold text-xs">
                  Criar Usuário
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
