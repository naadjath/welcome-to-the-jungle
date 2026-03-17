# Welcome to the Jungle - Application de Candidature

## 🚀 Fonctionnalités

Ce projet ajoute un système complet de candidature avec:

- ✅ **Formulaire de candidature** modal et responsive
- 📝 **Questions personnalisées** sur le stage
- 📄 **Upload de CV** (PDF, DOC, DOCX - max 5MB)
- 📧 **Envoi d'emails automatiques**:
  - Email de confirmation au candidat
  - Email avec tous les détails à l'entreprise (avec CV en pièce jointe)
- 🎨 **Design moderne** aligné avec le site

---

## 📋 Installation et Configuration

### 1. Installer les dépendances

```bash
cd wtj-react
npm install
```

### 2. Configurer les variables d'environnement

Créer un fichier `.env` à la racine du projet (basé sur `.env.example`):

```bash
cp .env.example .env
```

**Éditer `.env` avec vos paramètres:**

```env
# Gmail SMTP (ou votre service email)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=votre-email@gmail.com
EMAIL_PASSWORD=votre-mot-de-passe-app

# Email de destination (l'entreprise)
COMPANY_EMAIL=recruiter@company.com

# Serveur
PORT=5000
NODE_ENV=development
```

**⚠️ Pour Gmail:**
1. Activer l'authentification à deux facteurs
2. Créer un [mot de passe d'application](https://myaccount.google.com/apppasswords)
3. Utiliser ce mot de passe dans `EMAIL_PASSWORD`

### 3. Démarrer le serveur

**Terminal 1 - Frontend (Vite):**
```bash
npm run dev
```

**Terminal 2 - Backend (Express):**
```bash
npm run server:dev
```

Le frontend sera sur `http://localhost:5173`
Le backend sera sur `http://localhost:5000`

---

## 📁 Structure des fichiers

```
wtj-react/
├── src/
│   ├── App.tsx
│   ├── JobDetail.tsx          ← Contient le lien pour ouvrir le formulaire
│   ├── ApplicationForm.tsx     ← ✨ NOUVEAU: Composant du formulaire
│   ├── style.css              ← Styles du formulaire ajoutés
│   └── main.tsx
├── server.ts                   ← ✨ NOUVEAU: Backend Express pour les emails
├── package.json               ← Dépendances mises à jour
├── .env                        ← Variables d'environnement (à créer)
└── .env.example               ← Exemple de configuration
```

---

## 🎯 Utilisation

### Pour les candidats:

1. Cliquer sur le bouton **"Postuler"** sur la page d'offre
2. Remplir le formulaire avec:
   - Informations personnelles (nom, email, téléphone)
   - Réponses aux questions sur le stage
   - Charger un CV (PDF ou Word)
3. Cliquer sur "Envoyer ma candidature"
4. Recevoir un email de confirmation

### Pour l'entreprise:

L'entreprise reçoit un email détaillé avec:
- Toutes les informations du candidat
- Les réponses à chaque question
- Le CV en pièce jointe
- La date et heure de candidature

---

## 📧 Contenu des emails

### Email au candidat:
- ✓ Confirmation de réception
- Résumé de la candidature
- Informations de suivi

### Email à l'entreprise:
- Nouvelle candidature pour le poste
- Toutes les réponses du candidat
- CV en pièce jointe
- Coordonnées pour contact direct

---

## 🔒 Sécurité

- ✅ Validation des fichiers (type et taille)
- ✅ Nettoyage des fichiers uploadés après envoi
- ✅ Variables sensibles dans `.env` (pas commitées)
- ✅ Validation côté serveur

---

## 🛠️ Dépannage

### Les emails ne s'envoient pas?

**Vérifier:**
1. Les variables `.env` sont correctes
2. Pour Gmail: vérifier le mot de passe d'app
3. Vérifier que le serveur Express tourne: `npm run server:dev`
4. Voir les logs dans le terminal

### Le formulaire ne s'ouvre pas?

- Vérifier la console navigateur (F12)
- S'assurer que `ApplicationForm` est importé dans `JobDetail.tsx`

### Erreur CORS?

Ajouter un middleware CORS dans `server.ts`:
```typescript
import cors from "cors";
app.use(cors());
```

---

## 📝 Personnalisation

### Modifier les questions du formulaire:

Éditer `ApplicationForm.tsx` et changer les champs `textarea`:

```typescript
<textarea
  name="votreChamp"
  placeholder="Votre question personnalisée..."
/>
```

### Changer les emails de destination:

Dans `.env`:
```env
COMPANY_EMAIL=autre-email@company.com
```

### Personnaliser le design:

Modifier les classes CSS dans `style.css`:
- `.modal-overlay` - Fond du modal
- `.modal-content` - Contenu du formulaire
- `.form-input` - Champs de texte

---

## 🚀 Déploiement

Pour mettre en production:

1. **Frontend (Vercel, Netlify, etc.):**
   ```bash
   npm run build
   ```

2. **Backend (Heroku, Railway, etc.):**
   - Ajouter les variables d'environnement sur la plateforme
   - Déployer avec le fichier `server.ts`

---

## 📞 Support

Des problèmes? Vérifier:
- Les logs du serveur (Terminal 2)
- La console du navigateur (F12)
- Les variables `.env` sont bien chargées
- L'adresse email est correcte

Bon courage! 🎉
