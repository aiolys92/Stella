const profils = {
  dorusis: { pieces: [], gemmes: [] },
  guilde: { pieces: [], gemmes: [] }
};

let currentProfil = null;

function choisirProfil(nom) {
  currentProfil = nom;
  document.getElementById("accueil").style.display = "none";
  document.getElementById("contenu").style.display = "block";
  showSection('inventaire');
  updateAll();
}

function retourAccueil() {
  currentProfil = null;
  document.getElementById("accueil").style.display = "block";
  document.getElementById("contenu").style.display = "none";
}

function showSection(id) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function addInventaireRow(type) {
  const tableId = type === 'pieces' ? 'inventaireTablePieces' : 'inventaireTableGemmes';
  const table = document.getElementById(tableId);
  const objList = type === 'pieces' ? monnaies.pieces : monnaies.gemmes;
  const row = table.insertRow(-1);
  const options = Object.keys(objList)
    .map(n => `<option value="${n}">${n}</option>`)
    .join('');
  row.innerHTML = \`
    <td><select onchange="updateInventaire()">${options}</select></td>
    <td><input type='number' value='0' class='qte' oninput='updateInventaire()'></td>
    <td><span class='valeur'>0</span></td>
    <td><span class='total'>0</span></td>
  \`;
}

function updateInventaire() {
  let total = 0;

  ['pieces', 'gemmes'].forEach(type => {
    const tableId = type === 'pieces' ? 'inventaireTablePieces' : 'inventaireTableGemmes';
    const table = document.getElementById(tableId);
    for (let i = 1; i < table.rows.length; i++) {
      const row = table.rows[i];
      const obj = row.cells[0].querySelector('select').value;
      const qte = parseInt(row.cells[1].querySelector('input').value || '0');
      const valeur = monnaies[type][obj] || 0;
      const totalPM = valeur * qte;

      row.cells[2].querySelector('span').textContent = valeur;
      row.cells[3].querySelector('span').textContent = totalPM;

      total += totalPM;
    }
  });

  document.getElementById("totalInventaire").textContent = total.toFixed(2);
}

function addConvertRow() {
  const table = document.getElementById("convertTable");
  const row = table.insertRow(-1);
  const allObj = { ...monnaies.pieces, ...monnaies.gemmes };
  const options = Object.keys(allObj)
    .map(n => `<option value="${n}">${n}</option>`)
    .join('');
  row.innerHTML = \`
    <td><select onchange="updateConvert()">${options}</select></td>
    <td><span class='valeur'>0</span></td>
    <td><input type='number' value='0' class='qte' oninput='updateConvert()'></td>
    <td><span class='result'>0</span></td>
  \`;
}

function updateConvert() {
  const table = document.getElementById("convertTable");
  for (let i = 1; i < table.rows.length; i++) {
    const row = table.rows[i];
    const obj = row.cells[0].querySelector('select').value;
    const qte = parseInt(row.cells[2].querySelector('input').value || '0');
    const val = monnaies.pieces[obj] || monnaies.gemmes[obj] || 0;
    row.cells[1].querySelector('span').textContent = val;
    row.cells[3].querySelector('span').textContent = (val * qte).toFixed(2);
  }
}

function updateTaux() {
  const from = document.getElementById("fromSelect").value;
  const to = document.getElementById("toSelect").value;
  const vFrom = monnaies.pieces[from] || monnaies.gemmes[from] || 0;
  const vTo = monnaies.pieces[to] || monnaies.gemmes[to] || 1;
  const rate = vTo !== 0 ? vFrom / vTo : 0;
  document.getElementById("conversionRate").textContent = rate.toFixed(4);
  document.getElementById("conversionValue").textContent = vFrom.toFixed(2);
}

function updateAll() {
  const from = document.getElementById("fromSelect");
  const to = document.getElementById("toSelect");
  const all = Object.keys({ ...monnaies.pieces, ...monnaies.gemmes });

  from.innerHTML = all.map(o => \`<option value="\${o}">\${o}</option>\`).join('');
  to.innerHTML = from.innerHTML;

  const pieceList = document.getElementById("pieceList");
  pieceList.innerHTML = Object.entries(monnaies.pieces)
    .map(([k, v]) => \`<tr><td>\${k}</td><td>\${v !== null ? v : '-'}</td></tr>\`).join('');

  const gemmeList = document.getElementById("gemmeList");
  gemmeList.innerHTML = Object.entries(monnaies.gemmes)
    .map(([k, v]) => \`<tr><td>\${k}</td><td>\${v}</td></tr>\`).join('');

  updateTaux();
  updateInventaire();
  updateConvert();
}

document.addEventListener("DOMContentLoaded", updateAll);

window.addInventaireRow = addInventaireRow;
window.addConvertRow = addConvertRow;
