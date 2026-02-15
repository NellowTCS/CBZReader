import { state } from './state.js';
import { readerContainer } from './dom.js';

export function setWidthMode(mode) {
  state.widthMode = mode;
  const images = readerContainer.querySelectorAll("img");
  images.forEach((img) => {
    img.style.maxWidth = mode;
    img.style.width = mode === "100%" ? "100%" : "auto";
  });

  // Update Buttons
  const fitWidthBtn = document.getElementById("btn-fit-width");
  const fitOriginalBtn = document.getElementById("btn-fit-original");

  if (mode === "100%") {
    fitWidthBtn.classList.add("btn-active");
    fitOriginalBtn.classList.remove("btn-active");
  } else {
    fitWidthBtn.classList.remove("btn-active");
    fitOriginalBtn.classList.add("btn-active");
  }
}

export function toggleGap() {
  state.gapless = !state.gapless;
  const images = readerContainer.querySelectorAll("img");
  const gap = state.gapless ? "0px" : "20px";

  images.forEach((img) => {
    img.style.marginBottom = gap;
  });

  const btn = document.getElementById("btn-gapless");
  if (state.gapless) {
    btn.textContent = "On";
    btn.classList.add("btn-active");
  } else {
    btn.textContent = "Off";
    btn.classList.remove("btn-active");
  }
}
