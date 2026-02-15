export const state = {
  widthMode: "100%",
  gapless: true,
  uiVisible: true,
  currentFile: null,
  imageUrls: [],
  pageNames: [],
  currentPage: 0,
  theme: localStorage.getItem("theme") || "system",
};
