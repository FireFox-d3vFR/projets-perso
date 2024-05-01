const mots = [
    "ordinateur",
    "programmation",
    "javascript",
    "developpement",
    "internet",
    "openai",
    "intelligence",
    "artificielle",
];

function choisirMot() {
    return mots[Math.floor(Math.random() * mots.length)];
}

function afficherInterface(mot, lettresDevinees, tentativesRestantes) {
    let interface = "";
    for (let lettre of mot) {
        interface += lettresDevinees.includes(lettre) ? lettre : " _ ";
    }
    document.getElementById("gameDisplay").innerHTML = `
        <p>Mot à deviner : ${interface}</p>
        <p>Tentatives restantes : ${tentativesRestantes}</p>
    `;
}

function positionElements() {
    const statusMessage = document.getElementById("statusMessage");
    const gameDisplay = document.getElementById("container");

    statusMessage.style.top = "40px";
    statusMessage.style.right = "20px";
    gameDisplay.style.marginTop = "100px";
}

let jeuEnCours = false;
let motADeviner = "";
let lettresDevinees = [];
let tentativesRestantes = 6;

function initialiserJeu() {
    jeuEnCours = true;
    motADeviner = choisirMot();
    lettresDevinees = [];
    tentativesRestantes = 6;
    afficherInterface(motADeviner, lettresDevinees, tentativesRestantes);
    afficherMessage("Le jeu commence !", MESSAGE_SUCCESS);

    // positionElements();
}

function verifierLettre(lettreProposee) {
    if (!jeuEnCours || lettresDevinees.includes(lettreProposee)) return;

    if (motADeviner.includes(lettreProposee)) {
        lettresDevinees.push(lettreProposee);
        if (
            motADeviner.split("").every((lettre) => lettresDevinees.includes(lettre))
        ) {
            jeuEnCours = false;
            afficherInterface(motADeviner, lettresDevinees, tentativesRestantes);
            afficherMessage(
                `Félicitations ! Vous avez deviné le mot : ${motADeviner}`,
                MESSAGE_SUCCESS
            );
            return;
        }
    } else {
        tentativesRestantes--;
        if (tentativesRestantes === 0) {
            jeuEnCours = false;
            afficherInterface(motADeviner, lettresDevinees, tentativesRestantes);
            afficherMessage(
                `Vous avez utilisé toutes vos tentatives. Le mot était : ${motADeviner}`,
                MESSAGE_WARNING
            );
            return;
        }
    }

    afficherInterface(motADeviner, lettresDevinees, tentativesRestantes);
}

function jouerPendu() {
    if (!jeuEnCours) return;
    const lettreProposee = document
        .getElementById("guessInput")
        .value.toLowerCase();
    verifierLettre(lettreProposee);
}

document
    .getElementById("startButton")
    .addEventListener("click", initialiserJeu);
document.getElementById("guessButton").addEventListener("click", jouerPendu);

const guessForm = document.getElementById("guessForm");
guessForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const lettreProposee = document
        .getElementById("guessInput")
        .value.toLowerCase();
    document.getElementById("guessInput").value = "";
    jouerPendu(lettreProposee);
});

const MESSAGE_SUCCESS = "success";
const MESSAGE_WARNING = "warning";
const MESSAGE_DANGER = "danger";

function afficherMessage(message, type) {
    const statusMessage = document.getElementById("statusMessage");
    statusMessage.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        <span>${message}</span>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
    `;

    setTimeout(function () {
        statusMessage.innerHTML = "";
    }, 3000);
}
