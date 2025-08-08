// ===== OPTIMIZED WEIGHT MANAGEMENT SCRIPT =====

/**
 * Gestionnaire pour la page de gestion des poids
 */

// ===== CONSTANTES =====
const WEIGHT_TABLES = {
  dorusis: 'inventaireTableDorusis',
  cheval: 'inventaireTableCheval',
  guilde: 'inventaireTableGuilde'
};

const DORUSIS_BASE_WEIGHT = 80; // kg

// ===== VARIABLES GLOBALES =====
let currentTab = 'dorusis';
let inventaires = {
  dorusis: [],
  cheval: [],
  guilde: []
};

// ===== GESTION DES ONGLETS =====
function switchTab(tabName) {
  if (!['dorusis', 'cheval', 'guilde'].includes(tabName)) return;

  // Désactiver tous les onglets
  document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

  // Activer l'onglet sélectionné
  const tabButton = document.querySelector(`[onclick="switchTab('${tabName}')"]`);
  const tabContent = document.getElementById(`tab-${tabName}`);
  
  if (tabButton && tabContent) {
    tabButton.classList.add('active');
    tabContent.classList.add('active');
    currentTab = tabName;
  }

  console.log(`Onglet actif: ${tabName}`);
}

// ===== GESTION DES INVENTAIRES =====
function addInventaireRowPoids(inventaire) {
  const table = document.getElementById(WEIGHT_TABLES[inventaire]);
  if (!table) {
    console.error('Table non trouvée:', WEIGHT_TABLES[inventaire]);
    return;
  }

  const tbody = table.querySelector('tbody');
  const row = tbody.insertRow();

  row.innerHTML = `
    <td>
      <select onchange="updatePoidsRow(this)" aria-label="Sélectionner une catégorie">
        ${generateCategoryOptions()}
      </select>
    </td>
    <td>
      <select onchange="updatePoidsRow(this)" aria-label="Sélectionner un objet">
        <option value="">Choisir un objet</option>
      </select>
    </td>
    <td>
      <input type="number" value="1" min="0" step="0.1" 
             onchange="updatePoidsRow(this)" 
             aria-label="Quantité">
    </td>
    <td class="poids-unit">0</td>
    <td>
      <input type="checkbox" onchange="updatePoidsRow(this)" 
             aria-label="Objet porté" title="Cocher si l'objet est porté">
    </td>
    <td class="poids-total">0</td>
    <td>
      <button type="button" onclick="removePoidsRow(this)" 
              class="btn-action btn-delete" aria-label="Supprimer cette ligne">
        🗑️
      </button>
      <button type="button" onclick="duplicatePoidsRow(this)" 
              class="btn-action btn-duplicate" aria-label="Dupliquer cette ligne">
        📋
      </button>
    </td>
  `;

  updatePoidsRow(row.querySelector('select'));
}

function removePoidsRow(button) {
  const row = button.closest('tr');
  if (!row) return;

  row.remove();
  updateTotalPoids();
}

function duplicatePoidsRow(button) {
  const row = button.closest('tr');
  if (!row) return;

  const table = row.closest('table');
  const tbody = table.querySelector('tbody');
  const newRow = tbody.insertRow(row.rowIndex);

  // Copier le contenu de la ligne
  newRow.innerHTML = row.innerHTML;

  // Réassigner les événements
  newRow.querySelectorAll('select, input').forEach(element => {
    element.removeAttribute('onchange');
    element.addEventListener('change', function() {
      updatePoidsRow(this);
    });
  });

  updatePoidsRow(newRow.querySelector('select'));
}

// ===== MISE À JOUR DES LIGNES =====
function updatePoidsRow(element) {
  const row = element.closest('tr');
  if (!row) return;

  const categorySelect = row.cells[0].querySelector('select');
  const objectSelect = row.cells[1].querySelector('select');
  const quantityInput = row.cells[2].querySelector('input');
  const unitWeightCell = row.cells[3];
  const carriedCheckbox = row.cells[4].querySelector('input[type="checkbox"]');
  const totalWeightCell = row.cells[5];

  // Si la catégorie a changé, mettre à jour la liste des objets
  if (element === categorySelect) {
    updateObjectsForCategory(categorySelect.value, objectSelect);
  }

  // Calculer le poids
  const objectName = objectSelect.value;
  const quantity = parseFloat(quantityInput.value) || 0;
  const isCarried = carriedCheckbox.checked;

  let unitWeight = 0;
  if (objectName && window.monnaies && window.monnaies.poids) {
    unitWeight = getPoidsObjet(objectName);
  }

  let totalWeight = unitWeight * quantity;
  if (isCarried) {
    totalWeight = totalWeight / 2; // Poids porté = moitié du poids
  }

  unitWeightCell.textContent = unitWeight.toFixed(1);
  totalWeightCell.textContent = totalWeight.toFixed(1);

  updateTotalPoids();
}

// ===== GÉNÉRATION DES OPTIONS =====
function generateCategoryOptions() {
  if (!window.monnaies || !window.monnaies.poids) {
    return '<option value="">Aucune catégorie</option>';
  }

  const categories = Object.keys(window.monnaies.poids);
  const options = ['<option value="">Choisir une catégorie</option>'];
  
  categories.forEach(category => {
    options.push(`<option value="${category}">${category}</option>`);
  });

  return options.join('');
}

function updateObjectsForCategory(category, objectSelect) {
  objectSelect.innerHTML = '<option value="">Choisir un objet</option>';

  if (!category || !window.monnaies || !window.monnaies.poids[category]) {
    return;
  }

  const objects = window.monnaies.poids[category];
  Object.keys(objects).forEach(objectName => {
    const option = document.createElement('option');
    option.value = objectName;
    option.textContent = objectName;
    objectSelect.appendChild(option);
  });
}

// ===== CALCUL DU TOTAL =====
function updateTotalPoids() {
  let total = 0;

  // Ajouter le poids de Dorusis si on est sur l'onglet approprié
  if (currentTab === 'dorusis') {
    total += DORUSIS_BASE_WEIGHT;
  }

  // Calculer le total de tous les objets dans tous les onglets
  document.querySelectorAll('.inventory-table .poids-total').forEach(cell => {
    total += parseFloat(cell.textContent) || 0;
  });

  const totalElement = document.getElementById('totalPoids');
  if (totalElement) {
    totalElement.textContent = total.toFixed(1);
  }
}

// ===== FONCTIONS SPÉCIALES DORUSIS =====
function ajouterDorusisAuCheval() {
  const chevalTable = document.getElementById(WEIGHT_TABLES.cheval);
  if (!chevalTable) return;

  // Vérifier si Dorusis est déjà sur le cheval
  const existingDorusis = Array.from(chevalTable.querySelectorAll('select'))
    .find(select => select.value === 'Dorusis (1.80m, forte musculature)');

  if (existingDorusis) {
    showNotification('⚠️ Dorusis est déjà sur le cheval!');
    return;
  }

  // Ajouter une ligne pour Dorusis
  addInventaireRowPoids('cheval');
  
  // Remplir automatiquement les données de Dorusis
  const tbody = chevalTable.querySelector('tbody');
  const lastRow = tbody.lastElementChild;
  
  if (lastRow) {
    const categorySelect = lastRow.cells[0].querySelector('select');
    const objectSelect = lastRow.cells[1].querySelector('select');
    const quantityInput = lastRow.cells[2].querySelector('input');
    
    categorySelect.value = 'Personnages';
    updateObjectsForCategory('Personnages', objectSelect);
    
    setTimeout(() => {
      objectSelect.value = 'Dorusis (1.80m, forte musculature)';
      quantityInput.value = '1';
      updatePoidsRow(objectSelect);
    }, 100);
  }

  showNotification('🐴 Dorusis est monté sur le cheval');
  switchTab('cheval');
}

function retirerDorusis() {
  const chevalTable = document.getElementById(WEIGHT_TABLES.cheval);
  if (!chevalTable) return;

  // Trouver la ligne de Dorusis
  const rows = chevalTable.querySelectorAll('tbody tr');
  let dorusisRow = null;

  rows.forEach(row => {
    const objectSelect = row.cells[1].querySelector('select');
    if (objectSelect && objectSelect.value === 'Dorusis (1.80m, forte musculature)') {
      dorusisRow = row;
    }
  });

  if (dorusisRow) {
    dorusisRow.remove();
    updateTotalPoids();
    showNotification('👤 Dorusis est descendu du cheval');
    switchTab('dorusis');
  } else {
    showNotification('⚠️ Dorusis n\'est pas sur le cheval');
  }
}

// ===== POP-IN POUR AJOUTER UN OBJET =====
function ouvrirPopinAjout() {
  const popin = document.getElementById('popinAjout');
  if (popin) {
    popin.classList.add('active');
    
    // Peupler les catégories
    const categorySelect = document.getElementById('popinCategory');
    if (categorySelect && window.monnaies && window.monnaies.poids) {
      categorySelect.innerHTML = '';
      Object.keys(window.monnaies.poids).forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
      });
    }
    
    // Focus sur le premier champ
    document.getElementById('popinName').focus();
  }
}

function fermerPopinAjout() {
  const popin = document.getElementById('popinAjout');
  if (popin) {
    popin.classList.remove('active');
    
    // Réinitialiser le formulaire
    document.getElementById('popinName').value = '';
    document.getElementById('popinWeight').value = '';
    document.getElementById('popinDescription').value = '';
  }
}

function ajouterNouvelObjetPopin(event) {
  event.preventDefault();
  
  const category = document.getElementById('popinCategory').value;
  const name = document.getElementById('popinName').value.trim();
  const weight = parseFloat(document.getElementById('popinWeight').value);
  
  if (!category || !name || isNaN(weight) || weight < 0) {
    showNotification('❌ Veuillez remplir tous les champs obligatoires');
    return;
  }
  
  // Vérifier si l'objet existe déjà
  if (window.getPoidsObjet(name) > 0) {
    showNotification('⚠️ Un objet avec ce nom existe déjà');
    return;
  }
  
  // Ajouter l'objet
  if (window.ajouterObjetPoids(name, weight, category)) {
    showNotification(`✅ Objet "${name}" ajouté avec succès`);
    fermerPopinAjout();
    
    // Mettre à jour les listes d'objets dans les catégories
    updateCategoriesDisplay();
  } else {
    showNotification('❌ Erreur lors de l\'ajout de l\'objet');
  }
}

// ===== GESTION DES CATÉGORIES D'OBJETS =====
function updateCategoriesDisplay() {
  const container = document.getElementById('categoriesContainer');
  if (!container || !window.monnaies || !window.monnaies.poids) return;

  container.innerHTML = '';

  Object.entries(window.monnaies.poids).forEach(([categoryName, objects]) => {
    if (Object.keys(objects).length === 0) return; // Ignorer les catégories vides

    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'category-section';
    categoryDiv.innerHTML = `
      <h3>${getCategoryIcon(categoryName)} ${categoryName}</h3>
      <div class="table-container">
        <table class="inventory-table">
          <thead>
            <tr>
              <th width="60%">Nom</th>
              <th width="40%">Poids (kg)</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(objects)
              .sort(([,a], [,b]) => b - a)
              .map(([name, weight]) => `
                <tr>
                  <td><strong>${name}</strong></td>
                  <td>${weight.toFixed(1)}</td>
                </tr>
              `).join('')}
          </tbody>
        </table>
      </div>
    `;

    container.appendChild(categoryDiv);
  });
}

function getCategoryIcon(categoryName) {
  const icons = {
    'Équipements et Armures': '🛡️',
    'Armes': '⚔️',
    'Outils et Équipements': '🔧',
    'Consommables et Provisions': '🍞',
    'Équipement de Voyage': '🎒',
    'Objets Précieux': '💎',
    'Objets Lourds': '📦',
    'Montures et Créatures': '🐴',
    'Personnages': '👤',
    'Objets Personnalisés': '✨'
  };
  return icons[categoryName] || '📋';
}

function filtrerParCategorie(categorie) {
  const sections = document.querySelectorAll('.category-section');
  sections.forEach(section => {
    if (categorie === '') {
      section.style.display = 'block';
    } else {
      const title = section.querySelector('h3').textContent;
      section.style.display = title.includes(categorie) ? 'block' : 'none';
    }
  });
}

function rechercherObjets(query) {
  if (!query.trim()) {
    // Afficher tous les objets
    document.querySelectorAll('.category-section tbody tr').forEach(row => {
      row.style.display = '';
    });
    return;
  }

  const queryLower = query.toLowerCase();
  
  // Filtrer les lignes
  document.querySelectorAll('.category-section tbody tr').forEach(row => {
    const name = row.cells[0].textContent.toLowerCase();
    row.style.display = name.includes(queryLower) ? '' : 'none';
  });
}

// ===== SAUVEGARDE ET CHARGEMENT =====
async function loadFromFileInventory(event) {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const text = await file.text();
    const data = JSON.parse(text);
    
    if (data.inventaires) {
      inventaires = data.inventaires;
      
      // Charger chaque inventaire
      Object.entries(inventaires).forEach(([inventaire, items]) => {
        loadInventaireData(inventaire, items);
      });
      
      updateTotalPoids();
      showNotification('✅ Inventaires chargés avec succès');
    } else {
      throw new Error('Format de fichier invalide');
    }
    
  } catch (error) {
    console.error('Erreur lors du chargement:', error);
    showNotification('❌ Erreur lors du chargement du fichier');
  }
}

function loadInventaireData(inventaire, items) {
  const table = document.getElementById(WEIGHT_TABLES[inventaire]);
  if (!table) return;

  const tbody = table.querySelector('tbody');
  tbody.innerHTML = ''; // Vider la table

  items.forEach(item => {
    addInventaireRowPoids(inventaire);
    const lastRow = tbody.lastElementChild;
    
    if (lastRow) {
      const categorySelect = lastRow.cells[0].querySelector('select');
      const objectSelect = lastRow.cells[1].querySelector('select');
      const quantityInput = lastRow.cells[2].querySelector('input[type="number"]');
      const carriedCheckbox = lastRow.cells[4].querySelector('input[type="checkbox"]');
      
      categorySelect.value = item.categorie;
      updateObjectsForCategory(item.categorie, objectSelect);
      
      setTimeout(() => {
        objectSelect.value = item.objet;
        quantityInput.value = item.quantite;
        carriedCheckbox.checked = item.porte || false;
        updatePoidsRow(objectSelect);
      }, 100);
    }
  });
}

function saveToFileInventory() {
  // Collecter les données de tous les inventaires
  const saveData = {
    inventaires: {},
    objets: window.monnaies.poids,
    dorusisBaseWeight: DORUSIS_BASE_WEIGHT,
    saveDate: new Date().toISOString(),
    version: '2.0'
  };

  Object.keys(WEIGHT_TABLES).forEach(inventaire => {
    saveData.inventaires[inventaire] = collectInventaireData(inventaire);
  });

  // Créer et télécharger le fichier
  const blob = new Blob([JSON.stringify(saveData, null, 2)], { 
    type: 'application/json' 
  });
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = `inventaires_poids_${new Date().toISOString().slice(0, 10)}.json`;
  
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showNotification('✅ Inventaires sauvegardés avec succès');
}

function collectInventaireData(inventaire) {
  const table = document.getElementById(WEIGHT_TABLES[inventaire]);
  if (!table) return [];

  const data = [];
  const rows = table.querySelectorAll('tbody tr');

  rows.forEach(row => {
    const categorySelect = row.cells[0].querySelector('select');
    const objectSelect = row.cells[1].querySelector('select');
    const quantityInput = row.cells[2].querySelector('input[type="number"]');
    const carriedCheckbox = row.cells[4].querySelector('input[type="checkbox"]');

    if (categorySelect.value && objectSelect.value && quantityInput.value) {
      data.push({
        categorie: categorySelect.value,
        objet: objectSelect.value,
        quantite: parseFloat(quantityInput.value),
        porte: carriedCheckbox.checked
      });
    }
  });

  return data;
}

// ===== NOTIFICATIONS =====
function showNotification(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed; top: 20px; right: 20px; z-index: 10000;
    background: linear-gradient(135deg, #228B22 0%, #32CD32 100%);
    color: white; padding: 15px 25px; border-radius: 8px;
    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
    font-family: "Quattrocento Sans", Arial, sans-serif;
    font-weight: bold; font-size: 14px;
    border: 2px solid #228B22;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', function() {
  console.log('🏋️ Gestio Ponderum - Initialisé');
  
  // Ajouter une ligne initiale à chaque inventaire
  Object.keys(WEIGHT_TABLES).forEach(inventaire => {
    addInventaireRowPoids(inventaire);
  });
  
  // Configurer les événements de fichier
  const fileInput = document.getElementById('fileInputInventory');
  const saveButton = document.getElementById('saveInventoryBtn');

  if (fileInput) {
    fileInput.addEventListener('change', loadFromFileInventory);
  }

  if (saveButton) {
    saveButton.addEventListener('click', saveToFileInventory);
  }
  
  // Peupler les catégories dans le filtre
  const categoryFilter = document.getElementById('categoryFilter');
  if (categoryFilter && window.monnaies && window.monnaies.poids) {
    Object.keys(window.monnaies.poids).forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  }
  
  // Afficher les catégories
  updateCategoriesDisplay();
  
  // Mettre à jour le total initial
  updateTotalPoids();
});

// ===== EXPOSITION DES FONCTIONS =====
window.switchTab = switchTab;
window.addInventaireRowPoids = addInventaireRowPoids;
window.removePoidsRow = removePoidsRow;
window.duplicatePoidsRow = duplicatePoidsRow;
window.updatePoidsRow = updatePoidsRow;
window.ajouterDorusisAuCheval = ajouterDorusisAuCheval;
window.retirerDorusis = retirerDorusis;
window.ouvrirPopinAjout = ouvrirPopinAjout;
window.fermerPopinAjout = fermerPopinAjout;
window.ajouterNouvelObjetPopin = ajouterNouvelObjetPopin;
window.filtrerParCategorie = filtrerParCategorie;
window.rechercherObjets = rechercherObjets;
