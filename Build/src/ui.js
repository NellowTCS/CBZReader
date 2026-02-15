import { state } from './state.js';
import { header, settingsPanel, mainArea, loaderText, loader } from './dom.js';

export function toggleUI() {
  state.uiVisible = !state.uiVisible;
  if (state.uiVisible) {
    header.classList.remove("hidden");
  } else {
    header.classList.add("hidden");
    settingsPanel.classList.remove("open"); // Close settings if hiding UI
  }
}

export function toggleSettings() {
  settingsPanel.classList.toggle("open");
}

export function scrollToTop() {
  mainArea.scrollTo({ top: 0, behavior: "smooth" });
}

export function showLoader(message) {
  loaderText.textContent = message;
  loader.classList.add("show");
}

export function hideLoader() {
  loader.classList.remove("show");
}
