<?php
// Set execution time to 10 minutes to avoid timeouts for large files
ini_set('max_execution_time', 600);
ini_set('memory_limit', '512M');

$dir = __DIR__ . '/img/';
if (!is_dir($dir)) {
    die("Directory img/ not found");
}

echo "<pre>Starting image compression...\n";

$directoryIterator = new RecursiveDirectoryIterator($dir);
$iterator = new RecursiveIteratorIterator($directoryIterator);

foreach ($iterator as $fileInfo) {
    if ($fileInfo->isDir()) continue;
    
    $filePath = $fileInfo->getPathname();
    $file = str_replace($dir, '', $filePath); // Relative path for display

    $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
    // Support jpeg, jpg, png
    if (in_array($ext, ['jpg', 'jpeg', 'png'])) {
        $sizeBefore = filesize($filePath);
        if ($sizeBefore < 50 * 1024) {
            echo "Skipping $file (already small: " . round($sizeBefore/1024, 2) . " KB)\n";
            continue;
        }

        echo "Processing $file (" . round($sizeBefore/1024/1024, 2) . " MB)... ";
        flush();

        // Load image
        $srcImg = null;
        if ($ext === 'png') {
            $srcImg = @imagecreatefrompng($filePath);
        } else {
            $srcImg = @imagecreatefromjpeg($filePath);
        }

        if (!$srcImg) {
            echo "Failed to load image.\n";
            continue;
        }

        $width = imagesx($srcImg);
        $height = imagesy($srcImg);

        // Max dimension
        $maxDim = 1200;
        $newWidth = $width;
        $newHeight = $height;

        if ($width > $maxDim || $height > $maxDim) {
            if ($width > $height) {
                $newWidth = $maxDim;
                $newHeight = intval($height * ($maxDim / $width));
            } else {
                $newHeight = $maxDim;
                $newWidth = intval($width * ($maxDim / $height));
            }
        }

        // Create new image
        $dstImg = imagecreatetruecolor($newWidth, $newHeight);
        
        // Handle transparency for PNGs
        if ($ext === 'png') {
            imagealphablending($dstImg, false);
            imagesavealpha($dstImg, true);
        }

        imagecopyresampled($dstImg, $srcImg, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

        // Save back original format (compressed)
        $success = false;
        if ($ext === 'png') {
            $success = imagepng($dstImg, $filePath, 6); // compression 0-9
        } else {
            $success = imagejpeg($dstImg, $filePath, 75); // quality 0-100
        }

        // Save WebP version next to it for modern browsers
        if ($success) {
            $webpPath = preg_replace('/\.(jpe?g|png)$/i', '.webp', $filePath);
            @imagewebp($dstImg, $webpPath, 75);
        }

        imagedestroy($srcImg);
        imagedestroy($dstImg);

        if ($success) {
            clearstatcache();
            $sizeAfter = filesize($filePath);
            echo "Done! New size: " . round($sizeAfter/1024, 2) . " KB (Reduced by " . round((1 - $sizeAfter/$sizeBefore)*100, 2) . "%)\n";
        } else {
            echo "Failed to save image.\n";
        }
        flush();
    }
}
echo "Compression finished!</pre>";
