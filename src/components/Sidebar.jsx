import { Activity, History, LayoutDashboard, Settings2, Wifi } from 'lucide-react';

const items = [
  { id: 'dashboard', label: 'Vue d’ensemble', icon: LayoutDashboard },
  { id: 'history', label: 'Historique', icon: History },
  { id: 'settings', label: 'Configuration', icon: Settings2 },
];

export default function Sidebar({ page, onNavigate, status, group }) {
  return (
    <aside className="sidebar">
      <a className="brand" href="#" onClick={(event) => { event.preventDefault(); onNavigate('dashboard'); }}>
        <span className="brand-mark"><Activity size={21} /></span>
        <span><strong>MES<span className="brand-dot">.</span></strong><small>PRODUCTION SUITE</small></span>
      </a>
      <div className="nav-caption">ESPACE DE TRAVAIL</div>
      <nav className="side-nav" aria-label="Navigation principale">
        {items.map(({ id, label, icon: Icon }) => (
          <button key={id} className={`nav-item ${page === id ? 'active' : ''}`} onClick={() => onNavigate(id)}>
            <Icon size={18} strokeWidth={1.8} /><span>{label}</span>
            {page === id && <span className="nav-current" />}
          </button>
        ))}
      </nav>
      <div className="sidebar-spacer" />
      <div className="sidebar-system">
        <div className="sidebar-system-title"><span className={`status-dot ${status}`} />BROKER MQTT</div>
        <div className="sidebar-system-line"><Wifi size={14} /> <span>{status === 'connected' ? 'Connecté' : status === 'connecting' || status === 'reconnecting' ? 'Connexion…' : 'Déconnecté'}</span></div>
        <div className="sidebar-system-group">Groupe actif <strong>{group}</strong></div>
      </div>
      <div className="sidebar-footer">Supervision industrielle <span>v1.0</span></div>
    </aside>
  );
}
