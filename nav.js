/* nav.js — injects navigation sidebar and mobile nav */
document.addEventListener('DOMContentLoaded', function() {
  const sidebar = `
  <div class="sidebar">
    <h2>Navigation</h2>
    <a href="index.html">Accueil</a>
    <a href="dorusis.html">Dorusis</a>
    <a href="guilde.html">Guilde</a>
    <a href="liste.html">Liste complète</a>
    <a href="convertisseur.html">Convertisseur</a>
  </div>`;
  const mobile = `
  <div class="mobile-nav">
    <a href="index.html">Accueil</a>
    <a href="dorusis.html">Dorusis</a>
    <a href="guilde.html">Guilde</a>
    <a href="liste.html">Liste</a>
    <a href="convertisseur.html">Convertisseur</a>
  </div>`;
  document.querySelectorAll('.sidebar, .mobile-nav').forEach(e=>e.remove());
  document.body.insertAdjacentHTML('afterbegin', mobile);
  const content = document.querySelector('.content');
  if(content) content.insertAdjacentHTML('beforebegin', sidebar);
});