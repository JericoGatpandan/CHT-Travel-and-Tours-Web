// Step 5: Choose Transportation

document.addEventListener("DOMContentLoaded", () => {
  const transportListInner = document.getElementById("transportListInner");

  const summaryCustomer = document.getElementById("summaryCustomer");
  const summaryPackage = document.getElementById("summaryPackage");
  const summaryHotel = document.getElementById("summaryHotel");
  const summaryTransport = document.getElementById("summaryTransport");
  const summaryTotal = document.getElementById("summaryTotal");
  const summaryBreakdown = document.getElementById("summaryBreakdown");

  const backBtn = document.getElementById("bookingBackBtn");
  const nextBtn = document.getElementById("bookingNextBtn");
  const logoutBtn = document.getElementById("userLogoutBtn");
  const sidebarNewBookingBtn = document.getElementById("sidebarNewBookingBtn");

  // ---- Load previous step data ----
  let packagePrice = 0;
  let addonsTotal = 0;
  let hotelPrice = 0;

  const s1 = localStorage.getItem("cht_booking_step1");
  if (s1 && summaryCustomer) {
    try {
      const c = JSON.parse(s1);
      const display = c.fullName
        ? `${c.fullName} (${c.pax || 1} pax)`
        : "Not set";
      summaryCustomer.textContent = display;
    } catch {
      summaryCustomer.textContent = "Not set";
    }
  }

  const s2 = localStorage.getItem("cht_booking_step2");
  if (s2 && summaryPackage) {
    try {
      const p = JSON.parse(s2);
      summaryPackage.textContent = p.packageName || "Not selected";
      packagePrice = Number(p.price) || 0;
    } catch {
      summaryPackage.textContent = "Not selected";
    }
  }

  const s3 = localStorage.getItem("cht_booking_step3");
  if (s3) {
    try {
      const saved = JSON.parse(s3);
      const addonIds = saved.addonIds || [];
      const addonPriceMap = {
        breakfast: 500,
        insurance: 1000,
        guide: 2000,
        airport: 800
      };
      addonsTotal = addonIds.reduce(
        (sum, id) => sum + (addonPriceMap[id] || 0),
        0
      );
    } catch {
      addonsTotal = 0;
    }
  }

  const s4 = localStorage.getItem("cht_booking_step4");
  if (s4 && summaryHotel) {
    try {
      const h = JSON.parse(s4);
      if (h.hotelName) {
        summaryHotel.textContent = h.hotelName;
      } else {
        summaryHotel.textContent = "Not selected";
      }
      hotelPrice = Number(h.hotelPricePerNight) || 0;
    } catch {
      summaryHotel.textContent = "Not selected";
    }
  }

  // Previously selected transport
  let selectedTransportId = null;
  const savedTransportRaw = localStorage.getItem("cht_booking_step5");
  if (savedTransportRaw) {
    try {
      const saved = JSON.parse(savedTransportRaw);
      selectedTransportId = saved.transportId || null;
    } catch {
      selectedTransportId = null;
    }
  }

  // ---- Demo transport options ----
  const transports = [
    {
      id: 1,
      type: "bus",
      label: "Bus",
      seats: 40,
      company: "Hokkaido Tours Co.",
      plate: "HOK-1234",
      pricePerDay: 5000
    },
    {
      id: 2,
      type: "bus",
      label: "Bus",
      seats: 45,
      company: "Hong Kong Coaches",
      plate: "HK-5678",
      pricePerDay: 5000
    },
    {
      id: 3,
      type: "bus",
      label: "Bus",
      seats: 35,
      company: "Bali Transport",
      plate: "BALI-009",
      pricePerDay: 5000
    },
    {
      id: 4,
      type: "bus",
      label: "Bus",
      seats: 40,
      company: "Taiwan Coaches",
      plate: "TPE-2026",
      pricePerDay: 5000
    }
  ];

  // ---- Render transport rows ----
  function renderTransports(filter = "all") {
    transportListInner.innerHTML = "";
    transports.forEach(t => {
      if (filter !== "all" && t.type !== filter) return;

      const row = document.createElement("div");
      row.className =
        "transport-row" + (t.id === selectedTransportId ? " selected" : "");
      row.dataset.id = t.id;

      row.innerHTML = `
        <div class="transport-row-left">
          <div class="transport-name">${t.label}</div>
          <div class="transport-meta">
            <span>👥 ${t.seats} seats</span>
            <span>🏢 ${t.company}</span>
            <span>🚐 ${t.plate}</span>
          </div>
        </div>
        <div class="transport-price-block">
          <div class="transport-price">PHP ${t.pricePerDay.toLocaleString()}</div>
          <div>per day</div>
          <button class="transport-select-btn">Select</button>
        </div>
      `;
      transportListInner.appendChild(row);
    });
  }

  renderTransports();

  // ---- Filter handling ----
  document
    .querySelectorAll('input[name="transportFilter"]')
    .forEach(radio => {
      radio.addEventListener("change", () => {
        renderTransports(radio.value);
      });
    });

  // ---- Selection handling ----
  transportListInner.addEventListener("click", e => {
    const row = e.target.closest(".transport-row");
    if (!row) return;
    const id = Number(row.dataset.id);
    selectedTransportId = id;
    const filter = document.querySelector(
      'input[name="transportFilter"]:checked'
    ).value;
    renderTransports(filter);
    updateSummary();
  });

  function updateSummary() {
    const trans = transports.find(t => t.id === selectedTransportId);
    const transportPrice = trans ? trans.pricePerDay : 0;

    if (summaryTransport) {
      summaryTransport.textContent = trans
        ? `${trans.label} - ${trans.company}`
        : "Not selected";
    }

    const total = packagePrice + addonsTotal + hotelPrice + transportPrice;
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
          : "") +
        (hotelPrice ? `, Hotel: ₱${hotelPrice.toLocaleString("en-PH")}` : "") +
        (transportPrice
          ? `, Transport: ₱${transportPrice.toLocaleString("en-PH")}`
          : "");
    }
  }

  updateSummary();

  // ---- Navigation ----
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "userBooking-step4.html";
    });
  }

 if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (!selectedTransportId) {
        if (!confirm("No transportation selected. Continue without transport?")) {
          return;
        }
      }
      const trans = transports.find(t => t.id === selectedTransportId) || null;
      localStorage.setItem(
        "cht_booking_step5",
        JSON.stringify({
          transportId: trans ? trans.id : null,
          label: trans ? trans.label : null,
          company: trans ? trans.company : null,
          pricePerDay: trans ? trans.pricePerDay : 0
        })
      );

      // Go to Step 6 (Confirm)
      window.location.href = "../../../HTML/userDashboard/Bookings/bookings6.html";
    });
  }

  // ---- Logout & sidebar ----
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

 