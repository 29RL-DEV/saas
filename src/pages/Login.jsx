import React, { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Login({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error.message);
      } else {
        onSuccess && onSuccess();
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      {/* Back to Portfolio */}
      <a
        href="https://29rl.dev"
        target="_blank"
        rel="noopener noreferrer"
        className="auth-back"
      >
        <span>←</span>
        Portfolio
      </a>

      {/* Login Container */}
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Login</h2>

          {error && <div className="auth-error">{error}</div>}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="auth-input"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              disabled={loading}
              className="auth-input"
            />

            <button type="submit" disabled={loading} className="auth-button">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="app-footer">
        Built by{" "}
        <a href="https://29rl.dev" target="_blank" rel="noopener noreferrer">
          29RL.DEV
        </a>
      </footer>
    </div>
  );
}
