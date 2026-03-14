const directoryPanel = document.getElementById("directoryPanel");
const billboardPreview = document.getElementById("billboardPreview");
const emptyState = document.getElementById("emptyState");
const speedControl = document.getElementById("speedControl");
const speedValue = document.getElementById("speedValue");
const padTBControl = document.getElementById("padTBControl");
const padLRControl = document.getElementById("padLRControl");
const bgColorControl = document.getElementById("bgColorControl");
const assetColorControl = document.getElementById("assetColorControl");
const previewViewModeControl = document.getElementById("previewViewModeControl");
const cameraYawControl = document.getElementById("cameraYawControl");
const cameraPitchControl = document.getElementById("cameraPitchControl");
const cameraPerspectiveControl = document.getElementById("cameraPerspectiveControl");
const cameraZoomControl = document.getElementById("cameraZoomControl");
const cameraTargetXControl = document.getElementById("cameraTargetXControl");
const cameraTargetYControl = document.getElementById("cameraTargetYControl");
const cameraTargetZControl = document.getElementById("cameraTargetZControl");
const projectionBrightnessControl = document.getElementById("projectionBrightnessControl");
const projectionShadowControl = document.getElementById("projectionShadowControl");
const projectionGlareControl = document.getElementById("projectionGlareControl");
const resetViewControlsButton = document.getElementById("resetViewControlsButton");
const blenderCameraRow = document.getElementById("blenderCameraRow");
const blenderCameraControl = document.getElementById("blenderCameraControl");
const manualCameraRows = [...document.querySelectorAll(".camera-manual-row")];
const viewModeChoiceButtons = [...document.querySelectorAll(".view-mode-choice")];
const assetGapControl = document.getElementById("assetGapControl");
const artworkOrientationControl = document.getElementById("artworkOrientationControl");
const linearOrientationRow = document.getElementById("linearOrientationRow");
const partitionOrientationRows = document.getElementById("partitionOrientationRows");
const partitionSettingsTabs = [...document.querySelectorAll(".partition-settings-tab")];
const partitionActiveOrientationLabel = document.getElementById("partitionActiveOrientationLabel");
const partitionActiveOrientationHorizontal = document.getElementById("partitionActiveOrientationHorizontal");
const partitionActiveOrientationVertical = document.getElementById("partitionActiveOrientationVertical");
const partitionOrientationLeftControl = document.getElementById("partitionOrientationLeftControl");
const partitionOrientationCurveControl = document.getElementById("partitionOrientationCurveControl");
const partitionOrientationRightControl = document.getElementById("partitionOrientationRightControl");
const rowCountControl = document.getElementById("rowCountControl");
const rowOffsetControl = document.getElementById("rowOffsetControl");
const rowGapControl = document.getElementById("rowGapControl");
const orientationChoiceButtons = [...document.querySelectorAll(".orientation-choice")];
const saveVersionButton = document.getElementById("saveVersionButton");
const saveVersionStatus = document.getElementById("saveVersionStatus");
const settingsPanel = document.querySelector(".settings-panel");
const viewControlsPanel = document.querySelector(".view-controls-panel");
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
const themeToggleButton = document.getElementById("themeToggleButton");
const settingsToggleButton = document.getElementById("settingsToggleButton");
const viewControlsToggleButton = document.getElementById("viewControlsToggleButton");
const STORAGE_KEYS = {
  speed: "billboard.loopSpeedSeconds",
  padTB: "billboard.loopPadTopBottom",
  padLR: "billboard.loopPadLeftRight",
  bgColor: "billboard.loopBackgroundColor",
  assetColor: "billboard.loopAssetColor",
  previewViewMode: "billboard.previewViewMode",
  assetGap: "billboard.loopAssetGap",
  artworkOrientation: "billboard.loopArtworkOrientation",
  partitionArtworkOrientations: "billboard.partitionArtworkOrientations",
  rowCount: "billboard.loopRowCount",
  rowOffset: "billboard.loopRowOffset",
  rowGap: "billboard.loopRowGap",
  partitionSettings: "billboard.partitionSettings",
  cameraYaw: "billboard.preview3dCameraYaw",
  cameraPitch: "billboard.preview3dCameraPitch",
  cameraPerspective: "billboard.preview3dCameraPerspective",
  cameraZoom: "billboard.preview3dCameraZoom",
  cameraTargetX: "billboard.preview3dCameraTargetX",
  cameraTargetY: "billboard.preview3dCameraTargetY",
  cameraTargetZ: "billboard.preview3dCameraTargetZ",
  projectionBrightness: "billboard.preview3dProjectionBrightness",
  projectionShadow: "billboard.preview3dProjectionShadow",
  projectionGlare: "billboard.preview3dProjectionGlare",
  cameraViewPreset: "billboard.preview3dCameraViewPreset",
  cameraPresetVersion: "billboard.preview3dCameraPresetVersion",
  themeMode: "billboard.themeMode",
  direction: "billboard.selectedDirection",
  artworks: "billboard.loopArtworks",
  partitionArtworks: "billboard.partitionArtworks"
};
const PARTITION_DIRECTION_NAME = "partitioned";
const LOOP_MAKER_DIRECTION_NAME = "loop maker";
const PARTITION_KEYS = ["left", "curve", "right"];
const DIRECTION_DISPLAY_NAMES = {
  linear: "linear billboard",
  "linear loop": "linear billboard",
  partitioned: "partitioned billboard",
  "loop maker": "loop maker"
};
const DEFAULT_ARTWORKS = [createArtworkItem("assets/linear-loop-strip.png", "linear-loop-strip.png")];
const DEFAULT_PARTITION_ARTWORKS = {
  left: [createArtworkItem("assets/linear-loop-strip.png", "linear-loop-strip.png")],
  curve: [createArtworkItem("assets/linear-loop-strip.png", "linear-loop-strip.png")],
  right: [createArtworkItem("assets/linear-loop-strip.png", "linear-loop-strip.png")]
};
const DEFAULT_PARTITION_SETTINGS_ENTRY = {
  seconds: 16,
  padTopBottom: 0,
  padLeftRight: 0,
  backgroundColor: "#fff8a5",
  assetColor: "#111111",
  assetGap: 0,
  rowCount: 1,
  rowOffset: 0,
  rowGap: 0
};
let loopArtworks = [...DEFAULT_ARTWORKS];
let partitionArtworks = createDefaultPartitionArtworks();
let partitionSettingsByKey = createDefaultPartitionSettings();
let activePartitionSettingsKey = "left";
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
let loopStageHeight = 3480;
let loopAssetGap = 0;
let loopPadTopBottom = 0;
let loopPadLeftRight = 0;
let loopDistanceSource = 5900;
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
const BILLBOARD_MODEL_URL = "assets/models/D_Billboard_MockUp.glb";
const BILLBOARD_MODEL_MESH_HINTS = ["billboard", "screen", "plane", "display", "led"];
const BILLBOARD_LEFT_WIDTH = 1820;
const BILLBOARD_CURVE_WIDTH = 1020;
const BILLBOARD_RIGHT_WIDTH = 3060;
const BILLBOARD_PARTITION_RANGES = {
  left: [0, BILLBOARD_LEFT_WIDTH],
  curve: [BILLBOARD_LEFT_WIDTH, BILLBOARD_LEFT_WIDTH + BILLBOARD_CURVE_WIDTH],
  right: [BILLBOARD_LEFT_WIDTH + BILLBOARD_CURVE_WIDTH, BILLBOARD_DESIGN_WIDTH]
};
const BILLBOARD_PARTITION_CENTERS = {
  left: (BILLBOARD_PARTITION_RANGES.left[0] + BILLBOARD_PARTITION_RANGES.left[1]) * 0.5,
  curve: (BILLBOARD_PARTITION_RANGES.curve[0] + BILLBOARD_PARTITION_RANGES.curve[1]) * 0.5,
  right: (BILLBOARD_PARTITION_RANGES.right[0] + BILLBOARD_PARTITION_RANGES.right[1]) * 0.5
};
let loopRowGap = 0;
let knownDirections = [];
let sharedOutputs = [];
let activeSidebarKey = null;
let activeDirectionName = null;
let settingsPanelAllowed = true;
let isSettingsPanelOpen = false;
let isViewControlsPanelOpen = false;
let previewViewMode = "flat";
let preview3dSurface = null;
let preview3dRenderToken = 0;
const preview3dImageCache = new Map();
let preview3dPrevBaseOffset = null;
const preview3dThreeState = {
  renderer: null,
  scene: null,
  camera: null,
  mesh: null,
  annotationGroup: null,
  partitionMeshes: {
    left: null,
    curve: null,
    right: null
  },
  texture: null,
  partitionTextures: {
    left: null,
    curve: null,
    right: null
  },
  modelCamera: null,
  modelCameras: [],
  activeModelCameraUuid: "",
  useModelCamera: false,
  textureSource: "",
  textureRequestToken: 0,
  textureScrollBaseX: 0,
  textureOffsetY: 0,
  textureMode: "linear",
  loopTextureState: null,
  modelLoadAttempted: false,
  modelLoading: false,
  modelLoaded: false
};
let hasWarnedMissingThree = false;
let preview3dAnimationFrameId = null;
let preview3dPlaybackSyncState = {
  hasSample: false,
  elapsedSeconds: 0,
  elapsedContinuous: 0,
  lastSampleElapsed: 0,
  durationSeconds: 1,
  syncedAtMs: 0
};
const PREVIEW3D_CAMERA_PRESET_VERSION = "2026-03-13-front-v5";
const PREVIEW3D_CAMERA_DEFAULTS = {
  yaw: -0.7,
  pitch: 0.11,
  perspective: 1.33,
  zoom: 2.68,
  targetX: 241,
  targetY: 2973,
  targetZ: 0
};
const PREVIEW3D_CAMERA_PRESETS = {
  iso: {
    label: "ISO",
    camera: { ...PREVIEW3D_CAMERA_DEFAULTS }
  },
  left: {
    label: "LEFT",
    camera: {
      yaw: -1.46,
      pitch: 0.02,
      perspective: 1.12,
      zoom: 2.56,
      targetX: -1820,
      targetY: 2973,
      targetZ: 0
    }
  },
  right: {
    label: "RIGHT",
    camera: {
      yaw: 1.18,
      pitch: 0.02,
      perspective: 1.12,
      zoom: 2.56,
      targetX: 1700,
      targetY: 2973,
      targetZ: 0
    }
  }
};
const PREVIEW3D_RENDER_DEFAULTS = {
  projectionBrightness: 3.4,
  projectionShadow: 0.7,
  projectionGlare: 0.9
};
const PREVIEW3D_FIXED_FRAME_FIT = 0.72;
const PREVIEW3D_FIXED_DRAG_SENSITIVITY = 1;
const PREVIEW3D_FIXED_TEXTURE_QUALITY = 1.75;
const ENABLE_3D_ARTWORK_PROJECTION = true;
const preview3dCamera = { ...PREVIEW3D_CAMERA_DEFAULTS };
const preview3dRenderSettings = { ...PREVIEW3D_RENDER_DEFAULTS };
let preview3dCameraPreset = "iso";
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

function getDirectionDisplayName(name) {
  const raw = String(name || "").trim();
  if (!raw) {
    return "";
  }
  const mapped = DIRECTION_DISPLAY_NAMES[raw.toLowerCase()];
  return mapped || raw;
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

function sanitizePartitionSettingsEntry(input) {
  const source = input && typeof input === "object" ? input : {};
  const secondsRaw = Number(source.seconds);
  const padTopBottomRaw = Number(source.padTopBottom);
  const padLeftRightRaw = Number(source.padLeftRight);
  const assetGapRaw = Number(source.assetGap);
  const rowCountRaw = Number(source.rowCount);
  const rowOffsetRaw = Number(source.rowOffset);
  const rowGapRaw = Number(source.rowGap);
  return {
    seconds: Number.isFinite(secondsRaw) && secondsRaw > 0 ? secondsRaw : DEFAULT_PARTITION_SETTINGS_ENTRY.seconds,
    padTopBottom:
      Number.isFinite(padTopBottomRaw) && padTopBottomRaw >= 0
        ? padTopBottomRaw
        : DEFAULT_PARTITION_SETTINGS_ENTRY.padTopBottom,
    padLeftRight:
      Number.isFinite(padLeftRightRaw) && padLeftRightRaw >= 0
        ? padLeftRightRaw
        : DEFAULT_PARTITION_SETTINGS_ENTRY.padLeftRight,
    backgroundColor:
      typeof source.backgroundColor === "string" && /^#[0-9a-f]{6}$/i.test(source.backgroundColor)
        ? source.backgroundColor
        : DEFAULT_PARTITION_SETTINGS_ENTRY.backgroundColor,
    assetColor:
      typeof source.assetColor === "string" && /^#[0-9a-f]{6}$/i.test(source.assetColor)
        ? source.assetColor
        : DEFAULT_PARTITION_SETTINGS_ENTRY.assetColor,
    assetGap: Number.isFinite(assetGapRaw) && assetGapRaw >= 0 ? assetGapRaw : DEFAULT_PARTITION_SETTINGS_ENTRY.assetGap,
    rowCount:
      Number.isFinite(rowCountRaw) && rowCountRaw >= 1
        ? Math.round(rowCountRaw)
        : DEFAULT_PARTITION_SETTINGS_ENTRY.rowCount,
    rowOffset:
      Number.isFinite(rowOffsetRaw) && rowOffsetRaw >= 0
        ? rowOffsetRaw
        : DEFAULT_PARTITION_SETTINGS_ENTRY.rowOffset,
    rowGap: Number.isFinite(rowGapRaw) && rowGapRaw >= 0 ? rowGapRaw : DEFAULT_PARTITION_SETTINGS_ENTRY.rowGap
  };
}

function createDefaultPartitionSettings() {
  return {
    left: sanitizePartitionSettingsEntry(DEFAULT_PARTITION_SETTINGS_ENTRY),
    curve: sanitizePartitionSettingsEntry(DEFAULT_PARTITION_SETTINGS_ENTRY),
    right: sanitizePartitionSettingsEntry(DEFAULT_PARTITION_SETTINGS_ENTRY)
  };
}

function normalizePartitionKey(key) {
  const clean = String(key || "").toLowerCase();
  return PARTITION_KEYS.includes(clean) ? clean : null;
}

function activePartitionSettingsKeyValue() {
  const selected = normalizePartitionKey(activePartitionSettingsKey);
  return selected || "left";
}

function partitionSettingsForKey(partitionKey) {
  const key = normalizePartitionKey(partitionKey) || "left";
  const entry = partitionSettingsByKey && partitionSettingsByKey[key] ? partitionSettingsByKey[key] : null;
  return sanitizePartitionSettingsEntry(entry);
}

function applyPartitionSettingsToControls(partitionKey) {
  const key = normalizePartitionKey(partitionKey) || "left";
  const settings = partitionSettingsForKey(key);
  activePartitionSettingsKey = key;
  partitionSettingsTabs.forEach((tab) => {
    const tabKey = normalizePartitionKey(tab.dataset.partitionKey);
    const isActive = tabKey === key;
    tab.classList.toggle("inactive", !isActive);
    tab.setAttribute("aria-selected", isActive ? "true" : "false");
  });
  if (partitionActiveOrientationLabel) {
    const label =
      key === "left" ? "7th orientation" : key === "curve" ? "curve orientation" : "47th orientation";
    partitionActiveOrientationLabel.textContent = label;
  }
  const targetControlId =
    key === "left"
      ? "partitionOrientationLeftControl"
      : key === "curve"
        ? "partitionOrientationCurveControl"
        : "partitionOrientationRightControl";
  [partitionActiveOrientationHorizontal, partitionActiveOrientationVertical].forEach((button) => {
    if (button) {
      button.dataset.orientationTarget = targetControlId;
    }
  });
  if (speedControl) {
    speedControl.value = String(settings.seconds);
  }
  if (padTBControl) {
    padTBControl.value = String(settings.padTopBottom);
  }
  if (padLRControl) {
    padLRControl.value = String(settings.padLeftRight);
  }
  if (bgColorControl) {
    bgColorControl.value = settings.backgroundColor;
  }
  if (assetColorControl) {
    assetColorControl.value = settings.assetColor;
  }
  if (assetGapControl) {
    assetGapControl.value = String(settings.assetGap);
  }
  if (rowCountControl) {
    rowCountControl.value = String(settings.rowCount);
  }
  if (rowOffsetControl) {
    rowOffsetControl.value = String(settings.rowOffset);
  }
  if (rowGapControl) {
    rowGapControl.value = String(settings.rowGap);
  }
  loopDurationSeconds = settings.seconds;
  loopTraverseSeconds = settings.seconds;
  loopAssetGap = settings.assetGap;
  loopRowGap = settings.rowGap;
  syncOrientationToggleStates();
  syncSpeedReadout();
  syncVisualizationBackground();
}

function writeCurrentControlsToPartitionSettings(partitionKey) {
  const key = normalizePartitionKey(partitionKey) || activePartitionSettingsKeyValue();
  partitionSettingsByKey[key] = sanitizePartitionSettingsEntry({
    seconds: currentSpeedSeconds(),
    padTopBottom: currentPadTopBottom(),
    padLeftRight: currentPadLeftRight(),
    backgroundColor: currentBackgroundColor(),
    assetColor: currentAssetColor(),
    assetGap: currentAssetGap(),
    rowCount: currentRowCount(),
    rowOffset: currentRowOffset(),
    rowGap: currentRowGap()
  });
}

function isPartitionedDirection(name) {
  return String(name || "").toLowerCase() === PARTITION_DIRECTION_NAME;
}

function isLoopMakerDirection(name) {
  return String(name || "").toLowerCase() === LOOP_MAKER_DIRECTION_NAME;
}

function currentDirectionIsPartitioned() {
  return isPartitionedDirection(activeDirectionName || getCurrentDirectionName());
}

function currentDirectionIsLoopMaker() {
  return isLoopMakerDirection(activeDirectionName || getCurrentDirectionName());
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
  return ["svg", "png", "jpg", "jpeg", "jpt", "gif", "pdf"].includes(extension);
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

const svgAssetColorCache = new Map();

function isLikelySvgSource(src) {
  const value = String(src || "").trim().toLowerCase();
  if (!value) {
    return false;
  }
  return value.startsWith("data:image/svg+xml") || /\.svg([?#].*)?$/.test(value);
}

function decodeSvgDataUrl(dataUrl) {
  const raw = String(dataUrl || "");
  const commaIndex = raw.indexOf(",");
  if (commaIndex < 0) {
    return "";
  }
  const meta = raw.slice(0, commaIndex).toLowerCase();
  const payload = raw.slice(commaIndex + 1);
  try {
    if (meta.includes(";base64")) {
      return atob(payload);
    }
    return decodeURIComponent(payload);
  } catch (error) {
    return "";
  }
}

async function readSvgSourceText(src) {
  const value = String(src || "").trim();
  if (!value || !isLikelySvgSource(value)) {
    return "";
  }
  if (value.toLowerCase().startsWith("data:image/svg+xml")) {
    return decodeSvgDataUrl(value);
  }
  try {
    const response = await fetch(value, { cache: "force-cache" });
    if (!response.ok) {
      return "";
    }
    return await response.text();
  } catch (error) {
    return "";
  }
}

function applyColorToSvgText(svgText, color) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(String(svgText || ""), "image/svg+xml");
  const svg = doc.querySelector("svg");
  if (!svg) {
    return "";
  }
  const styleNodes = [...svg.querySelectorAll("style")];
  styleNodes.forEach((styleNode) => {
    const css = String(styleNode.textContent || "");
    if (!css) {
      return;
    }
    styleNode.textContent = css
      .replace(/fill\s*:\s*[^;}{!]+(!important)?/gi, `fill:${color}$1`)
      .replace(/stroke\s*:\s*[^;}{!]+(!important)?/gi, `stroke:${color}$1`);
  });
  const paintableTags = new Set([
    "path",
    "rect",
    "circle",
    "ellipse",
    "polygon",
    "polyline",
    "line",
    "text",
    "g"
  ]);
  const nodes = [svg, ...svg.querySelectorAll("*")];
  nodes.forEach((node) => {
    const tag = String(node.tagName || "").toLowerCase();
    if (!paintableTags.has(tag)) {
      return;
    }
    const fill = node.getAttribute("fill");
    const stroke = node.getAttribute("stroke");
    const fillValue = String(fill || "").toLowerCase();
    const strokeValue = String(stroke || "").toLowerCase();
    if ((!fill || fillValue !== "none") && !fillValue.startsWith("url(")) {
      node.setAttribute("fill", color);
    }
    if (stroke && strokeValue !== "none" && !strokeValue.startsWith("url(")) {
      node.setAttribute("stroke", color);
    }
    const style = node.getAttribute("style");
    if (style) {
      const rewritten = style
        .replace(/fill\s*:\s*[^;]+/gi, `fill:${color}`)
        .replace(/stroke\s*:\s*[^;]+/gi, `stroke:${color}`);
      node.setAttribute("style", rewritten);
    }
  });
  return new XMLSerializer().serializeToString(svg);
}

async function colorizeSvgSource(src, color) {
  if (!isLikelySvgSource(src) || !/^#[0-9a-f]{6}$/i.test(color || "")) {
    return src;
  }
  const cacheKey = `${src}::${color.toLowerCase()}`;
  if (svgAssetColorCache.has(cacheKey)) {
    return svgAssetColorCache.get(cacheKey);
  }
  const pending = (async () => {
    const text = await readSvgSourceText(src);
    if (!text) {
      return src;
    }
    const colored = applyColorToSvgText(text, color);
    if (!colored) {
      return src;
    }
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(colored)}`;
  })();
  svgAssetColorCache.set(cacheKey, pending);
  return pending;
}

async function applyAssetColorToSources(sources, color) {
  if (!Array.isArray(sources) || !sources.length) {
    return [];
  }
  if (!/^#[0-9a-f]{6}$/i.test(color || "")) {
    return [...sources];
  }
  const tinted = await Promise.all(sources.map((src) => colorizeSvgSource(src, color)));
  return tinted;
}

function editorAssetColorForPartition(partitionKey = null) {
  if (currentDirectionIsPartitioned() && partitionKey) {
    return partitionSettingsForKey(partitionKey).assetColor;
  }
  return currentAssetColor();
}

function applyEditorAssetColorToImage(imageElement, src, partitionKey = null) {
  if (!imageElement) {
    return;
  }
  const source = String(src || "");
  imageElement.src = source;
  const color = editorAssetColorForPartition(partitionKey);
  const requestKey = `${source}::${color}::${Date.now()}::${Math.random().toString(36).slice(2, 8)}`;
  imageElement.dataset.colorizeRequestKey = requestKey;
  colorizeSvgSource(source, color).then((coloredSrc) => {
    if (imageElement.dataset.colorizeRequestKey !== requestKey) {
      return;
    }
    imageElement.src = coloredSrc;
  });
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
  if (extension === "gif") {
    // Preserve GIF animation; raster conversion would flatten to a single frame.
    return readFileAsDataUrl(file);
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
  const loopMaker = currentDirectionIsLoopMaker();
  if (appShell) {
    appShell.classList.toggle("partitioned-mode", partitioned);
    appShell.classList.toggle("loop-maker-mode", loopMaker);
  }
  if (partitionEditors) {
    partitionEditors.style.display = partitioned && !loopMaker ? "grid" : "none";
  }
  if (settingsTitle) {
    const base = getDirectionDisplayName(activeDirectionName || "single");
    settingsTitle.textContent = `${base} settings`;
  }
  if (settingsToggleButton) {
    settingsToggleButton.style.display = loopMaker ? "none" : "";
  }
  if (viewControlsToggleButton) {
    viewControlsToggleButton.style.display = loopMaker ? "none" : "";
  }
  if (loopMaker) {
    if (previewViewMode !== "flat") {
      applyPreviewViewMode("flat");
    }
    setSettingsPanelVisibility(false);
    setViewControlsPanelVisibility(false);
  }
  if (linearOrientationRow) {
    linearOrientationRow.style.display = partitioned ? "none" : "";
  }
  if (partitionOrientationRows) {
    partitionOrientationRows.style.display = partitioned ? "" : "none";
  }
  if (partitioned) {
    applyPartitionSettingsToControls(activePartitionSettingsKeyValue());
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

function current3dPartitionOrientation(partitionKey) {
  const key = normalizePartitionKey(partitionKey);
  if (!key) {
    return "horizontal";
  }
  const orientations = currentPartitionArtworkOrientations();
  return orientations[key] === "vertical" ? "vertical" : "horizontal";
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

function current3dPartitionSources(partitionKey) {
  const key = normalizePartitionKey(partitionKey);
  if (!key) {
    return [];
  }
  const raw = Array.isArray(partitionArtworks[key]) ? partitionArtworks[key] : [];
  const sources = raw.map((item) => normalize3dArtworkSource(item.src)).filter((src) => !!src);
  if (sources.length) {
    return sources;
  }
  return ["assets/linear-loop-strip.png"];
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

async function build3dSurfaceStripFromConfig(targetHeight, sources, orientation, options = {}) {
  if (!sources.length) {
    return null;
  }
  const images = (await Promise.all(sources.map((src) => load3dImage(src)))).filter((img) => !!img);
  if (!images.length) {
    return null;
  }

  const preserveInlineWhenVertical = options && options.preserveInlineWhenVertical === true;
  const rotateAssetsInStrip = orientation === "vertical" && !preserveInlineWhenVertical;
  const padLRDesign = Math.max(
    0,
    Number(options && options.padLeftRight !== undefined ? options.padLeftRight : currentPadLeftRight()) || 0
  );
  const padTBDesign = Math.max(
    0,
    Math.min(
      BILLBOARD_DESIGN_HEIGHT / 2 - 1,
      Number(options && options.padTopBottom !== undefined ? options.padTopBottom : currentPadTopBottom()) || 0
    )
  );
  const gapDesign = Math.max(
    0,
    Number(options && options.assetGap !== undefined ? options.assetGap : currentAssetGap()) || 0
  );
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
    if (rotateAssetsInStrip) {
      return Math.max(1, (sourceHeight / sourceWidth) * artworkHeightDesign);
    }
    return Math.max(1, (sourceWidth / sourceHeight) * artworkHeightDesign);
  });
  const widths = widthsDesign.map((width) => Math.max(1, Math.round(width * scale)));
  const sequenceWidth = Math.max(
    1,
    // Include the wrap gap (last -> first) so single-asset loops still show asset gap.
    Math.round(
      padLRPx * 2 + widths.reduce((sum, value) => sum + value, 0) + Math.max(0, images.length) * gapPx
    )
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
  stripCtx.fillStyle = options && options.backgroundColor ? options.backgroundColor : currentBackgroundColor();
  stripCtx.fillRect(0, 0, stripCanvas.width, stripCanvas.height);

  const drawSequence = (startX) => {
    let cursor = startX + padLRPx;
    images.forEach((img, idx) => {
      const drawWidth = widths[idx];
      if (rotateAssetsInStrip) {
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

async function build3dSurfaceStrip(targetHeight) {
  const sources = await applyAssetColorToSources(current3dSources(), currentAssetColor());
  const orientation = current3dOrientation();
  return build3dSurfaceStripFromConfig(targetHeight, sources, orientation);
}

async function build3dPartitionSurfaceStrip(targetHeight, partitionKey, orientationOverride = null) {
  const settings = partitionSettingsForKey(partitionKey);
  const sources = await applyAssetColorToSources(current3dPartitionSources(partitionKey), settings.assetColor);
  const orientation = orientationOverride || current3dPartitionOrientation(partitionKey);
  return build3dSurfaceStripFromConfig(targetHeight, sources, orientation, {
    // Keep partition artwork inline in vertical mode; rotate only at draw time.
    preserveInlineWhenVertical: true,
    padTopBottom: settings.padTopBottom,
    padLeftRight: settings.padLeftRight,
    assetGap: settings.assetGap,
    backgroundColor: settings.backgroundColor
  });
}

function buildTopViewSpine() {
  const leftLength = BILLBOARD_LEFT_WIDTH;
  const curveLength = BILLBOARD_CURVE_WIDTH;
  const rightLength = BILLBOARD_RIGHT_WIDTH;
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

function computeBillboardCurveSample(distanceAlongWidth) {
  const leftLength = BILLBOARD_LEFT_WIDTH;
  const curveLength = BILLBOARD_CURVE_WIDTH;
  const rightLength = BILLBOARD_RIGHT_WIDTH;
  const totalLength = leftLength + curveLength + rightLength;
  const s = Math.max(0, Math.min(totalLength, Number(distanceAlongWidth) || 0));
  const radius = curveLength / (Math.PI / 2);

  if (s <= leftLength) {
    return { x: s, z: 0 };
  }

  if (s <= leftLength + curveLength) {
    const t = (s - leftLength) / curveLength;
    const theta = (Math.PI / 2) * (1 - t);
    return {
      x: leftLength + radius * Math.cos(theta),
      z: -radius + radius * Math.sin(theta)
    };
  }

  const rightDistance = s - leftLength - curveLength;
  return {
    x: leftLength + radius,
    z: -radius - Math.min(rightLength, rightDistance)
  };
}

function computeBillboardCurveCenter() {
  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
  const sampleCount = 320;
  for (let i = 0; i <= sampleCount; i += 1) {
    const s = (i / sampleCount) * BILLBOARD_DESIGN_WIDTH;
    const sample = computeBillboardCurveSample(s);
    minX = Math.min(minX, sample.x);
    maxX = Math.max(maxX, sample.x);
    minZ = Math.min(minZ, sample.z);
    maxZ = Math.max(maxZ, sample.z);
  }
  return {
    x: (minX + maxX) * 0.5,
    z: (minZ + maxZ) * 0.5
  };
}

const BILLBOARD_CURVE_CENTER = computeBillboardCurveCenter();

function createCurvedBillboardGeometry(THREE, startDistance = 0, endDistance = BILLBOARD_DESIGN_WIDTH) {
  const safeStart = Math.max(0, Math.min(BILLBOARD_DESIGN_WIDTH, Number(startDistance) || 0));
  const safeEnd = Math.max(safeStart + 1, Math.min(BILLBOARD_DESIGN_WIDTH, Number(endDistance) || 0));
  const segmentWidth = Math.max(1, safeEnd - safeStart);
  const widthSegments = Math.max(8, Math.round(200 * (segmentWidth / BILLBOARD_DESIGN_WIDTH)));
  const geometry = new THREE.PlaneGeometry(segmentWidth, BILLBOARD_DESIGN_HEIGHT, widthSegments, 1);
  const positions = geometry.attributes.position;

  for (let i = 0; i < positions.count; i += 1) {
    const originalX = positions.getX(i);
    const normalized = (originalX + segmentWidth * 0.5) / segmentWidth;
    const distanceAlongWidth = safeStart + normalized * segmentWidth;
    const sample = computeBillboardCurveSample(distanceAlongWidth);
    positions.setX(i, sample.x - BILLBOARD_CURVE_CENTER.x);
    positions.setZ(i, sample.z - BILLBOARD_CURVE_CENTER.z);
  }

  positions.needsUpdate = true;
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  geometry.computeVertexNormals();
  return geometry;
}

function create3dTextSprite(THREE, text, options = {}) {
  const label = String(text || "");
  const fontSize = Math.max(18, Number(options.fontSize) || 56);
  const paddingX = Math.max(8, Number(options.paddingX) || 24);
  const paddingY = Math.max(6, Number(options.paddingY) || 14);
  const fontFamily = options.fontFamily || '"Courier New", Courier, monospace';
  const fontSpec = `${fontSize}px ${fontFamily}`;
  const measureCanvas = document.createElement("canvas");
  const measureCtx = measureCanvas.getContext("2d");
  if (!measureCtx) {
    return null;
  }
  measureCtx.font = fontSpec;
  const measured = Math.max(1, Math.ceil(measureCtx.measureText(label).width));
  const canvas = document.createElement("canvas");
  canvas.width = measured + paddingX * 2;
  canvas.height = fontSize + paddingY * 2;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return null;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = fontSpec;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = options.color || "#101010";
  ctx.fillText(label, canvas.width / 2, canvas.height / 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    depthTest: true
  });
  const sprite = new THREE.Sprite(material);
  const worldHeightRaw = Number(options.worldHeight);
  const worldHeight = Number.isFinite(worldHeightRaw) && worldHeightRaw > 0 ? worldHeightRaw : 20;
  const aspect = canvas.width / canvas.height;
  sprite.scale.set(worldHeight * aspect, worldHeight, 1);
  return sprite;
}

function create3dTextLabelMesh(THREE, text, options = {}) {
  const label = String(text || "");
  const fontSize = Math.max(14, Number(options.fontSize) || 36);
  const paddingX = Math.max(6, Number(options.paddingX) || 18);
  const paddingY = Math.max(4, Number(options.paddingY) || 10);
  const fontFamily = options.fontFamily || '"Courier New", Courier, monospace';
  const fontSpec = `${fontSize}px ${fontFamily}`;
  const measureCanvas = document.createElement("canvas");
  const measureCtx = measureCanvas.getContext("2d");
  if (!measureCtx) {
    return null;
  }
  measureCtx.font = fontSpec;
  const measured = Math.max(1, Math.ceil(measureCtx.measureText(label).width));
  const canvas = document.createElement("canvas");
  canvas.width = measured + paddingX * 2;
  canvas.height = fontSize + paddingY * 2;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return null;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = fontSpec;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = options.color || "#101010";
  ctx.fillText(label, canvas.width / 2, canvas.height / 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    side: THREE.DoubleSide
  });
  const worldHeightRaw = Number(options.worldHeight);
  const worldHeight = Number.isFinite(worldHeightRaw) && worldHeightRaw > 0 ? worldHeightRaw : 20;
  const aspect = canvas.width / canvas.height;
  const geometry = new THREE.PlaneGeometry(worldHeight * aspect, worldHeight, 1, 1);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false;
  return mesh;
}

function sampleMeshLocalPointByUv(THREE, mesh, uTarget, vTarget) {
  if (!THREE || !mesh || !mesh.geometry) {
    return null;
  }
  const geometry = mesh.geometry;
  const uvAttr = geometry.attributes && geometry.attributes.uv ? geometry.attributes.uv : null;
  const posAttr = geometry.attributes && geometry.attributes.position ? geometry.attributes.position : null;
  if (!uvAttr || !posAttr || uvAttr.count !== posAttr.count || uvAttr.count <= 0) {
    return null;
  }
  let bestIndex = 0;
  let bestScore = Infinity;
  for (let i = 0; i < uvAttr.count; i += 1) {
    const du = uvAttr.getX(i) - uTarget;
    const dv = uvAttr.getY(i) - vTarget;
    const score = du * du + dv * dv * 1.2;
    if (score < bestScore) {
      bestScore = score;
      bestIndex = i;
    }
  }
  return new THREE.Vector3(posAttr.getX(bestIndex), posAttr.getY(bestIndex), posAttr.getZ(bestIndex));
}

function sampleMeshTopEdgePointByRatio(THREE, mesh, ratio) {
  if (!THREE || !mesh || !mesh.geometry) {
    return null;
  }
  const geometry = mesh.geometry;
  const posAttr = geometry.attributes && geometry.attributes.position ? geometry.attributes.position : null;
  if (!posAttr || posAttr.count <= 0) {
    return null;
  }
  if (!geometry.boundingBox) {
    geometry.computeBoundingBox();
  }
  const box = geometry.boundingBox;
  if (!box) {
    return null;
  }
  const clampedRatio = Math.max(0, Math.min(1, Number(ratio) || 0));
  const topY = box.max.y;
  const height = Math.max(1e-6, box.max.y - box.min.y);
  const tolerance = Math.max(1e-4, height * 0.03);
  const candidates = [];
  for (let i = 0; i < posAttr.count; i += 1) {
    const x = posAttr.getX(i);
    const y = posAttr.getY(i);
    const z = posAttr.getZ(i);
    if (y >= topY - tolerance) {
      candidates.push(new THREE.Vector3(x, y, z));
    }
  }
  if (candidates.length < 2) {
    return new THREE.Vector3(
      box.min.x + (box.max.x - box.min.x) * clampedRatio,
      topY,
      (box.min.z + box.max.z) * 0.5
    );
  }
  candidates.sort((a, b) => (a.x === b.x ? a.z - b.z : a.x - b.x));
  const points = [];
  const minDistance = Math.max(1e-5, Math.max(box.max.x - box.min.x, box.max.z - box.min.z) * 0.0012);
  candidates.forEach((point) => {
    if (!points.length || points[points.length - 1].distanceTo(point) >= minDistance) {
      points.push(point);
    }
  });
  if (points.length < 2) {
    return points[0].clone();
  }
  let total = 0;
  for (let i = 1; i < points.length; i += 1) {
    total += points[i - 1].distanceTo(points[i]);
  }
  if (!Number.isFinite(total) || total <= 1e-6) {
    return points[Math.round((points.length - 1) * clampedRatio)].clone();
  }
  const target = total * clampedRatio;
  let traveled = 0;
  for (let i = 1; i < points.length; i += 1) {
    const a = points[i - 1];
    const b = points[i];
    const seg = a.distanceTo(b);
    if (traveled + seg >= target) {
      const t = (target - traveled) / seg;
      return new THREE.Vector3(
        a.x + (b.x - a.x) * t,
        a.y + (b.y - a.y) * t,
        a.z + (b.z - a.z) * t
      );
    }
    traveled += seg;
  }
  return points[points.length - 1].clone();
}

function sampleMeshUvFrame(THREE, mesh, u, v, sampleStep = 0.02) {
  if (!THREE || !mesh) {
    return null;
  }
  const clamp01 = (value) => Math.max(0, Math.min(1, Number(value) || 0));
  const u0 = clamp01(u);
  const v0 = clamp01(v);
  const center = sampleMeshLocalPointByUv(THREE, mesh, u0, v0);
  if (!center) {
    return null;
  }
  const du = Math.max(0.005, Math.min(0.08, sampleStep));
  const dv = Math.max(0.005, Math.min(0.08, sampleStep));
  const left = sampleMeshLocalPointByUv(THREE, mesh, clamp01(u0 - du), v0) || center;
  const right = sampleMeshLocalPointByUv(THREE, mesh, clamp01(u0 + du), v0) || center;
  const down = sampleMeshLocalPointByUv(THREE, mesh, u0, clamp01(v0 - dv)) || center;
  const tangentU = right.clone().sub(left);
  const tangentV = center.clone().sub(down);
  if (tangentU.lengthSq() <= 1e-8 || tangentV.lengthSq() <= 1e-8) {
    return {
      point: center,
      up: new THREE.Vector3(0, 1, 0),
      normal: new THREE.Vector3(0, 0, 1),
      tangentU: new THREE.Vector3(1, 0, 0)
    };
  }
  const tangentUNormalized = tangentU.clone().normalize();
  const up = tangentV.clone().normalize();
  let normal = tangentU.clone().cross(up).normalize();
  if (normal.lengthSq() <= 1e-8) {
    normal = new THREE.Vector3(0, 0, 1);
  }
  return {
    point: center,
    up,
    normal,
    tangentU: tangentUNormalized
  };
}

function build3dPartitionAnnotationsForMesh(THREE, mesh) {
  if (!THREE || !mesh || !mesh.geometry) {
    return null;
  }
  const group = new THREE.Group();
  group.name = "partition-annotations";
  const centerTop = sampleMeshUvFrame(THREE, mesh, 0.5, 0.97, 0.03);
  const centerBottom = sampleMeshUvFrame(THREE, mesh, 0.5, 0.03, 0.03);
  if (!centerTop || !centerBottom) {
    return null;
  }
  const meshHeight = Math.max(1, centerTop.point.distanceTo(centerBottom.point));
  const outwardOffset = Math.max(0.001, meshHeight * 0.001);
  const partitionLabelLift = Math.max(0.001, meshHeight * 0.032);
  const worldUp = new THREE.Vector3(0, 1, 0);
  const partitionLabels = [
    { key: "left", text: "7th" },
    { key: "curve", text: "curve" },
    { key: "right", text: "47th" }
  ];
  partitionLabels.forEach(({ key, text }) => {
    const centerDistance = BILLBOARD_PARTITION_CENTERS[key] / BILLBOARD_DESIGN_WIDTH;
    const frameNearTop = sampleMeshUvFrame(THREE, mesh, centerDistance, 0.985, 0.028);
    const frameNearBottom = sampleMeshUvFrame(THREE, mesh, centerDistance, 0.015, 0.028);
    const frame =
      frameNearTop && frameNearBottom
        ? frameNearTop.point.y >= frameNearBottom.point.y
          ? frameNearTop
          : frameNearBottom
        : frameNearTop || frameNearBottom;
    if (!frame || !frame.normal) {
      return;
    }
    const labelSprite = create3dTextSprite(THREE, text, {
      worldHeight: Math.max(0.001, meshHeight * 0.028),
      color: "#111111",
      fontSize: 34
    });
    if (!labelSprite) {
      return;
    }
    labelSprite.position.copy(
      frame.point
        .clone()
        .add(worldUp.clone().multiplyScalar(partitionLabelLift))
        .add(frame.normal.clone().multiplyScalar(outwardOffset * 1.2))
    );
    labelSprite.renderOrder = 1000;
    group.add(labelSprite);
  });
  group.renderOrder = 998;
  return group;
}

function attach3dPartitionAnnotations(THREE, mesh) {
  const previous = preview3dThreeState.annotationGroup;
  if (previous) {
    if (previous.parent) {
      previous.parent.remove(previous);
    }
    previous.traverse((node) => {
      if (node.material && typeof node.material.dispose === "function") {
        node.material.dispose();
      }
      if (node.material && node.material.map && typeof node.material.map.dispose === "function") {
        node.material.map.dispose();
      }
      if (node.geometry && typeof node.geometry.dispose === "function") {
        node.geometry.dispose();
      }
    });
  }
  const next = build3dPartitionAnnotationsForMesh(THREE, mesh);
  if (next && mesh && typeof mesh.add === "function") {
    mesh.add(next);
  }
  preview3dThreeState.annotationGroup = next || null;
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
  preview3dCamera.perspective = Math.min(2.5, Math.max(0.1, preview3dCamera.perspective));
  preview3dCamera.zoom = Math.min(4.5, Math.max(0.12, preview3dCamera.zoom));
  preview3dCamera.targetX = Math.min(3500, Math.max(-3500, preview3dCamera.targetX));
  preview3dCamera.targetY = Math.min(6000, Math.max(-6000, preview3dCamera.targetY));
  preview3dCamera.targetZ = Math.min(4500, Math.max(-4500, preview3dCamera.targetZ));
  preview3dRenderSettings.projectionBrightness = Math.min(
    5,
    Math.max(0, preview3dRenderSettings.projectionBrightness)
  );
  preview3dRenderSettings.projectionShadow = Math.min(2, Math.max(0, preview3dRenderSettings.projectionShadow));
  preview3dRenderSettings.projectionGlare = Math.min(2, Math.max(0, preview3dRenderSettings.projectionGlare));
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
  if (cameraZoomControl) {
    cameraZoomControl.value = String(preview3dCamera.zoom);
  }
  if (cameraTargetXControl) {
    cameraTargetXControl.value = String(preview3dCamera.targetX);
  }
  if (cameraTargetYControl) {
    cameraTargetYControl.value = String(preview3dCamera.targetY);
  }
  if (cameraTargetZControl) {
    cameraTargetZControl.value = String(preview3dCamera.targetZ);
  }
  if (projectionBrightnessControl) {
    projectionBrightnessControl.value = String(preview3dRenderSettings.projectionBrightness);
  }
  if (projectionShadowControl) {
    projectionShadowControl.value = String(preview3dRenderSettings.projectionShadow);
  }
  if (projectionGlareControl) {
    projectionGlareControl.value = String(preview3dRenderSettings.projectionGlare);
  }
  if (previewViewModeControl) {
    previewViewModeControl.value = previewViewMode;
  }
  syncViewModeToggleStates();
  syncViewControlReadouts();
}

function setViewControlReadout(id, value, decimals = 2) {
  const output = document.getElementById(id);
  if (!output) {
    return;
  }
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    output.textContent = "-";
    return;
  }
  output.textContent = decimals <= 0 ? String(Math.round(numeric)) : numeric.toFixed(decimals);
}

function syncViewControlReadouts() {
  setViewControlReadout("cameraYawValue", preview3dCamera.yaw, 2);
  setViewControlReadout("cameraPitchValue", preview3dCamera.pitch, 2);
  setViewControlReadout("cameraPerspectiveValue", preview3dCamera.perspective, 2);
  setViewControlReadout("cameraZoomValue", preview3dCamera.zoom, 2);
  setViewControlReadout("cameraTargetXValue", preview3dCamera.targetX, 0);
  setViewControlReadout("cameraTargetYValue", preview3dCamera.targetY, 0);
  setViewControlReadout("cameraTargetZValue", preview3dCamera.targetZ, 0);
  setViewControlReadout("projectionBrightnessValue", preview3dRenderSettings.projectionBrightness, 2);
  setViewControlReadout("projectionShadowValue", preview3dRenderSettings.projectionShadow, 2);
  setViewControlReadout("projectionGlareValue", preview3dRenderSettings.projectionGlare, 2);
}

function syncViewModeToggleStates() {
  viewModeChoiceButtons.forEach((button) => {
    const value = normalizePreviewViewMode(button.dataset.value);
    const isActive = previewViewMode === value;
    button.classList.toggle("inactive", !isActive);
    button.setAttribute("aria-checked", isActive ? "true" : "false");
  });
}

function setPreviewViewModeControlValue(value) {
  if (!previewViewModeControl) {
    return;
  }
  const normalized = normalizePreviewViewMode(value);
  const changed = normalizePreviewViewMode(previewViewModeControl.value) !== normalized;
  previewViewModeControl.value = normalized;
  if (changed) {
    previewViewModeControl.dispatchEvent(new Event("change", { bubbles: true }));
  } else {
    previewViewMode = normalized;
    syncViewModeToggleStates();
  }
}

function normalizePreview3dCameraPreset(value) {
  const key = String(value || "").toLowerCase();
  return Object.prototype.hasOwnProperty.call(PREVIEW3D_CAMERA_PRESETS, key) ? key : "iso";
}

function currentPreview3dCameraPreset() {
  return PREVIEW3D_CAMERA_PRESETS[normalizePreview3dCameraPreset(preview3dCameraPreset)];
}

function applyPreview3dCameraPreset(presetKey, options = {}) {
  const { persist = true, syncUi = true, render = true } = options;
  preview3dCameraPreset = normalizePreview3dCameraPreset(presetKey);
  const preset = currentPreview3dCameraPreset();
  if (preset && preset.camera) {
    Object.assign(preview3dCamera, preset.camera);
  }
  clampPreview3dCamera();
  if (persist) {
    persistPreview3dSettings();
  }
  if (syncUi) {
    syncViewControlsUI();
    if (blenderCameraControl) {
      blenderCameraControl.value = preview3dCameraPreset;
    }
  }
  if (render && previewViewMode === "3d") {
    render3dPreview();
  }
}

function applyDefaultPreview3dCameraState() {
  preview3dCameraPreset = "iso";
  const preset = currentPreview3dCameraPreset();
  if (preset && preset.camera) {
    Object.assign(preview3dCamera, preset.camera);
  } else {
    Object.assign(preview3dCamera, PREVIEW3D_CAMERA_DEFAULTS);
  }
  Object.assign(preview3dRenderSettings, PREVIEW3D_RENDER_DEFAULTS);
  clampPreview3dCamera();
}

function persistPreview3dSettings() {
  writeStorage(STORAGE_KEYS.cameraYaw, String(preview3dCamera.yaw));
  writeStorage(STORAGE_KEYS.cameraPitch, String(preview3dCamera.pitch));
  writeStorage(STORAGE_KEYS.cameraPerspective, String(preview3dCamera.perspective));
  writeStorage(STORAGE_KEYS.cameraZoom, String(preview3dCamera.zoom));
  writeStorage(STORAGE_KEYS.cameraTargetX, String(preview3dCamera.targetX));
  writeStorage(STORAGE_KEYS.cameraTargetY, String(preview3dCamera.targetY));
  writeStorage(STORAGE_KEYS.cameraTargetZ, String(preview3dCamera.targetZ));
  writeStorage(STORAGE_KEYS.projectionBrightness, String(preview3dRenderSettings.projectionBrightness));
  writeStorage(STORAGE_KEYS.projectionShadow, String(preview3dRenderSettings.projectionShadow));
  writeStorage(STORAGE_KEYS.projectionGlare, String(preview3dRenderSettings.projectionGlare));
  writeStorage(STORAGE_KEYS.cameraViewPreset, normalizePreview3dCameraPreset(preview3dCameraPreset));
  writeStorage(STORAGE_KEYS.cameraPresetVersion, PREVIEW3D_CAMERA_PRESET_VERSION);
}

function restorePreview3dSettings() {
  // Temporary safety mode: always start from ISO camera on load.
  applyDefaultPreview3dCameraState();
  preview3dRenderSettings.projectionBrightness = readStoredNumber(
    STORAGE_KEYS.projectionBrightness,
    PREVIEW3D_RENDER_DEFAULTS.projectionBrightness
  );
  preview3dRenderSettings.projectionShadow = readStoredNumber(
    STORAGE_KEYS.projectionShadow,
    PREVIEW3D_RENDER_DEFAULTS.projectionShadow
  );
  preview3dRenderSettings.projectionGlare = readStoredNumber(
    STORAGE_KEYS.projectionGlare,
    PREVIEW3D_RENDER_DEFAULTS.projectionGlare
  );
  clampPreview3dCamera();
  persistPreview3dSettings();
  return;

  // Legacy restore path kept below for quick re-enable later.
  const presetVersion = readStorage(STORAGE_KEYS.cameraPresetVersion);
  if (presetVersion !== PREVIEW3D_CAMERA_PRESET_VERSION) {
    applyDefaultPreview3dCameraState();
    persistPreview3dSettings();
    return;
  }
  preview3dCameraPreset = normalizePreview3dCameraPreset(readStorage(STORAGE_KEYS.cameraViewPreset));
  preview3dCamera.yaw = readStoredNumber(STORAGE_KEYS.cameraYaw, PREVIEW3D_CAMERA_DEFAULTS.yaw);
  preview3dCamera.pitch = readStoredNumber(STORAGE_KEYS.cameraPitch, PREVIEW3D_CAMERA_DEFAULTS.pitch);
  preview3dCamera.perspective = readStoredNumber(
    STORAGE_KEYS.cameraPerspective,
    PREVIEW3D_CAMERA_DEFAULTS.perspective
  );
  preview3dCamera.zoom = readStoredNumber(STORAGE_KEYS.cameraZoom, PREVIEW3D_CAMERA_DEFAULTS.zoom);
  preview3dCamera.targetX = readStoredNumber(STORAGE_KEYS.cameraTargetX, PREVIEW3D_CAMERA_DEFAULTS.targetX);
  preview3dCamera.targetY = readStoredNumber(STORAGE_KEYS.cameraTargetY, PREVIEW3D_CAMERA_DEFAULTS.targetY);
  preview3dCamera.targetZ = readStoredNumber(STORAGE_KEYS.cameraTargetZ, PREVIEW3D_CAMERA_DEFAULTS.targetZ);
  preview3dRenderSettings.projectionBrightness = readStoredNumber(
    STORAGE_KEYS.projectionBrightness,
    PREVIEW3D_RENDER_DEFAULTS.projectionBrightness
  );
  preview3dRenderSettings.projectionShadow = readStoredNumber(
    STORAGE_KEYS.projectionShadow,
    PREVIEW3D_RENDER_DEFAULTS.projectionShadow
  );
  preview3dRenderSettings.projectionGlare = readStoredNumber(
    STORAGE_KEYS.projectionGlare,
    PREVIEW3D_RENDER_DEFAULTS.projectionGlare
  );
  clampPreview3dCamera();
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

  if (preview3dDragState.dragMode === "perspective") {
    preview3dCamera.perspective += (-dy + dx * 0.35) * 0.003 * PREVIEW3D_FIXED_DRAG_SENSITIVITY;
  } else if (preview3dDragState.dragMode === "pan") {
    const canvasHeight = Math.max(1, billboard3dCanvas ? billboard3dCanvas.clientHeight || 1 : 1);
    const perspectiveFactor = Math.min(2.5, Math.max(0.1, preview3dCamera.perspective));
    const radius = (4200 * preview3dCamera.zoom) / perspectiveFactor;
    const panScale = (radius / canvasHeight) * 2.2;
    preview3dCamera.targetX -= dx * panScale * PREVIEW3D_FIXED_DRAG_SENSITIVITY;
    preview3dCamera.targetY += dy * panScale * PREVIEW3D_FIXED_DRAG_SENSITIVITY;
  } else {
    preview3dCamera.yaw += dx * 0.005 * PREVIEW3D_FIXED_DRAG_SENSITIVITY;
    preview3dCamera.pitch -= dy * 0.004 * PREVIEW3D_FIXED_DRAG_SENSITIVITY;
  }
  clampPreview3dCamera();
  syncViewControlsUI();
  if (previewViewMode === "3d") {
    update3dPreviewAnimation();
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
    const dragMode = event.shiftKey ? "pan" : event.button === 2 ? "perspective" : "orbit";
    preview3dDragState = {
      lastX: event.clientX,
      lastY: event.clientY,
      dragMode
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
  billboard3dCanvas.addEventListener(
    "wheel",
    (event) => {
      if (previewViewMode !== "3d") {
        return;
      }
      const delta = Number(event.deltaY) || 0;
      if (!delta) {
        return;
      }
      // Positive delta zooms out, negative delta zooms in.
      const factor = Math.exp(delta * 0.0012);
      preview3dCamera.zoom *= factor;
      clampPreview3dCamera();
      persistPreview3dSettings();
      syncViewControlsUI();
      update3dPreviewAnimation();
      event.preventDefault();
    },
    { passive: false }
  );
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
  const fit = PREVIEW3D_FIXED_FRAME_FIT;
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

function getThreeLib() {
  if (typeof window === "undefined") {
    return null;
  }
  return window.THREE || null;
}

function getGLTFLoaderClass() {
  if (typeof window === "undefined") {
    return null;
  }
  if (!Object.prototype.hasOwnProperty.call(window, "THREE_GLTFLoader")) {
    return undefined;
  }
  return window.THREE_GLTFLoader || null;
}

function chooseBillboardMeshFromModel(root, THREE) {
  if (!root || !THREE) {
    return null;
  }
  const hasUv = (node) =>
    !!(node && node.geometry && node.geometry.attributes && node.geometry.attributes.uv);
  const box = new THREE.Box3();
  const size = new THREE.Vector3();
  const candidates = [];
  root.traverse((node) => {
    if (!node || !node.isMesh) {
      return;
    }
    if (!hasUv(node)) {
      return;
    }
    box.setFromObject(node);
    box.getSize(size);
    const width = Math.max(0, size.x);
    const height = Math.max(0, size.y, size.z);
    if (width <= 0 || height <= 0) {
      return;
    }
    const ratio = width / height;
    if (!Number.isFinite(ratio) || ratio < 0.35 || ratio > 6.5) {
      return;
    }
    const areaScore = width * height;
    const name = String(node.name || "").toLowerCase();
    const exactScreenScore = name === "screen" ? 2000000000 : 0;
    const hintScore = BILLBOARD_MODEL_MESH_HINTS.some((hint) => name.includes(hint)) ? 1000000000 : 0;
    candidates.push({ node, score: exactScreenScore + hintScore + areaScore });
  });
  candidates.sort((a, b) => b.score - a.score);
  return candidates.length ? candidates[0].node : null;
}

function createNeutralBillboardMaterial(THREE) {
  return new THREE.MeshStandardMaterial({
    color: 0xbdbdbd,
    roughness: 0.95,
    metalness: 0,
    side: THREE.DoubleSide
  });
}

function tuneProjectionMaterial(material) {
  if (!material) {
    return;
  }
  const brightness = Math.max(0, Math.min(5, Number(preview3dRenderSettings.projectionBrightness) || 3.4));
  const glare = Math.max(0, Math.min(2, Number(preview3dRenderSettings.projectionGlare) || 0.9));
  if (material.color && typeof material.color.setRGB === "function") {
    material.color.setRGB(1, 1, 1);
  }
  if ("roughness" in material) {
    material.roughness = Math.max(0.05, Math.min(0.95, 0.68 - glare * 0.34));
  }
  if ("metalness" in material) {
    material.metalness = Math.max(0, Math.min(0.45, glare * 0.22));
  }
  if (material.emissive && typeof material.emissive.setHex === "function") {
    material.emissive.setHex(0xffffff);
    material.emissiveIntensity = Math.max(0, brightness);
  }
  if ("emissiveMap" in material) {
    material.emissiveMap = material.map || null;
  }
  if ("toneMapped" in material) {
    material.toneMapped = false;
  }
  material.needsUpdate = true;
}

function applyProjectionScreenFx(ctx, width, height) {
  if (!ctx || width <= 0 || height <= 0) {
    return;
  }
  const shadow = Math.max(0, Math.min(2, Number(preview3dRenderSettings.projectionShadow) || 0));
  const glare = Math.max(0, Math.min(2, Number(preview3dRenderSettings.projectionGlare) || 0));
  if (shadow <= 0 && glare <= 0) {
    return;
  }

  // Keep glare and shadow on opposite sides.
  const shadowStrength = Math.min(0.75, shadow * 0.34);
  const glareStrength = Math.min(0.48, glare * 0.22);
  const edgeSpan = Math.max(0.28, Math.min(0.56, 0.34 + glare * 0.08));

  if (shadowStrength > 0) {
    const shadowGradient = ctx.createLinearGradient(0, 0, width * edgeSpan, 0);
    shadowGradient.addColorStop(0, `rgba(0, 0, 0, ${shadowStrength.toFixed(4)})`);
    shadowGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = shadowGradient;
    ctx.fillRect(0, 0, width * edgeSpan, height);
  }

  if (glareStrength > 0) {
    const glareGradient = ctx.createLinearGradient(width, 0, width * (1 - edgeSpan), 0);
    glareGradient.addColorStop(0, `rgba(255, 255, 255, ${glareStrength.toFixed(4)})`);
    glareGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = glareGradient;
    ctx.fillRect(width * (1 - edgeSpan), 0, width * edgeSpan, height);
  }
}

function findPreferredModelCamera(root) {
  if (!root) {
    return null;
  }
  let fallbackCamera = null;
  let preferredCamera = null;
  root.traverse((node) => {
    if (!node || !node.isCamera) {
      return;
    }
    if (!fallbackCamera) {
      fallbackCamera = node;
    }
    const name = String(node.name || "").toLowerCase();
    if (name === "1_angle" || name.includes("1_angle")) {
      preferredCamera = node;
    }
  });
  return preferredCamera || fallbackCamera;
}

function collectModelCameras(root) {
  if (!root) {
    return [];
  }
  const cameras = [];
  root.traverse((node) => {
    if (node && node.isCamera) {
      cameras.push(node);
    }
  });
  return cameras;
}

function activeModelCamera() {
  const cameras = Array.isArray(preview3dThreeState.modelCameras) ? preview3dThreeState.modelCameras : [];
  if (!cameras.length) {
    return null;
  }
  const active = cameras.find((cam) => cam && cam.uuid === preview3dThreeState.activeModelCameraUuid);
  if (active) {
    return active;
  }
  return cameras[0];
}

function syncCameraControlVisibility() {
  if (blenderCameraRow) {
    blenderCameraRow.style.display = "none";
  }
  manualCameraRows.forEach((row) => {
    row.style.display = "";
  });
}

function syncBlenderCameraControl() {
  if (!blenderCameraControl) {
    return;
  }
  blenderCameraControl.innerHTML = "";
  blenderCameraControl.disabled = false;
  Object.entries(PREVIEW3D_CAMERA_PRESETS).forEach(([key, preset]) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = preset.label;
    blenderCameraControl.appendChild(option);
  });
  blenderCameraControl.value = normalizePreview3dCameraPreset(preview3dCameraPreset);
}

function tryLoadBillboardModel() {
  if (preview3dThreeState.modelLoadAttempted) {
    return;
  }
  const THREE = getThreeLib();
  const GLTFLoader = getGLTFLoaderClass();
  const scene = preview3dThreeState.scene;
  if (!THREE || !scene || !BILLBOARD_MODEL_URL) {
    return;
  }
  if (typeof GLTFLoader === "undefined") {
    // three-loader.js is still resolving the GLTFLoader source.
    return;
  }
  if (!GLTFLoader) {
    preview3dThreeState.modelLoadAttempted = true;
    preview3dThreeState.modelLoading = false;
    preview3dThreeState.modelCameras = [];
    preview3dThreeState.activeModelCameraUuid = "";
    preview3dThreeState.useModelCamera = false;
    if (preview3dThreeState.mesh) {
      preview3dThreeState.mesh.visible = true;
    }
    set3dLoaderVisible(false);
    syncBlenderCameraControl();
    syncCameraControlVisibility();
    return;
  }
  preview3dThreeState.modelLoadAttempted = true;
  preview3dThreeState.modelLoading = true;
  if (preview3dThreeState.mesh) {
    // Avoid showing fallback geometry before GLB mesh is ready.
    preview3dThreeState.mesh.visible = false;
  }
  set3dLoaderVisible(true, "loading 3D model...");
  const loader = new GLTFLoader();
  loader.load(
    BILLBOARD_MODEL_URL,
    (gltf) => {
      if (!gltf || !gltf.scene || !preview3dThreeState.scene) {
        return;
      }
      const root = gltf.scene;
      const selectedMesh = chooseBillboardMeshFromModel(root, THREE);
      const cameras = collectModelCameras(root);
      const preferredCamera = findPreferredModelCamera(root);
      preview3dThreeState.modelCameras = cameras;
      preview3dThreeState.activeModelCameraUuid = preferredCamera
        ? preferredCamera.uuid
        : cameras[0]
          ? cameras[0].uuid
          : "";
      preview3dThreeState.useModelCamera = false;
      syncBlenderCameraControl();
      syncCameraControlVisibility();
      if (!selectedMesh) {
        // Keep procedural fallback if a valid UV-mapped screen mesh is not found.
        return;
      }
      const modelCamera = preferredCamera;
      const box = new THREE.Box3();
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      if (!modelCamera) {
        root.position.set(0, 0, 0);
        root.rotation.set(0, 0, 0);
        root.scale.set(1, 1, 1);
        box.setFromObject(selectedMesh);
        box.getSize(size);
        const sourceWidth = Math.max(1, size.x);
        const sourceHeight = Math.max(1, size.y, size.z);
        const sourceRatio = sourceWidth / sourceHeight;
        if (!Number.isFinite(sourceRatio) || sourceRatio < 0.35 || sourceRatio > 6.5) {
          return;
        }
        const scaleFactor = Math.min(BILLBOARD_DESIGN_WIDTH / sourceWidth, BILLBOARD_DESIGN_HEIGHT / sourceHeight);
        root.scale.multiplyScalar(scaleFactor);
        box.setFromObject(selectedMesh);
        box.getSize(size);
        if (!Number.isFinite(size.x) || !Number.isFinite(size.y) || !Number.isFinite(size.z)) {
          return;
        }
        box.getCenter(center);
        root.position.sub(center);
      }
      preview3dThreeState.scene.add(root);
      preview3dThreeState.modelCamera = modelCamera;
      if (preview3dThreeState.mesh && preview3dThreeState.mesh.parent) {
        preview3dThreeState.mesh.parent.remove(preview3dThreeState.mesh);
      }
      selectedMesh.visible = true;
      selectedMesh.frustumCulled = false;
      // Keep a stable material baseline so projection never changes billboard framing/appearance,
      // except for adding/removing the artwork texture map.
      const projectionMaterial = createNeutralBillboardMaterial(THREE);
      if (preview3dThreeState.texture && ENABLE_3D_ARTWORK_PROJECTION) {
        projectionMaterial.map = preview3dThreeState.texture;
        tuneProjectionMaterial(projectionMaterial);
      }
      projectionMaterial.needsUpdate = true;
      selectedMesh.material = projectionMaterial;
      preview3dThreeState.mesh = selectedMesh;
      attach3dPartitionAnnotations(THREE, selectedMesh);
      PARTITION_KEYS.forEach((partitionKey) => {
        const part = preview3dThreeState.partitionMeshes[partitionKey];
        if (part && part.parent) {
          part.parent.remove(part);
        }
        preview3dThreeState.partitionMeshes[partitionKey] = null;
      });
      preview3dThreeState.modelLoaded = true;
      preview3dThreeState.modelLoading = false;
      clear3dFallbackMessage();
      render3dPreview();
    },
    undefined,
    () => {
      // Keep procedural fallback mesh if model fails.
      preview3dThreeState.modelLoading = false;
      preview3dThreeState.modelCameras = [];
      preview3dThreeState.activeModelCameraUuid = "";
      preview3dThreeState.useModelCamera = false;
      if (preview3dThreeState.mesh) {
        preview3dThreeState.mesh.visible = true;
      }
      set3dLoaderVisible(false);
      draw3dFallbackMessage("3D model failed to load; using fallback.");
      syncBlenderCameraControl();
      syncCameraControlVisibility();
    }
  );
}

function draw3dFallbackMessage(message) {
  if (!billboardPreview3d) {
    return;
  }
  let status = document.getElementById("billboard3dStatus");
  if (!status) {
    status = document.createElement("div");
    status.id = "billboard3dStatus";
    status.style.position = "absolute";
    status.style.left = "10px";
    status.style.top = "10px";
    status.style.zIndex = "6";
    status.style.padding = "4px 6px";
    status.style.fontFamily = '"Courier New", Courier, monospace';
    status.style.fontSize = "11px";
    status.style.color = "#fff";
    status.style.background = "rgba(0, 0, 0, 0.65)";
    status.style.pointerEvents = "none";
    billboardPreview3d.appendChild(status);
  }
  status.textContent = String(message || "");
  status.style.display = "";
}

function clear3dFallbackMessage() {
  const status = document.getElementById("billboard3dStatus");
  if (status) {
    status.style.display = "none";
  }
}

function ensure3dLoaderNode() {
  if (!billboardPreview3d) {
    return null;
  }
  let loader = document.getElementById("billboard3dLoader");
  if (!loader) {
    loader = document.createElement("div");
    loader.id = "billboard3dLoader";
    loader.className = "billboard-3d-loader";
    const spinner = document.createElement("span");
    spinner.className = "billboard-3d-loader-spinner";
    const label = document.createElement("span");
    label.className = "billboard-3d-loader-label";
    loader.appendChild(spinner);
    loader.appendChild(label);
    billboardPreview3d.appendChild(loader);
  }
  return loader;
}

function set3dLoaderVisible(isVisible, label = "loading 3D...") {
  const loader = ensure3dLoaderNode();
  if (!loader) {
    return;
  }
  const labelNode = loader.querySelector(".billboard-3d-loader-label");
  if (labelNode) {
    labelNode.textContent = String(label || "loading 3D...");
  }
  loader.style.display = isVisible ? "inline-flex" : "none";
}

function set3dCameraModeStatus(label) {
  const node = document.getElementById("billboard3dCameraMode");
  if (node && node.parentNode) {
    node.parentNode.removeChild(node);
  }
}

function ensureThreePreviewSetup() {
  if (!billboard3dCanvas) {
    return false;
  }
  const THREE = getThreeLib();
  if (!THREE) {
    if (!hasWarnedMissingThree) {
      console.warn("THREE is not available on window.");
      hasWarnedMissingThree = true;
    }
    return false;
  }
  hasWarnedMissingThree = false;
  if (
    preview3dThreeState.renderer &&
    preview3dThreeState.scene &&
    preview3dThreeState.camera &&
    preview3dThreeState.mesh
  ) {
    clear3dFallbackMessage();
    return true;
  }

  const renderer = new THREE.WebGLRenderer({
    canvas: billboard3dCanvas,
    antialias: true,
    alpha: true
  });
  renderer.setPixelRatio(Math.min(2, Math.max(1, window.devicePixelRatio || 1)));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
  scene.add(ambientLight);
  const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
  keyLight.position.set(2200, 3200, 2800);
  scene.add(keyLight);
  const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 20000);
  const geometry = createCurvedBillboardGeometry(THREE);
  const material = createNeutralBillboardMaterial(THREE);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false;
  scene.add(mesh);
  const partitionMeshes = {
    left: null,
    curve: null,
    right: null
  };
  PARTITION_KEYS.forEach((partitionKey) => {
    const range = BILLBOARD_PARTITION_RANGES[partitionKey];
    if (!range) {
      return;
    }
    const [startDistance, endDistance] = range;
    const partitionGeometry = createCurvedBillboardGeometry(THREE, startDistance, endDistance);
    const partitionMaterial = createNeutralBillboardMaterial(THREE);
    const partitionMesh = new THREE.Mesh(partitionGeometry, partitionMaterial);
    partitionMesh.frustumCulled = false;
    partitionMesh.visible = false;
    partitionMeshes[partitionKey] = partitionMesh;
    scene.add(partitionMesh);
  });
  preview3dThreeState.renderer = renderer;
  preview3dThreeState.scene = scene;
  preview3dThreeState.camera = camera;
  preview3dThreeState.mesh = mesh;
  attach3dPartitionAnnotations(THREE, mesh);
  preview3dThreeState.partitionMeshes = partitionMeshes;
  syncCameraControlVisibility();
  tryLoadBillboardModel();
  if (!preview3dThreeState.modelLoading) {
    clear3dFallbackMessage();
  }
  return true;
}

function loadThreeTextureFromSource(src) {
  const THREE = getThreeLib();
  if (!THREE || !preview3dThreeState.mesh || !src) {
    return;
  }
  const token = ++preview3dThreeState.textureRequestToken;
  const loader = new THREE.TextureLoader();
  loader.load(
    src,
    (texture) => {
      if (token !== preview3dThreeState.textureRequestToken) {
        texture.dispose();
        return;
      }
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.flipY = false;
      texture.repeat.set(1, 1);
      texture.offset.set(0, 0);
      if ("colorSpace" in texture && "SRGBColorSpace" in THREE) {
        texture.colorSpace = THREE.SRGBColorSpace;
      }
      texture.needsUpdate = true;

      if (preview3dThreeState.texture) {
        preview3dThreeState.texture.dispose();
      }
      preview3dThreeState.texture = texture;
      preview3dThreeState.textureSource = src;
      preview3dThreeState.textureScrollBaseX = 0;
      preview3dThreeState.textureOffsetY = 0;
      preview3dThreeState.textureMode = "linear";
      preview3dThreeState.mesh.material.map = texture;
      if (ENABLE_3D_ARTWORK_PROJECTION) {
        tuneProjectionMaterial(preview3dThreeState.mesh.material);
      }
      preview3dThreeState.mesh.material.needsUpdate = true;
      preview3dThreeState.mesh.visible = !preview3dThreeState.modelLoading;
      PARTITION_KEYS.forEach((partitionKey) => {
        const partitionMesh = preview3dThreeState.partitionMeshes[partitionKey];
        if (partitionMesh) {
          partitionMesh.visible = false;
        }
      });
      update3dPreviewAnimation();
    },
    undefined,
    () => {
      // Ignore texture load failures for now.
    }
  );
}

function syncThreeTextureSource() {
  const sources = current3dSources().filter((src) => !!src);
  const source = sources[0] || "";
  if (!source || source === preview3dThreeState.textureSource) {
    return;
  }
  loadThreeTextureFromSource(source);
}

async function syncThreeLoopTexture() {
  if (!ENABLE_3D_ARTWORK_PROJECTION) {
    return;
  }
  const THREE = getThreeLib();
  if (!THREE || !preview3dThreeState.mesh) {
    return;
  }
  const token = ++preview3dThreeState.textureRequestToken;
  const targetHeight = Math.min(
    3200,
    Math.max(520, Math.round(1024 * PREVIEW3D_FIXED_TEXTURE_QUALITY))
  );
  const scale = Math.max(0.08, targetHeight / BILLBOARD_DESIGN_HEIGHT);
  const viewportWidth = Math.max(64, Math.round(BILLBOARD_DESIGN_WIDTH * scale));
  const viewportHeight = Math.max(64, Math.round(BILLBOARD_DESIGN_HEIGHT * scale));
  const isPartitioned = currentDirectionIsPartitioned();
  const createTextureFromCanvas = (canvas) => {
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.flipY = false;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    if (preview3dThreeState.renderer && preview3dThreeState.renderer.capabilities) {
      texture.anisotropy = Math.min(8, preview3dThreeState.renderer.capabilities.getMaxAnisotropy());
    }
    texture.repeat.set(1, 1);
    texture.offset.set(0, 0);
    if ("colorSpace" in texture && "SRGBColorSpace" in THREE) {
      texture.colorSpace = THREE.SRGBColorSpace;
    }
    texture.needsUpdate = true;
    return texture;
  };

  const disposePartitionTexture = (partitionKey) => {
    const texture = preview3dThreeState.partitionTextures[partitionKey];
    if (texture) {
      texture.dispose();
      preview3dThreeState.partitionTextures[partitionKey] = null;
    }
  };

  PARTITION_KEYS.forEach((partitionKey) => {
    const mesh = preview3dThreeState.partitionMeshes[partitionKey];
    if (mesh) {
      mesh.visible = false;
    }
    disposePartitionTexture(partitionKey);
  });
  preview3dThreeState.mesh.visible = !preview3dThreeState.modelLoading;

  let linearSurface = null;
  let partitionSurfaces = null;
  let partitionOrientations = null;
  let partitionSettingsState = null;
  if (isPartitioned) {
    const partitionViewportWidths = {
      left: Math.max(1, Math.round(viewportWidth * (BILLBOARD_LEFT_WIDTH / BILLBOARD_DESIGN_WIDTH))),
      curve: Math.max(1, Math.round(viewportWidth * (BILLBOARD_CURVE_WIDTH / BILLBOARD_DESIGN_WIDTH)))
    };
    partitionViewportWidths.right = Math.max(1, viewportWidth - partitionViewportWidths.left - partitionViewportWidths.curve);
    partitionSurfaces = {};
    partitionOrientations = {};
    partitionSettingsState = {};
    for (const key of PARTITION_KEYS) {
      const orientation = current3dPartitionOrientation(key);
      partitionOrientations[key] = orientation;
      partitionSettingsState[key] = partitionSettingsForKey(key);
      const partitionTargetHeight = orientation === "vertical"
        ? Math.max(128, partitionViewportWidths[key] || targetHeight)
        : targetHeight;
      const surface = await build3dPartitionSurfaceStrip(partitionTargetHeight, key, orientation);
      if (!surface) {
        return;
      }
      partitionSurfaces[key] = surface;
    }
  } else {
    linearSurface = await build3dSurfaceStrip(targetHeight);
    if (!linearSurface) {
      return;
    }
  }
  if (token !== preview3dThreeState.textureRequestToken) {
    return;
  }

  const frameCanvas = document.createElement("canvas");
  frameCanvas.width = viewportWidth;
  frameCanvas.height = viewportHeight;
  const frameCtx = frameCanvas.getContext("2d");
  if (!frameCtx) {
    return;
  }
  frameCtx.imageSmoothingEnabled = true;
  frameCtx.imageSmoothingQuality = "high";

  const texture = createTextureFromCanvas(frameCanvas);
  if (preview3dThreeState.texture) {
    preview3dThreeState.texture.dispose();
  }
  preview3dThreeState.texture = texture;
  preview3dThreeState.textureSource = isPartitioned
    ? `partitioned:${PARTITION_KEYS.map((key) => `${key}:${current3dPartitionSources(key).join("|")}:${current3dPartitionOrientation(key)}`).join(";")}`
    : `linear:${current3dSources().join("|")}:${current3dOrientation()}`;
  preview3dThreeState.textureScrollBaseX = 0;
  preview3dThreeState.textureOffsetY = 0;
  preview3dThreeState.textureMode = isPartitioned ? "partitioned" : "linear";
  preview3dThreeState.loopTextureState = {
    partitioned: isPartitioned,
    frameCanvas,
    frameCtx,
    linearSurface,
    partitionSurfaces,
    partitionOrientations,
    partitionSettings: partitionSettingsState
  };
  preview3dThreeState.mesh.material.map = texture;
  tuneProjectionMaterial(preview3dThreeState.mesh.material);
  preview3dThreeState.mesh.material.needsUpdate = true;
}

function computePreview3dLoopProgress() {
  let progress = ((Number(loopPlaybackProgress) % 1) + 1) % 1;
  const nowMs = performance.now();
  const hasSyncedSample =
    preview3dPlaybackSyncState.hasSample &&
    Number.isFinite(preview3dPlaybackSyncState.durationSeconds) &&
    preview3dPlaybackSyncState.durationSeconds > 0;
  const duration = hasSyncedSample
    ? preview3dPlaybackSyncState.durationSeconds
    : Math.max(0.1, Number(loopDurationSeconds) || 16);
  if (!Number.isFinite(preview3dPlaybackSyncState.syncedAtMs) || preview3dPlaybackSyncState.syncedAtMs <= 0) {
    preview3dPlaybackSyncState.syncedAtMs = nowMs;
  }
  const elapsedBase = hasSyncedSample ? preview3dPlaybackSyncState.elapsedContinuous : loopElapsedSeconds;
  const extrapolatedElapsed = elapsedBase + Math.max(0, (nowMs - preview3dPlaybackSyncState.syncedAtMs) / 1000);
  progress = ((extrapolatedElapsed % duration) + duration) / duration;
  progress = ((progress % 1) + 1) % 1;
  return progress;
}

function computePreview3dElapsedSeconds() {
  const nowMs = performance.now();
  const hasSyncedSample =
    preview3dPlaybackSyncState.hasSample &&
    Number.isFinite(preview3dPlaybackSyncState.durationSeconds) &&
    preview3dPlaybackSyncState.durationSeconds > 0;
  if (!Number.isFinite(preview3dPlaybackSyncState.syncedAtMs) || preview3dPlaybackSyncState.syncedAtMs <= 0) {
    preview3dPlaybackSyncState.syncedAtMs = nowMs;
  }
  const elapsedBase = hasSyncedSample ? preview3dPlaybackSyncState.elapsedContinuous : loopElapsedSeconds;
  return elapsedBase + Math.max(0, (nowMs - preview3dPlaybackSyncState.syncedAtMs) / 1000);
}

function drawSurfaceViewportWindow(ctx, surface, progress, destX, destY, destWidth, destHeight) {
  if (!ctx || !surface || !surface.canvas || !surface.sequenceWidth || destWidth <= 0 || destHeight <= 0) {
    return;
  }
  const sequenceWidth = Math.max(1, Math.round(surface.sequenceWidth));
  let srcX = ((progress * sequenceWidth) % sequenceWidth + sequenceWidth) % sequenceWidth;
  let remaining = Math.max(1, Math.round(destWidth));
  let dx = Math.round(destX);

  while (remaining > 0) {
    const available = sequenceWidth - srcX;
    const drawWidth = Math.max(1, Math.min(remaining, available));
    ctx.drawImage(
      surface.canvas,
      srcX,
      0,
      drawWidth,
      surface.stripHeight,
      dx,
      Math.round(destY),
      drawWidth,
      Math.round(destHeight)
    );
    remaining -= drawWidth;
    dx += drawWidth;
    srcX = (srcX + drawWidth) % sequenceWidth;
  }
}

function drawSurfaceViewportWindowVertical(ctx, surface, progress, destX, destY, destWidth, destHeight) {
  if (!ctx || !surface || !surface.canvas || !surface.sequenceWidth || destWidth <= 0 || destHeight <= 0) {
    return;
  }
  const sequenceWidth = Math.max(1, Math.round(surface.sequenceWidth));
  let srcX = ((progress * sequenceWidth) % sequenceWidth + sequenceWidth) % sequenceWidth;
  let remaining = Math.max(1, Math.round(destHeight));
  let dx = 0;

  ctx.save();
  ctx.translate(Math.round(destX), Math.round(destY + destHeight));
  // Rotate inline strip so movement is bottom -> top.
  ctx.rotate(-Math.PI / 2);
  while (remaining > 0) {
    const available = sequenceWidth - srcX;
    const drawWidth = Math.max(1, Math.min(remaining, available));
    ctx.drawImage(
      surface.canvas,
      srcX,
      0,
      drawWidth,
      surface.stripHeight,
      dx,
      0,
      drawWidth,
      Math.round(destWidth)
    );
    remaining -= drawWidth;
    dx += drawWidth;
    srcX = (srcX + drawWidth) % sequenceWidth;
  }
  ctx.restore();
}

function paintThreeLoopTextureFrame(progress) {
  const texture = preview3dThreeState.texture;
  const state = preview3dThreeState.loopTextureState;
  if (!texture || !state || !state.frameCtx || !state.frameCanvas) {
    return;
  }
  const { frameCanvas, frameCtx } = state;
  frameCtx.fillStyle = currentBackgroundColor();
  frameCtx.fillRect(0, 0, frameCanvas.width, frameCanvas.height);

  if (state.partitioned && state.partitionSurfaces) {
    const widths = {
      left: Math.max(1, Math.round(frameCanvas.width * (BILLBOARD_LEFT_WIDTH / BILLBOARD_DESIGN_WIDTH))),
      curve: Math.max(1, Math.round(frameCanvas.width * (BILLBOARD_CURVE_WIDTH / BILLBOARD_DESIGN_WIDTH)))
    };
    widths.right = Math.max(1, frameCanvas.width - widths.left - widths.curve);
    const partitionOrientations = state.partitionOrientations || {};
    const partitionSettingsState = state.partitionSettings || {};
    const elapsedSeconds = computePreview3dElapsedSeconds();
    const drawPartition = (partitionKey, cursorX, width) => {
      const surface = state.partitionSurfaces[partitionKey];
      if (!surface) {
        return;
      }
      const orientation = partitionOrientations[partitionKey] === "vertical" ? "vertical" : "horizontal";
      const settings = partitionSettingsState[partitionKey] || null;
      const partitionSecondsRaw = Number(settings && settings.seconds);
      const partitionSeconds =
        Number.isFinite(partitionSecondsRaw) && partitionSecondsRaw > 0
          ? partitionSecondsRaw
          : Math.max(0.1, Number(loopDurationSeconds) || 16);
      const partitionProgress = ((elapsedSeconds % partitionSeconds) + partitionSeconds) / partitionSeconds;
      if (orientation === "vertical") {
        drawSurfaceViewportWindowVertical(frameCtx, surface, partitionProgress, cursorX, 0, width, frameCanvas.height);
      } else {
        drawSurfaceViewportWindow(frameCtx, surface, partitionProgress, cursorX, 0, width, frameCanvas.height);
      }
    };
    let cursor = 0;
    drawPartition("left", cursor, widths.left);
    cursor += widths.left;
    drawPartition("curve", cursor, widths.curve);
    cursor += widths.curve;
    drawPartition("right", cursor, widths.right);
  } else {
    drawSurfaceViewportWindow(frameCtx, state.linearSurface, progress, 0, 0, frameCanvas.width, frameCanvas.height);
  }
  applyProjectionScreenFx(frameCtx, frameCanvas.width, frameCanvas.height);
  texture.needsUpdate = true;
}

function renderThreeFrame() {
  if (!ensureThreePreviewSetup()) {
    return;
  }
  const { renderer, scene, camera, mesh, texture } = preview3dThreeState;
  if (!renderer || !scene || !camera || !mesh || !billboard3dCanvas) {
    return;
  }

  const cssWidth = Math.max(1, billboard3dCanvas.clientWidth || 1);
  const cssHeight = Math.max(1, billboard3dCanvas.clientHeight || 1);
  renderer.setSize(cssWidth, cssHeight, false);
  camera.aspect = cssWidth / cssHeight;
  const modelCamera = preview3dThreeState.useModelCamera ? activeModelCamera() : null;
  if (modelCamera && modelCamera.isPerspectiveCamera) {
    const worldPosition = new modelCamera.position.constructor();
    const worldQuaternion = new modelCamera.quaternion.constructor();
    modelCamera.getWorldPosition(worldPosition);
    modelCamera.getWorldQuaternion(worldQuaternion);
    camera.position.copy(worldPosition);
    camera.quaternion.copy(worldQuaternion);
    // Use Blender camera framing exactly when model camera is available.
    camera.fov = modelCamera.fov;
    camera.near = modelCamera.near;
    camera.far = modelCamera.far;
    set3dCameraModeStatus(`camera: glb ${String(modelCamera.name || "(unnamed)")}`);
  } else {
    const perspectiveFactor = Math.min(2.5, Math.max(0.1, preview3dCamera.perspective));
    camera.fov = Math.max(18, Math.min(72, 44 / perspectiveFactor));
    const radius = 2200 * preview3dCamera.zoom;
    const yaw = preview3dCamera.yaw;
    const pitch = preview3dCamera.pitch;
    const cosPitch = Math.cos(pitch);
    camera.position.set(
      Math.sin(yaw) * cosPitch * radius,
      Math.sin(pitch) * radius * 0.9,
      Math.cos(yaw) * cosPitch * radius
    );
    camera.lookAt(preview3dCamera.targetX, preview3dCamera.targetY, preview3dCamera.targetZ);
    const preset = currentPreview3dCameraPreset();
    set3dCameraModeStatus(`camera: ${preset ? preset.label : "ISO"}`);
  }
  camera.updateProjectionMatrix();
  const progress = computePreview3dLoopProgress();
  paintThreeLoopTextureFrame(progress);
  if (texture) {
    texture.repeat.x = 1;
    texture.repeat.y = 1;
    texture.offset.x = 0;
    texture.offset.y = 0;
  }
  renderer.render(scene, camera);
}

function stop3dAnimationLoop() {
  if (preview3dAnimationFrameId !== null) {
    cancelAnimationFrame(preview3dAnimationFrameId);
    preview3dAnimationFrameId = null;
  }
}

function tick3dAnimationLoop() {
  if (previewViewMode !== "3d") {
    preview3dAnimationFrameId = null;
    return;
  }
  renderThreeFrame();
  updateActiveWindow();
  updatePartitionActiveWindows();
  preview3dAnimationFrameId = requestAnimationFrame(tick3dAnimationLoop);
}

function start3dAnimationLoop() {
  if (preview3dAnimationFrameId !== null || previewViewMode !== "3d") {
    return;
  }
  preview3dAnimationFrameId = requestAnimationFrame(tick3dAnimationLoop);
}

function update3dPreviewAnimation() {
  if (previewViewMode !== "3d") {
    return;
  }
  if (!ensureThreePreviewSetup()) {
    draw3dFallbackMessage("3D unavailable: THREE failed to initialize");
    return;
  }
  renderThreeFrame();
}

async function render3dPreview() {
  if (previewViewMode !== "3d") {
    set3dLoaderVisible(false);
    return;
  }
  if (!billboardPreview3d || !billboard3dCanvas) {
    return;
  }
  set3dLoaderVisible(true, "loading 3D...");
  if (!ensureThreePreviewSetup()) {
    set3dLoaderVisible(false);
    draw3dFallbackMessage("3D unavailable: THREE failed to initialize");
    return;
  }
  await syncThreeLoopTexture();
  renderThreeFrame();
  if (!preview3dThreeState.modelLoading) {
    set3dLoaderVisible(false);
  }
}

function applyPreviewViewMode(mode) {
  previewViewMode = normalizePreviewViewMode(mode);
  if (previewViewModeControl && previewViewModeControl.value !== previewViewMode) {
    previewViewModeControl.value = previewViewMode;
  }
  syncCameraControlVisibility();
  if (appShell) {
    appShell.classList.toggle("preview-3d-mode", previewViewMode === "3d");
  }
  if (billboardPreview3d) {
    billboardPreview3d.setAttribute("aria-hidden", previewViewMode === "3d" ? "false" : "true");
  }
  if (previewViewMode === "3d") {
    render3dPreview();
    start3dAnimationLoop();
  } else {
    set3dLoaderVisible(false);
    stop3dAnimationLoop();
    // Re-sync the iframe loop when coming back from hidden 3D mode.
    sendLoopConfigToPreview();
    updateActiveWindow();
    updatePartitionActiveWindows();
    window.requestAnimationFrame(() => {
      sendLoopConfigToPreview();
      updateActiveWindow();
      updatePartitionActiveWindows();
    });
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
        : "single";
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

function syncPanelToggleButtons() {
  const settingsVisible = settingsPanelAllowed && isSettingsPanelOpen;
  if (settingsToggleButton) {
    settingsToggleButton.classList.toggle("active", settingsVisible);
    settingsToggleButton.setAttribute("aria-expanded", settingsVisible ? "true" : "false");
  }
  if (viewControlsToggleButton) {
    viewControlsToggleButton.classList.toggle("active", isViewControlsPanelOpen);
    viewControlsToggleButton.setAttribute("aria-expanded", isViewControlsPanelOpen ? "true" : "false");
  }
}

function syncPanelVisibility() {
  const settingsVisible = settingsPanelAllowed && isSettingsPanelOpen;
  if (settingsPanel) {
    settingsPanel.style.display = settingsVisible ? "" : "none";
    settingsPanel.setAttribute("aria-hidden", settingsVisible ? "false" : "true");
  }
  if (viewControlsPanel) {
    viewControlsPanel.style.display = isViewControlsPanelOpen ? "" : "none";
    viewControlsPanel.setAttribute("aria-hidden", isViewControlsPanelOpen ? "false" : "true");
  }
  syncPanelToggleButtons();
}

function setSettingsPanelVisibility(isVisible) {
  settingsPanelAllowed = Boolean(isVisible);
  if (!settingsPanelAllowed) {
    isSettingsPanelOpen = false;
  }
  syncPanelVisibility();
}

function setViewControlsPanelVisibility(isVisible) {
  isViewControlsPanelOpen = Boolean(isVisible);
  syncPanelVisibility();
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

function currentAssetColor() {
  if (!assetColorControl) {
    return "#111111";
  }
  return /^#[0-9a-f]{6}$/i.test(assetColorControl.value || "") ? assetColorControl.value : "#111111";
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

function syncOrientationToggleStates() {
  orientationChoiceButtons.forEach((button) => {
    const targetId = button.dataset.orientationTarget || "";
    const value = normalizeArtworkOrientation(button.dataset.value);
    const control = targetId ? document.getElementById(targetId) : null;
    const activeValue = normalizeArtworkOrientation(control ? control.value : "horizontal");
    const isActive = activeValue === value;
    button.classList.toggle("inactive", !isActive);
    button.setAttribute("aria-checked", isActive ? "true" : "false");
  });
}

function setOrientationControlValue(control, value) {
  if (!control) {
    return;
  }
  const nextValue = normalizeArtworkOrientation(value);
  const changed = control.value !== nextValue;
  control.value = nextValue;
  if (changed) {
    control.dispatchEvent(new Event("change", { bubbles: true }));
  } else {
    syncOrientationToggleStates();
  }
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

function normalizeThemeMode(value) {
  return String(value || "").toLowerCase() === "dark" ? "dark" : "light";
}

function applyThemeMode(mode) {
  const normalized = normalizeThemeMode(mode);
  document.body.classList.toggle("dark-mode", normalized === "dark");
  if (themeToggleButton) {
    themeToggleButton.textContent = normalized === "dark" ? "☾" : "☀";
    themeToggleButton.setAttribute(
      "aria-label",
      normalized === "dark" ? "Switch to light mode" : "Switch to dark mode"
    );
    themeToggleButton.title = normalized === "dark" ? "light mode" : "dark mode";
  }
  writeStorage(STORAGE_KEYS.themeMode, normalized);
  return normalized;
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
  return restoreSelectedDirection() || "single";
}

function getCurrentLoopConfig() {
  const activePartitionSettings = partitionSettingsForKey(activePartitionSettingsKeyValue());
  const config = {
    seconds: currentDirectionIsPartitioned() ? activePartitionSettings.seconds : currentSpeedSeconds(),
    padTopBottom: currentDirectionIsPartitioned() ? activePartitionSettings.padTopBottom : currentPadTopBottom(),
    padLeftRight: currentDirectionIsPartitioned() ? activePartitionSettings.padLeftRight : currentPadLeftRight(),
    backgroundColor: currentDirectionIsPartitioned() ? activePartitionSettings.backgroundColor : currentBackgroundColor(),
    assetColor: currentDirectionIsPartitioned() ? activePartitionSettings.assetColor : currentAssetColor(),
    assetGap: currentDirectionIsPartitioned() ? activePartitionSettings.assetGap : currentAssetGap(),
    artworkOrientation: currentArtworkOrientation(),
    rowCount: currentDirectionIsPartitioned() ? activePartitionSettings.rowCount : currentRowCount(),
    rowOffset: currentDirectionIsPartitioned() ? activePartitionSettings.rowOffset : currentRowOffset(),
    rowGap: currentDirectionIsPartitioned() ? activePartitionSettings.rowGap : currentRowGap(),
    directionMode: currentDirectionIsPartitioned() ? "partitioned" : "linear"
  };

  if (currentDirectionIsPartitioned()) {
    config.artworksByPartition = {
      left: (partitionArtworks.left || []).map((item) => item.src),
      curve: (partitionArtworks.curve || []).map((item) => item.src),
      right: (partitionArtworks.right || []).map((item) => item.src)
    };
    config.artworkOrientations = currentPartitionArtworkOrientations();
    config.partitionSettings = PARTITION_KEYS.reduce((acc, key) => {
      acc[key] = partitionSettingsForKey(key);
      return acc;
    }, {});
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
      const PARTITION_WIDTHS = {
        left: 1820,
        curve: 1020,
        right: 3060
      };
      const PARTITION_TOTAL_WIDTH = 5900;
      const DEFAULT_SOURCE = "assets/linear-loop-strip.png";
      const state = ${safeState};
      const DEFAULT_PARTITION_SETTINGS = {
        seconds: 16,
        padTopBottom: 0,
        padLeftRight: 0,
        backgroundColor: "#fff8a5",
        assetColor: "#111111",
        assetGap: 0,
        rowCount: 1,
        rowOffset: 0,
        rowGap: 0
      };

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

      function isLikelySvgSource(src) {
        const value = String(src || "").trim().toLowerCase();
        return value.startsWith("data:image/svg+xml") || /\.svg([?#].*)?$/.test(value);
      }

      function decodeSvgDataUrl(dataUrl) {
        const raw = String(dataUrl || "");
        const commaIndex = raw.indexOf(",");
        if (commaIndex < 0) {
          return "";
        }
        const meta = raw.slice(0, commaIndex).toLowerCase();
        const payload = raw.slice(commaIndex + 1);
        try {
          if (meta.includes(";base64")) {
            return atob(payload);
          }
          return decodeURIComponent(payload);
        } catch (error) {
          return "";
        }
      }

      async function readSvgSourceText(src) {
        const value = String(src || "").trim();
        if (!value || !isLikelySvgSource(value)) {
          return "";
        }
        if (value.toLowerCase().startsWith("data:image/svg+xml")) {
          return decodeSvgDataUrl(value);
        }
        try {
          const response = await fetch(value, { cache: "force-cache" });
          if (!response.ok) {
            return "";
          }
          return await response.text();
        } catch (error) {
          return "";
        }
      }

      function applyColorToSvgText(svgText, color) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(String(svgText || ""), "image/svg+xml");
        const svg = doc.querySelector("svg");
        if (!svg) {
          return "";
        }
        const nodes = [svg, ...svg.querySelectorAll("*")];
        nodes.forEach((node) => {
          const fill = node.getAttribute("fill");
          const stroke = node.getAttribute("stroke");
          if (!fill || String(fill).toLowerCase() !== "none") {
            node.setAttribute("fill", color);
          }
          if (stroke && String(stroke).toLowerCase() !== "none") {
            node.setAttribute("stroke", color);
          }
          const style = node.getAttribute("style");
          if (style) {
            node.setAttribute(
              "style",
              style.replace(/fill\s*:\s*[^;]+/gi, "fill:" + color).replace(/stroke\s*:\s*[^;]+/gi, "stroke:" + color)
            );
          }
        });
        return new XMLSerializer().serializeToString(svg);
      }

      async function colorizeSvgSource(src, color) {
        if (!isLikelySvgSource(src) || !/^#[0-9a-f]{6}$/i.test(color || "")) {
          return src;
        }
        const text = await readSvgSourceText(src);
        if (!text) {
          return src;
        }
        const colored = applyColorToSvgText(text, color);
        if (!colored) {
          return src;
        }
        return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(colored);
      }

      function orientationForPartition(partitionKey) {
        if (state.artworkOrientations && typeof state.artworkOrientations === "object") {
          return state.artworkOrientations[partitionKey] === "vertical" ? "vertical" : "horizontal";
        }
        return state.artworkOrientation === "vertical" ? "vertical" : "horizontal";
      }

      function settingsForPartition(partitionKey) {
        const perPartition =
          state.partitionSettings && typeof state.partitionSettings === "object" ? state.partitionSettings[partitionKey] : null;
        const source = perPartition && typeof perPartition === "object" ? perPartition : state;
        const secondsRaw = Number(source.seconds);
        const padTopBottomRaw = Number(source.padTopBottom);
        const padLeftRightRaw = Number(source.padLeftRight);
        const assetGapRaw = Number(source.assetGap);
        const rowCountRaw = Number(source.rowCount);
        const rowOffsetRaw = Number(source.rowOffset);
        const rowGapRaw = Number(source.rowGap);
        return {
          seconds: Number.isFinite(secondsRaw) && secondsRaw > 0 ? secondsRaw : DEFAULT_PARTITION_SETTINGS.seconds,
          padTopBottom:
            Number.isFinite(padTopBottomRaw) && padTopBottomRaw >= 0
              ? padTopBottomRaw
              : DEFAULT_PARTITION_SETTINGS.padTopBottom,
          padLeftRight:
            Number.isFinite(padLeftRightRaw) && padLeftRightRaw >= 0
              ? padLeftRightRaw
              : DEFAULT_PARTITION_SETTINGS.padLeftRight,
          backgroundColor:
            typeof source.backgroundColor === "string" && /^#[0-9a-f]{6}$/i.test(source.backgroundColor)
              ? source.backgroundColor
              : DEFAULT_PARTITION_SETTINGS.backgroundColor,
          assetColor:
            typeof source.assetColor === "string" && /^#[0-9a-f]{6}$/i.test(source.assetColor)
              ? source.assetColor
              : DEFAULT_PARTITION_SETTINGS.assetColor,
          assetGap:
            Number.isFinite(assetGapRaw) && assetGapRaw >= 0 ? assetGapRaw : DEFAULT_PARTITION_SETTINGS.assetGap,
          rowCount:
            Number.isFinite(rowCountRaw) && rowCountRaw >= 1
              ? Math.round(rowCountRaw)
              : DEFAULT_PARTITION_SETTINGS.rowCount,
          rowOffset:
            Number.isFinite(rowOffsetRaw) && rowOffsetRaw >= 0 ? rowOffsetRaw : DEFAULT_PARTITION_SETTINGS.rowOffset,
          rowGap: Number.isFinite(rowGapRaw) && rowGapRaw >= 0 ? rowGapRaw : DEFAULT_PARTITION_SETTINGS.rowGap
        };
      }

      async function resolvePartitionWidth(container, partitionKey) {
        const measure = () =>
          Math.max(
            0,
            Number(container.clientWidth) || 0,
            Number(container.getBoundingClientRect().width) || 0
          );

        let width = measure();
        if (width > 1) {
          return width;
        }

        await new Promise((resolve) => requestAnimationFrame(resolve));
        width = measure();
        if (width > 1) {
          return width;
        }

        const viewportWidth = Math.max(
          1,
          Number(document.documentElement.clientWidth) || 0,
          Number(window.innerWidth) || 0
        );
        const partitionDesignWidth = Math.max(1, Number(PARTITION_WIDTHS[partitionKey]) || PARTITION_TOTAL_WIDTH);
        return (partitionDesignWidth / PARTITION_TOTAL_WIDTH) * viewportWidth;
      }

      async function renderPartition(container, sources, partitionKey) {
        container.innerHTML = "";
        const partitionSettings = settingsForPartition(partitionKey);
        container.style.background = partitionSettings.backgroundColor;
        container.style.setProperty("--loop-row-gap", Math.max(0, Number(partitionSettings.rowGap) || 0) + "px");
        container.style.paddingTop = Math.max(0, Number(partitionSettings.padTopBottom) || 0) + "px";
        container.style.paddingBottom = Math.max(0, Number(partitionSettings.padTopBottom) || 0) + "px";
        container.style.paddingLeft = Math.max(0, Number(partitionSettings.padLeftRight) || 0) + "px";
        container.style.paddingRight = Math.max(0, Number(partitionSettings.padLeftRight) || 0) + "px";
        container.style.boxSizing = "border-box";
        const rowCount = Math.max(1, Math.round(Number(partitionSettings.rowCount) || 1));
        const verticalFlow = orientationForPartition(partitionKey) === "vertical";
        // Keep artwork inline in all orientations; vertical only changes track rotation/direction.
        const sidePadding = 0;
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

        const gapSize = Math.max(0, Number(partitionSettings.assetGap) || 0);
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

        const offsetSecondsPerRow = ((Number(partitionSettings.rowOffset) || 0) / safeDistance) * partitionSettings.seconds;
        rows.forEach((track, rowIndex) => {
          const delay = -1 * offsetSecondsPerRow * rowIndex;
          track.style.setProperty("--loop-row-delay", delay + "s");
          track.style.animationName = verticalFlow ? "loop-y" : "loop-x";
          track.style.animationDuration = partitionSettings.seconds + "s";
          track.style.gap = Math.max(0, Number(partitionSettings.assetGap) || 0) + "px";
          track.style.setProperty("--loop-distance", safeDistance + "px");
          track.style.setProperty("--loop-row-direction", "normal");
        });
      }

      async function render() {
        const baseSettings = settingsForPartition("left");
        document.documentElement.style.setProperty("--loop-bg", baseSettings.backgroundColor);

        const partitions = state.artworksByPartition && typeof state.artworksByPartition === "object"
          ? state.artworksByPartition
          : {};

        for (const key of PARTITION_KEYS) {
          const container = partitionContainers[key];
          if (!container) {
            continue;
          }
          const partitionSettings = settingsForPartition(key);
          container.style.background = partitionSettings.backgroundColor;
          const raw = Array.isArray(partitions[key]) ? partitions[key] : [];
          const sources = raw.length
            ? await Promise.all(
              raw.map((item) => colorizeSvgSource(normalizeArtworkSource(item), partitionSettings.assetColor))
            )
            : [DEFAULT_SOURCE];
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
  const partitionSettings =
    candidate.partitionSettings && typeof candidate.partitionSettings === "object"
      ? PARTITION_KEYS.reduce((acc, key) => {
          acc[key] = sanitizePartitionSettingsEntry(candidate.partitionSettings[key]);
          return acc;
        }, {})
      : null;
  const backgroundColor =
    typeof candidate.backgroundColor === "string" && /^#[0-9a-f]{6}$/i.test(candidate.backgroundColor)
      ? candidate.backgroundColor
      : "#fff8a5";
  const assetColor =
    typeof candidate.assetColor === "string" && /^#[0-9a-f]{6}$/i.test(candidate.assetColor)
      ? candidate.assetColor
      : "#111111";

  return {
    seconds,
    artworks,
    artworksByPartition,
    padTopBottom: Number.isFinite(padTopBottomRaw) && padTopBottomRaw >= 0 ? padTopBottomRaw : 0,
    padLeftRight: Number.isFinite(padLeftRightRaw) && padLeftRightRaw >= 0 ? padLeftRightRaw : 0,
    backgroundColor,
    assetColor,
    assetGap: Number.isFinite(assetGapRaw) && assetGapRaw >= 0 ? assetGapRaw : 0,
    artworkOrientation,
    artworkOrientations,
    rowCount: Number.isFinite(rowCountRaw) && rowCountRaw >= 1 ? Math.round(rowCountRaw) : 1,
    rowOffset: Number.isFinite(rowOffsetRaw) && rowOffsetRaw >= 0 ? rowOffsetRaw : 0,
    rowGap: Number.isFinite(rowGapRaw) && rowGapRaw >= 0 ? rowGapRaw : 0,
    partitionSettings,
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

function saveAssetColor(value) {
  writeStorage(STORAGE_KEYS.assetColor, value);
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
  if (assetColorControl) {
    const raw = readStorage(STORAGE_KEYS.assetColor);
    if (raw && /^#[0-9a-f]{6}$/i.test(raw)) {
      assetColorControl.value = raw;
    }
  }

  if (previewViewModeControl) {
    const raw = readStorage(STORAGE_KEYS.previewViewMode);
    if (raw !== null) {
      previewViewModeControl.value = normalizePreviewViewMode(raw);
    }
  }

  if (blenderCameraControl) {
    blenderCameraControl.addEventListener("change", () => {
      applyPreview3dCameraPreset(blenderCameraControl.value);
    });
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
  syncOrientationToggleStates();
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

function savePartitionSettings(settingsByPartition) {
  const safe = createDefaultPartitionSettings();
  PARTITION_KEYS.forEach((key) => {
    safe[key] = sanitizePartitionSettingsEntry(settingsByPartition && settingsByPartition[key]);
  });
  writeStorage(STORAGE_KEYS.partitionSettings, JSON.stringify(safe));
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

function restorePartitionSettings() {
  const defaults = createDefaultPartitionSettings();
  const rawValue = readStorage(STORAGE_KEYS.partitionSettings);
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
      restored[key] = sanitizePartitionSettingsEntry(parsed[key]);
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
  const activePartitionSettings = partitionSettingsForKey(activePartitionSettingsKeyValue());
  const seconds = currentDirectionIsPartitioned() ? activePartitionSettings.seconds : currentSpeedSeconds();
  const payload = {
    type: "setLoopConfig",
    seconds,
    padTopBottom: currentDirectionIsPartitioned() ? activePartitionSettings.padTopBottom : currentPadTopBottom(),
    padLeftRight: currentDirectionIsPartitioned() ? activePartitionSettings.padLeftRight : currentPadLeftRight(),
    backgroundColor: currentDirectionIsPartitioned() ? activePartitionSettings.backgroundColor : currentBackgroundColor(),
    assetColor: currentDirectionIsPartitioned() ? activePartitionSettings.assetColor : currentAssetColor(),
    assetGap: currentDirectionIsPartitioned() ? activePartitionSettings.assetGap : currentAssetGap(),
    artworkOrientation: currentArtworkOrientation(),
    rowCount: currentDirectionIsPartitioned() ? activePartitionSettings.rowCount : currentRowCount(),
    rowOffset: currentDirectionIsPartitioned() ? activePartitionSettings.rowOffset : currentRowOffset(),
    rowGap: currentDirectionIsPartitioned() ? activePartitionSettings.rowGap : currentRowGap()
  };
  if (currentDirectionIsPartitioned()) {
    payload.artworksByPartition = {
      left: (partitionArtworks.left || []).map((item) => item.src),
      curve: (partitionArtworks.curve || []).map((item) => item.src),
      right: (partitionArtworks.right || []).map((item) => item.src)
    };
    payload.artworkOrientations = currentPartitionArtworkOrientations();
    payload.partitionSettings = PARTITION_KEYS.reduce((acc, key) => {
      acc[key] = partitionSettingsForKey(key);
      return acc;
    }, {});
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

function computeEffectiveLoopPaddingPx() {
  const padTBDesign = Math.max(0, Number(currentPadTopBottom()) || 0);
  const padLRDesign = Math.max(0, Number(currentPadLeftRight()) || 0);
  const frameEl =
    (billboardPreview && billboardPreview.closest(".billboard-frame")) ||
    (billboardPreview3d && billboardPreview3d.closest(".billboard-frame")) ||
    null;
  const viewportWidthRaw = frameEl
    ? Math.max(0, frameEl.clientWidth || 0, frameEl.getBoundingClientRect().width || 0)
    : billboardPreview
      ? Math.max(0, billboardPreview.clientWidth || 0, billboardPreview.getBoundingClientRect().width || 0)
      : 0;
  const viewportHeightRaw = frameEl
    ? Math.max(0, frameEl.clientHeight || 0, frameEl.getBoundingClientRect().height || 0)
    : billboardPreview
      ? Math.max(0, billboardPreview.clientHeight || 0, billboardPreview.getBoundingClientRect().height || 0)
      : 0;
  const viewportWidth = viewportWidthRaw > 1 ? viewportWidthRaw : BILLBOARD_DESIGN_WIDTH;
  const viewportHeight = viewportHeightRaw > 1 ? viewportHeightRaw : BILLBOARD_DESIGN_HEIGHT;
  const padTBPxRaw = (padTBDesign / BILLBOARD_DESIGN_HEIGHT) * viewportHeight;
  const maxPadTBPx = Math.max(0, (viewportHeight - 1) / 2);
  return {
    padTB: Math.min(Math.max(0, padTBPxRaw), maxPadTBPx),
    padLR: Math.max(0, (padLRDesign / BILLBOARD_DESIGN_WIDTH) * viewportWidth)
  };
}

function syncEffectiveLoopPadding() {
  const effective = computeEffectiveLoopPaddingPx();
  loopPadTopBottom = effective.padTB;
  loopPadLeftRight = effective.padLR;
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
  const baseScale = getPartitionPreviewScale();
  const stageHeight = Math.max(1, loopStageHeight);
  partitionEditors.style.setProperty("--partition-preview-art-height", `${Math.max(8, Math.round(stageHeight * baseScale * 100) / 100)}px`);
  partitionEditors.style.setProperty("--partition-preview-pad-tb", "0px");
  partitionEditors.style.setProperty("--partition-preview-pad-lr", "0px");
  partitionEditors.style.setProperty("--partition-preview-gap", "0px");
  partitionEditors.style.setProperty("--partition-preview-bg", partitionSettingsForKey("left").backgroundColor);

  PARTITION_KEYS.forEach((partitionKey) => {
    const trackEl = partitionTrackElement(partitionKey);
    if (!trackEl) {
      return;
    }
    const settings = partitionSettingsForKey(partitionKey);
    const totalSourceHeight = Math.max(1, stageHeight + Math.max(0, settings.padTopBottom) * 2);
    const scale = 54 / totalSourceHeight;
    const scaledArtHeight = Math.max(8, Math.round(stageHeight * scale * 100) / 100);
    const scaledPadTB = Math.max(0, Math.round(Math.max(0, settings.padTopBottom) * scale * 100) / 100);
    const scaledPadLR = Math.max(0, Math.round(Math.max(0, settings.padLeftRight) * scale * 100) / 100);
    const scaledGap = Math.max(0, Math.round(Math.max(0, settings.assetGap) * scale * 100) / 100);
    const trackArtHeight = scaledArtHeight;
    const trackPadTB = scaledPadTB;
    const trackPadLR = scaledPadLR;
    const spacerWidth = scaledPadLR;
    trackEl.style.setProperty("--partition-preview-art-height", `${trackArtHeight}px`);
    trackEl.style.setProperty("--partition-preview-pad-tb", `${trackPadTB}px`);
    trackEl.style.setProperty("--partition-preview-pad-lr", `${trackPadLR}px`);
    trackEl.style.setProperty("--partition-preview-gap", `${scaledGap}px`);
    trackEl.style.setProperty("--partition-preview-bg", settings.backgroundColor);
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
    image.alt = "";
    image.draggable = false;
    applyEditorAssetColorToImage(image, item.src);
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

function removePartitionArtworkById(partitionKey, artworkId) {
  const key = normalizePartitionKey(partitionKey);
  const id = String(artworkId || "");
  if (!key || !id) {
    return false;
  }
  const items = partitionArtworks[key];
  if (!Array.isArray(items) || !items.length) {
    return false;
  }
  const index = items.findIndex((item) => item && item.id === id);
  if (index < 0) {
    return false;
  }
  items.splice(index, 1);
  savePartitionArtworks(partitionArtworks);
  renderPartitionEditor(key);
  render3dPreview();
  sendLoopConfigToPreview();
  return true;
}

function updateLatestPointerFromEvent(eventLike) {
  if (!eventLike || typeof eventLike !== "object") {
    return;
  }
  const sourceEvent =
    eventLike.touches && eventLike.touches.length
      ? eventLike.touches[0]
      : eventLike.changedTouches && eventLike.changedTouches.length
        ? eventLike.changedTouches[0]
        : eventLike;
  const x = Number(sourceEvent.clientX);
  const y = Number(sourceEvent.clientY);
  if (Number.isFinite(x) && Number.isFinite(y)) {
    latestPointer.x = x;
    latestPointer.y = y;
  }
}

function pointerFromSortableEvent(evt) {
  const originalEvent = evt && evt.originalEvent ? evt.originalEvent : null;
  updateLatestPointerFromEvent(originalEvent);
  if (Number.isFinite(latestPointer.x) && Number.isFinite(latestPointer.y)) {
    return { x: latestPointer.x, y: latestPointer.y };
  }
  return null;
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
      onStart: (evt) => {
        const originalEvent = evt && evt.originalEvent ? evt.originalEvent : null;
        updateLatestPointerFromEvent(originalEvent);
      },
      onMove: (evt) => {
        const originalEvent = evt && evt.originalEvent ? evt.originalEvent : null;
        updateLatestPointerFromEvent(originalEvent);
        return true;
      },
      onChange: () => {
        updatePartitionActiveWindows();
      },
      onEnd: (evt) => {
        const draggedId = evt && evt.item && evt.item.dataset ? evt.item.dataset.artworkId : "";
        const pointer = pointerFromSortableEvent(evt);
        if (draggedId && pointer) {
          const dropTarget = document.elementFromPoint(pointer.x, pointer.y);
          const droppedTrack = dropTarget ? dropTarget.closest(".partition-preview-track") : null;
          if (!droppedTrack) {
            removePartitionArtworkById(key, draggedId);
            return;
          }
        }
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

  items.forEach((item) => {
    const tile = document.createElement("div");
    tile.className = "partition-preview-item partition-preview-segment";
    tile.dataset.artworkId = item.id;

    const image = document.createElement("img");
    image.alt = "";
    image.draggable = false;
    applyEditorAssetColorToImage(image, item.src, key);
    tile.appendChild(image);

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
  const normalizedProgress = computePreview3dLoopProgress();

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
      onStart: (evt) => {
        const originalEvent = evt && evt.originalEvent ? evt.originalEvent : null;
        updateLatestPointerFromEvent(originalEvent);
      },
      onMove: (evt) => {
        const originalEvent = evt && evt.originalEvent ? evt.originalEvent : null;
        updateLatestPointerFromEvent(originalEvent);
        return true;
      },
      onChange: () => {
        updateActiveWindow();
      },
      onEnd: (evt) => {
        const draggedId = evt && evt.item && evt.item.dataset ? evt.item.dataset.artworkId : "";
        const pointer = pointerFromSortableEvent(evt);
        if (draggedId && pointer) {
          const dropTarget = document.elementFromPoint(pointer.x, pointer.y);
          const droppedTrack = dropTarget ? dropTarget.closest(".loop-preview-track") : null;
          if (!droppedTrack) {
            removeArtworkById(draggedId);
            return;
          }
        }
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
  const normalizedProgress = computePreview3dLoopProgress();
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
    const offsetParent = loopElapsedTime.offsetParent || loopVisualization.parentElement || document.body;
    const parentRect =
      offsetParent && offsetParent.getBoundingClientRect
        ? offsetParent.getBoundingClientRect()
        : { left: 0, top: 0 };
    const parentScrollLeft = Number(offsetParent && offsetParent.scrollLeft) || 0;
    const parentScrollTop = Number(offsetParent && offsetParent.scrollTop) || 0;
    const visualizationRect = loopVisualization.getBoundingClientRect();
    const primaryRect = loopActiveWindow.getBoundingClientRect();
    const secondaryRect =
      loopActiveWindowSecondary && loopActiveWindowSecondary.style.display !== "none"
        ? loopActiveWindowSecondary.getBoundingClientRect()
        : null;
    let activeRect = primaryRect;
    if (secondaryRect && secondaryRect.width > primaryRect.width) {
      activeRect = secondaryRect;
    } else if (primaryRect.width <= 0 && secondaryRect) {
      activeRect = secondaryRect;
    }
    const centeredLeft = activeRect.left + activeRect.width / 2 - parentRect.left + parentScrollLeft;
    const outsideBottomTop = visualizationRect.bottom - parentRect.top + parentScrollTop + 6;
    loopElapsedTime.style.left = `${centeredLeft}px`;
    loopElapsedTime.style.top = `${outsideBottomTop}px`;
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

function removeArtworkById(artworkId) {
  const id = String(artworkId || "");
  if (!id || loopArtworks.length <= 1) {
    return false;
  }
  const index = loopArtworks.findIndex((item) => item && item.id === id);
  if (index < 0) {
    return false;
  }
  loopArtworks.splice(index, 1);
  saveArtworks(loopArtworks);
  renderLoopPreview();
  sendLoopConfigToPreview();
  return true;
}

function renderDirectory(directions) {
  directoryPanel.innerHTML = "";

  const directionsSection = document.createElement("section");
  directionsSection.className = "directory-section";

  const directionsTitle = document.createElement("h2");
  directionsTitle.textContent = "tools";
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
    button.textContent = getDirectionDisplayName(name);
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
  outputsTitle.textContent = "saved";
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
  applyThemeMode(readStorage(STORAGE_KEYS.themeMode) || "light");
  restoreSpeed();
  restoreLoopLayoutSettings();
  restorePreview3dSettings();
  previewViewMode = normalizePreviewViewMode(
    readStorage(STORAGE_KEYS.previewViewMode) || (previewViewModeControl ? previewViewModeControl.value : "3d")
  );
  if (!readStorage(STORAGE_KEYS.previewViewMode)) {
    previewViewMode = "3d";
    savePreviewViewMode(previewViewMode);
  }
  loopArtworks = restoreArtworks();
  partitionArtworks = restorePartitionArtworks();
  partitionSettingsByKey = restorePartitionSettings();
  activePartitionSettingsKey = activePartitionSettingsKeyValue();
  loopDurationSeconds = currentSpeedSeconds();
  loopTraverseSeconds = loopDurationSeconds;

  try {
    let directions = [];
    try {
      directions = await loadDirectionsFromManifest();
    } catch (error) {
      directions = await discoverDirections();
    }

    if (!directions.length) {
      throw new Error("No tools found");
    }

    knownDirections = [...directions];
    sharedOutputs = await fetchOutputsFromServer();
    renderDirectory(directions);
  } catch (error) {
    emptyState.textContent = "No tools found. Check directions/manifest.json.";
  }

  syncSpeedReadout();
  loopRowGap = currentRowGap();
  renderLoopPreview();
  renderPartitionEditors();
  syncDirectionModeUI();
  applyPreviewViewMode(previewViewMode);
  syncViewControlsUI();
  syncPanelVisibility();

  if (partitionSettingsTabs.length) {
    partitionSettingsTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const key = normalizePartitionKey(tab.dataset.partitionKey) || "left";
        applyPartitionSettingsToControls(key);
        syncEffectiveLoopPadding();
        syncVisualizationPaddingScaled();
        syncVisualizationGapScaled();
        syncPartitionEditorVisuals();
        render3dPreview();
        sendLoopConfigToPreview();
      });
    });
  }

  if (speedControl) {
    speedControl.addEventListener("input", () => {
      const nextSeconds = currentSpeedSeconds();
      loopDurationSeconds = nextSeconds;
      loopTraverseSeconds = nextSeconds;
      syncSpeedReadout();
      if (currentDirectionIsPartitioned()) {
        writeCurrentControlsToPartitionSettings(activePartitionSettingsKeyValue());
        savePartitionSettings(partitionSettingsByKey);
      } else {
        saveSpeed(nextSeconds);
      }
      render3dPreview();
      sendLoopConfigToPreview();
      updateActiveWindow();
      updatePartitionActiveWindows();
    });
  }

  if (padTBControl) {
    padTBControl.addEventListener("input", () => {
      if (currentDirectionIsPartitioned()) {
        writeCurrentControlsToPartitionSettings(activePartitionSettingsKeyValue());
        savePartitionSettings(partitionSettingsByKey);
      } else {
        savePadTopBottom(currentPadTopBottom());
      }
      syncEffectiveLoopPadding();
      syncVisualizationPaddingScaled();
      syncVisualizationGeometry();
      syncPartitionEditorVisuals();
      render3dPreview();
      sendLoopConfigToPreview();
    });
  }

  if (padLRControl) {
    padLRControl.addEventListener("input", () => {
      if (currentDirectionIsPartitioned()) {
        writeCurrentControlsToPartitionSettings(activePartitionSettingsKeyValue());
        savePartitionSettings(partitionSettingsByKey);
      } else {
        savePadLeftRight(currentPadLeftRight());
      }
      syncEffectiveLoopPadding();
      syncVisualizationPaddingScaled();
      syncVisualizationGeometry();
      syncPartitionEditorVisuals();
      render3dPreview();
      sendLoopConfigToPreview();
    });
  }

  if (bgColorControl) {
    bgColorControl.addEventListener("input", () => {
      if (currentDirectionIsPartitioned()) {
        writeCurrentControlsToPartitionSettings(activePartitionSettingsKeyValue());
        savePartitionSettings(partitionSettingsByKey);
      } else {
        saveBackgroundColor(currentBackgroundColor());
      }
      syncVisualizationBackground();
      syncPartitionEditorVisuals();
      render3dPreview();
      sendLoopConfigToPreview();
    });
  }

  if (assetColorControl) {
    assetColorControl.addEventListener("input", () => {
      if (currentDirectionIsPartitioned()) {
        writeCurrentControlsToPartitionSettings(activePartitionSettingsKeyValue());
        savePartitionSettings(partitionSettingsByKey);
      } else {
        saveAssetColor(currentAssetColor());
      }
      if (currentDirectionIsPartitioned()) {
        renderPartitionEditors();
      } else {
        renderLoopPreview();
      }
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

  if (viewModeChoiceButtons.length) {
    viewModeChoiceButtons.forEach((button) => {
      button.addEventListener("click", () => {
        setPreviewViewModeControlValue(button.dataset.value);
      });
    });
    syncViewModeToggleStates();
  }

  if (themeToggleButton) {
    themeToggleButton.addEventListener("click", () => {
      const isDark = document.body.classList.contains("dark-mode");
      applyThemeMode(isDark ? "light" : "dark");
    });
  }

  if (settingsToggleButton) {
    settingsToggleButton.addEventListener("click", () => {
      if (!settingsPanelAllowed) {
        return;
      }
      isSettingsPanelOpen = !isSettingsPanelOpen;
      syncPanelVisibility();
    });
  }

  if (viewControlsToggleButton) {
    viewControlsToggleButton.addEventListener("click", () => {
      setViewControlsPanelVisibility(!isViewControlsPanelOpen);
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

  if (cameraZoomControl) {
    cameraZoomControl.addEventListener("input", () => {
      preview3dCamera.zoom = Number(cameraZoomControl.value) || 1;
      clampPreview3dCamera();
      persistPreview3dSettings();
      syncViewControlsUI();
      update3dPreviewAnimation();
    });
  }

  if (cameraTargetXControl) {
    cameraTargetXControl.addEventListener("input", () => {
      preview3dCamera.targetX = Number(cameraTargetXControl.value) || 0;
      clampPreview3dCamera();
      persistPreview3dSettings();
      syncViewControlsUI();
      update3dPreviewAnimation();
    });
  }

  if (cameraTargetYControl) {
    cameraTargetYControl.addEventListener("input", () => {
      preview3dCamera.targetY = Number(cameraTargetYControl.value) || 0;
      clampPreview3dCamera();
      persistPreview3dSettings();
      syncViewControlsUI();
      update3dPreviewAnimation();
    });
  }

  if (cameraTargetZControl) {
    cameraTargetZControl.addEventListener("input", () => {
      preview3dCamera.targetZ = Number(cameraTargetZControl.value) || 0;
      clampPreview3dCamera();
      persistPreview3dSettings();
      syncViewControlsUI();
      update3dPreviewAnimation();
    });
  }

  if (projectionBrightnessControl) {
    projectionBrightnessControl.addEventListener("input", () => {
      const parsed = Number(projectionBrightnessControl.value);
      preview3dRenderSettings.projectionBrightness =
        Number.isFinite(parsed) ? parsed : preview3dRenderSettings.projectionBrightness;
      clampPreview3dCamera();
      persistPreview3dSettings();
      syncViewControlsUI();
      if (preview3dThreeState.mesh && preview3dThreeState.mesh.material && ENABLE_3D_ARTWORK_PROJECTION) {
        tuneProjectionMaterial(preview3dThreeState.mesh.material);
      }
      update3dPreviewAnimation();
    });
  }

  if (projectionShadowControl) {
    projectionShadowControl.addEventListener("input", () => {
      const parsed = Number(projectionShadowControl.value);
      preview3dRenderSettings.projectionShadow =
        Number.isFinite(parsed) ? parsed : preview3dRenderSettings.projectionShadow;
      clampPreview3dCamera();
      persistPreview3dSettings();
      syncViewControlsUI();
      if (preview3dThreeState.mesh && preview3dThreeState.mesh.material && ENABLE_3D_ARTWORK_PROJECTION) {
        tuneProjectionMaterial(preview3dThreeState.mesh.material);
      }
      update3dPreviewAnimation();
    });
  }

  if (projectionGlareControl) {
    projectionGlareControl.addEventListener("input", () => {
      const parsed = Number(projectionGlareControl.value);
      preview3dRenderSettings.projectionGlare =
        Number.isFinite(parsed) ? parsed : preview3dRenderSettings.projectionGlare;
      clampPreview3dCamera();
      persistPreview3dSettings();
      syncViewControlsUI();
      if (preview3dThreeState.mesh && preview3dThreeState.mesh.material && ENABLE_3D_ARTWORK_PROJECTION) {
        tuneProjectionMaterial(preview3dThreeState.mesh.material);
      }
      update3dPreviewAnimation();
    });
  }

  if (resetViewControlsButton) {
    resetViewControlsButton.addEventListener("click", () => {
      applyDefaultPreview3dCameraState();
      persistPreview3dSettings();
      syncViewControlsUI();
      render3dPreview();
    });
  }

  if (assetGapControl) {
    assetGapControl.addEventListener("input", () => {
      if (currentDirectionIsPartitioned()) {
        writeCurrentControlsToPartitionSettings(activePartitionSettingsKeyValue());
        savePartitionSettings(partitionSettingsByKey);
      } else {
        saveAssetGap(currentAssetGap());
      }
      loopAssetGap = currentAssetGap();
      syncVisualizationGapScaled();
      syncPartitionEditorVisuals();
      render3dPreview();
      sendLoopConfigToPreview();
    });
  }

  if (artworkOrientationControl) {
    artworkOrientationControl.addEventListener("change", () => {
      syncOrientationToggleStates();
      saveArtworkOrientation(currentArtworkOrientation());
      render3dPreview();
      sendLoopConfigToPreview();
    });
  }

  [partitionOrientationLeftControl, partitionOrientationCurveControl, partitionOrientationRightControl]
    .filter((control) => !!control)
    .forEach((control) => {
      control.addEventListener("change", () => {
        syncOrientationToggleStates();
        savePartitionArtworkOrientations(currentPartitionArtworkOrientations());
        render3dPreview();
        sendLoopConfigToPreview();
      });
    });

  if (orientationChoiceButtons.length) {
    orientationChoiceButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const targetId = button.dataset.orientationTarget || "";
        const control = targetId ? document.getElementById(targetId) : null;
        if (!control) {
          return;
        }
        setOrientationControlValue(control, button.dataset.value);
      });
    });
    syncOrientationToggleStates();
  }

  if (rowCountControl) {
    rowCountControl.addEventListener("input", () => {
      if (currentDirectionIsPartitioned()) {
        writeCurrentControlsToPartitionSettings(activePartitionSettingsKeyValue());
        savePartitionSettings(partitionSettingsByKey);
      } else {
        saveRowCount(currentRowCount());
      }
      render3dPreview();
      sendLoopConfigToPreview();
    });
  }

  if (rowOffsetControl) {
    rowOffsetControl.addEventListener("input", () => {
      if (currentDirectionIsPartitioned()) {
        writeCurrentControlsToPartitionSettings(activePartitionSettingsKeyValue());
        savePartitionSettings(partitionSettingsByKey);
      } else {
        saveRowOffset(currentRowOffset());
      }
      render3dPreview();
      sendLoopConfigToPreview();
    });
  }

  if (rowGapControl) {
    rowGapControl.addEventListener("input", () => {
      if (currentDirectionIsPartitioned()) {
        writeCurrentControlsToPartitionSettings(activePartitionSettingsKeyValue());
        savePartitionSettings(partitionSettingsByKey);
      } else {
        saveRowGap(currentRowGap());
      }
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

  document.addEventListener("dragover", (event) => {
    updateLatestPointerFromEvent(event);
  });
  document.addEventListener("drop", (event) => {
    updateLatestPointerFromEvent(event);
  });
  document.addEventListener(
    "mousemove",
    (event) => {
      updateLatestPointerFromEvent(event);
    },
    { passive: true }
  );

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
    const shouldUpdateViewportMetrics = previewViewMode !== "3d";

    if (Number.isFinite(progress)) {
      loopPlaybackProgress = progress;
    }
    if (shouldUpdateViewportMetrics && Number.isFinite(viewportRatio)) {
      loopPlaybackViewportRatio = viewportRatio;
    }
    if (Number.isFinite(elapsedSeconds)) {
      const durationForUnwrap = Number(preview3dPlaybackSyncState.durationSeconds);
      if (
        preview3dPlaybackSyncState.hasSample &&
        Number.isFinite(preview3dPlaybackSyncState.elapsedContinuous) &&
        Number.isFinite(preview3dPlaybackSyncState.lastSampleElapsed)
      ) {
        let delta = elapsedSeconds - preview3dPlaybackSyncState.lastSampleElapsed;
        if (Number.isFinite(durationForUnwrap) && durationForUnwrap > 0) {
          const half = durationForUnwrap * 0.5;
          if (delta < -half) {
            delta += durationForUnwrap;
          } else if (delta > half) {
            delta -= durationForUnwrap;
          }
        }
        preview3dPlaybackSyncState.elapsedContinuous += delta;
      } else {
        preview3dPlaybackSyncState.elapsedContinuous = elapsedSeconds;
      }
      preview3dPlaybackSyncState.lastSampleElapsed = elapsedSeconds;
      preview3dPlaybackSyncState.elapsedSeconds = elapsedSeconds;
      loopElapsedSeconds = preview3dPlaybackSyncState.elapsedContinuous;
      preview3dPlaybackSyncState.syncedAtMs = performance.now();
      preview3dPlaybackSyncState.hasSample = true;
    }
    if (Number.isFinite(durationSeconds) && durationSeconds > 0) {
      loopDurationSeconds = durationSeconds;
      preview3dPlaybackSyncState.durationSeconds = durationSeconds;
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
    if (shouldUpdateViewportMetrics && payload.partitions && typeof payload.partitions === "object") {
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
    } else if (shouldUpdateViewportMetrics) {
      PARTITION_KEYS.forEach((key) => {
        partitionViewportRatios[key] = loopPlaybackViewportRatio;
        partitionLoopDistances[key] = loopDistanceSource;
      });
    }
    syncEffectiveLoopPadding();
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
    syncEffectiveLoopPadding();
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

  window.addEventListener("three-ready", () => {
    if (previewViewMode === "3d") {
      render3dPreview();
      start3dAnimationLoop();
    }
  });

  setup3dCanvasInteraction();
  syncVisualizationBackground();
  loopAssetGap = currentAssetGap();
  syncEffectiveLoopPadding();
  syncVisualizationPaddingScaled();
  syncVisualizationGapScaled();
  syncPartitionEditorVisuals();
  syncVisualizationGeometry();
  sendLoopConfigToPreview();
  window.requestAnimationFrame(() => {
    sendLoopConfigToPreview();
  });
  window.setTimeout(() => {
    sendLoopConfigToPreview();
  }, 120);
}

function waitForThreeBootstrap(timeoutMs = 4000) {
  if (
    typeof window === "undefined" ||
    (window.THREE && Object.prototype.hasOwnProperty.call(window, "THREE_GLTFLoader"))
  ) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    let resolved = false;
    const finish = () => {
      if (resolved) {
        return;
      }
      resolved = true;
      window.removeEventListener("three-ready", onReady);
      resolve();
    };
    const onReady = () => {
      finish();
    };
    window.addEventListener("three-ready", onReady, { once: true });
    window.setTimeout(() => {
      finish();
    }, Math.max(0, timeoutMs));
  });
}

async function boot() {
  const initialMode = normalizePreviewViewMode(readStorage(STORAGE_KEYS.previewViewMode) || "3d");
  if (initialMode === "3d") {
    await waitForThreeBootstrap(4000);
  }
  await init();
}

boot();
