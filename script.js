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

    // Palette de couleurs pour les différentes zones
    const zoneColors = {
        1: '#FF5733',  // Orange-rouge
        2: '#33FF57',  // Vert clair
        3: '#3357FF',  // Bleu
        4: '#FF33F6',  // Rose
        5: '#33FFF6',  // Cyan
        6: '#F6FF33',  // Jaune
        7: '#9933FF',  // Violet
        8: '#FF8333',  // Orange
        9: '#33FF83',  // Vert menthe
        10: '#8333FF', // Violet foncé
        11: '#FF3333'  // Rouge
    };

    // Style par défaut pour les zones
    function getDefaultStyle(zoneNumber) {
        return {
            fillColor: zoneColors[zoneNumber],
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }

    // Style au survol
    function getHighlightStyle(zoneNumber) {
        return {
            weight: 3,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.8,
            fillColor: zoneColors[zoneNumber]
        };
    }

    // Noms des quartiers
    const quartierNames = {
        1: 'Bas-Coudray Pressoir-Prompt',
        2: 'Centre-ville',
        3: 'Centre Essonnes',
        4: 'Coquibus',
        5: 'Ermitage',
        6: 'Montconseil',
        7: 'Moulin-Galant',
        8: 'Nacelle Papeterie',
        9: 'Robinson',
        10: 'Rive Droite',
        11: 'Tarterêts'
    };

    // Style pour les labels des zones
    function createLabelIcon(zoneName) {
        return L.divIcon({
            className: 'zone-label',
            html: zoneName,
            iconSize: [120, 40],
            iconAnchor: [60, 20]
        });
    }

    // Gestion des événements pour chaque feature
    function onEachFeature(feature, layer) {
        const zoneNumber = feature.properties.zone || 1;
        
        // Propriétés par défaut si non définies
        const properties = {
            name: quartierNames[zoneNumber] || `Zone ${zoneNumber}`,
            population: feature.properties.population || 'Non disponible',
            area: feature.properties.area || 'Non disponible',
            density: feature.properties.density || 'Non disponible',
            greenSpaces: feature.properties.greenSpaces || 'Non disponible',
            schools: feature.properties.schools || 'Non disponible',
            ...feature.properties
        };

        // Créer un groupe de couches pour la zone et son label
        const layerGroup = L.featureGroup();

        layer.on({
            mouseover: function(e) {
                layer.setStyle(getHighlightStyle(zoneNumber));
                layer.bringToFront();
                showZoneInfo(properties);
            },
            mouseout: function(e) {
                layer.setStyle(getDefaultStyle(zoneNumber));
                hideZoneInfo();
            },
            click: function(e) {
                showDetailedInfo(properties);
            }
        });

        // Ajouter la zone au groupe
        layerGroup.addLayer(layer);

        // Ajouter le label au centre de la zone
        if (feature.geometry.type === "Polygon" || feature.geometry.type === "MultiPolygon") {
            const bounds = layer.getBounds();
            const center = bounds.getCenter();
            const label = L.marker(center, {
                icon: createLabelIcon(properties.name),
                interactive: false // Le label ne bloque pas les événements de la zone
            });
            layerGroup.addLayer(label);
        }

        return layerGroup;
    }

    // Afficher les informations de la zone dans une infobulle
    function showZoneInfo(properties) {
        const info = document.createElement('div');
        info.id = 'neighborhood-info';
        info.innerHTML = `
            <h3>${properties.name}</h3>
            <p>Population: ${properties.population}</p>
            <p>Surface: ${properties.area}</p>
        `;
        
        map.getContainer().addEventListener('mousemove', function(e) {
            const rect = map.getContainer().getBoundingClientRect();
            info.style.left = (e.clientX - rect.left + 10) + 'px';
            info.style.top = (e.clientY - rect.top + 10) + 'px';
        });
        
        map.getContainer().appendChild(info);
    }

    // Cacher l'infobulle
    function hideZoneInfo() {
        const info = document.getElementById('neighborhood-info');
        if (info) {
            info.remove();
        }
    }

    // Afficher les informations détaillées dans le panneau
    function showDetailedInfo(properties) {
        const detailsHtml = `
            <h3>${properties.name}</h3>
            <ul>
                <li>Population: ${properties.population}</li>
                <li>Surface: ${properties.area}</li>
                <li>Densité: ${properties.density}</li>
                <li>Espaces verts: ${properties.greenSpaces}</li>
                <li>Écoles: ${properties.schools}</li>
            </ul>
        `;
        document.getElementById('neighborhood-details').innerHTML = detailsHtml;
    }

    // Création du bouton de réinitialisation
    const resetButton = L.control({position: 'bottomright'});
    
    resetButton.onAdd = function (map) {
        const btn = L.DomUtil.create('button', 'reset-view-btn');
        btn.innerHTML = 'Réinitialiser la vue';
        
        btn.onclick = function() {
            map.fitBounds(initialBounds);
        };
        
        return btn;
    };
    
    resetButton.addTo(map);

    // Variable pour stocker les limites initiales de la carte
    let initialBounds;

    // Charger tous les fichiers GeoJSON
    const zonePromises = [];
    for (let i = 1; i <= 11; i++) {
        const promise = fetch(`${i}.geojson`)
            .then(response => response.json())
            .then(data => {
                if (data.features && data.features.length > 0) {
                    data.features.forEach(feature => {
                        feature.properties = feature.properties || {};
                        feature.properties.zone = i;
                        feature.properties.name = quartierNames[i];
                    });
                }
                const layer = L.geoJSON(data, {
                    style: () => getDefaultStyle(i),
                    onEachFeature: onEachFeature
                }).addTo(map);

                return layer;
            })
            .catch(error => console.error(`Erreur de chargement de ${i}.geojson:`, error));
        
        zonePromises.push(promise);
    }

    // Ajuster la vue de la carte une fois que toutes les zones sont chargées
    Promise.all(zonePromises).then(layers => {
        const bounds = L.featureGroup(layers.filter(layer => layer)).getBounds();
        initialBounds = bounds; // Sauvegarder les limites initiales
        map.fitBounds(bounds);
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