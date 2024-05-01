// Animation du numéro de carte
document.querySelector('.card-number-input').addEventListener('input', (event) => {
    const input = event.target;
    const value = input.value;

    // Supprime tous les caractères non numériques
    const numericValue = value.replace(/\D/g, '');

    // Ajoute des espaces tous les 4 chiffres (sauf après le dernier groupe)
    const formattedValue = numericValue.replace(/(\d{4})(?=\d)/g, '$1 ');

    input.value = formattedValue;
});

document.querySelector('.card-number-input').addEventListener('input', (event) => {
    const input = event.target;
    const cardNumberBox = document.querySelector('.card-number-box');
    const cardNumber = input.value;

    // Remplace les "#" par les numéros de carte
    const formattedCardNumber = cardNumber.replace(/#/g, (match, index) => {
        // Vérifie si la position correspond à un chiffre dans le numéro de carte
        if (index < cardNumber.length) {
            return cardNumber[index];
        }
        // Renvoie "#" si la position dépasse la longueur du numéro de carte
        return '#';
    });

    cardNumberBox.innerText = formattedCardNumber;
});

// Animation du nom de titulaire
document.querySelector('.card-holder-input').oninput = () => {
    const input = document.querySelector('.card-holder-input');
    const value = input.value;
    const alphaValue = value.replace(/[^a-zA-Z ]/g, ''); // Supprime tous les caractères non alphabétiques, sauf les espaces

    input.value = alphaValue;
    document.querySelector('.card-holder-name').innerText = alphaValue;
};


// Animation du choix du mois
document.querySelector('.month-input').oninput = () => {
    document.querySelector('.exp-month').innerText = document.querySelector('.month-input').value;
}

// Animation du choix de l'année
document.querySelector('.year-input').oninput = () => {
    document.querySelector('.exp-year').innerText = document.querySelector('.year-input').value;
}

// Animation du CVV (retournement de la carte) - avec le curseur dessus
document.querySelector('.cvv-input').onmouseenter = () => {
    document.querySelector('.front').style.transform = 'perspective(1000px) rotateY(-180deg)';
    document.querySelector('.back').style.transform = 'perspective(1000px) rotateY(0deg)';
}

// Animation du CVV (retournement de la carte) - avec le curseur dessus
document.querySelector('.cvv-input').onmouseleave = () => {
    document.querySelector('.front').style.transform = 'perspective(1000px) rotateY(0deg)';
    document.querySelector('.back').style.transform = 'perspective(1000px) rotateY(180deg)';
}

// Sélectionnez l'élément de l'input du CVV
const cvvInput = document.querySelector('.cvv-input');
const frontCard = document.querySelector('.front');
const backCard = document.querySelector('.back');

// Ajoutez des écouteurs d'événements pour les événements focus et blur
cvvInput.addEventListener('focus', () => {
    // Retourner la carte vers l'arrière lorsqu'il a le focus
    frontCard.style.transform = 'perspective(1000px) rotateY(-180deg)';
    backCard.style.transform = 'perspective(1000px) rotateY(0deg)';
});

cvvInput.addEventListener('blur', () => {
    // Retourner la carte vers l'avant lorsqu'il perd le focus
    frontCard.style.transform = 'perspective(1000px) rotateY(0deg)';
    backCard.style.transform = 'perspective(1000px) rotateY(180deg)';
});

// Animation du CVV
document.querySelector('.cvv-input').oninput = () => {
    const input = document.querySelector('.cvv-input');
    const value = input.value;
    const numericValue = value.replace(/\D/g, ''); // Supprime tous les caractères non numériques

    input.value = numericValue;
    document.querySelector('.cvv-box').innerText = numericValue;
};

// Sélectionner tous les inputs de la page
const inputs = document.querySelectorAll('input');

// Ajouter des écouteurs d'événements pour les touches haut et ba
document.addEventListener('keydown', (event) => {
    // Vérifier si la touche pressée est la flèche haut (ArrowUp)
    if (event.key === "ArrowUp") {
        // Empêcher le comportement par défaut de défilement de la page
        event.preventDefault();

        // Trouvez l'input précédent en fonction du focus actuel
        const currentInput = document.activeElement;
        const currentIndex = Array.from(inputs).indexOf(currentInput);
        const previousIndex = (currentIndex - 1 + inputs.length) % inputs.length;
        const previousInput = inputs[previousIndex];

        // Définissez le focus sur l'input précédent
        previousInput.focus();
    }

    // Vérifier si la touche pressée est la flèche bas (ArrowDown)
    if (event.key === "ArrowDown") {
        // Empêcher le comportement par défaut de défilement de la page
        event.preventDefault();

        // Trouver l'input suivant en fonction du focus actuel
        const currentInput = document.activeElement;
        const currentIndex = Array.from(inputs).indexOf(currentInput);
        const nextIndex = (currentIndex + 1) % inputs.length;
        const nextInput = inputs[nextIndex];

        // Définissez le focus sur l'input suivant
        nextInput.focus();
    }
});

// Envoyer toutes les informations dans la console sous format JSON
// Sélectionner le formulaire
const form = document.querySelector('form');

// Ajouter un écouteur d'événement pour l'évenement "submit"
form.addEventListener("submit", (event) => {
    // Empêcher le rechargement de la page
    event.preventDefault();

    // Récupérer les valeurs des champs de formulaire
    const formData = {
        "Numéro de la carte": document.querySelector('.card-number-input').value,
        "Nom du titulaire": document.querySelector('.card-holder-input').value,
        "Expiration (MM)": document.querySelector('.month-input').value,
        "Expiration (AA)": document.querySelector('.year-input').value,
        "CVV": document.querySelector('.cvv-input').value
    };

    const jsonData = JSON.stringify(formData, null, 2);
    console.log(jsonData);
});

// Vérification du remplissage du formulaire (renforcée)
function validateForm(event) {
    event.preventDefault(); // Empêche l'envoi du formulaire par défaut

    // Récupère les valeurs des champs
    const cardNumber = document.querySelector('.card-number-input').value;
    const cardHolder = document.querySelector('.card-holder-input').value;
    const month = document.querySelector('.month-input').value;
    const year = document.querySelector('.year-input').value;
    const cvv = document.querySelector('.cvv-input').value;

    // Vérifie si les champs obligatoires sont vides
    if (cardNumber === '' || cardHolder === '' || month === 'month' || year === 'year' || cvv === '') {
        // Affiche le message d'erreur JSON
        const errorMessage = JSON.stringify({ error: 'Formulaire incomplet !' });
        console.log(errorMessage);
    } else {
        // Vérifie si le formulaire est valide
        if (document.querySelector('form').checkValidity()) {
            // Tous les champs sont remplis et le formulaire est valide
            console.log('Le formulaire est correct, il remplit tous les champs nécessaires !');
        } else {
            // Le formulaire n'est pas valide, effectuez les actions appropriées (par exemple, afficher un message d'erreur)
            console.log('Le formulaire contient des erreurs de validation');
        }
    }
}