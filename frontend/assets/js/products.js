/*
==========================================
GLOBAL PRODUCTS ARRAY
==========================================
*/

let allProducts = [];

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
LOAD FEATURED PRODUCTS FROM DATABASE
==========================================
*/

async function loadFeaturedProducts() {
  const productContainer = document.getElementById("featuredProducts");

  if (!productContainer) return;

  productContainer.innerHTML = "";

  try {
    const response = await fetch(
      "https://gopal-milk.onrender.com/api/products/featured",
    );

    if (!response.ok) {
      productContainer.innerHTML = `
                <p>Unable to load featured products.</p>
            `;

      return;
    }

    const products = await response.json();

    if (!products.length) {
      productContainer.innerHTML = `
                <p>No featured products available.</p>
            `;

      return;
    }

    products.forEach((product) => {
      productContainer.innerHTML += `
            
                <div class="product-card">

                    <img src="${product.image}" alt="${product.name}">

                    <h3>${product.name}</h3>

                    <p>${product.description}</p>

                    <p class="price">₹${product.price}</p>

                    <button onclick="addToCart('${product._id}')">
                        Add to Cart
                    </button>

                </div>
            
            `;
    });
  } catch (error) {
    console.log("Featured product load error:", error);

    productContainer.innerHTML = `
            <p>Error loading featured products.</p>
        `;
  }
}

/*
==========================================
LOAD ALL PRODUCTS FROM DATABASE
==========================================
*/

async function loadAllProducts() {
  const productContainer = document.getElementById("allProducts");

  if (!productContainer) return;

  productContainer.innerHTML = "";

  try {
    const response = await fetch(
      "https://gopal-milk.onrender.com/api/products",
    );

    if (!response.ok) {
      productContainer.innerHTML = `
                <p>Unable to load products.</p>
            `;

      return;
    }

    allProducts = await response.json();

    displayProducts(allProducts);
  } catch (error) {
    console.log("All product load error:", error);

    productContainer.innerHTML = `
            <p>Error loading products.</p>
        `;
  }
}

/*
==========================================
DISPLAY PRODUCTS
==========================================
*/

function displayProducts(products) {
  const productContainer = document.getElementById("allProducts");

  if (!productContainer) return;

  productContainer.innerHTML = "";

  /*
    ==========================================
    EMPTY PRODUCT STATE
    ==========================================
    */

  if (!products.length) {
    productContainer.innerHTML = `
            <p>No products found.</p>
        `;

    return;
  }

  /*
    ==========================================
    DISPLAY PRODUCT CARDS
    ==========================================
    */

  products.forEach((product) => {
    productContainer.innerHTML += `
        
            <div class="product-card">

                <img src="${product.image}" alt="${product.name}">

                <h3>${product.name}</h3>

                <p>${product.description}</p>

                <p class="price">₹${product.price}</p>

                <button onclick="addToCart('${product._id}')">
                    Add to Cart
                </button>

            </div>
        
        `;
  });
}

/*
==========================================
PRODUCT SEARCH
==========================================
*/

const searchInput = document.getElementById("searchInput");

if (searchInput) {
  searchInput.addEventListener("input", function () {
    const searchValue = this.value.toLowerCase();

    const filteredProducts = allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchValue) ||
        product.category.toLowerCase().includes(searchValue) ||
        product.description.toLowerCase().includes(searchValue),
    );

    displayProducts(filteredProducts);
  });
}

/*
==========================================
INITIAL LOADS
==========================================
*/

loadFeaturedProducts();
loadAllProducts();
