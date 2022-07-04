const letters = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
let retrievedContacts = [];

function getContacts(arr) {
  const template = document.querySelector("#template");
  //tri des contacts par ordre alphabétique
  arr.sort((a, b) => (a.nom > b.nom ? 1 : -1));
  //on vide l'annuaire en cas de mise à jour de la liste
  $(".contact").remove();
  // 1 - Je boucle sur l'array de contacts
  for (let contact of arr) {
    // 2 - Je crée un élément avec le template et je sélectionne les balises concernées
    const clone = document.importNode(template, true);
    const nomPersonne = clone.querySelector(".nom");
    const prenomPersonne = clone.querySelector(".prenom");
    // 3 - Je remplis le template avec les données de l'objet "contacts"
    nomPersonne.textContent = `${contact["nom"]}`;
    prenomPersonne.textContent = `${contact["prenom"]}`;
    // 4 - Je supprime l'attribut 'hidden' qui rendait invisible la div "template"
    clone.removeAttribute("hidden");
    clone.removeAttribute("id");
    // 5 - J'ajoute la classe "personne" à mes div clonées
    // clone.classList.add('personne')
    clone.className = "ps-4 m-2 contact";
    // 6 - J'ajoute les éléments au DOM
    const firstLetter = contact["nom"][0];
    document.getElementById(firstLetter.toUpperCase()).appendChild(clone);
  }
  //déclaration des event listeners
  $(".nom").on("click", showContact);
  $(".contact button").on("click", deleteContact);
  //stockage dans localStorage
  localStorage.setItem("mesContacts", JSON.stringify(arr));
}

function deleteContact(e) {
  const parent = e.target.parentNode;
  const list = parent.children;
  const nom = list[0].textContent;
  const prenom = list[1].textContent;
  parent.remove();
  const filteredContactList = retrievedContacts.filter(
    (contact) => contact["nom"] !== nom 
  );
  retrievedContacts = filteredContactList;
  //stockage dans localStorage
  localStorage.setItem("mesContacts", JSON.stringify(retrievedContacts));
}

function showContact(e) {
  const nom = e.target.textContent;
  const contact = retrievedContacts.filter((contact) => contact["nom"] === nom);
  newText = `<p>Nom / Prénom : ${contact[0]["nom"]} ${contact[0]["prenom"]}<br>Phone : ${contact[0]["phone"]}<br>Mail : ${contact[0]["mail"]}<br>Adresse : ${contact[0]["adresse"]}<br>Date de naissance : ${contact[0]["dateDeNaissance"]}<br>Code Postal : ${contact[0]["codePostal"]}</p>`;
  $("#showContact").html(newText);
}

function addContact(evt) {
  evt.preventDefault();
  //on récupère les valeurs des champs
  let leNom = $(".fnom").val();
  let lePrenom = $(".fprenom").val();
  let laDate = $(".date").val();
  let leTel = $(".tel").val();
  let leEmail = $(".mail").val();
  let lAdresse = $(".adresse").val();
  let lInfoSup = $(".info_sup").val();
  let leCodePost = $(".code_post").val();
  let laVille = $(".ville").val();
  //on crée l'objet contact
  let donnees_form = {
    "nom": leNom,
    "prenom": lePrenom,
    "dateDeNaissance": laDate,
    "phone": leTel,
    "mail": leEmail,
    "adresse": lAdresse,
    "info_sup": lInfoSup,
    "codePostal": leCodePost,
    "ville": laVille
  };
  //on ajoute l'objet à notre liste
  retrievedContacts.push(donnees_form);
  document.getElementById("monForm").reset();
  //on met à jour notre annuaire
  getContacts(retrievedContacts);
}

function findTown(e) {
  const url =
    "https://apicarto.ign.fr/api/codes-postaux/communes/" + e.target.value;
  $("#villes").empty();
  $.ajax(url, {
    success: function (resultat) {
      for (let city of resultat) {
        $("#villes").append("<option>" + city.nomCommune + "</option>");
      }
    },
    error: function (err) {
      console.log(err);
    },
  });
}

$(function () {// Handler for .ready() called.

  //initialise la page avec A B C...etc
  for (const letter of letters) {
    //initialisation du header
    const lettersGroup = document.querySelector(".lettersGroup");
    const lien = document.createElement("a");
    lien.setAttribute("href", `#${letter.toUpperCase()}`);
    lien.classList.add("btn");
    lien.classList.add("btn-link");
    lien.textContent = letter;
    lettersGroup.appendChild(lien);
    //initialisation de l'annuaire
    const letterDiv = document.createElement("div");
    letterDiv.setAttribute("id", letter.toUpperCase());
    letterDiv.innerHTML = letter.toUpperCase() + "<hr>";
    letterDiv.className = "p-2";
    document.getElementById("list").appendChild(letterDiv);
  }

  //check for a localStorage
  if (localStorage.getItem("mesContacts")) {
    alert("Une sauvegarde locale a été trouvée");
    retrievedContacts = JSON.parse(localStorage.getItem("mesContacts"));
  } else {
    retrievedContacts = contacts;
  }

  //Ajout des contacts
  getContacts(retrievedContacts);

  //déclaration des event listeners du formulaire
  $(".code_post").on("change", findTown);
  $("#monForm").submit(addContact);
  $(".button_reset").on("click", () =>
    document.getElementById("monForm").reset()
  );
});
