import { removeBackground as imglyRemoveBackground } from "@imgly/background-removal";

export async function removeImageBackground(file, onProgress) {
  return imglyRemoveBackground(file, {
    progress: (_, current, total) => {
      if (typeof onProgress === "function") {
        onProgress(Math.round((current / total) * 100));
      }
    },
  });
}
