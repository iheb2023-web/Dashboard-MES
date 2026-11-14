import { useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Activity, BarChart3, Boxes } from 'lucide-react';

const tabs = [
  { id: 'production', label: 'Production', icon: BarChart3 },
  { id: 'rate', label: 'Cadence', icon: Activity },
  { id: 'wip', label: 'Stock WIP', icon: Boxes },
];

export default function ProductionChart({ data }) {
  const [active, setActive] = useState('production');
  const nonEmpty = data.length > 0;
  const yLabel = active === 'rate' ? 'Pièces/min' : active === 'wip' ? 'Pièces en attente' : 'Nombre de pièces';
  return (
    <section className="panel chart-panel">
      <div className="panel-heading chart-heading">
        <div><div className="section-kicker">TENDANCE EN TEMPS RÉEL</div><h2>Performance de production</h2></div>
        <div className="chart-tabs" role="tablist">
          {tabs.map(({ id, label, icon: Icon }) => <button key={id} className={active === id ? 'selected' : ''} onClick={() => setActive(id)}><Icon size={14} />{label}</button>)}
        </div>
      </div>
      {nonEmpty ? (
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid stroke="#edf1f6" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: '#8b97a8', fontSize: 11 }} axisLine={false} tickLine={false} minTickGap={32} label={{ value: 'Heure', position: 'insideBottom', offset: -2, fill: '#8491a3', fontSize: 10 }} />
              <YAxis tick={{ fill: '#8b97a8', fontSize: 11 }} axisLine={false} tickLine={false} width={48} label={{ value: yLabel, angle: -90, position: 'insideLeft', fill: '#8491a3', fontSize: 10 }} />
              <Tooltip contentStyle={{ border: '1px solid #e8edf3', borderRadius: 10, boxShadow: '0 8px 24px #172b4d12' }} labelStyle={{ color: '#475569', fontWeight: 600 }} />
              {active === 'production' ? <>
                <Line type="monotone" dataKey="entree" name="Pièces entrées" stroke="#3678e5" strokeWidth={2.5} dot={false} connectNulls />
                <Line type="monotone" dataKey="sortie" name="Pièces sorties" stroke="#24a47a" strokeWidth={2.5} dot={false} connectNulls />
              </> : active === 'rate' ?
                <Line type="monotone" dataKey="debit" name={yLabel} stroke="#e99538" strokeWidth={2.5} dot={false} connectNulls /> :
                <Line type="monotone" dataKey="wip" name={yLabel} stroke="#8a6be8" strokeWidth={2.5} dot={false} connectNulls />}
              <Legend verticalAlign="top" align="right" height={28} iconType="circle" iconSize={8} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : <div className="chart-empty"><div className="empty-chart-icon"><Activity size={22} /></div><strong>En attente des données MQTT</strong><span>Le graphique s’alimentera à la réception de messages réels.</span></div>}
      <div className="chart-footnote"><span className="live-dot" />Historique en mémoire de session <span className="chart-point-count">{data.length} points</span></div>
    </section>
  );
}
