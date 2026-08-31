// ==========================================================================
// CMPS Billawar — Admin & Admissions Dashboard Logic
// ==========================================================================

const STORAGE_KEYS = {
  AUTH_TOKEN: "cmps_admin_session_token",
  ADMIN_EMAIL: "cmps_admin_email",
  ENQUIRIES: "cmps_admin_cached_enquiries",
  GALLERY: "cmps_gallery_data",
  CATEGORIES: "cmps_gallery_categories"
};

let enquiriesState = (() => {
  try {
    return JSON.parse(localStorage.getItem("cmps_admin_cached_enquiries") || "[]");
  } catch (_) {
    return [];
  }
})();
let galleryState = [];
let currentStatusFilter = "all";
let currentProgramFilter = "all";
let currentDateFilter = "all";
let currentSearchQuery = "";
let currentGalleryCatFilter = "all";
let selectedUploadDataUrl = null;

// Check Authentication (Redirect immediately if not logged in)
if (!sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)) {
  window.location.replace("login.html");
}

function showAdminApp() {
  // Populate settings email if stored
  const sEmail = document.getElementById("settingsEmail");
  const storedEmail = localStorage.getItem(STORAGE_KEYS.ADMIN_EMAIL) || "cmpsbillawar@gmail.com";
  if (sEmail) sEmail.value = storedEmail;

  initDashboard();
}



// Logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    window.location.replace("login.html");
  });
}

// ================= NAVIGATION =================
const navItems = document.querySelectorAll(".sidebar-nav .nav-item[data-view]");
const appViews = document.querySelectorAll(".app-view");

navItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    const targetView = item.dataset.view;

    navItems.forEach((n) => n.classList.remove("active"));
    item.classList.add("active");

    appViews.forEach((view) => {
      view.style.display = "none";
      view.classList.remove("active");
    });

    if (targetView === "enquiries") {
      const el = document.getElementById("viewEnquiries");
      el.style.display = "block";
      el.classList.add("active");
      renderEnquiries();
    } else if (targetView === "gallery") {
      const el = document.getElementById("viewGallery");
      el.style.display = "block";
      el.classList.add("active");
      renderAdminGallery();
    } else if (targetView === "settings") {
      const el = document.getElementById("viewSettings");
      el.style.display = "block";
      el.classList.add("active");
    }
  });
});

// ================= TOAST NOTIFICATIONS =================
function showToast(message, type = "success") {
  const toast = document.getElementById("adminToast");
  toast.textContent = message;
  toast.className = `admin-toast ${type} show`;
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

// ================= ENQUIRIES LOGIC (Instant Cache + Direct Cloudflare D1 Sync) =================
async function loadEnquiries() {
  try {
    const isLocal = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
    const apiUrl = isLocal ? "https://cmpsbillawar.in/api/enquiries" : "/api/enquiries";
    const res = await fetch(apiUrl, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        enquiriesState = data;
        localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(data));
        renderEnquiries();
        return;
      }
    }
  } catch (_) { }
}

function saveEnquiries() {
  // Sync to Cloudflare D1
  try {
    const isLocal = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
    const apiUrl = isLocal ? "https://cmpsbillawar.in/api/enquiries" : "/api/enquiries";
    fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(enquiriesState[0] || {})
    }).catch(() => { });
  } catch (_) { }
}

function updateStatusCounts() {
  let allActive = 0, newCount = 0, contactedCount = 0, enrolledCount = 0, trashCount = 0;

  enquiriesState.forEach((item) => {
    const s = (item.status || "new").toLowerCase();
    if (s === "trash") {
      trashCount++;
    } else {
      allActive++;
      if (s === "new") newCount++;
      else if (s === "contacted") contactedCount++;
      else if (s === "enrolled") enrolledCount++;
    }
  });

  document.getElementById("countAll").textContent = allActive;
  document.getElementById("countNew").textContent = newCount;
  document.getElementById("countContacted").textContent = contactedCount;
  document.getElementById("countEnrolled").textContent = enrolledCount;
  document.getElementById("countTrash").textContent = trashCount;

  // Sidebar badge
  const sbCount = document.getElementById("sidebarNewCount");
  if (sbCount) {
    sbCount.textContent = newCount;
    sbCount.style.display = newCount > 0 ? "inline-block" : "none";
  }
}

function renderEnquiries() {
  updateStatusCounts();
  const tbody = document.getElementById("leadsTableBody");
  const mobileList = document.getElementById("mobileLeadsList");
  const emptyState = document.getElementById("leadsEmptyState");

  if (tbody) tbody.innerHTML = "";
  if (mobileList) mobileList.innerHTML = "";

  // Apply filters
  const filtered = enquiriesState.filter((item) => {
    const s = (item.status || "new").toLowerCase();
    // Status Filter
    if (currentStatusFilter === "all" && s === "trash") return false;
    if (currentStatusFilter !== "all" && s !== currentStatusFilter) return false;

    // Program Filter
    if (currentProgramFilter !== "all" && !item.program.includes(currentProgramFilter)) return false;

    // Date Filter
    if (currentDateFilter !== "all") {
      const created = new Date(item.created_at || Date.now());
      const now = new Date();
      if (currentDateFilter === "today") {
        if (created.toDateString() !== now.toDateString()) return false;
      } else if (currentDateFilter === "week") {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 3600000);
        if (created < oneWeekAgo) return false;
      } else if (currentDateFilter === "month") {
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 3600000);
        if (created < oneMonthAgo) return false;
      }
    }

    // Search Query
    if (currentSearchQuery) {
      const q = currentSearchQuery.toLowerCase();
      const match =
        (item.parent_name && item.parent_name.toLowerCase().includes(q)) ||
        (item.child_name && item.child_name.toLowerCase().includes(q)) ||
        (item.phone && item.phone.toLowerCase().includes(q)) ||
        (item.program && item.program.toLowerCase().includes(q)) ||
        (item.message && item.message.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  if (filtered.length === 0) {
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";

  filtered.forEach((item, index) => {
    const formattedDate = new Date(item.created_at || Date.now()).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });

    const status = (item.status || "new").toLowerCase();
    const cleanPhone = (item.phone || "").replace(/\D/g, "");

    // 1. Desktop Table Row
    if (tbody) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>
          <span class="lead-parent-name">${escapeHtml(item.parent_name || "Unknown")}</span>
        </td>
        <td>
          <span class="lead-child-name">${escapeHtml(item.child_name || "—")}</span>
        </td>
        <td>
          <span class="lead-phone">${escapeHtml(item.phone || "—")}</span>
        </td>
        <td>
          <span class="lead-program-badge">${escapeHtml(item.program || "General")}</span>
        </td>
        <td>
          <div class="lead-msg-snippet" title="${escapeHtml(item.message || "No message")}">${escapeHtml(item.message || "—")}</div>
        </td>
        <td>
          <select class="status-changer-select" onchange="changeLeadStatus('${item.id}', this.value)">
            <option value="new" ${status === "new" ? "selected" : ""}>New Lead</option>
            <option value="contacted" ${status === "contacted" ? "selected" : ""}>Contacted</option>
            <option value="enrolled" ${status === "enrolled" ? "selected" : ""}>Enrolled</option>
            <option value="trash" ${status === "trash" ? "selected" : ""}>Trash</option>
          </select>
        </td>
        <td style="font-size:12px; color:#64748b; white-space:nowrap;">${formattedDate}</td>
        <td>
          <div class="actions-cell">
            <button class="btn-view-details" onclick="openEnquiryDetailsModal('${item.id}', ${index + 1})" title="View complete details">
              👁️ View Details
            </button>
            ${cleanPhone
          ? `<a href="https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(item.parent_name || "")},%20greetings%20from%20Cambridge%20Montessori%20Preschool%2C%20Billawar!" target="_blank" class="btn-icon-action wa" title="Chat on WhatsApp">
                    <svg viewBox="0 0 24 24"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.87.5 3.62 1.44 5.13L2 22l5.1-1.5a9.9 9.9 0 004.94 1.32h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.8 14.16c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.95-.3-1.64-.6-2.9-1.25-4.79-4.17-4.93-4.36-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.4.26-.29.58-.36.77-.36.19 0 .39 0 .55.01.18.01.42-.07.66.5.24.58.83 2 .9 2.15.07.14.12.31.02.5-.1.19-.15.31-.29.48-.14.17-.3.37-.43.5-.14.14-.29.29-.13.57.17.29.75 1.24 1.62 2 1.11.99 2.05 1.3 2.34 1.44.29.14.46.12.63-.07.17-.19.72-.84.91-1.13.19-.29.38-.24.63-.14.26.1 1.65.78 1.94.92.29.14.48.21.55.33.07.12.07.68-.17 1.36z"/></svg>
                  </a>`
          : ""
        }
            <button class="btn-icon-action del" onclick="deleteLead('${item.id}')" title="Delete enquiry">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    }

    // 2. Mobile Clean Card (Parent Name, Child Name, View Details)
    if (mobileList) {
      const card = document.createElement("div");
      card.className = "mobile-lead-card";
      card.innerHTML = `
        <div class="mlead-top-row">
          <div class="mlead-parent-wrap">
            <span class="mlead-index-badge">#${index + 1}</span>
            <span class="mlead-parent-name">${escapeHtml(item.parent_name || "Unknown")}</span>
          </div>
          <span class="badge-status ${status}">${escapeHtml(status)}</span>
        </div>

        <div class="mlead-meta-row">
          <div class="mlead-child">👶 Child: <strong>${escapeHtml(item.child_name || "—")}</strong></div>
          <div class="mlead-date">${formattedDate}</div>
        </div>

        <div class="mlead-program">🎓 ${escapeHtml(item.program || "General Enquiry")}</div>

        <div class="mlead-actions-row">
          <button class="btn-mlead-view" onclick="openEnquiryDetailsModal('${item.id}', ${index + 1})">
            👁️ View Full Details
          </button>
          ${cleanPhone
          ? `<a href="https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(item.parent_name || "")},%20greetings%20from%20Cambridge%20Montessori%20Preschool%2C%20Billawar!" target="_blank" class="btn-mlead-wa" title="WhatsApp">
                  <svg viewBox="0 0 24 24"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.87.5 3.62 1.44 5.13L2 22l5.1-1.5a9.9 9.9 0 004.94 1.32h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.8 14.16c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.95-.3-1.64-.6-2.9-1.25-4.79-4.17-4.93-4.36-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.4.26-.29.58-.36.77-.36.19 0 .39 0 .55.01.18.01.42-.07.66.5.24.58.83 2 .9 2.15.07.14.12.31.02.5-.1.19-.15.31-.29.48-.14.17-.3.37-.43.5-.14.14-.29.29-.13.57.17.29.75 1.24 1.62 2 1.11.99 2.05 1.3 2.34 1.44.29.14.46.12.63-.07.17-.19.72-.84.91-1.13.19-.29.38-.24.63-.14.26.1 1.65.78 1.94.92.29.14.48.21.55.33.07.12.07.68-.17 1.36z"/></svg>
                </a>`
          : ""
        }
          <button class="btn-mlead-del" onclick="deleteLead('${item.id}')" title="Delete">
            <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      `;
      mobileList.appendChild(card);
    }
  });
}

// ================= ADMISSION ENQUIRY DETAILS MODAL =================
window.openEnquiryDetailsModal = function (id, indexNumber) {
  const item = enquiriesState.find((l) => l.id === id);
  if (!item) return;

  const modal = document.getElementById("enquiryModalBackdrop");
  document.getElementById("modalEnquirySubtitle").textContent = `Enquiry #${indexNumber || 1}`;
  document.getElementById("modalParentName").textContent = item.parent_name || "Not specified";
  document.getElementById("modalChildName").textContent = item.child_name || "Not specified";
  document.getElementById("modalPhone").textContent = item.phone || "Not specified";
  document.getElementById("modalProgram").textContent = item.program || "General Enquiry";
  document.getElementById("modalMessage").textContent = item.message || "This parent did not leave an optional message.";

  const dateObj = new Date(item.created_at || Date.now());
  const dateFormatted = dateObj.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }) + ", " + dateObj.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }).toLowerCase();
  document.getElementById("modalSubmittedDate").textContent = dateFormatted;

  // WhatsApp button
  const cleanPhone = (item.phone || "").replace(/\D/g, "");
  const waBtn = document.getElementById("modalWaBtn");
  const callBtn = document.getElementById("modalCallBtn");

  if (cleanPhone) {
    waBtn.href = `https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(item.parent_name || "")},%20greetings%20from%20Cambridge%20Montessori%20Preschool%2C%20Billawar!%20We%20received%20your%20enquiry%20for%20${encodeURIComponent(item.program || "Admission")}.`;
    waBtn.style.display = "inline-flex";
    callBtn.href = `tel:${cleanPhone}`;
    callBtn.style.display = "inline-flex";
  } else {
    waBtn.style.display = "none";
    callBtn.style.display = "none";
  }

  modal.style.display = "flex";
};

window.closeEnquiryDetailsModal = function () {
  const modal = document.getElementById("enquiryModalBackdrop");
  if (modal) modal.style.display = "none";
};

const closeEnquiryModalBtn = document.getElementById("closeEnquiryModalBtn");
if (closeEnquiryModalBtn) closeEnquiryModalBtn.addEventListener("click", closeEnquiryDetailsModal);

const enquiryModalBackdrop = document.getElementById("enquiryModalBackdrop");
if (enquiryModalBackdrop) {
  enquiryModalBackdrop.addEventListener("click", (e) => {
    if (e.target === enquiryModalBackdrop) closeEnquiryDetailsModal();
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeEnquiryDetailsModal();
});

// Change Status
window.changeLeadStatus = async function (id, newStatus) {
  const item = enquiriesState.find((l) => l.id === id);
  if (item) {
    item.status = newStatus;
    saveEnquiries();
    renderEnquiries();
    showToast(`Status updated to ${newStatus}.`, "success");

    // Sync to Cloudflare D1
    try {
      const isLocal = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
      const apiUrl = isLocal ? "https://cmpsbillawar.in/api/enquiries" : "/api/enquiries";
      fetch(apiUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      }).catch(() => { });
    } catch (_) { }
  }
};

// Delete Lead
window.deleteLead = async function (id) {
  if (confirm("Are you sure you want to remove this enquiry?")) {
    enquiriesState = enquiriesState.filter((l) => l.id !== id);
    saveEnquiries();
    renderEnquiries();
    showToast("Enquiry removed.", "success");

    // Sync to Cloudflare D1
    try {
      const isLocal = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
      const apiUrl = (isLocal ? "https://cmpsbillawar.in/api/enquiries" : "/api/enquiries") + `?id=${encodeURIComponent(id)}`;
      fetch(apiUrl, { method: "DELETE" }).catch(() => { });
    } catch (_) { }
  }
};

// Real-time automatic background synchronization (every 3s + on tab focus)
let lastEnquiriesHash = "";

async function autoSyncEnquiries() {
  if (!isAuthenticated() || document.visibilityState !== "visible") return;
  try {
    const isLocal = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
    const apiUrl = isLocal ? "https://cmpsbillawar.in/api/enquiries" : "/api/enquiries";
    const res = await fetch(apiUrl, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        const newHash = JSON.stringify(data);
        if (newHash !== lastEnquiriesHash) {
          lastEnquiriesHash = newHash;
          enquiriesState = data;
          renderEnquiries();
        }
      }
    }
  } catch (_) { }
}

setInterval(autoSyncEnquiries, 3000);
window.addEventListener("focus", autoSyncEnquiries);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") autoSyncEnquiries();
});

// Status Filter Tabs
document.querySelectorAll(".filter-pills-bar .pill-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-pills-bar .pill-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentStatusFilter = btn.dataset.status;
    renderEnquiries();
  });
});

// Dropdowns Filter
document.getElementById("programFilter").addEventListener("change", (e) => {
  currentProgramFilter = e.target.value;
  renderEnquiries();
});

document.getElementById("dateFilter").addEventListener("change", (e) => {
  currentDateFilter = e.target.value;
  renderEnquiries();
});

// Search Filter
document.getElementById("searchBtn").addEventListener("click", () => {
  currentSearchQuery = document.getElementById("searchInput").value.trim();
  renderEnquiries();
});

document.getElementById("searchInput").addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    currentSearchQuery = e.target.value.trim();
    renderEnquiries();
  }
});

// Export Filtered CSV
document.getElementById("exportCsvBtn").addEventListener("click", () => {
  if (!enquiriesState.length) {
    showToast("No enquiries available to export.", "error");
    return;
  }

  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Parent Name,Child Name,Phone,Program,Message,Status,Date\r\n";

  enquiriesState.forEach((item) => {
    const row = [
      `"${(item.parent_name || "").replace(/"/g, '""')}"`,
      `"${(item.child_name || "").replace(/"/g, '""')}"`,
      `"${(item.phone || "").replace(/"/g, '""')}"`,
      `"${(item.program || "").replace(/"/g, '""')}"`,
      `"${(item.message || "").replace(/"/g, '""')}"`,
      `"${item.status || "new"}"`,
      `"${new Date(item.created_at || Date.now()).toLocaleDateString()}"`
    ].join(",");
    csvContent += row + "\r\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `CMPS_Admissions_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast("Exported CSV file successfully!", "success");
});

// ================= SCHOOL GALLERY & DYNAMIC CATEGORIES =================
const DEFAULT_CATEGORIES = [
  { id: "classrooms", name: "Classrooms" },
  { id: "activities", name: "Activities & Craft" },
  { id: "library", name: "Library Corner" },
  { id: "play", name: "Play & Outdoor" },
  { id: "events", name: "Events & Celebrations" }
];

let categoriesState = [];

function loadCategories() {
  const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  if (stored) {
    try {
      categoriesState = JSON.parse(stored);
    } catch (_) {
      categoriesState = [...DEFAULT_CATEGORIES];
    }
  } else {
    categoriesState = [...DEFAULT_CATEGORIES];
  }

  // Ensure default categories exist
  DEFAULT_CATEGORIES.forEach((def) => {
    if (!categoriesState.some((c) => c.id === def.id)) {
      categoriesState.push(def);
    }
  });

  // Also include any categories found inside existing photos
  if (Array.isArray(galleryState)) {
    galleryState.forEach((photo) => {
      if (photo.category && !categoriesState.some((c) => c.id === photo.category)) {
        const readableName = photo.tag || photo.category.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
        categoriesState.push({
          id: photo.category,
          name: readableName
        });
      }
    });
  }

  saveCategories();
  renderCategoryDropdown();
  renderAdminCategoryFilters();
}

function saveCategories() {
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categoriesState));
}

function renderCategoryDropdown(selectedId) {
  const select = document.getElementById("gCategory");
  if (!select) return;

  const currentVal = selectedId || select.value || "classrooms";
  select.innerHTML = "";

  categoriesState.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat.id;
    opt.textContent = cat.name;
    if (cat.id === currentVal) opt.selected = true;
    select.appendChild(opt);
  });
}

function renderAdminCategoryFilters() {
  const filterContainer = document.getElementById("adminGalleryFilters");
  if (!filterContainer) return;

  filterContainer.innerHTML = "";

  // "All" button
  const allBtn = document.createElement("button");
  allBtn.className = `gcat-btn ${currentGalleryCatFilter === "all" ? "active" : ""}`;
  allBtn.dataset.cat = "all";
  allBtn.textContent = "All";
  allBtn.onclick = () => {
    currentGalleryCatFilter = "all";
    renderAdminCategoryFilters();
    renderAdminGallery();
  };
  filterContainer.appendChild(allBtn);

  // Dynamic category buttons
  categoriesState.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = `gcat-btn ${currentGalleryCatFilter === cat.id ? "active" : ""}`;
    btn.dataset.cat = cat.id;
    btn.textContent = cat.name;
    btn.onclick = () => {
      currentGalleryCatFilter = cat.id;
      renderAdminCategoryFilters();
      renderAdminGallery();
    };
    filterContainer.appendChild(btn);
  });
}

function createNewCategory(categoryName) {
  const name = categoryName.trim();
  if (!name) return null;

  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  if (!id) return null;

  const existing = categoriesState.find((c) => c.id === id);
  if (!existing) {
    const newCat = { id, name };
    categoriesState.push(newCat);
    saveCategories();
  }

  renderCategoryDropdown(id);
  renderAdminCategoryFilters();
  renderCategoryModalList();
  return id;
}

// Edit Category Name
function editCategory(id) {
  const cat = categoriesState.find((c) => c.id === id);
  if (!cat) return;

  const newName = prompt(`Enter new name for category "${cat.name}":`, cat.name);
  if (newName === null) return; // User cancelled
  const trimmed = newName.trim();
  if (!trimmed) {
    showToast("Category name cannot be empty.", "error");
    return;
  }

  cat.name = trimmed;

  // Update tag on all existing photos with this category
  galleryState.forEach((p) => {
    if (p.category === id) {
      p.tag = trimmed;
    }
  });

  saveCategories();
  saveGallery();
  renderCategoryDropdown(id);
  renderAdminCategoryFilters();
  renderAdminGallery();
  renderCategoryModalList();
  showToast(`Category updated to "${trimmed}"!`, "success");
}

// Delete Category
function deleteCategory(id) {
  const cat = categoriesState.find((c) => c.id === id);
  if (!cat) return;

  const photosCount = galleryState.filter((p) => p.category === id).length;
  let confirmMsg = `Are you sure you want to delete the category "${cat.name}"?`;
  if (photosCount > 0) {
    confirmMsg += `\nNote: ${photosCount} photo(s) are currently in this category. They will be moved to "Activities & Craft".`;
  }

  if (confirm(confirmMsg)) {
    // Re-assign photos if any
    if (photosCount > 0) {
      galleryState.forEach((p) => {
        if (p.category === id) {
          p.category = "activities";
          p.tag = "Activities & Craft";
        }
      });
      saveGallery();
    }

    categoriesState = categoriesState.filter((c) => c.id !== id);
    if (currentGalleryCatFilter === id) currentGalleryCatFilter = "all";

    saveCategories();
    renderCategoryDropdown();
    renderAdminCategoryFilters();
    renderAdminGallery();
    renderCategoryModalList();
    showToast(`Category "${cat.name}" deleted.`, "success");
  }
}

// Render Categories inside Manage Modal
function renderCategoryModalList() {
  const listWrap = document.getElementById("modalCatList");
  if (!listWrap) return;

  listWrap.innerHTML = "";

  categoriesState.forEach((cat) => {
    const photosCount = galleryState.filter((p) => p.category === cat.id).length;
    const row = document.createElement("div");
    row.className = "cat-item-row";
    row.innerHTML = `
      <div class="cat-item-info">
        <span class="cat-item-name">${escapeHtml(cat.name)}</span>
        <span class="cat-item-slug">id: ${escapeHtml(cat.id)}</span>
        <span class="cat-badge-count">${photosCount} photo${photosCount === 1 ? "" : "s"}</span>
      </div>
      <div class="cat-item-actions">
        <button type="button" class="btn-cat-edit" onclick="editCategory('${cat.id}')" title="Rename category">
          ✏️ Edit
        </button>
        <button type="button" class="btn-cat-del" onclick="deleteCategory('${cat.id}')" title="Delete category">
          🗑️ Delete
        </button>
      </div>
    `;
    listWrap.appendChild(row);
  });
}

// Category Modal Open / Close
const categoryManagerModal = document.getElementById("categoryManagerModal");
const btnOpenCategoryManager = document.getElementById("btnOpenCategoryManager");
const closeCategoryModalBtn = document.getElementById("closeCategoryModalBtn");
const closeCategoryModalFootBtn = document.getElementById("closeCategoryModalFootBtn");
const modalAddCatBtn = document.getElementById("modalAddCatBtn");
const modalCatInput = document.getElementById("modalCatInput");

function openCategoryManagerModal() {
  if (categoryManagerModal) {
    renderCategoryModalList();
    categoryManagerModal.style.display = "flex";
    if (modalCatInput) modalCatInput.focus();
  }
}

function closeCategoryManagerModal() {
  if (categoryManagerModal) {
    categoryManagerModal.style.display = "none";
    if (modalCatInput) modalCatInput.value = "";
  }
}

if (btnOpenCategoryManager) btnOpenCategoryManager.addEventListener("click", openCategoryManagerModal);
if (closeCategoryModalBtn) closeCategoryModalBtn.addEventListener("click", closeCategoryManagerModal);
if (closeCategoryModalFootBtn) closeCategoryModalFootBtn.addEventListener("click", closeCategoryManagerModal);

if (modalAddCatBtn && modalCatInput) {
  const handleModalAddCategory = () => {
    const name = modalCatInput.value.trim();
    if (!name) {
      showToast("Please enter a category name.", "error");
      return;
    }
    const id = createNewCategory(name);
    if (id) {
      modalCatInput.value = "";
      showToast(`Category "${name}" created successfully!`, "success");
    }
  };

  modalAddCatBtn.addEventListener("click", handleModalAddCategory);
  modalCatInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") handleModalAddCategory();
  });
}

// Inline Category Box Event Handlers in Upload Form
const btnShowAddCategory = document.getElementById("btnShowAddCategory");
const newCategoryBox = document.getElementById("newCategoryBox");
const newCatNameInput = document.getElementById("newCatNameInput");
const btnSaveNewCategory = document.getElementById("btnSaveNewCategory");
const btnCancelAddCategory = document.getElementById("btnCancelAddCategory");

if (btnShowAddCategory && newCategoryBox) {
  btnShowAddCategory.addEventListener("click", () => {
    newCategoryBox.style.display = newCategoryBox.style.display === "none" ? "block" : "none";
    if (newCategoryBox.style.display === "block" && newCatNameInput) {
      newCatNameInput.focus();
    }
  });
}

if (btnCancelAddCategory && newCategoryBox) {
  btnCancelAddCategory.addEventListener("click", () => {
    newCategoryBox.style.display = "none";
    if (newCatNameInput) newCatNameInput.value = "";
  });
}

if (btnSaveNewCategory && newCatNameInput) {
  const handleSaveCategory = () => {
    const name = newCatNameInput.value.trim();
    if (!name) {
      showToast("Please enter a category name.", "error");
      return;
    }

    const createdId = createNewCategory(name);
    if (createdId) {
      newCatNameInput.value = "";
      newCategoryBox.style.display = "none";
      showToast(`Category "${name}" created successfully!`, "success");
    }
  };

  btnSaveNewCategory.addEventListener("click", handleSaveCategory);
  newCatNameInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") handleSaveCategory();
  });
}

// ================= SETTINGS & SECURITY (Serverless Cloudflare D1 Backend) =================
const changePassForm = document.getElementById("changePassForm");
if (changePassForm) {
  changePassForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newEmail = document.getElementById("settingsEmail") ? document.getElementById("settingsEmail").value.trim() : "";
    const currentPass = document.getElementById("currentPass").value.trim();
    const newPass = document.getElementById("newPass").value.trim();
    const msgEl = document.getElementById("passChangeMsg");

    if (!currentPass) {
      msgEl.className = "feedback-msg error";
      msgEl.textContent = "Please enter your current password.";
      return;
    }

    if (newPass && newPass.length < 6) {
      msgEl.className = "feedback-msg error";
      msgEl.textContent = "New password must be at least 6 characters.";
      return;
    }

    try {
      const isLocal = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
      const apiUrl = isLocal ? "https://cmpsbillawar.in/api/admin/change-credentials" : "/api/admin/change-credentials";

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_password: currentPass,
          new_email: newEmail,
          new_password: newPass
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (newEmail) localStorage.setItem(STORAGE_KEYS.ADMIN_EMAIL, newEmail);
        msgEl.className = "feedback-msg success";
        msgEl.textContent = "Admin credentials updated securely in Cloudflare D1 database!";
        showToast("Account credentials saved!", "success");
        document.getElementById("currentPass").value = "";
        document.getElementById("newPass").value = "";
      } else {
        msgEl.className = "feedback-msg error";
        msgEl.textContent = data.error || "Failed to update settings.";
      }
    } catch (_) {
      msgEl.className = "feedback-msg error";
      msgEl.textContent = "Network error. Please try again.";
    }
  });
}

// Full JSON Backup
document.getElementById("downloadBackupBtn").addEventListener("click", () => {
  const backupData = {
    school: "Cambridge Montessori Preschool Billawar",
    exported_at: new Date().toISOString(),
    enquiries: enquiriesState,
    gallery: galleryState
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
  const link = document.createElement("a");
  link.setAttribute("href", dataStr);
  link.setAttribute("download", `CMPS_Full_Backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast("Full backup downloaded.", "success");
});

// Helper: Escape HTML
function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// ================= SIDEBAR TOGGLE & MOBILE DRAWER =================
const appSidebar = document.getElementById("appSidebar");
const toggleSidebarCollapse = document.getElementById("toggleSidebarCollapse");
const mobileMenuToggle = document.getElementById("mobileMenuToggle");
const closeSidebarBtn = document.getElementById("closeSidebarBtn");
const sidebarBackdrop = document.getElementById("sidebarBackdrop");

// Desktop Collapse / Expand toggle
if (toggleSidebarCollapse) {
  toggleSidebarCollapse.addEventListener("click", () => {
    appSidebar.classList.toggle("collapsed");
  });
}

// Mobile Open
function openMobileSidebar() {
  if (appSidebar && sidebarBackdrop) {
    appSidebar.classList.add("mobile-open");
    sidebarBackdrop.style.display = "block";
  }
}

// Mobile Close
function closeMobileSidebar() {
  if (appSidebar && sidebarBackdrop) {
    appSidebar.classList.remove("mobile-open");
    sidebarBackdrop.style.display = "none";
  }
}

if (mobileMenuToggle) mobileMenuToggle.addEventListener("click", openMobileSidebar);
if (closeSidebarBtn) closeSidebarBtn.addEventListener("click", closeMobileSidebar);
if (sidebarBackdrop) sidebarBackdrop.addEventListener("click", closeMobileSidebar);

// Close mobile sidebar on nav item click
document.querySelectorAll(".sidebar-nav .nav-item").forEach((item) => {
  item.addEventListener("click", () => {
    if (window.innerWidth <= 992) {
      closeMobileSidebar();
    }
  });
});

// ================= INIT =================
async function initDashboard() {
  // 1. Instantly render stored enquiries in 0ms (no blank state)
  renderEnquiries();
  renderAdminGallery();

  // 2. Fetch latest data from Cloudflare D1 in parallel
  loadEnquiries().then(() => {
    renderEnquiries();
  });

  loadGallery().then(() => {
    renderAdminGallery();
  });
}

// Start dashboard immediately
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", showAdminApp);
} else {
  showAdminApp();
}

