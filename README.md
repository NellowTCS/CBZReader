# CBZReader

A minimal CBZ/ZIP reader for webtoons and comics.

## Features

- Drop or click to open CBZ/ZIP files
- Gapless scrolling for webtoons
- Page navigation
- Light/dark theme
- Works offline (PWA)
- Curvomorphic UI design

## Usage

1. Open the app in a browser
2. Drop a CBZ or ZIP file onto the page, or click to browse
3. Scroll vertically through pages
4. Use the page list to jump to specific pages
5. Toggle theme in settings

## Keyboard Shortcuts

- Arrow Up / k - scroll up
- Arrow Down / j - scroll down

## Tech

- Vanilla JS
- JSZip for archive handling
- Vite for building
- PWA support

## Theming

Change colors in `styles/styles.css` by editing the root block at the top.

## Build

```bash
cd Build
npm install
npm run build
```

For single file output:

```bash
SINGLE_FILE=true npm run build
```
