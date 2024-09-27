const main = document.querySelector("main");

const apiKey =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmY2NzkwODc5YzQ1ZjAwMTU2OWI1MDUiLCJpYXQiOjE3Mjc0Mjg4NzIsImV4cCI6MTcyODYzODQ3Mn0.SuUy0lmN2QMEDDR07oIWt8JtAWevjP9Oy0X-s5GIe70";

const changeBg = () => {
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

setInterval(changeBg, 3000);

const getParamsFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const prodotto = {
    id: params.get("id"),
    name: params.get("name"),
    price: params.get("price"),
    description: params.get("description"),
    imageUrl: params.get("imageUrl"),
  };
  return prodotto;
};

const creaCardProdotto = (prodotto) => {
  const card = `
      <div class="card" style="width: 18rem;">
        <img src="${prodotto.imageUrl}" class="card-img-top" alt="${prodotto.name}">
        <div class="card-body">
          <h5 class="card-title">${prodotto.name}</h5>
          <p class="card-text">${prodotto.description}</p>
          <p class="card-text"><strong>Price: €${prodotto.price}</strong></p>
          <a href="#" class="btn btn-primary">Aggiungi al carrello</a>
        </div>
      </div>
    `;

  main.innerHTML = card;
};

window.addEventListener("DOMContentLoaded", () => {
  const prodotto = getParamsFromUrl(); // Ottieni il prodotto dall'URL
  creaCardProdotto(prodotto); // Crea e inserisci la card
});
