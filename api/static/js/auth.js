const BASE_URL = "http://localhost:8000/api";

function switchTab(tab) {
  const isLogin = tab === "login";
  document.getElementById("tab-btn-login").classList.toggle("active", isLogin);
  document.getElementById("tab-btn-Registro").classList.toggle("active", !isLogin);
  document.getElementById("tab-login").style.display = isLogin ? "block" : "none";
  document.getElementById("tab-Registro").style.display = isLogin ? "none" : "block";
  hideError();
}

function showError(msg) {
  const el = document.getElementById("auth-error");
  el.textContent = msg;
  el.style.display = "block";
  el.style.background = "rgba(255,77,109,0.1)";
  el.style.borderColor = "rgba(255,77,109,0.3)";
  el.style.color = "#ff4d6d";
}

function hideError() {
  const el = document.getElementById("auth-error");
  el.style.display = "none";
}

function showSuccessMsg(msg) {
  const el = document.getElementById("auth-error");
  el.textContent = msg;
  el.style.display = "block";
  el.style.background = "rgba(0,255,157,0.1)";
  el.style.borderColor = "rgba(0,255,157,0.3)";
  el.style.color = "#00ff9d";
}

function setLoading(btnId, loading, defaultText) {
  const btn = document.getElementById(btnId);
  btn.disabled = loading;
  btn.innerHTML = loading
    ? '<span class="loading"></span> Aguarde...'
    : defaultText;
}

function storageSet(key, value) {
  try { localStorage.setItem(key, value); } catch (e) {}
}

function storageGet(key) {
  try { return localStorage.getItem(key); } catch (e) { return null; }
}

async function doLogin() {
  console.log("doLogin chamado!"); 
  hideError();
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;

  if (!username || !password) return showError("Preencha todos os campos.");

  setLoading("btn-login", true, "Entrar");

  try {
    const res = await fetch(`${BASE_URL}/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      storageSet("access", data.access);
      storageSet("refresh", data.refresh);
      storageSet("username", username);
      window.location.href = "/painel/";
    } else {
      showError("Usuário ou senha incorretos.");
    }
  } catch (err) {
    showError("Erro de conexão. Verifique se o servidor está rodando.");
  } finally {
    setLoading("btn-login", false, "Entrar");
  }
}

async function doRegistro() {
  hideError();
  const username = document.getElementById("reg-username").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value;

  if (!username || !password) return showError("Usuário e senha são obrigatórios.");
  if (password.length < 6) return showError("A senha deve ter pelo menos 6 caracteres.");

  setLoading("btn-Registro", true, "create conta");

  try {
    const res = await fetch(`${BASE_URL}/Registro/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    if (res.ok) {
      switchTab("login");
      document.getElementById("login-username").value = username;
      showSuccessMsg("Conta criada com sucesso! Faça login.");
    } else {
      const err = await res.json();
      const msg = Object.values(err).flat().join(" ");
      showError(msg);
    }
  } catch (err) {
    showError("Erro de conexão. Verifique se o servidor está rodando.");
  } finally {
    setLoading("btn-Registro", false, "create conta");
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  const loginVisible = document.getElementById("tab-login").style.display !== "none";
  loginVisible ? doLogin() : doRegistro();
});


if (storageGet("access")) {
  window.location.href = "/painel/";
}