const main = document.querySelector("main");
const caroselli = document.querySelectorAll(".carousel");
const apiUrl = "https://striveschool-api.herokuapp.com/api/product/";
const apiKey =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmY2NzkwODc5YzQ1ZjAwMTU2OWI1MDUiLCJpYXQiOjE3Mjc0Mjg4NzIsImV4cCI6MTcyODYzODQ3Mn0.SuUy0lmN2QMEDDR07oIWt8JtAWevjP9Oy0X-s5GIe70";
const caroselloDiv = document.getElementById("caroselloDiv");
const dropdownMenu = document.querySelector(".dropdown-menu");

const aggiornaDropdown = (carrello) => {
  dropdownMenu.innerHTML = "";

  carrello.forEach((prodotto) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <a class="dropdown-item" href="#">${prodotto.name} - €${prodotto.price}</a>
    `;
    dropdownMenu.appendChild(li);
  });
};

const recuperaCarrelloDaLocalStorage = () => {
  return JSON.parse(localStorage.getItem("carrello")) ? JSON.parse(localStorage.getItem("carrello")) : [];
};

const aggiornaCarrelloAlCaricamento = () => {
  const carrello = recuperaCarrelloDaLocalStorage();
  aggiornaDropdown(carrello);
};

const aquista = (prodoctList) => {
  prodoctList.forEach((prodotto) => {
    const prodottoImage = document.querySelector(`.carosello-image[data-id="${prodotto._id}"]`);

    prodottoImage.addEventListener("click", () => {
      const prodottoUrl = `details.html?id=${prodotto._id}&name=${encodeURIComponent(prodotto.name)}&price=${prodotto.price}&description=${encodeURIComponent(
        prodotto.description
      )}&imageUrl=${encodeURIComponent(prodotto.imageUrl)}`;

      const prodottoItem = document.createElement("li");
      prodottoItem.innerHTML = `
        <a class="dropdown-item" href="${prodottoUrl}">
          ${prodotto.name} - €${prodotto.price}
        </a>
      `;
      dropdownMenu.appendChild(prodottoItem);

      window.location.href = prodottoUrl;
    });
  });
};

const reload = () => {
  aquista();
  let color;
  let numRnd = Math.floor(Math.random() * 3);
  main.classList.remove("bg-bg-1", "bg-bg-2", "bg-bg-3");
  if (numRnd <= 0) {
    color = "bg-bg-1";
  } else if (numRnd <= 1) {
    color = "bg-bg-2";
  } else {
    color = "bg-bg-3";
  }
  main.classList.add(color);
};

setInterval(reload, 3000);

window.addEventListener("DOMContentLoaded", () => {
  fetch(apiUrl, {
    headers: {
      Authorization: apiKey,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("errore nella richiesta");
      }
    })
    .then((data) => {
      console.log(data);
      generaProdotti(data);
      aquista(data);
    })
    .catch((e) => {
      console.log(e);
    });

  const currentPage = window.location.pathname;

  const homeLink = document.getElementById("home-link");
  const backofficeLink = document.getElementById("backoffice-link");

  if (currentPage.includes("index.html")) {
    homeLink.classList.remove("text-secondary");
    homeLink.classList.add("text-white");

    backofficeLink.classList.remove("text-white");
    backofficeLink.classList.add("text-secondary");
  } else if (currentPage.includes("backoffice.html")) {
    backofficeLink.classList.remove("text-secondary");
    backofficeLink.classList.add("text-white");

    homeLink.classList.remove("text-white");
    homeLink.classList.add("text-secondary");
  }

  aggiornaCarrelloAlCaricamento();
});

caroselli.forEach((carosello) => {
  const prwBtn = carosello.querySelector(".carousel-control-prev");
  const nxtBtn = carosello.querySelector(".carousel-control-next");
  const caroselloInterno = carosello.querySelector(".carousel-inner");

  prwBtn.addEventListener("click", () => {
    caroselloInterno.scrollBy({ left: -caroselloInterno.offsetWidth, behavior: "smooth" });
  });

  nxtBtn.addEventListener("click", () => {
    caroselloInterno.scrollBy({ left: caroselloInterno.offsetWidth, behavior: "smooth" });
  });
});

const generaProdotti = (data) => {
  data.forEach((prodotto) => {
    caroselloDiv.innerHTML += `
        <img src=${prodotto.imageUrl} class="d-block carosello-image" data-id="${prodotto._id}" alt="img-prd" />
    `;
    console.log(prodotto.imageUrl);
  });
};
