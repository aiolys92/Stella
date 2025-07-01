
// convert.js — only for convertisseur.html
document.addEventListener('DOMContentLoaded', () => {
  const sel = document.getElementById('convCurrency');
  const qty = document.getElementById('convQty');
  const tbody = document.getElementById('convResults');
  // populate
  Object.keys(monnaies.pieces).concat(Object.keys(monnaies.gemmes)).forEach(n => {
    const o = document.createElement('option');
    o.value = o.textContent = n;
    sel.appendChild(o);
  });
  function convertAll(){
    const name = sel.value;
    const q = parseFloat(qty.value)||0;
    let base=0;
    if(monnaies.pieces[name]!=null) base = monnaies.pieces[name]*q;
    if(monnaies.gemmes[name]!=null) base = monnaies.gemmes[name]*q;
    tbody.innerHTML='';
    ['Fer','Argent','Or','Électrum','Platine'].forEach(d => {
      const val = monnaies.pieces[d]||1;
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${d}</td><td>${(base/val).toFixed(2)}</td>`;
      tbody.appendChild(tr);
    });
  }
  sel.onchange = qty.oninput = convertAll;
  convertAll();
});
