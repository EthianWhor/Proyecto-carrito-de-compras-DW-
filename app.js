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
let cart = [];

// ======================
// DOM
// ======================
const productsDiv = document.querySelector("#products");
const cartDiv = document.querySelector("#cart");
const emptyCartP = document.querySelector("#emptyCart");
const totalSpan = document.querySelector("#total");
const headerTotalSpan = document.querySelector("#headerTotal"); // NUEVO
const searchInput = document.querySelector("#searchInput");
const clearCartBtn = document.querySelector("#clearCartBtn");

// Vistas (2 vistas)
const catalogView = document.querySelector("#catalogView");
const cartView = document.querySelector("#cartView");
const goCatalogBtn = document.querySelector("#goCatalogBtn");
const goCartBtn = document.querySelector("#goCartBtn");

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
// Navegación entre vistas
// ======================
function showCatalog() {
  catalogView.classList.remove("hidden");
  cartView.classList.add("hidden");
}

function showCart() {
  cartView.classList.remove("hidden");
  catalogView.classList.add("hidden");
}

// ======================
// Total del carrito (para header y vista carrito)
// ======================
function getTotal() {
  let total = 0;

  cart.forEach(item => {
    const p = findProduct(item.id);
    total += p.price * item.qty;
  });

  return total;
}

// NUEVO: Actualiza el total del header
function updateHeaderTotal() {
  headerTotalSpan.textContent = formatCOP(getTotal());
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

    div.querySelector("button").addEventListener("click", () => {
      addToCart(p.id);
    });

    productsDiv.appendChild(div);
  });
}

// ======================
// Carrito (lógica)
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

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  renderCart();
}

function changeQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  const newQty = item.qty + delta;

  // Si baja a 0, se elimina del carrito
  if (newQty <= 0) {
    removeFromCart(productId);
    return;
  }

  item.qty = newQty;
  renderCart();
}

function clearCart() {
  cart = [];
  renderCart();
}

// ======================
// Render Carrito
// ======================
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
      <p>Cantidad: <span>${item.qty}</span></p>

      <button data-dec="${p.id}">-</button>
      <button data-inc="${p.id}">+</button>

      <button data-remove="${p.id}">Eliminar</button>
    `;

    div.querySelector("[data-inc]").addEventListener("click", () => {
      changeQty(p.id, +1);
    });

    div.querySelector("[data-dec]").addEventListener("click", () => {
      changeQty(p.id, -1);
    });

    div.querySelector("[data-remove]").addEventListener("click", () => {
      removeFromCart(p.id);
    });

    cartDiv.appendChild(div);
  });

  // Total de la vista carrito
  totalSpan.textContent = formatCOP(getTotal());

  // NUEVO: Total en el header también
  updateHeaderTotal();
}

// ======================
// Eventos
// ======================
searchInput.addEventListener("input", () => {
  const text = searchInput.value.toLowerCase().trim();

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(text)
  );

  renderProducts(filtered);
});

clearCartBtn.addEventListener("click", clearCart);

// Botones de navegación
goCatalogBtn.addEventListener("click", showCatalog);
goCartBtn.addEventListener("click", showCart);

// ======================
// Render inicial
// ======================
renderProducts(products);
renderCart();
showCatalog(); // empieza en catálogo
