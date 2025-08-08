// ===== SCRIPT DE GESTION DES POIDS =====

/**
 * Gestionnaire pour la page des poids avec inventaires multiples
 */

// ===== CONSTANTES =====
const POIDS_CONFIG = {
  tabs: ['dorusis', 'guilde', 'cheval'],
  defaultTab: 'dorusis',
  unite: 'kg'
};

// ===== VARIABLES GLOBALES =====
let currentTab = POIDS_CONFIG.defaultTab;

// ===== GESTION DES ONGLETS =====
/**
 * Change d'onglet actif
 * @param {string} tabName - Nom de l'onglet à activer
 */
function switchTab(tabName) {
  // Désactiver tous les onglets
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });

  // Activer l'onglet sélectionné
  const tabButton = document.querySelector(`[onclick="switchTab('${tabName}')"]`);
  const tabContent = document.getElementById(`tab-${tabName}`);
  
  if (tabButton && tabContent) {
    tabButton.classList.add('active');
    tabContent.classList.add('active');
    currentTab = tabName;
    
    // Recalculer le total pour cet onglet
    updateTotalPoids();
  }
}

// ===== GESTION DES OBJETS PERSONNALISÉS =====
/**
 * Ajoute un nouvel objet personnalisé
 */
function ajouterNouvelObjet() {
  const categorieSelect = document.getElementById('newObjectCategory');
  const nomInput = document.getElementById('newObjectName');
  const poidsInput = document.getElementById('newObjectWeight');
  
  const categorie = categorieSelect.value;
  const nom = nomInput.value.trim();
  const poids = parseFloat(poidsInput.value);
  
  if (!categorie) {
    alert('Veuillez sélectionner une catégorie');
    categorieSelect.focus();
    return;
  }
  
  if (!nom) {
    alert('Veuillez saisir un nom d\'objet');
    nomInput.focus();
    return;
  }
  
  if (isNaN(poids) || poids < 0) {
    alert('Veuillez saisir un poids valide (≥ 0)');
    poidsInput.focus();
    return;
  }
  
  // Vérifier si l'objet existe déjà
  const poidsActuel = window.getPoidsObjet(nom);
  if (poidsActuel > 0) {
    const confirmer = confirm(`L'objet "${nom}" existe déjà avec un poids de ${poidsActuel} kg. Voulez-vous le remplacer ?`);
    if (!confirmer) return;
  }
  
  // Ajouter l'objet
  window.ajouterObjetPoids(nom, poids, categorie);
  
  // Rafraîchir l'interface
  updateObjectsList();
  populateSelects();
  
  // Vider le formulaire
  nomInput.value = '';
  poidsInput.value = '';
  nomInput.focus();
  
  // Message de confirmation
  showNotification(`Objet "${nom}" ajouté avec succès dans ${categorie} (${poids} kg)`);
}

/**
 * Supprime un objet personnalisé
 * @param {string} nom - Nom de l'objet à supprimer
 */
function supprimerObjet(nom) {
  const confirmer = confirm(`Êtes-vous sûr de vouloir supprimer "${nom}" ?`);
  if (!confirmer) return;
  
  if (window.supprimerObjetPoids(nom)) {
    updateObjectsList();
    showNotification(`Objet "${nom}" supprimé`);
  } else {
    alert('Impossible de supprimer cet objet');
  }
}

/**
 * Modifie le poids d'un objet
 * @param {string} nom - Nom de l'objet
 * @param {number} nouveauPoids - Nouveau poids
 */
function modifierPoids(nom, nouveauPoids) {
  if (window.modifierObjetPoids(nom, nouveauPoids)) {
    updateObjectsList();
    showNotification(`Poids de "${nom}" modifié: ${nouveauPoids} kg`);
  }
}

// ===== GESTION DES INVENTAIRES =====
/**
 * Ajoute une ligne à l'inventaire
 * @param {string} inventaire - Nom de l'inventaire (dorusis, guilde, cheval)
 */
function addInventaireRowPoids(inventaire) {
  const tableId = `inventaireTable${inventaire.charAt(0).toUpperCase() + inventaire.slice(1)}`;
  const table = document.getElementById(tableId);
  
  if (!table) {
    console.error('Table non trouvée:', tableId);
    return;
  }
  
  const tbody = table.querySelector('tbody');
  const row = tbody.insertRow();
  
  // Créer les options pour les catégories
  const categoriesOptions = window.getCategoriesPoids()
    .map(cat => `<option value="${cat}">${cat}</option>`)
    .join('');
  
  row.innerHTML = `
    <td>
      <select onchange="updateObjetOptions(this)" class="category-select">
        <option value="">Choisir une catégorie</option>
        ${categoriesOptions}
      </select>
    </td>
    <td>
      <select onchange="updateInventairePoids(this)" class="object-select" disabled>
        <option value="">Choisir un objet</option>
      </select>
    </td>
    <td>
      <input type="number" value="1" min="0" step="0.1" 
             oninput="updateInventairePoids(this)" 
             class="quantity-input">
    </td>
    <td class="unit-weight">0</td>
    <td class="carried-weight-cell">
      <input type="checkbox" class="carried-checkbox" onchange="updateInventairePoids(this)">
      <span class="carried-weight">0</span>
    </td>
    <td class="total-weight">0</td>
    <td>
      <button onclick="removeInventaireRowPoids(this)" class="btn-delete" title="Supprimer">
        🗑️
      </button>
      <button onclick="duplicateRowPoids(this)" class="btn-duplicate" title="Dupliquer">
        📄
      </button>
    </td>
  `;
}

/**
 * Met à jour les options d'objets quand une catégorie est sélectionnée
 * @param {HTMLSelectElement} categorySelect - Select de catégorie
 */
function updateObjetOptions(categorySelect) {
  const row = categorySelect.closest('tr');
  const objectSelect = row.querySelector('.object-select');
  const categorie = categorySelect.value;
  
  objectSelect.innerHTML = '<option value="">Choisir un objet</option>';
  
  if (!categorie) {
    objectSelect.disabled = true;
    return;
  }
  
  const objets = window.getObjetsByCategorie(categorie);
  const options = Object.keys(objets)
    .sort()
    .map(nom => `<option value="${nom}">${nom}</option>`)
    .join('');
  
  objectSelect.innerHTML = `<option value="">Choisir un objet</option>${options}`;
  objectSelect.disabled = false;
  
  // Déclencher la mise à jour
  updateInventairePoids(categorySelect);
}

/**
 * Met à jour les calculs d'une ligne d'inventaire
 * @param {HTMLElement} element - Élément déclencheur
 */
function updateInventairePoids(element) {
  const row = element.closest('tr');
  const categorySelect = row.querySelector('.category-select');
  const objectSelect = row.querySelector('.object-select');
  const quantityInput = row.querySelector('.quantity-input');
  const unitWeightCell = row.querySelector('.unit-weight');
  const carriedCheckbox = row.querySelector('.carried-checkbox');
  const carriedWeightSpan = row.querySelector('.carried-weight');
  const totalWeightCell = row.querySelector('.total-weight');
  
  const objectName = objectSelect.value;
  const quantity = parseFloat(quantityInput.value) || 0;
  const unitWeight = objectName ? window.getPoidsObjet(objectName) : 0;
  const isCarried = carriedCheckbox.checked;
  
  // Poids unitaire
  unitWeightCell.textContent = unitWeight.toFixed(1);
  
  // Poids porté (divisé par 2 si coché)
  const carriedWeight = isCarried ? unitWeight / 2 : unitWeight;
  carriedWeightSpan.textContent = carriedWeight.toFixed(1);
  
  // Poids total = quantité × poids porté
  const totalWeight = carriedWeight * quantity;
  totalWeightCell.textContent = totalWeight.toFixed(1);
  
  // Mettre à jour le total général
  updateTotalPoids();
} (dorusis, guilde, cheval)
 */
function addInventaireRowPoids(inventaire) {
  const tableId = `inventaireTable${inventaire.charAt(0).toUpperCase() + inventaire.slice(1)}`;
  const table = document.getElementById(tableId);
  
  if (!table) {
    console.error('Table non trouvée:', tableId);
    return;
  }
  
  const tbody = table.querySelector('tbody');
  const row = tbody.insertRow();
  
  // Créer les options pour le select
  const options = Object.keys(window.monnaies.poids)
    .sort()
    .map(nom => `<option value="${nom}">${nom}</option>`)
    .join('');
  
  row.innerHTML = `
    <td>
      <select onchange="updateInventairePoids(this)" class="object-select">
        ${options}
      </select>
    </td>
    <td>
      <input type="number" value="1" min="0" step="0.1" 
             oninput="updateInventairePoids(this)" 
             class="quantity-input">
    </td>
    <td class="unit-weight">0</td>
    <td class="total-weight">0</td>
    <td>
      <button onclick="removeInventaireRowPoids(this)" class="btn-delete">
        🗑️
      </button>
      <button onclick="duplicateRowPoids(this)" class="btn-duplicate" title="Dupliquer">
        📄
      </button>
    </td>
  `;
  
  // Déclencher la mise à jour initiale
  updateInventairePoids(row.querySelector('select'));
}

/**
 * Met à jour les calculs d'une ligne d'inventaire
 * @param {HTMLElement} element - Élément déclencheur
 */
function updateInventairePoids(element) {
  const row = element.closest('tr');
  const select = row.querySelector('.object-select');
  const quantityInput = row.querySelector('.quantity-input');
  const unitWeightCell = row.querySelector('.unit-weight');
  const totalWeightCell = row.querySelector('.total-weight');
  
  const objectName = select.value;
  const quantity = parseFloat(quantityInput.value) || 0;
  const unitWeight = window.monnaies.poids[objectName] || 0;
  const totalWeight = unitWeight * quantity;
  
  unitWeightCell.textContent = unitWeight.toFixed(1);
  totalWeightCell.textContent = totalWeight.toFixed(1);
  
  // Mettre à jour le total général
  updateTotalPoids();
}

/**
 * Supprime une ligne d'inventaire
 * @param {HTMLElement} button - Bouton de suppression
 */
function removeInventaireRowPoids(button) {
  const row = button.closest('tr');
  row.remove();
  updateTotalPoids();
}

/**
 * Duplique une ligne d'inventaire
 * @param {HTMLElement} button - Bouton de duplication
 */
function duplicateRowPoids(button) {
  const row = button.closest('tr');
  const table = row.closest('table');
  const tbody = table.querySelector('tbody');
  
  // Créer une nouvelle ligne
  const newRow = tbody.insertRow(row.rowIndex);
  newRow.innerHTML = row.innerHTML;
  
  // Mettre à jour les événements
  const select = newRow.querySelector('.object-select');
  const quantityInput = newRow.querySelector('.quantity-input');
  
  updateInventairePoids(select);
}

/**
 * Met à jour le total des poids pour l'onglet actuel
 */
function updateTotalPoids() {
  const currentTable = document.querySelector(`#tab-${currentTab} .inventory-table`);
  if (!currentTable) return;
  
  const totalCells = currentTable.querySelectorAll('.total-weight');
  let total = 0;
  
  totalCells.forEach(cell => {
    total += parseFloat(cell.textContent) || 0;
  });
  
  const totalElement = document.getElementById('totalPoids');
  if (totalElement) {
    totalElement.textContent = total.toFixed(1);
  }
}

// ===== GESTION DE LA LISTE DES OBJETS =====
/**
 * Met à jour l'affichage de la liste des objets
 */
function updateObjectsList() {
  const container = document.getElementById('objectsList');
  if (!container) return;
  
  container.innerHTML = '';
  
  // Trier les objets par nom
  const sortedObjects = Object.entries(window.monnaies.poids)
    .sort(([a], [b]) => a.localeCompare(b));
  
  sortedObjects.forEach(([nom, poids]) => {
    const objectCard = document.createElement('div');
    objectCard.className = 'object-card';
    objectCard.innerHTML = `
      <div class="object-info">
        <strong class="object-name">${nom}</strong>
        <span class="object-weight">${poids} kg</span>
      </div>
      <div class="object-actions">
        <input type="number" value="${poids}" step="0.1" min="0" 
               onchange="modifierPoids('${nom}', this.value)" 
               class="weight-input">
        <button onclick="supprimerObjet('${nom}')" class="btn-delete-small">🗑️</button>
      </div>
    `;
    
    container.appendChild(objectCard);
  });
}

// ===== IMPORT/EXPORT =====
/**
 * Exporte la liste des objets
 */
function exporterObjets() {
  const data = {
    objets: window.monnaies.poids,
    exportDate: new Date().toISOString(),
    version: "1.0"
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  
  a.href = url;
  a.download = `objets-poids-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  
  URL.revokeObjectURL(url);
  showNotification('Liste des objets exportée');
}

/**
 * Importe une liste d'objets
 * @param {Event} event - Événement de changement de fichier
 */
async function importerObjets(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    
    if (!data.objets || typeof data.objets !== 'object') {
      throw new Error('Format de fichier invalide');
    }
    
    // Fusionner les objets importés
    Object.assign(window.monnaies.poids, data.objets);
    window.objets = {
      ...window.monnaies.pieces,
      ...window.monnaies.gemmes,
      ...window.monnaies.poids
    };
    
    updateObjectsList();
    showNotification(`${Object.keys(data.objets).length} objets importés`);
    
  } catch (error) {
    console.error('Erreur import:', error);
    alert('Erreur lors de l\'importation du fichier');
  }
  
  // Réinitialiser l'input
  event.target.value = '';
}

// ===== SAUVEGARDE/CHARGEMENT INVENTAIRES =====
/**
 * Sauvegarde tous les inventaires
 */
function saveInventairesPoids() {
  const inventaires = {};
  
  POIDS_CONFIG.tabs.forEach(tab => {
    const table = document.querySelector(`#inventaireTable${tab.charAt(0).toUpperCase() + tab.slice(1)}`);
    if (!table) return;
    
    const rows = [];
    table.querySelectorAll('tbody tr').forEach(row => {
      const select = row.querySelector('.object-select');
      const quantityInput = row.querySelector('.quantity-input');
      
      if (select && quantityInput && quantityInput.value && parseFloat(quantityInput.value) > 0) {
        rows.push({
          objet: select.value,
          quantite: parseFloat(quantityInput.value)
        });
      }
    });
    
    inventaires[tab] = rows;
  });
  
  const data = {
    inventaires: inventaires,
    objets: window.monnaies.poids,
    saveDate: new Date().toISOString(),
    version: "1.0"
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  
  a.href = url;
  a.download = `inventaires-poids-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  
  URL.revokeObjectURL(url);
  showNotification('Inventaires sauvegardés');
}

/**
 * Charge les inventaires depuis un fichier
 * @param {Event} event - Événement de changement de fichier
 */
async function loadInventairesPoids(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    
    // Charger les objets si présents
    if (data.objets) {
      Object.assign(window.monnaies.poids, data.objets);
      window.objets = {
        ...window.monnaies.pieces,
        ...window.monnaies.gemmes,
        ...window.monnaies.poids
      };
      updateObjectsList();
    }
    
    // Charger les inventaires
    if (data.inventaires) {
      POIDS_CONFIG.tabs.forEach(tab => {
        const inventaire = data.inventaires[tab];
        if (!inventaire) return;
        
        // Vider la table existante
        const table = document.querySelector(`#inventaireTable${tab.charAt(0).toUpperCase() + tab.slice(1)}`);
        if (!table) return;
        
        const tbody = table.querySelector('tbody');
        tbody.innerHTML = '';
        
        // Charger chaque objet
        inventaire.forEach(item => {
          addInventaireRowPoids(tab);
          
          const lastRow = tbody.lastElementChild;
          if (lastRow) {
            const select = lastRow.querySelector('.object-select');
            const quantityInput = lastRow.querySelector('.quantity-input');
            
            if (select && quantityInput) {
              select.value = item.objet;
              quantityInput.value = item.quantite;
              updateInventairePoids(select);
            }
          }
        });
      });
    }
    
    showNotification('Inventaires chargés avec succès');
    
  } catch (error) {
    console.error('Erreur chargement:', error);
    alert('Erreur lors du chargement du fichier');
  }
  
  // Réinitialiser l'input
  event.target.value = '';
}

// ===== UTILITAIRES =====
/**
 * Affiche une notification temporaire
 * @param {string} message - Message à afficher
 */
function showNotification(message) {
  // Créer la notification
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 12px 20px;
    border-radius: 4px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  // Supprimer après 3 secondes
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

/**
 * Recherche dans les objets
 * @param {string} terme - Terme de recherche
 */
function rechercherObjets(terme) {
  const cards = document.querySelectorAll('.object-card');
  
  cards.forEach(card => {
    const nom = card.querySelector('.object-name').textContent.toLowerCase();
    const match = nom.includes(terme.toLowerCase());
    card.style.display = match ? 'block' : 'none';
  });
}

// ===== CSS SUPPLÉMENTAIRE =====
const addPoidsStyles = () => {
  if (document.getElementById('poids-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'poids-styles';
  style.textContent = `
    /* Styles pour les onglets - AMÉLIORÉS */
    .tabs-container {
      margin: 20px 0;
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      overflow: hidden;
    }
    
    .tabs-header {
      display: flex;
      background: #f8f9fa;
      border-bottom: 2px solid var(--border-color);
      margin: 0;
    }
    
    .tab-button {
      flex: 1;
      padding: 15px 20px;
      border: none;
      background: transparent;
      cursor: pointer;
      border-bottom: 3px solid transparent;
      transition: all 0.3s ease;
      font-weight: 500;
      color: #666;
    }
    
    .tab-button:hover {
      background: #e9ecef;
      color: var(--primary-bg);
    }
    
    .tab-button.active {
      background: var(--primary-bg);
      color: white;
      border-bottom-color: var(--primary-bg);
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
    }
    
    /* IMPORTANT: Gérer l'affichage des contenus d'onglets */
    .tab-content {
      display: none;
      padding: 20px;
      background: white;
      min-height: 400px;
      animation: fadeInTab 0.3s ease;
    }
    
    .tab-content.active {
      display: block;
    }
    
    .tab-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #eee;
    }
    
    .tab-header h2 {
      margin: 0;
      color: var(--primary-bg);
    }
    
    /* Animation pour les changements d'onglets */
    @keyframes fadeInTab {
      from { 
        opacity: 0; 
        transform: translateY(10px); 
      }
      to { 
        opacity: 1; 
        transform: translateY(0); 
      }
    }
    
    /* Styles pour le formulaire d'ajout */
    .custom-objects-section {
      background: #f8f9fa;
      padding: 20px;
      border-radius: var(--border-radius);
      margin: 20px 0;
    }
    
    .add-object-form {
      display: grid;
      grid-template-columns: 1fr 1fr auto;
      gap: 15px;
      align-items: end;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
    }
    
    .form-group label {
      margin-bottom: 5px;
      font-weight: bold;
    }
    
    /* Total du poids */
    .total-display {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px;
      border-radius: var(--border-radius);
      text-align: center;
      margin: 20px 0;
    }
    
    .total-weight .value {
      font-size: 1.5em;
      font-weight: bold;
    }
    
    /* Cartes d'objets */
    .objects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 15px;
      margin-top: 15px;
    }
    
    .object-card {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      padding: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: var(--shadow);
      transition: var(--transition);
    }
    
    .object-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    .object-info {
      flex: 1;
    }
    
    .object-name {
      display: block;
      color: var(--primary-bg);
      margin-bottom: 5px;
    }
    
    .object-weight {
      color: #666;
      font-size: 0.9em;
    }
    
    .object-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .weight-input {
      width: 80px;
      padding: 5px;
      text-align: center;
    }
    
    /* Boutons spécialisés */
    .btn-add-object, .btn-add-row {
      background: #28a745;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 4px;
      cursor: pointer;
      transition: var(--transition);
    }
    
    .btn-add-object:hover, .btn-add-row:hover {
      background: #218838;
    }
    
    .btn-delete, .btn-delete-small {
      background: #dc3545;
      color: white;
      border: none;
      padding: 5px 8px;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .btn-duplicate {
      background: #007bff;
      color: white;
      border: none;
      padding: 5px 8px;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .btn-export {
      background: #6f42c1;
      color: white;
    }
    
    /* Tables d'inventaire */
    .inventory-table {
      margin-top: 10px;
    }
    
    .quantity-input, .object-select {
      width: 100%;
      padding: 5px;
      border: 1px solid var(--border-color);
      border-radius: 4px;
    }
    
    /* Animations */
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .add-object-form {
        grid-template-columns: 1fr;
      }
      
      .tabs-header {
        flex-wrap: wrap;
        gap: 5px;
      }
      
      .tab-button {
        flex: 1;
        min-width: 120px;
      }
      
      .objects-grid {
        grid-template-columns: 1fr;
      }
      
      .object-card {
        flex-direction: column;
        align-items: stretch;
        gap: 10px;
      }
      
      .object-actions {
        justify-content: space-between;
      }
    }
  `;
  
  document.head.appendChild(style);
};

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', function() {
  // Vérifier qu'on est sur la bonne page
  if (!document.querySelector('.tabs-container')) return;
  
  addPoidsStyles();
  
  // Initialiser les onglets
  switchTab(POIDS_CONFIG.defaultTab);
  
  // Ajouter une ligne initiale à chaque onglet
  POIDS_CONFIG.tabs.forEach(tab => {
    addInventaireRowPoids(tab);
  });
  
  // Mettre à jour la liste des objets
  updateObjectsList();
  
  // Configurer les événements de fichier
  const fileInput = document.getElementById('fileInputInventory');
  const saveBtn = document.getElementById('saveInventoryBtn');
  
  if (fileInput) {
    fileInput.addEventListener('change', loadInventairesPoids);
  }
  
  if (saveBtn) {
    saveBtn.addEventListener('click', saveInventairesPoids);
  }
  
  console.log('Page des poids initialisée');
});

// ===== EXPOSITION DES FONCTIONS GLOBALES =====
window.switchTab = switchTab;
window.ajouterNouvelObjet = ajouterNouvelObjet;
window.addInventaireRowPoids = addInventaireRowPoids;
window.updateInventairePoids = updateInventairePoids;
window.removeInventaireRowPoids = removeInventaireRowPoids;
window.duplicateRowPoids = duplicateRowPoids;
window.supprimerObjet = supprimerObjet;
window.modifierPoids = modifierPoids;
window.exporterObjets = exporterObjets;
window.importerObjets = importerObjets;
window.rechercherObjets = rechercherObjets;
