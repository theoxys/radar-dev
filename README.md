<h1 align="center">Radar Dev — Compartilhe cargos, empresas e salários</h1>

<img width="2978" height="1656" alt="image" src="https://github.com/user-attachments/assets/30892ab6-32d4-4983-951b-2e0ba54547b8" />


### Objetivo

Radar Dev é um projeto da comunidade para que devs brasileiros que trabalham para o exterior compartilhem, de forma anônima, seus cargos, empresas e remunerações. A ideia é dar mais transparência, ajudar todo mundo a evoluir, e focar esforços em empresas que valorizam o desenvolvedor brasileiro.

### Tech stack

- React 19 + Vite 6 + TypeScript
- Tailwind CSS 4
- Radix UI (componentes acessíveis) + componentes utilitários
- TanStack Query (data fetching/cache)
- Supabase (Postgres como banco de dados)
- Framer Motion (animações sutis)

Estrutura principal do frontend (resumo):
- `src/components/`: componentes de UI e telas (lista, formulário, filtros, etc.)
- `src/hooks/`: hooks de dados (ex.: `useSubmissionts.ts` para Submissions/Technologies)
- `src/lib/supabase.ts`: cliente do Supabase
- `src/types/`: tipos TypeScript compartilhados

### Configuração do ambiente

Pré-requisitos:
- Node.js 20 (recomendado usar `nvm use 20`)
- pnpm

Variáveis de ambiente (crie um arquivo `.env.local` na raiz):

```
VITE_SUPABASE_URL=SuaURLDoSupabase
VITE_SUPABASE_ANON_KEY=SuaAnonKeyDoSupabase
```

Banco de dados (Supabase):
- Crie um projeto no Supabase
- Configure as tabelas abaixo (exemplo de schema simplificado):

```
-- Exemplo: adapte conforme necessário
create table public.technologies (
  id bigserial primary key,
  created_at timestamptz default now() not null,
  name text default ''
);

create table public.submissions (
  id bigserial primary key,
  created_at timestamptz default now() not null,
  company_name text not null default '',
  company_link text default '',
  position text default '',
  salary_in_cents int2 default 0,
  comments text default '',
  benefits text default ''
);

create table public.submission_technologies (
  id bigserial primary key,
  created_at timestamptz default now() not null,
  technology_id bigint references public.technologies(id),
  submission_id bigint references public.submissions(id)
);
```

Observação: a aplicação usa snake_case no banco (ex.: `company_name`, `salary_in_cents`) e converte para camelCase nos tipos quando necessário.

### Rodando localmente

1) Instale as dependências
```
nvm use 20
pnpm install
```

2) Configure as variáveis em `.env.local`
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

3) Rode o projeto em modo desenvolvimento
```
pnpm dev
```

4) Build e preview (opcional)
```
pnpm build
pnpm preview
```

### Como contribuir

Quer ajudar? Toda contribuição é bem-vinda!

- Abra uma issue descrevendo a ideia/bug, se necessário
- Faça um fork do repositório
- Crie uma branch descritiva: `feat/minha-feature` ou `fix/meu-fix`
- Faça commits claros (convencional é um plus)
- Garanta que o app inicia (`pnpm dev`) e que os fluxos principais funcionam
- Abra um Pull Request explicando o que foi feito e por quê

Diretrizes gerais:
- Use Node 20
- Mantenha os nomes e tipos consistentes (snake_case no banco; camelCase no app)
- Priorize acessibilidade (componentes Radix) e UX clara
- Código legível e autoexplicativo (tipos fortes, nomes descritivos)

### Ideias e roadmap (aberto)

- Paginação/infinitescroll aprimorada na lista de submissões
- Filtros avançados e combinações (por empresa/cargo/stack)
- Export/insights agregados por tecnologias e empresas

Se algo não estiver claro, abra uma issue — vamos evoluir juntos. 💚


