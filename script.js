// Initialisation de la carte
function initMap() {
    // Création de la carte centrée sur Corbeil-Essonnes
    const map = L.map('map').setView([48.615, 2.485], 14);

    // Ajout de la couche OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Style par défaut pour les quartiers
    function getDefaultStyle() {
        return {
            fillColor: '#3388ff',
            weight: 2,
            opacity: 1,
            color: '#ffffff',
            dashArray: '3',
            fillOpacity: 0.5
        };
    }

    // Style au survol
    function getHighlightStyle() {
        return {
            weight: 4,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        };
    }

    // Gestion des événements pour chaque feature
    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: function(e) {
                const layer = e.target;
                layer.setStyle(getHighlightStyle());
                showNeighborhoodInfo(feature.properties);
            },
            mouseout: function(e) {
                const layer = e.target;
                layer.setStyle(getDefaultStyle());
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

        const updateInfoPosition = function(e) {
            info.style.left = (e.pageX + 10) + 'px';
            info.style.top = (e.pageY + 10) + 'px';
        };

        document.addEventListener('mousemove', updateInfoPosition);
        document.body.appendChild(info);
    }

    // Cacher l'infobulle
    function hideNeighborhoodInfo() {
        const info = document.getElementById('neighborhood-info');
        if (info) {
            info.remove();
        }
    }

    // Afficher les informations détaillées
    function showDetailedInfo(properties) {
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

    // Chargement du GeoJSON
    fetch('map.geojson')
        .then(response => response.json())
        .then(data => {
            const geoJsonLayer = L.geoJSON(data, {
                style: getDefaultStyle,
                onEachFeature: onEachFeature
            }).addTo(map);
            
            // Ajuster la vue de la carte pour montrer le GeoJSON
            map.fitBounds(geoJsonLayer.getBounds());
        })
        .catch(error => {
            console.error('Erreur de chargement du GeoJSON:', error);
            document.getElementById('map').innerHTML = 'Erreur de chargement de la carte';
        });
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