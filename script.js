
// --- List Functions ---
function updateListe() {
  var tbody = document.getElementById('pieceList');
  if (!tbody) return;
  tbody.innerHTML = '';
  Object.entries(monnaies.pieces).forEach(function([name, value]) {
    var tr = document.createElement('tr');
    tr.innerHTML = '<td>' + name + '</td><td>' + value + '</td>';
    tbody.appendChild(tr);
  });
}

function updateGemmes() {
  var tbodyG = document.getElementById('gemmeList');
  if (!tbodyG) return;
  tbodyG.innerHTML = '';
  Object.entries(monnaies.gemmes).forEach(function([name, value]) {
    var tr = document.createElement('tr');
    tr.innerHTML = '<td>' + name + '</td><td>' + value + '</td>';
    tbodyG.appendChild(tr);
  });
}


// --- Inventory Functions ---
function updateInventaire(event) {
  const row = event.target.closest("tr");
  const name = row.querySelector("select").value;
  const qty = parseFloat(row.querySelector(".qte").value) || 0;
  const valPieces = monnaies.pieces[name] || 0;
  const valGemmes = monnaies.gemmes[name] || 0;
  const value = valPieces > 0 ? valPieces : valGemmes;
  row.querySelector(".valeur").textContent = value.toFixed(2);
  row.querySelector(".total").textContent = (value * qty).toFixed(2);
  let sum=0;
  document.querySelectorAll(".total").forEach(c => sum += parseFloat(c.textContent)||0);
  const totalSpan=document.getElementById("totalInventaire");
  if(totalSpan) totalSpan.textContent = sum.toFixed(2);
}

function addInventaireRow(type) {
  const tableId = type==="pieces" ? "inventaireTablePieces" : "inventaireTableGemmes";
  const table = document.getElementById(tableId);
  if(!table) return;
  const list = type==="pieces" ? monnaies.pieces : monnaies.gemmes;
  const row = table.insertRow();
  const options = Object.keys(list).map(n=>`<option value="${n}">${n}</option>`).join("");
  row.innerHTML = `
    <td><select onchange="updateInventaire(event)">${options}</select></td>
    <td><input type="number" value="0" class="qte" oninput="updateInventaire(event)"></td>
    <td class="valeur">0</td><td class="total">0</td>
  `;
}


// --- Unified Converter ---
function convertAll() {
  var name = document.getElementById('convCurrency').value;
  var qty = parseFloat(document.getElementById('convQty').value) || 0;
  var basePM = 0;
  if (monnaies.pieces[name] !== undefined) {
    basePM = monnaies.pieces[name] * qty;
  } else if (monnaies.gemmes[name] !== undefined) {
    basePM = monnaies.gemmes[name] * qty;
  } else {
    basePM = 0;
  }
  var tbody = document.getElementById('convResults');
  if (!tbody) return;  // Guard against missing table
  tbody.innerHTML = '';
  var denoms = [
    { label: 'Fer',      value: monnaies.pieces['Fer'] },
    { label: 'Argent',   value: monnaies.pieces['Argent'] },
    { label: 'Or',       value: monnaies.pieces['Or'] },
    { label: 'Électrum', value: monnaies.pieces['Électrum'] },
    { label: 'Platine',  value: monnaies.pieces['Platine'] }
  ];
  denoms.forEach(function(d) {
    var row = document.createElement('tr');
    var conv = basePM / d.value;
    row.innerHTML = '<td>' + d.label + '</td><td>' + conv.toFixed(2) + '</td>';
    tbody.appendChild(row);
  });
}

// DOMContentLoaded initialization
document.addEventListener('DOMContentLoaded', function() {
  updateListe();
  updateGemmes();
  var sel = document.getElementById('convCurrency');
  if (!sel) return;      // Only run converter on its page
  Object.keys(monnaies.pieces).concat(Object.keys(monnaies.gemmes)).forEach(function(n) {
    var o = document.createElement('option');
    o.value = n;
    o.textContent = n;
    sel.appendChild(o);
  });
  document.getElementById('convQty').addEventListener('input', convertAll);
  // Initial display
  convertAll();
});


// --- Persistence for Dorusis Inventory ---
function saveDorusis() {
  const rows = [];
  const table = document.getElementById('inventaireTablePieces');
  if (table) {
    table.querySelectorAll('tr').forEach((tr, i) => {
      const select = tr.querySelector('select');
      const qty = tr.querySelector('input.qte');
      if (select && qty) {
        rows.push({type: 'pieces', name: select.value, qty: qty.value});
      }
    });
  }
  const gemTable = document.getElementById('inventaireTableGemmes');
  if (gemTable) {
    gemTable.querySelectorAll('tr').forEach((tr) => {
      const select = tr.querySelector('select');
      const qty = tr.querySelector('input.qte');
      if (select && qty) {
        rows.push({type: 'gemmes', name: select.value, qty: qty.value});
      }
    });
  }
  localStorage.setItem('dorusisInventory', JSON.stringify(rows));
}

function loadDorusis() {
  const data = JSON.parse(localStorage.getItem('dorusisInventory') || '[]');
  if (!data.length) return;
  // Clear existing
  document.getElementById('inventaireTablePieces').innerHTML = '';
  document.getElementById('inventaireTableGemmes').innerHTML = '';
  data.forEach(item => {
    addInventaireRow(item.type);
    const table = document.getElementById(item.type === 'pieces' ? 'inventaireTablePieces' : 'inventaireTableGemmes');
    const last = table.rows[table.rows.length-1];
    last.querySelector('select').value = item.name;
    last.querySelector('input.qte').value = item.qty;
    updateInventaire({target: last.querySelector('input.qte')});
  });
}

// --- Persistence for Guild content ---
function saveGuild() {
  const content = document.getElementById('guildContent').innerHTML;
  localStorage.setItem('guildContent', content);
}

function loadGuild() {
  const content = localStorage.getItem('guildContent');
  if (content !== null) {
    document.getElementById('guildContent').innerHTML = content;
  }
}

// Hook persistence into DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  // Existing inits...
  // Load Dorusis inventory if on that page
  if (document.getElementById('inventaireTablePieces')) {
    loadDorusis();
    // Add save call on inventory changes
    document.getElementById('inventaireTablePieces').addEventListener('change', saveDorusis);
    document.getElementById('inventaireTablePieces').addEventListener('input', saveDorusis);
    document.getElementById('inventaireTableGemmes').addEventListener('change', saveDorusis);
    document.getElementById('inventaireTableGemmes').addEventListener('input', saveDorusis);
  }
  // Load Guild content if on that page
  if (document.getElementById('guildContent')) {
    loadGuild();
    document.getElementById('guildContent').addEventListener('input', saveGuild);
  }
});


// --- Dorusis : Inventaire en ligne via Google Sheets ---
async function loadDorusis() {
  const respP = await fetch(`${API_URL}?type=pieces`);
  const pieces = await respP.json();
  const respG = await fetch(`${API_URL}?type=gemmes`);
  const gemmes = await respG.json();
  // Clear tables
  document.getElementById('inventaireTablePieces').innerHTML = '';
  document.getElementById('inventaireTableGemmes').innerHTML = '';
  // Rebuild pieces
  pieces.forEach(p => {
    addInventaireRow('pieces');
    const tbl = document.getElementById('inventaireTablePieces');
    const last = tbl.rows[tbl.rows.length - 1];
    last.querySelector('select').value = p.name;
    last.querySelector('input.qte').value = p.qty;
    updateInventaire({ target: last.querySelector('input.qte') });
  });
  // Rebuild gemmes
  gemmes.forEach(g => {
    addInventaireRow('gemmes');
    const tbl = document.getElementById('inventaireTableGemmes');
    const last = tbl.rows[tbl.rows.length - 1];
    last.querySelector('select').value = g.name;
    last.querySelector('input.qte').value = g.qty;
    updateInventaire({ target: last.querySelector('input.qte') });
  });
}

async function saveDorusisRow(type, name, qty) {
  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, name, qty })
  });
}

// Attach Dorusis listeners
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('inventaireTablePieces')) {
    loadDorusis();
    ['inventaireTablePieces','inventaireTableGemmes'].forEach(id => {
      const tbl = document.getElementById(id);
      tbl.addEventListener('change', e => {
        const tr = e.target.closest('tr');
        saveDorusisRow(id.includes('Pieces') ? 'pieces' : 'gemmes',
                      tr.querySelector('select').value,
                      tr.querySelector('input.qte').value);
      });
      tbl.addEventListener('input', e => {
        const tr = e.target.closest('tr');
        saveDorusisRow(id.includes('Pieces') ? 'pieces' : 'gemmes',
                      tr.querySelector('select').value,
                      tr.querySelector('input.qte').value);
      });
    });
  }
});

// --- Guilde : contenu éditable en ligne via Google Sheets ---
async function loadGuild() {
  const resp = await fetch(`${API_URL}?type=guild`);
  const data = await resp.json();
  document.getElementById('guildContent').innerHTML = data[0]?.content || '';
}

async function saveGuild(content) {
  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type:'guild', name:'main', content })
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('guildContent')) {
    loadGuild();
    const div = document.getElementById('guildContent');
    div.addEventListener('input', () => saveGuild(div.innerHTML));
  }
});
