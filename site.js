const profils = {
  dorusis: { pieces: [], gemmes: [] },
  guilde: { pieces: [], gemmes: [] }
};
let currentProfil = null;
function choisirProfil(nom) {
  currentProfil = nom;
  document.getElementById('accueil').style.display = 'none';
  document.getElementById('contenu').style.display = 'block';
  showSection('inventaire');
  updateAll();
}
function retourAccueil() {
  currentProfil = null;
  document.getElementById('accueil').style.display = 'block';
  document.getElementById('contenu').style.display = 'none';
}
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}
function addInventaireRow(type) {
  const tableId = type === 'pieces' ? 'inventaireTablePieces' : 'inventaireTableGemmes';
  const table = document.getElementById(tableId);
  const objList = type === 'pieces' ? monnaies.pieces : monnaies.gemmes;
  const row = table.insertRow(-1);
  const options = Object.keys(objList)
    .map(n => '<option value="' + n + '">' + n + '</option>')
    .join('');
  row.innerHTML = '<td><select onchange="updateInventaire()">' + options + '</select></td>' +
    '<td><input type="number" value="0" class="qte" oninput="updateInventaire()"></td>' +
    '<td><span class="valeur">0</span></td>' +
    '<td><span class="total">0</span></td>';
}
// exposer les fonctions
window.addInventaireRow = addInventaireRow;
window.showSection = showSection;
window.choisirProfil = choisirProfil;

function updateInventaire() {
  document.querySelectorAll('table').forEach(table => {
    let totalInventaire = 0;
    table.querySelectorAll('tr').forEach((row, i) => {
      if (i === 0) return; // skip header
      const select = row.querySelector("select");
      const qte = parseFloat(row.querySelector(".qte")?.value || 0);
      const valeur = monnaies.pieces[select.value] || monnaies.gemmes[select.value] || 0;
      const total = valeur * qte;
      row.querySelector(".valeur").innerText = valeur;
      row.querySelector(".total").innerText = total;
      totalInventaire += total;
    });
    const global = document.getElementById("totalInventaire");
    if (global) global.innerText = totalInventaire.toFixed(2);
  });
}

window.updateInventaire = updateInventaire;


function addConvertRow() {
  const table = document.getElementById("convertTable");
  const row = table.insertRow(-1);
  const options = Object.entries(window.objets).map(([name, value]) => 
    `<option value="${name}">${name}</option>`).join('');
  row.innerHTML = `
    <td><select onchange="updateConvertRow(this)">${options}</select></td>
    <td class='valeur'>0</td>
    <td><input type='number' value='0' oninput='updateConvertRow(this)'></td>
    <td class='total'>0</td>
  `;
}

function updateConvertRow(elm) {
  const row = elm.closest("tr");
  const select = row.querySelector("select");
  const qte = parseFloat(row.querySelector("input").value || 0);
  const val = objets[select.value] || 0;
  row.querySelector(".valeur").innerText = val;
  row.querySelector(".total").innerText = (val * qte).toFixed(2);
}
window.addConvertRow = addConvertRow;
window.updateConvertRow = updateConvertRow;

function updateAll() {
  updateTotal();
  updateListe();
}

function updateInventaire(select) {
  const row = select.closest("tr");
  const type = row.parentElement.parentElement.id.includes("Pieces") ? "pieces" : "gemmes";
  const objName = select.value;
  const valeur = monnaies[type][objName] || 0;
  const qte = row.querySelector(".qte").value;
  row.querySelector(".valeur").textContent = valeur;
  row.querySelector(".total").textContent = (valeur * qte).toFixed(2);
  updateTotal();
}

function updateTotal() {
  let total = 0;
  document.querySelectorAll(".total").forEach(el => total += parseFloat(el.textContent || 0));
  const totalElem = document.getElementById("totalInventaire");
  if (totalElem) totalElem.textContent = total.toFixed(2);
}

function updateListe() {
  const pieceList = document.getElementById("pieceList");
  const gemmeList = document.getElementById("gemmeList");
  if (!pieceList || !gemmeList) return;

  pieceList.innerHTML = "";
  gemmeList.innerHTML = "";
  Object.entries(monnaies.pieces).forEach(([k,v]) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${k}</td><td>${v}</td>`;
    pieceList.appendChild(row);
  });
  Object.entries(monnaies.gemmes).forEach(([k,v]) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${k}</td><td>${v}</td>`;
    gemmeList.appendChild(row);
  });
}
