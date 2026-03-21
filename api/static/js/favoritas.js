async function loadFavoritas() {
  const data = await api("/favoritas/");
  const el = document.getElementById("favoritas-list");
  const list = Array.isArray(data) ? data : (data?.results || []);

  if (!list.length) {
    el.innerHTML = `<div class="empty-state"><div class="empty-icon">⭐</div><div class="empty-text">nenhuma moeda favorita ainda</div></div>`;
    return;
  }

  el.innerHTML = `<table>
    <thead><tr><th>Par</th><th>Apelido</th><th>Desde</th><th></th></tr></thead>
    <tbody>${list.map(f => `
      <tr>
        <td><span class="badge badge-purple">${f.par}</span></td>
        <td>${f.apelido || "—"}</td>
        <td>${new Date(f.criado_em).toLocaleDateString("pt-BR")}</td>
        <td><button class="btn btn-danger" onclick="removerFavorita(${f.id})">Remover</button></td>
      </tr>`).join("")}
    </tbody></table>`;
}

async function adicionarFavorita() {
  const par = document.getElementById("fav-par").value.trim().toUpperCase();
  const apelido = document.getElementById("fav-apelido").value.trim();
  if (!par) return toast("Digite um par.", "error");

  const data = await api("/favoritas/", {
    method: "POST",
    body: JSON.stringify({ par, apelido })
  });

  if (data?.id) {
    toast(`${par} adicionado!`);
    document.getElementById("fav-par").value = "";
    document.getElementById("fav-apelido").value = "";
    loadFavoritas();
  } else {
    toast("Erro ao adicionar favorita.", "error");
  }
}

async function removerFavorita(id) {
  await api(`/favoritas/${id}/`, { method: "DELETE" });
  toast("Favorita removida.");
  loadFavoritas();
}

loadFavoritas();