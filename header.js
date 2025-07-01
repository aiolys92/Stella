document.addEventListener("DOMContentLoaded", () => {
  const pageTitle = document.title;
  const header = document.createElement("header");
  header.innerHTML = `
    <div class="nav">
      <a href="index.html">🏠 Retour à l'accueil</a>
    </div>
    <h1>${pageTitle}</h1>
  `;
  document.body.insertBefore(header, document.body.firstChild);
});