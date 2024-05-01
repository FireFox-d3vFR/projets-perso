// Tableau de données - Villes
var villes = {
    "Paris": {"lat": 48.852969, "lon": 2.349903},
    "Brest": {"lat": 48.383, "lon": -4.500},
    "Quimper": {"lat": 48.000, "lon": -4.100},
    "Bayonne": {"lat": 43.500, "lon": -1.467},
    "Lyon": {"lat": 45.757858704394124, "lon": 4.832187839743577},
    "Mions": {"lat": 45.66390286659878,  "lon":  4.957260623763084},
    "Villeurbanne": {"lat": 45.76650083446739,  "lon": 4.8795748720479315}
};

var tableauMarqueurs = [];

// On s'assure que la page est chargée
window.onload = function() {
    // On initialise la carte (sur la vue de Paris)
    var carte = L.map('maCarte').setView([48.852969, 2.349903], 13);

    // On charge les "tuiles"
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', { // Adresse un serveur OpenStreetMap
        // Il est toujours bien de laisser le lien vers la source des données
        attribution: 'données &copy <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
        minZoom: 1, // Zoom minimum sur la carte (vue sur la terre)
        maxZoom: 20 // Zoom maximum sur la carte
    }).addTo(carte);

    // On active la gestion d'itinéraire
    L.Routing.control({
        geocoder: L.Control.Geocoder.nominatim(),
        lineOptions: {
            styles: [{ // Modification de la ligne du trajet
                color: '#839C49',
                opacity: 1,
                weight: 7
            }]
        },
        router: new L.Routing.osrmv1({ // Information d'itinéraire en français
            language: 'fr',
            profile: 'car' // car (defaut), bike ou foot
        })
    }).addTo(carte);

/*
// Dessiner un cercle de 5km de diamètre
let cercle = L.circle([48.852969, 2.349903], {
    color: 'red',
    fillColor: 'red', // Remplissage
    fillOpacity: 0.3,
    radius: 2500
}).addTo(carte);
cercle.bindPopup('Ville de Paris');

// Dessiner un triangle (en premier plan par rapport au cercle)
let triangle = L.polygon([
    [48.85779, 2.3392724],
    [48.852630, 2.3523187],
    [48.86, 2.35223293]
]).addTo(carte);
triangle.bindPopup('Triangle');

// Dessiner un polygone complexe
let polygon = L.polygon([
    [48.85779759188263, 2.339272499084472],
    [48.85703523304221, 2.3406243324279785],
    [48.85663993129474, 2.3412251472473145],
    [48.85505869308853, 2.342963218688965],
    [48.85497398248938, 2.3431777954101562],
    [48.854268055255545, 2.3447656631469727],
    [48.853646831055556, 2.3463964462280273],
    [48.852940885107614, 2.3480701446533203],
    [48.852220809985745, 2.3499369621276855],
    [48.85159956038226, 2.3526835441589355],
    [48.85206549830757, 2.3524260520935054],
    [48.852630265737005, 2.35231876373291],
    [48.853251502551096, 2.3522329330444336],
    [48.85394332538533, 2.351932525634765],
    [48.854536308777014, 2.3514175415039062],
    [48.85511516674166, 2.35032320022583],
    [48.85570813625314, 2.3483705520629883],
    [48.856244626425635, 2.3465466499328613],
    [48.85671052112145, 2.345151901245117],
    [48.85689405420504, 2.3442506790161133],
    [48.85703523304221, 2.343113422393799],
    [48.85727523615161, 2.3412466049194336],
    [48.85779759188263, 2.339272499084472],
], {
    color: "green",
    fillColor: "green",
    fillOpacity: 0.4
}).addTo(carte);
polygon.bindPopup("Ile de la cité");
*/

// Utilisation du dossier GeoJSON
let xmlhttp = new XMLHttpRequest();

xmlhttp.onreadystatechange = () => {
    if(xmlhttp.readyState == 4) {
        if(xmlhttp.status == 200) {
            // Ici le fichier geoJSON a été chargé
            let geojson = JSON.parse(xmlhttp.responseText);
            let geojsonLayer = L.geoJSON(geojson, {
                style: {
                    "color": "blue",
                    "opacity": 1,
                    "fillColor": "blue",
                    "fillOpacity": 0.5
                }
            }).addTo(carte)
            geojsonLayer.bindPopup("Département du Rhône");
            console.log(geojson);
        } else {
            console.log(xmlhttp.statusText);
        }
    }
}

xmlhttp.open("GET", "departement-69.geojson", true);
xmlhttp.send(null);

var marqueurs = L.markerClusterGroup()

// On personnalise le marqueur
var icone = L.icon({
    iconUrl: "images/icone.png",
    iconSize: [50, 50],
    iconAnchor: [25, 50], // Modification de l'emplacement du marqueur selon les coordonnées
    popupAnchor: [0, -50] // Modification de l'emplacement de la PopUp (audessus du marqueur)
})

// On parcourt les différents villes
for(ville in villes) {
    // Création d'un marqueur sur la carte et on lui attribue une popup
    var marqueur = L.marker([villes[ville].lat, villes[ville].lon],{icon: icone}); //.addTo(carte); Inutile lors de l'utilisation des clusters
    marqueur.bindPopup("<h3>"+ville+"<h3>");
    marqueurs.addLayer(marqueur); // On ajoute le marqueur au groupe

    // On ajoute le marqueur au tableau
    tableauMarqueurs.push(marqueur);
}

// On regrouppe les marqueurs dans un groupe Leaflet
var groupe = new L.featureGroup(tableauMarqueurs);
// On adapte le zoom au groupe
carte.fitBounds(groupe.getBounds().pad(0.5));

carte.addLayer(marqueurs);

}
