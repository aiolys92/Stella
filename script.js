// ===== OPTIMIZED INVENTORY MANAGEMENT SCRIPT =====

/**
 * Gestionnaire principal pour l'inventaire, les listes et la persistance
 */

// ===== CONSTANTES ET UTILITAIRES =====
const INVENTORY_TABLES = {
  pieces: 'inventaireTablePieces',
  gemmes: 'inventaireTableGemmes'
};

const SELECTORS = {
  totalPieces: '#totalPieces',
  totalInventaire: '#totalInventaire',
  pieceList: '#pieceList',
  gemmeList: '#gemmeList',
  fileInput: '#fileInputInventory',
  saveBtn: '#saveInventoryBtn'
};

// ===== UTILITAIRES =====
/**
 * Calcule le total en PM pour toutes les lignes d'inventaire
 * @returns {number} Total en PM
 */
function calculateTotal() {
  return Array.from(document.querySelectorAll('td.total'))
    .reduce((sum, td) => sum + (parseFloat(td.textContent) || 0), 0);
}

/**
 * Met à jour l'affichage du total
 * @param {number} total - Montant total à afficher
 */
function updateTotalDisplay(total) {
  const totalStr = total.toFixed(2);
  const elements = document.querySelectorAll(`${SELECTORS.totalInventaire}, ${SELECTORS.totalPieces}`);
  elements.forEach(el => {
    if (el) el.textContent = totalStr;
  });
}

/**
 * Obtient la valeur d'une monnaie/gemme par son nom
 * @param {string} name - Nom de l'objet
 * @returns {number} Valeur de l'objet
 */
function getItemValue(name) {
  return monnaies.pieces[name] !== undefined ? monnaies.pieces[name]
       : monnaies.gemmes[name] !== undefined ? monnaies.gemmes[name] 
       : 0;
}

/**
 * Crée les options pour un select d'objets
 * @param {Object} itemList - Liste des objets (pieces ou gemmes)
 * @returns {string} HTML des options
 */
function createOptions(itemList) {
  return Object.keys(itemList)
    .map(name => `<option value="${name}">${name}</option>`)
    .join('');
}

// ===== GESTION DE L'INVENTAIRE =====
/**
 * Met à jour une ligne d'inventaire quand la quantité ou l'objet change
 * @param {Event} event - Événement déclencheur
 */
function updateInventaire(event) {
  const row = event.target.closest('tr');
  if (!row) return;

  const nameSelect = row.querySelector('select');
  const qtyInput = row.querySelector('input.qte');
  const valeurCell = row.querySelector('td.valeur');
  const totalCell = row.querySelector('td.total');

  if (!nameSelect || !qtyInput || !valeurCell || !totalCell) return;

  const name = nameSelect.value;
  const qty = parseFloat(qtyInput.value) || 0;
  const value = getItemValue(name);
  const total = value * qty;

  valeurCell.textContent = value.toFixed(2);
  totalCell.textContent = total.toFixed(2);

  // Mettre à jour le total général
  updateTotalDisplay(calculateTotal());
}

/**
 * Ajoute une nouvelle ligne à l'inventaire
 * @param {string} type - 'pieces' ou 'gemmes'
 */
function addInventaireRow(type) {
  if (!['pieces', 'gemmes'].includes(type)) {
    console.error('Type invalide:', type);
    return;
  }

  const table = document.getElementById(INVENTORY_TABLES[type]);
  if (!table) {
    console.error('Table non trouvée:', INVENTORY_TABLES[type]);
    return;
  }

  const tbody = table.querySelector('tbody');
  if (!tbody) {
    console.error('Tbody non trouvé pour la table:', type);
    return;
  }

  const itemList = type === 'pieces' ? monnaies.pieces : monnaies.gemmes;
  const row = tbody.insertRow();
  const options = createOptions(itemList);

  row.innerHTML = `
    <td>
      <select onchange="updateInventaire(event)" aria-label="Sélectionner ${type === 'pieces' ? 'une pièce' : 'une gemme'}">
        ${options}
      </select>
    </td>
    <td>
      <input class="qte" type="number" value="0" min="0" step="0.01" 
             oninput="updateInventaire(event)" 
             aria-label="Quantité">
    </td>
    <td class="valeur">0.00</td>
    <td class="total">0.00</td>
    <td>
      <button type="button" onclick="removeInventaireRow(this)" 
              aria-label="Supprimer cette ligne">🗑️</button>
    </td>
  `;

  // Déclencher la mise à jour initiale
  updateInventaire({ target: row.querySelector('select') });
}

/**
 * Supprime une ligne d'inventaire
 * @param {HTMLElement} button - Bouton de suppression cliqué
 */
function removeInventaireRow(button) {
  const row = button.closest('tr');
  if (!row) return;

  row.remove();
  
  // Mettre à jour le total après suppression
  updateTotalDisplay(calculateTotal());
}

// ===== GESTION DES LISTES =====
/**
 * Met à jour les listes complètes de pièces et gemmes
 */
function updateListe() {
  updateItemList('pieces', SELECTORS.pieceList, monnaies.pieces);
  updateItemList('gemmes', SELECTORS.gemmeList, monnaies.gemmes);
}

/**
 * Met à jour une liste spécifique d'objets
 * @param {string} type - Type d'objets
 * @param {string} selector - Sélecteur de la table
 * @param {Object} itemList - Liste des objets
 */
function updateItemList(type, selector, itemList) {
  const table = document.querySelector(selector);
  if (!table) return;

  const tbody = table.querySelector('tbody');
  if (!tbody) return;

  tbody.innerHTML = '';
  
  // Trier les objets par valeur décroissante
  const sortedItems = Object.entries(itemList)
    .sort(([,a], [,b]) => b - a);

  sortedItems.forEach(([name, value]) => {
    const row = tbody.insertRow();
    row.innerHTML = `
      <td>${name}</td>
      <td>${value.toFixed(2)}</td>
    `;
  });
}

// ===== PERSISTANCE (SAUVEGARDE/CHARGEMENT) =====
/**
 * Charge un inventaire depuis un fichier JSON
 * @param {Event} event - Événement de changement de fichier
 */
async function loadFromFileInventory(event) {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const text = await file.text();
    const data = JSON.parse(text);
    
    if (!Array.isArray(data)) {
      throw new Error('Le fichier doit contenir un tableau d\'objets');
    }

    // Vider les tables existantes
    document.querySelectorAll('#inventaireTablePieces tbody, #inventaireTableGemmes tbody')
      .forEach(tbody => tbody.innerHTML = '');

    // Charger chaque élément
    data.forEach(item => {
      if (!item.type || !item.name || item.qty === undefined) {
        console.warn('Objet invalide ignoré:', item);
        return;
      }

      addInventaireRow(item.type);
      
      const tableId = INVENTORY_TABLES[item.type];
      const table = document.getElementById(tableId);
      if (!table) return;

      const lastRow = table.querySelector('tbody').lastElementChild;
      if (!lastRow) return;

      const select = lastRow.querySelector('select');
      const input = lastRow.querySelector('input.qte');
      
      if (select && input) {
        select.value = item.name;
        input.value = item.qty;
        updateInventaire({ target: input });
      }
    });

    console.log('Inventaire chargé avec succès');
    
  } catch (error) {
    console.error('Erreur lors du chargement:', error);
    alert('Erreur lors du chargement du fichier. Vérifiez le format JSON.');
  }
}

/**
 * Sauvegarde l'inventaire actuel dans un fichier JSON
 */
function saveToFileInventory() {
  const rows = [];

  // Collecter les pièces
  document.querySelectorAll('#inventaireTablePieces tbody tr').forEach(tr => {
    const select = tr.querySelector('select');
    const input = tr.querySelector('input.qte');
    
    if (select && input && input.value && parseFloat(input.value) > 0) {
      rows.push({
        type: 'pieces',
        name: select.value,
        qty: parseFloat(input.value)
      });
    }
  });

  // Collecter les gemmes
  document.querySelectorAll('#inventaireTableGemmes tbody tr').forEach(tr => {
    const select = tr.querySelector('select');
    const input = tr.querySelector('input.qte');
    
    if (select && input && input.value && parseFloat(input.value) > 0) {
      rows.push({
        type: 'gemmes',
        name: select.value,
        qty: parseFloat(input.value)
      });
    }
  });

  if (rows.length === 0) {
    alert('Aucun objet à sauvegarder');
    return;
  }

  // Créer et télécharger le fichier
  const blob = new Blob([JSON.stringify(rows, null, 2)], { 
    type: 'application/json' 
  });
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = `inventaire_${new Date().toISOString().slice(0, 10)}.json`;
  
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  console.log('Inventaire sauvegardé avec succès');
}

// ===== INITIALISATION =====
/**
 * Initialise l'application au chargement de la page
 */
function initializeApp() {
  // Initialisation pour les pages d'inventaire
  if (document.getElementById('inventaireTablePieces')) {
    // Ajouter des lignes initiales
    addInventaireRow('pieces');
    addInventaireRow('gemmes');

    // Configurer les événements de fichier
    const fileInput = document.querySelector(SELECTORS.fileInput);
    const saveButton = document.querySelector(SELECTORS.saveBtn);

    if (fileInput) {
      fileInput.addEventListener('change', loadFromFileInventory);
    }

    if (saveButton) {
      saveButton.addEventListener('click', saveToFileInventory);
    }

    console.log('Page d\'inventaire initialisée');
  }

  // Initialisation pour la page de liste
  if (document.querySelector(SELECTORS.pieceList)) {
    updateListe();
    console.log('Page de liste initialisée');
  }
}

// ===== EXPOSITION DES FONCTIONS GLOBALES =====
// Ces fonctions doivent être accessibles globalement pour les événements onclick
window.updateInventaire = updateInventaire;
window.addInventaireRow = addInventaireRow;
window.removeInventaireRow = removeInventaireRow;

// ===== DÉMARRAGE DE L'APPLICATION =====
document.addEventListener('DOMContentLoaded', initializeApp);
