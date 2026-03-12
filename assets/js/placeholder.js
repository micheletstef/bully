const directoryPanel = document.getElementById("directoryPanel");
const billboardPreview = document.getElementById("billboardPreview");
const emptyState = document.getElementById("emptyState");
const speedControl = document.getElementById("speedControl");
const speedValue = document.getElementById("speedValue");
const padTBControl = document.getElementById("padTBControl");
const padLRControl = document.getElementById("padLRControl");
const bgColorControl = document.getElementById("bgColorControl");
const assetGapControl = document.getElementById("assetGapControl");
const rowCountControl = document.getElementById("rowCountControl");
const rowOffsetControl = document.getElementById("rowOffsetControl");
const reverseOddRowsControl = document.getElementById("reverseOddRowsControl");
const artworkUpload = document.getElementById("artworkUpload");
const loopPreviewTrack = document.getElementById("loopPreviewTrack");
const loopVisualization = document.getElementById("loopVisualization");
const loopActiveWindow = document.getElementById("loopActiveWindow");
const loopActiveWindowSecondary = document.getElementById("loopActiveWindowSecondary");
const loopElapsedTime = document.getElementById("loopElapsedTime");
const STORAGE_KEYS = {
  speed: "billboard.loopSpeedSeconds",
  padTB: "billboard.loopPadTopBottom",
  padLR: "billboard.loopPadLeftRight",
  bgColor: "billboard.loopBackgroundColor",
  assetGap: "billboard.loopAssetGap",
  rowCount: "billboard.loopRowCount",
  rowOffset: "billboard.loopRowOffset",
  reverseOddRows: "billboard.loopReverseOddRows",
  direction: "billboard.selectedDirection",
  artworks: "billboard.loopArtworks"
};
const DEFAULT_ARTWORKS = [createArtworkItem("assets/linear-loop-strip.png", "linear-loop-strip.png")];
let loopArtworks = [...DEFAULT_ARTWORKS];
let draggingArtworkIndex = null;
let pdfJsModulePromise = null;
let loopPlaybackProgress = 0;
let loopPlaybackViewportRatio = 0.25;
let sortableModulePromise = null;
let loopPreviewSortable = null;
let latestPointer = { x: null, y: null };
let loopElapsedSeconds = 0;
let loopDurationSeconds = 16;
let loopStageHeight = 1;
let loopAssetGap = 0;
let loopPadTopBottom = 0;
let loopPadLeftRight = 0;

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

function generateArtworkId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `art-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function createArtworkItem(src, name) {
  return {
    id: generateArtworkId(),
    src,
    name: name || artworkFileName(src)
  };
}

function artworkFileName(path) {
  const clean = String(path).split("?")[0].split("#")[0];
  const parts = clean.split("/");
  return parts[parts.length - 1] || clean;
}

function normalizeArtworkItem(item) {
  if (typeof item === "string") {
    return createArtworkItem(item, artworkFileName(item));
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
  return {
    id: typeof item.id === "string" && item.id.trim() ? item.id.trim() : generateArtworkId(),
    src,
    name
  };
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

function serializeSvgToDataUrl(svgElement) {
  const xml = new XMLSerializer().serializeToString(svgElement);
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
}

function trimSvgElement(svgElement) {
  const sandbox = document.createElement("div");
  sandbox.style.position = "fixed";
  sandbox.style.left = "-99999px";
  sandbox.style.top = "-99999px";
  sandbox.style.visibility = "hidden";
  sandbox.style.pointerEvents = "none";

  const clone = svgElement.cloneNode(true);
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.style.overflow = "visible";
  sandbox.appendChild(clone);
  document.body.appendChild(sandbox);

  try {
    const bbox = clone.getBBox();
    if (!Number.isFinite(bbox.width) || !Number.isFinite(bbox.height) || bbox.width <= 0 || bbox.height <= 0) {
      return clone;
    }

    clone.setAttribute("viewBox", `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
    clone.removeAttribute("width");
    clone.removeAttribute("height");
    clone.setAttribute("preserveAspectRatio", "xMidYMid meet");
    return clone;
  } finally {
    document.body.removeChild(sandbox);
  }
}

async function trimSvgFileToDataUrl(file) {
  const text = await file.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "image/svg+xml");
  const svgElement = doc.querySelector("svg");
  if (!svgElement) {
    throw new Error("Invalid SVG");
  }

  const trimmed = trimSvgElement(svgElement);
  return serializeSvgToDataUrl(trimmed);
}

async function getPdfJsModule() {
  if (!pdfJsModulePromise) {
    pdfJsModulePromise = import("https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.mjs");
  }
  return pdfJsModulePromise;
}

async function getSortableModule() {
  if (!sortableModulePromise) {
    sortableModulePromise = import("https://cdn.jsdelivr.net/npm/sortablejs@1.15.6/+esm");
  }
  return sortableModulePromise;
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
  if (extension === "svg") {
    return trimSvgFileToDataUrl(file);
  }
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
      loopArtworks.push(createArtworkItem(src, file.name || "upload"));
    } catch (error) {
      // Ignore single-file failures and continue with others.
    }
  }

  saveArtworks(loopArtworks);
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

function currentPadTopBottom() {
  if (!padTBControl) {
    return 0;
  }
  return Number(padTBControl.value) || 0;
}

function currentPadLeftRight() {
  if (!padLRControl) {
    return 0;
  }
  return Number(padLRControl.value) || 0;
}

function currentBackgroundColor() {
  if (!bgColorControl) {
    return "#fff8a5";
  }
  return bgColorControl.value || "#fff8a5";
}

function currentAssetGap() {
  if (!assetGapControl) {
    return 0;
  }
  return Number(assetGapControl.value) || 0;
}

function currentRowCount() {
  if (!rowCountControl) {
    return 1;
  }
  const parsed = Number(rowCountControl.value);
  return Number.isFinite(parsed) ? Math.max(1, Math.round(parsed)) : 1;
}

function currentRowOffset() {
  if (!rowOffsetControl) {
    return 0;
  }
  const parsed = Number(rowOffsetControl.value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function currentReverseOddRows() {
  if (!reverseOddRowsControl) {
    return false;
  }
  return !!reverseOddRowsControl.checked;
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

function savePadTopBottom(value) {
  writeStorage(STORAGE_KEYS.padTB, String(value));
}

function savePadLeftRight(value) {
  writeStorage(STORAGE_KEYS.padLR, String(value));
}

function saveBackgroundColor(value) {
  writeStorage(STORAGE_KEYS.bgColor, value);
}

function saveAssetGap(value) {
  writeStorage(STORAGE_KEYS.assetGap, String(value));
}

function saveRowCount(value) {
  writeStorage(STORAGE_KEYS.rowCount, String(value));
}

function saveRowOffset(value) {
  writeStorage(STORAGE_KEYS.rowOffset, String(value));
}

function saveReverseOddRows(value) {
  writeStorage(STORAGE_KEYS.reverseOddRows, value ? "1" : "0");
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

function restoreLoopLayoutSettings() {
  if (padTBControl) {
    const raw = readStorage(STORAGE_KEYS.padTB);
    if (raw !== null) {
      const parsed = Number(raw);
      if (Number.isFinite(parsed)) {
        const min = Number(padTBControl.min || 0);
        const max = Number(padTBControl.max || 9999);
        padTBControl.value = String(Math.min(max, Math.max(min, parsed)));
      }
    }
  }

  if (padLRControl) {
    const raw = readStorage(STORAGE_KEYS.padLR);
    if (raw !== null) {
      const parsed = Number(raw);
      if (Number.isFinite(parsed)) {
        const min = Number(padLRControl.min || 0);
        const max = Number(padLRControl.max || 9999);
        padLRControl.value = String(Math.min(max, Math.max(min, parsed)));
      }
    }
  }

  if (bgColorControl) {
    const raw = readStorage(STORAGE_KEYS.bgColor);
    if (raw && /^#[0-9a-f]{6}$/i.test(raw)) {
      bgColorControl.value = raw;
    }
  }

  if (assetGapControl) {
    const raw = readStorage(STORAGE_KEYS.assetGap);
    if (raw !== null) {
      const parsed = Number(raw);
      if (Number.isFinite(parsed)) {
        const min = Number(assetGapControl.min || 0);
        const max = Number(assetGapControl.max || 9999);
        assetGapControl.value = String(Math.min(max, Math.max(min, parsed)));
      }
    }
  }

  if (rowCountControl) {
    const raw = readStorage(STORAGE_KEYS.rowCount);
    if (raw !== null) {
      const parsed = Number(raw);
      if (Number.isFinite(parsed)) {
        const min = Number(rowCountControl.min || 1);
        const max = Number(rowCountControl.max || 12);
        rowCountControl.value = String(Math.min(max, Math.max(min, Math.round(parsed))));
      }
    }
  }

  if (rowOffsetControl) {
    const raw = readStorage(STORAGE_KEYS.rowOffset);
    if (raw !== null) {
      const parsed = Number(raw);
      if (Number.isFinite(parsed)) {
        const min = Number(rowOffsetControl.min || 0);
        const max = Number(rowOffsetControl.max || 6000);
        rowOffsetControl.value = String(Math.min(max, Math.max(min, parsed)));
      }
    }
  }

  if (reverseOddRowsControl) {
    const raw = readStorage(STORAGE_KEYS.reverseOddRows);
    reverseOddRowsControl.checked = raw === "1" || raw === "true";
  }
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
    artworks: loopArtworks.map((item) => item.src),
    padTopBottom: currentPadTopBottom(),
    padLeftRight: currentPadLeftRight(),
    backgroundColor: currentBackgroundColor(),
    assetGap: currentAssetGap(),
    rowCount: currentRowCount(),
    rowOffset: currentRowOffset(),
    reverseOddRows: currentReverseOddRows()
  };
  billboardPreview.contentWindow.postMessage(payload, "*");
  billboardPreview.contentWindow.postMessage({ type: "setLoopDuration", seconds }, "*");
}

function syncVisualizationBackground() {
  if (!loopVisualization) {
    return;
  }
  loopVisualization.style.background = currentBackgroundColor();
}

function syncVisualizationGapScaled() {
  if (!loopVisualization || !loopPreviewTrack) {
    return;
  }
  const previewHeight = Math.max(1, loopVisualization.clientHeight - 8);
  const sourceHeight = Math.max(1, loopStageHeight);
  const scaledGapRaw = (Math.max(0, loopAssetGap) * previewHeight) / sourceHeight;
  const scaledGap = Math.round(scaledGapRaw * 100) / 100;
  loopVisualization.style.setProperty("--preview-gap", `${scaledGap}px`);
  syncVisualizationGeometry();
}

function syncVisualizationPaddingScaled() {
  if (!loopVisualization || !loopPreviewTrack) {
    return;
  }
  const previewHeight = Math.max(1, loopVisualization.clientHeight - 8);
  const sourceHeight = Math.max(1, loopStageHeight);
  const scale = previewHeight / sourceHeight;
  const scaledPadTBRaw = Math.max(0, loopPadTopBottom) * scale;
  const scaledPadLRRaw = Math.max(0, loopPadLeftRight) * scale;
  const scaledPadTB = Math.round(scaledPadTBRaw * 100) / 100;
  const scaledPadLR = Math.round(scaledPadLRRaw * 100) / 100;
  loopVisualization.style.setProperty("--preview-pad-tb", `${scaledPadTB}px`);
  loopVisualization.style.setProperty("--preview-pad-lr", `${scaledPadLR}px`);
}

function syncVisualizationGeometry() {
  if (!loopVisualization || !loopPreviewTrack) {
    return;
  }
  const totalWidth = loopPreviewTrack.scrollWidth;
  if (!Number.isFinite(totalWidth) || totalWidth <= 0) {
    return;
  }
  const previewPadLR = Number.parseFloat(
    getComputedStyle(loopVisualization).getPropertyValue("--preview-pad-lr")
  );
  const horizontalPadding = 8 + (Number.isFinite(previewPadLR) ? previewPadLR * 2 : 0);
  loopVisualization.style.width = `${totalWidth + horizontalPadding}px`;
}

function renderLoopPreview() {
  if (!loopPreviewTrack) {
    return;
  }

  loopPreviewTrack.innerHTML = "";
  loopArtworks.forEach((item, index) => {
    const tile = document.createElement("div");
    tile.className = "loop-preview-item";
    tile.dataset.index = String(index);
    tile.dataset.artworkId = item.id;

    const image = document.createElement("img");
    image.src = item.src;
    image.alt = "";
    tile.appendChild(image);

    loopPreviewTrack.appendChild(tile);
  });

  initLoopSortable();
  syncVisualizationPaddingScaled();
  syncVisualizationGapScaled();
  syncVisualizationGeometry();
  updateActiveWindow();
}

function artworkLastFive(path) {
  const name = String(path || "");
  return name.slice(-5);
}

function reorderArtworksByIds(idOrder) {
  const byId = new Map(loopArtworks.map((item) => [item.id, item]));
  const reordered = idOrder.map((id) => byId.get(id)).filter((item) => item);
  if (reordered.length !== loopArtworks.length) {
    return;
  }
  loopArtworks = reordered;
  saveArtworks(loopArtworks);
  sendLoopConfigToPreview();
}

function pointerInsideVisualization(x, y) {
  if (!loopVisualization || !Number.isFinite(x) || !Number.isFinite(y)) {
    return true;
  }
  const rect = loopVisualization.getBoundingClientRect();
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

async function initLoopSortable() {
  if (!loopPreviewTrack || loopPreviewSortable) {
    return;
  }

  try {
    const mod = await getSortableModule();
    const Sortable = mod.default || mod.Sortable || mod;
    loopPreviewSortable = Sortable.create(loopPreviewTrack, {
      animation: 150,
      forceFallback: true,
      fallbackOnBody: true,
      ghostClass: "sortable-ghost",
      chosenClass: "sortable-chosen",
      dragClass: "sortable-drag",
      onStart: (evt) => {
        draggingArtworkIndex = evt.oldIndex;
      },
      onChange: () => {
        updateActiveWindow();
      },
      onEnd: (evt) => {
        const idOrder = [...loopPreviewTrack.querySelectorAll(".loop-preview-item")]
          .map((node) => node.dataset.artworkId)
          .filter((id) => !!id);
        reorderArtworksByIds(idOrder);

        const px =
          evt.originalEvent && Number.isFinite(evt.originalEvent.clientX)
            ? evt.originalEvent.clientX
            : latestPointer.x;
        const py =
          evt.originalEvent && Number.isFinite(evt.originalEvent.clientY)
            ? evt.originalEvent.clientY
            : latestPointer.y;

        if (!pointerInsideVisualization(px, py) && evt.item && evt.item.dataset.artworkId) {
          const removeIndex = loopArtworks.findIndex((item) => item.id === evt.item.dataset.artworkId);
          if (removeIndex >= 0) {
            removeArtwork(removeIndex);
          }
        }

        draggingArtworkIndex = null;
        renderLoopPreview();
      }
    });
  } catch (error) {
    // Keep basic preview if Sortable fails to load.
  }
}

function updateActiveWindow() {
  if (!loopActiveWindow || !loopPreviewTrack || !loopVisualization) {
    return;
  }

  const sequenceWidth = loopPreviewTrack.scrollWidth;
  if (!Number.isFinite(sequenceWidth) || sequenceWidth <= 0) {
    loopActiveWindow.style.display = "none";
    if (loopActiveWindowSecondary) {
      loopActiveWindowSecondary.style.display = "none";
    }
    if (loopElapsedTime) {
      loopElapsedTime.style.display = "none";
    }
    return;
  }

  const frameHeight = Math.max(1, loopVisualization.clientHeight);
  const billboardAspect = 5900 / 3480;
  const activeWidth = Math.max(16, frameHeight * billboardAspect);
  const normalizedProgress = ((loopPlaybackProgress % 1) + 1) % 1;
  const x = sequenceWidth * normalizedProgress;
  const baseX = loopPreviewTrack.offsetLeft - loopVisualization.scrollLeft;
  const mainWidth = Math.min(activeWidth, Math.max(0, sequenceWidth - x));
  const overflowWidth = Math.max(0, activeWidth - mainWidth);
  const drawX = baseX + x;

  if (mainWidth > 0) {
    loopActiveWindow.style.display = "block";
    loopActiveWindow.style.width = `${mainWidth}px`;
    loopActiveWindow.style.transform = `translateX(${drawX}px)`;
  } else {
    loopActiveWindow.style.display = "none";
  }

  if (loopActiveWindowSecondary) {
    if (overflowWidth > 0) {
      loopActiveWindowSecondary.style.display = "block";
      loopActiveWindowSecondary.style.width = `${overflowWidth}px`;
      loopActiveWindowSecondary.style.transform = `translateX(${baseX}px)`;
    } else {
      loopActiveWindowSecondary.style.display = "none";
    }
  }

  if (loopElapsedTime) {
    loopElapsedTime.style.display = "block";
    loopElapsedTime.textContent = `${loopElapsedSeconds.toFixed(1)}s / ${loopDurationSeconds.toFixed(1)}s`;
    let centerX = drawX + mainWidth / 2;
    if (mainWidth <= 0 && overflowWidth > 0) {
      centerX = baseX + overflowWidth / 2;
    }
    const clampedCenterX = Math.min(
      loopVisualization.clientWidth - 4,
      Math.max(4, centerX)
    );
    const editorRect = loopVisualization.getBoundingClientRect();
    const absoluteLeft = editorRect.left + clampedCenterX;
    const frameTop = editorRect.top;
    const absoluteTop = frameTop + frameHeight + 2;
    loopElapsedTime.style.left = `${absoluteLeft}px`;
    loopElapsedTime.style.top = `${absoluteTop}px`;
    loopElapsedTime.style.transform = "translateX(-50%)";
  }
}

function removeArtwork(index) {
  if (loopArtworks.length <= 1) {
    return;
  }
  loopArtworks.splice(index, 1);
  saveArtworks(loopArtworks);
  renderLoopPreview();
  sendLoopConfigToPreview();
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
  restoreLoopLayoutSettings();
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
  renderLoopPreview();

  if (speedControl) {
    speedControl.addEventListener("input", () => {
      syncSpeedReadout();
      saveSpeed(currentSpeedSeconds());
      sendLoopConfigToPreview();
    });
  }

  if (padTBControl) {
    padTBControl.addEventListener("input", () => {
      savePadTopBottom(currentPadTopBottom());
      loopPadTopBottom = currentPadTopBottom();
      syncVisualizationPaddingScaled();
      syncVisualizationGeometry();
      sendLoopConfigToPreview();
    });
  }

  if (padLRControl) {
    padLRControl.addEventListener("input", () => {
      savePadLeftRight(currentPadLeftRight());
      loopPadLeftRight = currentPadLeftRight();
      syncVisualizationPaddingScaled();
      syncVisualizationGeometry();
      sendLoopConfigToPreview();
    });
  }

  if (bgColorControl) {
    bgColorControl.addEventListener("input", () => {
      saveBackgroundColor(currentBackgroundColor());
      syncVisualizationBackground();
      sendLoopConfigToPreview();
    });
  }

  if (assetGapControl) {
    assetGapControl.addEventListener("input", () => {
      saveAssetGap(currentAssetGap());
      loopAssetGap = currentAssetGap();
      syncVisualizationGapScaled();
      sendLoopConfigToPreview();
    });
  }

  if (rowCountControl) {
    rowCountControl.addEventListener("input", () => {
      saveRowCount(currentRowCount());
      sendLoopConfigToPreview();
    });
  }

  if (rowOffsetControl) {
    rowOffsetControl.addEventListener("input", () => {
      saveRowOffset(currentRowOffset());
      sendLoopConfigToPreview();
    });
  }

  if (reverseOddRowsControl) {
    reverseOddRowsControl.addEventListener("change", () => {
      saveReverseOddRows(currentReverseOddRows());
      sendLoopConfigToPreview();
    });
  }

  if (artworkUpload) {
    artworkUpload.addEventListener("change", addArtworkFromInput);
  }

  if (loopVisualization) {
    loopVisualization.addEventListener("pointermove", (event) => {
      latestPointer = { x: event.clientX, y: event.clientY };
    });

    loopVisualization.addEventListener("dragover", (event) => {
      event.preventDefault();
      latestPointer = { x: event.clientX, y: event.clientY };
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

  window.addEventListener("message", (event) => {
    if (event.source !== billboardPreview.contentWindow) {
      return;
    }
    const payload = event.data;
    if (!payload || payload.type !== "loopPlayback") {
      return;
    }

    const progress = Number(payload.progress);
    const viewportRatio = Number(payload.viewportRatio);
    const elapsedSeconds = Number(payload.elapsedSeconds);
    const durationSeconds = Number(payload.durationSeconds);
    const stageHeight = Number(payload.stageHeight);
    const assetGap = Number(payload.assetGap);

    if (Number.isFinite(progress)) {
      loopPlaybackProgress = progress;
    }
    if (Number.isFinite(viewportRatio)) {
      loopPlaybackViewportRatio = viewportRatio;
    }
    if (Number.isFinite(elapsedSeconds)) {
      loopElapsedSeconds = elapsedSeconds;
    }
    if (Number.isFinite(durationSeconds) && durationSeconds > 0) {
      loopDurationSeconds = durationSeconds;
    }
    if (Number.isFinite(stageHeight) && stageHeight > 0) {
      loopStageHeight = stageHeight;
    }
    if (Number.isFinite(assetGap) && assetGap >= 0) {
      loopAssetGap = assetGap;
    }
    loopPadTopBottom = currentPadTopBottom();
    loopPadLeftRight = currentPadLeftRight();
    syncVisualizationPaddingScaled();
    syncVisualizationGapScaled();
    updateActiveWindow();
  });

  billboardPreview.addEventListener("load", () => {
    loopActiveWindow.style.display = "none";
    if (loopActiveWindowSecondary) {
      loopActiveWindowSecondary.style.display = "none";
    }
    if (loopElapsedTime) {
      loopElapsedTime.style.display = "none";
    }
    sendLoopConfigToPreview();
  });

  syncVisualizationBackground();
  loopAssetGap = currentAssetGap();
  loopPadTopBottom = currentPadTopBottom();
  loopPadLeftRight = currentPadLeftRight();
  syncVisualizationPaddingScaled();
  syncVisualizationGapScaled();
}

init();
