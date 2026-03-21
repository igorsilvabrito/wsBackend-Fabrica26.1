let currentPar = "";

function setParAndSearch(par) {
  document.getElementById("cotacao-par").value = par;
  buscarCotacao();
}

async function buscarCotacao() {
  const par = document.getElementById("cotacao-par").value.trim().toUpperCase();
  if (!par) return toast("Digite um par de moedas.", "error");

  const btn = document.querySelector(".cotacao-form .btn");
  btn.innerHTML = '<span class="loading"></span> Buscando';
  btn.disabled = true;

  const data = await api(`/cotacao/${par}/`);
  btn.innerHTML = "Consultar";
  btn.disabled = false;

  if (!data || data.erro) return toast(data?.erro || "Par não encontrado.", "error");

  currentPar = par;
  document.getElementById("cotacao-result").style.display = "block";
  document.getElementById("res-par").textContent = data.par;
  document.getElementById("res-valor").textContent = `R$ ${parseFloat(data.valor_compra).toFixed(4)}`;
  document.getElementById("res-venda").textContent = `R$ ${parseFloat(data.valor_venda).toFixed(4)}`;

  const v = parseFloat(data.variacao);
  const varEl = document.getElementById("res-variacao");
  varEl.textContent = `VAR: ${v > 0 ? "+" : ""}${v.toFixed(2)}%`;
  varEl.className = v >= 0 ? "variacao-pos" : "variacao-neg";

  document.getElementById("res-hora").textContent = new Date().toLocaleTimeString("pt-BR");
}

async function adicionarFavoritaRapido() {
  if (!currentPar) return;
  const data = await api("/favoritas/", {
    method: "POST",
    body: JSON.stringify({ par: currentPar, apelido: "" })
  });
  if (data?.id) toast(`${currentPar} adicionado às favoritas!`);
  else toast("Erro ao favoritar.", "error");
}

document.getElementById("cotacao-par").addEventListener("keydown", (e) => {
  if (e.key === "Enter") buscarCotacao();
});