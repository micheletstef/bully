<?php
declare(strict_types=1);

header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-store");

$rootDir = dirname(__DIR__);
$assetsRoot = $rootDir . "/assets";
$allowedGroups = ["animations", "graphics"];
$allowedExtensions = ["svg", "png", "jpg", "jpeg", "jpt", "gif", "pdf", "eps", "webp"];

function respond(int $statusCode, $payload): void
{
    http_response_code($statusCode);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

function sanitizeBaseName(string $name): string
{
    $value = preg_replace("/[^A-Za-z0-9._-]+/", "-", $name) ?? "";
    $value = trim($value, "-._");
    return $value !== "" ? $value : "asset";
}

function randomSuffix(int $bytes = 6): string
{
    try {
        return bin2hex(random_bytes($bytes));
    } catch (Throwable $error) {
        return dechex(time()) . substr(md5((string)mt_rand()), 0, $bytes * 2);
    }
}

function normalizeGroup(string $value): string
{
    $group = strtolower(trim($value));
    return $group === "animations" ? "animations" : "graphics";
}

function ensureDirectory(string $directory): void
{
    if (!is_dir($directory) && !mkdir($directory, 0775, true) && !is_dir($directory)) {
        respond(500, ["error" => "Unable to create assets directory."]);
    }
}

function listAssets(string $assetsRoot, array $groups, array $extensions): array
{
    $allowed = array_fill_keys($extensions, true);
    $entries = [];

    foreach ($groups as $group) {
        $dir = $assetsRoot . "/" . $group;
        if (!is_dir($dir)) {
            continue;
        }
        $names = scandir($dir);
        if (!is_array($names)) {
            continue;
        }
        foreach ($names as $name) {
            if ($name === "." || $name === ".." || strpos($name, ".") === 0) {
                continue;
            }
            $fullPath = $dir . "/" . $name;
            if (!is_file($fullPath)) {
                continue;
            }
            $extension = strtolower(pathinfo($name, PATHINFO_EXTENSION));
            if (!isset($allowed[$extension])) {
                continue;
            }
            $entries[] = [
                "src" => "assets/" . $group . "/" . rawurlencode($name),
                "name" => $name,
                "group" => $group
            ];
        }
    }

    usort($entries, static function (array $a, array $b): int {
        return strnatcasecmp((string)$a["name"], (string)$b["name"]);
    });

    return $entries;
}

$method = $_SERVER["REQUEST_METHOD"] ?? "GET";

if ($method === "GET") {
    respond(200, listAssets($assetsRoot, $allowedGroups, $allowedExtensions));
}

if ($method === "POST") {
    $group = normalizeGroup((string)($_POST["group"] ?? "graphics"));
    $targetDir = $assetsRoot . "/" . $group;
    ensureDirectory($targetDir);

    if (!isset($_FILES["file"]) || !is_array($_FILES["file"])) {
        respond(400, ["error" => "Missing uploaded file."]);
    }
    $upload = $_FILES["file"];
    $errorCode = (int)($upload["error"] ?? UPLOAD_ERR_NO_FILE);
    if ($errorCode !== UPLOAD_ERR_OK) {
        respond(400, ["error" => "Upload failed."]);
    }

    $originalName = (string)($upload["name"] ?? "");
    $tmpPath = (string)($upload["tmp_name"] ?? "");
    if ($originalName === "" || $tmpPath === "" || !is_uploaded_file($tmpPath)) {
        respond(400, ["error" => "Invalid uploaded file."]);
    }

    $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
    if (!in_array($extension, $allowedExtensions, true)) {
        respond(400, ["error" => "Unsupported file type."]);
    }

    $baseName = sanitizeBaseName(pathinfo($originalName, PATHINFO_FILENAME));
    $storedName = $baseName . "-" . randomSuffix(6) . "." . $extension;
    $targetPath = $targetDir . "/" . $storedName;

    if (!move_uploaded_file($tmpPath, $targetPath)) {
        respond(500, ["error" => "Unable to save uploaded file."]);
    }

    respond(201, [
        "src" => "assets/" . $group . "/" . rawurlencode($storedName),
        "name" => $storedName,
        "group" => $group
    ]);
}

respond(405, ["error" => "Method not allowed."]);
