let button = document.getElementById("button");
let image = document.getElementById("image");
let PokéNumber = document.getElementById("number");
let PokéName = document.getElementById("name");

// Créer fonction "ChangePokémon"
const ChangePokémon = async () => { // Code asynchrone
    // Nombre aléatoire [1-151]
    let randomNumber = Math.ceil(Math.random() * 150) + 1;
    
    // Générer dynamiquement l'URL
    let requestString = `https://pokeapi.co/api/v2/pokemon/${randomNumber}/`;
    
    // Faire une requête
    let data = await fetch(requestString); // Attendre que la requête est effectuée

    // Afficher sur la console
    console.log(data);

    // Convertir la réponse en JSON
    let response = await data.json(); // Attendre que la réponse est effectuée
    console.log(response);

    image.src = response.sprites.front_default; // Afficher l'image
    PokéNumber.textContent = `#${response.id}`; // Afficher le nombre
    PokéName.textContent = response.name; // Afficher le nom
};

ChangePokémon(); // Lancer la fonction pour l'initialisation
button.addEventListener("click", ChangePokémon);