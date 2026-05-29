const BASE = "http://localhost:3000";

export async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error("Network error");
  return res.json();
}

export async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.erro || "Network error");
  }
  return res.json();
}

export default { get, post };
