// ==========================================================================
// CMPS Billawar — Dedicated Secure Login Handler (100% Serverless Verified)
// ==========================================================================

const AUTH_TOKEN_KEY = "cmps_admin_session_token";

// If already logged in (active in this or another tab), redirect immediately to dashboard
if (localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY)) {
  window.location.replace("dashboard.html");
}

// Toggle password visibility (Eye button)
const togglePasswordBtn = document.getElementById("togglePasswordBtn");
const adminPassInput = document.getElementById("adminPass");
if (togglePasswordBtn && adminPassInput) {
  togglePasswordBtn.addEventListener("click", () => {
    const isPassword = adminPassInput.type === "password";
    adminPassInput.type = isPassword ? "text" : "password";

    const eyeIcon = togglePasswordBtn.querySelector(".eye-icon");
    const eyeOffIcon = togglePasswordBtn.querySelector(".eye-off-icon");
    if (eyeIcon && eyeOffIcon) {
      eyeIcon.style.display = isPassword ? "none" : "block";
      eyeOffIcon.style.display = isPassword ? "block" : "none";
    }
  });
}

// Handle Login Form Submission
const loginForm = document.getElementById("adminLoginForm");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPass").value.trim();

    if (!email || !password) {
      showError("Please enter both admin email and password.");
      return;
    }

    if (loginBtn) {
      loginBtn.disabled = true;
      loginBtn.innerHTML = "Verifying...";
    }
    if (loginError) loginError.style.display = "none";

    try {
      const isLocal = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
      const apiUrl = isLocal ? "https://cmpsbillawar.in/api/admin/login" : "/api/admin/login";

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok && data.success && data.token) {
        // Persist session token across tabs in localStorage and current session
        localStorage.setItem(AUTH_TOKEN_KEY, data.token);
        sessionStorage.setItem(AUTH_TOKEN_KEY, data.token);
        if (data.email) localStorage.setItem("cmps_admin_email", data.email);
        window.location.replace("dashboard.html");
      } else {
        showError(data.error || "Invalid admin email or password.");
      }
    } catch (_) {
      showError("Connection failed. Please check network and try again.");
    } finally {
      if (loginBtn) {
        loginBtn.disabled = false;
        loginBtn.innerHTML = "<span>Secure Sign In</span> &rarr;";
      }
    }
  });
}

function showError(msg) {
  if (loginError) {
    loginError.textContent = msg;
    loginError.style.display = "block";
  }
}
