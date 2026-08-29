// Program Details Data for Modal Popup
const programData = {
  "little-hearts": {
    title: "Little Hearts",
    age: "Age 1 – 2 Years",
    tagline:
      "Gentle first steps into structured sensory play and social warmth.",
    desc: "The Little Hearts program provides a serene, home-like environment for toddlers taking their first steps outside the family fold. Our certified caregivers focus on emotional security, sensory development, basic language cues, and motor coordination.",
    chips: [
      "Soft Stacking Blocks",
      "Sensory Texture Balls",
      "Pouring & Scoop Trays",
      "Musical Shakers",
    ],
    timings: "⏰ 9:00 AM – 12:30 PM (Mon – Sat)",
    highlights: [
      "1:6 Educator to Child ratio for individual attention",
      "Daily health & hygiene check routine",
      "Gentle transition support for separation anxiety",
    ],
  },
  "tender-hearts": {
    title: "Tender Hearts (Playgroup)",
    age: "Age 2 – 3 Years",
    tagline:
      "Interactive play building vocabulary, socialization, and motor confidence.",
    desc: "In Tender Hearts, toddlers explore collaborative play, songs, story circles, and Montessori practical life activities. Children learn to express their needs, share toys, and develop self-help habits like tidying up after play.",
    chips: [
      "Shape Sorters",
      "Pegboards",
      "Wooden Puzzles",
      "Rhyme Picture Cards",
    ],
    timings: "⏰ 9:00 AM – 1:00 PM (Mon – Sat)",
    highlights: [
      "Guided group play & story telling",
      "Potty training assistance & routine habits",
      "Outdoor sandbox & swing exploration",
    ],
  },
  nursery: {
    title: "Nursery",
    age: "Age 3 – 4 Years",
    tagline:
      "Foundational learning through phonics, sensory materials, and storytelling.",
    desc: "Nursery marks the start of structured Montessori learning. Children work with sandpaper letters, counting rods, and art supplies, nurturing curiosity, spoken vocabulary, pencil grip, and independent thinking.",
    chips: [
      "Sandpaper Letters",
      "Number Rods",
      "Color Tablets",
      "Threading Beads",
    ],
    timings: "⏰ 9:00 AM – 1:30 PM (Mon – Sat)",
    highlights: [
      "Phonics sound recognition",
      "Fine motor pencil grip preparation",
      "Creative drawing & clay work",
    ],
  },
  lkg: {
    title: "LKG (Lower Kindergarten)",
    age: "Age 4 – 5 Years",
    tagline: "Structured literacy, numeracy, and problem-solving through play.",
    desc: "LKG prepares young minds for formal schooling with daily phonics blending, number bonds, basic writing, science discovery, and environmental awareness in a warm, encouraging classroom.",
    chips: [
      "Movable Alphabet",
      "Golden Bead Units",
      "Pattern Blocks",
      "Word Building Cards",
    ],
    timings: "⏰ 8:45 AM – 2:00 PM (Mon – Sat)",
    highlights: [
      "Reading three-letter CVC words",
      "Addition concepts with Montessori beads",
      "Public speaking & show-and-tell sessions",
    ],
  },
  ukg: {
    title: "UKG (Upper Kindergarten)",
    age: "Age 5 – 6 Years",
    tagline:
      "Primary school readiness with fluent reading, math, and self-confidence.",
    desc: "UKG focuses on independent reading, sentence formation, mental math, digital smart-class activities, and social confidence, ensuring a seamless transition into primary school.",
    chips: [
      "Phonics Readers",
      "Number Boards",
      "Science Discovery Kits",
      "Writing Workbooks",
    ],
    timings: "⏰ 8:45 AM – 2:00 PM (Mon – Sat)",
    highlights: [
      "Fluent sentence reading & writing",
      "Basic subtraction & math logic",
      "Primary school entrance readiness",
    ],
  },
  "day-care": {
    title: "Day Care Program",
    age: "All Ages (1 – 6 Years)",
    tagline:
      "A safe, nurturing extended daycare space with fresh meals and trained helpers.",
    desc: "Our daycare provides extended care with structured routines: healthy afternoon meals, quiet nap time, dedicated female helpers, free demo classes for parents, story sessions, and supervised indoor/outdoor playtime.",
    chips: [
      "Fresh Daily Meals",
      "Trained Female Attendants",
      "Cozy Rest Beds",
      "Creative Toy Sets",
    ],
    timings: "⏰ 8:30 AM – 5:30 PM (Mon – Sat)",
    highlights: [
      "Fresh nutritious snacks & meals served",
      "Dedicated trained maid & helper attendants on duty",
      "Free demo trial class for parents to experience daycare",
    ],
  },
  "mind-lab": {
    title: "Mind Lab & Enrichment",
    age: "Enrichment (Age 3 – 6)",
    tagline:
      "Brain teasers, puzzles, and experiments stimulating analytical thinking.",
    desc: "Mind Lab offers specialized cognitive activities like tangrams, memory games, Lego building, logic puzzles, and fun hands-on science experiments that boost spatial intelligence and focus.",
    chips: [
      "Tangrams & Cubes",
      "Memory Cards",
      "Lego Kits",
      "Science Wonder Trays",
    ],
    timings: "⏰ Afternoon Batches (Mon / Wed / Fri)",
    highlights: [
      "Cognitive skill enhancement",
      "Spatial puzzle solving drills",
      "Team problem solving challenges",
    ],
  },
  "montessori-lab": {
    title: "Dedicated Montessori Lab (Installing Next Session)",
    age: "★ Next Session 2027",
    tagline:
      "Authentic self-correcting Montessori apparatus & sensory stations being installed next year.",
    desc: "We are thrilled to announce that next year we are installing a dedicated, state-of-the-art Montessori Lab at Cambridge Montessori Preschool, Billawar! This specialized lab will house authentic Montessori sensorial equipment, practical life apparatus, golden beads, and self-correcting materials for deep experiential learning.",
    chips: [
      "Installing Next Year",
      "Sensorial Apparatus",
      "Golden Bead Units",
      "Practical Life Trays",
      "Pink Tower & Cylinders",
    ],
    timings: "⏰ Launching Next Academic Session (2027)",
    highlights: [
      "State-of-the-art international Montessori equipment",
      "Self-correcting sensory apparatus for independent discovery",
      "Hands-on practical life & fine motor skill stations",
    ],
  },
};

let selectedProgramName = "";

function openProgramModal(key) {
  const data = programData[key];
  if (!data) return;

  selectedProgramName = data.title;
  document.getElementById("mAge").innerText = data.age;
  document.getElementById("mTitle").innerText = data.title;
  document.getElementById("mTagline").innerText = data.tagline;
  document.getElementById("mDesc").innerText = data.desc;
  document.getElementById("mTimings").innerText = data.timings;

  // Chips
  const chipsWrap = document.getElementById("mChips");
  chipsWrap.innerHTML = "";
  data.chips.forEach((c) => {
    const span = document.createElement("span");
    span.className = "modal-chip";
    span.innerText = c;
    chipsWrap.appendChild(span);
  });

  // Highlights
  const hlWrap = document.getElementById("mHighlights");
  hlWrap.innerHTML = "";
  data.highlights.forEach((h) => {
    const li = document.createElement("li");
    li.innerHTML = `<svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> ${h}`;
    hlWrap.appendChild(li);
  });

  document.getElementById("programModalBackdrop").classList.add("active");
}

function closeProgramModal() {
  document.getElementById("programModalBackdrop").classList.remove("active");
}

function enquireCurrentProgram() {
  closeProgramModal();
  const select = document.getElementById("p-program");
  if (select && selectedProgramName) {
    for (let i = 0; i < select.options.length; i++) {
      if (
        select.options[i].text.includes(selectedProgramName) ||
        select.options[i].value.includes(selectedProgramName)
      ) {
        select.selectedIndex = i;
        break;
      }
    }
  }
  document.getElementById("visit").scrollIntoView({ behavior: "smooth" });
}

// Close modal on click outside card
document
  .getElementById("programModalBackdrop")
  .addEventListener("click", function (e) {
    if (e.target === this) closeProgramModal();
  });

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeProgramModal();
});

// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");
navToggle.addEventListener("click", () => {
  mainNav.classList.toggle("open");
  navToggle.classList.toggle("open");
});
mainNav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    mainNav.classList.remove("open");
    navToggle.classList.remove("open");
  }),
);

// ================= GALLERY ENGINE (Dynamic + Static) =================
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

let galleryTiles = [];
let visibleTiles = [];
let currentTileIdx = 0;
let currentActiveCat = "all";
let currentGalleryPage = 1;
const GALLERY_PAGE_SIZE = 12; // 3 rows of 4 columns

const gmodal = document.getElementById("galleryLightbox");
const gmodalImg = document.getElementById("gmodalImg");
const gmodalTitle = document.getElementById("gmodalTitle");
const gmodalTag = document.getElementById("gmodalTag");
const gmodalCounter = document.getElementById("gmodalCounter");

function openGalleryModal(index) {
  if (!visibleTiles.length) return;
  currentTileIdx = (index + visibleTiles.length) % visibleTiles.length;
  const targetTile = visibleTiles[currentTileIdx];
  const img = targetTile.querySelector("img");

  if (gmodalImg && targetTile) {
    gmodalImg.src = img.src;
    gmodalImg.alt = img.alt || targetTile.dataset.title;
    gmodalTitle.innerText = targetTile.dataset.title || "Photo View";
    gmodalTag.innerText = targetTile.dataset.tag || "Gallery";
    gmodalCounter.innerText = `${currentTileIdx + 1} / ${visibleTiles.length}`;
    gmodal.classList.add("active");
  }
}

function closeGalleryModal() {
  if (gmodal) gmodal.classList.remove("active");
}

// Apply 3-row Pagination (No Page Reload)
function applyGalleryPagination(shouldScroll = false) {
  const matchingTiles = galleryTiles.filter(
    (tile) => currentActiveCat === "all" || tile.dataset.category === currentActiveCat
  );

  const totalItems = matchingTiles.length;
  const totalPages = Math.ceil(totalItems / GALLERY_PAGE_SIZE) || 1;

  if (currentGalleryPage > totalPages) currentGalleryPage = totalPages;
  if (currentGalleryPage < 1) currentGalleryPage = 1;

  const startIndex = (currentGalleryPage - 1) * GALLERY_PAGE_SIZE;
  const endIndex = startIndex + GALLERY_PAGE_SIZE;
  const currentPageTiles = matchingTiles.slice(startIndex, endIndex);

  // Show only currentPageTiles, hide all others
  galleryTiles.forEach((tile) => {
    if (currentPageTiles.includes(tile)) {
      tile.classList.remove("hidden");
    } else {
      tile.classList.add("hidden");
    }
  });

  visibleTiles = [...currentPageTiles];

  // Render Pagination Controls
  renderPaginationUI(totalItems, totalPages, startIndex, endIndex);
}

function renderPaginationUI(totalItems, totalPages, startIndex, endIndex) {
  const paginationContainer = document.getElementById("galleryPagination");
  const pageInfo = document.getElementById("gpageInfo");
  const paginationWrap = document.getElementById("galleryPaginationWrap");

  if (!paginationContainer || !pageInfo) return;

  if (totalItems === 0) {
    paginationContainer.innerHTML = "";
    pageInfo.textContent = "No photos found in this category.";
    if (paginationWrap) paginationWrap.style.display = "none";
    return;
  }

  if (paginationWrap) paginationWrap.style.display = "flex";

  paginationContainer.innerHTML = "";

  // 1. "← Prev" Button
  const prevBtn = document.createElement("button");
  prevBtn.className = `gpage-btn gpage-prev ${currentGalleryPage === 1 ? "disabled" : ""}`;
  prevBtn.innerHTML = "&larr; Prev";
  prevBtn.disabled = currentGalleryPage === 1;
  prevBtn.onclick = (e) => {
    e.preventDefault();
    if (currentGalleryPage > 1) {
      currentGalleryPage--;
      applyGalleryPagination(true);
    }
  };
  paginationContainer.appendChild(prevBtn);

  // 2. Number Page Buttons (1, 2, 3, 4...)
  for (let p = 1; p <= totalPages; p++) {
    const numBtn = document.createElement("button");
    numBtn.className = `gpage-num ${p === currentGalleryPage ? "active" : ""}`;
    numBtn.textContent = p;
    numBtn.onclick = (e) => {
      e.preventDefault();
      if (currentGalleryPage !== p) {
        currentGalleryPage = p;
        applyGalleryPagination(true);
      }
    };
    paginationContainer.appendChild(numBtn);
  }

  // 3. "Next →" Button
  const nextBtn = document.createElement("button");
  nextBtn.className = `gpage-btn gpage-next ${currentGalleryPage === totalPages ? "disabled" : ""}`;
  nextBtn.innerHTML = "Next &rarr;";
  nextBtn.disabled = currentGalleryPage === totalPages;
  nextBtn.onclick = (e) => {
    e.preventDefault();
    if (currentGalleryPage < totalPages) {
      currentGalleryPage++;
      applyGalleryPagination(true);
    }
  };
  paginationContainer.appendChild(nextBtn);

  // 4. "Showing X–Y of Z photos" info text
  const displayEnd = Math.min(endIndex, totalItems);
  pageInfo.textContent = `Showing ${startIndex + 1}–${displayEnd} of ${totalItems} photos`;
}

function filterGalleryCategory(cat) {
  currentActiveCat = cat;
  currentGalleryPage = 1; // Reset to page 1 on category change
  applyGalleryPagination(false);
}

function initGalleryHandlers() {
  galleryTiles = Array.from(document.querySelectorAll(".gtile"));

  // Tab click filtering
  document.querySelectorAll(".gtab").forEach((tab) => {
    tab.onclick = () => {
      document.querySelectorAll(".gtab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      filterGalleryCategory(tab.dataset.tab);
    };
  });

  // Tile click for lightbox
  galleryTiles.forEach((tile) => {
    tile.onclick = () => {
      const idx = visibleTiles.indexOf(tile);
      if (idx !== -1) openGalleryModal(idx);
    };
  });

  // Initialize 3-row pagination with default "all" category
  applyGalleryPagination(false);
}

// Default base categories
const BASE_GALLERY_CATEGORIES = [
  { id: "classrooms", name: "Classrooms" },
  { id: "activities", name: "Activities & Craft" },
  { id: "library", name: "Library Corner" },
  { id: "play", name: "Play & Outdoor" },
  { id: "events", name: "Events & Celebrations" }
];

// Dynamically render gallery filter tabs
function renderDynamicGalleryTabs(categories) {
  const tabsContainer = document.getElementById("galleryTabs");
  if (!tabsContainer || !categories || !categories.length) return;

  tabsContainer.innerHTML = "";

  // "All Photos" Tab
  const allBtn = document.createElement("button");
  allBtn.className = `gtab ${currentActiveCat === "all" ? "active" : ""}`;
  allBtn.dataset.tab = "all";
  allBtn.textContent = "All Photos";
  tabsContainer.appendChild(allBtn);

  // Each Category Tab
  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = `gtab ${currentActiveCat === cat.id ? "active" : ""}`;
    btn.dataset.tab = cat.id;
    btn.textContent = cat.name;
    tabsContainer.appendChild(btn);
  });
}

// Fetch dynamic gallery items & categories from Cloudflare API / Local Storage
async function loadDynamicGallery() {
  try {
    let items = [];
    let categories = [...BASE_GALLERY_CATEGORIES];

    // 1. Load custom categories from storage
    const storedCats = localStorage.getItem("cmps_gallery_categories");
    if (storedCats) {
      try {
        const parsedCats = JSON.parse(storedCats);
        if (Array.isArray(parsedCats)) {
          parsedCats.forEach((c) => {
            if (!categories.some((existing) => existing.id === c.id)) {
              categories.push(c);
            }
          });
        }
      } catch (_) {}
    }

    // 2. Try Cloudflare API
    try {
      const res = await fetch("/api/gallery");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) items = data;
      }
    } catch (_) {}

    // 3. Fallback to LocalStorage cache
    if (!items.length) {
      const cached = localStorage.getItem("cmps_gallery_data");
      if (cached) {
        items = JSON.parse(cached);
      }
    }

    // 4. Auto-discover any new categories from uploaded items
    if (items && items.length > 0) {
      items.forEach((item) => {
        if (item.category && !categories.some((c) => c.id === item.category)) {
          const readableName = item.tag || item.category.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
          categories.push({ id: item.category, name: readableName });
        }
      });

      const grid = document.getElementById("galleryGrid");
      if (grid) {
        grid.innerHTML = "";
        items.forEach((item) => {
          const catObj = categories.find((c) => c.id === item.category);
          const displayTag = item.tag || (catObj ? catObj.name : item.category);

          const tile = document.createElement("div");
          tile.className = "gtile";
          tile.dataset.category = item.category || "classrooms";
          tile.dataset.title = item.title || "Campus Photo";
          tile.dataset.tag = displayTag || "Gallery";
          tile.innerHTML = `
            <img src="${item.image_url}" alt="${escapeHtml(item.title || 'Photo')}" loading="lazy">
            <div class="gtile-overlay">
              <span class="gtile-badge">${escapeHtml(displayTag)}</span>
              <div class="gtile-bottom">
                <h4 class="gtile-title">${escapeHtml(item.title || 'Campus Moment')}</h4>
                <div class="gtile-zoom-icon">🔍</div>
              </div>
            </div>
          `;
          grid.appendChild(tile);
        });
      }
    }

    // Render filter tabs
    renderDynamicGalleryTabs(categories);
  } catch (err) {
    // Production silent fallback
  } finally {
    initGalleryHandlers();
  }
}

// Lightbox modal buttons & controls
const gmodalCloseBtn = document.getElementById("gmodalCloseBtn");
if (gmodalCloseBtn) gmodalCloseBtn.addEventListener("click", closeGalleryModal);

const gmodalPrev = document.getElementById("gmodalPrev");
if (gmodalPrev) {
  gmodalPrev.addEventListener("click", (e) => {
    e.stopPropagation();
    openGalleryModal(currentTileIdx - 1);
  });
}

const gmodalNext = document.getElementById("gmodalNext");
if (gmodalNext) {
  gmodalNext.addEventListener("click", (e) => {
    e.stopPropagation();
    openGalleryModal(currentTileIdx + 1);
  });
}

if (gmodal) {
  gmodal.addEventListener("click", (e) => {
    if (e.target === gmodal) closeGalleryModal();
  });
}

document.addEventListener("keydown", (e) => {
  if (gmodal && gmodal.classList.contains("active")) {
    if (e.key === "Escape") closeGalleryModal();
    if (e.key === "ArrowLeft") openGalleryModal(currentTileIdx - 1);
    if (e.key === "ArrowRight") openGalleryModal(currentTileIdx + 1);
  }
});

// Run dynamic gallery check on load
document.addEventListener("DOMContentLoaded", loadDynamicGallery);

// FAQ accordion
document.querySelectorAll(".faq-item").forEach((item) => {
  const q = item.querySelector(".faq-q");
  const a = item.querySelector(".faq-a");
  if (item.classList.contains("open")) {
    a.style.maxHeight = a.scrollHeight + "px";
  }
  q.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");
    document.querySelectorAll(".faq-item").forEach((other) => {
      other.classList.remove("open");
      other.querySelector(".faq-a").style.maxHeight = null;
    });
    if (!isOpen) {
      item.classList.add("open");
      a.style.maxHeight = a.scrollHeight + "px";
    }
  });
});

// Scroll reveal animations
const revealEls = document.querySelectorAll(".reveal, .reveal-stagger");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("in"));
}

// Helper: Save enquiry locally to sync with Admin Dashboard
function saveEnquiryLocal(enquiry) {
  try {
    const existing = JSON.parse(localStorage.getItem("cmps_enquiries_data") || "[]");
    existing.unshift(enquiry);
    localStorage.setItem("cmps_enquiries_data", JSON.stringify(existing));
  } catch (_) {}
}

// Lead Form -> Cloudflare Database & WhatsApp submission
const leadForm = document.getElementById("leadForm");
if (leadForm) {
  leadForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const parentName = document.getElementById("p-name").value.trim();
    const childName = (document.getElementById("p-child") ? document.getElementById("p-child").value.trim() : "");
    const phone = document.getElementById("p-phone").value.trim();
    const program = document.getElementById("p-program").value;
    const msg = document.getElementById("p-msg").value.trim();

    const enquiryRecord = {
      id: "lead_" + Date.now(),
      parent_name: parentName,
      child_name: childName || "Not specified",
      phone: phone,
      program: program,
      message: msg || "",
      status: "new",
      created_at: new Date().toISOString()
    };

    // 1. Save to local buffer
    saveEnquiryLocal(enquiryRecord);

    // 2. Send to Cloudflare Pages API endpoint
    try {
      fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enquiryRecord)
      }).catch(() => {});
    } catch (_) {}

    let text = `Hello! I'd like to enquire about admission / free demo class at CMPS Billawar.%0AParent: ${encodeURIComponent(parentName)}`;
    if (childName) text += `%0AChild: ${encodeURIComponent(childName)}`;
    text += `%0APhone: ${encodeURIComponent(phone)}%0AProgram: ${encodeURIComponent(program)}`;
    if (msg) text += `%0AMessage: ${encodeURIComponent(msg)}`;

    document.getElementById("formSuccess").classList.add("show");
    leadForm.style.display = "none";

    setTimeout(() => {
      window.open(`https://wa.me/919622972163?text=${text}`, "_blank");
    }, 400);
  });
}

// Scroll To Top Button functionality
const scrollTopBtn = document.getElementById("scrollTopBtn");
if (scrollTopBtn) {
  const toggleScrollBtn = () => {
    if (window.scrollY > 280) {
      scrollTopBtn.classList.add("show");
    } else {
      scrollTopBtn.classList.remove("show");
    }
  };
  window.addEventListener("scroll", toggleScrollBtn, { passive: true });
  toggleScrollBtn();
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}
