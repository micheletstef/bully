<?php
declare(strict_types=1);

header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-store");

$dataDir = dirname(__DIR__) . "/data";
$outputsFile = $dataDir . "/outputs.json";

function respond(int $statusCode, $payload): void
{
    http_response_code($statusCode);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

function ensureDataStore(string $dataDir, string $outputsFile): void
{
    if (!is_dir($dataDir) && !mkdir($dataDir, 0775, true) && !is_dir($dataDir)) {
        respond(500, ["error" => "Unable to create data directory."]);
    }
    if (!file_exists($outputsFile)) {
        if (file_put_contents($outputsFile, "[]\n", LOCK_EX) === false) {
            respond(500, ["error" => "Unable to initialize outputs file."]);
        }
    }
}

function readOutputs(string $outputsFile): array
{
    $raw = @file_get_contents($outputsFile);
    if ($raw === false || trim($raw) === "") {
        return [];
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function writeOutputs(string $outputsFile, array $outputs): void
{
    $json = json_encode(array_values($outputs), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    if ($json === false) {
        respond(500, ["error" => "Unable to serialize outputs."]);
    }
    if (file_put_contents($outputsFile, $json . "\n", LOCK_EX) === false) {
        respond(500, ["error" => "Unable to save outputs."]);
    }
}

function normalizeOutput($input): ?array
{
    if (!is_array($input)) {
        return null;
    }
    $id = isset($input["id"]) ? trim((string)$input["id"]) : "";
    $name = isset($input["name"]) ? trim((string)$input["name"]) : "";
    $createdAt = isset($input["createdAt"]) ? trim((string)$input["createdAt"]) : "";
    $html = isset($input["html"]) ? (string)$input["html"] : "";

    if ($id === "" || $name === "" || $createdAt === "" || trim($html) === "") {
        return null;
    }

    return [
        "id" => $id,
        "name" => $name,
        "createdAt" => $createdAt,
        "directionName" => isset($input["directionName"]) ? (string)$input["directionName"] : "",
        "config" => isset($input["config"]) && is_array($input["config"]) ? $input["config"] : new stdClass(),
        "html" => $html
    ];
}

ensureDataStore($dataDir, $outputsFile);

$method = $_SERVER["REQUEST_METHOD"] ?? "GET";

if ($method === "GET") {
    respond(200, readOutputs($outputsFile));
}

if ($method === "POST") {
    $rawBody = file_get_contents("php://input");
    $parsed = json_decode($rawBody ?: "{}", true);
    if (!is_array($parsed)) {
        respond(400, ["error" => "Invalid JSON request body."]);
    }

    $item = normalizeOutput($parsed);
    if ($item === null) {
        respond(400, ["error" => "Invalid output payload."]);
    }

    $outputs = readOutputs($outputsFile);
    array_unshift($outputs, $item);
    writeOutputs($outputsFile, $outputs);
    respond(201, $item);
}

if ($method === "DELETE") {
    $id = isset($_GET["id"]) ? trim((string)$_GET["id"]) : "";
    if ($id === "") {
        respond(400, ["error" => "Missing output id."]);
    }

    $outputs = readOutputs($outputsFile);
    $filtered = array_values(array_filter($outputs, static function ($item) use ($id) {
        if (!is_array($item) || !isset($item["id"])) {
            return false;
        }
        return (string)$item["id"] !== $id;
    }));

    writeOutputs($outputsFile, $filtered);
    respond(200, ["ok" => true]);
}

respond(405, ["error" => "Method not allowed."]);
