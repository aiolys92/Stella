
// Inventory update
function updateInventaire(event) {
  const row = event.target.closest('tr');
  const select = row.querySelector('select');
  const qty = parseFloat(row.querySelector('input.qte').value) || 0;
  const name = select.value;
  const val = (monnaies.pieces[name] !== undefined) 
    ? monnaies.pieces[name] 
    : (monnaies.gemmes[name] || 0);
  row.querySelector('td.valeur').textContent = val.toFixed(2);
  row.querySelector('td.total').textContent = (val * qty).toFixed(2);
  // recalc total
  let sum=0;
  document.querySelectorAll('td.total').forEach(td => { sum += parseFloat(td.textContent)||0; });
  const totalSpan = document.getElementById('totalInventaire');
  if(totalSpan) totalSpan.textContent = sum.toFixed(2);
}

// Add inventory row with delete button
function addInventaireRow(type) {
  const table = document.getElementById('inventaireTable' + (type==='pieces'?'Pieces':'Gemmes'));
  if(!table) return;
  const list = type==='pieces'?monnaies.pieces:monnaies.gemmes;
  const row = table.insertRow(-1);
  // name
  const cell1 = row.insertCell();
  const sel = document.createElement('select');
  sel.onchange = updateInventaire;
  for(const name in list){
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    sel.appendChild(opt);
  }
  cell1.appendChild(sel);
  // qty
  const cell2 = row.insertCell();
  const inp = document.createElement('input');
  inp.type = 'number';
  inp.value = 0;
  inp.className = 'qte';
  inp.oninput = updateInventaire;
  cell2.appendChild(inp);
  // valeur
  const cell3 = row.insertCell();
  cell3.className = 'valeur';
  cell3.textContent = '0.00';
  // total
  const cell4 = row.insertCell();
  cell4.className = 'total';
  cell4.textContent = '0.00';
  // delete
  const cell5 = row.insertCell();
  const btn = document.createElement('button');
  btn.type='button';
  btn.textContent='🗑️';
  btn.onclick = function(){ removeInventaireRow(this); };
  cell5.appendChild(btn);
}

// Remove inventory row
function removeInventaireRow(btn) {
  const row = btn.closest('tr');
  row.remove();
  // recalc
  let sum=0;
  document.querySelectorAll('td.total').forEach(td => { sum += parseFloat(td.textContent)||0; });
  const totalSpan = document.getElementById('totalInventaire');
  if(totalSpan) totalSpan.textContent = sum.toFixed(2);
}

document.addEventListener('DOMContentLoaded', function(){
  // init for Dorusis and Guilde pages
  if(document.getElementById('inventaireTablePieces')){
    addInventaireRow('pieces');
    addInventaireRow('gemmes');
  }
});


// --- List complete functions ---
function updateListe() {
  const tbody = document.getElementById('pieceList');
  if (!tbody) return;
  tbody.innerHTML = '';
  Object.entries(monnaies.pieces).forEach(([name, value]) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${name}</td><td>${value}</td>`;
    tbody.appendChild(tr);
  });
}

function updateGemmes() {
  const tbody = document.getElementById('gemmeList');
  if (!tbody) return;
  tbody.innerHTML = '';
  Object.entries(monnaies.gemmes).forEach(([name, value]) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${name}</td><td>${value}</td>`;
    tbody.appendChild(tr);
  });
}

// Call for list page
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('pieceList')) {
    updateListe();
    updateGemmes();
  }
});

// --- Converter functions ---
function updateConvert(event) {
  var row = event.target.closest('tr');
  var name = row.querySelector('.convert-select').value;
  var qty = parseFloat(row.querySelector('.qte').value) || 0;
  var val = monnaies.pieces[name] || 0;
  row.querySelector('.convert-result').textContent = (val * qty).toFixed(2);
}

function addConvertRow() {
  var table = document.getElementById('convertTable');
  if (!table) return;
  var row = table.insertRow(-1);
  var opts = Object.keys(monnaies.pieces).map(function(n){
    return '<option value="'+n+'">'+n+'</option>';
  }).join('');
  row.innerHTML = '<td><select class="convert-select" onchange="updateConvert(event)">'+opts+'</select></td>'
                + '<td><input type="number" value="1" class="qte" oninput="updateConvert(event)"></td>'
                + '<td class="convert-result">0.00</td>';
  updateConvert({target: row.querySelector('.convert-select')});
}

// Hook converter init
document.addEventListener('DOMContentLoaded', function(){
  if (document.getElementById('convertTable')) {
    addConvertRow();
  }
});
