import { Activity, Download, Trash2 } from 'lucide-react';
import { formatDateTime } from '../utils/format.js';

export function exportEventsCsv(events) {
  const quote = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
  const rows = [
    ['Date et heure', 'Type d’événement', 'Source', 'Valeur reçue'],
    ...events.map((event) => [formatDateTime(event.at), event.type, event.source, event.value]),
  ];
  const csv = `\uFEFF${rows.map((row) => row.map(quote).join(';')).join('\r\n')}`;
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `historique-mes-${new Date().toISOString().slice(0, 10)}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function EventsTable({ events, onClear, compact = false }) {
  const visibleEvents = compact ? events.slice(0, 6) : events;
  return (
    <section className="panel events-panel">
      <div className="panel-heading events-heading">
        <div><div className="section-kicker">JOURNAL D’ACTIVITÉ</div><h2>{compact ? 'Événements récents' : 'Historique des événements'}</h2></div>
        <div className="event-actions">
          {!compact && <button className="button button-quiet" onClick={() => exportEventsCsv(events)} disabled={!events.length}><Download size={15} />Exporter CSV</button>}
          <button className="button button-quiet danger-quiet" onClick={onClear} disabled={!events.length}><Trash2 size={15} />{compact ? 'Vider' : 'Vider l’historique'}</button>
        </div>
      </div>
      {visibleEvents.length ? <div className="table-scroll"><table><thead><tr><th>Date et heure</th><th>Type d’événement</th><th>Capteur / source</th><th>Valeur reçue</th></tr></thead><tbody>
        {visibleEvents.map((event) => <tr key={event.id}><td className="event-time">{formatDateTime(event.at)}</td><td><span className={`event-marker ${event.severity || ''}`} />{event.type}</td><td className="event-source">{event.source}</td><td className="event-value">{event.value}</td></tr>)}
      </tbody></table></div> : <div className="empty-events"><Activity size={21} /><strong>Aucun événement enregistré</strong><span>Les messages reçus apparaîtront ici.</span></div>}
      {compact && events.length > 6 && <div className="table-more">Les 6 événements les plus récents sur {events.length}</div>}
    </section>
  );
}
