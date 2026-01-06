// adminDashboard/JS_assets/admin_packages.js

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("packagesTable")) return; // not on this page

  const tableBody = document.querySelector("#packagesTable tbody");
  const packageForm = document.getElementById("packageForm");

  const idField = document.getElementById("packageId");
  const nameField = document.getElementById("packageName");
  const destField = document.getElementById("destination");
  const durationField = document.getElementById("duration");
  const maxPaxField = document.getElementById("maxPax");
  const priceField = document.getElementById("price");
  const statusField = document.getElementById("status");
  const descField = document.getElementById("description");
  const inclField = document.getElementById("inclusions");
  const cancelBtn = document.getElementById("cancelPackageBtn");

  const imageDropArea = document.getElementById("imageDropArea");
  const imagePreview = document.getElementById("imagePreview");
  const browseImageBtn = document.getElementById("browseImageBtn");
  const imageInput = document.getElementById("packageImageInput");

  let packages = [];

  /* ========== IMAGE DRAG & DROP ========== */
  function resetImagePreview() {
    imagePreview.classList.add("empty");
    imagePreview.innerHTML = `
      <span class="image-icon">☁</span>
      <p>Drag &amp; Drop<br><small>or click to browse</small></p>
    `;
    imageInput.value = "";
  }

  function showImagePreview(fileOrUrl) {
    // For existing record: string URL; for new: File
    if (typeof fileOrUrl === "string") {
      imagePreview.classList.remove("empty");
      imagePreview.innerHTML = `<img src="${fileOrUrl}" alt="Package image">`;
      return;
    }
    const file = fileOrUrl;
    const reader = new FileReader();
    reader.onload = e => {
      imagePreview.classList.remove("empty");
      imagePreview.innerHTML = `<img src="${e.target.result}" alt="Package image">`;
    };
    reader.readAsDataURL(file);
  }

  browseImageBtn.addEventListener("click", () => imageInput.click());

  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (file) showImagePreview(file);
  });

  ["dragenter", "dragover"].forEach(evt =>
    imageDropArea.addEventListener(evt, e => {
      e.preventDefault();
      e.stopPropagation();
      imageDropArea.classList.add("drag-over");
    })
  );

  ["dragleave", "drop"].forEach(evt =>
    imageDropArea.addEventListener(evt, e => {
      e.preventDefault();
      e.stopPropagation();
      imageDropArea.classList.remove("drag-over");
    })
  );

  imageDropArea.addEventListener("drop", e => {
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      imageInput.files = e.dataTransfer.files;
      showImagePreview(file);
    }
  });

  imageDropArea.addEventListener("click", () => imageInput.click());

  /* ========== LOAD PACKAGES FROM PHP ========== */
  function loadPackages() {
    fetch("../adminDashboard/api/list_packages.php")
      .then(r => r.json())
      .then(data => {
        packages = Array.isArray(data) ? data : [];
        renderPackages();
      })
      .catch(err => {
        console.error("Failed to load packages", err);
      });
  }

  function renderPackages() {
    tableBody.innerHTML = "";
    packages.forEach(pkg => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${pkg.id}</td>
        <td>${pkg.name}</td>
        <td>${pkg.destination}</td>
        <td>${pkg.duration_days} days</td>
        <td>${pkg.max_pax}</td>
        <td>₱${Number(pkg.price).toLocaleString()}</td>
        <td><span class="badge ${pkg.status === "Active" ? "badge-success" : "badge-danger"}">${pkg.status}</span></td>
        <td>
          <div class="action-btns">
            <button class="btn btn-primary small" data-action="edit" data-id="${pkg.id}">Edit</button>
            <button class="btn btn-danger small" data-action="delete" data-id="${pkg.id}">Delete</button>
          </div>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  loadPackages();

  /* ========== FORM MODE (ADD / EDIT) ========== */
  function setFormModeAdd() {
    idField.value = "";
    packageForm.reset();
    statusField.checked = true;
    durationField.value = 4;
    maxPaxField.value = 20;
    resetImagePreview();
  }

  function setFormModeEdit(pkg) {
    idField.value = pkg.id;
    nameField.value = pkg.name;
    destField.value = pkg.destination;
    durationField.value = pkg.duration_days || 1;
    maxPaxField.value = pkg.max_pax || 0;
    priceField.value = pkg.price || 0;
    statusField.checked = pkg.status === "Active";
    descField.value = pkg.description || "";
    inclField.value = pkg.inclusions || "";
    resetImagePreview();
    if (pkg.image_path) {
      showImagePreview("../" + pkg.image_path); // adjust path if needed
    }
  }

  cancelBtn.addEventListener("click", () => setFormModeAdd());

  /* ========== TABLE ACTIONS (EDIT/DELETE) ========== */
  tableBody.addEventListener("click", e => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const id = parseInt(btn.dataset.id, 10);
    const pkg = packages.find(p => Number(p.id) === id);
    if (!pkg) return;

    if (btn.dataset.action === "edit") {
      setFormModeEdit(pkg);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (btn.dataset.action === "delete") {
      if (!confirm("Delete this package?")) return;

      const formData = new FormData();
      formData.append("id", id);

      fetch("../adminDashboard/api/delete_package.php", {
        method: "POST",
        body: formData
      })
        .then(r => r.json())
        .then(res => {
          if (res.success) {
            loadPackages();
            setFormModeAdd();
          } else {
            alert(res.error || "Failed to delete package.");
          }
        })
        .catch(err => {
          console.error(err);
          alert("Error deleting package.");
        });
    }
  });

  /* ========== SAVE FORM (ADD/EDIT) ========== */
  packageForm.addEventListener("submit", e => {
    e.preventDefault();

    const formData = new FormData(packageForm);
    // convert checkbox to value PHP expects
    formData.set("status", statusField.checked ? "Active" : "Inactive");

    fetch("../adminDashboard/api/save_package.php", {
      method: "POST",
      body: formData
    })
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          loadPackages();
          setFormModeAdd();
        } else {
          alert(res.error || "Failed to save package.");
        }
      })
      .catch(err => {
        console.error(err);
        alert("Error saving package.");
      });
  });

  // initialize form
  setFormModeAdd();
});