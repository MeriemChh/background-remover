export const ENGINE_OPTIONS = {
  transformers: {
    id: "transformers",
    label: "Transformers Engine (Default)",
    badge: "Transformers.js + MODNet",
    description: "Primary local engine. Usually faster for most users and fully browser-based.",
  },
  imgly: {
    id: "imgly",
    label: "IMG.LY Engine (Fallback)",
    badge: "@imgly/background-removal",
    description: "Fallback local engine for compatibility if Transformers fails on your device.",
  },
};

export function getAlternateEngineId(engineId) {
  return engineId === "imgly" ? "transformers" : "imgly";
}
