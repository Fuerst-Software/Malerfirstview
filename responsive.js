/* responsive.js
   Ziel: Mobile soll „PC-like“ wirken: stabile Höhen, saubere Typo-Skalierung,
   iOS/Android Viewport-Fixes, konsistente Kachel-Proportionen.
*/

(function () {
  const root = document.documentElement;

  // 1) Viewport height fix (iOS/Android Adressleisten-Bug)
  function setVh() {
    const vh = window.innerHeight * 0.01;
    root.style.setProperty("--vh", `${vh}px`);
  }

  // 2) Promise tiles: gleiche Höhe (Mobile/Tablet) für konsistentes Layout
  function equalizePromiseHeights() {
    const tiles = Array.from(document.querySelectorAll(".promiseTile"));
    if (!tiles.length) return;

    // Reset
    tiles.forEach(t => (t.style.minHeight = ""));

    // Nur wenn einspaltig / zweispaltig: PC braucht das nicht
    const isNarrow = window.matchMedia("(max-width: 980px)").matches;
    if (!isNarrow) return;

    // Einheitliche Höhe pro Reihe (bei 2 Spalten) oder global (bei 1 Spalte)
    const cols = window.matchMedia("(max: max-width: 560px)").matches ? 1 : 2;
     

    if (cols === 1) {
      // Einspaltig: nimm max Höhe, wirkt wie „Kachelserie“
      const maxH = Math.max(...tiles.map(t => t.getBoundingClientRect().height));
      tiles.forEach(t => (t.style.minHeight = `${Math.ceil(maxH)}px`));
      return;
    }

    // Zweispaltig: gleiche Höhe pro Row
    // Gruppiere nach Top-Position (Row-Cluster)
    const rows = [];
    const tolerance = 8;

    tiles.forEach(tile => {
      const top = tile.getBoundingClientRect().top;
      let row = rows.find(r => Math.abs(r.top - top) < tolerance);
      if (!row) {
        row = { top, items: [] };
        rows.push(row);
      }
      row.items.push(tile);
    });

    rows.forEach(row => {
      const maxH = Math.max(...row.items.map(t => t.getBoundingClientRect().height));
      row.items.forEach(t => (t.style.minHeight = `${Math.ceil(maxH)}px`));
    });
  }

  // 3) Typo feinjustieren (nur Mobile): Damit Überschriften nicht “klobig” wirken
  function tuneTypography() {
    const isNarrow = window.matchMedia("(max-width: 560px)").matches;
    // CSS bekommt Variablen, die wir hier dynamisch setzen
    root.style.setProperty("--promiseH3", isNarrow ? "32px" : "38px");
    root.style.setProperty("--promiseP", isNarrow ? "19px" : "22px");
    root.style.setProperty("--titleScale", isNarrow ? "0.92" : "1");
  }

  // 4) Reduce motion support
  function reduceMotionSupport() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.style.setProperty("--motion", reduce ? "0ms" : "250ms");
  }

  // Debounce util
  function debounce(fn, delay = 120) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), delay);
    };
  }

  // Run once after layout is ready
  function runAll() {
    setVh();
    tuneTypography();
    reduceMotionSupport();

    // nach Typo-Set erst messen
    requestAnimationFrame(() => {
      equalizePromiseHeights();
    });
  }

  const onResize = debounce(runAll, 120);

  window.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("orientationchange", onResize, { passive: true });

  // Fonts können Layout ändern → nach Laden nochmal equalize
  window.addEventListener("load", () => {
    runAll();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => runAll());
    }
  });

  // Initial
  runAll();
})();
