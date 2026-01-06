document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return; // not on login page

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const roleElement = document.getElementById("role");
    if (!roleElement) {
      alert("Role select not found.");
      return;
    }

    const role = roleElement.value;  // "admin" or "user"
    const usernameInput = document.getElementById("email");
    const username = usernameInput ? usernameInput.value.trim() : "";

    if (username) {
      localStorage.setItem("cht_current_username", username);
    }

    // For debugging: see what the browser thinks the value is
    console.log("Selected role:", role);

    if (role === "admin") {
      window.location.href = "./adminDashboard/dashboard.html";
    } else if (role === "user") {
      window.location.href = "./userDashboard/userDashboard.html";
    } else {
      alert("Please select ADMIN or USER.");
    }
  });
});