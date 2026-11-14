import mqtt from 'mqtt';
import { buildTopics } from '../utils/topics.js';
import { parseNumber, parseSensorState, parseSystemState } from '../utils/format.js';
import { websocketUrl } from '../utils/config.js';

export function connectMqtt(config, handlers) {
  const topics = buildTopics(config);
  const client = mqtt.connect(websocketUrl(config), {
    clientId: `mes_${config.group}_${Math.random().toString(16).slice(2, 10)}`,
    clean: true,
    connectTimeout: 10_000,
    reconnectPeriod: 3_000,
    keepalive: 30,
  });

  client.on('connect', () => {
    handlers.onStatus('connected');
    client.subscribe(Object.values(topics), { qos: 0 }, (error) => {
      if (error) handlers.onError(`Échec de l’abonnement MQTT : ${error.message}`);
    });
  });
  client.on('reconnect', () => handlers.onStatus('reconnecting'));
  client.on('offline', () => handlers.onStatus('disconnected'));
  client.on('close', () => handlers.onStatus('disconnected'));
  client.on('error', (error) => handlers.onError(error.message));
  client.on('message', (topic, buffer) => {
    const payload = buffer.toString();
    const key = Object.keys(topics).find((candidate) => topics[candidate] === topic);
    if (!key) return;

    let value = payload.trim();
    if (['entryCount', 'exitCount', 'wip', 'rate'].includes(key)) {
      value = parseNumber(payload);
      if (value === null) {
        handlers.onInvalidMessage({ topic, payload });
        return;
      }
    } else {
      value = key === 'systemState' ? parseSystemState(payload) : parseSensorState(payload);
      if (value === null) {
        handlers.onInvalidMessage({ topic, payload });
        return;
      }
    }
    handlers.onMessage({ key, topic, payload, value, receivedAt: new Date() });
  });

  return {
    topics,
    disconnect: () => client.end(true),
  };
}
