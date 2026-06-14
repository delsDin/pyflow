# PyFlow

PyFlow est une plateforme interactive d'apprentissage intensif du langage Python. Cette application web a pour vocation de fournir aux étudiants un environnement complet : cours théoriques, quiz de validation, défis de programmation interactifs avec bac à sable (sandbox), et une console Linux virtuelle.

L'application est construite avec des technologies web modernes pour assurer des performances élevées et une expérience utilisateur (UX/UI) soignée.

## 🚀 Fonctionnalités Principales

- **Authentification par Code Étudiant :** Connexion simplifiée et sécurisée via un code d'accès unique.
- **Portail Administrateur :** Un espace protégé pour la gestion des formateurs, des étudiants et le déverrouillage de la progression.
- **Tableau de Bord Étudiant :** Suivi de la progression, statistiques, série d'apprentissages en cours (streak) et accès rapides.
- **Lecteur de Cours :** Contenu théorique formaté en Markdown avec coloration syntaxique des exemples de code.
- **Environnement d'Exercices :** 
  - *Quizz Théoriques :* Questions à choix multiples avec validation immédiate.
  - *Défis de Code :* Interpréteur Python embarqué dans le navigateur, vérification des mots-clés requis et exécution sécurisée.
- **Console Virtuelle Linux & REPL Python :** Simulateur terminal permettant d'exécuter de fausses commandes Linux, d'éditer des fichiers et de lancer un REPL.

## 🛠️ Stack Technique

- **Framework Core :** [React 18](https://reactjs.org/) avec [TypeScript](https://www.typescriptlang.org/)
- **Outil de Build :** [Vite](https://vitejs.dev/)
- **Stylisation :** [Tailwind CSS](https://tailwindcss.com/)
- **Icônes :** [Lucide React](https://lucide.dev/)
- **Rendu Markdown :** `react-markdown` & `remark-gfm`
- **Backend / BaaS :** [Supabase](https://supabase.com/) (Authentification, Base de données PostgreSQL, Edge Functions)

## 📁 Structure du Projet

```text
src/
├── components/          # Composants UI (DashboardView, CourseView, AdminView, etc.)
├── data/                # Données statiques de cours et exercices (curriculum.ts, exercises.ts)
├── utils/               # Outils utilitaires (simulateur Python, éditeur de code, requêtes API)
├── types/               # Déclarations des interfaces TypeScript
├── App.tsx              # Composant racine, routeur principal (State-based)
├── main.tsx             # Point d'entrée React
└── index.css            # Styles globaux Tailwind CSS
```

## ⚙️ Installation et Démarrage Local

### Prérequis
- [Node.js](https://nodejs.org/en/) (v18+)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

### Étapes

1. **Cloner et installer les dépendances**
   ```bash
   cd pyflow
   npm install
   ```

2. **Configurer les variables d'environnement**
   Créez un fichier `.env.local` ou copiez le `.env.example` en modifiant avec vos informations Supabase :
   ```env
   VITE_SUPABASE_URL=votre_url_supabase
   VITE_SUPABASE_ANON_KEY=votre_cle_anon_supabase
   ```

3. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```
   L'application sera accessible sur `http://localhost:5173`.

4. **Compiler pour la production**
   ```bash
   npm run build
   ```
   Les fichiers compilés seront générés dans le répertoire `dist/`.

## 🔒 Notes de Sécurité
- Le portail administrateur (`AdminView`) s'active dynamiquement par détection de droits sans exposer de mots de passe ou tokens dans le code source.
- Toutes les actions de mise à jour des droits et données sont vérifiées et sécurisées par des Edge Functions Supabase.
