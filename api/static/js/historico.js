async function loadHistorico() {
  const data = await api("/historico/");
  const el = document.getElementById("historico-list");
  const list = Array.isArray(data) ? data : (data?.results || []);

  if (!list.length) {
    el.innerHTML = `<div class="empty-state"><div class="empty-icon">📋</div><div class="empty-text">nenhuma consulta realizada ainda</div></div>`;
    return;
  }

  el.innerHTML = `<table>
    <thead><tr><th>Par</th><th>Compra</th><th>Venda</th><th>Variação</th><th>Data/Hora</th></tr></thead>
    <tbody>${list.map(h => {
      const v = parseFloat(h.variacao);
      return `<tr>
        <td><span class="badge badge-purple">${h.par}</span></td>
        <td>R$ ${parseFloat(h.valor_compra).toFixed(4)}</td>
        <td>R$ ${parseFloat(h.valor_venda).toFixed(4)}</td>
        <td class="${v >= 0 ? "variacao-pos" : "variacao-neg"}">${v >= 0 ? "+" : ""}${v.toFixed(2)}%</td>
        <td>${new Date(h.consultado_em).toLocaleString("pt-BR")}</td>
      </tr>`;
    }).join("")}
    </tbody></table>`;
}

loadHistorico();