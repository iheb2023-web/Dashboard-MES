import { useMemo, useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import ConnectionError from './components/ConnectionError.jsx';
import Dashboard from './pages/Dashboard.jsx';
import History from './pages/History.jsx';
import Settings from './pages/Settings.jsx';
import { useMqtt } from './hooks/useMqtt.js';
import { useAlerts } from './hooks/useAlerts.js';
import { loadConfig, saveConfig } from './utils/config.js';

const titles = { dashboard: 'Vue d’ensemble', history: 'Historique', settings: 'Configuration' };

export default function App() {
  const [config, setConfig] = useState(loadConfig);
  const [page, setPage] = useState('dashboard');
  const mqtt = useMqtt(config);
  const alerts = useAlerts({
    data: mqtt.data,
    status: mqtt.status,
    lastDataAt: mqtt.lastDataAt,
    connectedAt: mqtt.connectedAt,
    minRate: config.minRate,
    alertDuration: config.alertDuration,
    addEvent: mqtt.addEvent,
  });
  const savedConfig = useMemo(() => config, [config]);

  const handleSave = (nextConfig) => {
    saveConfig(nextConfig);
    setConfig({ ...nextConfig });
  };

  return (
    <div className="app-shell">
      <Sidebar page={page} onNavigate={setPage} status={mqtt.status} group={savedConfig.group} />
      <div className="app-main">
        <Header pageTitle={titles[page]} group={savedConfig.group} status={mqtt.status} onConnect={mqtt.connect} onDisconnect={mqtt.disconnect} alertCount={alerts.length} />
        <ConnectionError error={mqtt.error} onDismiss={mqtt.clearError} />
        {page === 'dashboard' && <Dashboard config={savedConfig} mqtt={mqtt} alerts={alerts} onClearEvents={mqtt.clearHistory} />}
        {page === 'history' && <History events={mqtt.events} onClear={mqtt.clearHistory} />}
        {page === 'settings' && <Settings config={savedConfig} onSave={handleSave} />}
      </div>
    </div>
  );
}
