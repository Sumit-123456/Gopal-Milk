/*
==========================================
REAL ADMIN LOGIN
==========================================
*/

const adminLoginForm = document.getElementById("adminLoginForm");

if (adminLoginForm) {
  adminLoginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("adminEmail").value;
    const password = document.getElementById("adminPassword").value;

    try {
      const response = await fetch(
        "https://gopal-milk.onrender.com/api/auth/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Admin login failed");

        return;
      }

      /*
            ==========================================
            STORE ADMIN SESSION
            ==========================================
            */

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminLoggedIn", "true");

      alert("Admin login successful!");

      window.location.href = "dashboard.html";
    } catch (error) {
      console.log("Admin login error:", error);

      alert("Server error during admin login");
    }
  });
}

/*
==========================================
ADMIN LOGOUT
==========================================
*/

function adminLogout() {
  localStorage.removeItem("adminLoggedIn");
  localStorage.removeItem("adminToken");

  window.location.href = "login.html";
}

/*
==========================================
REAL DASHBOARD ANALYTICS
==========================================
*/

async function loadDashboardStats() {
  const adminToken = localStorage.getItem("adminToken");

  if (!adminToken) return;

  try {
    /*
        ==========================================
        FETCH PRODUCTS
        ==========================================
        */

    const productsRes = await fetch(
      "https://gopal-milk.onrender.com/api/products",
    );

    const products = await productsRes.json();

    /*
        ==========================================
        FETCH USERS
        ==========================================
        */

    const usersRes = await fetch(
      "https://gopal-milk.onrender.com/api/users/all-users",
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      },
    );

    const users = await usersRes.json();

    /*
        ==========================================
        FETCH ORDERS
        ==========================================
        */

    const ordersRes = await fetch(
      "https://gopal-milk.onrender.com/api/orders/all-orders",
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      },
    );

    const orders = await ordersRes.json();

    /*
        ==========================================
        CALCULATE REVENUE
        ==========================================
        */

    let revenue = 0;

    orders.forEach((order) => {
      revenue += order.totalAmount;
    });

    /*
        ==========================================
        UPDATE DASHBOARD UI
        ==========================================
        */

    if (document.getElementById("totalProducts")) {
      document.getElementById("totalProducts").innerText = products.length;
    }

    if (document.getElementById("totalUsers")) {
      document.getElementById("totalUsers").innerText = users.length;
    }

    if (document.getElementById("totalOrders")) {
      document.getElementById("totalOrders").innerText = orders.length;
    }

    if (document.getElementById("totalRevenue")) {
      document.getElementById("totalRevenue").innerText = `₹${revenue}`;
    }
  } catch (error) {
    console.log("Dashboard stats error:", error);
  }
}

/*
==========================================
ADMIN PRODUCT MANAGEMENT
==========================================
*/

const productForm = document.getElementById("productForm");

if (productForm) {
  productForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const adminToken = localStorage.getItem("adminToken");

    const newProduct = {
      name: document.getElementById("productName").value,
      description: document.getElementById("productDescription").value,
      category: document.getElementById("productCategory").value,
      price: document.getElementById("productPrice").value,
      stock: document.getElementById("productStock").value,
      image: document.getElementById("productImage").value,
      featured: true,
    };

    try {
      const response = await fetch(
        "https://gopal-milk.onrender.com/api/products/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify(newProduct),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to add product");

        return;
      }

      alert(data.message || "Product added successfully!");

      location.reload();
    } catch (error) {
      console.log("Product add error:", error);
    }
  });
}

/*
==========================================
LOAD ADMIN PRODUCTS
==========================================
*/

async function loadAdminProducts() {
  const table = document.getElementById("adminProductsTable");

  if (!table) return;

  table.innerHTML = "";

  try {
    const response = await fetch(
      "https://gopal-milk.onrender.com/api/products",
    );

    const products = await response.json();

    products.forEach((product) => {
      table.innerHTML += `
            
                <tr>
                    <td>${product.name}</td>
                    <td>₹${product.price}</td>
                    <td>${product.stock}</td>
                    <td>
    <button onclick="editProduct(
        '${product._id}',
        '${product.name}',
        '${product.description}',
        '${product.category}',
        '${product.price}',
        '${product.stock}',
        '${product.image}'
    )">
        Edit
    </button>

    <button onclick="deleteProduct('${product._id}')">
        Delete
    </button>
</td>
                </tr>
            
            `;
    });
  } catch (error) {
    console.log("Error loading admin products:", error);
  }
}

/*
==========================================
DELETE PRODUCT
==========================================
*/

async function deleteProduct(productId) {
  const adminToken = localStorage.getItem("adminToken");

  try {
    const response = await fetch(
      `https://gopal-milk.onrender.com/api/products/delete/${productId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      },
    );

    const data = await response.json();

    alert(data.message || "Product deleted successfully!");

    location.reload();
  } catch (error) {
    console.log("Delete product error:", error);
  }
}

/*
==========================================
LOAD USERS
==========================================
*/

async function loadUsers() {
  const adminToken = localStorage.getItem("adminToken");

  const table = document.getElementById("adminUsersTable");

  if (!table) return;

  table.innerHTML = "";

  try {
    const response = await fetch(
      "https://gopal-milk.onrender.com/api/users/all-users",
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      },
    );

    const users = await response.json();

    users.forEach((user) => {
      table.innerHTML += `
            
                <tr>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>
                        <button onclick="deleteUser('${user._id}')">
                            Delete
                        </button>
                    </td>
                </tr>
            
            `;
    });
  } catch (error) {
    console.log("User load error:", error);
  }
}

/*
==========================================
DELETE USER
==========================================
*/

async function deleteUser(userId) {
  const adminToken = localStorage.getItem("adminToken");

  try {
    const response = await fetch(
      `https://gopal-milk.onrender.com/api/users/delete-user/${userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      },
    );

    const data = await response.json();

    alert(data.message || "User deleted successfully!");

    location.reload();
  } catch (error) {
    console.log("Delete user error:", error);
  }
}

/*
==========================================
LOAD ADMIN ORDERS
==========================================
*/

async function loadAdminOrders() {
  const adminToken = localStorage.getItem("adminToken");

  const table = document.getElementById("adminOrdersTable");

  if (!table) return;

  table.innerHTML = "";

  try {
    const response = await fetch(
      "https://gopal-milk.onrender.com/api/orders/all-orders",
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      },
    );

    const orders = await response.json();

    orders.forEach((order) => {
      table.innerHTML += `
            
                <tr>
                    <td>${order.shippingAddress.fullName}</td>
                    <td>${order.shippingAddress.email}</td>
<td>
    ${order.products
      .map(
        (item) => `
        <div>
            ${item.productId?.name || "Deleted Product"} 
            (Qty: ${item.quantity})
        </div>
    `,
      )
      .join("")}
</td>                    <td>${order.paymentMethod}</td>

<td>
    <select onchange="updateOrderStatus('${order._id}', this.value)">
        <option value="Pending" ${order.orderStatus === "Pending" ? "selected" : ""}>Pending</option>
        <option value="Processing" ${order.orderStatus === "Processing" ? "selected" : ""}>Processing</option>
        <option value="Shipped" ${order.orderStatus === "Shipped" ? "selected" : ""}>Shipped</option>
        <option value="Delivered" ${order.orderStatus === "Delivered" ? "selected" : ""}>Delivered</option>
        <option value="Cancelled" ${order.orderStatus === "Cancelled" ? "selected" : ""}>Cancelled</option>
    </select>
</td>

                    <td>₹${order.totalAmount}</td>
                    <td>${new Date(order.createdAt).toLocaleString()}</td>
                </tr>
            
            `;
    });
  } catch (error) {
    console.log("Order load error:", error);
  }
}

/*
==========================================
UPDATE ORDER STATUS
==========================================
*/

async function updateOrderStatus(orderId, newStatus) {
  const adminToken = localStorage.getItem("adminToken");

  try {
    const response = await fetch(
      `https://gopal-milk.onrender.com/api/orders/update-status/${orderId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          orderStatus: newStatus,
        }),
      },
    );

    const data = await response.json();

    alert(data.message || "Order status updated!");
  } catch (error) {
    console.log("Order status update error:", error);

    alert("Failed to update order status");
  }
}

/*
==========================================
EDIT PRODUCT
==========================================
*/

async function editProduct(
  productId,
  name,
  description,
  category,
  price,
  stock,
  image,
) {
  /*
    ==========================================
    PROMPT UPDATED VALUES
    ==========================================
    */

  const updatedName = prompt("Enter product name:", name);
  if (!updatedName) return;

  const updatedDescription = prompt("Enter description:", description);
  if (!updatedDescription) return;

  const updatedCategory = prompt("Enter category:", category);
  if (!updatedCategory) return;

  const updatedPrice = prompt("Enter price:", price);
  if (!updatedPrice) return;

  const updatedStock = prompt("Enter stock:", stock);
  if (!updatedStock) return;

  const updatedImage = prompt("Enter image URL:", image);
  if (!updatedImage) return;

  /*
    ==========================================
    UPDATE DATABASE
    ==========================================
    */

  const adminToken = localStorage.getItem("adminToken");

  try {
    const response = await fetch(
      `https://gopal-milk.onrender.com/api/products/update/${productId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          name: updatedName,
          description: updatedDescription,
          category: updatedCategory,
          price: updatedPrice,
          stock: updatedStock,
          image: updatedImage,
        }),
      },
    );

    const data = await response.json();

    alert(data.message || "Product updated!");

    location.reload();
  } catch (error) {
    console.log("Edit product error:", error);

    alert("Failed to update product");
  }
}

/*
==========================================
INITIALIZE ADMIN MODULES
==========================================
*/

loadDashboardStats();
loadAdminProducts();
loadUsers();
loadAdminOrders();
