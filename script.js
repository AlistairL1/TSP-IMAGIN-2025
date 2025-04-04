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

                // Ajouter le label de la zone avec le nom du quartier
                data.features.forEach(feature => {
                    if (feature.geometry.type === "Polygon" || feature.geometry.type === "MultiPolygon") {
                        const center = layer.getBounds().getCenter();
                        const zoneName = quartierNames[i];
                        const label = L.marker(center, {
                            icon: L.divIcon({
                                className: 'zone-label',
                                html: zoneName,
                                iconSize: [120, 40],
                                iconAnchor: [60, 20]
                            }),
                            pane: 'markerPane', // S'assure que le label reste au-dessus du polygone
                            interactive: false   // Empêche le label d'intercepter les événements de la souris
                        }).addTo(map);
                    }
                });

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

    // Ajouter la fonction de recherche d'adresse
    const searchInput = document.getElementById('address-search');
    const searchBtn = document.getElementById('search-btn');
    let searchResultsContainer = null;
    let searchMarker = null;

    // Définir la projection EPSG:2154 (Lambert 93)
    proj4.defs("EPSG:2154","+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");

    // Créer une couche pour les espaces verts
    let espacesVertsLayer = null;

    // Charger le fichier GeoJSON des espaces verts
    fetch('esp_vert.geojson')
        .then(response => response.json())
        .then(data => {
            // Convertir les coordonnées de EPSG:2154 vers EPSG:4326 (WGS84)
            data.features.forEach(feature => {
                if (feature.geometry && feature.geometry.coordinates) {
                    if (feature.geometry.type === 'MultiPolygon') {
                        feature.geometry.coordinates = feature.geometry.coordinates.map(polygon => 
                            polygon.map(ring => 
                                ring.map(coord => convertPoint(coord))
                            )
                        );
                    }
                }
            });

            espacesVertsLayer = L.geoJSON(data, {
                style: {
                    color: '#2ecc71',
                    weight: 2,
                    opacity: 1,
                    fillColor: '#2ecc71',
                    fillOpacity: 0.5
                },
                onEachFeature: (feature, layer) => {
                    const properties = feature.properties;
                    
                    // Popup au clic
                    layer.bindPopup(`
                        <strong>Type:</strong> ${properties.cat_entite}<br>
                        <strong>Surface:</strong> ${properties.surf_entit.toFixed(2)} m²<br>
                        <strong>Entretien:</strong> ${properties.ent_entite}
                    `);

                    // Événements pour afficher les détails dans le panneau latéral
                    layer.on({
                        mouseover: (e) => {
                            const greenSpaceDetails = document.getElementById('green-space-details');
                            greenSpaceDetails.innerHTML = `
                                <div class="details-box">
                                    <h4>Espace vert</h4>
                                    <p><strong>Type :</strong> ${properties.cat_entite}</p>
                                    <p><strong>Surface :</strong> ${properties.surf_entit.toFixed(2)} m²</p>
                                    <p><strong>Entretien :</strong> ${properties.ent_entite}</p>
                                    <p><strong>Fréquence :</strong> ${properties.freq_entit} fois par an</p>
                                    <p><strong>Site :</strong> ${properties.nom_site}</p>
                                </div>
                            `;
                            layer.setStyle({
                                fillOpacity: 0.8,
                                weight: 3
                            });
                        },
                        mouseout: (e) => {
                            const greenSpaceDetails = document.getElementById('green-space-details');
                            greenSpaceDetails.innerHTML = `
                                <div class="details-box">
                                    <p class="placeholder">Survolez un espace vert pour voir ses détails</p>
                                </div>
                            `;
                            layer.setStyle({
                                fillOpacity: 0.5,
                                weight: 2
                            });
                        }
                    });
                }
            }).addTo(map);
        })
        .catch(error => console.error('Erreur de chargement des espaces verts:', error));

    // Ajouter le message par défaut pour les espaces verts
    const greenSpaceDetails = document.getElementById('green-space-details');
    greenSpaceDetails.innerHTML = `
        <div class="details-box">
            <p class="placeholder">Survolez un espace vert pour voir ses détails</p>
        </div>
    `;

    // Fonction pour convertir un point de Lambert 93 vers WGS84
    function convertPoint(coord) {
        const [x, y] = coord;
        const result = proj4('EPSG:2154', 'WGS84', [x, y]);
        return [result[1], result[0]]; // Inverser lat/lon pour Leaflet
    }

    // Modifier la fonction de recherche d'adresse pour limiter à Corbeil-Essonnes
    async function searchAddress(query) {
        const baseUrl = 'https://nominatim.openstreetmap.org/search';
        const params = new URLSearchParams({
            q: query + ', Corbeil-Essonnes, France', // Ajouter Corbeil-Essonnes à la recherche
            format: 'json',
            limit: 5,
            bounded: 1,
            viewbox: '2.4,48.5,2.6,48.7', // Limiter la zone de recherche
            countrycodes: 'fr'
        });

        try {
            const response = await fetch(`${baseUrl}?${params}`);
            const data = await response.json();
            // Filtrer les résultats pour ne garder que ceux de Corbeil-Essonnes
            const filteredData = data.filter(result => 
                result.display_name.toLowerCase().includes('corbeil-essonnes')
            );
            showSearchResults(filteredData);
        } catch (error) {
            console.error('Erreur lors de la recherche :', error);
        }
    }

    // Modifier la fonction showSearchResults pour afficher un message si aucun résultat
    function showSearchResults(results) {
        if (searchResultsContainer) {
            searchResultsContainer.remove();
        }

        searchResultsContainer = document.createElement('div');
        searchResultsContainer.className = 'search-results';

        if (results.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'search-result-item';
            noResults.textContent = 'Aucun résultat trouvé à Corbeil-Essonnes';
            searchResultsContainer.appendChild(noResults);
        } else {
            results.forEach(result => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                resultItem.textContent = result.display_name;
                resultItem.addEventListener('click', () => {
                    selectSearchResult(result);
                });
                searchResultsContainer.appendChild(resultItem);
            });
        }

        searchInput.parentNode.appendChild(searchResultsContainer);
    }

    // Sélectionner un résultat de recherche
    function selectSearchResult(result) {
        // Supprimer l'ancien marqueur s'il existe
        if (searchMarker) {
            map.removeLayer(searchMarker);
        }

        // Créer un nouveau marqueur
        const latlng = [parseFloat(result.lat), parseFloat(result.lon)];
        searchMarker = L.marker(latlng).addTo(map);

        // Centrer la carte sur le résultat
        map.setView(latlng, 16);

        // Nettoyer les résultats
        if (searchResultsContainer) {
            searchResultsContainer.remove();
            searchResultsContainer = null;
        }

        // Mettre à jour l'input avec l'adresse sélectionnée
        searchInput.value = result.display_name;
    }

    // Événement de clic sur le bouton de recherche
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            searchAddress(query);
        }
    });

    // Événement de touche Entrée dans l'input
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                searchAddress(query);
            }
        }
    });

    // Fermer les résultats si on clique ailleurs
    document.addEventListener('click', (e) => {
        if (searchResultsContainer && 
            !searchResultsContainer.contains(e.target) && 
            e.target !== searchInput) {
            searchResultsContainer.remove();
            searchResultsContainer = null;
        }
    });

    // Gérer l'affichage des espaces verts
    const espacesVertsCheckbox = document.getElementById('espaces-verts');
    espacesVertsCheckbox.addEventListener('change', (e) => {
        if (espacesVertsLayer) {
            if (e.target.checked) {
                map.addLayer(espacesVertsLayer);
            } else {
                map.removeLayer(espacesVertsLayer);
            }
        }
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