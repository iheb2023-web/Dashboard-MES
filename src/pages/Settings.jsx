import { useState } from 'react';
import { Check, Info, Save, Wifi } from 'lucide-react';
import { validateConfig, websocketUrl } from '../utils/config.js';

const fields = [
  { key: 'host', label: 'Adresse du broker', placeholder: 'test.mosquitto.org', help: 'Nom d’hôte ou adresse du broker, sans protocole.' },
  { key: 'port', label: 'Port WebSocket', placeholder: '8080', help: 'Ne pas utiliser le port MQTT TCP 1883 dans le navigateur.', type: 'number' },
  { key: 'path', label: 'Chemin WebSocket', placeholder: '/mqtt', help: 'Chemin configuré sur le broker WebSocket.' },
  { key: 'group', label: 'Identifiant du groupe', placeholder: 'G01', help: 'Utilisé pour construire automatiquement les topics.' },
  { key: 'prefix', label: 'Préfixe des topics', placeholder: 'atelier', help: 'Racine commune aux topics de télémétrie.' },
];

export default function Settings({ config, onSave }) {
  const [draft, setDraft] = useState({ ...config });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const update = (key, value) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };
  const submit = (event) => {
    event.preventDefault();
    const validation = validateConfig(draft);
    setErrors(validation);
    if (Object.keys(validation).length) return;
    try {
      onSave(draft);
      setSaved(true);
      setSaveError('');
    } catch (error) {
      setSaved(false);
      setSaveError(`Impossible d’enregistrer la configuration localement : ${error.message}`);
    }
  };
  return (
    <div className="page-content settings-page">
      <div className="page-intro"><div><p>Configurez le broker, les topics et les seuils de surveillance.</p></div></div>
      <form className="settings-layout" onSubmit={submit} noValidate>
        <section className="panel settings-panel">
          <div className="panel-heading"><div><div className="section-kicker">CONNEXION</div><h2>Broker MQTT</h2></div><Wifi size={18} className="panel-heading-icon" /></div>
          <div className="settings-fields">
            {fields.slice(0, 3).map((field) => <label className="form-field" key={field.key}>
              <span>{field.label}</span>{field.key === 'host' ? <input value={draft[field.key]} placeholder={field.placeholder} onChange={(e) => update(field.key, e.target.value)} /> : field.key === 'port' ? <input type="number" min="1" max="65535" value={draft[field.key]} placeholder={field.placeholder} onChange={(e) => update(field.key, e.target.value)} /> : <input value={draft[field.key]} placeholder={field.placeholder} onChange={(e) => update(field.key, e.target.value)} />}
              {errors[field.key] && <em>{errors[field.key]}</em>}<small>{field.help}</small>
            </label>)}
            <label className="form-field"><span>Protocole</span><select value={draft.protocol} onChange={(e) => update('protocol', e.target.value)}><option value="ws">ws — non chiffré</option><option value="wss">wss — TLS</option></select><small>Le protocole doit correspondre au port du broker.</small></label>
            <div className="endpoint-preview"><span>URL WebSocket calculée</span><code>{websocketUrl(draft)}</code></div>
          </div>
        </section>
        <section className="panel settings-panel">
          <div className="panel-heading"><div><div className="section-kicker">TÉLÉMÉTRIE</div><h2>Topics MQTT</h2></div></div>
          <div className="settings-fields">
            {fields.slice(3).map((field) => <label className="form-field" key={field.key}><span>{field.label}</span><input value={draft[field.key]} placeholder={field.placeholder} onChange={(e) => update(field.key, e.target.value)} />{errors[field.key] && <em>{errors[field.key]}</em>}<small>{field.help}</small></label>)}
            <div className="topic-preview"><strong>Topics abonnés</strong>{['entree/compteur', 'sortie/compteur', 'entree/etat', 'sortie/etat', 'production/ecart', 'production/debit', 'systeme/etat'].map((topic) => <code key={topic}>{draft.prefix}/{draft.group}/{topic}</code>)}</div>
          </div>
        </section>
        <section className="panel settings-panel threshold-panel">
          <div className="panel-heading"><div><div className="section-kicker">ALERTES</div><h2>Seuils de supervision</h2></div></div>
          <div className="settings-fields two-fields">
            <label className="form-field"><span>Seuil minimum de cadence</span><div className="input-with-unit"><input type="number" min="0" step="0.1" value={draft.minRate} onChange={(e) => update('minRate', e.target.value)} /><b>pièces/min</b></div>{errors.minRate && <em>{errors.minRate}</em>}<small>Valeur pédagogique par défaut : 4 pièces/minute.</small></label>
            <label className="form-field"><span>Durée avant alerte</span><div className="input-with-unit"><input type="number" min="0.1" step="0.1" value={draft.alertDuration} onChange={(e) => update('alertDuration', e.target.value)} /><b>minutes</b></div>{errors.alertDuration && <em>{errors.alertDuration}</em>}<small>Durée consécutive sous le seuil avant déclenchement.</small></label>
          </div>
          <div className="settings-note"><Info size={15} />Le seuil de cadence est un seuil pédagogique pour ce TP, pas une norme industrielle.</div>
          <div className="settings-submit"><span>{saved && <><Check size={15} />Configuration enregistrée localement</>}{saveError && <em>{saveError}</em>}</span><button className="button button-primary" type="submit"><Save size={16} />Enregistrer la configuration</button></div>
        </section>
      </form>
    </div>
  );
}
