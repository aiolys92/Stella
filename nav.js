/* nav.js — injects navigation sidebar and mobile nav */

document.addEventListener('DOMContentLoaded', function() {
  const sidebarHtml = `
  <div class="sidebar">
    <h2>Navigation</h2>
    <a href="index.html">Accueil</a>
    <a href="dorusis.html">Dorusis</a>
    <a href="guilde.html">Guilde</a>
    <a href="liste.html">Liste complète</a>
    <a href="convertisseur.html">Convertisseur</a>
  </div>`;
  const mobileHtml = `
  <div class="mobile-nav">
    <a href="index.html">Accueil</a>
    <a href="dorusis.html">Dorusis</a>
    <a href="guilde.html">Guilde</a>
    <a href="liste.html">Liste</a>
    <a href="convertisseur.html">Convertisseur</a>
  </div>`;

  document.body.querySelectorAll('.sidebar, .mobile-nav').forEach(el => el.remove());
  document.body.insertAdjacentHTML('afterbegin', mobileHtml);
  const content = document.querySelector('.content');
  if (content) content.insertAdjacentHTML('beforebegin', sidebarHtml);
});
