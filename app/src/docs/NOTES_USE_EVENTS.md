# Notes : Hook useEvents

---

## 1. Les imports

```javascript
import { useState, useEffect, useMemo } from "react";
import { mockEvents, getOrganizationFromTitle } from "../data/mockEvents";
```

| Import | Rôle |
|--------|------|
| `useState` | Créer des variables d'état qui déclenchent un re-render quand elles changent |
| `useEffect` | Exécuter du code au montage du composant (chargement des données) |
| `useMemo` | Mettre en cache un calcul et le recalculer seulement si les dépendances changent |
| `mockEvents` | Données fictives qui simulent la réponse de l'API |
| `getOrganizationFromTitle` | Fonction utilitaire qui extrait "UFC", "Bellator", etc. du titre |

---

## 2. Pourquoi une fonction `useEvents()` ?

```javascript
export function useEvents() {
    // ... tout le code ici
}
```

**Règle React** : Les hooks (`useState`, `useEffect`, etc.) doivent être appelés à l'intérieur d'une fonction composant ou d'un custom hook.

**Avantage** : Chaque composant qui appelle `useEvents()` obtient **sa propre copie** des états. Pas de partage global indésirable.

---

## 3. Les états avec `useState`

```javascript
const [events, setEvents] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [searchTerm, setSearchTerm] = useState("");
const [selectedOrganizations, setSelectedOrganizations] = useState([]);
```

| État | Valeur initiale | Rôle |
|------|-----------------|------|
| `events` | `[]` | Stocke les événements reçus de l'API |
| `loading` | `true` | Indique si les données sont en cours de chargement |
| `error` | `null` | Stocke le message d'erreur si le fetch échoue |
| `searchTerm` | `""` | Texte tapé par l'utilisateur dans la barre de recherche |
| `selectedOrganizations` | `[]` | Organisations cochées dans les filtres (ex: ["UFC", "Bellator"]) |

**Syntaxe** : `const [valeur, setValeur] = useState(valeurInitiale)`
- `valeur` : la donnée actuelle
- `setValeur` : fonction pour modifier la donnée (déclenche un re-render)

---

## 4. Chargement des données avec `useEffect`

```javascript
useEffect(() => {
    const fetchEvents = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setEvents(mockEvents);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }
    fetchEvents();
}, []);
```

### Flux d'exécution :

| Étape | Code | Ce qui se passe |
|-------|------|-----------------|
| 1 | `await new Promise(...)` | Pause de 500ms (simule le délai réseau) |
| 2 | `setEvents(mockEvents)` | Remplit `events` avec les données mock |
| 3 | `finally { setLoading(false) }` | Arrête le loading dans tous les cas |
| Si erreur | `catch { setError(...) }` | Stocke le message d'erreur |

### Le tableau de dépendances `[]` :

- `[]` vide = exécute **une seule fois** au montage
- Si on mettait `[searchTerm]` = exécuterait à chaque changement de `searchTerm`

### Plus tard avec une vraie API :

```javascript
const response = await fetch('https://votre-api.com/events');
const data = await response.json();
setEvents(data);
```

---

## 5. Filtrage et aplatissement avec `useMemo`

```javascript
const filteredFights = useMemo(() => {
    let fights = [];
    
    events.forEach(event => {
        const organization = getOrganizationFromTitle(event.title);

        event.fights.forEach(fight => {
            fights.push({
                ...fight,
                eventTitle: event.title,
                eventDate: event.date,
                eventLink: event.link,
                organization: organization
            });
        });
    });

    return fights;
}, [events, searchTerm, selectedOrganizations]);
```

### Pourquoi aplatir ?

**Structure de l'API (mockEvents)** :
```
Événement 1 (UFC 310)
├── Combat 1 (Pantoja vs Asakura)
├── Combat 2 (Chimaev vs Whittaker)
└── Combat 3 (Dvalishvili vs O'Malley)

Événement 2 (Bellator Paris)
└── Combat 1 (Edwards vs Kasanganay)
```

**Structure aplatie (filteredFights)** :
```
Combat 1 (Pantoja vs Asakura) + infos UFC 310
Combat 2 (Chimaev vs Whittaker) + infos UFC 310
Combat 3 (Dvalishvili vs O'Malley) + infos UFC 310
Combat 4 (Edwards vs Kasanganay) + infos Bellator Paris
```

**Avantage** : Plus facile à afficher (1 card = 1 combat) et à filtrer.

### Le spread operator `...fight` :

```javascript
// fight original
{ main: true, weight: "125", fighterA: {...}, fighterB: {...} }

// Avec ...fight + ajouts
{
    ...fight,              // Copie TOUT : main, weight, fighterA, fighterB
    eventTitle: "UFC 310", // Ajoute
    organization: "UFC"    // Ajoute
}

// Résultat
{ main: true, weight: "125", fighterA: {...}, fighterB: {...}, eventTitle: "UFC 310", organization: "UFC" }
```

### Le tableau de dépendances `[events, searchTerm, selectedOrganizations]` :

| Changement | Recalcul ? |
|------------|------------|
| `events` change (données chargées) | ✅ Oui |
| `searchTerm` change (user tape) | ✅ Oui |
| `selectedOrganizations` change (user filtre) | ✅ Oui |
| Autre chose (ex: scroll) | ❌ Non (garde le cache) |

---

## 6. Flux complet de l'application

```
┌─────────────────────────────────────────────────────────────────┐
│                        AU DÉMARRAGE                             │
├─────────────────────────────────────────────────────────────────┤
│ 1. events = []                                                  │
│ 2. loading = true                                               │
│ 3. useMemo calcule filteredFights = [] (events est vide)        │
│ 4. UI affiche "Chargement..."                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (après 500ms)
┌─────────────────────────────────────────────────────────────────┐
│                     DONNÉES CHARGÉES                            │
├─────────────────────────────────────────────────────────────────┤
│ 1. setEvents(mockEvents) → events = [{...}, {...}, ...]         │
│ 2. setLoading(false) → loading = false                          │
│ 3. React détecte que events a changé                            │
│ 4. useMemo RECALCULE → filteredFights = [combat1, combat2, ...] │
│ 5. UI affiche les cards de combats                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (user tape "Pantoja")
┌─────────────────────────────────────────────────────────────────┐
│                     USER RECHERCHE                              │
├─────────────────────────────────────────────────────────────────┤
│ 1. setSearchTerm("Pantoja") → searchTerm = "Pantoja"            │
│ 2. React détecte que searchTerm a changé                        │
│ 3. useMemo RECALCULE avec le filtre de recherche                │
│ 4. filteredFights = [seulement les combats avec "Pantoja"]      │
│ 5. UI met à jour les cards affichées                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Filtre par recherche

```javascript
if (searchTerm.trim() != '') {
    const search = searchTerm.toLowerCase();
    fights = fights.filter(fight =>
        fight.fighterA.name.toLowerCase().includes(search) ||
        fight.fighterB.name.toLowerCase().includes(search)
    );
}
```

### Comment ça fonctionne :

1. **Vérifier si `searchTerm` n'est pas vide** — `trim()` supprime les espaces
2. **Convertir en minuscules** — pour une recherche insensible à la casse
3. **Filtrer avec `.filter()`** — garde seulement les combats qui correspondent

### Le `.filter()` retourne :

| fighterA | fighterB | search | Résultat | Combat gardé ? |
|----------|----------|--------|----------|----------------|
| "Pantoja" | "Asakura" | "pant" | `true \|\| false` = `true` | ✅ Oui |
| "Pantoja" | "Asakura" | "asak" | `false \|\| true` = `true` | ✅ Oui |
| "Pantoja" | "Asakura" | "chimaev" | `false \|\| false` = `false` | ❌ Non |

---

## 8. Filtre par organisation

```javascript
if (selectedOrganizations.length > 0) {
    fights = fights.filter(fight =>
        selectedOrganizations.includes(fight.organization)
    );
}
```

### Comment ça fonctionne :

1. **Vérifier si des organisations sont sélectionnées** — `length > 0`
2. **Filtrer** — garder seulement les combats dont l'organisation est dans le tableau

### Exemple :

```
selectedOrganizations = ["UFC", "Bellator"]

Combat UFC 310      → "UFC" est dans le tableau     → ✅ Gardé
Combat PFL MENA     → "PFL" n'est pas dans le tableau → ❌ Supprimé
Combat Bellator     → "Bellator" est dans le tableau → ✅ Gardé
```

---

## 9. Tri par date

```javascript
fights.sort((a, b) =>
    new Date(a.eventDate) - new Date(b.eventDate)
);
```

### Comment ça fonctionne :

1. **`new Date()`** — convertit la chaîne de texte en objet Date
2. **Soustraction** — compare les deux dates

### La méthode `.sort()` :

| Retour | Signification |
|--------|---------------|
| Négatif | `a` vient avant `b` |
| Positif | `b` vient avant `a` |
| 0 | Pas de changement |

### Exemple :

```
Date A : 5 décembre 2025
Date B : 7 décembre 2025

new Date(A) - new Date(B) = nombre négatif
→ A vient AVANT B (plus proche en premier)
```

---

## 10. Fonction toggleOrganization

```javascript
const toggleOrganization = (org) => {
    if (selectedOrganizations.includes(org)) {
        setSelectedOrganizations(selectedOrganizations.filter(o => o !== org));
    } else {
        setSelectedOrganizations([...selectedOrganizations, org]);
    }
};
```

### Comment ça fonctionne :

**Si l'organisation est déjà sélectionnée → la retirer :**

```
Avant : ["UFC", "Bellator", "PFL"]
Action : toggleOrganization("Bellator")
Après : ["UFC", "PFL"]
```

Le `.filter(o => o !== org)` garde tous les éléments **sauf** celui qu'on veut retirer.

**Si l'organisation n'est pas sélectionnée → l'ajouter :**

```
Avant : ["UFC"]
Action : toggleOrganization("Bellator")
Après : ["UFC", "Bellator"]
```

Le `[...selectedOrganizations, org]` crée un nouveau tableau avec tous les éléments existants + le nouveau.

---

## 11. Return du hook

```javascript
return {
    fights: filteredFights,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedOrganizations,
    toggleOrganization
};
```

### Ce que les composants reçoivent :

| Propriété | Type | Utilité |
|-----------|------|---------|
| `fights` | tableau | Liste des combats filtrés et triés à afficher |
| `loading` | boolean | Afficher "Chargement..." pendant le fetch |
| `error` | string/null | Afficher un message d'erreur si le fetch échoue |
| `searchTerm` | string | Valeur actuelle de l'input de recherche |
| `setSearchTerm` | fonction | Mettre à jour la recherche quand l'user tape |
| `selectedOrganizations` | tableau | Liste des organisations cochées |
| `toggleOrganization` | fonction | Ajouter/retirer une organisation au clic |

---

## 12. Code complet du hook useEvents

```javascript
import { useState, useEffect, useMemo } from "react";
import { mockEvents, getOrganizationFromTitle } from "../data/mockEvents";

export function useEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOrganizations, setSelectedOrganizations] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 500));
                setEvents(mockEvents);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchEvents();
    }, []);

    const filteredFights = useMemo(() => {
        let fights = [];

        events.forEach(event => {
            const organization = getOrganizationFromTitle(event.title);

            event.fights.forEach(fight => {
                fights.push({
                    ...fight,
                    eventTitle: event.title,
                    eventDate: event.date,
                    eventLink: event.link,
                    organization: organization
                });
            });
        });

        if (searchTerm.trim() != '') {
            const search = searchTerm.toLowerCase();
            fights = fights.filter(fight =>
                fight.fighterA.name.toLowerCase().includes(search) ||
                fight.fighterB.name.toLowerCase().includes(search)
            );
        }

        if (selectedOrganizations.length > 0) {
            fights = fights.filter(fight =>
                selectedOrganizations.includes(fight.organization)
            );
        }

        fights.sort((a, b) =>
            new Date(a.eventDate) - new Date(b.eventDate)
        );

        return fights;
    }, [events, searchTerm, selectedOrganizations]);

    const toggleOrganization = (org) => {
        if (selectedOrganizations.includes(org)) {
            setSelectedOrganizations(selectedOrganizations.filter(o => o !== org));
        } else {
            setSelectedOrganizations([...selectedOrganizations, org]);
        }
    };

    return {
        fights: filteredFights,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        selectedOrganizations,
        toggleOrganization
    };
}
```