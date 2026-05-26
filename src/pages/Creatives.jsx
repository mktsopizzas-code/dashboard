import { ACCOUNTS, CREATIVES } from '../data.js'
import { fmtN, ctrColor, cprColor } from '../utils.js'

const ACCOUNT_MAP = Object.fromEntries(ACCOUNTS.map(a => [a.id, a]))

const THUMB_EMOJI = { pizza: '🍕', burger: '🍔' }

export default function Creatives() {
  const sorted = [...CREATIVES].sort((a, b) => a.cpr - b.cpr)

  return (
    <div>
      <div className="creatives-grid">
        {sorted.map((cr, idx) => {
          const acc = ACCOUNT_MAP[cr.accountId]
          const emoji = THUMB_EMOJI[acc?.type] ?? '📢'

          return (
            <div key={cr.id} className="creative-card">
              <div className="creative-header">
                <span className="creative-rank">#{idx + 1}</span>
                <div
                  className="creative-thumb"
                  style={{ background: acc ? acc.color + '33' : '#1E2228' }}
                >
                  {emoji}
                </div>
                <div className="creative-info">
                  <div className="creative-name">{cr.name}</div>
                  <div className="creative-imp">{fmtN(cr.impressions)} impressões</div>
                </div>
              </div>

              <div style={{ marginBottom: 10 }}>
                <span className={`tag tag-${cr.platform.toLowerCase() === 'google' ? 'google' : 'meta'}`}>
                  {cr.platform.toLowerCase() === 'google' ? 'Google' : 'Meta'}
                </span>
              </div>

              <div className="creative-metrics">
                <div className="cm">
                  <div className="cm-label">CTR</div>
                  <div className="cm-val" style={{ color: ctrColor(cr.ctr) }}>
                    {cr.ctr.toFixed(1)}%
                  </div>
                </div>
                <div className="cm">
                  <div className="cm-label">CPR</div>
                  <div className="cm-val" style={{ color: cprColor(cr.cpr) }}>
                    R$ {cr.cpr.toFixed(2)}
                  </div>
                </div>
                <div className="cm">
                  <div className="cm-label">Conv.</div>
                  <div className="cm-val" style={{ color: '#E8EAF0' }}>
                    {fmtN(cr.conversions)}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
