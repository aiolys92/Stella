
function addInventaireRow(type) {
  const tableId = type === 'pieces' ? 'inventaireTablePieces' : 'inventaireTableGemmes';
  const table = document.getElementById(tableId);
  const objList = type === 'pieces' ? monnaies.pieces : monnaies.gemmes;
  const row = table.insertRow(-1);
  const options = Object.keys(objList)
    .map(n => `<option value="${n}">${n}</option>`)
    .join('');
  row.innerHTML = `
    <td><select onchange="updateInventaire(event)">${options}</select></td>
    <td><input type='number' value='0' class='qte' oninput='updateInventaire(event)'></td>
    <td class='valeur'>0</td>
    <td class='total'>0</td>
  `;
}



function updateInventaire(evt) {
  let totalPM = 0;
  ['inventaireTablePieces', 'inventaireTableGemmes'].forEach(id => {
    const table = document.getElementById(id);
    Array.from(table.rows).forEach((row, index) => {
      if (index === 0) return; // skip header
      const select = row.querySelector("select");
      const input = row.querySelector("input.qte");
      if (!select || !input) return;
      const valeur = monnaies.pieces[select.value] ?? monnaies.gemmes[select.value] ?? 0;
      const quantite = parseFloat(input.value || 0);
      const total = valeur * quantite;
      row.querySelector(".valeur").innerText = valeur.toFixed(2);
      row.querySelector(".total").innerText = total.toFixed(2);
      totalPM += total;
    });
  });
  const totalSpan = document.getElementById("totalInventaire");
  if (totalSpan) totalSpan.innerText = totalPM.toFixed(2);
}
