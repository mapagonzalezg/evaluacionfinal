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