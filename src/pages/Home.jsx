import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-container">
        <h1 className="home-title">AI Support for Your Website</h1>

        <p className="home-description">
          Turn visitors into customers instantly.
        </p>

        <button className="home-cta-button" onClick={() => navigate("/auth")}>
          Start Free
        </button>
      </div>

      {/* FOOTER */}
      <footer className="app-footer">
        Built by{" "}
        <a href="https://29rl.dev" target="_blank" rel="noopener noreferrer">
          29RL.DEV
        </a>
      </footer>
    </div>
  );
}
