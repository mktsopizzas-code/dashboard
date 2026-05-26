# Architecture.md — Constituição Técnica do TrafficOps

> Leia este arquivo antes de escrever qualquer código.
> Estas regras são inegociáveis e se aplicam a todos os arquivos do projeto.

---

## 1. Princípio Central: Thin Client / Fat Server

**O front-end é absolutamente burro. Ele só faz duas coisas:**
1. Renderizar dados que recebeu
2. Capturar intenções do usuário (cliques) e repassar

**Nunca no front-end:**
- Lógica de negócio complexa
- Tokens de API (Meta, Google, qualquer serviço)
- Chaves de acesso, senhas de banco, secrets
- Validações de segurança críticas
- Decisões de autorização

**Sempre no back-end (quando existir):**
- Chamadas para Meta Ads API
- Chamadas para Google Ads API
- Validação de tokens
- Regras de acesso por usuário

**Estado atual:** projeto roda só com dados mock (sem backend).
Quando o backend for adicionado, toda lógica de API fica em `/api` (Node.js separado).

---

## 2. Separação de Responsabilidades

```
src/data.js      → dados estáticos / mock. Nenhuma lógica aqui.
src/utils.js     → TODA lógica de cálculo. Funções puras, sem side effects.
src/styles.js    → TODO CSS como string exportada. Nenhum arquivo .css separado.
src/pages/*.jsx  → só renderização. Importam de utils.js, nunca calculam direto.
src/App.jsx      → shell, sidebar, roteamento entre páginas. Nada mais.
src/Login.jsx    → formulário de login. Credenciais hardcoded (uso interno).
```

**Regra de ouro:** se você está escrevendo um cálculo dentro de um componente JSX, está errado. Mova para utils.js.

---

## 3. Arquitetura por Comportamento (Isolamento)

Pastas são organizadas por comportamento do usuário, não por tipo de arquivo.

```
src/pages/Overview.jsx    → comportamento: visualizar resumo geral
src/pages/Groups.jsx      → comportamento: comparar categorias
src/pages/Creatives.jsx   → comportamento: avaliar criativos
src/pages/Budget.jsx      → comportamento: monitorar verba
src/pages/Extras.jsx      → comportamento: analisar detalhes
src/pages/Funnel.jsx      → comportamento: analisar funil de conversão
```

**Benefício:** se há um bug no funil, você analisa APENAS Funnel.jsx.
O resto do sistema permanece intocado.

**Regra:** cada página é um componente isolado. Não compartilha estado com outras páginas. Recebe `accounts` como prop vinda do App.jsx.

---

## 4. Fluxo de Dados (Unidirecional)

```
data.js → App.jsx → página ativa → utils.js → render
```

- `data.js` exporta constantes (ACCOUNTS, CREATIVES, HOURLY, UTM_DATA)
- `App.jsx` importa dados e passa como props para a página ativa
- Cada página importa funções de `utils.js` para calcular
- Resultado renderizado no JSX

**Nunca:** página A modificando dados que página B lê.
**Nunca:** estado global compartilhado entre páginas.

---

## 5. Regras de Segurança (para quando tiver backend)

```
✗ ERRADO:  fetch('https://graph.facebook.com?access_token=EAABsb...')  // no front
✓ CORRETO: fetch('/api/meta/account123')  // chama seu backend, que tem o token
```

```
✗ ERRADO:  const API_KEY = 'sk-12345'  // em qualquer arquivo .jsx ou .js do src/
✓ CORRETO: process.env.META_TOKEN       // em arquivo .env, nunca commitado
```

O arquivo `.env` NUNCA vai para o GitHub. Está no `.gitignore`.

---

## 6. Convenções de Código

**Nomenclatura:**
- Componentes: PascalCase (`Overview`, `KpiCard`, `PacingBar`)
- Funções utilitárias: camelCase (`calc`, `fmtBRL`, `fmtN`)
- Constantes de dados: SCREAMING_SNAKE_CASE (`ACCOUNTS`, `CREATIVES`)
- Props: camelCase (`accounts`, `onLogin`, `spent`)

**Componentes:**
- Funções, não classes
- Props desestruturadas no parâmetro: `function Card({ title, value })`
- Sem defaultProps — use valores padrão no desestruturamento

**Importações — ordem obrigatória:**
```js
// 1. React
import { useState } from 'react'
// 2. Dados
import { ACCOUNTS } from '../data.js'
// 3. Utils
import { calc, fmtBRL } from '../utils.js'
// 4. Componentes filhos (se houver)
```

---

## 7. CSS — Regras

- Todo CSS é uma string exportada de `src/styles.js`
- Injetada via `<style>{STYLES}</style>` no App.jsx
- Classes são globais e descritivas: `.kpi-card`, `.acc-metric`, `.pacing-track`
- Sem CSS Modules, sem styled-components, sem Tailwind
- Sem `!important`
- Breakpoints: não há — dashboard é desktop only

---

## 8. O Que Este Arquivo É

Este arquivo é a **constituição do projeto**.
Antes de criar ou modificar qualquer arquivo, releia as seções relevantes.
Em caso de dúvida entre duas abordagens, escolha a que mantém:
1. Lógica fora dos componentes
2. Páginas isoladas
3. Dados sensíveis fora do front-end
