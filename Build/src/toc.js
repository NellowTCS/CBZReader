import { state } from './state.js';
import { tocList, tocPanel, readerContainer, mainArea, pageCountEl } from './dom.js';

export function buildToc(totalPages) {
  tocList.innerHTML = "";
  for (let i = 0; i < totalPages; i++) {
    const btn = document.createElement("button");
    btn.className = "toc-item";
    btn.textContent = state.pageNames[i] || `Page ${i + 1}`;
    btn.addEventListener("click", () => {
      goToPage(i);
      tocPanel.classList.remove("open");
    });
    tocList.appendChild(btn);
  }
}

export function goToPage(index) {
  const images = readerContainer.querySelectorAll("img");
  if (images[index]) {
    images[index].scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function updateCurrentPage() {
  const images = readerContainer.querySelectorAll("img");
  const scrollTop = mainArea.scrollTop;

  for (let i = images.length - 1; i >= 0; i--) {
    if (images[i].offsetTop <= scrollTop + mainArea.clientHeight / 2) {
      state.currentPage = i;
      break;
    }
  }

  // Update page count
  pageCountEl.textContent = `${state.currentPage + 1} / ${images.length}`;

  // Update TOC highlight
  const tocItems = tocList.querySelectorAll(".toc-item");
  tocItems.forEach((item, i) => {
    item.classList.toggle("current", i === state.currentPage);
  });
}
