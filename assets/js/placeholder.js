const directoryPanel = document.getElementById("directoryPanel");
const billboardPreview = document.getElementById("billboardPreview");
const emptyState = document.getElementById("emptyState");

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

async function discoverDirections() {
  const sections = await getDirectoryNames("directions/");
  const visibleSections = sections.filter((name) => name !== "_template");
  const map = {};

  for (const section of visibleSections) {
    const items = await getDirectoryNames(`directions/${section}/`);
    if (!items.length) {
      continue;
    }
    map[section] = items.map((item) => ({
      label: item,
      path: `directions/${section}/${item}/index.html`
    }));
  }

  return map;
}

async function loadDirectionsFromManifest() {
  const response = await fetch("directions/manifest.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Cannot read directions/manifest.json");
  }
  const json = await response.json();

  const map = {};
  Object.entries(json).forEach(([section, items]) => {
    if (!Array.isArray(items) || items.length === 0) {
      return;
    }

    map[section] = items.map((item) => ({
      label: item,
      path: `directions/${section}/${item}/index.html`
    }));
  });

  return map;
}

function loadDirection(path) {
  billboardPreview.src = path;
  billboardPreview.style.display = "block";
  emptyState.style.display = "none";
}

function renderDirectory(directions) {
  directoryPanel.innerHTML = "";

  Object.entries(directions).forEach(([sectionName, items]) => {
    const section = document.createElement("section");
    section.className = "directory-section";

    const title = document.createElement("h2");
    title.textContent = sectionName;
    section.appendChild(title);

    items.forEach((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "direction-item";
      button.textContent = item.label;
      button.addEventListener("click", () => loadDirection(item.path));
      section.appendChild(button);
    });

    directoryPanel.appendChild(section);
  });
}

async function init() {
  try {
    let directions;
    try {
      directions = await discoverDirections();
    } catch (error) {
      directions = await loadDirectionsFromManifest();
    }

    if (!Object.keys(directions).length) {
      throw new Error("No directions found");
    }

    renderDirectory(directions);
  } catch (error) {
    emptyState.textContent = "No directions found. Check directions/manifest.json.";
  }
}

init();
