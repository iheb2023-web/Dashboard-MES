import { AlertTriangle, CheckCircle2, CircleAlert } from 'lucide-react';

export default function AlertsPanel({ alerts }) {
  return (
    <section className="panel alerts-panel">
      <div className="panel-heading"><div><div className="section-kicker">SURVEILLANCE</div><h2>Alertes actives</h2></div><span className={`alert-count ${alerts.length ? 'has-alerts' : ''}`}>{alerts.length}</span></div>
      {alerts.length ? <div className="alerts-list">{alerts.map((alert) => <div className={`alert-row ${alert.severity}`} key={alert.id}><span className="alert-row-icon"><AlertTriangle size={16} /></span><div><strong>{alert.title}</strong><p>{alert.detail}</p></div></div>)}</div> :
        <div className="all-clear"><CheckCircle2 size={19} /><div><strong>Aucune alerte active</strong><span>Les indicateurs sont surveillés en continu.</span></div></div>}
      <div className="alert-note"><CircleAlert size={13} />Seuil pédagogique configurable — non normatif</div>
    </section>
  );
}
