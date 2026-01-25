import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AIChat from "../components/AIChat";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  function logout() {
    localStorage.clear();
    sessionStorage.clear();

    window.location.href = "/auth";
  }

  async function upgrade() {
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: "price_1SpaEgFJ7SufhlMYfAJZhnLj",
          email: user?.email,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create checkout session");
      }

      const data = await res.json();

      if (data.url) {
        window.history.replaceState(null, document.title, window.location.href);
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Upgrade error:", err);
      alert("Failed to start upgrade process. Please try again.");
    }
  }

  return (
    <div className="dashboard">
      {/* NAVBAR */}
      <nav className="dashboard-nav">
        <div className="nav-left">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-email">{user?.email}</p>
        </div>

        <div className="nav-right">
          <button className="btn btn-primary" onClick={upgrade}>
            Upgrade to Pro
          </button>
          <button className="btn btn-outline" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="dashboard-container">
        <div className="card">
          <AIChat />
        </div>
      </main>

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
