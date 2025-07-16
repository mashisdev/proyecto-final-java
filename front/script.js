// --- CONFIGURACIÓN E INICIALIZACIÓN ---

// URL base de tu API de Spring Boot. ¡Cámbiala si tu backend corre en otro puerto!
const API_BASE_URL = "http://localhost:8080/api";

// Estado de la aplicación: guardaremos los productos y el carrito aquí.
let products = [];
let cart = [];

// Elementos del DOM que usaremos frecuentemente.
const productCarouselsContainer = document.getElementById(
  "product-carousels-container"
);
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalElement = document.getElementById("cart-total");
const buyButton = document.getElementById("buy-button");
const clearCartButton = document.getElementById("clear-cart-button");
const modal = document.getElementById("customer-modal");
const closeModalButton = document.querySelector(".close-button");
const customerForm = document.getElementById("customer-form");
const searchOrderForm = document.getElementById("search-order-form");
const orderResultsContainer = document.getElementById(
  "order-results-container"
);

// Evento que se dispara cuando el contenido de la página ha sido cargado.
document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
  addEventListeners();
});

function addEventListeners() {
  // Escucha clics en los botones de "Añadir al carrito"
  productCarouselsContainer.addEventListener("click", handleProductInteraction);

  // Escucha clics en los botones del carrito
  buyButton.addEventListener("click", () => (modal.style.display = "block"));
  clearCartButton.addEventListener("click", clearCart);
  closeModalButton.addEventListener(
    "click",
    () => (modal.style.display = "none")
  );
  window.addEventListener("click", (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });

  // Escucha el envío del formulario de cliente
  customerForm.addEventListener("submit", handlePurchase);

  // Escucha el envío del formulario de búsqueda de órdenes
  searchOrderForm.addEventListener("submit", handleSearchOrder);
}

// --- LÓGICA DE PRODUCTOS ---

/**
 * Obtiene todos los productos de la API y los muestra.
 */
async function fetchProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    products = await response.json();
    displayProducts(products);
  } catch (error) {
    console.error("Error al cargar productos:", error);
    productCarouselsContainer.innerHTML =
      "<p>No se pudieron cargar los productos. Asegúrate de que el backend esté funcionando.</p>";
  }
}

/**
 * Agrupa los productos por categoría y los renderiza en la página.
 * @param {Array} products - La lista de productos a mostrar.
 */
function displayProducts(products) {
  const productsByCategory = products.reduce((acc, product) => {
    const category = product.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  productCarouselsContainer.innerHTML = ""; // Limpiar el contenedor
  for (const category in productsByCategory) {
    const categoryContainer = document.createElement("div");
    categoryContainer.className = "category-carousel";
    categoryContainer.innerHTML = `<h2>${category}</h2>`;

    const productList = document.createElement("div");
    productList.className = "product-list";

    productsByCategory[category].forEach((product) => {
      const productCard = document.createElement("div");
      productCard.className = "product-card";
      productCard.dataset.productId = product.id;
      productCard.innerHTML = `
                <img src="${
                  product.imageUrl || "https://via.placeholder.com/150"
                }" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="brand">${product.brand}</p>
                <p class="description">${product.description}</p>
                <p class="price">$${product.price.toFixed(2)}</p>
                <p class="stock">Stock: ${product.stock}</p>
                <div class="quantity-control">
                    <button class="quantity-btn minus" data-action="minus">-</button>
                    <span class="quantity">1</span>
                    <button class="quantity-btn plus" data-action="plus">+</button>
                </div>
                <button class="add-to-cart-btn">Añadir al carrito</button>
            `;
      productList.appendChild(productCard);
    });

    categoryContainer.appendChild(productList);
    productCarouselsContainer.appendChild(categoryContainer);
  }
}

// --- LÓGICA DEL CARRITO ---

/**
 * Maneja los clics dentro del contenedor de productos (añadir, sumar, restar).
 * @param {Event} event - El objeto del evento de clic.
 */
function handleProductInteraction(event) {
  const target = event.target;
  const productCard = target.closest(".product-card");
  if (!productCard) return;

  const productId = Number(productCard.dataset.productId);
  const quantitySpan = productCard.querySelector(".quantity");
  let quantity = Number(quantitySpan.textContent);

  if (target.matches(".quantity-btn")) {
    const action = target.dataset.action;
    if (action === "plus") {
      quantity++;
    } else if (action === "minus" && quantity > 1) {
      quantity--;
    }
    quantitySpan.textContent = quantity;
  }

  if (target.matches(".add-to-cart-btn")) {
    addToCart(productId, quantity);
  }
}

/**
 * Añade un producto al carrito o actualiza su cantidad.
 * @param {number} productId - El ID del producto.
 * @param {number} quantity - La cantidad a añadir.
 */
function addToCart(productId, quantity) {
  const product = products.find((p) => p.id === productId);
  if (!product || product.stock < quantity) {
    alert("Stock insuficiente.");
    return;
  }

  const cartItem = cart.find((item) => item.productId === productId);
  if (cartItem) {
    cartItem.quantity += quantity;
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
    });
  }
  updateCartDisplay();
}

/**
 * Actualiza la visualización del carrito en la barra lateral.
 */
function updateCartDisplay() {
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>El carrito está vacío.</p>";
    buyButton.disabled = true;
    clearCartButton.disabled = true;
  } else {
    cartItemsContainer.innerHTML = ""; // Limpiar
    cart.forEach((item) => {
      const itemElement = document.createElement("div");
      itemElement.className = "cart-item";
      itemElement.innerHTML = `
                <span>${item.name} (x${item.quantity})</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            `;
      cartItemsContainer.appendChild(itemElement);
    });
    buyButton.disabled = false;
    clearCartButton.disabled = false;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotalElement.textContent = `$${total.toFixed(2)}`;
}

/**
 * Vacía el carrito por completo.
 */
function clearCart() {
  cart = [];
  updateCartDisplay();
}

// --- LÓGICA DE COMPRA Y ÓRDENES ---

/**
 * Maneja el proceso de compra final.
 * @param {Event} event - El objeto del evento submit del formulario.
 */
async function handlePurchase(event) {
  event.preventDefault(); // Evitar que la página se recargue

  const customerRequest = {
    firstName: document.getElementById("firstname").value,
    lastName: document.getElementById("lastname").value,
    email: document.getElementById("email").value,
  };

  try {
    // Paso 1: Obtener o crear el cliente
    const customer = await getOrCreateCustomer(customerRequest);

    // Paso 2: Crear la orden
    const orderRequest = {
      customerId: customer.id,
      items: cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    const orderResponse = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderRequest),
    });

    if (!orderResponse.ok) {
      throw new Error(`Error al crear la orden: ${await orderResponse.text()}`);
    }

    const newOrder = await orderResponse.json();
    alert(`¡Compra exitosa! Tu ID de orden es: ${newOrder.id}`);

    // Paso 3: Limpiar
    clearCart();
    modal.style.display = "none";
    customerForm.reset();
  } catch (error) {
    console.error("Error en el proceso de compra:", error);
    alert(`Error en la compra: ${error.message}`);
  }
}

/**
 * Busca un cliente por email. Si no existe, lo crea.
 * @param {object} customerRequest - Datos del cliente.
 * @returns {Promise<object>} - El cliente existente o el nuevo.
 */
async function getOrCreateCustomer(customerRequest) {
  // Intenta buscar el cliente por email
  try {
    const response = await fetch(
      `${API_BASE_URL}/customers/search?email=${encodeURIComponent(
        customerRequest.email
      )}`
    );
    if (response.ok) {
      return await response.json(); // Cliente encontrado
    }
    if (response.status === 404) {
      // Cliente no encontrado, lo creamos
      const createResponse = await fetch(`${API_BASE_URL}/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerRequest),
      });
      if (!createResponse.ok) {
        throw new Error("No se pudo crear el cliente.");
      }
      return await createResponse.json();
    }
    throw new Error("Error al buscar el cliente.");
  } catch (error) {
    console.error("Error en getOrCreateCustomer:", error);
    throw error; // Re-lanzar el error para que handlePurchase lo capture
  }
}

/**
 * Maneja la búsqueda de órdenes por email.
 * @param {Event} event - El evento de submit del formulario.
 */
async function handleSearchOrder(event) {
  event.preventDefault();
  const email = document.getElementById("search-email").value;
  orderResultsContainer.innerHTML = "Buscando...";

  try {
    // 1. Buscar el cliente por email
    const customerResponse = await fetch(
      `${API_BASE_URL}/customers/search?email=${encodeURIComponent(email)}`
    );
    if (!customerResponse.ok) {
      throw new Error("Cliente no encontrado.");
    }
    const customer = await customerResponse.json();

    // 2. Buscar las órdenes con el ID del cliente
    const ordersResponse = await fetch(
      `${API_BASE_URL}/orders/customer/${customer.id}`
    );
    if (!ordersResponse.ok) {
      throw new Error("No se encontraron órdenes para este cliente.");
    }

    // El status 204 (NO_CONTENT) indica que no hay órdenes.
    if (ordersResponse.status === 204) {
      orderResultsContainer.innerHTML = "<p>No tienes órdenes registradas.</p>";
      return;
    }

    const orders = await ordersResponse.json();
    displayOrders(orders);
  } catch (error) {
    orderResultsContainer.innerHTML = `<p style="color: #e74c3c;">${error.message}</p>`;
  }
}

/**
 * Muestra las órdenes encontradas en el contenedor de resultados.
 * @param {Array} orders - La lista de órdenes a mostrar.
 */
function displayOrders(orders) {
  if (orders.length === 0) {
    orderResultsContainer.innerHTML = "<p>No se encontraron órdenes.</p>";
    return;
  }

  let html = "<ul>";
  orders.forEach((order) => {
    html += `<li>
            <strong>Orden #${order.id}</strong> - Fecha: ${new Date(
      order.orderDate
    ).toLocaleDateString()}
            - Total: $${order.totalAmount.toFixed(2)}
        </li>`;
  });
  html += "</ul>";
  orderResultsContainer.innerHTML = html;
}
