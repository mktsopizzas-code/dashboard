# DesignSystem.md — Sistema Visual do TrafficOps

> Leia este arquivo antes de criar qualquer componente visual.
> Todo novo componente deve seguir estes padrões sem exceção.

---

## 1. Paleta de Cores

### Backgrounds
```css
#0D0F12   /* bg principal — corpo da página */
#0A0C0F   /* bg sidebar e elementos mais escuros */
#12151A   /* bg cards */
#14171C   /* bg hover de itens */
#1A1F28   /* bg item ativo na sidebar / elementos destacados */
```

### Borders
```css
#1E2228   /* borda padrão de cards e divisores */
#2A2F3A   /* borda de inputs */
#2E3440   /* borda hover de cards */
```

### Texto
```css
#E8EAF0   /* texto primário — títulos e valores principais */
#C0C8D8   /* texto secundário — nomes e labels */
#8A94A6   /* texto terciário — labels de métricas */
#6A7284   /* texto muted — itens de nav inativos */
#4A5060   /* texto muito muted — labels uppercase */
#3A4050   /* texto placeholder — labels de métricas menores */
```

### Accent
```css
#FF5A1F   /* laranja principal — logo, item ativo, botão primário */
```

### Semântico
```css
#4ECB8D   /* verde — sucesso, acima da meta, bom desempenho */
#FF8C42   /* laranja — aviso, atenção, pacing baixo */
#FF5A5A   /* vermelho — erro, alerta, abaixo da meta */
#FF7A7A   /* vermelho claro — texto em banner de alerta */
```

### Plataformas
```css
#6A8ECC   /* Meta Ads — azul */
#4ECB8D   /* Google Ads — verde */
```

### Contas (dots e thumbnails)
```
Pizza Bella:   #E85D26
Pizzaria Roma: #C0392B
Pizza Napoli:  #E67E22
Forno Vivo:    #D35400
Smash Kings:   #2C3E50
Burguer Lab:   #1A252F
```

---

## 2. Tipografia

### Fontes
```
DM Sans      → corpo, labels, navegação, botões
Space Mono   → números, valores monetários, percentuais, código, tags
```

### Import (no index.html ou via @import no CSS)
```
https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap
```

### Escala
```
26px / 300  → valores KPI grandes
22px / 300  → valores KPI monetários (Space Mono)
20px / 500  → título de página
18px / 500  → título de grupo/bloco
16px / 400  → corpo padrão
15px / 500  → nome de conta em card
14px / 500  → nome de conta em nav / botões
13px / 400  → métricas, labels secundários
12px / 400  → badges, tags, textos de suporte
11px / 400  → labels uppercase, trends, subtítulos
10px / 400  → labels de eixo, micro-labels
 9px / 400  → labels ALL CAPS de métricas dentro de cards
 8px / 400  → labels de hora rotacionados no gráfico
```

### Regras
- Números e valores financeiros: sempre `font-family: 'Space Mono', monospace`
- Textos corridos e labels: `font-family: 'DM Sans', sans-serif`
- `font-weight: 600` e `700` são permitidos mas usar com moderação
- `text-transform: uppercase` + `letter-spacing: .06em` para labels de métricas

---

## 3. Componentes Base

### KPI Card
```
background: #12151A
border: 1px solid #1E2228
border-radius: 10px
padding: 16px 18px

label:  font-size 11px, color #4A5060, uppercase, letter-spacing .08em
value:  font-size 22px, font-weight 300, Space Mono, color #E8EAF0
trend:  font-size 11px, color semântico (verde/vermelho/muted)
```

### Card de Conta
```
background: #12151A
border: 1px solid #1E2228
border-radius: 10px
padding: 16px
hover: border-color #2E3440

estado alerta:
  border-color: #3A1010
  background: #130E0E
```

### Mini Métrica (dentro de card)
```
background: #0A0C0F
border-radius: 6px
padding: 8px 10px

label: 9px, #3A4050, uppercase, letter-spacing .06em
valor: 13px, font-weight 500, Space Mono
```

### Badge
```
border-radius: 20px
font-size: 11px
font-weight: 500
padding: 3px 10px

badge-ok:   bg #0A1F15, color #4ECB8D, border 1px solid #103020
badge-warn: bg #2A1A0A, color #FF8C42, border 1px solid #3A2410
badge-err:  bg #1F0A0A, color #FF5A5A, border 1px solid #3A1010
```

### Banner de Alerta
```
background: #1F0A0A
border: 1px solid #3A1010
border-radius: 8px
padding: 10px 14px
font-size: 12px
color: #FF7A7A
display: flex, gap: 10px, align-items: center
```

### Barra de Pacing
```
track:  height 6px, background #1E2228, border-radius 3px
fill:   border-radius 3px, cor semântica
marker: width 2px, height 12px, background #4A5060 (dia esperado)
```

### Sidebar
```
width: 220px
background: #0A0C0F
border-right: 1px solid #1E2228

nav-item:
  padding: 8px 12px
  border-radius: 6px
  font-size: 13px
  color: #6A7284
  hover: bg #14171C, color #C0C8D8
  active: bg #1A1F28, color #FF5A1F

section-label:
  font-size: 9px, uppercase, letter-spacing .1em, color #3A4050
```

### Tags de Plataforma
```
Meta:   bg #1A1F28, color #6A8ECC, font Space Mono, font-size 9-10px
Google: bg #1A1F1A, color #4ECB8D, font Space Mono, font-size 9-10px
border-radius: 4px
padding: 2px 8px
```

### Abas (Tab Bar)
```
container: bg #0A0C0F, border-radius 8px, padding 4px
tab: padding 7px 16px, border-radius 6px, font-size 12px
tab inativo: color #4A5060, bg none
tab ativo: bg #1A1F28, color #E8EAF0
```

### Funil Visual
```
cada etapa é um trapézio ou barra proporcional
largura proporcional ao volume da etapa em relação ao topo
cor de fundo: cor da conta (hex da conta + opacidade)
seta ou linha conectando etapas
taxa entre etapas: badge colorido no conector
gargalo: borda highlight ou ícone de aviso
```

---

## 4. Layout

### Shell Principal
```
display: flex
height: 100vh
overflow: hidden

sidebar: 220px fixo à esquerda
main: flex 1, overflow-y auto
```

### Topbar
```
padding: 20px 28px 16px
border-bottom: 1px solid #1E2228
display: flex, justify-content space-between
```

### Content Area
```
padding: 24px 28px
```

### Grids Comuns
```
KPIs 4 colunas:  grid-template-columns: repeat(4, 1fr), gap 12px
KPIs 3 colunas:  grid-template-columns: repeat(3, 1fr), gap 12px
Contas:          grid-template-columns: repeat(2, 1fr), gap 12px
Criativos:       grid-template-columns: repeat(3, 1fr), gap 10px
Métricas mini:   grid-template-columns: repeat(4, 1fr), gap 8px
```

---

## 5. Padrões de Cor por Valor

### CTR
```
>= 4%  → #4ECB8D (bom)
>= 3%  → #FF8C42 (atenção)
< 3%   → #FF5A5A (ruim)
```

### CPR
```
<= R$18 → #4ECB8D (bom)
<= R$24 → #FF8C42 (atenção)
> R$24  → #FF5A5A (ruim)
```

### ROAS
```
>= 4x  → #4ECB8D
>= 2x  → #FF8C42
< 2x   → #FF5A5A
```

### Taxa de Conversão (Funil)
```
>= 10% → #4ECB8D
>= 5%  → #FF8C42
< 5%   → #FF5A5A
```

### Pacing
```
85%-110% do esperado → #4ECB8D (No ritmo)
< 85%               → #FF8C42 (Abaixo)
> 110%              → #FF5A5A (Acima)
```

---

## 6. Regras Gerais

- Nunca usar `box-shadow` decorativo — apenas `outline` para focus
- Nunca usar gradientes — apenas cores sólidas
- Nunca usar `border-radius` > 14px em cards
- Sempre usar `font-family: 'Space Mono', monospace` em números
- Sempre usar `text-transform: uppercase` em section-labels e metric-labels
- Dashboard é **desktop only** — sem responsividade mobile
- Sem animações além de `transition: all .15s` em hovers
