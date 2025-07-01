
// script.js — inventory and list

// Inventory functions
function updateInventaire(event) {
  const row = event.target.closest('tr');
  const select = row.querySelector('select');
  const qty = parseFloat(row.querySelector('input.qte').value) || 0;
  const name = select.value;
  const val = monnaies.pieces[name] !== undefined ? monnaies.pieces[name] :
              monnaies.gemmes[name] !== undefined ? monnaies.gemmes[name] : 0;
  row.querySelector('td.valeur').textContent = val.toFixed(2);
  row.querySelector('td.total').textContent = (val * qty).toFixed(2);
  let sum = 0;
  document.querySelectorAll('td.total').forEach(td => sum += parseFloat(td.textContent)||0);
  const total = document.getElementById('totalInventaire');
  if (total) total.textContent = sum.toFixed(2);
  const piecesSpan = document.getElementById('totalPieces');
  if(piecesSpan) piecesSpan.textContent = sum.toFixed(2);
}

function addInventaireRow(type) {
  const table = document.getElementById(type==='pieces'?'inventaireTablePieces':'inventaireTableGemmes');
  if (!table) return;
  const list = type==='pieces'?monnaies.pieces:monnaies.gemmes;
  const row = table.insertRow();
  row.innerHTML = `
    <td><select onchange="updateInventaire(event)">${Object.keys(list).map(n=>'<option>'+n+'</option>').join('')}</select></td>
    <td><input class="qte" type="number" value="0" oninput="updateInventaire(event)"></td>
    <td class="valeur">0.00</td>
    <td class="total">0.00</td>
    <td><button type="button" onclick="removeInventaireRow(this)">🗑️</button></td>
  `;
}

// Remove row
function removeInventaireRow(btn) {
  btn.closest('tr').remove();
  updateInventaire({target: document.querySelector('input.qte')});
}

// List functions
function updateListe() {
  const pbody = document.getElementById('pieceList');
  if (pbody) {
    pbody.innerHTML = '';
    Object.entries(monnaies.pieces).forEach(([n,v]) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${n}</td><td>${v}</td>`;
      pbody.appendChild(tr);
    });
  }
  const gbody = document.getElementById('gemmeList');
  if (gbody) {
    gbody.innerHTML = '';
    Object.entries(monnaies.gemmes).forEach(([n,v]) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${n}</td><td>${v}</td>`;
      gbody.appendChild(tr);
    });
  }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('inventaireTablePieces')) {
    addInventaireRow('pieces');
    addInventaireRow('gemmes');
  }
  if (document.getElementById('pieceList')) {
    updateListe();
  }
});


// --- File-based persistence ---
async function loadFromFileInventory(event) {
  const file = event.target.files[0];
  if (!file) return;
  const json = JSON.parse(await file.text());
  // clear existing
  const tbPieces = document.querySelector('#inventaireTablePieces tbody');
  const tbGemmes = document.querySelector('#inventaireTableGemmes tbody');
  if (tbPieces) tbPieces.innerHTML = '';
  if (tbGemmes) tbGemmes.innerHTML = '';
  // populate
  json.forEach(item => {
    addInventaireRow(item.type);
    const tbl = document.getElementById(item.type==='pieces'?'inventaireTablePieces':'inventaireTableGemmes');
    const last = tbl.querySelector('tbody').lastElementChild;
    last.querySelector('select').value = item.name;
    last.querySelector('input.qte').value = item.qty;
    updateInventaire({target: last.querySelector('input.qte')});
  });
}

function saveToFileInventory() {
  const rows = [];
  document.querySelectorAll('#inventaireTablePieces tbody tr').forEach(tr => {
    rows.push({type:'pieces', name:tr.querySelector('select').value, qty:tr.querySelector('input.qte').value});
  });
  document.querySelectorAll('#inventaireTableGemmes tbody tr').forEach(tr => {
    rows.push({type:'gemmes', name:tr.querySelector('select').value, qty:tr.querySelector('input.qte').value});
  });
  const blob = new Blob([JSON.stringify(rows, null, 2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'inventaire.json';
  a.click();
}

async function loadFromFileGuild(event) {
  const file = event.target.files[0];
  if (!file) return;
  const text = await file.text();
  document.getElementById('guildContent').innerHTML = text;
}

function saveToFileGuild() {
  const content = document.getElementById('guildContent').innerHTML;
  const blob = new Blob([content], {type:'text/html'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'guilde.html';
  a.click();
}

// Attach file control listeners
document.addEventListener('DOMContentLoaded', function(){
  const invInput = document.getElementById('fileInputInventory');
  const invBtn   = document.getElementById('saveInventoryBtn');
  if(invInput) invInput.addEventListener('change', loadFromFileInventory);
  if(invBtn)   invBtn.addEventListener('click', saveToFileInventory);
  const guildInput = document.getElementById('fileInputGuild');
  const guildBtn   = document.getElementById('saveGuildBtn');
  if(guildInput) guildInput.addEventListener('change', loadFromFileGuild);
  if(guildBtn)   guildBtn.addEventListener('click', saveToFileGuild);
});
