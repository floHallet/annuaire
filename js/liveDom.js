const letters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
let retrievedContacts = contacts;

function getContacts(arr) {
    //const list = document.querySelector("#list");
    const template = document.querySelector("#template");
    //tri des contacts par ordre alphabétique
    arr.sort((a, b) => a.nom > b.nom ? 1 : -1 );
    //console.log(contacts);
      $(".contact" ).remove();
    // 1 - Je boucle sur l'objet "contacts"
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
      clone.className = "ps-4 contact";
      // 6 - J'ajoute les éléments au DOM
      const firstLetter = contact["nom"][0];
      document.getElementById(firstLetter).appendChild(clone);
      
      //console.log("done");
    }
    retrievedContacts = arr;
    localStorage.setItem('contacts', JSON.stringify(arr)); 
}

function deleteContact(e) {
  const parent = e.target.parentNode;
  const list = parent.children;
  const nom = list[0].textContent;
  const prenom = list[1].textContent;
  //console.log(nom, prenom);
  parent.remove();
  const filteredContactList = retrievedContacts.filter(contact => contact["nom"] !== nom);
  retrievedContacts = filteredContactList;
  localStorage.setItem('contacts', JSON.stringify(retrievedContacts));
  //console.log(retrievedContacts);
}

function showContact(e) {
  const nom = e.target.textContent;
  const contact = retrievedContacts.filter(contact => contact["nom"] === nom);
  //console.log(contact[0]);
  //const contactDiv = document.createElement("div");
      //letterDiv.setAttribute("id", letter);
      newText = `Nom / Prénom : ${contact[0]["nom"]} ${contact[0]["prenom"]}<br>Phone : ${contact[0]["phone"]}<br>Mail : ${contact[0]["mail"]}<br>Adresse : ${contact[0]["adresse"]}<br>Date de naissance : ${contact[0]["dateDeNaissance"]}<br>Code Postal : ${contact[0]["codePostal"]}<br>`;
      //letterDiv.className = "p-2";
      document.getElementById("showContact").innerHTML = newText;
}

function addContact(evt) {
    evt.preventDefault();
    console.log('le boutton ajout a été cliqué');
    //let leNom = document.getElementById('nom').value
    let leNom = $('.fnom').val();
    let lePrenom = $('.fprenom').val();
    let laDate = $('.date').val();
    let leTel = $('.tel').val();
    let leEmail = $('.mail').val();
    let lAdresse = $('.adresse').val();
    let lInfoSup = $('.info_sup').val();
    let leCodePost = $('.code_post').val();
    let laVille = $('.ville').val();

    //alert(leNom);
    // if (leNom.length == 0) {
    //     alert('Merci d\'indiquer le Nom')
    // }
    // else if (lePrenom.length == 0) {
    //     alert('Merci d\'indiquer le Prénom')
    // }
    // else if (laDate.length != 0) {
    //     alert('Merci d\'indiquer la date')
    // }
    // else if (leTel.length != 0 && leTel.length < 10) {
    //     alert('Merci d\'indiquer un numéro à 10 chiffres')
    // }
    // else if (leEmail.length != 0) {
    //     alert('Merci d\'indiquer l\'adresse mail')
    // }
    // else if (lAdresse.length != 0) {
    //     alert('Merci d\'indiquer l\'adresse')
    // }
    // else if (leCodePost.length != 0) {
    //     alert('Merci d\'indiquer le code postal')
    // }
    // else if (laVille.length != 0) {
    //     alert('Merci d\'indiquer la ville')
    // }

    //else {
        //console.log('Tout est ok je crée donc mon objet');
        let donnees_form = {
            nom: leNom,
            prenom: lePrenom,
            dateDeNaissance: laDate,
            phone: leTel,
            mail: leEmail,
            adresse: lAdresse,
            info_sup: lInfoSup,
            codePostal: leCodePost,
            ville: laVille
        }
        //console.log(donnees_form);
        document.getElementById("monForm").reset();
        retrievedContacts.push(donnees_form);
        getContacts(retrievedContacts); 

    //}
    //console.log(evt);
}

function findTown(e) {
    const url = "https://apicarto.ign.fr/api/codes-postaux/communes/"+e.target.value;
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

function mOver(e) {
  //button.removeAttribute('hidden')
  //console.log("coucou")
}

$(function() { // Handler for .ready() called.
  //initialise la page avec A B C...etc
  for (const letter of letters) {
      const lettersGroup = document.querySelector(".lettersGroup");
      const lien = document.createElement("a");
      lien.setAttribute("href", `#${letter}`);
      lien.classList.add("btn");
      lien.classList.add("m-2");
      lien.classList.add("btn-light");
      lien.textContent = letter;
      lettersGroup.appendChild(lien);
      //initialisation du répertoire
      const letterDiv = document.createElement("div");
      letterDiv.setAttribute("id", letter);
      letterDiv.innerHTML = letter + "<hr>";
      letterDiv.className = "p-2";
      document.getElementById("list").appendChild(letterDiv);
    }

  if (localStorage.getItem('contacts')) { //we test whether the storage object has already been populated 
    //alert('storage trouvé !');
    retrievedContacts = JSON.parse(localStorage.getItem('contacts'));
  } 
  getContacts(retrievedContacts);

  $(".contact button").on("click", deleteContact);

  $(".nom").on("click", showContact);

  $('#monForm').submit(addContact);

  $('.button_reset').on("click", () => document.getElementById("monForm").reset());

  $(".code_post").on("change", findTown);
  //$(".contact").on( "mouseover", mOver);
  /*const trash = document.querySelectorAll(".contact");
  const button = document.querySelector("#button")
  trash.addEventListener("mouseover", mOver, false)*/
});