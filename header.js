document.addEventListener("DOMContentLoaded", () => {
  const pageTitle = document.title;
  const header = document.createElement("header");
  header.innerHTML = `
    <div class="nav" style="background:#eee; padding:10px;">
      <strong>${pageTitle}</strong>
      <nav style="margin-top:10px;">
        <a href="index.html">🏠 Accueil</a> |
        <a href="dorusis.html">Dorusis</a> |
        <a href="guilde.html">Guilde</a> |
        <a href="convertisseur.html">Convertisseur</a> |
        <a href="liste.html">Liste</a> |
        <a href="taux.html">Taux</a>
      </nav>
    </div>
  `;
  document.body.insertBefore(header, document.body.firstChild);
});