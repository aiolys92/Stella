
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


// --- File-based Persistence ---

// Inventory file load/save
async function loadFromFileInventory(event) {
  const file = event.target.files[0];
  if (!file) return;
  const text = await file.text();
  const data = JSON.parse(text);
  // Clear and rebuild inventory
  document.getElementById('inventaireTablePieces').innerHTML = '';
  document.getElementById('inventaireTableGemmes').innerHTML = '';
  data.forEach(item => {
    addInventaireRow(item.type);
    const tbl = document.getElementById(item.type==='pieces'?'inventaireTablePieces':'inventaireTableGemmes');
    const last = tbl.rows[tbl.rows.length-1];
    last.querySelector('select').value = item.name;
    last.querySelector('input.qte').value = item.qty;
    updateInventaire({target:last.querySelector('input.qte')});
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
  const blob = new Blob([JSON.stringify(rows)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'inventaire.json';
  a.click();
}

// Guild file load/save
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

// Attach file controls
document.addEventListener('DOMContentLoaded', function() {
  const fileInputInv = document.getElementById('fileInputInventory');
  const saveInvBtn = document.getElementById('saveInventoryBtn');
  if (fileInputInv && saveInvBtn) {
    fileInputInv.addEventListener('change', loadFromFileInventory);
    saveInvBtn.addEventListener('click', saveToFileInventory);
  }
  const fileInputGuild = document.getElementById('fileInputGuild');
  const saveGuildBtn = document.getElementById('saveGuildBtn');
  if (fileInputGuild && saveGuildBtn) {
    fileInputGuild.addEventListener('change', loadFromFileGuild);
    saveGuildBtn.addEventListener('click', saveToFileGuild);
  }
});

// Remove row from inventory
function removeInventaireRow(btn) {
  const row = btn.closest('tr');
  row.remove();
  // update total
  let sum = 0;
  document.querySelectorAll('.total').forEach(c => sum += parseFloat(c.textContent) || 0);
  const totalSpan = document.getElementById('totalInventaire');
  if (totalSpan) totalSpan.textContent = sum.toFixed(2);
}
