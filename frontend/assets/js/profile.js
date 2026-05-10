/*
==========================================
REAL USER ORDERS
==========================================
*/

async function loadOrders() {
  const userToken = localStorage.getItem("userToken");

  const ordersContainer = document.getElementById("ordersContainer");

  /*
    ==========================================
    EXIT IF PAGE SECTION NOT PRESENT
    ==========================================
    */

  if (!ordersContainer) return;

  /*
    ==========================================
    AUTH CHECK
    ==========================================
    */

  if (!userToken) {
    window.location.href = "login.html";

    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/orders/my-orders", {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    /*
        ==========================================
        HANDLE TOKEN FAILURE
        ==========================================
        */

    if (!response.ok) {
      ordersContainer.innerHTML = `
                <p>Unable to load orders.</p>
            `;

      return;
    }

    const orders = await response.json();

    ordersContainer.innerHTML = "";

    /*
        ==========================================
        EMPTY ORDER STATE
        ==========================================
        */

    if (!orders.length) {
      ordersContainer.innerHTML = `
                <p>No orders found.</p>
            `;

      return;
    }

    /*
        ==========================================
        DISPLAY ORDERS
        ==========================================
        */

    orders.forEach((order, index) => {
      ordersContainer.innerHTML += `
            
                <div class="product-card">

                    <h3>Order #${index + 1}</h3>

                    <p><strong>Total:</strong> ₹${order.totalAmount}</p>

                    <p><strong>Payment:</strong> ${order.paymentMethod}</p>

                    <p><strong>Status:</strong> ${order.orderStatus}</p>

                    <p><strong>Products:</strong> ${order.products.length}</p>

                    <p>
                        <strong>Date:</strong>
                        ${new Date(order.createdAt).toLocaleString()}
                    </p>

                </div>
            
            `;
    });
  } catch (error) {
    console.log("Order load error:", error);

    ordersContainer.innerHTML = `
            <p>Error loading orders.</p>
        `;
  }
}

/*
==========================================
LOAD REAL USER PROFILE
==========================================
*/

async function loadProfile() {
  const userToken = localStorage.getItem("userToken");

  const profileContainer = document.getElementById("profileContainer");

  /*
    ==========================================
    EXIT IF PAGE SECTION NOT PRESENT
    ==========================================
    */

  if (!profileContainer) return;

  /*
    ==========================================
    AUTH CHECK
    ==========================================
    */

  if (!userToken) {
    window.location.href = "login.html";

    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/users/profile", {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    /*
        ==========================================
        HANDLE TOKEN FAILURE
        ==========================================
        */

    if (!response.ok) {
      window.location.href = "login.html";

      return;
    }

    const user = await response.json();

    /*
        ==========================================
        DISPLAY PROFILE
        ==========================================
        */

    profileContainer.innerHTML = `
        
            <div class="product-card">

                <h3>${user.name}</h3>

                <p><strong>Email:</strong> ${user.email}</p>

                <p><strong>Phone:</strong> ${user.phone || "Not Added"}</p>

                <p><strong>Address:</strong> ${user.address || "Not Added"}</p>

                <p><strong>City:</strong> ${user.city || "Not Added"}</p>

                <p><strong>State:</strong> ${user.state || "Not Added"}</p>

                <p><strong>Pincode:</strong> ${user.pincode || "Not Added"}</p>

                <button class="btn-primary" onclick="logout()">
                    Logout
                </button>

            </div>
        
        `;
  } catch (error) {
    console.log("Profile load error:", error);

    profileContainer.innerHTML = `
            <p>Error loading profile.</p>
        `;
  }
}

/*
==========================================
INITIAL LOADS
==========================================
*/

loadOrders();
loadProfile();
