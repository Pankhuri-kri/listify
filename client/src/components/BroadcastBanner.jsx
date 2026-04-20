import React, { useEffect, useState } from 'react';
import axios from 'axios';

const typeConfig = {
  deal: { emoji: '🔥', bg: 'linear-gradient(135deg, #FFF7ED, #FEF3C7)', color: '#92400E', border: '#FDE68A' },
  offer: { emoji: '🎁', bg: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)', color: '#14532D', border: '#BBF7D0' },
  announcement: { emoji: '📢', bg: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)', color: '#3730A3', border: '#C7D2FE' },
  alert: { emoji: '⚠️', bg: 'linear-gradient(135deg, #FFFBEB, #FEF9C3)', color: '#713F12', border: '#FDE047' },
};

const BroadcastBanner = () => {
  const [broadcasts, setBroadcasts] = useState([]);
  const [dismissed, setDismissed] = useState([]);

  useEffect(() => {
    axios.get('/api/broadcasts/active').then(res => {
      if (res.data.success) setBroadcasts(res.data.data);
    }).catch(() => {});
  }, []);

  const visible = broadcasts.filter(b => !dismissed.includes(b._id));
  if (!visible.length) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
      {visible.map(b => {
        const cfg = typeConfig[b.type] || typeConfig.announcement;
        return (
          <div key={b._id} style={{
            background: cfg.bg,
            border: `1px solid ${cfg.border}`,
            borderRadius: 12,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            color: cfg.color,
          }}>
            <span style={{ fontSize: 20 }}>{cfg.emoji}</span>
            <div style={{ flex: 1 }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>{b.title}</span>
              <span style={{ fontSize: 13, marginLeft: 8, opacity: 0.85 }}>{b.message}</span>
            </div>
            <button
              onClick={() => setDismissed(d => [...d, b._id])}
              style={{
                background: 'none', border: 'none',
                color: cfg.color, cursor: 'pointer',
                fontSize: 18, lineHeight: 1, opacity: 0.6,
                padding: '0 4px'
              }}
            >×</button>
          </div>
        );
      })}
    </div>
  );
};

export default BroadcastBanner;
