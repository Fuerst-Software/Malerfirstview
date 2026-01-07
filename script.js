// Mobile menu toggle
const burger = document.querySelector(".nav__burger");
const navMobile = document.getElementById("navMobile");

if (burger && navMobile) {
  burger.addEventListener("click", () => {
    const isHidden = navMobile.hasAttribute("hidden");
    if (isHidden) navMobile.removeAttribute("hidden");
    else navMobile.setAttribute("hidden", "");
    burger.setAttribute("aria-expanded", String(isHidden));
  });

  navMobile.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      navMobile.setAttribute("hidden", "");
      burger.setAttribute("aria-expanded", "false");
    });
  });
}

// Promise tiles: on touch devices use tap to toggle overlay
const tiles = Array.from(document.querySelectorAll("[data-tile]"));

function isTouchDevice() {
  return window.matchMedia("(hover: none)").matches || navigator.maxTouchPoints > 0;
}

if (tiles.length && isTouchDevice()) {
  tiles.forEach(tile => {
    tile.addEventListener("click", (e) => {
      // prevent weird selection; toggle open state
      const isOpen = tile.classList.contains("is-open");

      // close others
      tiles.forEach(t => t.classList.remove("is-open"));

      // toggle this
      if (!isOpen) tile.classList.add("is-open");
    });

    // keyboard accessibility (Enter/Space)
    tile.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const isOpen = tile.classList.contains("is-open");
        tiles.forEach(t => t.classList.remove("is-open"));
        if (!isOpen) tile.classList.add("is-open");
      }
    });
  });

  // tap outside closes
  document.addEventListener("click", (e) => {
    const clickedTile = e.target.closest("[data-tile]");
    if (!clickedTile) tiles.forEach(t => t.classList.remove("is-open"));
  });
}

// Contact form demo (später Formspree)
const form = document.getElementById("contactForm");
const note = document.getElementById("formNote");

if (form && note) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    note.textContent = "Danke! Ihre Anfrage ist eingegangen – ich melde mich zeitnah.";
    form.reset();
  });
}
