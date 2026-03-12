const directoryPanel = document.getElementById("directoryPanel");
const billboardPreview = document.getElementById("billboardPreview");
const emptyState = document.getElementById("emptyState");
const speedControl = document.getElementById("speedControl");
const speedValue = document.getElementById("speedValue");
const STORAGE_KEYS = {
  speed: "billboard.loopSpeedSeconds",
  direction: "billboard.selectedDirection"
};

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

function saveSpeed(seconds) {
  try {
    localStorage.setItem(STORAGE_KEYS.speed, String(seconds));
  } catch (error) {
    // Ignore storage failures.
  }
}

function restoreSpeed() {
  if (!speedControl) {
    return;
  }

  try {
    const rawValue = localStorage.getItem(STORAGE_KEYS.speed);
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
  } catch (error) {
    // Ignore storage failures.
  }
}

function saveSelectedDirection(name) {
  try {
    localStorage.setItem(STORAGE_KEYS.direction, name);
  } catch (error) {
    // Ignore storage failures.
  }
}

function restoreSelectedDirection() {
  try {
    return localStorage.getItem(STORAGE_KEYS.direction);
  } catch (error) {
    return null;
  }
}

function syncSpeedReadout() {
  if (!speedValue) {
    return;
  }
  speedValue.textContent = `${currentSpeedSeconds()}s`;
}

function sendSpeedToPreview() {
  if (!billboardPreview.contentWindow) {
    return;
  }
  billboardPreview.contentWindow.postMessage(
    {
      type: "setLoopDuration",
      seconds: currentSpeedSeconds()
    },
    "*"
  );
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

  if (speedControl) {
    speedControl.addEventListener("input", () => {
      syncSpeedReadout();
      saveSpeed(currentSpeedSeconds());
      sendSpeedToPreview();
    });
  }

  billboardPreview.addEventListener("load", () => {
    sendSpeedToPreview();
  });
}

init();
