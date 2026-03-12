const directoryPanel = document.getElementById("directoryPanel");
const billboardPreview = document.getElementById("billboardPreview");
const emptyState = document.getElementById("emptyState");
const speedControl = document.getElementById("speedControl");
const speedValue = document.getElementById("speedValue");
const artworkList = document.getElementById("artworkList");
const artworkUpload = document.getElementById("artworkUpload");
const loopPreviewTrack = document.getElementById("loopPreviewTrack");
const loopVisualization = document.getElementById("loopVisualization");
const STORAGE_KEYS = {
  speed: "billboard.loopSpeedSeconds",
  direction: "billboard.selectedDirection",
  artworks: "billboard.loopArtworks"
};
const DEFAULT_ARTWORKS = [
  { src: "assets/linear-loop-strip.png", name: "linear-loop-strip.png" }
];
let loopArtworks = [...DEFAULT_ARTWORKS];
let draggingArtworkIndex = null;
let pdfJsModulePromise = null;

function normalizeHref(href) {
  if (!href) {
    return "";
  }
  return href.split("?")[0].split("#")[0];
}

function parseDirectoryListing(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const links = [...doc.querySelectorAll('a[href]')];

  return links
    .map((link) => normalizeHref(link.getAttribute("href")))
    .filter((href) => href && href.endsWith("/"))
    .filter((href) => href !== "./" && href !== "../")
    .map((href) => decodeURIComponent(href.replace(/\/$/, "")))
    .filter((name) => name && !name.startsWith("."));
}

async function getDirectoryNames(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Cannot read ${path}`);
  }
  const html = await response.text();
  return parseDirectoryListing(html);
}

function directionPath(name) {
  return `directions/${encodeURIComponent(name)}/index.html`;
}

function artworkFileName(path) {
  const clean = String(path).split("?")[0].split("#")[0];
  const parts = clean.split("/");
  return parts[parts.length - 1] || clean;
}

function normalizeArtworkItem(item) {
  if (typeof item === "string") {
    return { src: item, name: artworkFileName(item) };
  }
  if (!item || typeof item !== "object") {
    return null;
  }
  const src = typeof item.src === "string" ? item.src.trim() : "";
  if (!src) {
    return null;
  }
  const name =
    typeof item.name === "string" && item.name.trim()
      ? item.name.trim()
      : artworkFileName(src);
  return { src, name };
}

function fileExtension(name) {
  const lowered = String(name || "").toLowerCase();
  const dotIndex = lowered.lastIndexOf(".");
  if (dotIndex < 0) {
    return "";
  }
  return lowered.slice(dotIndex + 1);
}

function isSupportedArtworkFile(file) {
  const extension = fileExtension(file.name);
  return ["svg", "png", "jpg", "jpeg", "jpt", "pdf"].includes(extension);
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (!result) {
        reject(new Error("Unable to read file"));
        return;
      }
      resolve(result);
    });
    reader.addEventListener("error", () => reject(new Error("Unable to read file")));
    reader.readAsDataURL(file);
  });
}

async function getPdfJsModule() {
  if (!pdfJsModulePromise) {
    pdfJsModulePromise = import("https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.mjs");
  }
  return pdfJsModulePromise;
}

async function convertPdfToDataUrl(file) {
  const pdfjsLib = await getPdfJsModule();
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.mjs";

  const buffer = await file.arrayBuffer();
  const documentTask = pdfjsLib.getDocument({ data: buffer });
  const pdf = await documentTask.promise;
  const firstPage = await pdf.getPage(1);
  const viewport = firstPage.getViewport({ scale: 1.5 });

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);

  await firstPage.render({ canvasContext: context, viewport }).promise;
  return canvas.toDataURL("image/png");
}

async function processArtworkFile(file) {
  const extension = fileExtension(file.name);
  if (extension === "pdf") {
    return convertPdfToDataUrl(file);
  }
  return readFileAsDataUrl(file);
}

async function addArtworkFiles(files) {
  const validFiles = [...files].filter((file) => isSupportedArtworkFile(file));
  if (!validFiles.length) {
    return;
  }

  for (const file of validFiles) {
    try {
      const src = await processArtworkFile(file);
      loopArtworks.push({ src, name: file.name || "upload" });
    } catch (error) {
      // Ignore single-file failures and continue with others.
    }
  }

  saveArtworks(loopArtworks);
  renderArtworkList();
  renderLoopPreview();
  sendLoopConfigToPreview();
}

async function canLoadDirection(name) {
  const response = await fetch(directionPath(name), { cache: "no-store" });
  return response.ok;
}

async function discoverDirections() {
  const names = await getDirectoryNames("directions/");
  const visible = names.filter((name) => !name.startsWith("."));
  const directions = [];

  for (const name of visible) {
    const exists = await canLoadDirection(name);
    if (exists) {
      directions.push(name);
    }
  }

  return directions;
}

async function loadDirectionsFromManifest() {
  const response = await fetch("directions/manifest.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Cannot read directions/manifest.json");
  }
  const json = await response.json();

  if (Array.isArray(json)) {
    return json;
  }

  if (json && typeof json === "object") {
    return Object.values(json).flat().filter((item) => typeof item === "string");
  }

  return [];
}

function loadDirection(path) {
  billboardPreview.src = path;
  billboardPreview.style.display = "block";
  emptyState.style.display = "none";
}

function setActiveDirection(button) {
  const allButtons = directoryPanel.querySelectorAll(".direction-item");
  allButtons.forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
}

function currentSpeedSeconds() {
  if (!speedControl) {
    return 16;
  }
  return Number(speedControl.value);
}

function readStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    // Ignore storage failures.
  }
}

function saveSpeed(seconds) {
  writeStorage(STORAGE_KEYS.speed, String(seconds));
}

function restoreSpeed() {
  if (!speedControl) {
    return;
  }

  const rawValue = readStorage(STORAGE_KEYS.speed);
  if (!rawValue) {
    return;
  }

  const parsed = Number(rawValue);
  if (!Number.isFinite(parsed)) {
    return;
  }

  const min = Number(speedControl.min || 0);
  const max = Number(speedControl.max || 999);
  const clamped = Math.min(max, Math.max(min, parsed));
  speedControl.value = String(clamped);
}

function saveSelectedDirection(name) {
  writeStorage(STORAGE_KEYS.direction, name);
}

function restoreSelectedDirection() {
  return readStorage(STORAGE_KEYS.direction);
}

function saveArtworks(artworks) {
  writeStorage(STORAGE_KEYS.artworks, JSON.stringify(artworks));
}

function restoreArtworks() {
  const rawValue = readStorage(STORAGE_KEYS.artworks);
  if (!rawValue) {
    return [...DEFAULT_ARTWORKS];
  }

  try {
    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) {
      return [...DEFAULT_ARTWORKS];
    }
    const cleaned = parsed
      .map((item) => normalizeArtworkItem(item))
      .filter((item) => item !== null);
    return cleaned.length ? cleaned : [...DEFAULT_ARTWORKS];
  } catch (error) {
    return [...DEFAULT_ARTWORKS];
  }
}

function syncSpeedReadout() {
  if (!speedValue) {
    return;
  }
  speedValue.textContent = `${currentSpeedSeconds()}s`;
}

function sendLoopConfigToPreview() {
  if (!billboardPreview.contentWindow) {
    return;
  }
  const seconds = currentSpeedSeconds();
  const payload = {
    type: "setLoopConfig",
    seconds,
    artworks: loopArtworks.map((item) => item.src)
  };
  billboardPreview.contentWindow.postMessage(payload, "*");
  billboardPreview.contentWindow.postMessage({ type: "setLoopDuration", seconds }, "*");
}

function renderLoopPreview() {
  if (!loopPreviewTrack) {
    return;
  }

  loopPreviewTrack.innerHTML = "";
  loopArtworks.forEach((item, index) => {
    const tile = document.createElement("div");
    tile.className = "loop-preview-item";
    tile.draggable = true;
    tile.dataset.index = String(index);

    const image = document.createElement("img");
    image.src = item.src;
    image.alt = "";
    tile.appendChild(image);

    tile.addEventListener("dragstart", () => {
      draggingArtworkIndex = index;
      tile.classList.add("dragging");
    });

    tile.addEventListener("dragend", () => {
      draggingArtworkIndex = null;
      tile.classList.remove("dragging");
    });

    tile.addEventListener("dragover", (event) => {
      event.preventDefault();
    });

    tile.addEventListener("drop", (event) => {
      event.preventDefault();
      const targetIndex = Number(tile.dataset.index);
      if (!Number.isInteger(targetIndex)) {
        return;
      }
      moveArtwork(draggingArtworkIndex, targetIndex);
    });

    loopPreviewTrack.appendChild(tile);
  });
}

function artworkLastFive(path) {
  const name = String(path || "");
  return name.slice(-5);
}

function moveArtwork(fromIndex, toIndex) {
  if (!Number.isInteger(fromIndex) || !Number.isInteger(toIndex)) {
    return;
  }
  if (fromIndex < 0 || toIndex < 0 || fromIndex >= loopArtworks.length || toIndex >= loopArtworks.length) {
    return;
  }
  if (fromIndex === toIndex) {
    return;
  }

  const [moved] = loopArtworks.splice(fromIndex, 1);
  loopArtworks.splice(toIndex, 0, moved);
  saveArtworks(loopArtworks);
  renderArtworkList();
  renderLoopPreview();
  sendLoopConfigToPreview();
}

function removeArtwork(index) {
  if (loopArtworks.length <= 1) {
    return;
  }
  loopArtworks.splice(index, 1);
  saveArtworks(loopArtworks);
  renderArtworkList();
  renderLoopPreview();
  sendLoopConfigToPreview();
}

function renderArtworkList() {
  if (!artworkList) {
    return;
  }

  artworkList.innerHTML = "";

  loopArtworks.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "artwork-item";

    const thumb = document.createElement("img");
    thumb.className = "artwork-thumb";
    thumb.src = item.src;
    thumb.alt = "";
    row.appendChild(thumb);

    const name = document.createElement("span");
    name.className = "artwork-index";
    name.textContent = `${index + 1}. ${item.name}`;
    row.appendChild(name);

    const suffix = document.createElement("span");
    suffix.className = "artwork-suffix";
    suffix.textContent = artworkLastFive(item.name);
    row.appendChild(suffix);

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "artwork-remove";
    removeButton.textContent = "[x]";
    removeButton.addEventListener("click", () => removeArtwork(index));
    row.appendChild(removeButton);

    artworkList.appendChild(row);
  });
}

function addArtworkFromInput() {
  if (!artworkUpload || !artworkUpload.files || !artworkUpload.files[0]) {
    return;
  }
  addArtworkFiles(artworkUpload.files);
  artworkUpload.value = "";
}

function renderDirectory(directions) {
  directoryPanel.innerHTML = "";

  const section = document.createElement("section");
  section.className = "directory-section";

  const title = document.createElement("h2");
  title.textContent = "directions";
  section.appendChild(title);

  const savedDirection = restoreSelectedDirection();
  let initialButton = null;
  let initialName = null;

  directions.forEach((name) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "direction-item";
    button.textContent = name;
    button.addEventListener("click", () => {
      loadDirection(directionPath(name));
      setActiveDirection(button);
      saveSelectedDirection(name);
    });
    section.appendChild(button);

    if (savedDirection === name) {
      initialButton = button;
      initialName = name;
    }
  });

  directoryPanel.appendChild(section);

  if (initialButton && initialName) {
    loadDirection(directionPath(initialName));
    setActiveDirection(initialButton);
  }
}

async function init() {
  restoreSpeed();
  loopArtworks = restoreArtworks();

  try {
    let directions = [];
    try {
      directions = await discoverDirections();
    } catch (error) {
      directions = await loadDirectionsFromManifest();
    }

    if (!directions.length) {
      throw new Error("No directions found");
    }

    renderDirectory(directions);
  } catch (error) {
    emptyState.textContent = "No directions found. Check directions/manifest.json.";
  }

  syncSpeedReadout();
  renderArtworkList();
  renderLoopPreview();

  if (speedControl) {
    speedControl.addEventListener("input", () => {
      syncSpeedReadout();
      saveSpeed(currentSpeedSeconds());
      sendLoopConfigToPreview();
    });
  }

  if (artworkUpload) {
    artworkUpload.addEventListener("change", addArtworkFromInput);
  }

  if (loopVisualization) {
    loopVisualization.addEventListener("dragover", (event) => {
      event.preventDefault();
      loopVisualization.classList.add("drag-over");
    });

    loopVisualization.addEventListener("dragleave", () => {
      loopVisualization.classList.remove("drag-over");
    });

    loopVisualization.addEventListener("drop", (event) => {
      event.preventDefault();
      loopVisualization.classList.remove("drag-over");
      if (!event.dataTransfer || !event.dataTransfer.files) {
        return;
      }
      addArtworkFiles(event.dataTransfer.files);
    });
  }

  billboardPreview.addEventListener("load", () => {
    sendLoopConfigToPreview();
  });
}

init();
