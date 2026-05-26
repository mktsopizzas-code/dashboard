# TrafficOps — Especificação Mestre (SPEC)

**Versão:** 1.0  
**Data:** 2025-05  
**Status:** Aprovado  

---

## 1. Visão Geral

Dashboard interno para gestão de tráfego pago de clientes delivery.
Uso exclusivo do gestor de tráfego. Não é produto público.

**Stack:** React 18 + Vite + CSS puro (sem Tailwind, sem UI libs)  
**Deploy:** Vercel (frontend only, sem backend por enquanto)  
**Auth:** Login simples com usuário/senha hardcoded (uso interno)  

---

## 2. Contas Gerenciadas

| ID | Nome | Tipo | Cor | Orçamento Mensal |
|----|------|------|-----|-----------------|
| 1 | Pizza Bella | Pizzaria | #E85D26 | R$ 6.000 |
| 2 | Pizzaria Roma | Pizzaria | #C0392B | R$ 5.000 |
| 3 | Pizza Napoli | Pizzaria | #E67E22 | R$ 7.500 |
| 4 | Forno Vivo | Pizzaria | #D35400 | R$ 3.500 |
| 5 | Smash Kings | Hamburgueria | #2C3E50 | R$ 10.000 |
| 6 | Burguer Lab | Hamburgueria | #1A252F | R$ 7.000 |

Cada conta roda **Meta Ads + Google Ads** simultâneamente.

---

## 3. Páginas e Comportamentos

### 3.1 Login
- Tela de acesso antes do dashboard
- Campos: usuário + senha
- Credenciais hardcoded em Login.jsx (uso interno)
- Sessão mantida via sessionStorage
- Sem recuperação de senha

### 3.2 Visão Geral (Overview)
**Componentes visuais:**
- KPI bar: Gasto Total | CTR Médio | CPC Médio | ROAS Médio
- Banner de alerta automático: contas com CPR > 130% da média ou CTR < 70% da média
- Grid de 6 cards de conta com: nome, tipo, dot colorido, métricas (CTR/CPC/CPR/ROAS), split Meta/Google

**Comportamentos:**
- Calcular médias consolidadas das 6 contas
- Detectar e destacar contas fora da média (badge "Alerta" + borda vermelha)
- Mostrar gasto separado por plataforma em cada card

### 3.3 Categorias (Groups)
**Componentes visuais:**
- Bloco Pizzarias: benchmark interno das 4 contas
- Bloco Hamburguerias: benchmark interno das 2 contas
- Cada bloco: médias do grupo + comparativo individual verde/vermelho

**Comportamentos:**
- Calcular média de CTR/CPC/CPR/ROAS por grupo
- Colorir métrica individual: verde se >= média do grupo, vermelho se abaixo

### 3.4 Criativos (Creatives)
**Componentes visuais:**
- Grid de 6 cards ranqueados por CPR (menor = melhor)
- Cada card: thumbnail placeholder, nome, plataforma, CTR, CPR, conversões

**Comportamentos:**
- Ordenar criativos do melhor para o pior CPR
- Colorir CTR: verde >= 4%, laranja >= 3%, vermelho < 3%
- Colorir CPR: verde <= R$18, laranja <= R$24, vermelho > R$24

### 3.5 Verba & Pacing (Budget)
**Componentes visuais:**
- KPIs: Orçamento Total | Gasto Acumulado | % Consumido
- Card por conta com barra de pacing + projeção de fechamento

**Comportamentos:**
- Calcular ritmo diário real vs ritmo ideal (orçamento / dias do mês)
- Projetar gasto para fechar o mês com base no ritmo atual
- Badge de status: "No ritmo" | "Abaixo" | "Acima"
- Linha vertical na barra indicando onde deveria estar no dia atual

### 3.6 Extras
**Sub-abas:**

**Pico por Horário:**
- Gráfico de barras duplas (pizzarias vs hamburguerias) por hora
- Destaque do pico noturno (19h-22h) e período ocioso (15h-17h)

**Meta vs Google:**
- Barra horizontal de split por conta
- Grid com CTR e ROAS separado por plataforma

**UTMs:**
- Tabela com: campaign, source, cliques, conversões, CPR
- CPR colorido por threshold

### 3.7 Funil (Funnel) — NOVA PÁGINA
**Componentes visuais:**
- Funil visual por conta: Impressões → Cliques → Leads → Pedidos
- Taxa de conversão entre cada etapa (% de drop)
- Comparativo das 6 contas em tabela
- Card de gargalo: etapa com maior perda em cada conta
- Breakdown Meta vs Google por etapa

**Comportamentos:**
- Calcular taxa de conversão entre etapas: (etapa_seguinte / etapa_atual) * 100
- Detectar gargalo: etapa com menor taxa de conversão
- Colorir taxa: verde >= 10%, laranja >= 5%, vermelho < 5%
- Mostrar funil proporcionalmente (largura = % do topo)

---

## 4. Métricas e Fórmulas

| Métrica | Fórmula |
|---------|---------|
| CTR | (clicks / impressions) * 100 |
| CPC | spend / clicks |
| CPR | spend / conversions |
| ROAS | revenue / spend |
| Taxa Imp→Clique | (clicks / impressions) * 100 |
| Taxa Clique→Lead | (leads / clicks) * 100 |
| Taxa Lead→Pedido | (orders / leads) * 100 |
| Pacing % | (spend / budget) * 100 |
| Projeção | (spend / current_day) * days_in_month |

---

## 5. Estrutura de Arquivos

```
trafficops/
├── _references/
│   ├── Architecture.md      ← regras técnicas da IA
│   └── DesignSystem.md      ← padrões visuais da IA
├── src/
│   ├── main.jsx
│   ├── App.jsx              ← shell + roteamento + sidebar
│   ├── Login.jsx            ← tela de login
│   ├── data.js              ← dados mock das 6 contas
│   ├── utils.js             ← funções de cálculo e formatação
│   ├── styles.js            ← CSS global como string
│   └── pages/
│       ├── Overview.jsx
│       ├── Groups.jsx
│       ├── Creatives.jsx
│       ├── Budget.jsx
│       ├── Extras.jsx
│       └── Funnel.jsx
├── public/
│   └── favicon.svg
├── index.html
├── vite.config.js
├── vercel.json
├── package.json
├── .gitignore
└── SPEC.md                  ← este arquivo
```

---

## 6. Dados Mock Iniciais

### Contas (src/data.js)
Cada conta tem:
```js
{
  id, name, type, color, budget,
  meta:   { spend, impressions, clicks, conversions, revenue, leads, orders },
  google: { spend, impressions, clicks, conversions, revenue, leads, orders }
}
```

### Criativos (src/data.js)
```js
{ id, accountId, name, ctr, cpr, impressions, conversions, platform }
```

### Horários (src/data.js)
```js
{ hour, pizza, burger }  // conversões por hora
```

---

## 7. Regras Não Negociáveis

1. Token e credenciais NUNCA no front-end
2. Toda lógica de cálculo fica em utils.js — componentes só renderizam
3. Cada página é um componente isolado em src/pages/
4. CSS como string exportada de styles.js — sem arquivos .css separados
5. Sem bibliotecas de UI (sem MUI, Chakra, Ant Design)
6. Sem TypeScript por enquanto — JavaScript puro
7. Cores hardcoded no CSS (sem variáveis CSS externas)
