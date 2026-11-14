import { useMemo } from 'react';
import { Clock3, RefreshCw } from 'lucide-react';
import StatCard from '../components/StatCard.jsx';
import SensorStatus from '../components/SensorStatus.jsx';
import DeviceStatus from '../components/DeviceStatus.jsx';
import ProductionChart from '../components/ProductionChart.jsx';
import AlertsPanel from '../components/AlertsPanel.jsx';
import EventsTable from '../components/EventsTable.jsx';
import { buildTopics } from '../utils/topics.js';
import { formatDateTime } from '../utils/format.js';

export default function Dashboard({ config, mqtt, alerts, onClearEvents }) {
  const topics = useMemo(() => buildTopics(config), [config]);
  return (
    <div className="page-content dashboard-page">
      <div className="page-intro"><div><p>Suivez les indicateurs clés de votre ligne en temps réel.</p><div className="update-label"><Clock3 size={13} />Dernière mise à jour des données : <strong>{formatDateTime(mqtt.lastDataAt)}</strong></div></div>
        <button className="button button-quiet" onClick={mqtt.resetDashboard}><RefreshCw size={15} />Réinitialiser les données locales</button>
      </div>
      {mqtt.lastDataAt === null && <div className="data-notice"><span className="notice-pulse" /><div><strong>Aucune donnée reçue pour le moment</strong><span>Connectez-vous au broker et vérifiez que l’ESP32 publie sur les topics du groupe {config.group}.</span></div></div>}
      <StatCard data={mqtt.data} />
      <div className="main-grid">
        <div className="main-column">
          <SensorStatus data={mqtt.data} topics={topics} />
          <ProductionChart data={mqtt.chartData} />
          <EventsTable events={mqtt.events} onClear={onClearEvents} compact />
        </div>
        <div className="side-column">
          <DeviceStatus data={mqtt.data} status={mqtt.status} lastMessageAt={mqtt.lastMessageAt} />
          <AlertsPanel alerts={alerts} />
        </div>
      </div>
      <div className="dashboard-footnote">Les données affichées proviennent exclusivement des messages MQTT reçus. Réinitialiser les statistiques n’envoie aucune commande à l’ESP32.</div>
    </div>
  );
}
