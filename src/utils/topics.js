export function buildTopics({ prefix, group }) {
  const root = `${prefix.trim()}/${group.trim()}`;
  return {
    entryCount: `${root}/entree/compteur`,
    exitCount: `${root}/sortie/compteur`,
    entryState: `${root}/entree/etat`,
    exitState: `${root}/sortie/etat`,
    wip: `${root}/production/ecart`,
    rate: `${root}/production/debit`,
    systemState: `${root}/systeme/etat`,
  };
}

export function topicMetadata(topics) {
  return Object.entries(topics).map(([key, topic]) => ({ key, topic }));
}
