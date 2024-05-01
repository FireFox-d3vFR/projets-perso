// Exemple d'une carte Leaflet

// Initialisation de la carte et définir sa vue sur nos coordonnées géographiques choisies et un niveau de zoom
var map = L.map('map').setView([45.66030897171325, 4.9438695080075945], 13);

// Création d'une couche de `tuile` OpenStreetMap
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

/* Création ~ Marqueurs, cercles et polygones */
// Exemple #1 - Ajout d'un marqueur
var marker = L.marker([45.65965391974857, 4.943958981264533]).addTo(map).bindPopup("Emplacement de la localisation");

// Exemple #2 - Ajout d'un cercle
var circle = L.circle([45.670128969496226, 4.94391802789709], {
    color: 'red', /* Couleur des bordures */
    fillColor: '#F03', /* Couleur du cercle */
    fillOpacity: 0.5,
    radius: 500 /* Rayon du cercle */
}).addTo(map);

// Exemple #3 - Ajout d'un polygone
var polygon = L.polygon([
    [45.66278442699157, 4.950031537044139],
    [45.66576839196857, 4.960511838397632],
    [45.653187188687845, 4.977299728528689]
]).addTo(map);

/* Ajout des PopUp */
// PopUp - Marqueur
marker.bindPopup("<b>Salut tout le monde !</b><br>Je suis une <b>PopUp</b>.").openPopup();

// PopUp - Cercle
circle.bindPopup("Je suis un <b>Cercle</b>");

// PopUp - Polygone
polygon.bindPopup("Je suis un <b>Polygone</b>");

// Création d'une PopUp qui s'active lors du rafraichissement de la page
var popup = L.popup()
    .setLatLng([45.66310688956234, 4.953634334465318])
    .setContent("Je suis une PopUp <b>autonome</b>.")
    .openOn(map);

// Faire face aux événements

/* Alerte l'utilisateur lorsqu'il clique sur la map */
// function onMapClick(e) {
//     alert("Vous avez cliqué sur la carte à " + e.latlng); 
// }
// map.on('click', onMapClick);

/* Version améliorée du code ci-dessus ~ Affiche une popUp d'alerte */
var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("Vous avez cliqué sur la carte à " + e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);