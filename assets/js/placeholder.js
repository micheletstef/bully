const directoryPanel = document.getElementById("directoryPanel");
const billboardPreview = document.getElementById("billboardPreview");
const emptyState = document.getElementById("emptyState");
const speedControl = document.getElementById("speedControl");
const speedValue = document.getElementById("speedValue");
const padTBControl = document.getElementById("padTBControl");
const padLRControl = document.getElementById("padLRControl");
const bgColorControl = document.getElementById("bgColorControl");
const previewViewModeControl = document.getElementById("previewViewModeControl");
const openViewControlsButton = document.getElementById("openViewControlsButton");
const closeViewControlsButton = document.getElementById("closeViewControlsButton");
const viewControlsModal = document.getElementById("viewControlsModal");
const cameraYawControl = document.getElementById("cameraYawControl");
const cameraPitchControl = document.getElementById("cameraPitchControl");
const cameraPerspectiveControl = document.getElementById("cameraPerspectiveControl");
const cameraFitControl = document.getElementById("cameraFitControl");
const cameraDragSensitivityControl = document.getElementById("cameraDragSensitivityControl");
const cameraTextureQualityControl = document.getElementById("cameraTextureQualityControl");
const resetViewControlsButton = document.getElementById("resetViewControlsButton");
const assetGapControl = document.getElementById("assetGapControl");
const artworkOrientationControl = document.getElementById("artworkOrientationControl");
const linearOrientationRow = document.getElementById("linearOrientationRow");
const partitionOrientationRows = document.getElementById("partitionOrientationRows");
const partitionOrientationLeftControl = document.getElementById("partitionOrientationLeftControl");
const partitionOrientationCurveControl = document.getElementById("partitionOrientationCurveControl");
const partitionOrientationRightControl = document.getElementById("partitionOrientationRightControl");
const rowCountControl = document.getElementById("rowCountControl");
const rowOffsetControl = document.getElementById("rowOffsetControl");
const rowGapControl = document.getElementById("rowGapControl");
const saveVersionButton = document.getElementById("saveVersionButton");
const saveVersionStatus = document.getElementById("saveVersionStatus");
const settingsPanel = document.querySelector(".settings-panel");
const settingsTitle = document.getElementById("settingsTitle");
const appShell = document.querySelector(".app-shell");
const billboardPreview3d = document.getElementById("billboardPreview3d");
const billboard3dCanvas = document.getElementById("billboard3dCanvas");
const partitionEditors = document.getElementById("partitionEditors");
const partitionTrackLeft = document.getElementById("partitionTrackLeft");
const partitionTrackCurve = document.getElementById("partitionTrackCurve");
const partitionTrackRight = document.getElementById("partitionTrackRight");
let loopPreviewTrack = document.getElementById("loopPreviewTrack");
const loopVisualization = document.getElementById("loopVisualization");
const loopActiveWindow = document.getElementById("loopActiveWindow");
const loopActiveWindowSecondary = document.getElementById("loopActiveWindowSecondary");
const loopElapsedTime = document.getElementById("loopElapsedTime");
const STORAGE_KEYS = {
  speed: "billboard.loopSpeedSeconds",
  padTB: "billboard.loopPadTopBottom",
  padLR: "billboard.loopPadLeftRight",
  bgColor: "billboard.loopBackgroundColor",
  previewViewMode: "billboard.previewViewMode",
  assetGap: "billboard.loopAssetGap",
  artworkOrientation: "billboard.loopArtworkOrientation",
  partitionArtworkOrientations: "billboard.partitionArtworkOrientations",
  rowCount: "billboard.loopRowCount",
  rowOffset: "billboard.loopRowOffset",
  rowGap: "billboard.loopRowGap",
  cameraYaw: "billboard.preview3dCameraYaw",
  cameraPitch: "billboard.preview3dCameraPitch",
  cameraPerspective: "billboard.preview3dCameraPerspective",
  cameraFit: "billboard.preview3dCameraFit",
  cameraDragSensitivity: "billboard.preview3dCameraDragSensitivity",
  cameraTextureQuality: "billboard.preview3dTextureQuality",
  direction: "billboard.selectedDirection",
  artworks: "billboard.loopArtworks",
  partitionArtworks: "billboard.partitionArtworks"
};
const PARTITION_DIRECTION_NAME = "partitioned";
const PARTITION_KEYS = ["left", "curve", "right"];
const DEFAULT_ARTWORKS = [createArtworkItem("assets/linear-loop-strip.png", "linear-loop-strip.png")];
const DEFAULT_PARTITION_ARTWORKS = {
  left: [createArtworkItem("assets/linear-loop-strip.png", "linear-loop-strip.png")],
  curve: [createArtworkItem("assets/linear-loop-strip.png", "linear-loop-strip.png")],
  right: [createArtworkItem("assets/linear-loop-strip.png", "linear-loop-strip.png")]
};
let loopArtworks = [...DEFAULT_ARTWORKS];
let partitionArtworks = createDefaultPartitionArtworks();
let draggingArtworkIndex = null;
let pdfJsModulePromise = null;
let loopPlaybackProgress = 0;
let loopPlaybackViewportRatio = 0.25;
let sortableModulePromise = null;
let loopPreviewSortable = null;
let partitionSortables = {
  left: null,
  curve: null,
  right: null
};
let latestPointer = { x: null, y: null };
let loopElapsedSeconds = 0;
let loopDurationSeconds = 16;
let loopTraverseSeconds = 16;
let loopStageHeight = 1;
let loopAssetGap = 0;
let loopPadTopBottom = 0;
let loopPadLeftRight = 0;
let loopDistanceSource = 1;
let partitionViewportRatios = {
  left: 0.25,
  curve: 0.25,
  right: 0.25
};
let partitionLoopDistances = {
  left: 1,
  curve: 1,
  right: 1
};
const MIN_PREVIEW_TRACK_HEIGHT = 8;
const BILLBOARD_DESIGN_WIDTH = 5900;
const BILLBOARD_DESIGN_HEIGHT = 3480;
let loopRowGap = 0;
let knownDirections = [];
let sharedOutputs = [];
let activeSidebarKey = null;
let activeDirectionName = null;
let previewViewMode = "flat";
let preview3dSurface = null;
let preview3dRenderToken = 0;
const preview3dImageCache = new Map();
const preview3dCamera = {
  yaw: -0.78,
  pitch: 0.96,
  perspective: 1
};
const preview3dRenderSettings = {
  fit: 0.84,
  dragSensitivity: 1,
  textureQuality: 1.75
};
let preview3dDragState = null;

function getAppBasePath() {
  const path = window.location.pathname || "/";
  if (path.includes("/outputs/")) {
    return `${path.split("/outputs/")[0]}/`;
  }
  if (path.endsWith("/index.html")) {
    return path.slice(0, -"index.html".length);
  }
  return path.endsWith("/") ? path : `${path}/`;
}

function apiPath(relativePath) {
  const clean = String(relativePath || "").replace(/^\/+/, "");
  return `${getAppBasePath()}${clean}`;
}

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

function cloneArtworkItems(items) {
  return (Array.isArray(items) ? items : [])
    .map((item) => normalizeArtworkItem(item))
    .filter((item) => item !== null);
}

function createDefaultPartitionArtworks() {
  return {
    left: cloneArtworkItems(DEFAULT_PARTITION_ARTWORKS.left),
    curve: cloneArtworkItems(DEFAULT_PARTITION_ARTWORKS.curve),
    right: cloneArtworkItems(DEFAULT_PARTITION_ARTWORKS.right)
  };
}

function normalizePartitionKey(key) {
  const clean = String(key || "").toLowerCase();
  return PARTITION_KEYS.includes(clean) ? clean : null;
}

function isPartitionedDirection(name) {
  return String(name || "").toLowerCase() === PARTITION_DIRECTION_NAME;
}

function currentDirectionIsPartitioned() {
  return isPartitionedDirection(activeDirectionName || getCurrentDirectionName());
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

let supportsWebpDataUrl = null;

function canEncodeWebp() {
  if (supportsWebpDataUrl !== null) {
    return supportsWebpDataUrl;
  }
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    supportsWebpDataUrl = canvas.toDataURL("image/webp").startsWith("data:image/webp");
  } catch (error) {
    supportsWebpDataUrl = false;
  }
  return supportsWebpDataUrl;
}

function loadImageFromObjectUrl(objectUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to decode image"));
    image.src = objectUrl;
  });
}

async function rasterFileToDataUrl(file) {
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await loadImageFromObjectUrl(objectUrl);
    const sourceWidth = Math.max(1, image.naturalWidth || image.width || 1);
    const sourceHeight = Math.max(1, image.naturalHeight || image.height || 1);
    const maxSide = 2400;
    const scale = Math.min(1, maxSide / Math.max(sourceWidth, sourceHeight));
    const targetWidth = Math.max(1, Math.round(sourceWidth * scale));
    const targetHeight = Math.max(1, Math.round(sourceHeight * scale));

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const context = canvas.getContext("2d");
    if (!context) {
      return readFileAsDataUrl(file);
    }

    context.drawImage(image, 0, 0, targetWidth, targetHeight);

    if (canEncodeWebp()) {
      return canvas.toDataURL("image/webp", 0.92);
    }

    const extension = fileExtension(file.name);
    const outputMime = extension === "jpg" || extension === "jpeg" || extension === "jpt"
      ? "image/jpeg"
      : "image/png";
    return outputMime === "image/jpeg"
      ? canvas.toDataURL(outputMime, 0.92)
      : canvas.toDataURL(outputMime);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
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
  return rasterFileToDataUrl(file);
}

async function addArtworkFiles(files, partitionKey = null) {
  const validFiles = [...files].filter((file) => isSupportedArtworkFile(file));
  if (!validFiles.length) {
    return;
  }

  const normalizedPartitionKey = normalizePartitionKey(partitionKey);
  const shouldTargetPartition = normalizedPartitionKey && currentDirectionIsPartitioned();

  for (const file of validFiles) {
    try {
      const src = await processArtworkFile(file);
      const newItem = createArtworkItem(src, file.name || "upload");
      if (shouldTargetPartition) {
        partitionArtworks[normalizedPartitionKey].push(newItem);
      } else {
        loopArtworks.push(newItem);
      }
    } catch (error) {
      // Ignore single-file failures and continue with others.
    }
  }

  if (shouldTargetPartition) {
    savePartitionArtworks(partitionArtworks);
    renderPartitionEditors();
  } else {
    saveArtworks(loopArtworks);
    renderLoopPreview();
  }
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

function syncDirectionModeUI() {
  const partitioned = currentDirectionIsPartitioned();
  if (appShell) {
    appShell.classList.toggle("partitioned-mode", partitioned);
  }
  if (partitionEditors) {
    partitionEditors.style.display = partitioned ? "grid" : "none";
  }
  if (settingsTitle) {
    const base = activeDirectionName || "linear loop";
    settingsTitle.textContent = `${base} settings`;
  }
  if (linearOrientationRow) {
    linearOrientationRow.style.display = partitioned ? "none" : "";
  }
  if (partitionOrientationRows) {
    partitionOrientationRows.style.display = partitioned ? "" : "none";
  }
  if (partitioned) {
    if (loopActiveWindow) {
      loopActiveWindow.style.display = "none";
    }
    if (loopActiveWindowSecondary) {
      loopActiveWindowSecondary.style.display = "none";
    }
    if (loopElapsedTime) {
      loopElapsedTime.style.display = "none";
    }
    renderPartitionEditors();
    syncPartitionEditorVisuals();
  } else {
    renderLoopPreview();
  }
  render3dPreview();
}

function waitForPreviewImage(img) {
  return new Promise((resolve) => {
    if (!img || img.complete) {
      resolve();
      return;
    }
    img.addEventListener("load", resolve, { once: true });
    img.addEventListener("error", resolve, { once: true });
  });
}

function normalize3dArtworkSource(path) {
  const source = String(path || "").trim();
  if (!source) {
    return "";
  }
  if (/^(https?:|data:|blob:)/.test(source)) {
    return source;
  }
  return source;
}

function current3dOrientation() {
  if (currentDirectionIsPartitioned()) {
    const orientations = currentPartitionArtworkOrientations();
    return orientations.left === "vertical" ? "vertical" : "horizontal";
  }
  return currentArtworkOrientation();
}

function current3dSources() {
  if (!currentDirectionIsPartitioned()) {
    return loopArtworks.map((item) => normalize3dArtworkSource(item.src));
  }
  const merged = [...(partitionArtworks.left || []), ...(partitionArtworks.curve || []), ...(partitionArtworks.right || [])]
    .map((item) => normalize3dArtworkSource(item.src))
    .filter((src) => !!src);
  if (merged.length) {
    return merged;
  }
  return loopArtworks.map((item) => normalize3dArtworkSource(item.src));
}

function get3dCanvasContext() {
  if (!billboard3dCanvas) {
    return null;
  }
  return billboard3dCanvas.getContext("2d");
}

function ensure3dCanvasSize(ctx) {
  if (!billboard3dCanvas || !ctx) {
    return { width: 0, height: 0 };
  }
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const cssWidth = Math.max(1, billboard3dCanvas.clientWidth || 1);
  const cssHeight = Math.max(1, billboard3dCanvas.clientHeight || 1);
  const width = Math.max(1, Math.round(cssWidth * dpr));
  const height = Math.max(1, Math.round(cssHeight * dpr));
  if (billboard3dCanvas.width !== width || billboard3dCanvas.height !== height) {
    billboard3dCanvas.width = width;
    billboard3dCanvas.height = height;
  }
  return { width, height };
}

async function load3dImage(src) {
  if (!src) {
    return null;
  }
  if (preview3dImageCache.has(src)) {
    return preview3dImageCache.get(src);
  }
  const promise = new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
  preview3dImageCache.set(src, promise);
  return promise;
}

async function build3dSurfaceStrip(targetHeight) {
  const sources = current3dSources();
  const orientation = current3dOrientation();
  if (!sources.length) {
    return null;
  }
  const images = (await Promise.all(sources.map((src) => load3dImage(src)))).filter((img) => !!img);
  if (!images.length) {
    return null;
  }

  const padLRDesign = Math.max(0, Number(currentPadLeftRight()) || 0);
  const padTBDesign = Math.max(0, Math.min(BILLBOARD_DESIGN_HEIGHT / 2 - 1, Number(currentPadTopBottom()) || 0));
  const gapDesign = Math.max(0, Number(currentAssetGap()) || 0);
  const artworkHeightDesign = Math.max(1, BILLBOARD_DESIGN_HEIGHT - padTBDesign * 2);
  const scale = Math.max(0.08, targetHeight / BILLBOARD_DESIGN_HEIGHT);
  const stripHeight = Math.max(128, Math.round(BILLBOARD_DESIGN_HEIGHT * scale));
  const artworkHeightPx = Math.max(1, Math.round(artworkHeightDesign * scale));
  const padTBPx = Math.max(0, Math.round((stripHeight - artworkHeightPx) / 2));
  const padLRPx = Math.max(0, Math.round(padLRDesign * scale));
  const gapPx = Math.max(0, Math.round(gapDesign * scale));
  const widthsDesign = images.map((img) => {
    const sourceWidth = Math.max(1, img.naturalWidth || img.width || 1);
    const sourceHeight = Math.max(1, img.naturalHeight || img.height || 1);
    if (orientation === "vertical") {
      return Math.max(1, (sourceHeight / sourceWidth) * artworkHeightDesign);
    }
    return Math.max(1, (sourceWidth / sourceHeight) * artworkHeightDesign);
  });
  const widths = widthsDesign.map((width) => Math.max(1, Math.round(width * scale)));
  const sequenceWidth = Math.max(
    1,
    Math.round(padLRPx * 2 + widths.reduce((sum, value) => sum + value, 0) + Math.max(0, images.length - 1) * gapPx)
  );
  const stripCanvas = document.createElement("canvas");
  stripCanvas.width = sequenceWidth * 2;
  stripCanvas.height = stripHeight;
  const stripCtx = stripCanvas.getContext("2d");
  if (!stripCtx) {
    return null;
  }
  stripCtx.imageSmoothingEnabled = true;
  stripCtx.imageSmoothingQuality = "high";

  const drawSequence = (startX) => {
    let cursor = startX + padLRPx;
    images.forEach((img, idx) => {
      const drawWidth = widths[idx];
      if (orientation === "vertical") {
        stripCtx.save();
        stripCtx.translate(cursor + drawWidth / 2, padTBPx + artworkHeightPx / 2);
        stripCtx.rotate(-Math.PI / 2);
        stripCtx.drawImage(img, -artworkHeightPx / 2, -drawWidth / 2, artworkHeightPx, drawWidth);
        stripCtx.restore();
      } else {
        stripCtx.drawImage(img, cursor, padTBPx, drawWidth, artworkHeightPx);
      }
      cursor += drawWidth;
      if (idx < images.length - 1) {
        cursor += gapPx;
      }
    });
  };
  drawSequence(0);
  drawSequence(sequenceWidth);

  return { canvas: stripCanvas, sequenceWidth, stripHeight };
}

function buildTopViewSpine() {
  const leftLength = 1820;
  const curveLength = 1020;
  const rightLength = 3060;
  const totalLength = leftLength + curveLength + rightLength;
  const radius = curveLength / (Math.PI / 2);
  const points = [];
  const leftSamples = 80;
  const curveSamples = 72;
  const rightSamples = 120;

  for (let i = 0; i <= leftSamples; i += 1) {
    const t = i / leftSamples;
    points.push({
      x: leftLength * t,
      y: 0,
      s: leftLength * t
    });
  }

  const cx = leftLength;
  const cy = -radius;
  for (let i = 1; i <= curveSamples; i += 1) {
    const t = i / curveSamples;
    const theta = Math.PI / 2 + (0 - Math.PI / 2) * t;
    points.push({
      x: cx + radius * Math.cos(theta),
      y: cy + radius * Math.sin(theta),
      s: leftLength + curveLength * t
    });
  }

  const endX = leftLength + radius;
  const endY = -radius;
  for (let i = 1; i <= rightSamples; i += 1) {
    const t = i / rightSamples;
    points.push({
      x: endX,
      y: endY - rightLength * t,
      s: leftLength + curveLength + rightLength * t
    });
  }

  return { points, totalLength };
}

function projectBillboardVertex(x, y, z) {
  const cosYaw = Math.cos(preview3dCamera.yaw);
  const sinYaw = Math.sin(preview3dCamera.yaw);
  const cosPitch = Math.cos(preview3dCamera.pitch);
  const sinPitch = Math.sin(preview3dCamera.pitch);

  const x1 = x * cosYaw - y * sinYaw;
  const y1 = x * sinYaw + y * cosYaw;
  const z1 = z;

  const y2 = y1 * cosPitch - z1 * sinPitch;
  const z2 = y1 * sinPitch + z1 * cosPitch;

  const cameraDepth = 6400;
  const focal = 4600 * preview3dCamera.perspective;
  const denom = Math.max(320, cameraDepth + y2);
  const perspective = focal / denom;

  return {
    x: x1 * perspective,
    y: -z2 * perspective,
    depth: y2
  };
}

function clampPreview3dCamera() {
  preview3dCamera.pitch = Math.min(1.45, Math.max(-0.55, preview3dCamera.pitch));
  preview3dCamera.perspective = Math.min(2.5, Math.max(0.35, preview3dCamera.perspective));
  preview3dRenderSettings.fit = Math.min(0.98, Math.max(0.55, preview3dRenderSettings.fit));
  preview3dRenderSettings.dragSensitivity = Math.min(2.6, Math.max(0.4, preview3dRenderSettings.dragSensitivity));
  preview3dRenderSettings.textureQuality = Math.min(3, Math.max(1, preview3dRenderSettings.textureQuality));
}

function syncViewControlsUI() {
  if (cameraYawControl) {
    cameraYawControl.value = String(preview3dCamera.yaw);
  }
  if (cameraPitchControl) {
    cameraPitchControl.value = String(preview3dCamera.pitch);
  }
  if (cameraPerspectiveControl) {
    cameraPerspectiveControl.value = String(preview3dCamera.perspective);
  }
  if (cameraFitControl) {
    cameraFitControl.value = String(preview3dRenderSettings.fit);
  }
  if (cameraDragSensitivityControl) {
    cameraDragSensitivityControl.value = String(preview3dRenderSettings.dragSensitivity);
  }
  if (cameraTextureQualityControl) {
    cameraTextureQualityControl.value = String(preview3dRenderSettings.textureQuality);
  }
  if (previewViewModeControl) {
    previewViewModeControl.value = previewViewMode;
  }
}

function persistPreview3dSettings() {
  writeStorage(STORAGE_KEYS.cameraYaw, String(preview3dCamera.yaw));
  writeStorage(STORAGE_KEYS.cameraPitch, String(preview3dCamera.pitch));
  writeStorage(STORAGE_KEYS.cameraPerspective, String(preview3dCamera.perspective));
  writeStorage(STORAGE_KEYS.cameraFit, String(preview3dRenderSettings.fit));
  writeStorage(STORAGE_KEYS.cameraDragSensitivity, String(preview3dRenderSettings.dragSensitivity));
  writeStorage(STORAGE_KEYS.cameraTextureQuality, String(preview3dRenderSettings.textureQuality));
}

function restorePreview3dSettings() {
  preview3dCamera.yaw = readStoredNumber(STORAGE_KEYS.cameraYaw, preview3dCamera.yaw);
  preview3dCamera.pitch = readStoredNumber(STORAGE_KEYS.cameraPitch, preview3dCamera.pitch);
  preview3dCamera.perspective = readStoredNumber(STORAGE_KEYS.cameraPerspective, preview3dCamera.perspective);
  preview3dRenderSettings.fit = readStoredNumber(STORAGE_KEYS.cameraFit, preview3dRenderSettings.fit);
  preview3dRenderSettings.dragSensitivity = readStoredNumber(
    STORAGE_KEYS.cameraDragSensitivity,
    preview3dRenderSettings.dragSensitivity
  );
  preview3dRenderSettings.textureQuality = readStoredNumber(
    STORAGE_KEYS.cameraTextureQuality,
    preview3dRenderSettings.textureQuality
  );
  clampPreview3dCamera();
}

function setViewControlsOpen(isOpen) {
  if (!viewControlsModal) {
    return;
  }
  viewControlsModal.hidden = !isOpen;
}

function setupViewControlsModal() {
  if (!viewControlsModal) {
    return;
  }
  if (openViewControlsButton) {
    openViewControlsButton.addEventListener("click", () => {
      syncViewControlsUI();
      setViewControlsOpen(true);
    });
  }
  if (closeViewControlsButton) {
    closeViewControlsButton.addEventListener("click", () => {
      setViewControlsOpen(false);
    });
  }
  viewControlsModal.addEventListener("click", (event) => {
    if (event.target === viewControlsModal) {
      setViewControlsOpen(false);
    }
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && viewControlsModal && !viewControlsModal.hidden) {
      setViewControlsOpen(false);
    }
  });
}

function clear3dDragState() {
  preview3dDragState = null;
  if (billboard3dCanvas) {
    billboard3dCanvas.style.cursor = "grab";
  }
  persistPreview3dSettings();
}

function apply3dDrag(clientX, clientY) {
  if (!preview3dDragState) {
    return;
  }
  const dx = clientX - preview3dDragState.lastX;
  const dy = clientY - preview3dDragState.lastY;
  preview3dDragState.lastX = clientX;
  preview3dDragState.lastY = clientY;

  if (preview3dDragState.adjustPerspective) {
    preview3dCamera.perspective += (-dy + dx * 0.35) * 0.003 * preview3dRenderSettings.dragSensitivity;
  } else {
    preview3dCamera.yaw += dx * 0.005 * preview3dRenderSettings.dragSensitivity;
    preview3dCamera.pitch -= dy * 0.004 * preview3dRenderSettings.dragSensitivity;
  }
  clampPreview3dCamera();
  syncViewControlsUI();
  if (previewViewMode === "3d") {
    draw3dFrame();
  }
}

function setup3dCanvasInteraction() {
  if (!billboard3dCanvas) {
    return;
  }
  billboard3dCanvas.style.cursor = "grab";
  billboard3dCanvas.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });
  billboard3dCanvas.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 && event.button !== 2) {
      return;
    }
    preview3dDragState = {
      lastX: event.clientX,
      lastY: event.clientY,
      adjustPerspective: event.button === 2 || event.shiftKey
    };
    billboard3dCanvas.style.cursor = "grabbing";
    try {
      billboard3dCanvas.setPointerCapture(event.pointerId);
    } catch (error) {
      // Ignore capture failures.
    }
    event.preventDefault();
  });
  billboard3dCanvas.addEventListener("pointermove", (event) => {
    apply3dDrag(event.clientX, event.clientY);
  });
  billboard3dCanvas.addEventListener("pointerup", () => {
    clear3dDragState();
  });
  billboard3dCanvas.addEventListener("pointercancel", () => {
    clear3dDragState();
  });
  billboard3dCanvas.addEventListener("pointerleave", () => {
    clear3dDragState();
  });
}

function draw3dFrame() {
  const ctx = get3dCanvasContext();
  if (!ctx || !preview3dSurface) {
    return;
  }
  const { width, height } = ensure3dCanvasSize(ctx);
  if (!width || !height) {
    return;
  }
  ctx.clearRect(0, 0, width, height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  const halfWidth = BILLBOARD_DESIGN_WIDTH / 2;
  const planeY = 0;
  const topLeftRaw = projectBillboardVertex(-halfWidth, planeY, 0);
  const topRightRaw = projectBillboardVertex(halfWidth, planeY, 0);
  const bottomRightRaw = projectBillboardVertex(halfWidth, planeY, -BILLBOARD_DESIGN_HEIGHT);
  const bottomLeftRaw = projectBillboardVertex(-halfWidth, planeY, -BILLBOARD_DESIGN_HEIGHT);

  const rawPoints = [topLeftRaw, topRightRaw, bottomRightRaw, bottomLeftRaw];
  const bounds = { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity };
  rawPoints.forEach((point) => {
    bounds.minX = Math.min(bounds.minX, point.x);
    bounds.maxX = Math.max(bounds.maxX, point.x);
    bounds.minY = Math.min(bounds.minY, point.y);
    bounds.maxY = Math.max(bounds.maxY, point.y);
  });

  const projectedWidth = Math.max(1, bounds.maxX - bounds.minX);
  const projectedHeight = Math.max(1, bounds.maxY - bounds.minY);
  const fit = preview3dRenderSettings.fit;
  const fitScale = Math.min((width * fit) / projectedWidth, (height * fit) / projectedHeight);
  const offsetX = (width - projectedWidth * fitScale) / 2 - bounds.minX * fitScale;
  const offsetY = (height - projectedHeight * fitScale) / 2 - bounds.minY * fitScale;

  const p0 = { x: topLeftRaw.x * fitScale + offsetX, y: topLeftRaw.y * fitScale + offsetY };
  const p1 = { x: topRightRaw.x * fitScale + offsetX, y: topRightRaw.y * fitScale + offsetY };
  const p2 = { x: bottomRightRaw.x * fitScale + offsetX, y: bottomRightRaw.y * fitScale + offsetY };
  const p3 = { x: bottomLeftRaw.x * fitScale + offsetX, y: bottomLeftRaw.y * fitScale + offsetY };

  const progress = ((Number(loopPlaybackProgress) % 1) + 1) % 1;
  const baseOffset = progress * preview3dSurface.sequenceWidth;
  const strip = preview3dSurface.canvas;
  const stripHeight = preview3dSurface.stripHeight;
  const sequenceWidth = preview3dSurface.sequenceWidth;
  const sx = ((baseOffset % sequenceWidth) + sequenceWidth) % sequenceWidth;
  const sw = sequenceWidth;
  const dw = Math.max(1, Math.hypot(p1.x - p0.x, p1.y - p0.y));
  const dh = Math.max(1, Math.hypot(p3.x - p0.x, p3.y - p0.y));

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);
  ctx.lineTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.lineTo(p3.x, p3.y);
  ctx.closePath();
  ctx.clip();
  ctx.setTransform(
    (p1.x - p0.x) / dw,
    (p1.y - p0.y) / dw,
    (p3.x - p0.x) / dh,
    (p3.y - p0.y) / dh,
    p0.x,
    p0.y
  );
  ctx.drawImage(strip, sx, 0, sw, stripHeight, 0, 0, dw, dh);
  ctx.restore();
}

function update3dPreviewAnimation() {
  draw3dFrame();
}

async function render3dPreview() {
  if (!billboardPreview3d || !billboard3dCanvas) {
    return;
  }
  const ctx = get3dCanvasContext();
  if (!ctx) {
    return;
  }
  const size = ensure3dCanvasSize(ctx);
  const token = ++preview3dRenderToken;
  const targetHeight = Math.min(
    3200,
    Math.max(520, Math.round(size.height * 0.94 * preview3dRenderSettings.textureQuality))
  );
  const surface = await build3dSurfaceStrip(targetHeight);
  if (token !== preview3dRenderToken) {
    return;
  }
  preview3dSurface = surface;
  if (!preview3dSurface) {
    ctx.clearRect(0, 0, size.width, size.height);
    return;
  }
  draw3dFrame();
}

function applyPreviewViewMode(mode) {
  previewViewMode = normalizePreviewViewMode(mode);
  if (previewViewModeControl && previewViewModeControl.value !== previewViewMode) {
    previewViewModeControl.value = previewViewMode;
  }
  if (appShell) {
    appShell.classList.toggle("preview-3d-mode", previewViewMode === "3d");
  }
  if (billboardPreview3d) {
    billboardPreview3d.setAttribute("aria-hidden", previewViewMode === "3d" ? "false" : "true");
  }
  if (previewViewMode === "3d") {
    render3dPreview();
  }
  syncViewControlsUI();
}

function loadDirection(path, directionName = null) {
  activeDirectionName = directionName || null;
  billboardPreview.removeAttribute("srcdoc");
  billboardPreview.src = path;
  billboardPreview.style.display = "block";
  emptyState.style.display = "none";
  setSettingsPanelVisibility(true);
  syncDirectionModeUI();
  applyPreviewViewMode(previewViewMode);
}

function loadOutputSnapshot(snapshot) {
  if (!snapshot) {
    return;
  }
  const rawHtml = typeof snapshot.html === "string" ? snapshot.html : "";
  const hasConfig = snapshot.config && typeof snapshot.config === "object";
  const normalizedConfig = hasConfig
    ? coerceSnapshotLoopConfig(snapshot.config)
    : extractLoopConfigFromSnapshotHtml(rawHtml);
  const renderedHtml = normalizedConfig ? buildSnapshotHtml(normalizedConfig) : rawHtml;
  if (!renderedHtml.trim()) {
    return;
  }
  billboardPreview.removeAttribute("src");
  billboardPreview.srcdoc = renderedHtml;
  billboardPreview.style.display = "block";
  emptyState.style.display = "none";
  activeDirectionName =
    snapshot && typeof snapshot.directionName === "string" && snapshot.directionName.trim()
      ? snapshot.directionName.trim()
      : normalizedConfig && normalizedConfig.directionMode === "partitioned"
        ? "partitioned"
        : "linear loop";
  syncDirectionModeUI();
  setSettingsPanelVisibility(false);
  applyPreviewViewMode(previewViewMode);
}

function setActiveDirection(button) {
  const allButtons = directoryPanel.querySelectorAll(".direction-item");
  allButtons.forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
}

function setActiveSidebarItem(button, key) {
  setActiveDirection(button);
  activeSidebarKey = key;
  setSettingsPanelVisibility(!String(key || "").startsWith("output:"));
}

function setSettingsPanelVisibility(isVisible) {
  if (!settingsPanel) {
    return;
  }
  settingsPanel.style.display = isVisible ? "" : "none";
  settingsPanel.setAttribute("aria-hidden", isVisible ? "false" : "true");
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

function normalizeArtworkOrientation(value) {
  return String(value || "").toLowerCase() === "vertical" ? "vertical" : "horizontal";
}

function rotationToOrientation(value) {
  const rotation = Number(value);
  if (!Number.isFinite(rotation)) {
    return "horizontal";
  }
  const normalized = ((rotation % 360) + 360) % 360;
  return normalized === 90 || normalized === 270 ? "vertical" : "horizontal";
}

function currentArtworkOrientation() {
  if (!artworkOrientationControl) {
    return "horizontal";
  }
  return normalizeArtworkOrientation(artworkOrientationControl.value);
}

function currentPartitionArtworkOrientations() {
  return {
    left: normalizeArtworkOrientation(
      partitionOrientationLeftControl ? partitionOrientationLeftControl.value : "horizontal"
    ),
    curve: normalizeArtworkOrientation(
      partitionOrientationCurveControl ? partitionOrientationCurveControl.value : "horizontal"
    ),
    right: normalizeArtworkOrientation(
      partitionOrientationRightControl ? partitionOrientationRightControl.value : "horizontal"
    )
  };
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

function currentRowGap() {
  if (!rowGapControl) {
    return 0;
  }
  const parsed = Number(rowGapControl.value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function normalizePreviewViewMode(value) {
  return String(value || "").toLowerCase() === "3d" ? "3d" : "flat";
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

function readStoredNumber(key, fallback) {
  const raw = readStorage(key);
  if (raw === null || raw === "") {
    return fallback;
  }
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatTimestampForName(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

function getCurrentDirectionName() {
  if (activeDirectionName) {
    return activeDirectionName;
  }
  const activeButton = directoryPanel.querySelector(".direction-item.active");
  if (activeButton && activeButton.dataset.directionName) {
    return activeButton.dataset.directionName;
  }
  return restoreSelectedDirection() || "linear loop";
}

function getCurrentLoopConfig() {
  const config = {
    seconds: currentSpeedSeconds(),
    padTopBottom: currentPadTopBottom(),
    padLeftRight: currentPadLeftRight(),
    backgroundColor: currentBackgroundColor(),
    assetGap: currentAssetGap(),
    artworkOrientation: currentArtworkOrientation(),
    rowCount: currentRowCount(),
    rowOffset: currentRowOffset(),
    rowGap: currentRowGap(),
    directionMode: currentDirectionIsPartitioned() ? "partitioned" : "linear"
  };

  if (currentDirectionIsPartitioned()) {
    config.artworksByPartition = {
      left: (partitionArtworks.left || []).map((item) => item.src),
      curve: (partitionArtworks.curve || []).map((item) => item.src),
      right: (partitionArtworks.right || []).map((item) => item.src)
    };
    config.artworkOrientations = currentPartitionArtworkOrientations();
  } else {
    config.artworks = loopArtworks.map((item) => item.src);
  }
  return config;
}

function escapeJsonForScript(value) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

function buildSnapshotHtml(config) {
  if (config && (config.directionMode === "partitioned" || config.artworksByPartition)) {
    return buildPartitionedSnapshotHtml(config);
  }
  const safeState = escapeJsonForScript(config);
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>saved output</title>
    <style>
      :root {
        --loop-duration: 16s;
        --loop-distance: 1024px;
        --loop-pad-tb: 0px;
        --loop-pad-lr: 0px;
        --loop-bg: #fff8a5;
        --loop-gap: 0px;
        --loop-row-gap: 0px;
      }

      html,
      body {
        height: 100%;
        margin: 0;
      }

      body,
      .canvas {
        background: var(--loop-bg);
      }

      .canvas {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      .loop-stage {
        position: absolute;
        top: var(--loop-pad-tb);
        bottom: var(--loop-pad-tb);
        left: 0;
        right: 0;
        overflow: hidden;
      }

      .loop-fill {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        gap: var(--loop-row-gap);
        height: 100%;
        overflow: hidden;
      }

      .loop-row {
        flex: 1 1 0;
        min-height: 0;
        overflow: hidden;
      }

      .loop-row-track {
        display: flex;
        gap: var(--loop-gap);
        width: max-content;
        height: 100%;
        animation: loop-x var(--loop-duration) linear infinite;
        animation-delay: var(--loop-row-delay, 0s);
        animation-direction: var(--loop-row-direction, normal);
        opacity: 0.98;
      }

      .loop-row-track.vertical-scroll {
        transform-origin: top left;
      }

      @keyframes loop-x {
        from {
          transform: translateX(0);
        }
        to {
          transform: translateX(calc(-1 * var(--loop-distance)));
        }
      }

      @keyframes loop-y {
        from {
          transform: rotate(-90deg) translateX(calc(-1 * var(--loop-distance)));
        }
        to {
          transform: rotate(-90deg) translateX(0);
        }
      }

      .loop-artwork {
        height: 100%;
        width: auto;
        flex: 0 0 auto;
      }

      .loop-artwork.vertical {
        transform: none;
      }

      .loop-spacer {
        height: 100%;
        flex: 0 0 auto;
      }
    </style>
  </head>
  <body>
    <div class="canvas">
      <div id="loopStage" class="loop-stage">
        <div id="loopFill" class="loop-fill"></div>
      </div>
    </div>
    <script>
      const loopFill = document.getElementById("loopFill");
      const loopStage = document.getElementById("loopStage");
      const state = ${safeState};
      let playbackTimer = null;
      let primaryTrack = null;

      function normalizeArtworkSource(path) {
        const source = String(path || "").trim();
        if (!source) {
          return "";
        }
        if (/^(https?:|data:|blob:)/.test(source)) {
          return source;
        }
        const assetsIndex = source.indexOf("assets/");
        if (assetsIndex >= 0) {
          return source.slice(assetsIndex);
        }
        return source;
      }

      function waitForImage(img) {
        return new Promise((resolve) => {
          if (img.complete) {
            resolve();
            return;
          }
          img.addEventListener("load", resolve, { once: true });
          img.addEventListener("error", resolve, { once: true });
        });
      }

      async function renderLoop() {
        loopFill.innerHTML = "";
        primaryTrack = null;
        const sources = state.artworks.length
          ? state.artworks.map(normalizeArtworkSource)
          : ["assets/linear-loop-strip.png"];
        const rowCount = Math.max(1, Math.round(Number(state.rowCount) || 1));
        const sidePadding = Math.max(0, Number(state.padLeftRight) || 0);
        const rows = [];
        const allImages = [];
        let firstSequenceNodes = [];
        let firstSequenceStartNode = null;
        let secondSequenceStartNode = null;

        function appendSequence(track, collectNodes) {
          const nodes = [];
          let startNode = null;

          if (sidePadding > 0) {
            const spacerStart = document.createElement("div");
            spacerStart.className = "loop-spacer";
            spacerStart.style.width = sidePadding + "px";
            track.appendChild(spacerStart);
            nodes.push(spacerStart);
            startNode = spacerStart;
          }

          sources.forEach((src) => {
            const image = document.createElement("img");
            image.className = "loop-artwork";
            image.src = src;
            image.alt = "";
            track.appendChild(image);
            allImages.push(image);
            nodes.push(image);
            if (!startNode) {
              startNode = image;
            }
          });

          if (sidePadding > 0) {
            const spacerEnd = document.createElement("div");
            spacerEnd.className = "loop-spacer";
            spacerEnd.style.width = sidePadding + "px";
            track.appendChild(spacerEnd);
            nodes.push(spacerEnd);
          }

          if (collectNodes) {
            firstSequenceNodes = nodes;
            firstSequenceStartNode = startNode;
          }

          return startNode;
        }

        for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
          const row = document.createElement("div");
          row.className = "loop-row";
          const track = document.createElement("div");
          track.className = "loop-row-track";
          if (state.artworkOrientation === "vertical") {
            track.classList.add("vertical-scroll");
          }
          row.appendChild(track);
          loopFill.appendChild(row);
          rows.push(track);

          appendSequence(track, rowIndex === 0);
          const secondStart = appendSequence(track, false);
          if (rowIndex === 0) {
            secondSequenceStartNode = secondStart;
          }
        }

        await Promise.all(allImages.map(waitForImage));

        const verticalFlow = state.artworkOrientation === "vertical";

        const gapSize = Math.max(0, Number(state.assetGap) || 0);
        let loopDistance = 0;
        if (firstSequenceStartNode && secondSequenceStartNode) {
          const firstRect = firstSequenceStartNode.getBoundingClientRect();
          const secondRect = secondSequenceStartNode.getBoundingClientRect();
          loopDistance = secondRect.left - firstRect.left;
        }
        if (!Number.isFinite(loopDistance) || loopDistance <= 0) {
          loopDistance = firstSequenceNodes.reduce((sum, node) => sum + node.getBoundingClientRect().width, 0)
            + Math.max(0, firstSequenceNodes.length - 1) * gapSize;
        }
        const safeDistance = loopDistance > 0 ? loopDistance : 1;
        state.loopDistance = safeDistance;

        const offsetSecondsPerRow = ((Number(state.rowOffset) || 0) / safeDistance) * state.seconds;
        rows.forEach((track, rowIndex) => {
          const delay = -1 * offsetSecondsPerRow * rowIndex;
          track.style.setProperty("--loop-row-delay", delay + "s");
          track.style.animationName = verticalFlow ? "loop-y" : "loop-x";
          track.style.setProperty("--loop-row-direction", "normal");
        });
        primaryTrack = rows[0] || null;

        document.documentElement.style.setProperty("--loop-distance", safeDistance + "px");
        document.documentElement.style.setProperty("--loop-duration", state.seconds + "s");
        document.documentElement.style.setProperty("--loop-pad-tb", state.padTopBottom + "px");
        document.documentElement.style.setProperty("--loop-bg", state.backgroundColor);
        document.documentElement.style.setProperty("--loop-gap", gapSize + "px");
        document.documentElement.style.setProperty("--loop-row-gap", Math.max(0, Number(state.rowGap) || 0) + "px");
        emitPlayback();
      }

      function emitPlayback() {
        const durationMs = Math.max(1, Number(state.seconds) * 1000);
        const animationSource = primaryTrack || loopFill;
        const animation = animationSource.getAnimations()[0];
        let elapsedMs = 0;

        if (animation && Number.isFinite(animation.currentTime)) {
          const currentTime = Number(animation.currentTime);
          elapsedMs = ((currentTime % durationMs) + durationMs) % durationMs;
        } else {
          elapsedMs = performance.now() % durationMs;
        }

        const progress = elapsedMs / durationMs;
        const verticalFlow = state.artworkOrientation === "vertical";
        const viewportSize = loopStage
          ? verticalFlow
            ? loopStage.clientHeight
            : loopStage.clientWidth
          : 0;
        const stageHeight = loopStage ? loopStage.clientHeight : 0;
        const viewportRatio =
          state.loopDistance > 0 ? Math.min(1, Math.max(0.01, viewportSize / state.loopDistance)) : 0.25;

        window.parent.postMessage(
          {
            type: "loopPlayback",
            progress,
            viewportRatio,
            elapsedSeconds: elapsedMs / 1000,
            durationSeconds: durationMs / 1000,
            stageHeight,
            assetGap: state.assetGap,
            loopDistance: state.loopDistance
          },
          "*"
        );
      }

      function startPlaybackEmitter() {
        if (playbackTimer) {
          clearInterval(playbackTimer);
        }
        emitPlayback();
        playbackTimer = setInterval(emitPlayback, 50);
      }

      renderLoop();
      startPlaybackEmitter();
    <\/script>
  </body>
</html>`;
}

function buildPartitionedSnapshotHtml(config) {
  const safeState = escapeJsonForScript(config);
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>saved output</title>
    <style>
      :root {
        --loop-duration: 16s;
        --loop-distance: 1024px;
        --loop-pad-tb: 0px;
        --loop-pad-lr: 0px;
        --loop-bg: #fff8a5;
        --loop-gap: 0px;
        --loop-row-gap: 0px;
      }

      html,
      body {
        height: 100%;
        margin: 0;
      }

      body,
      .canvas {
        background: var(--loop-bg);
      }

      .canvas {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      .loop-stage {
        position: absolute;
        top: var(--loop-pad-tb);
        bottom: var(--loop-pad-tb);
        left: 0;
        right: 0;
        overflow: hidden;
      }

      .partition-grid {
        position: absolute;
        inset: 0;
        display: grid;
        grid-template-columns: 1820fr 1020fr 3060fr;
        overflow: hidden;
      }

      .partition {
        position: relative;
        overflow: hidden;
      }

      .partition:not(:last-child) {
        box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.14);
      }

      .loop-fill {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        gap: var(--loop-row-gap);
        height: 100%;
        overflow: hidden;
      }

      .loop-row {
        flex: 1 1 0;
        min-height: 0;
        overflow: hidden;
      }

      .loop-row-track {
        display: flex;
        gap: var(--loop-gap);
        width: max-content;
        height: 100%;
        animation: loop-x var(--loop-duration) linear infinite;
        animation-delay: var(--loop-row-delay, 0s);
        animation-direction: var(--loop-row-direction, normal);
        opacity: 0.98;
      }

      .loop-row-track.vertical-scroll {
        transform-origin: top left;
      }

      @keyframes loop-x {
        from {
          transform: translateX(0);
        }
        to {
          transform: translateX(calc(-1 * var(--loop-distance)));
        }
      }

      @keyframes loop-y {
        from {
          transform: rotate(-90deg) translateX(calc(-1 * var(--loop-distance)));
        }
        to {
          transform: rotate(-90deg) translateX(0);
        }
      }

      .loop-artwork {
        height: 100%;
        width: auto;
        flex: 0 0 auto;
      }

      .loop-artwork.vertical {
        transform: none;
      }

      .loop-spacer {
        height: 100%;
        flex: 0 0 auto;
      }
    </style>
  </head>
  <body>
    <div class="canvas">
      <div class="loop-stage">
        <div class="partition-grid">
          <section class="partition"><div id="partitionLeft" class="loop-fill"></div></section>
          <section class="partition"><div id="partitionCurve" class="loop-fill"></div></section>
          <section class="partition"><div id="partitionRight" class="loop-fill"></div></section>
        </div>
      </div>
    </div>
    <script>
      const partitionContainers = {
        left: document.getElementById("partitionLeft"),
        curve: document.getElementById("partitionCurve"),
        right: document.getElementById("partitionRight")
      };
      const PARTITION_KEYS = ["left", "curve", "right"];
      const DEFAULT_SOURCE = "assets/linear-loop-strip.png";
      const state = ${safeState};

      function normalizeArtworkSource(path) {
        if (/^(https?:|data:|blob:)/.test(path)) {
          return path;
        }
        if (path.startsWith("../../") || path.startsWith("../")) {
          return path;
        }
        return path;
      }

      function waitForImage(img) {
        return new Promise((resolve) => {
          if (img.complete) {
            resolve();
            return;
          }
          img.addEventListener("load", resolve, { once: true });
          img.addEventListener("error", resolve, { once: true });
        });
      }

      function orientationForPartition(partitionKey) {
        if (state.artworkOrientations && typeof state.artworkOrientations === "object") {
          return state.artworkOrientations[partitionKey] === "vertical" ? "vertical" : "horizontal";
        }
        return state.artworkOrientation === "vertical" ? "vertical" : "horizontal";
      }

      async function renderPartition(container, sources, partitionKey) {
        container.innerHTML = "";
        const rowCount = Math.max(1, Math.round(Number(state.rowCount) || 1));
        const sidePadding = Math.max(0, Number(state.padLeftRight) || 0);
        const verticalFlow = orientationForPartition(partitionKey) === "vertical";
        const rows = [];
        const allImages = [];
        let firstSequenceNodes = [];
        let firstSequenceStartNode = null;
        let secondSequenceStartNode = null;

        function appendSequence(track, collectNodes) {
          const nodes = [];
          let startNode = null;

          if (sidePadding > 0) {
            const spacerStart = document.createElement("div");
            spacerStart.className = "loop-spacer";
            spacerStart.style.width = sidePadding + "px";
            track.appendChild(spacerStart);
            nodes.push(spacerStart);
            startNode = spacerStart;
          }

          sources.forEach((src) => {
            const image = document.createElement("img");
            image.className = "loop-artwork";
            image.src = src;
            image.alt = "";
            track.appendChild(image);
            allImages.push(image);
            nodes.push(image);
            if (!startNode) {
              startNode = image;
            }
          });

          if (sidePadding > 0) {
            const spacerEnd = document.createElement("div");
            spacerEnd.className = "loop-spacer";
            spacerEnd.style.width = sidePadding + "px";
            track.appendChild(spacerEnd);
            nodes.push(spacerEnd);
          }

          if (collectNodes) {
            firstSequenceNodes = nodes;
            firstSequenceStartNode = startNode;
          }

          return startNode;
        }

        for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
          const row = document.createElement("div");
          row.className = "loop-row";
          const track = document.createElement("div");
          track.className = "loop-row-track";
          if (verticalFlow) {
            track.classList.add("vertical-scroll");
          }
          row.appendChild(track);
          container.appendChild(row);
          rows.push(track);

          appendSequence(track, rowIndex === 0);
          const secondStart = appendSequence(track, false);
          if (rowIndex === 0) {
            secondSequenceStartNode = secondStart;
          }
        }

        await Promise.all(allImages.map(waitForImage));

        const gapSize = Math.max(0, Number(state.assetGap) || 0);
        let loopDistance = 0;
        if (firstSequenceStartNode && secondSequenceStartNode) {
          const firstRect = firstSequenceStartNode.getBoundingClientRect();
          const secondRect = secondSequenceStartNode.getBoundingClientRect();
          loopDistance = secondRect.left - firstRect.left;
        }
        if (!Number.isFinite(loopDistance) || loopDistance <= 0) {
          loopDistance = firstSequenceNodes.reduce((sum, node) => sum + node.getBoundingClientRect().width, 0)
            + Math.max(0, firstSequenceNodes.length - 1) * gapSize;
        }
        const safeDistance = loopDistance > 0 ? loopDistance : 1;

        const offsetSecondsPerRow = ((Number(state.rowOffset) || 0) / safeDistance) * state.seconds;
        rows.forEach((track, rowIndex) => {
          const delay = -1 * offsetSecondsPerRow * rowIndex;
          track.style.setProperty("--loop-row-delay", delay + "s");
          track.style.animationName = verticalFlow ? "loop-y" : "loop-x";
          track.style.setProperty("--loop-distance", safeDistance + "px");
          track.style.setProperty("--loop-row-direction", "normal");
        });
      }

      async function render() {
        const safeBackground = /^#[0-9a-f]{6}$/i.test(state.backgroundColor || "")
          ? state.backgroundColor
          : "#fff8a5";
        document.documentElement.style.setProperty("--loop-duration", (Number(state.seconds) || 16) + "s");
        document.documentElement.style.setProperty("--loop-pad-tb", Math.max(0, Number(state.padTopBottom) || 0) + "px");
        document.documentElement.style.setProperty("--loop-pad-lr", Math.max(0, Number(state.padLeftRight) || 0) + "px");
        document.documentElement.style.setProperty("--loop-bg", safeBackground);
        document.documentElement.style.setProperty("--loop-gap", Math.max(0, Number(state.assetGap) || 0) + "px");
        document.documentElement.style.setProperty("--loop-row-gap", Math.max(0, Number(state.rowGap) || 0) + "px");

        const partitions = state.artworksByPartition && typeof state.artworksByPartition === "object"
          ? state.artworksByPartition
          : {};

        for (const key of PARTITION_KEYS) {
          const container = partitionContainers[key];
          if (!container) {
            continue;
          }
          const raw = Array.isArray(partitions[key]) ? partitions[key] : [];
          const sources = raw.length ? raw.map(normalizeArtworkSource) : [DEFAULT_SOURCE];
          await renderPartition(container, sources, key);
        }
      }

      render();
    <\/script>
  </body>
</html>`;
}

function coerceSnapshotLoopConfig(candidate) {
  if (!candidate || typeof candidate !== "object") {
    return null;
  }

  const secondsRaw = Number(candidate.seconds);
  const seconds = Number.isFinite(secondsRaw) && secondsRaw > 0 ? secondsRaw : 16;
  const artworks = Array.isArray(candidate.artworks)
    ? candidate.artworks
      .map((item) => String(item).trim())
      .map((item) => normalizeSnapshotArtworkSource(item))
      .filter((item) => item.length > 0)
    : [];
  const artworksByPartition =
    candidate.artworksByPartition && typeof candidate.artworksByPartition === "object"
      ? {
          left: Array.isArray(candidate.artworksByPartition.left)
            ? candidate.artworksByPartition.left
              .map((item) => String(item).trim())
              .map((item) => normalizeSnapshotArtworkSource(item))
              .filter((item) => item.length > 0)
            : [],
          curve: Array.isArray(candidate.artworksByPartition.curve)
            ? candidate.artworksByPartition.curve
              .map((item) => String(item).trim())
              .map((item) => normalizeSnapshotArtworkSource(item))
              .filter((item) => item.length > 0)
            : [],
          right: Array.isArray(candidate.artworksByPartition.right)
            ? candidate.artworksByPartition.right
              .map((item) => String(item).trim())
              .map((item) => normalizeSnapshotArtworkSource(item))
              .filter((item) => item.length > 0)
            : []
        }
      : null;

  const padTopBottomRaw = Number(candidate.padTopBottom);
  const padLeftRightRaw = Number(candidate.padLeftRight);
  const assetGapRaw = Number(candidate.assetGap);
  const artworkOrientation = normalizeArtworkOrientation(
    typeof candidate.artworkOrientation === "string"
      ? candidate.artworkOrientation
      : rotationToOrientation(candidate.artworkRotation)
  );
  const artworkOrientations =
    candidate.artworkOrientations && typeof candidate.artworkOrientations === "object"
      ? {
          left: normalizeArtworkOrientation(candidate.artworkOrientations.left),
          curve: normalizeArtworkOrientation(candidate.artworkOrientations.curve),
          right: normalizeArtworkOrientation(candidate.artworkOrientations.right)
        }
      : null;
  const rowCountRaw = Number(candidate.rowCount);
  const rowOffsetRaw = Number(candidate.rowOffset);
  const rowGapRaw = Number(candidate.rowGap);
  const backgroundColor =
    typeof candidate.backgroundColor === "string" && /^#[0-9a-f]{6}$/i.test(candidate.backgroundColor)
      ? candidate.backgroundColor
      : "#fff8a5";

  return {
    seconds,
    artworks,
    artworksByPartition,
    padTopBottom: Number.isFinite(padTopBottomRaw) && padTopBottomRaw >= 0 ? padTopBottomRaw : 0,
    padLeftRight: Number.isFinite(padLeftRightRaw) && padLeftRightRaw >= 0 ? padLeftRightRaw : 0,
    backgroundColor,
    assetGap: Number.isFinite(assetGapRaw) && assetGapRaw >= 0 ? assetGapRaw : 0,
    artworkOrientation,
    artworkOrientations,
    rowCount: Number.isFinite(rowCountRaw) && rowCountRaw >= 1 ? Math.round(rowCountRaw) : 1,
    rowOffset: Number.isFinite(rowOffsetRaw) && rowOffsetRaw >= 0 ? rowOffsetRaw : 0,
    rowGap: Number.isFinite(rowGapRaw) && rowGapRaw >= 0 ? rowGapRaw : 0,
    directionMode:
      candidate.directionMode === "partitioned" || artworksByPartition ? "partitioned" : "linear"
  };
}

function normalizeSnapshotArtworkSource(path) {
  const source = String(path || "").trim();
  if (!source) {
    return "";
  }
  if (/^(https?:|data:|blob:)/.test(source)) {
    return source;
  }
  const assetsIndex = source.indexOf("assets/");
  if (assetsIndex >= 0) {
    return source.slice(assetsIndex);
  }
  return source;
}

function extractLoopConfigFromSnapshotHtml(html) {
  if (typeof html !== "string" || !html.trim()) {
    return null;
  }

  const match = html.match(/const\s+state\s*=\s*(\{[\s\S]*?\})\s*;/);
  if (!match || !match[1]) {
    return null;
  }

  try {
    const parsed = Function(`"use strict"; return (${match[1]});`)();
    return coerceSnapshotLoopConfig(parsed);
  } catch (error) {
    return null;
  }
}

async function fetchOutputsFromServer() {
  try {
    const response = await fetch(apiPath("api/outputs"), { cache: "no-store" });
    if (!response.ok) {
      return [];
    }
    const parsed = await response.json();
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

async function createOutputOnServer(snapshot) {
  const response = await fetch(apiPath("api/outputs"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(snapshot)
  });
  if (!response.ok) {
    throw new Error("Could not save output");
  }
}

async function deleteOutputOnServer(id) {
  const response = await fetch(apiPath(`api/outputs/${encodeURIComponent(id)}`), {
    method: "DELETE"
  });
  if (!response.ok) {
    throw new Error("Could not delete output");
  }
}

async function refreshOutputsFromServer() {
  sharedOutputs = await fetchOutputsFromServer();
  if (knownDirections.length) {
    renderDirectory(knownDirections);
  }
}

function setSaveVersionStatus(message, isError) {
  if (!saveVersionStatus) {
    return;
  }
  saveVersionStatus.textContent = message;
  saveVersionStatus.style.color = isError ? "#8a0000" : "#2f5f2f";
}

async function saveCurrentVersionSnapshot() {
  const directionName = getCurrentDirectionName();
  if (!directionName) {
    setSaveVersionStatus("Select a direction before saving.", true);
    return;
  }

  const now = new Date();
  const timestampName = formatTimestampForName(now);
  const config = getCurrentLoopConfig();
  const snapshot = {
    id: `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
    name: timestampName,
    createdAt: now.toISOString(),
    directionName,
    config,
    html: buildSnapshotHtml(config)
  };

  setSaveVersionStatus(`Saving ${timestampName}...`, false);
  try {
    await createOutputOnServer(snapshot);
    setSaveVersionStatus(`Saved ${timestampName}.`, false);
    await refreshOutputsFromServer();
  } catch (error) {
    setSaveVersionStatus("Save failed. Server unavailable.", true);
  }
}

async function removeOutputSnapshot(snapshot) {
  if (!snapshot || typeof snapshot.id !== "string" || !snapshot.id) {
    return;
  }
  try {
    await deleteOutputOnServer(snapshot.id);
    if (activeSidebarKey === `output:${snapshot.id}`) {
      activeSidebarKey = null;
    }
    await refreshOutputsFromServer();
  } catch (error) {
    setSaveVersionStatus("Delete failed. Server unavailable.", true);
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

function savePreviewViewMode(value) {
  writeStorage(STORAGE_KEYS.previewViewMode, normalizePreviewViewMode(value));
}

function saveAssetGap(value) {
  writeStorage(STORAGE_KEYS.assetGap, String(value));
}

function saveArtworkOrientation(value) {
  writeStorage(STORAGE_KEYS.artworkOrientation, normalizeArtworkOrientation(value));
}

function savePartitionArtworkOrientations(value) {
  const safe = {
    left: normalizeArtworkOrientation(value && value.left),
    curve: normalizeArtworkOrientation(value && value.curve),
    right: normalizeArtworkOrientation(value && value.right)
  };
  writeStorage(STORAGE_KEYS.partitionArtworkOrientations, JSON.stringify(safe));
}

function saveRowCount(value) {
  writeStorage(STORAGE_KEYS.rowCount, String(value));
}

function saveRowOffset(value) {
  writeStorage(STORAGE_KEYS.rowOffset, String(value));
}

function saveRowGap(value) {
  writeStorage(STORAGE_KEYS.rowGap, String(value));
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

  if (previewViewModeControl) {
    const raw = readStorage(STORAGE_KEYS.previewViewMode);
    if (raw !== null) {
      previewViewModeControl.value = normalizePreviewViewMode(raw);
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

  if (artworkOrientationControl) {
    const raw = readStorage(STORAGE_KEYS.artworkOrientation);
    if (raw !== null) {
      artworkOrientationControl.value = normalizeArtworkOrientation(raw);
    } else {
      const legacyRaw = readStorage("billboard.loopArtworkRotation");
      artworkOrientationControl.value = rotationToOrientation(legacyRaw);
    }
  }

  const rawPartitionOrientations = readStorage(STORAGE_KEYS.partitionArtworkOrientations);
  if (rawPartitionOrientations) {
    try {
      const parsed = JSON.parse(rawPartitionOrientations);
      if (partitionOrientationLeftControl) {
        partitionOrientationLeftControl.value = normalizeArtworkOrientation(parsed.left);
      }
      if (partitionOrientationCurveControl) {
        partitionOrientationCurveControl.value = normalizeArtworkOrientation(parsed.curve);
      }
      if (partitionOrientationRightControl) {
        partitionOrientationRightControl.value = normalizeArtworkOrientation(parsed.right);
      }
    } catch (error) {
      // Ignore invalid storage values.
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

  if (rowGapControl) {
    const raw = readStorage(STORAGE_KEYS.rowGap);
    if (raw !== null) {
      const parsed = Number(raw);
      if (Number.isFinite(parsed)) {
        const min = Number(rowGapControl.min || 0);
        const max = Number(rowGapControl.max || 1200);
        rowGapControl.value = String(Math.min(max, Math.max(min, parsed)));
      }
    }
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

function savePartitionArtworks(artworksByPartition) {
  writeStorage(STORAGE_KEYS.partitionArtworks, JSON.stringify(artworksByPartition));
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

function restorePartitionArtworks() {
  const defaults = createDefaultPartitionArtworks();
  const rawValue = readStorage(STORAGE_KEYS.partitionArtworks);
  if (!rawValue) {
    return defaults;
  }

  try {
    const parsed = JSON.parse(rawValue);
    if (!parsed || typeof parsed !== "object") {
      return defaults;
    }

    const restored = {};
    PARTITION_KEYS.forEach((key) => {
      const cleaned = cloneArtworkItems(parsed[key]);
      restored[key] = cleaned.length ? cleaned : cloneArtworkItems(defaults[key]);
    });
    return restored;
  } catch (error) {
    return defaults;
  }
}

function syncSpeedReadout() {
  if (!speedValue) {
    return;
  }
  const seconds = Number.isFinite(loopTraverseSeconds) && loopTraverseSeconds > 0
    ? loopTraverseSeconds
    : currentSpeedSeconds();
  speedValue.textContent = `${seconds.toFixed(1)}s`;
}

function sendLoopConfigToPreview() {
  if (!billboardPreview.contentWindow) {
    return;
  }
  const seconds = currentSpeedSeconds();
  const payload = {
    type: "setLoopConfig",
    seconds,
    padTopBottom: currentPadTopBottom(),
    padLeftRight: currentPadLeftRight(),
    backgroundColor: currentBackgroundColor(),
    assetGap: currentAssetGap(),
    artworkOrientation: currentArtworkOrientation(),
    rowCount: currentRowCount(),
    rowOffset: currentRowOffset(),
    rowGap: currentRowGap()
  };
  if (currentDirectionIsPartitioned()) {
    payload.artworksByPartition = {
      left: (partitionArtworks.left || []).map((item) => item.src),
      curve: (partitionArtworks.curve || []).map((item) => item.src),
      right: (partitionArtworks.right || []).map((item) => item.src)
    };
    payload.artworkOrientations = currentPartitionArtworkOrientations();
  } else {
    payload.artworks = loopArtworks.map((item) => item.src);
  }
  billboardPreview.contentWindow.postMessage(payload, "*");
  billboardPreview.contentWindow.postMessage({ type: "setLoopDuration", seconds }, "*");
}

function syncVisualizationBackground() {
  if (!loopVisualization) {
    return;
  }
  loopVisualization.style.background = currentBackgroundColor();
  if (previewViewMode === "3d") {
    update3dPreviewAnimation();
  }
}

function getPartitionPreviewScale() {
  const targetHeight = 54;
  const stageHeight = Math.max(1, loopStageHeight);
  const totalSourceHeight = stageHeight + Math.max(0, loopPadTopBottom) * 2;
  if (!Number.isFinite(totalSourceHeight) || totalSourceHeight <= 0) {
    return 1;
  }
  return targetHeight / totalSourceHeight;
}

function syncPartitionEditorVisuals() {
  if (!partitionEditors) {
    return;
  }
  const scale = getPartitionPreviewScale();
  const stageHeight = Math.max(1, loopStageHeight);
  const scaledArtHeight = Math.max(8, Math.round(stageHeight * scale * 100) / 100);
  const scaledPadTB = Math.max(0, Math.round(Math.max(0, loopPadTopBottom) * scale * 100) / 100);
  const scaledPadLR = Math.max(0, Math.round(Math.max(0, loopPadLeftRight) * scale * 100) / 100);
  const scaledGap = Math.max(0, Math.round(Math.max(0, loopAssetGap) * scale * 100) / 100);
  partitionEditors.style.setProperty("--partition-preview-art-height", `${scaledArtHeight}px`);
  partitionEditors.style.setProperty("--partition-preview-pad-tb", `${scaledPadTB}px`);
  partitionEditors.style.setProperty("--partition-preview-pad-lr", `${scaledPadLR}px`);
  partitionEditors.style.setProperty("--partition-preview-gap", `${scaledGap}px`);
  partitionEditors.style.setProperty("--partition-preview-bg", currentBackgroundColor());

  [partitionTrackLeft, partitionTrackCurve, partitionTrackRight].forEach((trackEl) => {
    if (!trackEl) {
      return;
    }
    const spacerWidth = scaledPadLR;
    trackEl.querySelectorAll(".partition-preview-spacer").forEach((spacer) => {
      spacer.style.width = `${spacerWidth}px`;
    });
  });
}

function getPreviewScale() {
  if (!loopVisualization) {
    return 1;
  }
  const previewHeight = Math.max(1, loopVisualization.clientHeight - 8);
  const stageHeight = Math.max(1, loopStageHeight);
  const totalSourceHeight = stageHeight + Math.max(0, loopPadTopBottom) * 2;
  if (!Number.isFinite(totalSourceHeight) || totalSourceHeight <= 0) {
    return 1;
  }
  return previewHeight / totalSourceHeight;
}

function syncVisualizationGapScaled() {
  if (!loopVisualization || !loopPreviewTrack) {
    return;
  }
  const scale = getPreviewScale();
  const scaledGapRaw = Math.max(0, loopAssetGap) * scale;
  const scaledGap = Math.round(scaledGapRaw * 100) / 100;
  loopVisualization.style.setProperty("--preview-gap", `${scaledGap}px`);
  syncVisualizationGeometry();
}

function syncVisualizationPaddingScaled() {
  if (!loopVisualization || !loopPreviewTrack) {
    return;
  }
  const previewHeight = Math.max(1, loopVisualization.clientHeight - 8);
  const scale = getPreviewScale();
  const scaledPadTBRaw = Math.max(0, loopPadTopBottom) * scale;
  const scaledPadLRRaw = Math.max(0, loopPadLeftRight) * scale;
  const scaledTrackHeightRaw = Math.max(1, loopStageHeight) * scale;
  const scaledTrackHeight = Math.max(
    MIN_PREVIEW_TRACK_HEIGHT,
    Math.round(scaledTrackHeightRaw * 100) / 100
  );
  const maxPadTB = Math.max(0, (previewHeight - scaledTrackHeight) / 2);
  const scaledPadTB = Math.round(Math.min(maxPadTB, scaledPadTBRaw) * 100) / 100;
  const scaledPadLR = Math.round(scaledPadLRRaw * 100) / 100;
  loopVisualization.style.setProperty("--preview-pad-tb", `${scaledPadTB}px`);
  loopVisualization.style.setProperty("--preview-pad-lr", `${scaledPadLR}px`);
  loopVisualization.style.setProperty("--preview-track-height", `${scaledTrackHeight}px`);
  syncPreviewSpacers();
}

function syncPreviewSpacers() {
  if (!loopVisualization || !loopPreviewTrack) {
    return;
  }
  const padLR = Number.parseFloat(
    getComputedStyle(loopVisualization).getPropertyValue("--preview-pad-lr")
  );
  const width = Number.isFinite(padLR) ? Math.max(0, padLR) : 0;
  const spacers = loopPreviewTrack.querySelectorAll(".loop-preview-spacer");
  spacers.forEach((node) => {
    node.style.width = `${width}px`;
  });
}

function syncVisualizationGeometry() {
  if (!loopVisualization || !loopPreviewTrack) {
    return;
  }
  const totalWidth = loopPreviewTrack.scrollWidth;
  if (!Number.isFinite(totalWidth) || totalWidth <= 0) {
    return;
  }
  const horizontalPadding = 8;
  loopVisualization.style.width = `${totalWidth + horizontalPadding}px`;
}

function renderLoopPreview() {
  if (!loopPreviewTrack) {
    return;
  }

  loopPreviewTrack.innerHTML = "";
  const spacerStart = document.createElement("div");
  spacerStart.className = "loop-preview-spacer";
  loopPreviewTrack.appendChild(spacerStart);

  loopArtworks.forEach((item, index) => {
    const tile = document.createElement("div");
    tile.className = "loop-preview-item";
    tile.dataset.index = String(index);
    tile.dataset.artworkId = item.id;

    const image = document.createElement("img");
    image.src = item.src;
    image.alt = "";
    image.draggable = false;
    tile.appendChild(image);
    loopPreviewTrack.appendChild(tile);
  });
  const spacerEnd = document.createElement("div");
  spacerEnd.className = "loop-preview-spacer";
  loopPreviewTrack.appendChild(spacerEnd);

  if (loopPreviewSortable && typeof loopPreviewSortable.destroy === "function") {
    loopPreviewSortable.destroy();
  }
  loopPreviewSortable = null;

  initLoopSortable();
  syncVisualizationPaddingScaled();
  syncVisualizationGapScaled();
  syncVisualizationGeometry();
  updateActiveWindow();
  render3dPreview();
}

function partitionTrackElement(partitionKey) {
  const key = normalizePartitionKey(partitionKey);
  if (key === "left") {
    return partitionTrackLeft;
  }
  if (key === "curve") {
    return partitionTrackCurve;
  }
  if (key === "right") {
    return partitionTrackRight;
  }
  return null;
}

function reorderPartitionArtworksByIds(partitionKey, idOrder) {
  const key = normalizePartitionKey(partitionKey);
  if (!key) {
    return;
  }
  const current = partitionArtworks[key] || [];
  const byId = new Map(current.map((item) => [item.id, item]));
  const reordered = idOrder.map((id) => byId.get(id)).filter((item) => item);
  if (reordered.length !== current.length) {
    return;
  }
  partitionArtworks[key] = reordered;
  savePartitionArtworks(partitionArtworks);
  sendLoopConfigToPreview();
}

function removePartitionArtwork(partitionKey, index) {
  const key = normalizePartitionKey(partitionKey);
  if (!key) {
    return;
  }
  const items = partitionArtworks[key];
  if (!Array.isArray(items)) {
    return;
  }
  items.splice(index, 1);
  savePartitionArtworks(partitionArtworks);
  renderPartitionEditor(key);
  render3dPreview();
  sendLoopConfigToPreview();
}

async function initPartitionSortable(partitionKey, trackEl) {
  const key = normalizePartitionKey(partitionKey);
  if (!key || !trackEl) {
    return;
  }

  try {
    const mod = await getSortableModule();
    const Sortable = mod.default || mod.Sortable || mod;
    partitionSortables[key] = Sortable.create(trackEl, {
      animation: 140,
      // Prefer native DnD; forced fallback can break reorder in some browsers.
      draggable: ".partition-preview-item",
      invertSwap: true,
      swapThreshold: 0.65,
      ghostClass: "sortable-ghost",
      chosenClass: "sortable-chosen",
      dragClass: "sortable-drag",
      onChange: () => {
        updatePartitionActiveWindows();
      },
      onEnd: () => {
        const idOrder = [...trackEl.querySelectorAll(".partition-preview-item")]
          .map((node) => node.dataset.artworkId)
          .filter((id) => !!id);
        reorderPartitionArtworksByIds(key, idOrder);
        renderPartitionEditor(key);
      }
    });
  } catch (error) {
    // Keep basic visual editor if Sortable fails to load.
  }
}

function renderPartitionEditor(partitionKey) {
  const key = normalizePartitionKey(partitionKey);
  const trackEl = partitionTrackElement(key);
  if (!key || !trackEl) {
    return;
  }
  if (partitionSortables[key] && typeof partitionSortables[key].destroy === "function") {
    partitionSortables[key].destroy();
    partitionSortables[key] = null;
  }
  const items = partitionArtworks[key] || [];
  trackEl.innerHTML = "";

  if (!items.length) {
    const hint = document.createElement("div");
    hint.className = "settings-hint";
    hint.textContent = "(none)";
    trackEl.appendChild(hint);
    return;
  }

  const spacerStart = document.createElement("div");
  spacerStart.className = "partition-preview-spacer partition-preview-segment";
  trackEl.appendChild(spacerStart);

  items.forEach((item, index) => {
    const tile = document.createElement("div");
    tile.className = "partition-preview-item partition-preview-segment";
    tile.dataset.artworkId = item.id;

    const image = document.createElement("img");
    image.src = item.src;
    image.alt = "";
    image.draggable = false;
    tile.appendChild(image);

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-partition-item";
    removeButton.textContent = "x";
    removeButton.title = "Remove asset";
    removeButton.setAttribute("aria-label", "Remove asset");
    removeButton.addEventListener("click", () => {
      removePartitionArtwork(key, index);
    });
    tile.appendChild(removeButton);
    trackEl.appendChild(tile);
  });

  const spacerEnd = document.createElement("div");
  spacerEnd.className = "partition-preview-spacer partition-preview-segment";
  trackEl.appendChild(spacerEnd);

  const activeWindow = document.createElement("div");
  activeWindow.className = "partition-active-window";
  activeWindow.dataset.partitionWindow = "primary";
  trackEl.appendChild(activeWindow);
  const activeWindowSecondary = document.createElement("div");
  activeWindowSecondary.className = "partition-active-window";
  activeWindowSecondary.dataset.partitionWindow = "secondary";
  trackEl.appendChild(activeWindowSecondary);

  initPartitionSortable(key, trackEl);
  syncPartitionEditorVisuals();
  updatePartitionActiveWindows();
}

function renderPartitionEditors() {
  renderPartitionEditor("left");
  renderPartitionEditor("curve");
  renderPartitionEditor("right");
  render3dPreview();
}

function updatePartitionActiveWindows() {
  if (!currentDirectionIsPartitioned()) {
    return;
  }
  const normalizedProgress = ((loopPlaybackProgress % 1) + 1) % 1;

  PARTITION_KEYS.forEach((partitionKey) => {
    const trackEl = partitionTrackElement(partitionKey);
    if (!trackEl) {
      return;
    }
    const primaryWindow = trackEl.querySelector('[data-partition-window="primary"]');
    const secondaryWindow = trackEl.querySelector('[data-partition-window="secondary"]');
    if (!primaryWindow || !secondaryWindow) {
      return;
    }

    const previewSegments = [...trackEl.querySelectorAll(".partition-preview-segment")];
    if (!previewSegments.length) {
      primaryWindow.style.display = "none";
      secondaryWindow.style.display = "none";
      return;
    }

    const styles = getComputedStyle(trackEl);
    const gapRaw = Number.parseFloat(styles.gap || styles.columnGap || "0");
    const gap = Number.isFinite(gapRaw) ? Math.max(0, gapRaw) : 0;
    const itemWidth = previewSegments.reduce((sum, node) => sum + node.getBoundingClientRect().width, 0);
    const sequenceWidth = Math.max(1, itemWidth + Math.max(0, previewSegments.length - 1) * gap);
    const distance = sequenceWidth;
    const ratioRaw = Number(partitionViewportRatios[partitionKey]);
    const viewportRatio = Number.isFinite(ratioRaw)
      ? Math.max(0.01, Math.min(1, ratioRaw))
      : Math.max(0.01, Math.min(1, loopPlaybackViewportRatio || 0.25));
    const x = distance * normalizedProgress;
    const activeWidth = Math.max(8, Math.min(distance, distance * viewportRatio));
    const mainWidth = Math.min(activeWidth, Math.max(0, distance - x));
    const overflowWidth = Math.max(0, activeWidth - mainWidth);

    if (mainWidth > 0) {
      primaryWindow.style.display = "block";
      primaryWindow.style.width = `${mainWidth}px`;
      primaryWindow.style.transform = `translateX(${x}px)`;
    } else {
      primaryWindow.style.display = "none";
    }

    if (overflowWidth > 0) {
      secondaryWindow.style.display = "block";
      secondaryWindow.style.width = `${overflowWidth}px`;
      secondaryWindow.style.transform = "translateX(0px)";
    } else {
      secondaryWindow.style.display = "none";
    }
  });
}

function bindPartitionTrackDrop(trackEl, partitionKey) {
  if (!trackEl) {
    return;
  }
  const key = normalizePartitionKey(partitionKey);
  if (!key) {
    return;
  }

  trackEl.addEventListener("dragover", (event) => {
    if (!currentDirectionIsPartitioned()) {
      return;
    }
    event.preventDefault();
    trackEl.classList.add("drag-over");
  });

  trackEl.addEventListener("dragleave", () => {
    trackEl.classList.remove("drag-over");
  });

  trackEl.addEventListener("drop", async (event) => {
    trackEl.classList.remove("drag-over");
    if (!currentDirectionIsPartitioned()) {
      return;
    }
    event.preventDefault();
    if (!event.dataTransfer || !event.dataTransfer.files) {
      return;
    }
    await addArtworkFiles(event.dataTransfer.files, key);
  });
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

async function initLoopSortable() {
  if (!loopPreviewTrack || loopPreviewSortable) {
    return;
  }

  try {
    const mod = await getSortableModule();
    const Sortable = mod.default || mod.Sortable || mod;
    loopPreviewSortable = Sortable.create(loopPreviewTrack, {
      animation: 150,
      // Prefer native DnD; forced fallback can break reorder in some browsers.
      draggable: ".loop-preview-item",
      invertSwap: true,
      swapThreshold: 0.65,
      ghostClass: "sortable-ghost",
      chosenClass: "sortable-chosen",
      dragClass: "sortable-drag",
      onChange: () => {
        updateActiveWindow();
      },
      onEnd: () => {
        const idOrder = [...loopPreviewTrack.querySelectorAll(".loop-preview-item")]
          .map((node) => node.dataset.artworkId)
          .filter((id) => !!id);
        reorderArtworksByIds(idOrder);
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
  const normalizedProgress = ((loopPlaybackProgress % 1) + 1) % 1;
  const previewScale = getPreviewScale();
  const scaledLoopDistance = Math.max(1, loopDistanceSource * previewScale);
  const normalizedViewportRatio = Number.isFinite(loopPlaybackViewportRatio)
    ? Math.max(0.01, Math.min(1, loopPlaybackViewportRatio))
    : 0.25;
  const activeWidth = Math.max(8, Math.min(scaledLoopDistance, scaledLoopDistance * normalizedViewportRatio));
  const x = scaledLoopDistance * normalizedProgress;
  const traverseTravelPxRaw = scaledLoopDistance - activeWidth;
  const traverseTravelPx = Math.max(0, traverseTravelPxRaw);
  const traverseRatio = Math.max(0, Math.min(1, traverseTravelPx / scaledLoopDistance));
  const traverseDuration = Math.max(0.1, loopDurationSeconds * traverseRatio);
  const traverseProgress = traverseTravelPx > 0
    ? Math.max(0, Math.min(1, x / traverseTravelPx))
    : 0;
  const traverseElapsed = traverseDuration * traverseProgress;
  loopTraverseSeconds = traverseDuration;
  const baseX = loopPreviewTrack.offsetLeft - loopVisualization.scrollLeft;
  const mainWidth = Math.min(activeWidth, Math.max(0, scaledLoopDistance - x));
  const overflowWidth = Math.max(0, activeWidth - mainWidth);
  const drawX = baseX + x;
  const frameTopOffset = 0;

  loopActiveWindow.style.top = `${frameTopOffset}px`;
  loopActiveWindow.style.height = `${frameHeight}px`;
  if (loopActiveWindowSecondary) {
    loopActiveWindowSecondary.style.top = `${frameTopOffset}px`;
    loopActiveWindowSecondary.style.height = `${frameHeight}px`;
  }

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
    loopElapsedTime.textContent = `${traverseElapsed.toFixed(1)}s/${traverseDuration.toFixed(1)}s`;
    let centerX = drawX + mainWidth / 2;
    if (mainWidth <= 0 && overflowWidth > 0) {
      centerX = baseX + overflowWidth / 2;
    }
    const editorRect = loopVisualization.getBoundingClientRect();
    const absoluteLeft = editorRect.left + centerX;
    const absoluteTop = editorRect.top + frameTopOffset + frameHeight + 2;
    loopElapsedTime.style.left = `${absoluteLeft}px`;
    loopElapsedTime.style.top = `${absoluteTop}px`;
    loopElapsedTime.style.transform = "translateX(-50%)";
  }
  update3dPreviewAnimation();
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

function renderDirectory(directions) {
  directoryPanel.innerHTML = "";

  const directionsSection = document.createElement("section");
  directionsSection.className = "directory-section";

  const directionsTitle = document.createElement("h2");
  directionsTitle.textContent = "directions";
  directionsSection.appendChild(directionsTitle);

  const savedDirection = restoreSelectedDirection();
  let firstDirectionButton = null;
  let initialButton = null;
  let initialName = null;
  let restoredActiveButton = null;

  directions.forEach((name) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "direction-item";
    button.textContent = name;
    button.dataset.directionName = name;
    button.addEventListener("click", () => {
      loadDirection(directionPath(name), name);
      setActiveSidebarItem(button, `direction:${name}`);
      saveSelectedDirection(name);
    });
    directionsSection.appendChild(button);

    if (!firstDirectionButton) {
      firstDirectionButton = button;
    }
    if (savedDirection === name) {
      initialButton = button;
      initialName = name;
    }
    if (activeSidebarKey === `direction:${name}`) {
      restoredActiveButton = button;
    }
  });

  directoryPanel.appendChild(directionsSection);

  const outputsSection = document.createElement("section");
  outputsSection.className = "directory-section";
  const outputsTitle = document.createElement("h2");
  outputsTitle.textContent = "outputs";
  outputsSection.appendChild(outputsTitle);

  const outputs = sharedOutputs;
  if (!outputs.length) {
    const empty = document.createElement("div");
    empty.className = "settings-hint";
    empty.textContent = "(none yet)";
    outputsSection.appendChild(empty);
  } else {
    outputs.forEach((snapshot) => {
      const row = document.createElement("div");
      row.className = "output-row";

      const button = document.createElement("button");
      button.type = "button";
      button.className = "direction-item output-item";
      button.textContent = snapshot.name || snapshot.createdAt || "saved output";
      button.addEventListener("click", () => {
        loadOutputSnapshot(snapshot);
        setActiveSidebarItem(button, `output:${snapshot.id || ""}`);
      });
      row.appendChild(button);

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "output-remove-button";
      removeButton.setAttribute("aria-label", "Delete output");
      removeButton.title = "Delete output";
      removeButton.textContent = "×";
      removeButton.addEventListener("click", async (event) => {
        event.stopPropagation();
        await removeOutputSnapshot(snapshot);
      });
      row.appendChild(removeButton);

      outputsSection.appendChild(row);

      if (activeSidebarKey === `output:${snapshot.id || ""}`) {
        restoredActiveButton = button;
      }
    });
  }

  directoryPanel.appendChild(outputsSection);

  if (restoredActiveButton) {
    setActiveDirection(restoredActiveButton);
    return;
  }

  if (initialButton && initialName) {
    loadDirection(directionPath(initialName), initialName);
    setActiveSidebarItem(initialButton, `direction:${initialName}`);
    return;
  }

  if (firstDirectionButton && directions[0]) {
    loadDirection(directionPath(directions[0]), directions[0]);
    setActiveSidebarItem(firstDirectionButton, `direction:${directions[0]}`);
  }
}

async function init() {
  restoreSpeed();
  restoreLoopLayoutSettings();
  restorePreview3dSettings();
  previewViewMode = normalizePreviewViewMode(
    readStorage(STORAGE_KEYS.previewViewMode) || (previewViewModeControl ? previewViewModeControl.value : "flat")
  );
  loopArtworks = restoreArtworks();
  partitionArtworks = restorePartitionArtworks();

  try {
    let directions = [];
    try {
      directions = await loadDirectionsFromManifest();
    } catch (error) {
      directions = await discoverDirections();
    }

    if (!directions.length) {
      throw new Error("No directions found");
    }

    knownDirections = [...directions];
    sharedOutputs = await fetchOutputsFromServer();
    renderDirectory(directions);
  } catch (error) {
    emptyState.textContent = "No directions found. Check directions/manifest.json.";
  }

  syncSpeedReadout();
  loopRowGap = currentRowGap();
  renderLoopPreview();
  renderPartitionEditors();
  syncDirectionModeUI();
  applyPreviewViewMode(previewViewMode);
  setupViewControlsModal();
  syncViewControlsUI();

  if (speedControl) {
    speedControl.addEventListener("input", () => {
      loopDurationSeconds = currentSpeedSeconds();
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
      syncPartitionEditorVisuals();
      render3dPreview();
      sendLoopConfigToPreview();
    });
  }

  if (padLRControl) {
    padLRControl.addEventListener("input", () => {
      savePadLeftRight(currentPadLeftRight());
      loopPadLeftRight = currentPadLeftRight();
      syncVisualizationPaddingScaled();
      syncVisualizationGeometry();
      syncPartitionEditorVisuals();
      render3dPreview();
      sendLoopConfigToPreview();
    });
  }

  if (bgColorControl) {
    bgColorControl.addEventListener("input", () => {
      saveBackgroundColor(currentBackgroundColor());
      syncVisualizationBackground();
      syncPartitionEditorVisuals();
      render3dPreview();
      sendLoopConfigToPreview();
    });
  }

  if (previewViewModeControl) {
    previewViewModeControl.addEventListener("change", () => {
      previewViewMode = normalizePreviewViewMode(previewViewModeControl.value);
      savePreviewViewMode(previewViewMode);
      applyPreviewViewMode(previewViewMode);
    });
  }

  if (cameraYawControl) {
    cameraYawControl.addEventListener("input", () => {
      preview3dCamera.yaw = Number(cameraYawControl.value) || 0;
      clampPreview3dCamera();
      persistPreview3dSettings();
      syncViewControlsUI();
      update3dPreviewAnimation();
    });
  }

  if (cameraPitchControl) {
    cameraPitchControl.addEventListener("input", () => {
      preview3dCamera.pitch = Number(cameraPitchControl.value) || 0;
      clampPreview3dCamera();
      persistPreview3dSettings();
      syncViewControlsUI();
      update3dPreviewAnimation();
    });
  }

  if (cameraPerspectiveControl) {
    cameraPerspectiveControl.addEventListener("input", () => {
      preview3dCamera.perspective = Number(cameraPerspectiveControl.value) || 1;
      clampPreview3dCamera();
      persistPreview3dSettings();
      syncViewControlsUI();
      update3dPreviewAnimation();
    });
  }

  if (cameraFitControl) {
    cameraFitControl.addEventListener("input", () => {
      preview3dRenderSettings.fit = Number(cameraFitControl.value) || preview3dRenderSettings.fit;
      clampPreview3dCamera();
      persistPreview3dSettings();
      syncViewControlsUI();
      update3dPreviewAnimation();
    });
  }

  if (cameraDragSensitivityControl) {
    cameraDragSensitivityControl.addEventListener("input", () => {
      preview3dRenderSettings.dragSensitivity =
        Number(cameraDragSensitivityControl.value) || preview3dRenderSettings.dragSensitivity;
      clampPreview3dCamera();
      persistPreview3dSettings();
      syncViewControlsUI();
    });
  }

  if (cameraTextureQualityControl) {
    cameraTextureQualityControl.addEventListener("input", () => {
      preview3dRenderSettings.textureQuality =
        Number(cameraTextureQualityControl.value) || preview3dRenderSettings.textureQuality;
      clampPreview3dCamera();
      persistPreview3dSettings();
      syncViewControlsUI();
      render3dPreview();
    });
  }

  if (resetViewControlsButton) {
    resetViewControlsButton.addEventListener("click", () => {
      preview3dCamera.yaw = -0.78;
      preview3dCamera.pitch = 0.96;
      preview3dCamera.perspective = 1;
      preview3dRenderSettings.fit = 0.84;
      preview3dRenderSettings.dragSensitivity = 1;
      preview3dRenderSettings.textureQuality = 1.75;
      clampPreview3dCamera();
      persistPreview3dSettings();
      syncViewControlsUI();
      render3dPreview();
    });
  }

  if (assetGapControl) {
    assetGapControl.addEventListener("input", () => {
      saveAssetGap(currentAssetGap());
      loopAssetGap = currentAssetGap();
      syncVisualizationGapScaled();
      syncPartitionEditorVisuals();
      render3dPreview();
      sendLoopConfigToPreview();
    });
  }

  if (artworkOrientationControl) {
    artworkOrientationControl.addEventListener("change", () => {
      saveArtworkOrientation(currentArtworkOrientation());
      render3dPreview();
      sendLoopConfigToPreview();
    });
  }

  [partitionOrientationLeftControl, partitionOrientationCurveControl, partitionOrientationRightControl]
    .filter((control) => !!control)
    .forEach((control) => {
      control.addEventListener("change", () => {
        savePartitionArtworkOrientations(currentPartitionArtworkOrientations());
        render3dPreview();
        sendLoopConfigToPreview();
      });
    });

  if (rowCountControl) {
    rowCountControl.addEventListener("input", () => {
      saveRowCount(currentRowCount());
      render3dPreview();
      sendLoopConfigToPreview();
    });
  }

  if (rowOffsetControl) {
    rowOffsetControl.addEventListener("input", () => {
      saveRowOffset(currentRowOffset());
      render3dPreview();
      sendLoopConfigToPreview();
    });
  }

  if (rowGapControl) {
    rowGapControl.addEventListener("input", () => {
      saveRowGap(currentRowGap());
      loopRowGap = currentRowGap();
      render3dPreview();
      sendLoopConfigToPreview();
    });
  }

  if (saveVersionButton) {
    saveVersionButton.addEventListener("click", async () => {
      await saveCurrentVersionSnapshot();
    });
  }

  bindPartitionTrackDrop(partitionTrackLeft, "left");
  bindPartitionTrackDrop(partitionTrackCurve, "curve");
  bindPartitionTrackDrop(partitionTrackRight, "right");

  if (loopVisualization) {
    loopVisualization.addEventListener("dragover", (event) => {
      if (currentDirectionIsPartitioned()) {
        return;
      }
      event.preventDefault();
      loopVisualization.classList.add("drag-over");
    });

    loopVisualization.addEventListener("dragleave", () => {
      loopVisualization.classList.remove("drag-over");
    });

    loopVisualization.addEventListener("drop", (event) => {
      if (currentDirectionIsPartitioned()) {
        return;
      }
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
    const loopDistance = Number(payload.loopDistance);

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
    let shouldRerender3d = false;
    if (Number.isFinite(stageHeight) && stageHeight > 0 && stageHeight !== loopStageHeight) {
      loopStageHeight = stageHeight;
      shouldRerender3d = true;
    }
    if (Number.isFinite(assetGap) && assetGap >= 0 && assetGap !== loopAssetGap) {
      loopAssetGap = assetGap;
      shouldRerender3d = true;
    }
    if (Number.isFinite(loopDistance) && loopDistance > 0) {
      loopDistanceSource = loopDistance;
    }
    if (payload.partitions && typeof payload.partitions === "object") {
      PARTITION_KEYS.forEach((key) => {
        const part = payload.partitions[key];
        if (!part || typeof part !== "object") {
          return;
        }
        const ratio = Number(part.viewportRatio);
        if (Number.isFinite(ratio) && ratio > 0) {
          partitionViewportRatios[key] = ratio;
        }
        const distance = Number(part.loopDistance);
        if (Number.isFinite(distance) && distance > 0) {
          partitionLoopDistances[key] = distance;
        }
      });
    } else {
      PARTITION_KEYS.forEach((key) => {
        partitionViewportRatios[key] = loopPlaybackViewportRatio;
        partitionLoopDistances[key] = loopDistanceSource;
      });
    }
    loopPadTopBottom = currentPadTopBottom();
    loopPadLeftRight = currentPadLeftRight();
    syncVisualizationPaddingScaled();
    syncVisualizationGapScaled();
    syncPartitionEditorVisuals();
    syncSpeedReadout();
    updateActiveWindow();
    updatePartitionActiveWindows();
    if (shouldRerender3d && previewViewMode === "3d") {
      render3dPreview();
    }
  });

  window.addEventListener("resize", () => {
    syncVisualizationPaddingScaled();
    syncVisualizationGapScaled();
    syncPartitionEditorVisuals();
    syncVisualizationGeometry();
    updateActiveWindow();
    updatePartitionActiveWindows();
    if (previewViewMode === "3d") {
      render3dPreview();
    }
  });

  billboardPreview.addEventListener("load", () => {
    loopActiveWindow.style.display = "none";
    if (loopActiveWindowSecondary) {
      loopActiveWindowSecondary.style.display = "none";
    }
    if (loopElapsedTime) {
      loopElapsedTime.style.display = "none";
    }
    PARTITION_KEYS.forEach((key) => {
      partitionViewportRatios[key] = 0.25;
      partitionLoopDistances[key] = 1;
    });
    updatePartitionActiveWindows();
    sendLoopConfigToPreview();
    if (previewViewMode === "3d") {
      render3dPreview();
    }
  });

  setup3dCanvasInteraction();
  syncVisualizationBackground();
  loopAssetGap = currentAssetGap();
  loopPadTopBottom = currentPadTopBottom();
  loopPadLeftRight = currentPadLeftRight();
  syncVisualizationPaddingScaled();
  syncVisualizationGapScaled();
  syncPartitionEditorVisuals();
  syncVisualizationGeometry();
}

init();
