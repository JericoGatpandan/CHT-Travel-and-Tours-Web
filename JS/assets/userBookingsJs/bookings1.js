// Simple front-end behavior for New Booking - Step 1 (Customer)

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bookingStep1Form");
  const fullNameInput = document.getElementById("custFullName");
  const contactInput = document.getElementById("custContact");
  const emailInput = document.getElementById("custEmail");
  const destinationInput = document.getElementById("custDestination");
  const travelTypeInput = document.getElementById("custTravelType");
  const paxInput = document.getElementById("custPax");

  const summaryCustomer = document.getElementById("summaryCustomer");
  const cancelBtn = document.getElementById("bookingCancelBtn");
  const nextBtn = document.getElementById("bookingNextBtn");

  const logoutBtn = document.getElementById("userLogoutBtn");
  const sidebarNewBookingBtn = document.getElementById("sidebarNewBookingBtn");

  // Keep summary "Customer" text updated as name field changes
  if (fullNameInput && summaryCustomer) {
    fullNameInput.addEventListener("input", () => {
      summaryCustomer.textContent = fullNameInput.value || "Not set";
    });
  }

  // CANCEL -> back to user dashboard (you can change destination)
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      if (confirm("Cancel this booking and go back to dashboard?")) {
        window.location.href = "userDashboard.html";
      }
    });
  }

  // NEXT -> (for demo) just validate and alert; in a real app, move to step 2 page

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (!form.reportValidity()) return;

      const bookingCustomer = {
        fullName: fullNameInput.value,
        contact: contactInput.value,
        email: emailInput.value,
        destination: destinationInput.value,
        travelType: travelTypeInput.value,
        pax: paxInput.value
      };
      localStorage.setItem("cht_booking_step1", JSON.stringify(bookingCustomer));

      // Now move to step 2 page
      window.location.href = "../../../HTML/userDashboard/Bookings/bookings2.html";
    });
  }

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("cht_current_username");
      window.location.href = "login.html";
    });
  }

  // If user clicks "+ New Booking" again while already on booking, just scroll top
  if (sidebarNewBookingBtn) {
    sidebarNewBookingBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Pre-fill name in header from login (optional)
  const storedName = localStorage.getItem("cht_current_username");
  const nameSpans = document.querySelectorAll("#userNameLabel");
  nameSpans.forEach(s => {
    if (storedName) s.textContent = storedName;
  });
});

//Update
