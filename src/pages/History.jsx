import EventsTable from '../components/EventsTable.jsx';

export default function History({ events, onClear }) {
  return <div className="page-content history-page">
    <div className="page-intro"><div><p>Consultez et exportez les événements MQTT reçus pendant cette session.</p><div className="update-label">Historique conservé en mémoire — {events.length} événement(s)</div></div></div>
    <EventsTable events={events} onClear={onClear} />
    <div className="history-retention">Les événements sont stockés localement en mémoire et disparaissent à la fermeture ou au rechargement de la page.</div>
  </div>;
}
