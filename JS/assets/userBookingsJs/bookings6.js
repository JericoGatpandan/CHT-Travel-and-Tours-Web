// Step 6: Review & Confirm

document.addEventListener("DOMContentLoaded", () => {
  const summaryCustomer = document.getElementById("summaryCustomer");
  const summaryPackage = document.getElementById("summaryPackage");
  const summaryHotel = document.getElementById("summaryHotel");
  const summaryTransport = document.getElementById("summaryTransport");
  const summaryTotal = document.getElementById("summaryTotal");
  const summaryBreakdown = document.getElementById("summaryBreakdown");

  const reviewCustomer = document.getElementById("reviewCustomer");
  const reviewTravelDate = document.getElementById("reviewTravelDate");
  const reviewPackage = document.getElementById("reviewPackage");
  const reviewHotel = document.getElementById("reviewHotel");
  const reviewTransport = document.getElementById("reviewTransport");
  const reviewTotalAmount = document.getElementById("reviewTotalAmount");

  const backBtn = document.getElementById("bookingBackBtn");
  const confirmBtn = document.getElementById("confirmBookingBtn");
  const logoutBtn = document.getElementById("userLogoutBtn");
  const sidebarNewBookingBtn = document.getElementById("sidebarNewBookingBtn");
  const agreeTerms = document.getElementById("agreeTerms");
  const termsError = document.getElementById("termsError");

  let packagePrice = 0;
  let addonsTotal = 0;
  let hotelPrice = 0;
  let transportPrice = 0;

  let customerData = {};
  let packageData = {};
  let addonsData = {};
  let hotelData = {};
  let transportData = {};

  // -------- Helpers --------
  function formatPHP(amount) {
    return "₱" + amount.toLocaleString("en-PH", { minimumFractionDigits: 0 });
  }

  // -------- Load data from previous steps --------

  // Step 1
  const s1 = localStorage.getItem("cht_booking_step1");
  if (s1) {
    try {
      customerData = JSON.parse(s1);
      const pax = customerData.pax || 1;
      const display = customerData.fullName
        ? `${customerData.fullName} (${pax} pax)`
        : "Not set";

      summaryCustomer.textContent = display;
      reviewCustomer.textContent = display;

      const travelDate =
        customerData.travelDate || new Date().toISOString().slice(0, 10);
      reviewTravelDate.textContent = travelDate;
    } catch {
      summaryCustomer.textContent = "Not set";
      reviewCustomer.textContent = "Not set";
      reviewTravelDate.textContent = "Not set";
    }
  }

  // Step 2
  const s2 = localStorage.getItem("cht_booking_step2");
  if (s2) {
    try {
      packageData = JSON.parse(s2);
      packagePrice = Number(packageData.price) || 0;
      summaryPackage.textContent = packageData.packageName || "Not selected";
      reviewPackage.textContent = packageData.packageName || "Not selected";
    } catch {
      summaryPackage.textContent = "Not selected";
      reviewPackage.textContent = "Not selected";
    }
  }

  // Step 3
  const s3 = localStorage.getItem("cht_booking_step3");
  if (s3) {
    try {
      addonsData = JSON.parse(s3);
      const addonIds = addonsData.addonIds || [];
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
      addonsData = {};
      addonsTotal = 0;
    }
  }

  // Step 4
  const s4 = localStorage.getItem("cht_booking_step4");
  if (s4) {
    try {
      hotelData = JSON.parse(s4);
      hotelPrice = Number(hotelData.hotelPricePerNight) || 0;
      if (hotelData.hotelName) {
        summaryHotel.textContent = hotelData.hotelName;
        reviewHotel.textContent = hotelData.hotelName;
      } else {
        summaryHotel.textContent = "Not selected";
        reviewHotel.textContent = "Not selected";
      }
    } catch {
      hotelData = {};
      summaryHotel.textContent = "Not selected";
      reviewHotel.textContent = "Not selected";
    }
  }

  // Step 5
  const s5 = localStorage.getItem("cht_booking_step5");
  if (s5) {
    try {
      transportData = JSON.parse(s5);
      transportPrice = Number(transportData.pricePerDay) || 0;
      const label = transportData.label
        ? `${transportData.label}${
            transportData.company ? " - " + transportData.company : ""
          }`
        : "Not selected";
      summaryTransport.textContent = label;
      reviewTransport.textContent = label;
    } catch {
      transportData = {};
      summaryTransport.textContent = "Not selected";
      reviewTransport.textContent = "Not selected";
    }
  }

  // -------- Totals --------
  function updateTotals() {
    const total = packagePrice + addonsTotal + hotelPrice + transportPrice;
    summaryTotal.textContent = formatPHP(total);
    reviewTotalAmount.textContent =
      "PHP " + total.toLocaleString("en-PH", { minimumFractionDigits: 2 });

    summaryBreakdown.textContent =
      "Package: " +
      formatPHP(packagePrice) +
      (addonsTotal ? `, Add-ons: ${formatPHP(addonsTotal)}` : "") +
      (hotelPrice ? `, Hotel: ${formatPHP(hotelPrice)}` : "") +
      (transportPrice ? `, Transport: ${formatPHP(transportPrice)}` : "");
  }
  updateTotals();

  // -------- Booking object builder --------
  function buildBookingObject() {
    const total =
      packagePrice + addonsTotal + hotelPrice + transportPrice;

    // Simple ID like BK-0001, BK-0002...
    const all = JSON.parse(localStorage.getItem("cht_bookings") || "[]");
    const nextNumber = all.length ? all.length + 1 : 1;
    const id = "BK-" + String(nextNumber).padStart(4, "0");

    const today = new Date().toISOString().slice(0, 10);

    return {
      id, // booking code
      client: customerData.fullName || "Unnamed Client",
      destination: customerData.destination || customerData.custDestination || "",
      packageName: packageData.packageName || "N/A",
      startDate: today,              // for demo; you can change to real travel date
      endDate: today,                // for demo
      status: "Upcoming",            // default status
      totalAmount: total,
      packagePrice,
      addonsTotal,
      hotelPrice,
      transportPrice
    };
  }

  // -------- Navigation & confirm --------
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "userBooking-step5.html";
    });
  }

  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      if (!agreeTerms.checked) {
        termsError.classList.remove("hidden");
        return;
      }
      termsError.classList.add("hidden");

      // Confirmation dialog
      const ok = confirm("Are you sure you want to confirm this booking?");
      if (!ok) return;

      const booking = buildBookingObject();

      // Save to localStorage array
      const stored = JSON.parse(localStorage.getItem("cht_bookings") || "[]");
      stored.push(booking);
      localStorage.setItem("cht_bookings", JSON.stringify(stored));

      // Clear step data for next booking
      localStorage.removeItem("cht_booking_step1");
      localStorage.removeItem("cht_booking_step2");
      localStorage.removeItem("cht_booking_step3");
      localStorage.removeItem("cht_booking_step4");
      localStorage.removeItem("cht_booking_step5");

      // Go to bookings list
      window.location.href = "userBookings.html";
    });
  }

  // Logout & sidebar
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

  if (agreeTerms) {
    agreeTerms.addEventListener("change", () => {
      if (agreeTerms.checked) termsError.classList.add("hidden");
    });
  }
});