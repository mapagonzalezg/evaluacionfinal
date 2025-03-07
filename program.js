document.getElementById("barrio").innerText = "Modelia";
document.getElementById("localidad").innerText = "Fontibón";

document.addEventListener("DOMContentLoaded", function() {
    let mapInitialized = false;

    function isScrolledIntoView(el) {
        let rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom >= 0;
    }

    function initializeMap() {
        if (!mapInitialized) {
            var map = L.map('map').setView([4.66914055008894, -74.11818910329588], 16);

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);

            async function loadPolygon() {
                let myData = await fetch('modelia.geojson');
                let myPolygon = await myData.json();
                L.geoJSON(myPolygon, {
                    style: { color: 'blue' }
                }).addTo(map);
            }

            loadPolygon();
            mapInitialized = true;
            document.getElementById("map-section").style.opacity = "1"; // Hace visible el mapa
        }
    }

    window.addEventListener("scroll", function() {
        if (isScrolledIntoView(document.getElementById("map-section"))) {
            initializeMap();
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Inicializar los mapas
    const map1 = L.map('map1').setView([4.6097, -74.0817], 13);
    const map2 = L.map('map2').setView([4.6097, -74.0817], 13);

    // Agregar capas base
    const vectorLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map1);

    const rasterLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenTopoMap contributors'
    }).addTo(map2);

    // Cargar el polígono de Timiza en ambos mapas
    fetch('modelia.geojson')
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, { style: { color: 'blue', weight: 3, fillOpacity: 0.3 } }).addTo(map1);
            L.geoJSON(data, { style: { color: 'blue', weight: 3, fillOpacity: 0.3 } }).addTo(map2);
        })
        .catch(error => console.error('Error cargando GeoJSON:', error));

    // Barra deslizante para dividir los mapas
    const slider = document.getElementById('slider');
    let isDragging = false;

    slider.addEventListener('mousedown', function () { isDragging = true; });
    
    document.addEventListener('mousemove', function (e) {
        if (!isDragging) return;
        let percentage = (e.clientX / window.innerWidth) * 100;
        if (percentage < 10) percentage = 10;
        if (percentage > 90) percentage = 90;
        document.getElementById('map1').style.width = percentage + '%';
        slider.style.left = percentage + '%';
    });

    document.addEventListener('mouseup', function () { isDragging = false; });
});


document.addEventListener("DOMContentLoaded", function() {
    let mapInitialized = false;

    function isScrolledIntoView(el) {
        let rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom >= 0;
    }

    function initializeMap() {
        if (!mapInitialized) {
            var map = L.map('fontibon-map').setView([4.66914055008894, -74.11818910329588], 16);

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);

            async function loadPolygon() {
                let myData = await fetch('fontibon.geojson');
                let myPolygon = await myData.json();
                L.geoJSON(myPolygon, {
                    style: { color: 'blue' }
                }).addTo(map);
            }

            loadPolygon();
            mapInitialized = true;
            document.getElementById("fontibon-map-section").style.opacity = "1"; // Hace visible el mapa
        }
    }

    window.addEventListener("scroll", function() {
        if (isScrolledIntoView(document.getElementById("fontibon-map-section"))) {
            initializeMap();
        }
    });
});


document.addEventListener("DOMContentLoaded", async function () { 
    const sitpMap = L.map('sitp-map').setView([4.6097, -74.0817], 15);

    // Cargar mapa base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(sitpMap);

    try {
        // Cargar el polígono de modelia
        let response = await fetch('modelia.geojson');
        if (!response.ok) throw new Error('Error al cargar modelia.geojson');
        let modeliaGeoJSON = await response.json();
        
        console.log("Modelia GeoJSON cargado:", modeliaGeoJSON); // Verificar en consola

        let modeliaLayer = L.geoJSON(modeliaGeoJSON, { color: 'blue' }).addTo(sitpMap);
        sitpMap.fitBounds(modeliaLayer.getBounds());

        // Cargar las estaciones del SITP
        let sitpResponse = await fetch('Paraderos_Zonales_del_SITP.geojson');
        if (!sitpResponse.ok) throw new Error('Error al cargar Paraderos_Zonales_del_SITP.geojson');
        let sitpData = await sitpResponse.json();

        console.log("SITP GeoJSON cargado:", sitpData); // Verificar en consola

        // Convertir SITP data a puntos de Turf
        let sitpPoints = turf.featureCollection(sitpData.features);
        let modeliaPolygon = modeliaGeoJSON.features[0]; // Asegurar que usamos el primer polígono

        // Filtrar puntos dentro del polígono
        let puntosDentro = turf.pointsWithinPolygon(sitpPoints, modeliaPolygon);
        console.log("Estaciones dentro del polígono:", puntosDentro);

        // Agregar estaciones filtradas al mapa
        let sitpLayer = L.geoJSON(puntosDentro, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: 6,
                    fillColor: "red",
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                }).on('click', function () {
                    let nombreEstacion = feature.properties.nombre || "Paradero sin nombre";
                    alert(`Estación del SITP: ${nombreEstacion}`);
                });
            }
        }).addTo(sitpMap);

    } catch (error) {
        console.error("Error en la carga de datos:", error);
    }
});
