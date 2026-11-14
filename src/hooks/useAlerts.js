import { useEffect, useRef, useState } from 'react';

export function useAlerts({ data, status, lastDataAt, connectedAt, minRate, alertDuration, addEvent }) {
  const [alerts, setAlerts] = useState([]);
  const lowRateSince = useRef(null);
  const activeKeys = useRef(new Set());
  const announce = (key, message, severity, active) => {
    const wasActive = activeKeys.current.has(key);
    if (active && !wasActive) {
      activeKeys.current.add(key);
      addEvent({ type: 'Alerte déclenchée', source: 'Supervision', value: message, severity });
    } else if (!active && wasActive) {
      activeKeys.current.delete(key);
    }
  };

  useEffect(() => {
    const evaluate = () => {
      const now = Date.now();
      const currentAlerts = [];
      const push = (key, title, detail, severity, active) => {
        announce(key, title, severity, active);
        if (active) currentAlerts.push({ id: key, title, detail, severity });
      };

      const brokerUnavailable = status === 'disconnected' || status === 'reconnecting';
      push('broker', 'Connexion MQTT perdue', 'Le navigateur n’est pas connecté au broker.', 'critical', brokerUnavailable);
      push('esp32', 'ESP32 hors ligne', 'Le dernier état reçu de l’ESP32 indique offline.', 'critical', data.systemState === 'offline');

      const localWip = data.entryCount !== null && data.exitCount !== null
        ? data.entryCount - data.exitCount
        : null;
      const inconsistent = localWip !== null && (localWip < 0 || (data.wip !== null && data.wip !== localWip));
      push(
        'wip',
        localWip !== null && localWip < 0 ? 'Stock WIP négatif' : 'Incohérence du stock WIP',
        localWip !== null && localWip < 0
          ? 'Les sorties dépassent les entrées. Vérifiez les compteurs.'
          : `Valeur MQTT : ${data.wip ?? '—'} ; calcul local : ${localWip ?? '—'}.`,
        'warning',
        inconsistent,
      );

      if (data.rate !== null && data.rate < Number(minRate)) {
        if (lowRateSince.current === null) lowRateSince.current = now;
      } else {
        lowRateSince.current = null;
      }
      const lowRate = lowRateSince.current !== null
        && now - lowRateSince.current >= Number(alertDuration) * 60_000;
      push('rate', 'Cadence sous le seuil', `Cadence inférieure à ${minRate} pièces/minute depuis ${alertDuration} min.`, 'warning', lowRate);

      const lastTelemetryAt = lastDataAt || connectedAt;
      const noData = lastTelemetryAt && now - lastTelemetryAt.getTime() >= 60_000;
      push('no-data', 'Absence prolongée de données', 'Aucun message de télémétrie valide reçu depuis au moins une minute.', 'warning', Boolean(noData));
      setAlerts(currentAlerts);
    };

    evaluate();
    const timer = window.setInterval(evaluate, 1000);
    return () => window.clearInterval(timer);
  }, [addEvent, alertDuration, connectedAt, data, lastDataAt, minRate, status]);

  return alerts;
}
