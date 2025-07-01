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