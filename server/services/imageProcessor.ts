import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

type SupportedFormat = "jpeg" | "png" | "webp" | "avif" | "heif";

interface ImageProcessOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  outputPath?: string;
}

export interface ImageProcessResult {
  outputPath: string;
  width: number;
  height: number;
  size: number;
  format: string;
  wasResized: boolean;
}

const DEFAULT_MAX_DIMENSION = 1600;
const DEFAULT_QUALITY = 72; // Medium quality sweet spot for web photos

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/**
 * Downscale and recompress an image to a "medium" web-friendly quality.
 * The output defaults to the same path as the input, so uploads can be
 * optimized in-place right after multer writes them to disk.
 */
export async function optimizeImage(
  inputPath: string,
  options: ImageProcessOptions = {},
): Promise<ImageProcessResult> {
  const resolvedInput = path.resolve(inputPath);
  const desiredOutput = options.outputPath
    ? path.resolve(options.outputPath)
    : resolvedInput;

  // Sharp cannot read and write to the same file path; use a temp file when needed
  const ext = path.extname(desiredOutput) || ".jpg";
  const tempOutput =
    desiredOutput === resolvedInput
      ? path.join(
          path.dirname(resolvedInput),
          `${path.basename(resolvedInput, ext)}-optimized${ext}`,
        )
      : desiredOutput;

  let metadata;
  try {
    metadata = await sharp(resolvedInput, { failOnError: false }).metadata();
  } catch (err) {
    const stats = await fs.stat(resolvedInput);
    return {
      outputPath: desiredOutput,
      width: 0,
      height: 0,
      size: stats.size,
      format: "unknown",
      wasResized: false,
    };
  }

  const resizeOptions: sharp.ResizeOptions = {
    width: options.maxWidth ?? DEFAULT_MAX_DIMENSION,
    height: options.maxHeight ?? DEFAULT_MAX_DIMENSION,
    fit: "inside",
    withoutEnlargement: true,
  };

  const quality = clamp(options.quality ?? DEFAULT_QUALITY, 40, 90);
  const format = normalizeFormat(metadata.format);
  const targetWidth = resizeOptions.width ?? DEFAULT_MAX_DIMENSION;
  const targetHeight = resizeOptions.height ?? DEFAULT_MAX_DIMENSION;

  let pipeline = sharp(resolvedInput, { failOnError: false })
    .rotate() // Respect EXIF orientation
    .resize(resizeOptions);

  if (format === "png") {
    pipeline = pipeline.png({
      quality: Math.min(quality + 10, 95),
      compressionLevel: 9,
      palette: true,
    });
  } else if (format === "webp") {
    pipeline = pipeline.webp({ quality, effort: 4 });
  } else if (format === "avif" || format === "heif") {
    pipeline = pipeline.toFormat("avif", {
      quality: Math.max(quality - 10, 35),
    });
  } else {
    pipeline = pipeline.jpeg({ quality, mozjpeg: true });
  }

  await pipeline.toFile(tempOutput);

  // If we wrote to a temp file, replace the original
  if (tempOutput !== desiredOutput) {
    await fs.rename(tempOutput, desiredOutput);
  }

  const optimizedMetadata = await sharp(desiredOutput, {
    failOnError: false,
  }).metadata();
  const stats = await fs.stat(desiredOutput);

  return {
    outputPath: desiredOutput,
    width: optimizedMetadata.width ?? metadata.width ?? 0,
    height: optimizedMetadata.height ?? metadata.height ?? 0,
    size: stats.size,
    format: optimizedMetadata.format ?? format,
    wasResized:
      Boolean(metadata.width && metadata.width > targetWidth) ||
      Boolean(metadata.height && metadata.height > targetHeight),
  };
}

/**
 * Convenience helper to downscale an image in-place to a web-friendly size (1600px max)
 * while keeping reasonable quality. Returns the same result shape as optimizeImage.
 */
export async function downscaleForWeb(
  inputPath: string,
  overrides: Partial<ImageProcessOptions> = {},
): Promise<ImageProcessResult> {
  return optimizeImage(inputPath, {
    maxWidth: DEFAULT_MAX_DIMENSION,
    maxHeight: DEFAULT_MAX_DIMENSION,
    quality: DEFAULT_QUALITY,
    ...overrides,
    outputPath: overrides.outputPath ?? inputPath,
  });
}

const normalizeFormat = (format?: string): SupportedFormat | "jpeg" => {
  if (format === "png" || format === "webp" || format === "avif") {
    return format;
  }

  if (format === "heif" || format === "heic") {
    return "heif";
  }

  // Default to jpeg for anything else (bmp, tiff, gif, unknown, etc.)
  return "jpeg";
};

/**
 * Gracefully optimize an image, tolerating unsupported/invalid inputs.
 * Returns undefined if the file could not be processed at all.
 */
export async function safeOptimizeImage(
  inputPath: string,
  options: ImageProcessOptions = {},
): Promise<ImageProcessResult | undefined> {
  try {
    return await optimizeImage(inputPath, options);
  } catch (err) {
    console.warn(`safeOptimizeImage: skipping file ${inputPath}`, err);
    return undefined;
  }
}
