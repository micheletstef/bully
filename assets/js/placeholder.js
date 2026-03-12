const directoryPanel = document.getElementById("directoryPanel");
const billboardPreview = document.getElementById("billboardPreview");
const emptyState = document.getElementById("emptyState");
const speedControl = document.getElementById("speedControl");
const speedValue = document.getElementById("speedValue");
const artworkList = document.getElementById("artworkList");
const artworkInput = document.getElementById("artworkInput");
const addArtworkButton = document.getElementById("addArtworkButton");
const loopPreviewTrack = document.getElementById("loopPreviewTrack");
const STORAGE_KEYS = {
  speed: "billboard.loopSpeedSeconds",
  direction: "billboard.selectedDirection",
  artworks: "billboard.loopArtworks"
};
const DEFAULT_ARTWORKS = ["assets/linear-loop-strip.png"];
let loopArtworks = [...DEFAULT_ARTWORKS];
let draggingArtworkIndex = null;

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
      .map((item) => String(item).trim())
      .filter((item) => item.length > 0);
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
    artworks: loopArtworks
  };
  billboardPreview.contentWindow.postMessage(payload, "*");
  billboardPreview.contentWindow.postMessage({ type: "setLoopDuration", seconds }, "*");
}

function renderLoopPreview() {
  if (!loopPreviewTrack) {
    return;
  }

  loopPreviewTrack.innerHTML = "";
  loopArtworks.forEach((src, index) => {
    const tile = document.createElement("div");
    tile.className = "loop-preview-item";
    tile.draggable = true;
    tile.dataset.index = String(index);

    const image = document.createElement("img");
    image.src = src;
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

function artworkFileName(path) {
  const clean = String(path).split("?")[0].split("#")[0];
  const parts = clean.split("/");
  return parts[parts.length - 1] || clean;
}

function artworkLastFive(path) {
  const name = artworkFileName(path);
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

  loopArtworks.forEach((src, index) => {
    const row = document.createElement("div");
    row.className = "artwork-item";

    const thumb = document.createElement("img");
    thumb.className = "artwork-thumb";
    thumb.src = src;
    thumb.alt = "";
    row.appendChild(thumb);

    const name = document.createElement("span");
    name.className = "artwork-index";
    name.textContent = `${index + 1}. ${artworkFileName(src)}`;
    row.appendChild(name);

    const suffix = document.createElement("span");
    suffix.className = "artwork-suffix";
    suffix.textContent = artworkLastFive(src);
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
  if (!artworkInput) {
    return;
  }
  const value = artworkInput.value.trim();
  if (!value) {
    return;
  }
  loopArtworks.push(value);
  artworkInput.value = "";
  saveArtworks(loopArtworks);
  renderArtworkList();
  renderLoopPreview();
  sendLoopConfigToPreview();
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

  if (addArtworkButton) {
    addArtworkButton.addEventListener("click", addArtworkFromInput);
  }

  if (artworkInput) {
    artworkInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        addArtworkFromInput();
      }
    });
  }

  billboardPreview.addEventListener("load", () => {
    sendLoopConfigToPreview();
  });
}

init();
