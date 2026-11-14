import { Radio, ScanLine } from 'lucide-react';

function SensorCard({ title, state, topic }) {
  const detected = state === 'detecte';
  return (
    <article className="sensor-card">
      <div className={`sensor-icon ${detected ? 'detected' : ''}`}><ScanLine size={20} /></div>
      <div className="sensor-info"><h3>{title}</h3><span>{topic}</span></div>
      <span className={`sensor-badge ${detected ? 'detected' : state === 'libre' ? 'free' : 'unknown'}`}>
        <i />{detected ? 'DÉTECTÉ' : state === 'libre' ? 'LIBRE' : 'EN ATTENTE'}
      </span>
    </article>
  );
}

export default function SensorStatus({ data, topics }) {
  return (
    <section className="panel sensor-panel">
      <div className="panel-heading"><div><div className="section-kicker">ÉQUIPEMENTS</div><h2>État des capteurs</h2></div><Radio size={18} className="panel-heading-icon" /></div>
      <div className="sensor-list">
        <SensorCard title="Capteur Entrée" state={data.entryState} topic={topics.entryState} />
        <SensorCard title="Capteur Sortie" state={data.exitState} topic={topics.exitState} />
      </div>
    </section>
  );
}
