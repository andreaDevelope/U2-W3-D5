const main = document.querySelector("main");
const dropdownMenu = document.querySelector(".dropdown-menu-end");

const apiUrl = "https://striveschool-api.herokuapp.com/api/product/";
const apiKey =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmY2NzkwODc5YzQ1ZjAwMTU2OWI1MDUiLCJpYXQiOjE3Mjc0Mjg4NzIsImV4cCI6MTcyODYzODQ3Mn0.SuUy0lmN2QMEDDR07oIWt8JtAWevjP9Oy0X-s5GIe70";

const changeBg = () => {
  let color;
  let numRnd = Math.floor(Math.random() * 3);
  main.classList.remove("bg-bg-1", "bg-bg-2", "bg-bg-3");
  color = numRnd === 0 ? "bg-bg-1" : numRnd === 1 ? "bg-bg-2" : "bg-bg-3";
  main.classList.add(color);
};
setInterval(changeBg, 3000);

const getParamsFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    id: params.get("id"),
    name: params.get("name"),
    price: params.get("price"),
    description: params.get("description"),
    imageUrl: params.get("imageUrl"),
  };
};

const aggiungiAlCarrello = (prodotto) => {
  let carrello = JSON.parse(localStorage.getItem("carrello")) ? JSON.parse(localStorage.getItem("carrello")) : [];

  carrello.push(prodotto);
  localStorage.setItem("carrello", JSON.stringify(carrello));

  aggiornaDropdown(carrello);
};

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

const eliminaProdotto = (productId) => {
  fetch(`${apiUrl}${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: apiKey,
    },
  })
    .then((response) => {
      if (response.ok) {
        const card = document.querySelector(".card-body");
        card.innerHTML = `
        <p class=" text-warning text-center">
          vuoi davvero eliminare questo prodotto definitivamente ?
        </p>
        <button class="btn btn-warning" id="elimina"> ok </button>
        `;
        const btn = document.getElementById("elimina");
        btn.addEventListener("click", () => {
          let carrello = JSON.parse(localStorage.getItem("carrello")) || [];
          carrello = carrello.filter((prodotto) => prodotto.id !== productId);
          localStorage.setItem("carrello", JSON.stringify(carrello));

          aggiornaDropdown(carrello);

          const p = document.createElement("p");
          p.innerText = "podotto eliminato con successo";
          p.classList.add("text-success");
          card.appendChild(p);
          setInterval(() => {
            window.location.href = "./index.html";
          }, 1500);
        });
      } else {
        throw new Error("Errore durante l'eliminazione del prodotto.");
      }
    })
    .catch((error) => {
      console.error("Errore:", error);
    });
};

const modificaProdotto = (prodotto) => {
  const updatedProduct = {
    name: document.querySelector("#name").value,
    description: document.querySelector("#description").value,
    brand: prodotto.brand,
    imageUrl: prodotto.imageUrl,
    price: parseFloat(document.querySelector("#price").value),
  };

  fetch(`${apiUrl}${prodotto.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiKey,
    },
    body: JSON.stringify(updatedProduct),
  })
    .then((response) => {
      if (response.ok) {
        const carrello = JSON.parse(localStorage.getItem("carrello")) || [];
        const index = carrello.findIndex((p) => p.id === prodotto.id);
        if (index !== -1) {
          carrello[index] = { ...carrello[index], ...updatedProduct }; //questa è una kikka ce so andato di spread e me la flexo
          localStorage.setItem("carrello", JSON.stringify(carrello));
        }

        const card = document.querySelector(".card-body");
        const p = document.createElement("p");
        p.innerText = "podotto modificato con successo";
        p.classList.add("text-success");
        card.appendChild(p);
        console.log(card);
        setInterval(() => {
          window.location.href = "./index.html";
        }, 1500);
      } else {
        throw new Error("Errore durante la modifica del prodotto.");
      }
    })
    .catch((error) => {
      console.error("Errore:", error);
    });
};

const creaCardProdotto = (prodotto) => {
  const card = `
    <div class="card" style="width: 18rem;">
      <img src="${prodotto.imageUrl}" class="card-img-top" alt="${prodotto.name}">
      <div class="card-body">
        <h5 class="card-title">${prodotto.name}</h5>
        <p class="card-text">${prodotto.description}</p>
        <p class="card-text"><strong>Price: €${prodotto.price}</strong></p>
        <input class="mb-2 p-2 rounded-2" type="text" id="name" placeholder="Nuovo Nome" value="${prodotto.name}" />
        <input class="mb-2 p-2 rounded-2 type="text" id="description" placeholder="Nuova Descrizione" value="${prodotto.description}" />
        <input class="mb-2 p-2 rounded-2 type="number" id="price" placeholder="Nuovo Prezzo" value="${prodotto.price}" />
        <a href="#" id="aggiungi-carrello" class="btn btn-primary mb-2">Aggiungi al carrello</a>
        <button id="modifica-btn" class="btn btn-warning mb-2">Modifica prodotto</button>
        <button id="delete-btn" class="btn btn-danger mb-2">Elimina prodotto</button>
      </div>
    </div>
  `;

  main.innerHTML = card;

  const aggiungiBtn = document.getElementById("aggiungi-carrello");
  aggiungiBtn.addEventListener("click", () => aggiungiAlCarrello(prodotto));

  const deleteBtn = document.getElementById("delete-btn");
  deleteBtn.addEventListener("click", () => eliminaProdotto(prodotto.id));

  const modificaBtn = document.getElementById("modifica-btn");
  modificaBtn.addEventListener("click", () => modificaProdotto(prodotto));
};

window.addEventListener("DOMContentLoaded", () => {
  const prodotto = getParamsFromUrl();
  creaCardProdotto(prodotto);

  const carrello = JSON.parse(localStorage.getItem("carrello")) ? JSON.parse(localStorage.getItem("carrello")) : [];
  aggiornaDropdown(carrello);
});
