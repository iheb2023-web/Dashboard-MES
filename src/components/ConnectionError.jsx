import { AlertCircle, X } from 'lucide-react';

export default function ConnectionError({ error, onDismiss }) {
  if (!error) return null;
  return <div className="connection-error"><AlertCircle size={16} /><span>Erreur MQTT : {error}</span><button aria-label="Fermer" onClick={onDismiss}><X size={15} /></button></div>;
}
