# 🌐 Guide d'internationalisation (i18n)

## Vue d'ensemble

Le Dashboard CME supporte maintenant **3 langues** avec le **japonais comme langue par défaut** :

- 🇯🇵 **日本語 (Japonais)** - Langue par défaut
- 🇬🇧 **English (Anglais)**
- 🇫🇷 **Français**

## Fonctionnalités

### Sélecteur de langue
Un sélecteur de langue est intégré dans la barre latérale (sidebar) permettant de :
- Changer instantanément de langue
- Voir la langue actuelle avec un drapeau
- Sauvegarder le choix via un cookie (persistant)

### Couverture complète
Toutes les pages et composants sont traduits :

#### 1. **Navigation et Layout**
- Titre de la sidebar : "Phase Pilote" / "Pilot Phase" / "パイロットフェーズ"
- Sous-titre : "Carnet Mère-Enfant Digital" / "Digital Mother-Child Record" / "デジタル母子手帳"
- Liens de navigation (4 pages)
- Bouton "Actualiser les données" / "Refresh Data" / "データ更新"

#### 2. **Page d'accueil (Home)**
Traduites :
- 4 KPI cards (Femmes Enceintes Enregistrées, Connectées, Objectif Cumulé, Taux d'Atteinte)
- 2 graphiques (Performance par Établissement, Répartition)
- 1 tableau avec 6 colonnes (Établissement, FE Reçues, FE Enregistrées, Taux, etc.)
- Section comparaison (Performance vs Objectif vs Cible Finale)
- Tous les labels, légendes et tooltips

#### 3. **Page Supervision**
Traduites :
- 4 KPI cards (Sages-Femmes Formées/Présentes, FE Enregistrées/Connectées)
- 3 graphiques (Évolution Quotidienne, Par Établissement, Sages-Femmes)
- 2 tableaux cumulés avec 7+ colonnes
- Tous les titres de sections et en-têtes

#### 4. **Page Application**
Même structure que Supervision :
- 4 KPI cards
- 3 graphiques
- 2 tableaux
- Entièrement traduite

#### 5. **Page Comparaison**
Traduites :
- 4 KPI cards (Concordance, Total Supervision/Application)
- 2 graphiques (Comparaison par Établissement, Comparaison Quotidienne)
- 2 tableaux de comparaison
- Tous les indicateurs de différence

## Architecture technique

### Bibliothèque : next-intl
- Compatible Next.js 14 App Router
- Support Server Components et Client Components
- Routing sans modification d'URL
- Cookie pour persistance du choix

### Structure des fichiers

```
messages/
├── ja.json          # Traductions japonaises (par défaut)
├── en.json          # Traductions anglaises
└── fr.json          # Traductions françaises

i18n/
└── request.ts       # Configuration i18n

components/
└── language-switcher.tsx  # Composant sélecteur de langue
```

### Fichiers de traduction
Chaque fichier contient ~150 clés organisées par section :
- `metadata` : Titres de page et descriptions
- `sidebar` : Navigation et boutons
- `home` : Page d'accueil
- `supervision` : Page supervision
- `application` : Page application
- `comparison` : Page comparaison
- `common` : Textes communs (loading, error, etc.)

## Utilisation dans le code

### Server Components
```typescript
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('home');
  
  return <h1>{t('pageTitle')}</h1>;
}
```

### Client Components
```typescript
'use client';
import { useTranslations } from 'next-intl';

export default function Component() {
  const t = useTranslations('home');
  
  return <h1>{t('pageTitle')}</h1>;
}
```

## Exemples de traductions

### Titre de KPI
**Français** : "Femmes Enceintes Enregistrées"
**English** : "Registered Pregnant Women"  
**日本語** : "登録妊婦数"

### En-tête de colonne
**Français** : "Taux d'Enregistrement"
**English** : "Registration Rate"
**日本語** : "登録率"

### Titre de graphique
**Français** : "Performance par Établissement"
**English** : "Performance by Establishment"
**日本語** : "医療機関別"

## Changement de langue

1. Cliquer sur le sélecteur de langue dans la sidebar
2. Sélectionner la langue désirée (🇯🇵 🇬🇧 🇫🇷)
3. La page se recharge automatiquement avec la nouvelle langue
4. Le choix est sauvegardé dans un cookie

## Ajouter une nouvelle langue

1. Créer `messages/[code].json` (ex: `es.json` pour l'espagnol)
2. Copier la structure d'un fichier existant
3. Traduire toutes les clés
4. Ajouter le code dans `i18n/request.ts` :
   ```typescript
   export const locales = ['ja', 'en', 'fr', 'es'] as const;
   ```
5. Ajouter dans `components/language-switcher.tsx` :
   ```typescript
   { code: 'es', name: 'Español', flag: '🇪🇸' }
   ```

## Ajouter une nouvelle clé de traduction

1. Ajouter la clé dans les 3 fichiers `messages/*.json`
2. Utiliser dans le code : `t('nouvelle.cle')`

Exemple pour ajouter un nouveau KPI :
```json
// messages/ja.json
{
  "home": {
    "kpis": {
      "nouveauKPI": "新しいKPI"
    }
  }
}
```

```typescript
// Dans le composant
<KPICard title={t('kpis.nouveauKPI')} />
```

## Performance

- Les traductions sont chargées côté serveur
- Pas d'impact sur le temps de chargement initial
- Le sélecteur de langue ne recharge que les composants nécessaires
- Cookie léger (< 10 bytes)

## Compatibilité

- ✅ Next.js 14 App Router
- ✅ React Server Components
- ✅ React Client Components
- ✅ TypeScript avec types automatiques
- ✅ All modern browsers

## Notes importantes

- **Langue par défaut** : Japonais (ja)
- **Fallback** : Si une clé manque, affiche la clé elle-même
- **Cookie** : `NEXT_LOCALE` expire après 1 an
- **SEO** : Les métadonnées sont traduites automatiquement

## Support

Pour toute question sur l'i18n :
- Consulter la documentation next-intl : https://next-intl-docs.vercel.app/
- Voir les fichiers de traduction dans `messages/`
- Vérifier la configuration dans `i18n/request.ts`
