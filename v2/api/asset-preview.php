<?php
declare(strict_types=1);

$rootDir = dirname(__DIR__);
$assetsRoot = realpath($rootDir . "/assets");

if ($assetsRoot === false) {
    http_response_code(500);
    exit;
}

function fail(int $statusCode, string $message): void
{
    http_response_code($statusCode);
    header("Content-Type: application/json; charset=utf-8");
    echo json_encode(["error" => $message], JSON_UNESCAPED_SLASHES);
    exit;
}

function servePng(string $path): void
{
    if (!is_file($path)) {
        fail(404, "Preview not found.");
    }
    header("Content-Type: image/png");
    header("Cache-Control: public, max-age=86400");
    header("Content-Length: " . (string)filesize($path));
    readfile($path);
    exit;
}

function commandExists(string $command): bool
{
    $probe = stripos(PHP_OS, "WIN") === 0 ? "where " : "command -v ";
    $output = [];
    $exitCode = 1;
    @exec($probe . escapeshellarg($command) . " 2>/dev/null", $output, $exitCode);
    return $exitCode === 0;
}

function convertWithImagick(string $inputPath, string $outputPath): bool
{
    if (!class_exists("Imagick")) {
        return false;
    }
    try {
        $imagick = new Imagick();
        $imagick->setBackgroundColor(new ImagickPixel("transparent"));
        $imagick->setResolution(150, 150);
        $imagick->readImage($inputPath . "[0]");
        $imagick = $imagick->mergeImageLayers(Imagick::LAYERMETHOD_MERGE);
        $imagick->setImageFormat("png");
        $imagick->writeImage($outputPath);
        $imagick->clear();
        $imagick->destroy();
        return is_file($outputPath) && filesize($outputPath) > 0;
    } catch (Throwable $error) {
        return false;
    }
}

function convertWithGhostscript(string $inputPath, string $outputPath): bool
{
    if (!commandExists("gs")) {
        return false;
    }
    $cmd = "gs -q -dSAFER -dBATCH -dNOPAUSE -dUseCropBox -sDEVICE=pngalpha -r150 " .
        "-dFirstPage=1 -dLastPage=1 -sOutputFile=" . escapeshellarg($outputPath) . " " .
        escapeshellarg($inputPath) . " 2>/dev/null";
    $output = [];
    $exitCode = 1;
    @exec($cmd, $output, $exitCode);
    return $exitCode === 0 && is_file($outputPath) && filesize($outputPath) > 0;
}

function convertWithQuickLook(string $inputPath, string $outputPath): bool
{
    if (stripos(PHP_OS, "DAR") !== 0 || !commandExists("qlmanage")) {
        return false;
    }
    $tempDir = sys_get_temp_dir() . "/bully-ql-" . bin2hex(random_bytes(6));
    if (!mkdir($tempDir, 0775, true) && !is_dir($tempDir)) {
        return false;
    }
    $cmd = "qlmanage -t -s 2048 -o " . escapeshellarg($tempDir) . " " . escapeshellarg($inputPath) . " >/dev/null 2>&1";
    $output = [];
    $exitCode = 1;
    @exec($cmd, $output, $exitCode);
    if ($exitCode !== 0) {
        @rmdir($tempDir);
        return false;
    }
    $candidate = $tempDir . "/" . basename($inputPath) . ".png";
    if (!is_file($candidate)) {
        $files = scandir($tempDir);
        if (is_array($files)) {
            foreach ($files as $name) {
                if (strtolower(pathinfo($name, PATHINFO_EXTENSION)) === "png") {
                    $candidate = $tempDir . "/" . $name;
                    break;
                }
            }
        }
    }
    $ok = is_file($candidate) && filesize($candidate) > 0 && @copy($candidate, $outputPath);
    $files = scandir($tempDir);
    if (is_array($files)) {
        foreach ($files as $name) {
            if ($name === "." || $name === "..") {
                continue;
            }
            @unlink($tempDir . "/" . $name);
        }
    }
    @rmdir($tempDir);
    return $ok && is_file($outputPath) && filesize($outputPath) > 0;
}

$rawSrc = (string)($_GET["src"] ?? "");
if ($rawSrc === "") {
    fail(400, "Missing src parameter.");
}

$srcPath = ltrim(rawurldecode($rawSrc), "/");
if (!preg_match("#^assets/(graphics|animations)/#i", $srcPath)) {
    fail(400, "Invalid asset path.");
}

$absolutePath = realpath($rootDir . "/" . $srcPath);
if ($absolutePath === false || !is_file($absolutePath)) {
    fail(404, "Asset not found.");
}
if (strpos($absolutePath, $assetsRoot . DIRECTORY_SEPARATOR) !== 0) {
    fail(403, "Forbidden.");
}

$extension = strtolower(pathinfo($absolutePath, PATHINFO_EXTENSION));
if ($extension !== "pdf") {
    fail(400, "Preview conversion is only available for PDF.");
}

$fingerprint = $absolutePath . "|" . (string)filemtime($absolutePath) . "|" . (string)filesize($absolutePath);
$cacheDir = sys_get_temp_dir() . "/bully-asset-preview-cache";
if (!is_dir($cacheDir) && !mkdir($cacheDir, 0775, true) && !is_dir($cacheDir)) {
    fail(500, "Unable to create preview cache directory.");
}
$cachePath = $cacheDir . "/" . sha1($fingerprint) . ".png";
if (is_file($cachePath) && filesize($cachePath) > 0) {
    servePng($cachePath);
}

$tempPath = $cachePath . ".tmp-" . bin2hex(random_bytes(4));
$converted =
    convertWithImagick($absolutePath, $tempPath) ||
    convertWithGhostscript($absolutePath, $tempPath) ||
    convertWithQuickLook($absolutePath, $tempPath);

if (!$converted) {
    @unlink($tempPath);
    fail(415, "Unable to render preview for this file type on this server.");
}

@rename($tempPath, $cachePath);
servePng($cachePath);
