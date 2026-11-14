export const DEFAULT_CONFIG = {
  host: 'test.mosquitto.org',
  port: '8081',
  protocol: 'wss',
  path: '/mqtt',
  group: 'Groupe baganda',
  prefix: 'atelier',
  minRate: '4',
  alertDuration: '2',
};

const STORAGE_KEY = 'mes-monitoring-config';

export function loadConfig() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    const config = { ...DEFAULT_CONFIG, ...(saved && typeof saved === 'object' ? saved : {}) };

    if (
      config.host === 'test.mosquitto.org'
      && config.protocol === 'ws'
      && config.port === '8080'
      && config.path === '/mqtt'
    ) {
      config.protocol = DEFAULT_CONFIG.protocol;
      config.port = DEFAULT_CONFIG.port;
    }

    return config;
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

export function saveConfig(config) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function validateConfig(config) {
  const errors = {};
  const port = Number(config.port);
  const minRate = Number(config.minRate);
  const duration = Number(config.alertDuration);
  const host = config.host.trim().replace(/^wss?:\/\//i, '').replace(/\/+$/, '');
  try {
    const parsedHost = new URL(`${config.protocol}://${host}`);
    if (!parsedHost.hostname || parsedHost.port || parsedHost.pathname !== '/' || parsedHost.search || parsedHost.hash || parsedHost.username || parsedHost.password) {
      errors.host = 'Entrez uniquement le nom d’hôte ou l’adresse IP, sans port ni chemin.';
    }
  } catch {
    errors.host = 'L’adresse du broker n’est pas valide.';
  }
  if (!Number.isInteger(port) || port < 1 || port > 65535) errors.port = 'Le port doit être compris entre 1 et 65535.';
  if (!config.group.trim() || /[+#/]/.test(config.group)) errors.group = 'Utilisez un identifiant sans /, + ou #.';
  if (!config.prefix.trim() || /[+#]/.test(config.prefix)) errors.prefix = 'Le préfixe est obligatoire et ne peut pas contenir + ou #.';
  if (!config.path.startsWith('/')) errors.path = 'Le chemin WebSocket doit commencer par /.';
  if (!Number.isFinite(minRate) || minRate < 0) errors.minRate = 'Le seuil doit être un nombre positif ou nul.';
  if (!Number.isFinite(duration) || duration <= 0) errors.alertDuration = 'La durée doit être supérieure à zéro.';
  if (!['ws', 'wss'].includes(config.protocol)) errors.protocol = 'Choisissez ws ou wss.';
  return errors;
}

export function websocketUrl(config) {
  const host = config.host.trim().replace(/^wss?:\/\//i, '').replace(/\/+$/, '');
  const path = config.path.trim().startsWith('/') ? config.path.trim() : `/${config.path.trim()}`;
  return `${config.protocol}://${host}:${Number(config.port)}${path}`;
}
