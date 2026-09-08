import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input, Card } from '../../components/ui/FormControls';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.user.role === 'ADMIN' || res.user.role === 'PARTNER') {
        navigate('/backoffice');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'E-mail ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (quickEmail, quickPassword) => {
    setEmail(quickEmail);
    setPassword(quickPassword);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-emerald-500 flex items-center justify-center text-white font-bold text-xl mx-auto shadow-md">
            360
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Acesse sua Conta</h2>
          <p className="text-xs text-slate-500">Curitiba 360 • Portal do Turista e Acesso ao Backoffice</p>
        </div>

        <Card className="p-8 shadow-xl border border-slate-200 space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="E-mail"
              type="email"
              placeholder="seu.email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Senha de Acesso"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex justify-between items-center text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input type="checkbox" className="rounded text-sky-600 focus:ring-sky-500" />
                <span>Lembrar de mim</span>
              </label>
              <a href="#" className="text-sky-600 hover:underline font-semibold">Esqueceu a senha?</a>
            </div>

            <Button type="submit" size="lg" loading={loading} className="w-full font-bold">
              Entrar no Sistema
            </Button>
          </form>

          {/* Atalhos Rápidos para Testar Qualquer Perfil */}
          <div className="pt-6 border-t border-slate-100 space-y-3">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
              Preenchimento Rápido para Demonstração:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@curitiba360.com.br', 'admin123')}
                className="p-2 bg-slate-100 hover:bg-sky-50 hover:text-sky-700 rounded-lg font-semibold text-slate-700 transition-colors cursor-pointer text-center"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('parceiro@curitiba360.com.br', 'parceiro123')}
                className="p-2 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg font-semibold text-slate-700 transition-colors cursor-pointer text-center"
              >
                Parceiro
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('turista@curitiba360.com.br', 'turista123')}
                className="p-2 bg-slate-100 hover:bg-amber-50 hover:text-amber-700 rounded-lg font-semibold text-slate-700 transition-colors cursor-pointer text-center"
              >
                Turista
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
