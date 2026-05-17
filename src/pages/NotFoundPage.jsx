import { Link } from "react-router-dom";
import "../shared/styles/not-found.css";

export default function NotFoundPage() {
  return (
    <main className="not-found-page">
      <section className="not-found-card">
        <p className="not-found-code">404</p>
        <h1>Page Not Found</h1>
        <p>
          The page you requested does not exist or the link may be outdated.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="not-found-home-btn">
            Go Back Home
          </Link>
          <Link to="/workspace" className="not-found-workspace-btn">
            Open Workspace
          </Link>
        </div>
      </section>
    </main>
  );
}
