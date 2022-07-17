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
let template = undefined;

function createContact(contact) {
  const clone = document.importNode(template, true);
  const nomPersonne = clone.querySelector(".nom");
  const prenomPersonne = clone.querySelector(".prenom");
  const button = clone.querySelector("button");

  clone.removeAttribute("hidden");
  clone.removeAttribute("id");
  //clone.className = "ps-4 m-2 contact";

  nomPersonne.textContent = contact["nom"];
  nomPersonne.addEventListener("click", () =>
    showContact(contact["nom"], contact["prenom"])
  );
  prenomPersonne.textContent = contact["prenom"];
  button.addEventListener("click", (e) =>
    deleteContact(e, contact["nom"], contact["prenom"])
  );

  const firstLetter = contact["nom"][0];
  document.getElementById(firstLetter.toUpperCase()).appendChild(clone);
}

function getContacts(arr) {
  //tri des contacts par ordre alphabétique
  arr.sort((a, b) => a.nom.localeCompare(b.nom));
  for (let contact of arr) {
    createContact(contact);
  }
  //stockage
  localStorage.setItem("mesContacts", JSON.stringify(arr));
}

function deleteContact(e, nom, prenom) {
  const parent = e.target.parentNode;
  const list = parent.children;
  //const nom = list[0].textContent;
  //const prenom = list[1].textContent;
  const indexToDelete = retrievedContacts.findIndex(
    (contact) => contact["nom"] === nom && contact["prenom"] === prenom
  );
  if (indexToDelete !== -1) {
    const ask = confirm("Voulez-vous supprimer " + nom + " " + prenom + " ?");
    if (ask) {
      //modif du DOM
      list[2].removeEventListener("click", deleteContact);
      parent.remove();
      //modif de l'objet
      retrievedContacts.splice(indexToDelete, 1);
      //stockage dans localStorage
      localStorage.setItem("mesContacts", JSON.stringify(retrievedContacts));
    }
  } else {
    console.log("le contact n'a pas été trouvé...");
  }
}

function showContact(nom, prenom) {
  //const parent = e.target.parentNode;
  //const list = parent.children;
  //const nom = list[0].textContent;
  //const prenom = list[1].textContent;
  const contact = retrievedContacts.find(
    (contact) => contact["nom"] === nom && contact["prenom"] === prenom
  );
  if (contact) {
    $("#inputNom").val(contact["nom"]);
    $("#inputPrenom").val(contact["prenom"]);
    $("#inputInfo").val(contact["dateDeNaissance"]);
    $("#inputPhone").val(contact["phone"]);
    $("#inputEmail").val(contact["mail"]);
    $("#inputAddress").val(contact["adresse"]);
    $("#inputState").val(contact["codePostal"]);
    if (contact["ville"]) {
      $("#inputCity").append("<option selected>" + contact["ville"] + "</option>");
    } else {
      $("#inputCity").empty();
    }
    /*newText = `<p>Nom / Prénom : ${contact["nom"]} ${contact["prenom"]}<br>
              Adresse : ${contact["adresse"]}<br>
              Phone : ${contact["phone"]}<br>
              Mail : ${contact["mail"]}<br>
              Code Postal / Ville : ${contact["codePostal"]} ${contact["ville"] || ""}</p>`;
    $("#showContact").html(newText);*/
  } else {
    console.log("le contact n'a pas été trouvé...");
  }
}

function addContact(evt) {
  evt.preventDefault();
  const nom = $("#inputNom").val();
  const prenom = $("#inputPrenom").val();
  const newContact = {
    nom: nom,
    prenom: prenom,
    dateDeNaissance: $("#inputInfo").val(),
    phone: $("#inputPhone").val(),
    mail: $("#inputEmail").val(),
    adresse: $("#inputAddress").val(),
    codePostal: $("#inputState").val(),
    ville: $("#inputCity").val(),
  };
  //on regarde si le contact existe dejà
  const contactAlreadyExist = retrievedContacts.findIndex(
    (contact) => contact["nom"] === nom && contact["prenom"] === prenom
  );

  if (contactAlreadyExist === -1) { //on crée le contact
    //on vide le formulaire
    $("form").trigger("reset");
    $("#inputCity").empty();
    //on ajoute le contact à notre liste
    retrievedContacts.push(newContact);
    //stockage dans localStorage
    localStorage.setItem("mesContacts", JSON.stringify(retrievedContacts));
    //on met à jour notre annuaire
    createContact(newContact);
    alert(nom + " " + prenom + " a bien été ajouté.");
  } else { //sinon on update le contact
    const ask = confirm("Voulez-vous mettre à jour " + nom + " " + prenom + " ?");
    if (ask) {
      $("form").trigger("reset");
      $("#inputCity").empty();
      retrievedContacts[contactAlreadyExist] = newContact;
      localStorage.setItem("mesContacts", JSON.stringify(retrievedContacts));
      alert(nom + " " + prenom + " a bien été mis à jour.");
    }
  }
}

function findTown(e) {
  const url =
    "https://apicarto.ign.fr/api/codes-postaux/communes/" + e.target.value;
  $("#inputCity").empty();
  $.ajax(url, {
    success: function (resultat) {
      for (let city of resultat) {
        $("#inputCity").append("<option>" + city.nomCommune + "</option>");
      }
    },
    error: function (err) {
      console.log(err);
    },
  });
}

$(function () {
  // Handler for .ready() called.
  template = document.querySelector("#template");
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
    console.log("Une sauvegarde locale a été trouvée");
    retrievedContacts = JSON.parse(localStorage.getItem("mesContacts"));
  } else {
    retrievedContacts = contacts;
  }

  //Ajout des contacts dans l'annuaire
  getContacts(retrievedContacts);

  //déclaration des event listeners du formulaire
  $("#inputState").on("change", findTown);
  $("form").submit(addContact);
  $("button[type=\"reset\"]").click(() => $("#inputCity").empty());
});
