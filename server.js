const http = require("http");
const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const { URL } = require("url");

const PORT = Number(process.env.PORT) || 8080;
const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, "data");
const OUTPUTS_FILE = path.join(DATA_DIR, "outputs.json");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8"
};

async function ensureDataStore() {
  await fsp.mkdir(DATA_DIR, { recursive: true });
  try {
    await fsp.access(OUTPUTS_FILE, fs.constants.F_OK);
  } catch (error) {
    await fsp.writeFile(OUTPUTS_FILE, "[]\n", "utf8");
  }
}

async function readOutputs() {
  await ensureDataStore();
  try {
    const raw = await fsp.readFile(OUTPUTS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

async function writeOutputs(outputs) {
  await ensureDataStore();
  await fsp.writeFile(OUTPUTS_FILE, `${JSON.stringify(outputs, null, 2)}\n`, "utf8");
}

function sendJson(res, statusCode, data) {
  const body = JSON.stringify(data);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(body);
}

function sendText(res, statusCode, text) {
  res.writeHead(statusCode, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(text);
}

function collectRequestBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 2_000_000) {
        reject(new Error("Request body too large"));
      }
    });
    req.on("end", () => resolve(raw));
    req.on("error", reject);
  });
}

function normalizeOutputItem(item) {
  if (!item || typeof item !== "object") {
    return null;
  }
  if (typeof item.id !== "string" || !item.id.trim()) {
    return null;
  }
  if (typeof item.name !== "string" || !item.name.trim()) {
    return null;
  }
  if (typeof item.createdAt !== "string" || !item.createdAt.trim()) {
    return null;
  }
  if (typeof item.html !== "string" || !item.html.trim()) {
    return null;
  }

  return {
    id: item.id.trim(),
    name: item.name.trim(),
    createdAt: item.createdAt.trim(),
    directionName: typeof item.directionName === "string" ? item.directionName : "",
    config: item.config && typeof item.config === "object" ? item.config : {},
    html: item.html
  };
}

async function handleApi(req, res, urlObj) {
  const pathName = urlObj.pathname || "/";
  const apiPath = pathName.startsWith("/bully/api/")
    ? pathName.replace("/bully/api/", "/api/")
    : pathName;

  if (apiPath === "/api/outputs" && req.method === "GET") {
    const outputs = await readOutputs();
    sendJson(res, 200, outputs);
    return true;
  }

  if (apiPath === "/api/outputs" && req.method === "POST") {
    try {
      const rawBody = await collectRequestBody(req);
      const parsed = JSON.parse(rawBody || "{}");
      const item = normalizeOutputItem(parsed);
      if (!item) {
        sendJson(res, 400, { error: "Invalid output payload." });
        return true;
      }
      const outputs = await readOutputs();
      outputs.unshift(item);
      await writeOutputs(outputs);
      sendJson(res, 201, item);
      return true;
    } catch (error) {
      sendJson(res, 400, { error: "Invalid JSON request body." });
      return true;
    }
  }

  if (apiPath.startsWith("/api/outputs/") && req.method === "DELETE") {
    const id = decodeURIComponent(apiPath.slice("/api/outputs/".length));
    if (!id) {
      sendJson(res, 400, { error: "Missing output id." });
      return true;
    }
    const outputs = await readOutputs();
    const next = outputs.filter((item) => item && item.id !== id);
    await writeOutputs(next);
    sendJson(res, 200, { ok: true });
    return true;
  }

  return false;
}

async function buildDirectionsListingHtml() {
  const directionsDir = path.join(ROOT_DIR, "directions");
  let entries = [];
  try {
    entries = await fsp.readdir(directionsDir, { withFileTypes: true });
  } catch (error) {
    entries = [];
  }
  const links = entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => `<li><a href="${encodeURIComponent(entry.name)}/">${entry.name}/</a></li>`)
    .join("\n");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>directions</title>
  </head>
  <body>
    <ul>
      ${links}
    </ul>
  </body>
</html>`;
}

function safePathFromUrl(urlPath) {
  const decoded = decodeURIComponent(urlPath);
  const normalized = path.normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  return path.join(ROOT_DIR, normalized);
}

async function serveStatic(req, res, urlObj) {
  if (urlObj.pathname === "/favicon.ico") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (urlObj.pathname === "/directions/" || urlObj.pathname === "/directions") {
    const html = await buildDirectionsListingHtml();
    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store"
    });
    res.end(html);
    return;
  }

  let targetPath = safePathFromUrl(urlObj.pathname);
  if (targetPath.endsWith(path.sep)) {
    targetPath = path.join(targetPath, "index.html");
  }

  try {
    const stat = await fsp.stat(targetPath);
    if (stat.isDirectory()) {
      targetPath = path.join(targetPath, "index.html");
    }
  } catch (error) {
    // Keep target path as is; readFile will handle missing file.
  }

  try {
    const content = await fsp.readFile(targetPath);
    const ext = path.extname(targetPath).toLowerCase();
    const mime = MIME_TYPES[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": mime, "Cache-Control": "no-store" });
    res.end(content);
  } catch (error) {
    sendText(res, 404, "Not found");
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const host = req.headers.host || `localhost:${PORT}`;
    const urlObj = new URL(req.url || "/", `http://${host}`);

    if (await handleApi(req, res, urlObj)) {
      return;
    }

    if (req.method !== "GET" && req.method !== "HEAD") {
      sendText(res, 405, "Method not allowed");
      return;
    }

    await serveStatic(req, res, urlObj);
  } catch (error) {
    sendText(res, 500, "Internal server error");
  }
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running at http://localhost:${PORT}`);
});
