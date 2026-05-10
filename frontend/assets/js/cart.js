/*
==========================================
LOAD CART ITEMS
==========================================
*/

async function loadCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const cartContainer = document.getElementById("cartItems");
  const totalElement = document.getElementById("cartTotal");

  /*
    ==========================================
    EXIT IF PAGE SECTION NOT PRESENT
    ==========================================
    */

  if (!cartContainer || !totalElement) return;

  cartContainer.innerHTML = "";

  let total = 0;

  /*
    ==========================================
    EMPTY CART
    ==========================================
    */

  if (cart.length === 0) {
    cartContainer.innerHTML = `
            <p>Your cart is empty.</p>
        `;

    totalElement.innerText = "Total: ₹0";

    return;
  }

  /*
    ==========================================
    COUNT PRODUCT QUANTITIES
    ==========================================
    */

  const productCounts = {};

  cart.forEach((productId) => {
    productCounts[productId] = (productCounts[productId] || 0) + 1;
  });

  /*
    ==========================================
    FETCH PRODUCT DETAILS
    ==========================================
    */

  for (const productId in productCounts) {
    try {
      const response = await fetch(
        `https://gopal-milk.onrender.com/api/products/${productId}`,
      );

      if (!response.ok) continue;

      const product = await response.json();

      const quantity = productCounts[productId];

      const productTotal = product.price * quantity;

      total += productTotal;

      cartContainer.innerHTML += `
            
                <div class="product-card">

                    <img src="${product.image}" alt="${product.name}">

                    <h3>${product.name}</h3>

                    <p>₹${product.price}</p>

                    <p><strong>Quantity:</strong> ${quantity}</p>

                    <p><strong>Total:</strong> ₹${productTotal}</p>

                    <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap; margin-top:15px;">

                        <button onclick="removeOneFromCart('${product._id}')">
                            Remove One
                        </button>

                        <button onclick="removeAllFromCart('${product._id}')">
                            Remove All
                        </button>

                    </div>

                </div>
            
            `;
    } catch (error) {
      console.log("Cart load error:", error);
    }
  }

  /*
    ==========================================
    UPDATE TOTAL
    ==========================================
    */

  totalElement.innerText = `Total: ₹${total}`;
}

/*
==========================================
ADD PRODUCT TO CART
==========================================
*/

function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.push(productId);

  localStorage.setItem("cart", JSON.stringify(cart));

  alert("Product added to cart!");

  /*
    ==========================================
    UPDATE CART COUNT
    ==========================================
    */

  if (typeof updateCartCount === "function") {
    updateCartCount();
  }
}

/*
==========================================
REMOVE ONE ITEM
==========================================
*/

function removeOneFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const index = cart.indexOf(productId);

  if (index > -1) {
    cart.splice(index, 1);
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  loadCart();

  if (typeof updateCartCount === "function") {
    updateCartCount();
  }
}

/*
==========================================
REMOVE ALL OF PRODUCT
==========================================
*/

function removeAllFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart = cart.filter((id) => id !== productId);

  localStorage.setItem("cart", JSON.stringify(cart));

  loadCart();

  if (typeof updateCartCount === "function") {
    updateCartCount();
  }
}

/*
==========================================
CLEAR ENTIRE CART
==========================================
*/

function clearCart() {
  localStorage.removeItem("cart");

  loadCart();

  if (typeof updateCartCount === "function") {
    updateCartCount();
  }
}

/*
==========================================
INITIAL LOAD
==========================================
*/

loadCart();
