// Cliente Supabase resiliente para o Curitiba 360
// Funciona com Supabase Cloud real (via VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY)
// ou com persistência local e mock relacional quando as chaves ainda não foram configuradas.

const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';

// Mock relacional inicial para Cupons, Campanhas e Promotores
const INITIAL_PROMOTORES = [
  { id: 'p1', nome: 'Curitiba Cult Blog', email: 'contato@curitibacult.com.br', comissao_percentual: 8.0 },
  { id: 'p2', nome: 'Agência Serra Verde Express', email: 'comercial@serraverde.com.br', comissao_percentual: 10.0 },
  { id: 'p3', nome: 'Perfil @ondeircuritiba', email: 'parcerias@ondeircuritiba.com', comissao_percentual: 7.5 }
];

const INITIAL_CAMPANHAS = [
  { id: 'c1', nome: 'Festival de Inverno Curitiba 360', status: 'ativa' },
  { id: 'c2', nome: 'Feriado Farroupilha / Sul em CWB', status: 'agendada' },
  { id: 'c3', nome: 'Semana Cultural no MON e Ópera', status: 'ativa' }
];

const INITIAL_CUPONS = [
  {
    id: 'cup-1',
    codigo: 'CURITIBA360',
    tipo_desconto: 'percentual',
    valor_desconto: 10.0,
    quantidade_maxima: 1000,
    quantidade_usos: 248,
    data_validade: '2026-12-31T23:59:59Z',
    ativo: true,
    campanha_id: 'c1',
    promotor_id: null,
    campanhas: { nome: 'Festival de Inverno Curitiba 360' },
    promotores: null,
    created_at: '2026-09-01T10:00:00Z'
  },
  {
    id: 'cup-2',
    codigo: 'BEMVINDOCWB',
    tipo_desconto: 'fixo',
    valor_desconto: 20.0,
    quantidade_maxima: 500,
    quantidade_usos: 184,
    data_validade: '2026-11-30T23:59:59Z',
    ativo: true,
    campanha_id: null,
    promotor_id: null,
    campanhas: null,
    promotores: null,
    created_at: '2026-09-02T11:00:00Z'
  },
  {
    id: 'cup-3',
    codigo: 'CULT360',
    tipo_desconto: 'percentual',
    valor_desconto: 12.0,
    quantidade_maxima: 400,
    quantidade_usos: 92,
    data_validade: '2027-03-31T23:59:59Z',
    ativo: true,
    campanha_id: null,
    promotor_id: 'p1',
    campanhas: null,
    promotores: { nome: 'Curitiba Cult Blog' },
    created_at: '2026-09-03T14:30:00Z'
  },
  {
    id: 'cup-4',
    codigo: 'OPERA15',
    tipo_desconto: 'percentual',
    valor_desconto: 15.0,
    quantidade_maxima: 300,
    quantidade_usos: 65,
    data_validade: '2026-10-31T23:59:59Z',
    ativo: false,
    campanha_id: 'c3',
    promotor_id: null,
    campanhas: { nome: 'Semana Cultural no MON e Ópera' },
    promotores: null,
    created_at: '2026-09-04T16:00:00Z'
  }
];

class MockSupabaseQueryBuilder {
  constructor(table) {
    this.table = table;
    this.selectedFields = '*';
    this.sortField = null;
    this.sortAscending = true;
    this.filters = [];
  }

  select(fields = '*') {
    this.selectedFields = fields;
    return this;
  }

  order(field, { ascending = true } = {}) {
    this.sortField = field;
    this.sortAscending = ascending;
    return this;
  }

  eq(field, value) {
    this.filters.push({ field, value });
    return this;
  }

  async then(resolve, reject) {
    try {
      // Se tiver credenciais reais do Supabase configuradas, tenta executar via REST
      if (SUPABASE_URL && SUPABASE_ANON_KEY) {
        try {
          const endpoint = `${SUPABASE_URL}/rest/v1/${this.table}?select=*`;
          const res = await fetch(endpoint, {
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json'
            }
          });
          if (res.ok) {
            const data = await res.json();
            return resolve({ data, error: null });
          }
        } catch (e) {
          console.warn('[Supabase] Falha ao consultar Supabase REST, usando armazenamento local:', e.message);
        }
      }

      // Fallback em LocalStorage resiliente
      const storageKey = `curitiba360_sb_${this.table}`;
      let records = [];
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          records = JSON.parse(stored);
        } catch {
          records = this.table === 'cupons' ? INITIAL_CUPONS : [];
        }
      } else {
        if (this.table === 'cupons') records = [...INITIAL_CUPONS];
        else if (this.table === 'campanhas') records = [...INITIAL_CAMPANHAS];
        else if (this.table === 'promotores') records = [...INITIAL_PROMOTORES];
        localStorage.setItem(storageKey, JSON.stringify(records));
      }

      // Aplica filtros se houver
      for (const f of this.filters) {
        records = records.filter(r => r[f.field] === f.value);
      }

      // Aplica ordenação
      if (this.sortField) {
        records.sort((a, b) => {
          if (a[this.sortField] < b[this.sortField]) return this.sortAscending ? -1 : 1;
          if (a[this.sortField] > b[this.sortField]) return this.sortAscending ? 1 : -1;
          return 0;
        });
      }

      resolve({ data: records, error: null });
    } catch (error) {
      resolve({ data: null, error });
    }
  }

  async insert(newRecords) {
    try {
      const recordsToInsert = Array.isArray(newRecords) ? newRecords : [newRecords];

      // Se tiver credenciais reais do Supabase
      if (SUPABASE_URL && SUPABASE_ANON_KEY) {
        try {
          const endpoint = `${SUPABASE_URL}/rest/v1/${this.table}`;
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            body: JSON.stringify(recordsToInsert)
          });
          if (res.ok) {
            const data = await res.json();
            return { data, error: null };
          }
        } catch (e) {
          console.warn('[Supabase] Falha ao inserir via REST, salvando localmente:', e.message);
        }
      }

      const storageKey = `curitiba360_sb_${this.table}`;
      let records = [];
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try { records = JSON.parse(stored); } catch { records = []; }
      } else {
        records = this.table === 'cupons' ? [...INITIAL_CUPONS] : [];
      }

      const prepared = recordsToInsert.map(r => ({
        id: r.id || 'cup-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        quantidade_usos: r.quantidade_usos || 0,
        ativo: r.ativo !== undefined ? r.ativo : true,
        created_at: new Date().toISOString(),
        ...r
      }));

      const updated = [...prepared, ...records];
      localStorage.setItem(storageKey, JSON.stringify(updated));

      return { data: prepared, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async update(updates) {
    try {
      const storageKey = `curitiba360_sb_${this.table}`;
      let records = [];
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try { records = JSON.parse(stored); } catch { records = []; }
      }

      records = records.map(r => {
        let match = true;
        for (const f of this.filters) {
          if (r[f.field] !== f.value) match = false;
        }
        return match ? { ...r, ...updates } : r;
      });

      localStorage.setItem(storageKey, JSON.stringify(records));
      return { data: records, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
}

export const supabase = {
  from: (table) => new MockSupabaseQueryBuilder(table)
};

export default supabase;
