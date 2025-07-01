
function updateInventaire(event) {
  const row = event.target.closest("tr");
  const select = row.querySelector("select");
  const quantite = parseFloat(row.querySelector(".qte").value) || 0;
  const nom = select.value;
  const valeur = objets[nom] || 0;
  const valeurFer = (nom in monnaies.pieces) ? (valeur / 0.96).toFixed(2) : (valeur / 0.96).toFixed(2);

  row.querySelector(".valeur").textContent = valeur.toFixed(2);
  row.querySelector(".valeurFer").textContent = valeurFer;
  row.querySelector(".total").textContent = (valeur * quantite).toFixed(2);

  // Mise à jour du total général
  let total = 0;
  document.querySelectorAll(".total").forEach(cell => {
    total += parseFloat(cell.textContent) || 0;
  });
  const totalEl = document.getElementById("totalInventaire");
  if (totalEl) totalEl.textContent = total.toFixed(2);
}



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



);
  });
  const totalSpan = document.getElementById("totalInventaire");
  if (totalSpan) totalSpan.innerText = totalPM.toFixed(2);
}
