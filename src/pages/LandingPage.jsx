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
            portraits, and visual assets.
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
            <p>Generate transparent cutouts quickly, then focus only on final detail work.</p>
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

        <div className="landing-footer-note">
          Browser-based workflow. No uploads to your own server required.
        </div>
      </section>
    </main>
  );
}
