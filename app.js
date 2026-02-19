// ======================
// DATOS (catálogo)
// ======================
const products = [
  { id: 1, name: "Cuaderno Profesional", category: "Cuadernos", price: 12500 },
  { id: 2, name: "Lapicero Negro", category: "Escritura", price: 2200 },
  { id: 3, name: "Resaltador Amarillo", category: "Escritura", price: 4500 },
  { id: 4, name: "Regla 30 cm", category: "Útiles", price: 3000 },
];

// ======================
// ESTADO (carrito)
// ======================
// Por ahora el carrito solo guarda {id, qty}
let cart = [];

// ======================
// DOM
// ======================
const productsDiv = document.querySelector("#products");
const cartDiv = document.querySelector("#cart");
const emptyCartP = document.querySelector("#emptyCart");
const totalSpan = document.querySelector("#total");
const searchInput = document.querySelector("#searchInput");

// ======================
// Utils
// ======================
function formatCOP(n) {
  return n.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  });
}

function findProduct(id) {
  return products.find(p => p.id === id);
}

// ======================
// Render Catálogo
// ======================
function renderProducts(list) {
  productsDiv.innerHTML = "";

  list.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";

    div.innerHTML = `
      <h3>${p.name}</h3>
      <p>Categoría: ${p.category}</p>
      <p>Precio: ${formatCOP(p.price)}</p>
      <button data-id="${p.id}">Agregar</button>
    `;

    // Evento agregar
    div.querySelector("button").addEventListener("click", () => {
      addToCart(p.id);
    });

    productsDiv.appendChild(div);
  });
}

// ======================
// Carrito (básico)
// ======================
function addToCart(productId) {
  const item = cart.find(i => i.id === productId);

  if (item) {
    item.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }

  renderCart();
}

// Por ahora solo elimina completo (más adelante hago + / -)
function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  renderCart();
}

function getTotal() {
  let total = 0;

  cart.forEach(item => {
    const p = findProduct(item.id);
    total += p.price * item.qty;
  });

  return total;
}

function renderCart() {
  cartDiv.innerHTML = "";

  // Mostrar / ocultar mensaje vacío
  emptyCartP.style.display = cart.length === 0 ? "block" : "none";

  cart.forEach(item => {
    const p = findProduct(item.id);

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <strong>${p.name}</strong>
      <p>Cantidad: ${item.qty}</p>
      <button data-remove="${p.id}">Eliminar</button>
    `;

    div.querySelector("button").addEventListener("click", () => {
      removeFromCart(p.id);
    });

    cartDiv.appendChild(div);
  });

  totalSpan.textContent = formatCOP(getTotal());
}

// ======================
// Buscar (en proceso)
// ======================
searchInput.addEventListener("input", () => {
  const text = searchInput.value.toLowerCase().trim();

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(text)
  );

  renderProducts(filtered);
});

// Render inicial
renderProducts(products);
renderCart();

/*
  TODO (pendiente):
  - Botones + y - para cambiar cantidades
  - Subtotal por producto
  - Botón para vaciar carrito
  - Mejorar estilos / grid de catálogo
*/
