/*
==========================================
REAL CHECKOUT + RAZORPAY SYSTEM
==========================================
*/

const checkoutForm = document.getElementById("checkoutForm");

if (checkoutForm) {
  checkoutForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const userToken = localStorage.getItem("userToken");

    if (!userToken) {
      alert("Please login first.");

      window.location.href = "login.html";

      return;
    }

    /*
        ==========================================
        LOAD CART
        ==========================================
        */

    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    if (!cartItems.length) {
      alert("Your cart is empty.");

      return;
    }

    /*
        ==========================================
        GROUP PRODUCTS
        ==========================================
        */

    const productCounts = {};

    cartItems.forEach((productId) => {
      productCounts[productId] = (productCounts[productId] || 0) + 1;
    });

    const products = Object.keys(productCounts).map((productId) => ({
      productId,
      quantity: productCounts[productId],
    }));

    /*
        ==========================================
        CALCULATE TOTAL
        ==========================================
        */

    let totalAmount = 0;

    for (const productId of Object.keys(productCounts)) {
      const response = await fetch(
        `http://localhost:5000/api/products/${productId}`,
      );

      const product = await response.json();

      totalAmount += product.price * productCounts[productId];
    }

    /*
        ==========================================
        SHIPPING INFO
        ==========================================
        */

    const shippingAddress = {
      fullName: document.getElementById("fullName").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      state: document.getElementById("state").value,
      pincode: document.getElementById("pincode").value,
    };

    const paymentMethod = document.getElementById("paymentMethod").value;

    /*
        ==========================================
        CASH ON DELIVERY
        ==========================================
        */

    if (paymentMethod === "COD") {
      await placeFinalOrder(
        userToken,
        products,
        totalAmount,
        shippingAddress,
        paymentMethod,
      );

      return;
    }

    /*
        ==========================================
        ONLINE PAYMENT
        ==========================================
        */

    const paymentResponse = await fetch(
      "http://localhost:5000/api/payments/create-order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          amount: totalAmount,
        }),
      },
    );

    const paymentData = await paymentResponse.json();

    if (!paymentData.success) {
      alert("Payment initialization failed");

      return;
    }

    /*
        ==========================================
        RAZORPAY OPTIONS
        ==========================================
        */

    const options = {
      key: "YOUR_RAZORPAY_KEY_ID",
      amount: paymentData.order.amount,
      currency: "INR",
      name: "Pure Dairy",
      description: "Dairy Product Purchase",
      order_id: paymentData.order.id,

      handler: async function (response) {
        /*
    ==========================================
    VERIFY PAYMENT WITH BACKEND
    ==========================================
    */

        const verifyResponse = await fetch(
          "http://localhost:5000/api/payments/verify-payment",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          },
        );

        const verifyData = await verifyResponse.json();

        /*
    ==========================================
    CHECK VERIFICATION
    ==========================================
    */

        if (!verifyData.success) {
          alert("Payment verification failed!");

          return;
        }

        /*
    ==========================================
    PLACE FINAL ORDER
    ==========================================
    */

        await placeFinalOrder(
          userToken,
          products,
          totalAmount,
          shippingAddress,
          "Razorpay",
          {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
          },
        );
      },

      prefill: {
        name: shippingAddress.fullName,
        email: shippingAddress.email,
        contact: shippingAddress.phone,
      },

      theme: {
        color: "#2e7d32",
      },
    };

    const razorpay = new Razorpay(options);

    /*
==========================================
PAYMENT FAILURE HANDLER
==========================================
*/

    razorpay.on("payment.failed", function (response) {
      alert("Payment failed: " + response.error.description);

      console.log("Payment Failure:", response.error);
    });

    razorpay.open();
  });
}

/*
==========================================
FINAL ORDER CREATION
==========================================
*/

async function placeFinalOrder(
  userToken,
  products,
  totalAmount,
  shippingAddress,
  paymentMethod,
  paymentDetails = {},
) {
  try {
    const response = await fetch("http://localhost:5000/api/orders/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        products,
        totalAmount,
        shippingAddress,
        paymentMethod,
        paymentDetails,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Order failed");

      return;
    }

    /*
        ==========================================
        CLEAR CART
        ==========================================
        */

    localStorage.removeItem("cart");

    if (typeof updateCartCount === "function") {
      updateCartCount();
    }

    alert("Order placed successfully!");

    window.location.href = "orders.html";
  } catch (error) {
    console.log("Final order error:", error);

    alert("Order placement failed");
  }
}
