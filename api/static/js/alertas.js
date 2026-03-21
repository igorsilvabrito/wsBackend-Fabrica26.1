async function loadAlertas() {
  const data = await api("/alertas/");
  const el = document.getElementById("alertas-list");
  const list = Array.isArray(data) ? data : (data?.results || []);

  if (!list.length) {
    el.innerHTML = `<div class="empty-state"><div class="empty-icon">🔔</div><div class="empty-text">nenhum alerta configurado</div></div>`;
    return;
  }

  el.innerHTML = `<table>
    <thead><tr><th>Par</th><th>Condição</th><th>Valor</th><th>Status</th><th></th></tr></thead>
    <tbody>${list.map(a => `
      <tr>
        <td><span class="badge badge-purple">${a.par}</span></td>
        <td>${a.tipo === "acima" ? "↑ Acima de" : "↓ Abaixo de"}</td>
        <td>R$ ${parseFloat(a.valor_referencia).toFixed(4)}</td>
        <td>${a.disparado ? '<span class="badge badge-warn">Disparado</span>' : '<span class="badge badge-green">Ativo</span>'}</td>
        <td><button class="btn btn-danger" onclick="removerAlerta(${a.id})">Remover</button></td>
      </tr>`).join("")}
    </tbody></table>`;
}

async function criarAlerta() {
  const par = document.getElementById("alerta-par").value.trim().toUpperCase();
  const tipo = document.getElementById("alerta-tipo").value;
  const valor_referencia = document.getElementById("alerta-valor").value;
  if (!par || !valor_referencia) return toast("Preencha todos os campos.", "error");

  const data = await api("/alertas/", {
    method: "POST",
    body: JSON.stringify({ par, tipo, valor_referencia })
  });

  if (data?.id) {
    toast("Alerta criado!");
    document.getElementById("alerta-par").value = "";
    document.getElementById("alerta-valor").value = "";
    loadAlertas();
  } else {
    toast("Erro ao criar alerta.", "error");
  }
}

async function removerAlerta(id) {
  await api(`/alertas/${id}/`, { method: "DELETE" });
  toast("Alerta removido.");
  loadAlertas();
}

loadAlertas();