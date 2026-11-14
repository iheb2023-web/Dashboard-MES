import { Cpu, Radio, Signal, SignalZero } from 'lucide-react';
import { formatDateTime } from '../utils/format.js';

export default function DeviceStatus({ data, status, lastMessageAt }) {
  const online = data.systemState === 'online';
  const brokerUp = status === 'connected';
  return (
    <section className="panel device-panel">
      <div className="panel-heading"><div><div className="section-kicker">PASSERELLE</div><h2>État du système</h2></div><Cpu size={18} className="panel-heading-icon" /></div>
      <div className={`device-status ${online ? 'online' : data.systemState === 'offline' ? 'offline' : 'unknown'}`}>
        <span className="device-status-icon"><Cpu size={21} /></span>
        <div><strong>{online ? 'ESP32 ONLINE' : data.systemState === 'offline' ? 'ESP32 OFFLINE' : 'ESP32 INCONNU'}</strong><span>État transmis par le microcontrôleur</span></div>
        <i />
      </div>
      <div className="device-details">
        <div><span><Radio size={14} />Broker MQTT</span><strong className={brokerUp ? 'text-green' : 'text-red'}>{brokerUp ? 'Connecté' : 'Déconnecté'}</strong></div>
        <div><span><Signal size={14} />Dernier message MQTT</span><strong>{formatDateTime(lastMessageAt)}</strong></div>
      </div>
      <div className="device-disclaimer"><SignalZero size={13} />La connexion au broker ne garantit pas la disponibilité de l’ESP32.</div>
    </section>
  );
}
