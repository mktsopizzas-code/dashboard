// ─────────────────────────────────────────────────────────────
// data.js — Dados reais Meta Ads · Maio 2026 (01/05 a 25/05)
// Google Ads: zerado por enquanto (a integrar em breve)
// Última atualização: 26/05/2026
// ─────────────────────────────────────────────────────────────

export const DAYS_IN_MONTH = 31
export const CURRENT_DAY   = 25

export const ACCOUNTS = [
  {
    id: 1,
    name: 'Só Pizzas Ariquemes',
    type: 'pizza',
    color: '#E85D26',
    budget: 4000,
    smallMarket: true,
    meta: {
      spend:       3047.02,
      impressions: 926297,
      clicks:      5033,
      conversions: 3470,
      revenue:     247293.44,
      leads:       2600,
      orders:      3470,
      pageViews:   3308,
      addToCart:   0,
      checkout:    0,
    },
    google: {
      spend: 0, impressions: 0, clicks: 0,
      conversions: 0, revenue: 0, leads: 0, orders: 0,
      pageViews: 0, addToCart: 0, checkout: 0,
    },
  },
  {
    id: 2,
    name: 'Só Pizzas Porto Velho',
    type: 'pizza',
    color: '#E67E22',
    budget: 8200,
    meta: {
      spend:       6618.96,
      impressions: 1703893,
      clicks:      21106,
      conversions: 2138,
      revenue:     160594.05,
      leads:       15830,
      orders:      2138,
      pageViews:   4580,
      addToCart:   0,
      checkout:    0,
    },
    google: {
      spend: 0, impressions: 0, clicks: 0,
      conversions: 0, revenue: 0, leads: 0, orders: 0,
      pageViews: 0, addToCart: 0, checkout: 0,
    },
  },
  {
    id: 3,
    name: 'Só Pizzas Manaus',
    type: 'pizza',
    color: '#C0392B',
    budget: 8200,
    meta: {
      spend:       6143.55,
      impressions: 1315025,
      clicks:      28312,
      conversions: 954,
      revenue:     45710.43,
      leads:       21234,
      orders:      954,
      pageViews:   5589,
      addToCart:   0,
      checkout:    0,
    },
    google: {
      spend: 0, impressions: 0, clicks: 0,
      conversions: 0, revenue: 0, leads: 0, orders: 0,
      pageViews: 0, addToCart: 0, checkout: 0,
    },
  },
  {
    id: 4,
    name: 'Só Burger Porto Velho',
    type: 'burger',
    color: '#2C3E50',
    budget: 3000,
    meta: {
      spend:       1471.67,
      impressions: 348525,
      clicks:      5014,
      conversions: 245,
      revenue:     17518.45,
      leads:       3761,
      orders:      245,
      pageViews:   1206,
      addToCart:   0,
      checkout:    0,
    },
    google: {
      spend: 0, impressions: 0, clicks: 0,
      conversions: 0, revenue: 0, leads: 0, orders: 0,
      pageViews: 0, addToCart: 0, checkout: 0,
    },
  },
  {
    id: 5,
    name: 'Só Burger Ariquemes',
    type: 'burger',
    color: '#1A252F',
    budget: 3000,
    smallMarket: true,
    meta: {
      spend:       1670.66,
      impressions: 384186,
      clicks:      4356,
      conversions: 487,
      revenue:     33280.18,
      leads:       3267,
      orders:      487,
      pageViews:   1257,
      addToCart:   0,
      checkout:    0,
    },
    google: {
      spend: 0, impressions: 0, clicks: 0,
      conversions: 0, revenue: 0, leads: 0, orders: 0,
      pageViews: 0, addToCart: 0, checkout: 0,
    },
  },
]

// ─── Criativos destaque (top campanha por conta) ──────────────
export const CREATIVES = [
  {
    id: 1, accountId: 1,
    name: 'Cardápio · Ariquemes',
    ctr: 0.48, cpr: 0.86,
    impressions: 783264, conversions: 2911, platform: 'Meta',
  },
  {
    id: 2, accountId: 1,
    name: 'Pizza + Pizza Chocolate · Ariquemes',
    ctr: 0.89, cpr: 0.97,
    impressions: 143033, conversions: 559, platform: 'Meta',
  },
  {
    id: 3, accountId: 2,
    name: 'Cardápio · Porto Velho',
    ctr: 0.52, cpr: 2.48,
    impressions: 506896, conversions: 970, platform: 'Meta',
  },
  {
    id: 4, accountId: 2,
    name: 'Duas Pizzarias · Porto Velho',
    ctr: 0.46, cpr: 2.14,
    impressions: 363644, conversions: 706, platform: 'Meta',
  },
  {
    id: 5, accountId: 3,
    name: 'Combo Inauguração · Manaus',
    ctr: 1.35, cpr: 4.16,
    impressions: 414577, conversions: 528, platform: 'Meta',
  },
  {
    id: 6, accountId: 3,
    name: 'Vendas 05/05 · Manaus',
    ctr: 1.07, cpr: 4.98,
    impressions: 366619, conversions: 421, platform: 'Meta',
  },
  {
    id: 7, accountId: 4,
    name: 'Vendas CBO · Porto Velho Burger',
    ctr: 0.64, cpr: 3.80,
    impressions: 180894, conversions: 189, platform: 'Meta',
  },
  {
    id: 8, accountId: 4,
    name: 'Vendas RMKT · Porto Velho Burger',
    ctr: 0.81, cpr: 3.51,
    impressions: 52763, conversions: 56, platform: 'Meta',
  },
  {
    id: 9, accountId: 5,
    name: 'Vendas CBO · Ariquemes Burger',
    ctr: 0.62, cpr: 2.39,
    impressions: 220556, conversions: 383, platform: 'Meta',
  },
  {
    id: 10, accountId: 5,
    name: 'Vendas RMKT · Ariquemes Burger',
    ctr: 0.56, cpr: 2.38,
    impressions: 65689, conversions: 104, platform: 'Meta',
  },
]

// ─── Horários estimados por categoria ────────────────────────
export const HOURLY = [
  { hour: '10h', pizza: 12,  burger: 8  },
  { hour: '11h', pizza: 18,  burger: 14 },
  { hour: '12h', pizza: 48,  burger: 35 },
  { hour: '13h', pizza: 55,  burger: 42 },
  { hour: '14h', pizza: 32,  burger: 26 },
  { hour: '15h', pizza: 18,  burger: 14 },
  { hour: '16h', pizza: 14,  burger: 11 },
  { hour: '17h', pizza: 22,  burger: 18 },
  { hour: '18h', pizza: 62,  burger: 48 },
  { hour: '19h', pizza: 95,  burger: 74 },
  { hour: '20h', pizza: 124, burger: 96 },
  { hour: '21h', pizza: 148, burger: 112 },
  { hour: '22h', pizza: 108, burger: 82 },
  { hour: '23h', pizza: 68,  burger: 51 },
]

// ─── UTMs por campanha principal ──────────────────────────────
export const UTM_DATA = [
  { campaign: 'cardapio_ariquemes',         source: 'facebook', clicks: 3758,  conv: 2911, cpr: 0.86  },
  { campaign: 'pizza_chocolate_ariquemes',  source: 'facebook', clicks: 1275,  conv: 559,  cpr: 0.97  },
  { campaign: 'cardapio_porto_velho',       source: 'facebook', clicks: 2656,  conv: 970,  cpr: 2.48  },
  { campaign: 'duas_pizzarias_pv',          source: 'facebook', clicks: 1677,  conv: 706,  cpr: 2.14  },
  { campaign: 'combo_inauguracao_manaus',   source: 'facebook', clicks: 5589,  conv: 528,  cpr: 4.16  },
  { campaign: 'vendas_cbo_manaus',          source: 'facebook', clicks: 3929,  conv: 421,  cpr: 4.98  },
  { campaign: 'vendas_cbo_burger_pv',       source: 'facebook', clicks: 1161,  conv: 189,  cpr: 3.80  },
  { campaign: 'vendas_cbo_burger_ariquemes',source: 'facebook', clicks: 1361,  conv: 383,  cpr: 2.39  },
]
