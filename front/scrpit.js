document.addEventListener("DOMContentLoaded", () => {
  const API_BASE_URL = "http://localhost:8080/api"; // Ajusta esto si tu backend corre en otro puerto/dominio

  const productListSection = document.getElementById("product-list");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalSpan = document.getElementById("cart-total");
  const emptyCartMessage = document.getElementById("empty-cart-message");
  const clearCartBtn = document.getElementById("clear-cart-btn");
  const checkoutBtn = document.getElementById("checkout-btn");

  const checkoutModal = document.getElementById("checkout-modal");
  const checkoutForm = document.getElementById("checkout-form");
  const firstNameInput = document.getElementById("firstName");
  const lastNameInput = document.getElementById("lastName");
  const emailInput = document.getElementById("email");
  const closeButtons = document.querySelectorAll(".close-button");

  const ordersModal = document.getElementById("orders-modal");
  const viewOrdersBtn = document.getElementById("view-orders-btn");
  const orderSearchForm = document.getElementById("order-search-form");
  const searchEmailInput = document.getElementById("search-email");
  const customerOrdersResults = document.getElementById(
    "customer-orders-results"
  );

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let allProducts = []; // Para almacenar todos los productos una vez cargados

  // --- Funciones de Utilidad ---
  async function fetchData(url, options = {}) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: response.statusText }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching data:", error);
      alert(
        `Error: ${error.message}. Por favor, verifica que el servidor esté funcionando.`
      );
      return null;
    }
  }

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();
  }

  function updateCartDisplay() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      emptyCartMessage.classList.remove("hidden");
      clearCartBtn.classList.add("hidden");
      checkoutBtn.classList.add("hidden");
    } else {
      emptyCartMessage.classList.add("hidden");
      clearCartBtn.classList.remove("hidden");
      checkoutBtn.classList.remove("hidden");
      cart.forEach((item) => {
        const product = allProducts.find((p) => p.id === item.productId);
        if (product) {
          const itemElement = document.createElement("div");
          itemElement.classList.add("cart-item");
          const itemTotalPrice = (product.price * item.quantity).toFixed(2);
          total += parseFloat(itemTotalPrice);

          itemElement.innerHTML = `
                        <div class="cart-item-info">
                            <h5>${product.name}</h5>
                            <p>Cantidad: ${
                              item.quantity
                            } x $${product.price.toFixed(2)}</p>
                            <p>Subtotal: $${itemTotalPrice}</p>
                        </div>
                        <div class="cart-item-controls">
                            <button data-id="${
                              product.id
                            }" class="remove-one-from-cart-btn">-</button>
                            <button data-id="${
                              product.id
                            }" class="remove-all-from-cart-btn">X</button>
                        </div>
                    `;
          cartItemsContainer.appendChild(itemElement);
        }
      });
    }
    cartTotalSpan.textContent = total.toFixed(2);
  }

  // --- Funciones para Productos ---
  async function loadProducts() {
    const products = await fetchData(`${API_BASE_URL}/products`);
    if (products) {
      allProducts = products;
      renderProducts(products);
    }
  }

  function renderProducts(products) {
    // Agrupa productos por categoría
    const productsByCategory = products.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    }, {});

    productListSection.innerHTML = "<h2>Nuestros Productos</h2>"; // Limpiar antes de renderizar

    for (const category in productsByCategory) {
      const categorySection = document.createElement("div");
      categorySection.classList.add("product-category");
      categorySection.innerHTML = `<h3>${category}</h3><div class="carousel" id="carousel-${category
        .replace(/\s+/g, "-")
        .toLowerCase()}"></div>`;
      productListSection.appendChild(categorySection);

      const carousel = categorySection.querySelector(".carousel");
      productsByCategory[category].forEach((product) => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.innerHTML = `
                    <h4>${product.name}</h4>
                    <p>Marca: ${product.brand}</p>
                    <p>Descripción: ${product.description || "N/A"}</p>
                    <p class="price">Precio: $${product.price.toFixed(2)}</p>
                    <p class="stock">Stock: ${product.stock}</p>
                    <div class="quantity-control">
                        <button class="decrease-quantity-btn" data-id="${
                          product.id
                        }">-</button>
                        <input type="number" class="product-quantity-input" data-id="${
                          product.id
                        }" value="1" min="1" max="${product.stock}">
                        <button class="increase-quantity-btn" data-id="${
                          product.id
                        }">+</button>
                    </div>
                    <button class="add-to-cart-btn" data-id="${
                      product.id
                    }">Añadir al Carrito</button>
                `;
        carousel.appendChild(productCard);

        // Asegurar que el input no exceda el stock
        const quantityInput = productCard.querySelector(
          `.product-quantity-input[data-id="${product.id}"]`
        );
        quantityInput.addEventListener("change", (e) => {
          let value = parseInt(e.target.value);
          if (isNaN(value) || value < 1) {
            e.target.value = 1;
          } else if (value > product.stock) {
            alert(
              `No puedes añadir más de ${product.stock} unidades de este producto.`
            );
            e.target.value = product.stock;
          }
        });
      });
    }
    addEventListenersToProductCards();
  }

  function addEventListenersToProductCards() {
    document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const productId = parseInt(e.target.dataset.id);
        const quantityInput = document.querySelector(
          `.product-quantity-input[data-id="${productId}"]`
        );
        const quantity = parseInt(quantityInput.value);
        addToCart(productId, quantity);
      });
    });

    document.querySelectorAll(".increase-quantity-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const productId = parseInt(e.target.dataset.id);
        const quantityInput = document.querySelector(
          `.product-quantity-input[data-id="${productId}"]`
        );
        const product = allProducts.find((p) => p.id === productId);
        if (product && parseInt(quantityInput.value) < product.stock) {
          quantityInput.value = parseInt(quantityInput.value) + 1;
        } else if (product) {
          alert(
            `No puedes añadir más de ${product.stock} unidades de este producto.`
          );
        }
      });
    });

    document.querySelectorAll(".decrease-quantity-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const productId = parseInt(e.target.dataset.id);
        const quantityInput = document.querySelector(
          `.product-quantity-input[data-id="${productId}"]`
        );
        if (parseInt(quantityInput.value) > 1) {
          quantityInput.value = parseInt(quantityInput.value) - 1;
        }
      });
    });
  }

  // --- Funciones para el Carrito ---
  function addToCart(productId, quantity) {
    const existingItemIndex = cart.findIndex(
      (item) => item.productId === productId
    );
    const product = allProducts.find((p) => p.id === productId);

    if (!product) {
      alert("Producto no encontrado.");
      return;
    }

    if (existingItemIndex > -1) {
      const currentQuantity = cart[existingItemIndex].quantity;
      const newQuantity = currentQuantity + quantity;
      if (newQuantity <= product.stock) {
        cart[existingItemIndex].quantity = newQuantity;
        alert(
          `${quantity} unidades de "${product.name}" añadidas al carrito. Cantidad total: ${newQuantity}`
        );
      } else {
        alert(
          `No hay suficiente stock para añadir ${quantity} unidades. Stock disponible: ${
            product.stock - currentQuantity
          }`
        );
      }
    } else {
      if (quantity <= product.stock) {
        cart.push({ productId, quantity });
        alert(`${quantity} unidades de "${product.name}" añadidas al carrito.`);
      } else {
        alert(
          `No hay suficiente stock para añadir ${quantity} unidades. Stock disponible: ${product.stock}`
        );
      }
    }
    saveCart();
  }

  function removeFromCart(productId, removeAll = false) {
    const existingItemIndex = cart.findIndex(
      (item) => item.productId === productId
    );

    if (existingItemIndex > -1) {
      if (removeAll || cart[existingItemIndex].quantity === 1) {
        cart.splice(existingItemIndex, 1);
      } else {
        cart[existingItemIndex].quantity--;
      }
    }
    saveCart();
  }

  clearCartBtn.addEventListener("click", () => {
    if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
      cart = [];
      saveCart();
      alert("Carrito vaciado.");
    }
  });

  cartItemsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-one-from-cart-btn")) {
      const productId = parseInt(e.target.dataset.id);
      removeFromCart(productId, false);
    } else if (e.target.classList.contains("remove-all-from-cart-btn")) {
      const productId = parseInt(e.target.dataset.id);
      removeFromCart(productId, true);
    }
  });

  // --- Funciones para el Checkout (Compra) ---
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert(
        "Tu carrito está vacío. Por favor, añade productos antes de comprar."
      );
      return;
    }
    checkoutModal.style.display = "block";
  });

  checkoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;
    const email = emailInput.value;

    // 1. Intentar buscar el cliente por email
    let customer = await fetchData(
      `${API_BASE_URL}/customers/search?email=${encodeURIComponent(email)}`
    );

    let customerId;

    if (customer) {
      customerId = customer.id;
      console.log("Cliente existente encontrado:", customer);
    } else {
      // 2. Si no existe, crear un nuevo cliente
      console.log("Cliente no encontrado, creando nuevo...");
      const newCustomerData = { firstName, lastName, email };
      customer = await fetchData(`${API_BASE_URL}/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomerData),
      });

      if (customer) {
        customerId = customer.id;
        alert("Nuevo cliente creado exitosamente.");
      } else {
        alert("Error al crear el cliente. No se puede proceder con la orden.");
        return;
      }
    }

    // 3. Crear la orden con los ítems del carrito
    const orderItems = cart.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    const orderRequest = {
      customerId: customerId,
      items: orderItems,
    };

    const newOrder = await fetchData(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderRequest),
    });

    if (newOrder) {
      alert(
        "¡Compra realizada con éxito! Tu número de orden es: " + newOrder.id
      );
      cart = [];
      saveCart();
      checkoutModal.style.display = "none";
      checkoutForm.reset();
    } else {
      alert(
        "Hubo un error al procesar tu compra. Por favor, inténtalo de nuevo."
      );
    }
  });

  // --- Funciones para Consultar Órdenes ---
  viewOrdersBtn.addEventListener("click", () => {
    ordersModal.style.display = "block";
    customerOrdersResults.innerHTML = ""; // Limpiar resultados anteriores
  });

  orderSearchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    customerOrdersResults.innerHTML = "<p>Buscando órdenes...</p>";
    const searchEmail = searchEmailInput.value;

    try {
      const customer = await fetchData(
        `${API_BASE_URL}/customers/search?email=${encodeURIComponent(
          searchEmail
        )}`
      );

      if (!customer) {
        customerOrdersResults.innerHTML =
          "<p>No se encontró ningún cliente con ese email.</p>";
        return;
      }

      const orders = await fetchData(
        `${API_BASE_URL}/orders/customer/${customer.id}`
      );

      customerOrdersResults.innerHTML = "";
      if (orders && orders.length > 0) {
        orders.forEach((order) => {
          const orderCard = document.createElement("div");
          orderCard.classList.add("order-card");
          orderCard.innerHTML = `
                        <h4>Orden #${order.id}</h4>
                        <p>Fecha: ${new Date(
                          order.orderDate
                        ).toLocaleString()}</p>
                        <p>Total: $${order.totalAmount.toFixed(2)}</p>
                        <h5>Items:</h5>
                        <ul>
                            ${order.items
                              .map(
                                (item) => `
                                <li>${item.quantity} x ${
                                  item.product.name
                                } ($${item.unitPrice.toFixed(2)} c/u)</li>
                            `
                              )
                              .join("")}
                        </ul>
                    `;
          customerOrdersResults.appendChild(orderCard);
        });
      } else {
        customerOrdersResults.innerHTML =
          "<p>No se encontraron órdenes para este cliente.</p>";
      }
    } catch (error) {
      customerOrdersResults.innerHTML = `<p>Error al buscar órdenes: ${error.message}</p>`;
    }
  });

  // --- Control de Modales ---
  closeButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.target.closest(".modal").style.display = "none";
    });
  });

  window.addEventListener("click", (e) => {
    if (e.target === checkoutModal) {
      checkoutModal.style.display = "none";
    }
    if (e.target === ordersModal) {
      ordersModal.style.display = "none";
    }
  });

  // --- Inicialización ---
  loadProducts();
  updateCartDisplay();
});
