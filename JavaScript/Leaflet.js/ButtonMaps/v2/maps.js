const button = document.querySelector("button");
const locationDataElement = document.getElementById("locationData");

// Exemple d'une carte Leaflet
var map = L.map('map');

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a>'
}).addTo(map);

// Définir les coordonnées initiales pour centrer la carte
var initialCoords = [45.66030897171325, 4.9438695080075945];

// Créer un marqueur à la position de géolocalisation
var marker = L.marker(initialCoords).addTo(map).bindPopup("Ma localisation");

// Centrer la carte sur les coordonnées initiales
map.setView(initialCoords, 13);

// Récupérer la géolocalisation de l'utilisateur
navigator.geolocation.getCurrentPosition(position => {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;

    // Mettre à jour les coordonnées du marqueur
    marker.setLatLng([lat, long]);

    // Centrer la carte sur la position de géolocalisation
    map.setView([lat, long], 18);
});


button.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
        fetch(url)
            .then(res => res.json())
            .then(data => {
                const address = data.address;
                const htmlString =
                    `<table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Pays</th> 
                                <th>Région</th>
                                <th>Département</th>
                                <th>Ville</th>
                                <th>N°</th>
                                <th>Rue</th>
                                <th>Code Postale</th>
                            <tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${address.country}</td>
                                <td>${address.state}</td>
                                <td>${address.state_district}</td>
                                <td>${address.town}</td>
                                <td>${address.house_number}</td>
                                <td>${address.road}</td>
                                <td>${address.postcode}</td>
                            </tr>
                        </tbody>
                    </table>`;

                locationDataElement.innerHTML = htmlString;
                console.table(data.address);

                const lat = latitude;
                const lon = longitude;
                marker.setLatLng([lat, lon]);

                // Affichage de la carte une fois les données récupérées
                document.getElementById("map").style.display = "block";
                console.log({ message: "La communication avec l'API réagit avec succès." });
                console.log({ message: "La carte a été affichée avec succès." });

                // Affichage du bouton réinitialisation de la localisation
                document.getElementById("resetButton").style.display = "block";

                // Affichage du bouton recherche lieu
                document.getElementById("searchInput").style.display = "block";
                document.getElementById("searchButton").style.display = "block";
            })
            .catch(() => {
                console.log("Error fetching data from API");
                console.log({message : "La carte n'a pas pu être chargée."});
            });
    });
});

/* Création de l'effet du bouton */
const btn = document.querySelector('.location');

btn.addEventListener('mouseover', function(e) {
    const x = e.pageX - btn.offsetLeft;
    const y = e.pageY - btn.offsetTop;

    const btnFill = document.querySelector('.btn-fill');
    btnFill.style.top = y + 'px';
    btnFill.style.left = x + 'px';
});

/* Création du bouton "resetButton" qui réinitialise la localisation */
// Récupère la référence du bouton
const resetButton = document.getElementById("resetButton");

// Définit l'événement de clic pour le bouton
resetButton.addEventListener('click', () => {
    // Récupère la géolocalisation de l'utilisateur
    navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;

        // Réinitialise la position de la carte avec animation de dézoom et zoom
        map.flyTo([lat, long], 18, {
            animate: true,
            duration: 1.5
        });
    });
});

// Création de la fonction "Recherche"
const searchButton = document.getElementById("searchButton"); // Récupération du bouton de recherche
const searchInput = document.getElementById("searchInput"); // Récupération de l'élément de saisie

searchButton.addEventListener("click", searchLocation); // Ajout d'un écouteur d'événement pour le clic sur le bouton
searchInput.addEventListener("keydown", function(event) { // Ajout d'un écouteur d'événement pour la touche "Entrée"
    if(event.key === "Enter") {
        searchLocation(); // Appel de la fonction de recherche lorsque la touche "Entrée" est enfoncée
    }
});

function searchLocation() {
    const inputValue = searchInput.value; // Récupération de la valeur saisie par l'utilisateur
    
    // Vérifier si l'input n'est pas vide
    if(inputValue.trim() === "") { // Utilisation de trim() pour supprimer les espaces vides au début et à la fin
        // Gérer le cas où l'input est vide
        console.log("Veuillez entrer un lieu valide.");
        return;
    }

    // Utilisation du service de recherche "Nominatim" de OpenStreetMap
    const searchUrl = `https://nominatim.openstreetmap.org/search?q=${inputValue}&format=json`;

    // Utilisation d'une requête AJAX pour récupérer les résultats de recherche
    $.ajax({
        url: searchUrl,
        method: 'GET',
        dataType: 'json',
        success: handleSearchResults, // Fonction de gestion des résultats en cas de succès
        error: handleError // Fonction de gestion des erreurs
    });
}


// Variable qui stocke le marqueur actuel
let currentMarker = null;

function handleSearchResults(results) {
    // Vérifier si des résultats ont été trouvés
    if (results.length > 0) {
        const firstResult = results[0];
        const lat = parseFloat(firstResult.lat);
        const lon = parseFloat(firstResult.lon);

        // Vérification des valeurs géographiques
        console.log("Latitude:", lat);
        console.log("Longitude:", lon);

        // Vérifier si les coordonnées sont valides
        if (isNaN(lat) || isNaN(lon)) {
            console.log("Les coordonnées du lieu sont invalides.");
            return;
        }

        // Créer un marqueur pour le lieu trouvé
        const redIcon = L.AwesomeMarkers.icon({
            icon: 'coffee',
            markerColor: 'red'
        });

        // Vérifier si un marqueur existe déjà, si c'est le cas = supprimer
        if (currentMarker) {
            currentMarker.remove();
        }

        // Créer le nouveau marqueur avec la nouvelle position
        currentMarker = L.marker([lat, lon], { icon: redIcon }).addTo(map);
        currentMarker.bindPopup(firstResult.display_name).openPopup();

        // Vérification des valeurs géographiques
        console.log("Latitude:", lat);
        console.log("Longitude:", lon);

        // Centrer la carte sur le marqueur
        map.flyTo(L.latLng(lat, lon), 18, {
            animate: true,
            duration: 1.5
        });
    } else {
        // Aucun résultat trouvé, afficher un message d'erreur
        console.log("Aucun résultat trouvé.");
    }
}

function handleError(error) {
    console.log("Une erreur s'est produite lors de la recherche.", error);
}

// // Création des suggestions avec Typeahead.js
// const searchInput = document.getElementById('searchInput');

// const typeaheadOptions = {
//     minLength: 2,
//     highlight: true,
//     hint: true
// };

// // Configurer la source de données pour les suggestions de lieux
// const dataSource = new Bloodhound({
//     datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
//     queryTokenizer: Bloodhound.tokenizers.whitespace,
//     prefetch: {
//         url: 'https://nominatim.openstreetmap.org/search?format=json&q=%QUERY',
//         transform: function (response) {
//             // Transformez la réponse JSON ici si nécessaire
//             return response;
//         }
//     }
// });

// // Initialiser Typeahead.js sur le champ de saisie
// $(searchInput).typeahead(typeaheadOptions, {
//     source: dataSource,
//     displayKey: 'value'
// });
