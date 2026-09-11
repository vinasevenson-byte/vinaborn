import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '../ui/Button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary capturou erro:', error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    if (this.props.children !== prevProps.children && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 max-w-xl mx-auto my-12 bg-white rounded-3xl border border-rose-200 shadow-xl text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">Ops! Algo inesperado aconteceu</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Ocorreu uma instabilidade temporária ao carregar esta seção. Você pode tentar recarregar os dados ou retornar à tela inicial.
            </p>
          </div>
          {this.state.error && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-left font-mono text-[11px] text-rose-700 overflow-x-auto max-h-24">
              {this.state.error.message || String(this.state.error)}
            </div>
          )}
          <div className="flex gap-3 justify-center pt-2">
            <Button onClick={this.handleReset} variant="primary" className="font-bold text-xs gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Tentar Novamente</span>
            </Button>
            <Button onClick={() => window.location.href = '/'} variant="outline" className="font-bold text-xs gap-1.5">
              <Home className="w-3.5 h-3.5" />
              <span>Página Inicial</span>
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
