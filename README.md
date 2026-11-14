# MES — Production Monitoring

Tableau de bord React/Vite qui s’abonne aux topics de télémétrie d’un ESP32 avec MQTT.js sur WebSocket. Aucune valeur n’est simulée : les indicateurs restent vides tant qu’aucun message valide n’a été reçu.

## Lancement local

Prérequis : Node.js 20 ou plus récent.

```powershell
npm install
npm run dev
```

Ouvrir l’URL locale affichée par Vite. Pour générer et prévisualiser la version de production : `npm run build`, puis `npm run preview`.

## Configuration du broker

La configuration par défaut est `test.mosquitto.org`, `wss`, port `8081`, chemin `/mqtt`. Le broker public Mosquitto documente le port **8081** pour MQTT WebSockets TLS et **8080** pour WebSockets non chiffré. Le port TCP `1883` ne fonctionne pas depuis le navigateur. Les ports WebSocket publics peuvent être indisponibles temporairement ; dans ce cas, changer l’hôte, le protocole, le port et le chemin dans **Configuration** pour correspondre à un listener WebSocket accessible.

La configuration est enregistrée dans le stockage local du navigateur. Les réglages de groupe, préfixe, broker et seuils appliqués remplacent la connexion courante par une reconnexion.

## Topics et payloads attendus

Pour le groupe `Groupe baganda` et le préfixe `atelier`, l’application s’abonne à :

| Topic | Payload attendu |
| --- | --- |
| `atelier/Groupe baganda/entree/compteur` | Nombre fini |
| `atelier/Groupe baganda/sortie/compteur` | Nombre fini |
| `atelier/Groupe baganda/entree/etat` | `Libre` ou `Détecté` (les valeurs `0`/`1` sont également acceptées) |
| `atelier/Groupe baganda/sortie/etat` | `Libre` ou `Détecté` (les valeurs `0`/`1` sont également acceptées) |
| `atelier/Groupe baganda/production/ecart` | Nombre fini (WIP fourni par l’ESP32) |
| `atelier/Groupe baganda/production/debit` | Nombre fini (pièces/minute) |
| `atelier/Groupe baganda/systeme/etat` | `online` ou `offline` (les valeurs `0`/`1` sont également acceptées) |

Le nom de groupe contient un espace : celui-ci est conservé tel quel dans le topic MQTT. Si une ancienne configuration est déjà enregistrée dans le navigateur, ouvrez **Configuration**, remplacez le groupe par `Groupe baganda`, puis enregistrez. Adaptez le groupe et le préfixe si le firmware change. L’application n’émet aucun message MQTT. Le firmware publie `online` à la connexion, mais ne publie pas `offline` lorsqu’il perd le Wi-Fi ou s’éteint. Pour une indication hors ligne plus fiable, configurez le Last Will MQTT avec le topic `atelier/Groupe baganda/systeme/etat` et le payload `offline`, puis publiez `online` à la connexion. La connexion du navigateur au broker est suivie séparément.

Le code ESP32 se connecte au broker via MQTT TCP (`test.mosquitto.org:1883`), tandis que l’application Web se connecte au même broker via WebSocket TLS (`test.mosquitto.org:8081`, chemin `/mqtt`). Ce sont deux transports différents vers le même broker ; l’application consomme les messages MQTT, pas une API HTTP/REST. L’ancien réglage par défaut `ws:8080` est automatiquement migré vers `wss:8081` au chargement.

## Fonctionnalités et limites

- Les graphiques et l’historique sont conservés en mémoire pendant la session du navigateur, sans base de données.
- L’export CSV porte sur l’historique de la session ; « vider » et « réinitialiser » ne touchent qu’aux données locales de l’interface et n’envoient aucune commande à l’ESP32.
- L’alerte d’absence de données se déclenche après une minute sans message valide. L’alerte de cadence attend que le débit soit publié sous le seuil pendant la durée configurée.
- Le broker public est ouvert, non authentifié et destiné aux essais : ne publiez aucune donnée sensible et utilisez un broker contrôlé pour une mise en service réelle. Les appareils et clients partagent l’espace de topics public.
