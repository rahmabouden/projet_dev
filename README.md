# Chat Partagé - Application de Messagerie en Temps Réel

##  Description
Une application web de chat en temps réel permettant à deux utilisateurs de communiquer simultanément avec des fonctionnalités avancées comme l'envoi d'images, de fichiers, et les réactions aux messages.

##  Technologies Utilisées
- **HTML5** - Structure de l'application
- **CSS3** - Styles et design responsive
- **JavaScript (ES6+)** - Logique interactive
- **Local Storage API** - Persistance des données
- **MediaDevices API** - Accès à la caméra
- **FileReader API** - Gestion des fichiers
- **Canvas API** - Capture d'images

##  Fonctionnalités Principales
-  **Chat en temps réel** entre deux utilisateurs
-  **Saisie des noms** personnalisés
-  **Capture photo** directement depuis la caméra
-  **Envoi d'images** depuis la galerie
-  **Partage de fichiers** de tous types
-  **Réactions aux messages** avec emojis
-  **Sauvegarde automatique** dans le navigateur
-  **Design responsive** pour mobile et desktop

##  Lien vers l'Application
** https://rahmabouden.github.io/projet_dev/**

## Nouveautés Explorées
- **Utilisation avancée de l'API MediaDevices** pour l'accès direct à la caméra
- **Manipulation du Canvas** pour la capture d'images en temps réel
- **Gestion complexe du Local Storage** pour la persistance des données
- **Création d'un système de réactions** similaire aux applications modernes


##  Difficultés Rencontrées
1. **Gestion des flux vidéo** : Difficulté à correctement arrêter et libérer les ressources caméra
2. **Synchronisation des réactions** : Logique complexe pour gérer l'ajout/suppression des réactions
3. **Performance des images** : Optimisation des images base64 pour éviter le ralentissement
4. **Gestion des événements** : Propagation des clics dans les modaux et sélecteurs d'emojis

## Solutions Apportées
- **Recherche documentaire** sur l'API MediaDevices et les meilleures pratiques
- **Implémentation de try/catch** pour la gestion robuste des erreurs caméra
- **Optimisation des données** avec compression JPEG et nettoyage du Local Storage
- **Utilisation de stopPropagation()** pour contrôler la propagation des événements
- **Tests intensifs** sur différents navigateurs et appareils

