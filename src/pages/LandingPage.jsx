import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { prewarmTransformersEngine } from "../features/background-remover/services/transformersEngine";
import "../shared/styles/landing.css";

export default function LandingPage() {
  const showcaseItems = [
    { key: "initial", step: "1. Original Upload", src: "/initial.JPG", alt: "Original image before background removal" },
    { key: "ai", step: "2. AI Processed", src: "/ai-result.png", alt: "Image after AI background removal" },
    { key: "final", step: "3. Manual Refinement", src: "/final-result.png", alt: "Final image after manual refinement in SketchClean" },
  ];
  const [imagesLoaded, setImagesLoaded] = useState({});

  useEffect(() => {
    let mounted = true;
    const toastId = "model-warmup";
    toast.loading("Warming up local AI models...", { toastId, autoClose: false });

    prewarmTransformersEngine(progress => {
      if (!mounted) return;
      if (typeof progress === "number") {
        const p = Math.max(0, Math.min(100, Math.round(progress)));
        toast.update(toastId, {
          isLoading: true,
          autoClose: false,
          render: `Warming up local AI models... ${p}%`,
        });
      }
    })
      .then(() => {
        if (!mounted) return;
        toast.update(toastId, {
          isLoading: false,
          type: "success",
          autoClose: 2200,
          render: "Local AI models are ready. You can start instantly.",
        });
      })
      .catch(() => {
        if (!mounted) return;
        toast.update(toastId, {
          isLoading: false,
          type: "warning",
          autoClose: 3200,
          render: "Model warm-up failed. App still works when you start processing.",
        });
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="landing-page">
      <section className="landing-shell">
        <header className="landing-header">
          <p className="landing-kicker">SketchClean</p>
          <a href="https://github.com/MeriemChh/background-remover" target="_blank" rel="noreferrer">
            Open Source
          </a>
        </header>

        <section className="landing-hero">
          <span className="landing-badge">AI Background Remover</span>
          <h1>Remove Backgrounds. Keep Creative Control.</h1>
          <p>
            Clean cutouts in seconds, then refine edges with precision brush tools for product photos,
            portraits, and visual assets using two fully local AI engines: IMG.LY and Transformers.js.
          </p>

          <div className="landing-actions">
            <Link to="/workspace" className="landing-primary-link">
              Start Editing
            </Link>
            <a
              href="https://github.com/MeriemChh/background-remover"
              target="_blank"
              rel="noreferrer"
              className="landing-secondary-link"
            >
              View GitHub
            </a>
          </div>
        </section>

        <section className="landing-grid">
          <article>
            <h2>Fast AI Base</h2>
            <p>Generate transparent cutouts quickly with either IMG.LY or a Transformers.js model.</p>
          </article>
          <article>
            <h2>Dual Engine Choice</h2>
            <p>Switch between IMG.LY Engine and Transformers Engine based on your device behavior.</p>
          </article>
          <article>
            <h2>Manual Refinement</h2>
            <p>Use erase and restore brushes to polish hair, fabric edges, and difficult shapes.</p>
          </article>
          <article>
            <h2>Touch-Ready Workflow</h2>
            <p>Built for iPad and Apple Pencil with pan, zoom, and smoother interaction.</p>
          </article>
        </section>

        <section className="landing-showcase" aria-label="Background removal example workflow">
          <h2>See The Workflow</h2>
          <div className="landing-showcase-grid">
            {showcaseItems.map(item => (
              <article key={item.key}>
                <p>{item.step}</p>
                <div className="landing-showcase-image-wrap">
                  {!imagesLoaded[item.key] && (
                    <div className="landing-image-loader">
                      <div className="landing-image-spinner" />
                    </div>
                  )}
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    onLoad={() => setImagesLoaded(prev => ({ ...prev, [item.key]: true }))}
                  />
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="landing-footer-note">
          Browser-based workflow. No uploads to your own server required.
        </div>
      </section>
    </main>
  );
}
