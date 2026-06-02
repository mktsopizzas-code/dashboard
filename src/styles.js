export const STYLES = `
/* ── Reset & Base ─────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: 'DM Sans', sans-serif;
  background: #0D0F12;
  color: #E8EAF0;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
}
button { cursor: pointer; border: none; background: none; font-family: inherit; }
input  { font-family: inherit; }
a      { text-decoration: none; color: inherit; }

/* ── Layout ───────────────────────────────────────────── */
.shell {
  display: flex;
  height: 100vh;
  overflow: hidden;
}
.sidebar {
  width: 220px;
  min-width: 220px;
  background: #0A0C0F;
  border-right: 1px solid #1E2228;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.topbar {
  padding: 20px 28px 16px;
  border-bottom: 1px solid #1E2228;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-shrink: 0;
}
.topbar-left h1 {
  font-size: 20px;
  font-weight: 500;
  color: #E8EAF0;
}
.topbar-left p {
  font-size: 13px;
  color: #8A94A6;
  margin-top: 2px;
}
.topbar-right {
  display: flex;
  gap: 8px;
  align-items: center;
}
.content {
  flex: 1;
  overflow-y: auto;
  padding: 24px 28px;
}

/* ── Sidebar ──────────────────────────────────────────── */
.sb-logo {
  padding: 20px 16px 16px;
  border-bottom: 1px solid #1E2228;
}
.sb-logo-icon {
  width: 32px;
  height: 32px;
  background: #FF5A1F;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}
.sb-logo-text {
  font-size: 14px;
  font-weight: 600;
  color: #E8EAF0;
}
.sb-logo-sub {
  font-size: 11px;
  color: #6A7284;
  margin-top: 2px;
}
.sb-nav {
  padding: 12px 8px;
  flex: 1;
}
.sb-section {
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: .1em;
  color: #3A4050;
  padding: 12px 8px 6px;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  color: #6A7284;
  cursor: pointer;
  transition: all .15s;
  margin-bottom: 2px;
}
.nav-item:hover {
  background: #14171C;
  color: #C0C8D8;
}
.nav-item.active {
  background: #1A1F28;
  color: #FF5A1F;
}
.nav-item-icon {
  font-size: 14px;
  width: 18px;
  text-align: center;
}
.nav-dot-list {
  padding: 0 8px 12px;
  border-top: 1px solid #1E2228;
  margin-top: 4px;
}
.nav-dot {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 12px;
  color: #6A7284;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.sb-footer {
  padding: 12px 16px;
  border-top: 1px solid #1E2228;
  font-size: 11px;
  color: #4A5060;
  line-height: 1.6;
}

/* ── KPI Grid ─────────────────────────────────────────── */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}
.kpi-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}
.kpi-card {
  background: #12151A;
  border: 1px solid #1E2228;
  border-radius: 10px;
  padding: 16px 18px;
}
.kpi-label {
  font-size: 11px;
  color: #4A5060;
  text-transform: uppercase;
  letter-spacing: .08em;
  margin-bottom: 6px;
}
.kpi-val {
  font-family: 'Space Mono', monospace;
  font-size: 22px;
  font-weight: 300;
  color: #E8EAF0;
}
.kpi-trend {
  font-size: 11px;
  margin-top: 4px;
  color: #6A7284;
}

/* ── Accounts Grid ────────────────────────────────────── */
.accounts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.acc-card {
  background: #12151A;
  border: 1px solid #1E2228;
  border-radius: 10px;
  padding: 16px;
  transition: border-color .15s;
}
.acc-card:hover {
  border-color: #2E3440;
}
.acc-card.alert {
  border-color: #3A1010;
  background: #130E0E;
}
.acc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.acc-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.acc-name {
  font-size: 15px;
  font-weight: 500;
  color: #E8EAF0;
}
.acc-type {
  font-size: 11px;
  color: #6A7284;
  margin-top: 1px;
}
.acc-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}
.acc-metric {
  background: #0A0C0F;
  border-radius: 6px;
  padding: 8px 10px;
}
.acc-metric-label {
  font-size: 9px;
  color: #3A4050;
  text-transform: uppercase;
  letter-spacing: .06em;
  margin-bottom: 4px;
}
.acc-metric-val {
  font-family: 'Space Mono', monospace;
  font-size: 13px;
  font-weight: 500;
}
.acc-platform-split {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.plat-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.plat-bar {
  height: 4px;
  border-radius: 2px;
  flex: 1;
}
.plat-bar.meta   { background: #6A8ECC; }
.plat-bar.google { background: #4ECB8D; }
.plat-bar-label {
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: .06em;
  width: 44px;
  color: #6A7284;
}
.plat-bar-val {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  color: #C0C8D8;
  width: 64px;
  text-align: right;
}

/* ── Badges ───────────────────────────────────────────── */
.badge {
  display: inline-flex;
  align-items: center;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 500;
  padding: 3px 10px;
}
.badge-ok   { background: #0A1F15; color: #4ECB8D; border: 1px solid #103020; }
.badge-warn { background: #2A1A0A; color: #FF8C42; border: 1px solid #3A2410; }
.badge-err  { background: #1F0A0A; color: #FF5A5A; border: 1px solid #3A1010; }

/* ── Alert Banner ─────────────────────────────────────── */
.alert-banner {
  background: #1F0A0A;
  border: 1px solid #3A1010;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 12px;
  color: #FF7A7A;
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
}

/* ── Groups ───────────────────────────────────────────── */
.group-block {
  background: #12151A;
  border: 1px solid #1E2228;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 16px;
}
.group-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}
.group-title {
  font-size: 18px;
  font-weight: 500;
  color: #E8EAF0;
}
.group-spend {
  font-family: 'Space Mono', monospace;
  font-size: 13px;
  color: #8A94A6;
}
.bench-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}
.bench-item {
  background: #0A0C0F;
  border-radius: 6px;
  padding: 10px 12px;
}
.bench-label {
  font-size: 9px;
  color: #3A4050;
  text-transform: uppercase;
  letter-spacing: .06em;
  margin-bottom: 4px;
}
.bench-avg {
  font-family: 'Space Mono', monospace;
  font-size: 15px;
  font-weight: 500;
  color: #E8EAF0;
}
.divider {
  height: 1px;
  background: #1E2228;
  margin: 16px 0;
}
.group-accounts {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.group-acc-card {
  background: #0A0C0F;
  border: 1px solid #1E2228;
  border-radius: 8px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.group-acc-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #C0C8D8;
}
.group-acc-metrics {
  display: flex;
  gap: 16px;
}
.group-acc-metric {
  text-align: right;
}
.group-acc-metric-label {
  font-size: 9px;
  color: #3A4050;
  text-transform: uppercase;
  letter-spacing: .06em;
}
.group-acc-metric-val {
  font-family: 'Space Mono', monospace;
  font-size: 13px;
  font-weight: 500;
}

/* ── Creatives ────────────────────────────────────────── */
.creatives-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.creative-card {
  background: #12151A;
  border: 1px solid #1E2228;
  border-radius: 10px;
  padding: 14px;
  transition: border-color .15s;
}
.creative-card:hover {
  border-color: #2E3440;
}
.creative-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.creative-rank {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  color: #4A5060;
  width: 24px;
}
.creative-thumb {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}
.creative-info {
  flex: 1;
  min-width: 0;
}
.creative-name {
  font-size: 13px;
  font-weight: 500;
  color: #C0C8D8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.creative-imp {
  font-size: 11px;
  color: #6A7284;
  margin-top: 2px;
}
.creative-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}
.cm {
  background: #0A0C0F;
  border-radius: 6px;
  padding: 7px 8px;
}
.cm-label {
  font-size: 9px;
  color: #3A4050;
  text-transform: uppercase;
  letter-spacing: .06em;
  margin-bottom: 3px;
}
.cm-val {
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  font-weight: 500;
}

/* ── Budget / Pacing ──────────────────────────────────── */
.proj-card {
  background: #12151A;
  border: 1px solid #1E2228;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 10px;
}
.proj-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.proj-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #C0C8D8;
}
.pacing-track {
  position: relative;
  height: 6px;
  background: #1E2228;
  border-radius: 3px;
  margin: 10px 0;
}
.pacing-fill {
  height: 100%;
  border-radius: 3px;
  transition: width .3s;
}
.pacing-marker {
  position: absolute;
  top: -3px;
  width: 2px;
  height: 12px;
  background: #4A5060;
  border-radius: 1px;
}
.pacing-labels {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #6A7284;
  margin-top: 4px;
}
.proj-mini-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-top: 12px;
}
.proj-mini {
  background: #0A0C0F;
  border-radius: 6px;
  padding: 8px 10px;
}
.proj-mini-label {
  font-size: 9px;
  color: #3A4050;
  text-transform: uppercase;
  letter-spacing: .06em;
  margin-bottom: 3px;
}
.proj-mini-val {
  font-family: 'Space Mono', monospace;
  font-size: 13px;
  font-weight: 500;
  color: #E8EAF0;
}
.budget-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

/* ── Extras / Tabs ────────────────────────────────────── */
.tab-bar {
  display: inline-flex;
  background: #0A0C0F;
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 20px;
}
.tab {
  padding: 7px 16px;
  border-radius: 6px;
  font-size: 12px;
  color: #4A5060;
  cursor: pointer;
  transition: all .15s;
}
.tab.active {
  background: #1A1F28;
  color: #E8EAF0;
}
.hour-chart {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 160px;
  margin-bottom: 12px;
}
.h-bar-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: flex-end;
}
.h-bars {
  display: flex;
  gap: 2px;
  align-items: flex-end;
  width: 100%;
  justify-content: center;
  flex: 1;
}
.h-bar {
  width: 10px;
  border-radius: 2px 2px 0 0;
  min-height: 2px;
}
.h-label {
  font-size: 8px;
  color: #4A5060;
  margin-top: 4px;
  transform: rotate(-45deg);
  white-space: nowrap;
}
.hour-legend {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}
.hour-legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #8A94A6;
}
.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 2px;
}
.hour-highlights {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 16px;
}
.hour-highlight-card {
  background: #12151A;
  border: 1px solid #1E2228;
  border-radius: 8px;
  padding: 12px 14px;
}
.hour-highlight-label {
  font-size: 10px;
  color: #4A5060;
  text-transform: uppercase;
  letter-spacing: .06em;
  margin-bottom: 4px;
}
.hour-highlight-val {
  font-family: 'Space Mono', monospace;
  font-size: 18px;
  font-weight: 300;
  color: #E8EAF0;
}
.hour-highlight-sub {
  font-size: 11px;
  color: #6A7284;
  margin-top: 2px;
}
.platform-split-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.platform-split-name {
  width: 120px;
  font-size: 13px;
  color: #C0C8D8;
  display: flex;
  align-items: center;
  gap: 6px;
}
.platform-split-bar-wrap {
  flex: 1;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  background: #1E2228;
  display: flex;
}
.platform-split-meta   { background: #6A8ECC; height: 100%; }
.platform-split-google { background: #4ECB8D; height: 100%; }
.platform-split-labels {
  display: flex;
  gap: 8px;
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  color: #8A94A6;
  width: 100px;
  justify-content: flex-end;
}
.platform-detail-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-top: 16px;
}
.utm-wrap { overflow-x: auto; }
.utm-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.utm-table th {
  text-align: left;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: #4A5060;
  padding: 0 0 10px;
  border-bottom: 1px solid #1E2228;
}
.utm-table td {
  padding: 10px 0;
  border-bottom: 1px solid #1E2228;
  color: #C0C8D8;
  vertical-align: middle;
}
.utm-table td:first-child {
  font-family: 'Space Mono', monospace;
  font-size: 12px;
}
.tag {
  display: inline-flex;
  align-items: center;
  border-radius: 4px;
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  padding: 2px 8px;
}
.tag-meta   { background: #1A1F28; color: #6A8ECC; }
.tag-google { background: #1A1F1A; color: #4ECB8D; }

/* ── Funil ────────────────────────────────────────────── */
.funnel-page {}
.funnel-account-select {
  display: inline-flex;
  background: #0A0C0F;
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 2px;
}
.funnel-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.funnel-card {
  background: #12151A;
  border: 1px solid #1E2228;
  border-radius: 10px;
  padding: 20px;
}
.funnel-account-name {
  font-size: 15px;
  font-weight: 500;
  color: #E8EAF0;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.funnel-stages {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.funnel-stage {
  position: relative;
}
.funnel-stage-bar {
  height: 36px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  justify-content: space-between;
  opacity: .85;
}
.funnel-stage-label {
  font-size: 11px;
  font-weight: 500;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0,0,0,.5);
}
.funnel-stage-val {
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0,0,0,.5);
}
.funnel-connector {
  display: flex;
  align-items: center;
  padding: 4px 0 4px 12px;
  gap: 6px;
}
.funnel-rate {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  font-weight: 500;
}
.funnel-connector-line {
  flex: 1;
  height: 1px;
  background: #1E2228;
}
.funnel-bottleneck {
  margin-top: 14px;
  background: #1F0A0A;
  border: 1px solid #3A1010;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 12px;
  color: #FF7A7A;
  display: flex;
  gap: 8px;
  align-items: center;
}
.funnel-platform-split {
  margin-top: 14px;
}
.funnel-platform-title {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: .06em;
  color: #4A5060;
  margin-bottom: 8px;
}
.funnel-platform-row {
  display: grid;
  grid-template-columns: 80px 1fr 1fr;
  gap: 6px;
  align-items: center;
  font-size: 12px;
  margin-bottom: 6px;
}
.funnel-platform-stage {
  font-size: 10px;
  color: #6A7284;
}
.funnel-platform-val {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
}
.funnel-compare-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.funnel-compare-table th {
  text-align: left;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: #4A5060;
  padding: 0 0 10px;
  border-bottom: 1px solid #1E2228;
}
.funnel-compare-table td {
  padding: 10px 8px 10px 0;
  border-bottom: 1px solid #1E2228;
  color: #C0C8D8;
  vertical-align: middle;
}
.funnel-compare-table td:first-child {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ── Login ────────────────────────────────────────────── */
.login-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0D0F12;
}
.login-card {
  background: #12151A;
  border: 1px solid #1E2228;
  border-radius: 14px;
  padding: 36px 32px;
  width: 360px;
}
.login-logo {
  width: 44px;
  height: 44px;
  background: #FF5A1F;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  margin: 0 auto 16px;
}
.login-title {
  text-align: center;
  font-size: 20px;
  font-weight: 500;
  color: #E8EAF0;
  margin-bottom: 4px;
}
.login-sub {
  text-align: center;
  font-size: 13px;
  color: #6A7284;
  margin-bottom: 28px;
}
.login-label {
  display: block;
  font-size: 12px;
  color: #8A94A6;
  margin-bottom: 6px;
}
.login-input {
  width: 100%;
  background: #0A0C0F;
  border: 1px solid #2A2F3A;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 14px;
  color: #E8EAF0;
  outline: none;
  margin-bottom: 14px;
  transition: border-color .15s;
}
.login-input:focus {
  border-color: #FF5A1F;
}
.login-btn {
  width: 100%;
  background: #FF5A1F;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  padding: 11px;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity .15s;
  margin-top: 4px;
}
.login-btn:hover {
  opacity: .88;
}
.login-err {
  font-size: 12px;
  color: #FF5A5A;
  text-align: center;
  margin-top: 10px;
}

/* ── Utils ────────────────────────────────────────────── */
.mono  { font-family: 'Space Mono', monospace; }
.section-title {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: #4A5060;
  margin-bottom: 12px;
}
.up  { color: #4ECB8D; }
.down { color: #FF5A5A; }
.neu  { color: #8A94A6; }

/* ── Account Detail ───────────────────────────────────── */
.detail-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #6A7284;
  cursor: pointer;
  padding: 6px 0;
  margin-bottom: 16px;
  transition: color .15s;
}
.detail-back:hover { color: #C0C8D8; }
.detail-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.detail-header-name {
  font-size: 20px;
  font-weight: 500;
  color: #E8EAF0;
}
.detail-header-type {
  font-size: 13px;
  color: #8A94A6;
  margin-top: 2px;
}
.detail-header-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: #6A7284;
}
.kpi-grid-6 {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  margin-bottom: 24px;
}
.detail-section {
  background: #12151A;
  border: 1px solid #1E2228;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
}
.detail-section-title {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: #4A5060;
  margin-bottom: 16px;
}
.detail-funnel-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}
.detail-funnel-row-label {
  width: 82px;
  font-size: 11px;
  color: #6A7284;
  text-align: right;
  flex-shrink: 0;
}
.detail-funnel-bar {
  height: 34px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  justify-content: space-between;
  min-width: 60px;
  transition: width .3s;
}
.detail-funnel-bar.pending {
  border: 2px dashed #2A2F3A;
  background: transparent !important;
}
.detail-funnel-bar.bottleneck {
  outline: 1px solid #FF5A5A;
}
.detail-funnel-bar-name {
  font-size: 11px;
  font-weight: 500;
  color: #fff;
  white-space: nowrap;
}
.detail-funnel-bar-val {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  color: rgba(255,255,255,.85);
  white-space: nowrap;
}
.detail-funnel-bar.pending .detail-funnel-bar-name,
.detail-funnel-bar.pending .detail-funnel-bar-val { color: #4A5060; }
.detail-funnel-rate {
  width: 56px;
  text-align: right;
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  flex-shrink: 0;
}
.detail-funnel-connector {
  height: 10px;
  margin-left: 92px;
  border-left: 1px solid #1E2228;
  margin-bottom: 0;
}
.detail-campaigns-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.detail-campaigns-table th {
  text-align: left;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: #4A5060;
  padding: 0 8px 10px 0;
  border-bottom: 1px solid #1E2228;
}
.detail-campaigns-table td {
  padding: 9px 8px 9px 0;
  border-bottom: 1px solid #1E2228;
  color: #C0C8D8;
  vertical-align: middle;
}
.acc-card.clickable { cursor: pointer; }

/* ── Account Detail — Vertical Trapezoid Funnel ──────── */
.detail-funnel-v-row {
  display: flex;
  align-items: flex-start;
  max-width: 700px;
  margin: 0 auto;
}
.detail-funnel-v-left {
  width: 70px;
  flex-shrink: 0;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 12px;
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  color: #8A94A6;
}
.detail-funnel-v-center {
  width: 560px;
  flex-shrink: 0;
}
.detail-funnel-v-right {
  width: 70px;
  flex-shrink: 0;
  height: 64px;
  display: flex;
  align-items: flex-start;
  padding-left: 12px;
  padding-top: 4px;
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  font-weight: 700;
}
.detail-funnel-neck {
  max-width: 700px;
  margin: 16px auto 0;
  background: #1F0A0A;
  border: 1px solid #3A1010;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 13px;
  color: #FF7A7A;
  display: flex;
  gap: 8px;
  align-items: center;
}

/* ── CPR Target ───────────────────────────────────────── */
.cpr-progress-track {
  margin-top: 8px;
  height: 4px;
  background: #1E2228;
  border-radius: 2px;
  overflow: hidden;
}
.cpr-progress-fill {
  height: 100%;
  border-radius: 2px;
}
.cpr-target-card {
  max-width: 700px;
  margin: 12px auto 0;
  background: #0A1F15;
  border: 1px solid #103020;
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.cpr-target-card-main {
  font-family: 'Space Mono', monospace;
  font-size: 13px;
  color: #E8EAF0;
}
.cpr-target-card-sub {
  font-size: 11px;
  color: #6A7284;
  margin-top: 3px;
}
.badge-meta-ok {
  font-size: 9px;
  background: #0A1F15;
  color: #4ECB8D;
  border: 1px solid #103020;
  border-radius: 3px;
  padding: 1px 5px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  vertical-align: middle;
  flex-shrink: 0;
}

/* ── Loading / Error / Refresh ───────────────────────── */
.loading-screen {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4A5060;
  font-size: 14px;
  letter-spacing: .04em;
}
.error-screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #FF5A5A;
  font-size: 13px;
}
.btn-refresh {
  font-size: 12px;
  color: #8A94A6;
  border: 1px solid #2A3040;
  border-radius: 6px;
  padding: 5px 12px;
  cursor: pointer;
  transition: color .15s, border-color .15s;
}
.btn-refresh:hover {
  color: #E8EAF0;
  border-color: #4A5060;
}

/* ── Date filter ──────────────────────────────────────── */
.date-filter {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.date-input {
  background: #0A0C0F;
  border: 1px solid #2A2F3A;
  color: #E8EAF0;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 12px;
  color-scheme: dark;
}
.date-shortcut {
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 11px;
  cursor: pointer;
  color: #4A5060;
  background: #14171C;
  border: 1px solid #1E2228;
  transition: color .15s;
  white-space: nowrap;
}
.date-shortcut:hover {
  color: #E8EAF0;
}

/* ── Objective Toggle ─────────────────────────────────── */
.objective-toggle {
  display: inline-flex;
  gap: 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #1E2228;
}
.objective-btn {
  padding: 5px 14px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  background: #14171C;
  color: #4A5060;
  font-family: 'DM Sans', sans-serif;
  transition: all 0.15s;
}
.objective-btn.active {
  background: #FF5A1F;
  color: #FFFFFF;
}
.objective-btn:first-child {
  border-right: 1px solid #1E2228;
}

/* ── Budget Modal ─────────────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.modal-card {
  background: #12151A;
  border: 1px solid #1E2228;
  border-radius: 14px;
  padding: 28px;
  width: 520px;
  max-height: 80vh;
  overflow-y: auto;
}
.modal-title {
  font-size: 16px;
  font-weight: 500;
  color: #E8EAF0;
  margin-bottom: 8px;
}
.modal-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #1E2228;
}
.modal-account-name {
  font-size: 13px;
  color: #C0C8D8;
  display: flex;
  align-items: center;
  gap: 8px;
}
.budget-input {
  background: #0A0C0F;
  border: 1px solid #2A2F3A;
  color: #E8EAF0;
  font-family: 'Space Mono', monospace;
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 6px;
  width: 140px;
  text-align: right;
  outline: none;
}
.budget-input:focus {
  border-color: #FF5A1F;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
}
.modal-btn {
  padding: 8px 20px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  border: none;
}
.modal-btn-cancel {
  background: #1A1F28;
  color: #6A7284;
}
.modal-btn-save {
  background: #FF5A1F;
  color: white;
}
`
