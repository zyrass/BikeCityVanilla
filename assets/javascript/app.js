/**
 * ==========================================================================
 * VARIABLES SELON UNE SELECTION D'UN ELEMENT
 * --------------------------------------------------------------------------
 * - Pour le h1 c'est un tableau qui est récupéré
 * ==========================================================================
 */
const h1 = document.getElementsByTagName("h1")[0];
const p = document.getElementById("paragraphePresention");
const btn = document.getElementById("btnShowMap");
const root = document.querySelector(".map__container");
const date = document.querySelector("#date");

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
 * BUTTON SHOW MAP
 * ==========================================================================
 */
btn.addEventListener("click", (e) => {
  e.preventDefault();
  getStations();
  // getStations("Marseille");
});

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
 * FONCTION
 * ==========================================================================
 */
const getStations = (city = "Lyon") => {
  const API_KEY_PERSO = "🚧 VOTRE API KEY ICI";

  const xhttp = new XMLHttpRequest();
  xhttp.onload = function () {
    const map = L.map("root").setView(
      [45.779848493795605, 4.750634469274379],
      13
    );

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

    marker = L.marker([45.779848493795605, 4.750634469274379])
      .addTo(map)
      .bindPopup(
        "<b>Campus Région Numérique</b><br /><strong>IT-AKADEMY et les DFS26C ;)</strong>"
      )
      .openPopup();
  };
  xhttp.open(
    "GET",
    `https://api.jcdecaux.com/vls/v1/stations?contract=${city}&apiKey=${API_KEY_PERSO}`
  );
  xhttp.send();
};
