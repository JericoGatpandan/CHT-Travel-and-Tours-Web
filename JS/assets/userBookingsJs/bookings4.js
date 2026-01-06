// Step 4: Hotel selection

document.addEventListener("DOMContentLoaded", () => {
  const hotelListInner = document.getElementById("hotelListInner");

  const summaryCustomer = document.getElementById("summaryCustomer");
  const summaryPackage = document.getElementById("summaryPackage");
  const summaryHotel = document.getElementById("summaryHotel");
  const summaryTotal = document.getElementById("summaryTotal");
  const summaryBreakdown = document.getElementById("summaryBreakdown");

  const backBtn = document.getElementById("bookingBackBtn");
  const nextBtn = document.getElementById("bookingNextBtn");
  const logoutBtn = document.getElementById("userLogoutBtn");
  const sidebarNewBookingBtn = document.getElementById("sidebarNewBookingBtn");

  // ---- Load data from previous steps ----
  let packagePrice = 0;
  let addonsTotal = 0;

  // Step 1: customer
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

  // Step 2: package
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

  // Step 3: add-ons
  const s3 = localStorage.getItem("cht_booking_step3");
  if (s3) {
    try {
      const saved = JSON.parse(s3);
      const addonIds = saved.addonIds || [];
      // you can keep the list & prices in one place; here we re‑use the same mapping
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

  // Previously selected hotel (if user comes back)
  let selectedHotelId = null;
  const savedHotelRaw = localStorage.getItem("cht_booking_step4");
  if (savedHotelRaw) {
    try {
      const savedHotel = JSON.parse(savedHotelRaw);
      selectedHotelId = savedHotel.hotelId || null;
    } catch {
      selectedHotelId = null;
    }
  }

  // ---- Demo hotel data ----
  const hotels = [
    {
      id: 1,
      name: "Sapporo Snow Hotel",
      rating: 4,
      location: "Sapporo, Hokkaido",
      roomType: "Standard Room",
      features: "WiFi • Breakfast • Heater",
      pricePerNight: 2500
    },
    {
      id: 2,
      name: "Hong Kong City Hotel",
      rating: 3,
      location: "Kowloon, Hong Kong",
      roomType: "Standard Room",
      features: "WiFi • Breakfast",
      pricePerNight: 2500
    },
    {
      id: 3,
      name: "Bali Beach Resort",
      rating: 5,
      location: "Kuta, Bali",
      roomType: "Deluxe Room",
      features: "Pool • Beachfront • WiFi",
      pricePerNight: 6500
    },
    {
      id: 4,
      name: "Taipei Downtown Hotel",
      rating: 3,
      location: "Taipei",
      roomType: "Standard Room",
      features: "WiFi",
      pricePerNight: 2500
    }
  ];

  // ---- Render hotel rows ----
  function renderHotels(filterRating = "all") {
    hotelListInner.innerHTML = "";
    hotels.forEach(hotel => {
      if (filterRating !== "all" && hotel.rating !== Number(filterRating)) {
        return;
      }

      const row = document.createElement("div");
      row.className =
        "hotel-row" + (hotel.id === selectedHotelId ? " selected" : "");
      row.dataset.id = hotel.id;

      // simple star rendering
      const stars = "★★★★★".slice(0, hotel.rating);

      row.innerHTML = `
        <div class="hotel-row-left">
          <div class="hotel-name">${hotel.name}</div>
          <div class="hotel-rating">${stars}</div>
          <div class="hotel-location">📍 ${hotel.location}</div>
          <div class="hotel-room">🛏 ${hotel.roomType}</div>
          <div class="hotel-features">
            <span>${hotel.features}</span>
          </div>
        </div>
        <div class="hotel-price-block">
          <div class="hotel-price">PHP ${hotel.pricePerNight.toLocaleString()}</div>
          <div>per night</div>
          <button class="hotel-select-btn">Select</button>
        </div>
      `;
      hotelListInner.appendChild(row);
    });
  }

  renderHotels();

  // ---- Rating filter (visual only for now) ----
  document.querySelectorAll('input[name="ratingFilter"]').forEach(radio => {
    radio.addEventListener("change", () => {
      renderHotels(radio.value);
    });
  });

  // ---- Selection handling ----
  hotelListInner.addEventListener("click", e => {
    const row = e.target.closest(".hotel-row");
    if (!row) return;
    const id = Number(row.dataset.id);
    selectedHotelId = id;
    renderHotels(
      document.querySelector('input[name="ratingFilter"]:checked').value
    );
    updateSummary();
  });

  function updateSummary() {
    const hotel = hotels.find(h => h.id === selectedHotelId);
    const hotelPrice = hotel ? hotel.pricePerNight : 0;

    if (summaryHotel) {
      summaryHotel.textContent = hotel
        ? `${hotel.name} (PHP ${hotel.pricePerNight.toLocaleString()} / night)`
        : "Not selected";
    }

    const total = packagePrice + addonsTotal + hotelPrice;
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
        (hotelPrice ? `, Hotel: ₱${hotelPrice.toLocaleString("en-PH")}` : "");
    }
  }

  // Initialize summary with current selection (if any)
  updateSummary();

  // ---- Navigation buttons ----
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "userBooking-step3.html";
    });
  }

   if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (!selectedHotelId) {
        if (!confirm("No hotel selected. Continue without hotel?")) {
          return;
        }
      }
      const hotel = hotels.find(h => h.id === selectedHotelId) || null;
      localStorage.setItem(
        "cht_booking_step4",
        JSON.stringify({
          hotelId: hotel ? hotel.id : null,
          hotelName: hotel ? hotel.name : null,
          hotelPricePerNight: hotel ? hotel.pricePerNight : 0
        })
      );

      // Go to Step 5 (Transport)
      window.location.href = "../../../HTML/userDashboard/Bookings/bookings5.html";
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

 