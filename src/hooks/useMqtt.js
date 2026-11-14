import { useCallback, useEffect, useRef, useState } from 'react';
import { connectMqtt } from '../services/mqttService.js';
import { formatTime } from '../utils/format.js';

const EMPTY_DATA = {
  entryCount: null,
  exitCount: null,
  entryState: null,
  exitState: null,
  wip: null,
  rate: null,
  systemState: null,
};

const HISTORY_LIMIT = 240;
const EVENT_LIMIT = 500;

export function useMqtt(config) {
  const [status, setStatus] = useState('connecting');
  const [data, setData] = useState(EMPTY_DATA);
  const [chartData, setChartData] = useState([]);
  const [events, setEvents] = useState([]);
  const [lastMessageAt, setLastMessageAt] = useState(null);
  const [lastDataAt, setLastDataAt] = useState(null);
  const [connectedAt, setConnectedAt] = useState(null);
  const [error, setError] = useState('');
  const connectionRef = useRef(null);
  const dataSnapshotRef = useRef(EMPTY_DATA);

  const addEvent = useCallback((event) => {
    setEvents((current) => [{ id: `${Date.now()}-${Math.random()}`, at: new Date(), ...event }, ...current].slice(0, EVENT_LIMIT));
  }, []);
  const clearError = useCallback(() => setError(''), []);

  const disconnect = useCallback(() => {
    connectionRef.current?.disconnect();
    connectionRef.current = null;
    setStatus('disconnected');
  }, []);

  const connect = useCallback(() => {
    disconnect();
    setError('');
    setStatus('connecting');
    connectionRef.current = connectMqtt(config, {
      onStatus: (nextStatus) => {
        setStatus(nextStatus);
        if (nextStatus === 'connected') {
          setConnectedAt(new Date());
          setError('');
        }
      },
      onError: (message) => setError(message),
      onInvalidMessage: ({ topic, payload }) => {
        setLastMessageAt(new Date());
        addEvent({ type: 'Message MQTT invalide', source: topic, value: payload || '(vide)', severity: 'warning' });
      },
      onMessage: ({ key, topic, payload, value, receivedAt }) => {
        setLastMessageAt(receivedAt);
        setLastDataAt(receivedAt);
        let eventType = 'Message MQTT reçu';
        let source = topic;
        const previous = dataSnapshotRef.current;
        const next = { ...previous, [key]: value };
        dataSnapshotRef.current = next;
        setData(next);
        if (key === 'entryCount') eventType = 'Compteur d’entrée mis à jour';
        if (key === 'exitCount') eventType = 'Compteur de sortie mis à jour';
        if (key === 'entryState') {
          eventType = value === 'detecte' && previous.entryState !== 'detecte'
            ? 'Pièce détectée à l’entrée'
            : 'État du capteur modifié';
          source = 'Capteur entrée';
        }
        if (key === 'exitState') {
          eventType = value === 'detecte' && previous.exitState !== 'detecte'
            ? 'Pièce détectée à la sortie'
            : 'État du capteur modifié';
          source = 'Capteur sortie';
        }
        if (key === 'systemState') {
          eventType = 'État ESP32 reçu';
          source = 'ESP32';
        }
        setChartData((history) => {
          const point = {
            time: formatTime(receivedAt),
            timestamp: receivedAt.getTime(),
            entree: next.entryCount,
            sortie: next.exitCount,
            debit: next.rate,
            wip: next.entryCount !== null && next.exitCount !== null ? next.entryCount - next.exitCount : next.wip,
          };
          const last = history[history.length - 1];
          if (last && last.timestamp === point.timestamp) return [...history.slice(0, -1), point];
          return [...history, point].slice(-HISTORY_LIMIT);
        });
        addEvent({ type: eventType, source, value: payload });
      },
    });
  }, [addEvent, config, disconnect]);

  useEffect(() => {
    connect();
    return disconnect;
  }, [connect, disconnect]);

  const clearHistory = useCallback(() => setEvents([]), []);
  const resetDashboard = useCallback(() => {
    setData(EMPTY_DATA);
    setChartData([]);
    setLastMessageAt(null);
    setLastDataAt(null);
    setConnectedAt(connectionRef.current ? new Date() : null);
    dataSnapshotRef.current = EMPTY_DATA;
    setConnectedAt(status === 'connected' ? new Date() : null);
    addEvent({ type: 'Réinitialisation locale du tableau de bord', source: 'Interface Web', value: 'Aucune commande envoyée à l’ESP32' });
  }, [addEvent, status]);

  return {
    status, data, chartData, events, lastMessageAt, lastDataAt, connectedAt, error,
    connect, disconnect, clearHistory, resetDashboard, addEvent,
    clearError,
  };
}
