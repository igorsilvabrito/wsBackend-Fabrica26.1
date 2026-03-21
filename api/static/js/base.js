const BASE_URL = "http://localhost:8000/api";

function storageGet(key) {
  try { return localStorage.getItem(key); } catch (e) { return null; }
}

function storageSet(key, value) {
  try { localStorage.setItem(key, value); } catch (e) {}
}

function storageClear() {
  try { localStorage.clear(); } catch (e) {}
}

if (!storageGet("access")) {
  window.location.href = "/";
}

const sidebarUser = document.getElementById("sidebar-user");
if (sidebarUser) sidebarUser.textContent = "@ " + storageGet("username");

async function api(path, options = {}) {
  const token = storageGet("access");
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    const refreshed = await tryRefresh();
    if (refreshed) return api(path, options);
    doLogout(); return null;
  }

  if (res.status === 204) return {};
  return res.json();
}

async function tryRefresh() {
  const refresh = storageGet("refresh");
  if (!refresh) return false;
  const res = await fetch(`${BASE_URL}/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh })
  });
  if (res.ok) {
    const data = await res.json();
    storageSet("access", data.access);
    return true;
  }
  return false;
}

function doLogout() {
  storageClear();
  window.location.href = "/";
}

function toast(msg, type = "success") {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.className = type;
  el.style.display = "block";
  setTimeout(() => el.style.display = "none", 3000);
}