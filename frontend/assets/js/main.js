/*
==========================================
NAVBAR USER VISIBILITY
==========================================
*/

function updateNavbar() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  const profileNav = document.getElementById("profileNav");
  const logoutNav = document.getElementById("logoutNav");

  /*
    ==========================================
    LOGIN/REGISTER LINKS
    ==========================================
    */

  const loginLinks = document.querySelectorAll(
    'a[href="login.html"], a[href="register.html"]',
  );

  if (loggedInUser) {
    /*
        ==========================================
        HIDE LOGIN/REGISTER
        ==========================================
        */

    loginLinks.forEach((link) => {
      if (link.parentElement) {
        link.parentElement.style.display = "none";
      }
    });

    /*
        ==========================================
        SHOW PROFILE/LOGOUT
        ==========================================
        */

    if (profileNav) profileNav.style.display = "block";

    if (logoutNav) logoutNav.style.display = "block";
  } else {
    /*
        ==========================================
        SHOW LOGIN/REGISTER
        ==========================================
        */

    loginLinks.forEach((link) => {
      if (link.parentElement) {
        link.parentElement.style.display = "block";
      }
    });

    /*
        ==========================================
        HIDE PROFILE/LOGOUT
        ==========================================
        */

    if (profileNav) profileNav.style.display = "none";

    if (logoutNav) logoutNav.style.display = "none";
  }
}

/*
==========================================
UPDATE CART COUNT
==========================================
*/

function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const cartCount = document.getElementById("cartCount");

  if (cartCount) {
    cartCount.innerText = cart.length;
  }
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

  updateCartCount();
}

/*
==========================================
LOAD FEATURED PRODUCTS
==========================================
*/

async function loadFeaturedProducts() {
  const container = document.getElementById("featuredProducts");

  if (!container) return;

  container.innerHTML = "";

  try {
    const response = await fetch(
      "https://gopal-milk.onrender.com/api/products/featured",
    );

    if (!response.ok) {
      container.innerHTML = `
                <p>Unable to load featured products.</p>
            `;

      return;
    }

    const products = await response.json();

    if (!products.length) {
      container.innerHTML = `
                <p>No featured products available.</p>
            `;

      return;
    }

    products.forEach((product) => {
      container.innerHTML += `
            
                <div class="product-card">

                    <img src="${product.image}" alt="${product.name}">

                    <h3>${product.name}</h3>

                    <p>${product.description}</p>

                    <p class="price">₹${product.price}</p>

                    <button onclick="addToCart('${product._id}')">
                        Add To Cart
                    </button>

                </div>
            
            `;
    });
  } catch (error) {
    console.log("Error loading featured products:", error);

    container.innerHTML = `
            <p>Error loading products.</p>
        `;
  }
}

/*
==========================================
MOBILE MENU TOGGLE
==========================================
*/

const menuToggle = document.getElementById("menuToggle");

if (menuToggle) {
  menuToggle.addEventListener("click", function () {
    const navLinks = document.getElementById("navLinks");

    if (navLinks) {
      navLinks.classList.toggle("active");
    }
  });
}

/*
==========================================
NEWSLETTER FORM
==========================================
*/

const newsletterForm = document.getElementById("newsletterForm");

if (newsletterForm) {
  newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault();

    alert("Subscribed successfully!");

    newsletterForm.reset();
  });
}

/*
==========================================
INITIALIZE WEBSITE
==========================================
*/

updateNavbar();
updateCartCount();
loadFeaturedProducts();
