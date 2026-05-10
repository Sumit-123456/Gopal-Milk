/*
==========================================
REAL USER REGISTRATION
==========================================
*/

const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Registration failed");

        return;
      }

      alert("Registration successful!");

      window.location.href = "login.html";
    } catch (error) {
      console.log("Registration error:", error);

      alert("Server error during registration");
    }
  });
}

/*
==========================================
REAL USER LOGIN
==========================================
*/

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed");

        return;
      }

      /*
            ==========================================
            STORE SESSION
            ==========================================
            */

      localStorage.setItem("userToken", data.token);

      localStorage.setItem("loggedInUser", JSON.stringify(data.user));

      alert("Login successful!");

      window.location.href = "profile.html";
    } catch (error) {
      console.log("Login error:", error);

      alert("Server error during login");
    }
  });
}

/*
==========================================
LOGOUT USER
==========================================
*/

function logout() {
  /*
    ==========================================
    CLEAR USER SESSION
    ==========================================
    */

  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("userToken");
  localStorage.removeItem("resetUserEmail");

  /*
    ==========================================
    REDIRECT
    ==========================================
    */

  window.location.href = "login.html";
}

/*
==========================================
FORGOT PASSWORD
==========================================
NOTE:
Current version keeps frontend-only reset flow.
Production version should use backend email token system.
==========================================
*/

const forgotPasswordForm = document.getElementById("forgotPasswordForm");

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("forgotEmail").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find((user) => user.email === email);

    if (!user) {
      alert("Email not found!");

      return;
    }

    localStorage.setItem("resetUserEmail", email);

    alert("Email verified. Please reset your password.");

    window.location.href = "reset-password.html";
  });
}

/*
==========================================
RESET PASSWORD
==========================================
*/

const resetPasswordForm = document.getElementById("resetPasswordForm");

if (resetPasswordForm) {
  resetPasswordForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const newPassword = document.getElementById("newPassword").value;

    const resetEmail = localStorage.getItem("resetUserEmail");

    let users = JSON.parse(localStorage.getItem("users")) || [];

    users = users.map((user) => {
      if (user.email === resetEmail) {
        user.password = newPassword;
      }

      return user;
    });

    localStorage.setItem("users", JSON.stringify(users));

    localStorage.removeItem("resetUserEmail");

    alert("Password reset successful!");

    window.location.href = "login.html";
  });
}
