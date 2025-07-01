// script.js — inventory, list, persistence
function updateInventaire(event) {
  const row = event.target.closest('tr');
  const name = row.querySelector('select').value;
  const qty = parseFloat(row.querySelector('input.qte').value) || 0;
  const val = monnaies.pieces[name] !== undefined ? monnaies.pieces[name]
            : monnaies.gemmes[name] !== undefined ? monnaies.gemmes[name] : 0;
  row.querySelector('td.valeur').textContent = val.toFixed(2);
  row.querySelector('td.total').textContent = (val * qty).toFixed(2);
  let sum = 0;
  document.querySelectorAll('td.total').forEach(td=>{sum+=parseFloat(td.textContent)||0;});
  const invTotal = document.getElementById('totalInventaire');
  if(invTotal) invTotal.textContent = sum.toFixed(2);
  const piecesTotal = document.getElementById('totalPieces');
  if(piecesTotal) piecesTotal.textContent = sum.toFixed(2);
}
function addInventaireRow(type) {
  const tbl = document.getElementById(type==='pieces'?'inventaireTablePieces':'inventaireTableGemmes');
  if(!tbl) return;
  const list = type==='pieces'?monnaies.pieces:monnaies.gemmes;
  const row = tbl.querySelector('tbody').insertRow();
  const opts = Object.keys(list).map(n=>`<option value="${n}">${n}</option>`).join('');
  row.innerHTML = `
    <td><select onchange="updateInventaire(event)">${opts}</select></td>
    <td><input class="qte" type="number" value="0" oninput="updateInventaire(event)"></td>
    <td class="valeur">0.00</td><td class="total">0.00</td>
    <td><button type="button" onclick="removeInventaireRow(this)">🗑️</button></td>`;
}
function removeInventaireRow(btn) {
  const row=btn.closest('tr'); row.remove();
  updateInventaire({target:document.querySelector('input.qte')});
}
function updateListe() {
  const pbody=document.getElementById('pieceList');
  if(pbody){pbody.innerHTML=''; Object.entries(monnaies.pieces).forEach(([n,v])=>{
    const tr=document.createElement('tr'); tr.innerHTML=`<td>${n}</td><td>${v}</td>`; pbody.appendChild(tr);
  });}
  const gbody=document.getElementById('gemmeList');
  if(gbody){gbody.innerHTML=''; Object.entries(monnaies.gemmes).forEach(([n,v])=>{
    const tr=document.createElement('tr'); tr.innerHTML=`<td>${n}</td><td>${v}</td>`; gbody.appendChild(tr);
  });}
}
async function loadFromFileInventory(e) {
  const file=e.target.files[0]; if(!file) return;
  const data=JSON.parse(await file.text());
  document.querySelectorAll('#inventaireTablePieces tbody, #inventaireTableGemmes tbody').forEach(tb=>tb.innerHTML='');
  data.forEach(item=>{addInventaireRow(item.type);
    const tbl=document.getElementById(item.type==='pieces'?'inventaireTablePieces':'inventaireTableGemmes');
    const last=tbl.querySelector('tbody').lastElementChild;
    last.querySelector('select').value=item.name;
    last.querySelector('input.qte').value=item.qty;
    updateInventaire({target:last.querySelector('input.qte')});
  });
}
function saveToFileInventory(){
  const rows=[]; document.querySelectorAll('#inventaireTablePieces tbody tr').forEach(tr=>{
    rows.push({type:'pieces',name:tr.querySelector('select').value,qty:tr.querySelector('input.qte').value});
  });
  document.querySelectorAll('#inventaireTableGemmes tbody tr').forEach(tr=>{
    rows.push({type:'gemmes',name:tr.querySelector('select').value,qty:tr.querySelector('input.qte').value});
  });
  const blob=new Blob([JSON.stringify(rows,null,2)],{type:'application/json'});
  const a=document.createElement('a');a.style.display='none';
  a.href=URL.createObjectURL(blob);a.download='inventaire.json';
  document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(a.href);
}
document.addEventListener('DOMContentLoaded',()=>{
  if(document.getElementById('inventaireTablePieces')){
    addInventaireRow('pieces');addInventaireRow('gemmes');
    const invIn=document.getElementById('fileInputInventory');
    const invBtn=document.getElementById('saveInventoryBtn');
    if(invIn)invIn.addEventListener('change',loadFromFileInventory);
    if(invBtn)invBtn.addEventListener('click',saveToFileInventory);
  }
  if(document.getElementById('pieceList'))updateListe();
});