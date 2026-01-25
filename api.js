const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("API URL missing – check environment variables");
}

export default API_URL;

export async function login(email, password) {
  const res = await fetch(`${API_URL}/api/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error(`Login failed: ${res.statusText}`);
  }

  return res.json();
}
