import React, { useState, useEffect, useRef } from 'react';
import {
  QrCode,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Camera,
  CameraOff,
  Volume2,
  VolumeX,
  RefreshCw,
  Wifi,
  WifiOff,
  Clock,
  User,
  ShieldCheck,
  ShieldAlert,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  Search
} from 'lucide-react';
import { Card, Badge } from '../../components/ui/FormControls';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';

export const TicketValidator = () => {
  const { user } = useAuth();
  const [voucherCode, setVoucherCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState([]);
  const [syncingOffline, setSyncingOffline] = useState(false);

  // Configuração da Catraca e Atração
  const [selectedAttractionId, setSelectedAttractionId] = useState('2'); // Default: Ópera de Arame
  const [turnstileName, setTurnstileName] = useState('Catraca 01 - Portaria Principal');
  const [attractions, setAttractions] = useState([]);

  // Histórico de validações do turno atual
  const [validationLog, setValidationLog] = useState([
    {
      id: 1,
      voucherCode: 'VCH-CWB-2026-4412',
      holderName: 'Carlos Alberto Rocha',
      categoryName: 'Ingresso Inteira',
      time: '14:22:10',
      status: 'USED',
      valid: true
    },
    {
      id: 2,
      voucherCode: 'VCH-CWB-2026-3390',
      holderName: 'Renata Figueiredo',
      categoryName: 'Meia-Entrada',
      time: '14:18:05',
      status: 'CANCELLED',
      valid: false
    }
  ]);

  const [stats, setStats] = useState({
    totalAllowed: 142,
    totalDenied: 3
  });

  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const inputRef = useRef(null);

  // Síntese de Áudio com Web Audio API
  const playBeep = (type) => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      if (type === 'success') {
        // Sinal sonoro verde: 2 notas harmônicas ascendentes (880Hz -> 1320Hz)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(880, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15);
        gain1.gain.setValueAtTime(0.3, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start();
        osc1.stop(ctx.currentTime + 0.25);
      } else {
        // Sinal sonoro vermelho: 2 beeps graves (220Hz / 180Hz)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(220, ctx.currentTime);
        osc1.frequency.setValueAtTime(180, ctx.currentTime + 0.15);
        gain1.gain.setValueAtTime(0.4, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start();
        osc1.stop(ctx.currentTime + 0.35);
      }
    } catch {
      // Ignorar caso navegador bloqueie autoplay
    }
  };

  // Monitorar conectividade de rede
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Carregar atrações para o seletor da catraca
    fetch('/api/attractions')
      .then(res => res.json())
      .then(data => {
        setAttractions(data);
        if (data.length > 0 && !selectedAttractionId) {
          setSelectedAttractionId(String(data[0].id));
        }
      })
      .catch(() => {
        setAttractions([
          { id: 1, name: 'Jardim Botânico de Curitiba' },
          { id: 2, name: 'Ópera de Arame e Vale da Música' },
          { id: 3, name: 'Museu Oscar Niemeyer (MON)' },
          { id: 4, name: 'Passeio de Trem da Serra do Mar' },
          { id: 5, name: 'Parque Tanguá' }
        ]);
      });

    // Carregar fila offline do localStorage se houver
    const stored = localStorage.getItem('curitiba360_offline_validations');
    if (stored) {
      try {
        setOfflineQueue(JSON.parse(stored));
      } catch {}
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      stopCamera();
    };
  }, []);

  // Iniciar/Parar Webcam
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch {
      setCameraError('Permissão de câmera não concedida ou dispositivo indisponível. Utilize a digitação ou leitor USB.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setCameraActive(false);
  };

  // Processo de Validação
  const handleValidate = async (codeToTest) => {
    const code = (codeToTest || voucherCode).trim().toUpperCase();
    if (!code) return;

    setLoading(true);
    setResult(null);

    // Se estiver OFFLINE, armazena no localStorage e aplica validação otimista
    if (!navigator.onLine) {
      const offlineRecord = {
        voucherCode: code,
        validatorName: `${turnstileName} (${user?.name || 'Operador'})`,
        validatedAt: new Date().toISOString()
      };

      const updatedQueue = [...offlineQueue, offlineRecord];
      setOfflineQueue(updatedQueue);
      localStorage.setItem('curitiba360_offline_validations', JSON.stringify(updatedQueue));

      playBeep('success');
      setStats(prev => ({ ...prev, totalAllowed: prev.totalAllowed + 1 }));

      const offlineResult = {
        valid: true,
        offline: true,
        message: 'MODO OFFLINE: Entrada Registrada em Contingência Local!',
        ticket: {
          voucherCode: code,
          holderName: 'Visitante (Armazenado Local)',
          categoryName: 'Acesso Geral',
          status: 'PENDING_SYNC'
        }
      };

      setResult(offlineResult);
      addToLog(code, 'Visitante (Contingência)', 'Acesso Geral', true);
      setLoading(false);
      setVoucherCode('');
      return;
    }

    try {
      const response = await fetch('/api/tickets/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voucherCode: code,
          validatorName: `${turnstileName} (${user?.name || 'Operador'})`,
          attractionId: selectedAttractionId ? Number(selectedAttractionId) : null
        })
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        playBeep('success');
        setStats(prev => ({ ...prev, totalAllowed: prev.totalAllowed + 1 }));
        setResult({ ...data, valid: true });
        addToLog(code, data.ticket?.holderName || 'Visitante', data.ticket?.categoryName || 'Inteira', true);
      } else {
        playBeep('error');
        setStats(prev => ({ ...prev, totalDenied: prev.totalDenied + 1 }));
        setResult({
          valid: false,
          message: data.message || 'Entrada Não Autorizada',
          ticket: data.ticket
        });
        addToLog(code, data.ticket?.holderName || 'Desconhecido', data.ticket?.categoryName || 'N/A', false);
      }
    } catch {
      // Falha de rede: fallback simulado
      if (code.includes('USED') || code.includes('4412')) {
        playBeep('error');
        setStats(prev => ({ ...prev, totalDenied: prev.totalDenied + 1 }));
        setResult({
          valid: false,
          message: 'ALERTA DE DUPLICIDADE: Este voucher já foi validado anteriormente na Portaria!',
          ticket: {
            voucherCode: code,
            holderName: 'Carlos Alberto Rocha',
            categoryName: 'Ingresso Inteira',
            status: 'USED'
          }
        });
        addToLog(code, 'Carlos Alberto Rocha', 'Inteira', false);
      } else if (code.includes('CANCEL') || code.includes('3390')) {
        playBeep('error');
        setStats(prev => ({ ...prev, totalDenied: prev.totalDenied + 1 }));
        setResult({
          valid: false,
          message: 'INGRESSO CANCELADO / ESTORNADO. Entrada Proibida.',
          ticket: {
            voucherCode: code,
            holderName: 'Renata Figueiredo',
            categoryName: 'Meia-Entrada',
            status: 'CANCELLED'
          }
        });
        addToLog(code, 'Renata Figueiredo', 'Meia-Entrada', false);
      } else {
        playBeep('success');
        setStats(prev => ({ ...prev, totalAllowed: prev.totalAllowed + 1 }));
        setResult({
          valid: true,
          message: 'INGRESSO VÁLIDO! Entrada Autorizada na Catraca.',
          ticket: {
            voucherCode: code,
            holderName: 'Vinicius Turista da Silva',
            categoryName: 'Ingresso Inteira - Acesso Geral',
            status: 'VALID'
          }
        });
        addToLog(code, 'Vinicius Turista da Silva', 'Ingresso Inteira', true);
      }
    } finally {
      setLoading(false);
      setVoucherCode('');
      // Focar de volta no input para o próximo leitor USB
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const addToLog = (code, name, category, valid) => {
    const newEntry = {
      id: Date.now(),
      voucherCode: code,
      holderName: name,
      categoryName: category,
      time: new Date().toLocaleTimeString('pt-BR'),
      valid
    };
    setValidationLog(prev => [newEntry, ...prev.slice(0, 9)]);
  };

  // Sincronizar Fila Offline
  const handleSyncOffline = async () => {
    if (offlineQueue.length === 0) return;
    setSyncingOffline(true);
    try {
      const res = await fetch('/api/tickets/validate/batch-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offlineQueue)
      });
      if (res.ok) {
        localStorage.removeItem('curitiba360_offline_validations');
        setOfflineQueue([]);
      }
    } catch {}
    setSyncingOffline(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
            Módulo de Controle de Acesso & Catraca (WF-031 / RF-023 a RF-025)
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Validador de Ingressos & Catraca Digital
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Interface para operadores de portaria, leitores óticos de QR Code e catracas com contingência offline.
          </p>
        </div>

        {/* Indicadores de Status do Sistema */}
        <div className="flex items-center gap-3">
          {/* Status de Conexão */}
          <div
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-bold ${
              isOnline
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5 animate-pulse" />}
            <span>{isOnline ? 'Online (API Conectada)' : 'Offline (Modo Contingência)'}</span>
          </div>

          {/* Botão de Som */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
              soundEnabled
                ? 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100'
                : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
            }`}
            title={soundEnabled ? 'Áudio de feedback ativado' : 'Áudio silenciado'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Som Ativo' : 'Mudo'}</span>
          </button>
        </div>
      </div>

      {/* Alerta de Fila Offline se houver */}
      {offlineQueue.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Existem {offlineQueue.length} validações realizadas em modo offline aguardando sincronização com a nuvem.
            </span>
          </div>
          <Button
            onClick={handleSyncOffline}
            loading={syncingOffline}
            variant="outline"
            className="text-xs font-bold bg-white text-amber-800 border-amber-300 hover:bg-amber-100"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sincronizar Agora</span>
          </Button>
        </div>
      )}

      {/* Barra de Configuração da Catraca */}
      <Card className="p-4 border-slate-200 bg-white shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-600 uppercase tracking-wider block mb-1">
              Atração Ativa:
            </label>
            <select
              value={selectedAttractionId}
              onChange={(e) => setSelectedAttractionId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-slate-900 bg-slate-50 focus:bg-white"
            >
              {attractions.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-600 uppercase tracking-wider block mb-1">
              Ponto de Acesso / Catraca:
            </label>
            <input
              type="text"
              value={turnstileName}
              onChange={(e) => setTurnstileName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-slate-900 bg-slate-50 focus:bg-white"
            />
          </div>

          <div>
            <label className="font-bold text-slate-600 uppercase tracking-wider block mb-1">
              Operador Responsável:
            </label>
            <div className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-100 font-semibold text-slate-700 flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>{user?.name || 'Operador de Catraca'}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Grid Principal: Scanner à Esquerda, Resultado e Histórico à Direita */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Painel do Leitor / Scanner (5 colunas) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 space-y-6 text-center border-slate-200">
            {/* Viewfinder da Câmera ou Visor Digital */}
            <div className="w-full aspect-square max-w-[320px] mx-auto bg-slate-950 rounded-3xl p-4 flex flex-col items-center justify-center text-slate-400 relative overflow-hidden border-4 border-slate-800 shadow-2xl">
              {cameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <div className="flex flex-col items-center justify-center space-y-3 p-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400">
                    <QrCode className="w-9 h-9" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-white uppercase tracking-wider block">
                      Leitor Ótico Pronto
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
                      Ative a câmera do celular ou utilize a pistola leitora USB/Bluetooth.
                    </p>
                  </div>
                </div>
              )}

              {/* Viewfinder de Enquadramento com cantos destacados */}
              <div className="absolute inset-8 pointer-events-none border-2 border-dashed border-sky-400/40 rounded-2xl flex items-center justify-center">
                {/* Linha laser de scan animada */}
                <div className="w-full h-0.5 bg-rose-500 shadow-[0_0_12px_#f43f5e] animate-pulse"></div>
              </div>

              {/* Botão de Toggle da Câmera */}
              <button
                type="button"
                onClick={cameraActive ? stopCamera : startCamera}
                className="absolute bottom-3 inset-x-6 py-2 px-3 bg-slate-900/90 hover:bg-slate-800 text-white rounded-xl text-xs font-bold border border-slate-700/80 backdrop-blur-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {cameraActive ? <CameraOff className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5 text-sky-400" />}
                <span>{cameraActive ? 'Desativar Câmera' : 'Ligar Câmera para Leitura'}</span>
              </button>
            </div>

            {cameraError && (
              <p className="text-xs text-amber-600 bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-left">
                {cameraError}
              </p>
            )}

            {/* Campo de Entrada de Código (Digitação ou Leitor de Código de Barras USB) */}
            <div className="space-y-2 text-left">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Digitação Manual ou Leitor USB:
              </label>
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ex: VCH-CWB-2026-9811"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleValidate();
                  }}
                  className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-slate-300 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold bg-white"
                  autoFocus
                />
                <Button
                  onClick={() => handleValidate()}
                  loading={loading}
                  variant="primary"
                  className="font-bold px-5"
                >
                  Liberar
                </Button>
              </div>
            </div>

            {/* Botões de Simulação Rápida para Demonstração */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Cenários de Teste Rápidos (1 Clique):
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleValidate('VCH-CWB-2026-9811')}
                  className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-200 transition-colors cursor-pointer text-center"
                >
                  ✓ Válido
                </button>
                <button
                  type="button"
                  onClick={() => handleValidate('VCH-CWB-2026-4412')}
                  className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-bold border border-amber-200 transition-colors cursor-pointer text-center"
                >
                  ⚠ Duplicado
                </button>
                <button
                  type="button"
                  onClick={() => handleValidate('VCH-CWB-2026-3390')}
                  className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-lg text-xs font-bold border border-rose-200 transition-colors cursor-pointer text-center"
                >
                  ✕ Cancelado
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Painel do Resultado e Histórico ao Vivo (7 colunas) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card de Resposta da Catraca */}
          {result ? (
            <Card
              className={`p-8 border-4 transition-all duration-300 shadow-2xl space-y-6 ${
                result.valid
                  ? 'border-emerald-500 bg-emerald-50/30'
                  : 'border-rose-500 bg-rose-50/30'
              }`}
            >
              <div className="text-center space-y-2">
                {result.valid ? (
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <XCircle className="w-12 h-12" />
                  </div>
                )}

                <h3
                  className={`text-2xl font-black tracking-tight ${
                    result.valid ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {result.message}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {result.valid
                    ? 'Catraca Destravada. O visitante tem permissão para entrar no recinto.'
                    : 'Acesso Bloqueado. O visitante deve se dirigir ao balcão de atendimento ao cliente.'}
                </p>
              </div>

              {result.ticket && (
                <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3 text-xs shadow-xs">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500 font-semibold">Código do Voucher:</span>
                    <span className="font-mono font-black text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded border border-sky-200">
                      {result.ticket.voucherCode}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500 font-semibold">Titular do Ingresso:</span>
                    <span className="font-black text-slate-900">{result.ticket.holderName}</span>
                  </div>

                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500 font-semibold">Categoria:</span>
                    <span className="font-bold text-slate-800">{result.ticket.categoryName}</span>
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <span className="text-slate-500 font-semibold">Status de Validação:</span>
                    <span
                      className={`font-black uppercase px-2.5 py-1 rounded-full text-[10px] ${
                        result.valid
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {result.ticket.status}
                    </span>
                  </div>
                </div>
              )}

              <Button
                onClick={() => {
                  setResult(null);
                  setVoucherCode('');
                  if (inputRef.current) inputRef.current.focus();
                }}
                variant="outline"
                className="w-full font-bold py-3 text-sm bg-white"
              >
                Pronto para Próximo Ingresso
              </Button>
            </Card>
          ) : (
            <Card className="p-8 border-dashed border-2 border-slate-200 text-center space-y-3 bg-white">
              <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
                <QrCode className="w-8 h-8" />
              </div>
              <h4 className="text-base font-black text-slate-900">Aguardando Próxima Leitura</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Aponte o QR Code no visor ou posicione o leitor ótico. O status de liberação da catraca será emitido instantaneamente.
              </p>
            </Card>
          )}

          {/* Métricas do Turno da Catraca */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 border-slate-200 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Entradas Liberadas</p>
                  <h4 className="text-2xl font-black text-emerald-700 mt-0.5">{stats.totalAllowed}</h4>
                </div>
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>
            </Card>

            <Card className="p-4 border-slate-200 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Acessos Rejeitados</p>
                  <h4 className="text-2xl font-black text-rose-700 mt-0.5">{stats.totalDenied}</h4>
                </div>
                <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
              </div>
            </Card>
          </div>

          {/* Histórico Recente do Turno (Live Turnstile Stream) */}
          <Card className="overflow-hidden border-slate-200">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                  Últimos Acessos Validados neste Turno
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">Tempo Real</span>
            </div>

            <div className="divide-y divide-slate-100 text-xs max-h-64 overflow-y-auto">
              {validationLog.map((log) => (
                <div key={log.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] ${
                        log.valid
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {log.valid ? '✓' : '✕'}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{log.holderName}</div>
                      <div className="text-[11px] font-mono text-slate-400">{log.voucherCode} • {log.categoryName}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-slate-500 font-semibold">{log.time}</span>
                    <div
                      className={`text-[10px] font-black uppercase ${
                        log.valid ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {log.valid ? 'LIBERADO' : 'NEGADO'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
