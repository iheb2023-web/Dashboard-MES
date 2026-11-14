import { ArrowDownRight, ArrowUpRight, Boxes, Gauge, PackageCheck, PackagePlus } from 'lucide-react';

const cards = [
  { key: 'entryCount', title: 'Pièces entrées', subtitle: 'Cumul entrée convoyeur', icon: PackagePlus, color: 'blue' },
  { key: 'exitCount', title: 'Pièces sorties', subtitle: 'Cumul sortie convoyeur', icon: PackageCheck, color: 'green' },
  { key: 'wip', title: 'Stock WIP', subtitle: 'En attente entre capteurs', icon: Boxes, color: 'violet' },
  { key: 'rate', title: 'Cadence', subtitle: 'Pièces par minute', icon: Gauge, color: 'orange', unit: 'pièces/min' },
];

export default function StatCard({ data }) {
  return (
    <div className="stats-grid">
      {cards.map(({ key, title, subtitle, icon: Icon, color, unit }) => {
        const value = key === 'wip' && data.entryCount !== null && data.exitCount !== null
          ? data.entryCount - data.exitCount
          : data[key];
        const mismatch = key === 'wip' && value !== null && data.wip !== null && value !== data.wip;
        return (
          <article className={`stat-card ${color}`} key={key}>
            <div className="stat-top"><span className="stat-title">{title}</span><span className={`stat-icon ${color}`}><Icon size={19} /></span></div>
            <div className="stat-value">{value === null ? <span className="value-placeholder">—</span> : Number(value).toLocaleString('fr-FR')}{unit && value !== null && <span className="stat-unit">{unit}</span>}</div>
            <div className="stat-bottom"><span>{subtitle}</span>{mismatch ? <span className="stat-warning"><ArrowDownRight size={13} />Écart MQTT : {data.wip}</span> : key === 'wip' && value !== null && data.wip !== null ? <span className="stat-ok"><ArrowUpRight size={13} />Cohérent</span> : null}</div>
          </article>
        );
      })}
    </div>
  );
}
