// Initialisation de la carte
function initMap() {
    // Coordonnées du centre de Corbeil-Essonnes
    const cityCenter = [48.614, 2.4837];

    // Création de la carte
    const map = L.map('map').setView(cityCenter, 13);

    // Ajout de la couche OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Style par défaut pour les quartiers
    function getDefaultStyle(feature) {
        return {
            fillColor: getColorForNeighborhood(feature.properties.name),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }

    // Style au survol
    function getHighlightStyle(feature) {
        return {
            weight: 3,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.8,
            transform: 'scale(1.01)', // Effet de grossissement
            transition: 'all 0.3s'
        };
    }

    // Fonction pour obtenir une couleur en fonction du nom du quartier
    function getColorForNeighborhood(name) {
        const colors = {
            'Quartier1': '#ff7f00',
            'Quartier2': '#377eb8',
            'Quartier3': '#4daf4a',
            'Quartier4': '#984ea3',
            // Ajoutez d'autres quartiers et couleurs selon vos besoins
        };
        return colors[name] || '#ff7f00'; // Couleur par défaut si le quartier n'est pas listé
    }

    // Gestion des événements pour chaque feature
    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: function(e) {
                const layer = e.target;
                layer.setStyle(getHighlightStyle(feature));
                layer.bringToFront();
                showNeighborhoodInfo(feature.properties);
            },
            mouseout: function(e) {
                const layer = e.target;
                layer.setStyle(getDefaultStyle(feature));
                hideNeighborhoodInfo();
            },
            click: function(e) {
                showDetailedInfo(feature.properties);
            }
        });
    }

    // Afficher les informations du quartier dans une infobulle
    function showNeighborhoodInfo(properties) {
        const info = document.createElement('div');
        info.id = 'neighborhood-info';
        info.innerHTML = `
            <h3>${properties.name}</h3>
            <p>Population: ${properties.population}</p>
            <p>Surface: ${properties.area} km²</p>
        `;
        document.body.appendChild(info);
    }

    // Cacher l'infobulle
    function hideNeighborhoodInfo() {
        const info = document.getElementById('neighborhood-info');
        if (info) {
            info.remove();
        }
    }

    // Afficher les informations détaillées dans un panneau
    function showDetailedInfo(properties) {
        // Exemple d'affichage des données détaillées
        const detailsHtml = `
            <h3>${properties.name}</h3>
            <ul>
                <li>Population: ${properties.population}</li>
                <li>Surface: ${properties.area} km²</li>
                <li>Densité: ${properties.density} hab/km²</li>
                <li>Espaces verts: ${properties.greenSpaces}</li>
                <li>Écoles: ${properties.schools}</li>
            </ul>
        `;
        document.getElementById('neighborhood-details').innerHTML = detailsHtml;
    }

    // Exemple de chargement d'un fichier GeoJSON
    fetch('map.geojson')
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, {
                style: getDefaultStyle,
                onEachFeature: onEachFeature
            }).addTo(map);
        })
        .catch(error => console.error('Erreur de chargement du GeoJSON:', error));
}

// Fonction pour charger les données démographiques
function loadDemographicData() {
    // Simulation de données (à remplacer par des données réelles)
    const demographicData = {
        population: 150000,
        averageAge: 42,
        households: 62000
    };

    const html = `
        <ul>
            <li>Population: ${demographicData.population}</li>
            <li>Âge moyen: ${demographicData.averageAge} ans</li>
            <li>Nombre de foyers: ${demographicData.households}</li>
        </ul>
    `;

    document.getElementById('demographic-data').innerHTML = html;
}

// Fonction pour charger les données des services publics
function loadPublicServices() {
    // Simulation de données (à remplacer par des données réelles)
    const services = [
        'Mairie',
        'Bibliothèque municipale',
        'Centre sportif',
        'École primaire'
    ];

    const html = `
        <ul>
            ${services.map(service => `<li>${service}</li>`).join('')}
        </ul>
    `;

    document.getElementById('public-services').innerHTML = html;
}

// Fonction pour charger les données environnementales
function loadEnvironmentalData() {
    // Simulation de données (à remplacer par des données réelles)
    const environmentalData = {
        greenSpaces: '120 hectares',
        airQuality: 'Bonne',
        recyclingRate: '68%'
    };

    const html = `
        <ul>
            <li>Espaces verts: ${environmentalData.greenSpaces}</li>
            <li>Qualité de l'air: ${environmentalData.airQuality}</li>
            <li>Taux de recyclage: ${environmentalData.recyclingRate}</li>
        </ul>
    `;

    document.getElementById('environmental-data').innerHTML = html;
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    loadDemographicData();
    loadPublicServices();
    loadEnvironmentalData();
});