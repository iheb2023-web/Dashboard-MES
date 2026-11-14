export function formatTime(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(value);
}

export function formatDateTime(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeStyle: 'medium' }).format(value);
}

export function parseNumber(payload) {
  const text = payload.trim();
  if (!text) return null;
  const value = Number(text);
  return Number.isFinite(value) ? value : null;
}

export function parseSensorState(payload) {
  const value = payload.trim().toLocaleLowerCase('fr-FR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (['libre', 'free', '0', 'false'].includes(value)) return 'libre';
  if (['detecte', 'detectee', 'detected', '1', 'true'].includes(value)) return 'detecte';
  return null;
}

export function parseSystemState(payload) {
  const value = payload.trim().toLocaleLowerCase('fr-FR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (['online', 'en ligne', '1', 'true'].includes(value)) return 'online';
  if (['offline', 'hors ligne', '0', 'false'].includes(value)) return 'offline';
  return null;
}
