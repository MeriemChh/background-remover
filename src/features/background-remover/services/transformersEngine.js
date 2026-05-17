import { env, pipeline } from "@huggingface/transformers";

let backgroundRemovalPipelinePromise;
const TRANSFORMERS_TIMEOUT_MS = 120000;

function configureTransformersEnv() {
  env.allowLocalModels = false;
  env.useBrowserCache = true;
}

async function getBackgroundRemovalPipeline(onProgress) {
  if (!backgroundRemovalPipelinePromise) {
    configureTransformersEnv();
    backgroundRemovalPipelinePromise = pipeline("background-removal", "Xenova/modnet", {
      progress_callback: progress => {
        if (typeof onProgress !== "function") return;
        if (typeof progress?.progress === "number") {
          onProgress(Math.round(progress.progress * 100));
        }
      },
    });
  }

  return backgroundRemovalPipelinePromise;
}

function rawImageToBlob(rawImage) {
  const canvas = document.createElement("canvas");
  canvas.width = rawImage.width;
  canvas.height = rawImage.height;
  const ctx = canvas.getContext("2d");

  const imageData = new ImageData(
    new Uint8ClampedArray(rawImage.data),
    rawImage.width,
    rawImage.height,
  );
  ctx.putImageData(imageData, 0, 0);

  return new Promise(resolve => canvas.toBlob(resolve, "image/png"));
}

export async function removeImageBackgroundWithTransformers(file, onProgress) {
  const removeBackground = await getBackgroundRemovalPipeline(onProgress);
  const rawImageResult = await Promise.race([
    removeBackground(file),
    new Promise((_, reject) => {
      setTimeout(() => {
        reject(
          new Error(
            "Transformers engine timed out on this device/browser. Please switch to IMG.LY fallback engine.",
          ),
        );
      }, TRANSFORMERS_TIMEOUT_MS);
    }),
  ]);

  const blob = await rawImageToBlob(rawImageResult);
  if (!blob) {
    throw new Error("Failed to build PNG output from Transformers engine.");
  }

  if (typeof onProgress === "function") {
    onProgress(100);
  }

  return blob;
}
