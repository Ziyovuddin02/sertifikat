// ===============================
// Dasturlash Akademiyasi
// Login Script
// ===============================

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // Demo login
    const adminLogin = "admin";
    const adminPassword = "ziyo02";

    if (username === adminLogin && password === adminPassword) {

        // Login saqlash
        localStorage.setItem("isLogin", "true");
        localStorage.setItem("adminName", username);

        // Dashboardga o'tish
        window.location.href = "dashboard.html";

    } else {

        alert("❌ Login yoki parol noto'g'ri!");

    }

});