import { useEffect, useState } from 'react';
import { Bell, ChevronDown, Clock3, PlugZap } from 'lucide-react';
import { formatDateTime } from '../utils/format.js';

export default function Header({ pageTitle, group, status, onConnect, onDisconnect, alertCount }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const connected = status === 'connected';
  const pending = status === 'connecting' || status === 'reconnecting';

  return (
    <header className="topbar">
      <div className="topbar-title"><div className="eyebrow">MES — PRODUCTION MONITORING</div><h1>{pageTitle}</h1></div>
      <div className="topbar-actions">
        <div className="topbar-group"><span className="group-indicator" />{group}<ChevronDown size={14} /></div>
        <div className="topbar-clock"><Clock3 size={15} /><span>{formatDateTime(now)}</span></div>
        <div className={`connection-pill ${connected ? 'online' : pending ? 'pending' : 'offline'}`}>
          <span className="status-dot" />{connected ? 'CONNECTÉ' : pending ? 'CONNEXION…' : 'DÉCONNECTÉ'}
        </div>
        <button className={`button ${connected ? 'button-quiet' : 'button-primary'}`} onClick={connected ? onDisconnect : onConnect} disabled={pending}>
          <PlugZap size={16} />{connected ? 'Déconnecter' : 'Connecter'}
        </button>
        <span className="alerts-indicator" title={`${alertCount} alerte(s)`}><Bell size={17} />{alertCount > 0 && <b>{alertCount}</b>}</span>
      </div>
    </header>
  );
}
