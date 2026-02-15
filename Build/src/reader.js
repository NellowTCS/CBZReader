import JSZip from 'jszip';
import { state } from './state.js';
import { welcomeScreen, pageCountEl, readerContainer, mainArea, tocList } from './dom.js';
import { showLoader, hideLoader } from './ui.js';
import { buildToc } from './toc.js';

export async function handleFile(file) {
  if (
    !file.name.toLowerCase().endsWith(".cbz") &&
    !file.name.toLowerCase().endsWith(".zip")
  ) {
    alert("Please select a valid .cbz or .zip file.");
    return;
  }

  // Cleanup previous
  cleanup();

  // Show Loader
  welcomeScreen.classList.add("hidden");
  showLoader("Reading file...");
  state.currentFile = file.name;

  try {
    const zip = new JSZip();
    const content = await zip.loadAsync(file);

    // Filter images
    const imageFiles = [];
    const regex = /\.(png|jpg|jpeg|gif|webp)$/i;

    showLoader("Sorting pages...");

    zip.forEach((relativePath, zipEntry) => {
      if (
        !zipEntry.dir &&
        regex.test(zipEntry.name) &&
        !zipEntry.name.startsWith("__MACOSX")
      ) {
        imageFiles.push(zipEntry);
      }
    });

    if (imageFiles.length === 0) {
      throw new Error("No images found in this archive.");
    }

    // Natural Sort
    imageFiles.sort((a, b) => {
      return a.name.localeCompare(b.name, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    });

    pageCountEl.textContent = `${imageFiles.length} Pages`;

    // Store page names for TOC
    state.pageNames = imageFiles.map((f) => f.name);
    buildToc(imageFiles.length);

    showLoader("Rendering...");

    // Render
    await renderImages(imageFiles);
  } catch (err) {
    console.error(err);
    alert("Error reading file: " + err.message);
    welcomeScreen.classList.remove("hidden");
    pageCountEl.textContent = "";
  } finally {
    hideLoader();
  }
}

export async function renderImages(files) {
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const blob = await file.async("blob");
    const url = URL.createObjectURL(blob);
    state.imageUrls.push(url);

    const img = document.createElement("img");
    img.src = url;
    img.loading = "lazy"; // Native lazy loading
    img.style.maxWidth = state.widthMode;
    img.style.width = state.widthMode === "100%" ? "100%" : "auto";

    // Gap logic
    img.style.marginBottom = state.gapless ? "0px" : "20px";

    fragment.appendChild(img);
  }

  readerContainer.appendChild(fragment);
  // Focus main area for keyboard scrolling
  mainArea.focus();
}

export function cleanup() {
  // Revoke old URLs to free memory
  state.imageUrls.forEach((url) => URL.revokeObjectURL(url));
  state.imageUrls = [];
  state.pageNames = [];
  state.currentPage = 0;
  readerContainer.innerHTML = "";
  mainArea.scrollTo(0, 0);
  tocList.innerHTML = "";
}
