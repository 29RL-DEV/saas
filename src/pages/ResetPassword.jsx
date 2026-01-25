import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        setError("Invalid or expired reset link. Please request a new one.");
        setIsLoading(false);
        return;
      }

      if (!session) {
        setError("No active session. Please use the link from your email.");
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
    } catch (err) {
      setError("Invalid reset link. Please request a new one.");
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      await supabase.auth.signOut();

      setSuccess("✅ Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/auth");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <h2 className="auth-title">Verifying link...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <a
        href="https://29rl.dev"
        target="_blank"
        rel="noopener noreferrer"
        className="auth-back"
      >
        ← Portfolio
      </a>

      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Reset Password</h2>

          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          {!error && (
            <form onSubmit={handleSubmit}>
              <input
                className="auth-input"
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                minLength="8"
              />

              <input
                className="auth-input"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                minLength="8"
              />

              <button className="auth-button" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>

      <footer className="app-footer">
        Built by{" "}
        <a href="https://29rl.dev" target="_blank" rel="noopener noreferrer">
          29RL.DEV
        </a>
      </footer>
    </div>
  );
}
