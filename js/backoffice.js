const dropdownMenu = document.querySelector(".dropdown-menu-end");
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

class Prodotto {
  constructor(name, description, brand, imageUrl, price) {
    this.name = name;
    this.description = description;
    this.brand = brand;
    this.imageUrl = imageUrl;
    this.price = price;
  }

  getInfo() {
    return `
        Nome: ${this.name}
        Descrizione: ${this.description}
        Marca: ${this.brand}
        URL Immagine: ${this.imageUrl}
        Prezzo: €${this.price}
      `;
  }

  setPrice(newPrice) {
    this.price = newPrice;
  }

  toJSON() {
    return {
      name: this.name,
      description: this.description,
      brand: this.brand,
      imageUrl: this.imageUrl,
      price: this.price,
    };
  }
}

const apiUrl = "https://striveschool-api.herokuapp.com/api/product/";
const apiKey =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmY2NzkwODc5YzQ1ZjAwMTU2OWI1MDUiLCJpYXQiOjE3Mjc0Mjg4NzIsImV4cCI6MTcyODYzODQ3Mn0.SuUy0lmN2QMEDDR07oIWt8JtAWevjP9Oy0X-s5GIe70";
const form = document.querySelector("main form");
const main = document.querySelector("main");

const changeBg = () => {
  let color;
  let numRnd = Math.floor(Math.random() * 3);
  main.classList.remove("bg-bg-1", "bg-bg-2", "bg-bg-3");
  if (numRnd <= 0) {
    color = "bg-bg-1";
  } else if (numRnd <= 1) {
    color = "bg-secondary";
  } else {
    color = "bg-bg-3";
  }
  main.classList.add(color);
};

setInterval(changeBg, 3000);

const recuperaCarrelloDaLocalStorage = () => {
  return JSON.parse(localStorage.getItem("carrello")) ? JSON.parse(localStorage.getItem("carrello")) : [];
};

const aggiornaCarrelloAlCaricamento = () => {
  const carrello = recuperaCarrelloDaLocalStorage();
  aggiornaDropdown(carrello);
};

const recuperaProdottiDalDB = (callback) => {
  fetch(apiUrl, {
    headers: {
      Authorization: apiKey,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Errore durante il recupero dei prodotti");
      }
    })
    .then((data) => {
      callback(data);
    })
    .catch((error) => {
      console.error(error);
      callback([]);
    });
};

const aggiungiProdottiAlDB = (prodotto) => {
  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiKey,
    },
    body: JSON.stringify(prodotto),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return response.text().then((text) => {
          throw new Error("Errore nella richiesta: " + text);
        });
      }
    })
    .then((data) => {
      console.log(`Prodotto aggiunto: ${data.name}`);
    })
    .catch((error) => {
      console.error(error);
    });
};

window.addEventListener("DOMContentLoaded", () => {
  aggiornaCarrelloAlCaricamento();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = form.querySelector("#name").value;
  const description = form.querySelector("#description").value;
  const brand = form.querySelector("#brand").value;
  const imageUrl = form.querySelector("#imageUrl").value;
  const price = parseFloat(form.querySelector("#price").value);

  const nuovoProdotto = new Prodotto(name, description, brand, imageUrl, price);

  aggiungiProdottiAlDB(nuovoProdotto);
});
