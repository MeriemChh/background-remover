import { Link } from "react-router-dom";
import "../shared/styles/landing.css";

export default function LandingPage() {
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
            <article>
              <p>1. Original Upload</p>
              <img src="/initial.JPG" alt="Original image before background removal" loading="lazy" />
            </article>
            <article>
              <p>2. AI Processed</p>
              <img src="/ai-result.png" alt="Image after AI background removal" loading="lazy" />
            </article>
            <article>
              <p>3. Manual Refinement</p>
              <img src="/final-result.png" alt="Final image after manual refinement in SketchClean" loading="lazy" />
            </article>
          </div>
        </section>

        <div className="landing-footer-note">
          Browser-based workflow. No uploads to your own server required.
        </div>
      </section>
    </main>
  );
}
