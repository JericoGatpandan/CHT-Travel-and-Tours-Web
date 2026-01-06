// Step 2: Select Tour Package

document.addEventListener("DOMContentLoaded", () => {
  const packageGrid = document.getElementById("packageGrid");
  const summaryCustomer = document.getElementById("summaryCustomer");
  const summaryPackage = document.getElementById("summaryPackage");
  const summaryTotal = document.getElementById("summaryTotal");

  const backBtn = document.getElementById("bookingBackBtn");
  const nextBtn = document.getElementById("bookingNextBtn");
  const logoutBtn = document.getElementById("userLogoutBtn");
  const sidebarNewBookingBtn = document.getElementById("sidebarNewBookingBtn");

  // 1) Load customer info stored at Step 1
  const step1DataRaw = localStorage.getItem("cht_booking_step1");
  if (step1DataRaw && summaryCustomer) {
    try {
      const c = JSON.parse(step1DataRaw);
      const display = c.fullName
        ? `${c.fullName} (${c.pax || 1} pax)`
        : "Not set";
      summaryCustomer.textContent = display;
    } catch (e) {
      summaryCustomer.textContent = "Not set";
    }
  }

  // 2) Define available packages (front-end only)
  const packages = [
    {
      id: 10,
      name: "Hokkaido Icebreaker + Sapporo Snow Festival",
      destination: "Hokkaido, Japan",
      duration: "6 Days",
      description:
        "Drift ice cruise, penguins, snow festival in Hokkaido",
      inclusions: "flights, hotel, tours, some meals",
      maxPax: 30,
      price: 2288
    },
    {
      id: 11,
      name: "Hong Kong & Macau Getaway",
      destination: "Hong Kong & Macau",
      duration: "4 Days",
      description:
        "City highlights of Hong Kong & Macau with optional tours",
      inclusions: "hotel, tours, some meals",
      maxPax: 40,
      price: 449
    },
    {
      id: 12,
      name: "Bali 4D3N Christmas Tour",
      destination: "Bali, Indonesia",
      duration: "4 Days",
      description: "Bali Christmas special visiting famous temples and beaches",
      inclusions: "flights, hotel, tours, breakfast",
      maxPax: 20,
      price: 28888
    },
    {
      id: 13,
      name: "Taiwan Taipei + Taichung 4D3N",
      destination: "Taipei & Taichung, Taiwan",
      duration: "4 Days",
      description:
        "Taipei and Taichung highlights, flower garden and night markets",
      inclusions: "flights, hotel, tours, some meals",
      maxPax: 35,
      price: 27988
    }
  ];

  let selectedPackageId = null;

  // 3) Render cards
  function renderPackageCards() {
    packageGrid.innerHTML = "";
    packages.forEach(pkg => {
      const card = document.createElement("article");
      card.className =
        "package-card" + (pkg.id === selectedPackageId ? " selected" : "");
      card.dataset.id = pkg.id;

      card.innerHTML = `
        <div class="package-card-header">${pkg.name}</div>
        <div class="package-meta">
          <span>📍 ${pkg.destination}</span>
          <span>📅 ${pkg.duration}</span>
        </div>
        <div class="package-description">
          ${pkg.description}
        </div>
        <div class="package-inclusions">
          ✓ ${pkg.inclusions}
        </div>
        <div class="package-limit">
          👥 Max ${pkg.maxPax} participants
        </div>
        <div class="package-price">
          PHP ${pkg.price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
        </div>
        <button class="package-select-btn">Select Package</button>
      `;

      packageGrid.appendChild(card);
    });
  }

  renderPackageCards();

  // 4) Selection handling
  packageGrid.addEventListener("click", e => {
    const card = e.target.closest(".package-card");
    if (!card) return;

    const id = parseInt(card.dataset.id, 10);
    selectedPackageId = id;
    renderPackageCards();
    updateSummary();
  });

  function updateSummary() {
    const pkg = packages.find(p => p.id === selectedPackageId);
    if (!pkg) {
      summaryPackage.textContent = "Not selected";
      summaryTotal.textContent = "₱0";
      return;
    }

    summaryPackage.textContent = `${pkg.name}`;
    summaryTotal.textContent =
      "₱" + pkg.price.toLocaleString("en-PH", { minimumFractionDigits: 2 });
  }

  // 5) Back / Next / Logout / Sidebar actions
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "userBooking-step1.html";
    });
  }

   if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (!selectedPackageId) {
        alert("Please select a package before continuing.");
        return;
      }

      const pkg = packages.find(p => p.id === selectedPackageId);
      localStorage.setItem(
        "cht_booking_step2",
        JSON.stringify({
          packageId: pkg.id,
          packageName: pkg.name,
          price: pkg.price
        })
      );

      // Go to Step 3 (Add-ons)
      window.location.href = "../../../HTML/userDashboard/Bookings/bookings3.html";
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("cht_current_username");
      window.location.href = "login.html";
    });
  }

  if (sidebarNewBookingBtn) {
    sidebarNewBookingBtn.addEventListener("click", () => {
      // already on booking flow; just restart step1
      window.location.href = "userBooking-step1.html";
    });
  }
});

// update

