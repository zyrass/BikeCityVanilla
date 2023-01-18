/**
 * ==========================================================================
 * VARIABLES SELON UNE SELECTION D'UN ELEMENT
 * --------------------------------------------------------------------------
 * - Pour le h1 c'est un tableau qui est récupéré
 * ==========================================================================
 */
const h1 = document.getElementsByTagName("h1")[0];
const p = document.getElementById("paragraphePresention");
const root = document.querySelector(".map__container");
const date = document.querySelector("#date");
const buttons = document.querySelectorAll("button");

let map;

/**
 * ==========================================================================
 * CREATION D'UNE TEXT NODE
 * ASSOCIATION DE LA TEXT NODE AU H1
 * ==========================================================================
 */
const titreH1 = document.createTextNode("BikeCity");
h1.appendChild(titreH1);

/**
 * ==========================================================================
 * MEME CHOSE QUE PRECEDEMMENT EN UNE SEUL LIGNE
 * ==========================================================================
 */
p.innerText =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos porroperspiciatis sit imilique, voluptatibus adipisci maiores neque cum, molestiae maxime, numquam consectetur saepe in? Hic ipsa aut incidunt, quo, expedita laboriosam accusamus blanditiis beatae quasi alias necessitatibus dolore velit pariatur corrupti, aperiam veniam dolor laudantium.";

/**
 * ==========================================================================
 * AJOUR D'UN STYLE CSS POUR LE PARAGRAPHE
 * ==========================================================================
 */
p.style.letterSpacing = "1.4px";

/**
 * ==========================================================================
 * AJOUT D'UNE CLASS
 * ==========================================================================
 */
p.classList.add("jeSuisUneClassCreeEnJsEtStylyseeEnCSS");

/**
 * ==========================================================================
 * BOUCLE SUR TOUT LES BOUTONS
 * ==========================================================================
 */
for (let i = 0; i < buttons.length; i++) {
  /**
   * ==========================================================================
   * EACH BUTTON SHOW MAP
   * ==========================================================================
   */
  buttons[i].addEventListener("click", (e) => {
    e.preventDefault();
    if (buttons[i] == buttons[0]) {
      getStations("Lyon");
    } else if (buttons[i] == buttons[1]) {
      getStations("Marseille");
    } else if (buttons[i] == buttons[2]) {
      getStations("Creteil");
    }
  });
}

/**
 * ==========================================================================
 * FOOTER SECTION DATE
 * ==========================================================================
 */
setInterval(() => {
  date.innerText = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    year: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "numeric",
    second: "numeric",
    // era: "long"
  });
}, 1000);

/**
 * ==========================================================================
 * FONCTION AVEC OBJET XMLHTTPREQUEST
 * ==========================================================================
 */
const getStations = (city = "Lyon") => {
  const API_KEY_PERSO = "...";

  const xhttp = new XMLHttpRequest();
  xhttp.onload = function () {
    if (city == "Lyon") {
      try {
        map = L.map("root").setView(
          [45.779848493795605, 4.750634469274379],
          13
        );
        marker = L.marker([45.779848493795605, 4.750634469274379])
          .addTo(map)
          .bindPopup(
            "<b>Campus Région Numérique</b><br /><strong>IT-AKADEMY et les DFS26C ;)</strong>"
          )
          .openPopup();
      } catch (error) {
        console.log(error);
      }
    } else if (city == "Marseille") {
      try {
        map = L.map("root").setView(
          [43.302249395869836, 5.372524980161661],
          13
        );
      } catch (error) {
        console.log(error);
      }
    } else if (city == "Creteil") {
      try {
        map = L.map("root").setView([48.7771486, 2.4530731], 13);
      } catch (error) {
        console.log(error);
      }
    }

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const data = JSON.parse(this.responseText);
    for (let i = 0; i < data.length; i++) {
      const lattitude = data[i].position.lat;
      const longitude = data[i].position.lng;

      console.log(data[i]);

      marker = L.marker([lattitude, longitude])
        .addTo(map)
        .bindPopup(
          `
          [<i>${data[i].name}</i>] - <b>${data[i].address}<b><br /><hr />
          -🚲 Vélo disponible : ${data[i].available_bikes}/${data[i].bike_stands}<br />
          -🚲 Support vélo disponible : ${data[i].available_bike_stands}/${data[i].bike_stands}<br />
        `
        )
        .openPopup();
    }
  };
  xhttp.open(
    "GET",
    `https://api.jcdecaux.com/vls/v1/stations?contract=${city}&apiKey=${API_KEY_PERSO}`
  );
  xhttp.send();
};
