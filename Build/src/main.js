import { state } from "./state.js";
import * as dom from "./dom.js";
import { applyTheme, cycleTheme } from "./theme.js";
import { toggleUI, scrollToTop } from "./ui.js";
import { updateCurrentPage } from "./toc.js";
import { setWidthMode, toggleGap } from "./settings.js";
import { handleFile } from "./reader.js";
import Lenis from "lenis";

const lenis = new Lenis({
  wrapper: dom.mainArea, // The scrollable container
  content: dom.mainArea.firstElementChild, // The inner content to scroll
  lerp: 0.1,
  duration: 1.2,
});

// Animation loop required for Lenis (weird that it doesn't auto do this for us :/)
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

lenis.on("scroll", ({ scroll }) => {
  // Toggle Scroll to Top Button
  if (scroll > 500) {
    dom.scrollTopBtn.classList.add("visible");
  } else {
    dom.scrollTopBtn.classList.remove("visible");
  }

  // Update Table of Contents page tracking
  if (state.pageNames.length > 0) {
    updateCurrentPage();
  }
});

// Keyboard Support
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown" || e.key === "j") {
    e.preventDefault();
    lenis.scrollTo(lenis.scroll + 400);
  } else if (e.key === "ArrowUp" || e.key === "k") {
    e.preventDefault();
    lenis.scrollTo(lenis.scroll - 400);
  }
});

// Drag and Drop
document.body.addEventListener("dragover", (e) => {
  e.preventDefault();
  document.body.classList.add("dragging");
});

document.body.addEventListener("dragleave", (e) => {
  e.preventDefault();
  if (e.target === document.body) {
    document.body.classList.remove("dragging");
  }
});

document.body.addEventListener("drop", (e) => {
  e.preventDefault();
  document.body.classList.remove("dragging");
  if (e.dataTransfer.files.length) {
    handleFile(e.dataTransfer.files[0]);
  }
});

// File Input
dom.fileInput.addEventListener("change", (e) => {
  if (e.target.files.length) {
    handleFile(e.target.files[0]);
  }
});

// TOC Toggle
dom.tocButton.addEventListener("click", (e) => {
  e.stopPropagation();
  dom.tocPanel.classList.toggle("open");
  dom.settingsPanel.classList.remove("open");
});

// Settings Toggle
dom.settingsButton.addEventListener("click", (e) => {
  e.stopPropagation();
  dom.settingsPanel.classList.toggle("open");
  dom.tocPanel.classList.remove("open");
});

document.getElementById("toc-close").addEventListener("click", () => {
  dom.tocPanel.classList.remove("open");
});

// UI Toggles
dom.mainArea.addEventListener("click", (e) => {
  if (
    e.target.tagName !== "BUTTON" &&
    e.target.tagName !== "IMG" &&
    e.target.closest("header") === null
  ) {
    toggleUI();
  }
});

// Close panels when clicking outside
document.addEventListener("click", (e) => {
  const clickedToc =
    dom.tocPanel.contains(e.target) || dom.tocButton.contains(e.target);
  const clickedSettings =
    dom.settingsPanel.contains(e.target) ||
    dom.settingsButton.contains(e.target);
  if (!clickedToc) {
    dom.tocPanel.classList.remove("open");
  }
  if (!clickedSettings) {
    dom.settingsPanel.classList.remove("open");
  }
});

dom.scrollTopBtn.addEventListener("click", () => {
  lenis.scrollTo(0);
});

document
  .getElementById("btn-fit-width")
  .addEventListener("click", () => setWidthMode("100%"));
document
  .getElementById("btn-fit-original")
  .addEventListener("click", () => setWidthMode("auto"));
document.getElementById("btn-gapless").addEventListener("click", toggleGap);
document.getElementById("btn-theme").addEventListener("click", cycleTheme);

// Initialize theme
applyTheme();
