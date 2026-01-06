// Step 3: Add-ons

document.addEventListener("DOMContentLoaded", () => {
  const addonsListEl = document.getElementById("addonsList");
  const specialRequestsEl = document.getElementById("specialRequests");

  const summaryCustomer = document.getElementById("summaryCustomer");
  const summaryPackage = document.getElementById("summaryPackage");
  const summaryTotal = document.getElementById("summaryTotal");
  const summaryBreakdown = document.getElementById("summaryBreakdown");

  const backBtn = document.getElementById("bookingBackBtn");
  const nextBtn = document.getElementById("bookingNextBtn");
  const logoutBtn = document.getElementById("userLogoutBtn");
  const sidebarNewBookingBtn = document.getElementById("sidebarNewBookingBtn");

  // ---- Load previous steps data from localStorage ----
  let packagePrice = 0;

  const step1Raw = localStorage.getItem("cht_booking_step1");
  if (step1Raw && summaryCustomer) {
    try {
      const c = JSON.parse(step1Raw);
      const display = c.fullName
        ? `${c.fullName} (${c.pax || 1} pax)`
        : "Not set";
      summaryCustomer.textContent = display;
    } catch {
      summaryCustomer.textContent = "Not set";
    }
  }

  const step2Raw = localStorage.getItem("cht_booking_step2");
  if (step2Raw && summaryPackage) {
    try {
      const p = JSON.parse(step2Raw);
      summaryPackage.textContent = p.packageName || "Not selected";
      packagePrice = Number(p.price) || 0;
    } catch {
      summaryPackage.textContent = "Not selected";
    }
  }

  // ---- Define available add-ons ----
  const addons = [
    {
      id: "breakfast",
      name: "Daily Breakfast",
      description: "Start each day with a delicious buffet breakfast",
      price: 500
    },
    {
      id: "insurance",
      name: "Travel Insurance",
      description: "Comprehensive coverage for peace of mind",
      price: 1000
    },
    {
      id: "guide",
      name: "Private Tour Guide",
      description: "Personalized guided tours with local expert",
      price: 2000
    },
    {
      id: "airport",
      name: "Airport Transfer",
      description: "Convenient pickup and drop-off service",
      price: 800
    }
  ];

  let selectedAddons = [];

  // If we already saved step 3 before, restore it
  const step3Raw = localStorage.getItem("cht_booking_step3");
  if (step3Raw) {
    try {
      const s3 = JSON.parse(step3Raw);
      selectedAddons = s3.addonIds || [];
      if (s3.specialRequests && specialRequestsEl) {
        specialRequestsEl.value = s3.specialRequests;
      }
    } catch {
      selectedAddons = [];
    }
  }

  // ---- Render add-on rows ----
  function renderAddons() {
    addonsListEl.innerHTML = "";
    addons.forEach(addon => {
      const row = document.createElement("div");
      row.className = "addon-row";

      const checked = selectedAddons.includes(addon.id);

      row.innerHTML = `
        <div class="addon-row-left">
          <input
            type="checkbox"
            class="addon-checkbox"
            id="addon-${addon.id}"
            data-id="${addon.id}"
            ${checked ? "checked" : ""}
          >
          <div class="addon-text">
            <span class="addon-name">${addon.name}</span>
            <span class="addon-desc">${addon.description}</span>
          </div>
        </div>
        <div class="addon-price">+₱${addon.price.toLocaleString()}</div>
      `;

      addonsListEl.appendChild(row);
    });
  }

  renderAddons();
  updateTotals();

  // ---- Handle checkbox changes ----
  addonsListEl.addEventListener("change", e => {
    const checkbox = e.target.closest(".addon-checkbox");
    if (!checkbox) return;

    const id = checkbox.dataset.id;
    if (checkbox.checked) {
      if (!selectedAddons.includes(id)) selectedAddons.push(id);
    } else {
      selectedAddons = selectedAddons.filter(a => a !== id);
    }
    updateTotals();
  });

  // ---- Update total / breakdown ----
  function updateTotals() {
    const addonsTotal = selectedAddons.reduce((sum, id) => {
      const addon = addons.find(a => a.id === id);
      return sum + (addon ? addon.price : 0);
    }, 0);

    const total = packagePrice + addonsTotal;

    if (summaryTotal) {
      summaryTotal.textContent =
        "₱" + total.toLocaleString("en-PH", { minimumFractionDigits: 0 });
    }

    if (summaryBreakdown) {
      summaryBreakdown.textContent =
        "Package: ₱" +
        packagePrice.toLocaleString("en-PH") +
        (addonsTotal
          ? `, Add-ons: ₱${addonsTotal.toLocaleString("en-PH")}`
          : "");
    }
  }

  // ---- Navigation buttons ----
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "userBooking-step2.html";
    });
  }

    if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const payload = {
        addonIds: selectedAddons,
        specialRequests: specialRequestsEl.value || ""
      };
      localStorage.setItem("cht_booking_step3", JSON.stringify(payload));

      // Go to Step 4 (Hotel)
      window.location.href = "../../../HTML/userDashboard/Bookings/bookings4.html";
    });
  }

  // Logout & sidebar behavior
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("cht_current_username");
      window.location.href = "login.html";
    });
  }
  if (sidebarNewBookingBtn) {
    sidebarNewBookingBtn.addEventListener("click", () => {
      window.location.href = "userBooking-step1.html";
    });
  }
}); 

//update

