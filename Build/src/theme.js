import { state } from './state.js';

export function applyTheme() {
  const root = document.documentElement;
  if (state.theme === "dark") {
    root.setAttribute("data-theme", "dark");
  } else if (state.theme === "light") {
    root.setAttribute("data-theme", "light");
  } else {
    root.removeAttribute("data-theme");
  }
  updateThemeButton();
}

export function updateThemeButton() {
  const btn = document.getElementById("btn-theme");
  btn.textContent = state.theme.charAt(0).toUpperCase() + state.theme.slice(1);
}

export function cycleTheme() {
  const themes = ["system", "light", "dark"];
  const idx = themes.indexOf(state.theme);
  state.theme = themes[(idx + 1) % themes.length];
  localStorage.setItem("theme", state.theme);
  applyTheme();
}
