# TSP-IMAGIN-2025 - Portail Citoyen de Corbeil-Essonnes

## 📋 Description

Portail Citoyen est une application web interactive développée pour la ville de Corbeil-Essonnes dans le cadre de la semaine IMAGIN 2025 (2ème année du cursus d'ingénieur de Télécom SudParis). Cette plateforme permet aux citoyens de découvrir leur ville, de consulter des informations sur les quartiers, d'explorer les espaces verts et de participer à la vie locale via un forum et un système de dépôt de plaintes.

## ✨ Fonctionnalités

### 🗺️ Carte Interactive
- **Visualisation des 11 quartiers** de Corbeil-Essonnes avec des données géospatiales détaillées
- **Système de recherche d'adresses** avec autocomplétion via Nominatim (OpenStreetMap)
- **Affichage des espaces verts** avec différentes catégories :
  - GAZON (pelouses)
  - MASSIF_VIVACES (massifs de vivaces)
  - CHEMINEMENT (chemins)
- **Informations détaillées** : population, surface, densité, espaces verts et écoles par quartier
- **Contrôles de couches** pour activer/désactiver l'affichage des espaces verts
- **Bouton de réinitialisation** de la vue de la carte

### 📝 Dépôt de Plaintes
- Formulaire de plainte citoyenne avec les catégories suivantes :
  - Voirie
  - Propreté
  - Nuisances sonores
  - Éclairage public
  - Autres
- Upload de photos pour illustrer la plainte
- Validation et messages de confirmation

### 💬 Forum Citoyen
- Création de sujets de discussion par catégories :
  - Vie Locale
  - Événements
  - Projets Urbains
  - Environnement
- Interface intuitive pour publier et consulter les discussions
- Sujets d'exemple préchargés

### 📊 Données de la Ville
- Informations démographiques
- Liste des services publics
- Données environnementales

## 🛠️ Technologies Utilisées

### Frontend
- **HTML5** - Structure des pages
- **CSS3** - Styling moderne avec variables CSS et responsive design
- **JavaScript (Vanilla)** - Logique applicative
- **Leaflet.js** (v1.7.1) - Bibliothèque de cartographie interactive
- **Proj4js** (v2.8.0) - Conversion de coordonnées EPSG:2154 → WGS84
- **OpenStreetMap** - Tiles de fond de carte
- **Nominatim** - API de géocodage

### Données Géospatiales
- **GeoJSON** - Format pour les données géographiques
- **EPSG:2154** (Lambert 93) - Système de projection français pour les espaces verts

### Backend & Tests
- **Python** - Script de test pour génération de cartes Dobble (tri des déchets)

## 📁 Structure du Projet

```
TSP-IMAGIN-2025/
├── index.html              # Page d'accueil avec carte interactive
├── plainte.html            # Page de dépôt de plainte
├── forum.html              # Page du forum citoyen
├── script.js               # Logique principale de la carte
├── complaint.js            # Gestion des plaintes
├── forum.js                # Gestion du forum
├── styles.css              # Styles CSS globaux
├── test.py                 # Script Python pour génération cartes Dobble
├── img/
│   ├── logo.png           # Logo de la ville
│   └── corbeil-essonnes.jpg # Image héro
├── [1-11].geojson          # Fichiers GeoJSON des 11 quartiers
└── esp_vert.geojson        # Données des espaces verts
```

## 🗺️ Quartiers de Corbeil-Essonnes

La carte affiche les 11 quartiers suivants :
1. Bas-Coudray Pressoir-Prompt
2. Centre-ville
3. Centre Essonnes
4. Coquibus
5. Ermitage
6. Montconseil
7. Moulin-Galant
8. Nacelle Papeterie
9. Robinson
10. Rive Droite
11. Tarterêts

## 🚀 Installation et Utilisation

### Prérequis
- Un navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Connexion Internet pour charger les bibliothèques externes et les tiles OpenStreetMap

### Installation Locale

1. **Cloner le dépôt** :
```bash
git clone https://github.com/alistairl1/TSP-IMAGIN-2025.git
cd TSP-IMAGIN-2025
```

2. **Servir les fichiers** :

Pour éviter les problèmes CORS avec les fichiers GeoJSON, servez les fichiers via un serveur local :

**Avec Python** :
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Avec Node.js** :
```bash
npx http-server
```

**Avec PHP** :
```bash
php -S localhost:8000
```

3. **Accéder à l'application** :
Ouvrez votre navigateur et allez à `http://localhost:8000`

### Déploiement GitHub Pages

L'application est actuellement déployée sur :
**https://alistairl1.github.io/TSP-IMAGIN-2025/**

## 🎨 Personnalisation

### Couleurs
Les couleurs principales sont définies dans `styles.css` via des variables CSS :
```css
:root {
    --primary-color: #0066b3;    /* Bleu principal */
    --secondary-color: #00a0e6;  /* Bleu secondaire */
    --accent-color: #ff6b00;     /* Orange pour les accents */
}
```

### Données des Quartiers
Pour modifier les données des quartiers, éditez les fichiers `[1-11].geojson` et ajoutez les propriétés souhaitées dans la section `properties` de chaque feature.

### Espaces Verts
Le fichier `esp_vert.geojson` contient les données des espaces verts avec leurs propriétés :
- `cat_entite` : Type d'espace vert
- `surf_entit` : Surface en m²
- `ent_entite` : Type d'entretien
- `nom_site` : Nom du site

## 🌐 API Utilisées

### Nominatim (OpenStreetMap)
- **Service** : Géocodage et recherche d'adresses
- **Limitation** : Zones géographiques limitées à Corbeil-Essonnes
- **Usage** : Recherche d'adresses dans la carte interactive

### OpenStreetMap Tiles
- **Service** : Fond de carte
- **Attribution** : © OpenStreetMap contributors

## 📱 Responsive Design

L'application est entièrement responsive et s'adapte aux différentes tailles d'écran :
- **Desktop** : Mise en page complète avec carte grande taille
- **Tablette** : Adaptation des contrôles et de la carte
- **Mobile** : Navigation verticale, carte réduite, formulaires optimisés

## 🔧 Configuration

### Coordonnées de la Ville
La carte est centrée sur Corbeil-Essonnes :
- **Latitude** : 48.614389
- **Longitude** : 2.471111
- **Niveau de zoom initial** : 13

### Système de Projection
Les espaces verts utilisent le système **EPSG:2154** (Lambert 93) et sont convertis en **WGS84** (EPSG:4326) pour l'affichage dans Leaflet.

## 🐛 Résolution de Problèmes

### Les fichiers GeoJSON ne se chargent pas
- Assurez-vous d'utiliser un serveur local (pas de simple ouverture de fichier)
- Vérifiez la console du navigateur pour les erreurs CORS

### La carte ne s'affiche pas correctement
- Vérifiez votre connexion Internet
- Assurez-vous que Leaflet et Proj4js sont bien chargés
- Vérifiez les erreurs dans la console du navigateur

### Les espaces verts ne s'affichent pas
- Cliquez sur la case à cocher "Espaces verts" dans les contrôles de la carte
- Vérifiez que le fichier `esp_vert.geojson` existe et est accessible

## 📝 Script Python (test.py)

Le fichier `test.py` contient un script pour générer des cartes Dobble sur le thème du tri des déchets. Ce script nécessite :
- Python 3
- Pillow (PIL)
- Bibliothèque math

Pour l'exécuter :
```bash
pip install Pillow
python test.py
```

## 🤝 Contribution

Ce projet fait partie du programme IMAGIN 2025. Pour contribuer :
1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est développé dans le cadre du programme TSP-IMAGIN 2025.

## 👥 Auteur

- **LUCET Alistair**  - [alistairl1](https://github.com/alistairl1)
- **ASTIER Noah** - [nonoast](https://github.com/nonoast)

## 🙏 Remerciements

- OpenStreetMap contributors pour les données cartographiques
- Leaflet.js pour la bibliothèque de cartographie
- La ville de Corbeil-Essonnes pour les données géospatiales

## 📞 Contact

Pour toute question ou suggestion concernant le Portail Citoyen de Corbeil-Essonnes, veuillez contacter l'équipe du projet.

---

**Note** : Ce projet est une démonstration d'un portail citoyen interactif développé pour améliorer l'engagement et la participation des citoyens dans la vie locale de Corbeil-Essonnes.
