poidsEquipements += poids;
      }
    }
  });
  
  return DORUSIS_BASE_WEIGHT + poidsEquipements;
}

/**
 * Ajoute automatiquement Dorusis avec son équipement au cheval
 */
function ajouterDorusisAuCheval() {
  const poidsTotal = calculerPoidsDorusis();
  
  const confirmation = confirm(
    `🐴 Monter Dorusis sur le cheval ?\n\n` +
    `👤 Dorusis: ${DORUSIS_BASE_WEIGHT} kg\n` +
    `🎒 Équipements: ${(poidsTotal - DORUSIS_BASE_WEIGHT).toFixed(1)} kg\n` +
    `⚖️ Poids total: ${poidsTotal.toFixed(1)} kg`
  );
  
  if (!confirmation) return;
  
  // Vérifier si Dorusis est déjà sur le cheval
  const chevalTable = document.getElementById('inventaireTableCheval');
  let dorusisRow = null;
  
  chevalTable.querySelectorAll('tbody tr').forEach(row => {
    const objectSelect = row.querySelector('.object-select');
    if (objectSelect && objectSelect.value.includes('Dorusis')) {
      dorusisRow = row;
    }
  });
  
  if (dorusisRow) {
    // Mettre à jour le poids existant
    const quantityInput = dorusisRow.querySelector('.quantity-input');
    quantityInput.value = '1';
    
    // Mettre à jour le poids dans les données
    window.modifierObjetPoids('Dorusis (1.80m, forte musculature)', poidsTotal);
    
    updateInventairePoids(dorusisRow.querySelector('.object-select'));
    showNotification(`🔄 Poids de Dorusis mis à jour: ${poidsTotal.toFixed(1)} kg`);
  } else {
    // Ajouter une nouvelle ligne pour Dorusis
    addInventaireRowPoids('cheval');
    
    const chevalTable = document.getElementById('inventaireTableCheval');
    const lastRow = chevalTable.querySelector('tbody').lastElementChild;
    
    if (lastRow) {
      // Sélectionner la catégorie "Personnages"
      const categorySelect = lastRow.querySelector('.category-select');
      categorySelect.value = 'Personnages';
      updateObjetOptions(categorySelect);
      
      // Sélectionner Dorusis
      setTimeout(() => {
        const objectSelect = lastRow.querySelector('.object-select');
        objectSelect.value = 'Dorusis (1.80m, forte musculature)';
        
        // Mettre à jour le poids dans les données
        window.modifierObjetPoids('Dorusis (1.80m, forte musculature)', poidsTotal);
        
        updateInventairePoids(objectSelect);
        
        // Changer vers l'onglet cheval
        switchTab('cheval');
        
        showNotification(`🐴 Dorusis monté sur le cheval (${poidsTotal.toFixed(1)} kg)`);
      }, 100);
    }
  }
}

/**
 * Retire Dorusis du cheval
 */
function retirerDorusis() {
  const chevalTable = document.getElementById('inventaireTableCheval');
  let dorusisRow = null;
  
  chevalTable.querySelectorAll('tbody tr').forEach(row => {
    const objectSelect = row.querySelector('.object-select');
    if (objectSelect && objectSelect.value.includes('Dorusis')) {
      dorusisRow = row;
    }
  });
  
  if (dorusisRow) {
    const confirmation = confirm('👤 Faire descendre Dorusis du cheval ?');
    if (confirmation) {
      dorusisRow.remove();
      updateTotalPoids();
      showNotification('👤 Dorusis est descendu du cheval');
    }
  } else {
    showNotification('❌ Dorusis n\'est pas sur le cheval');
  }
}

// ===== 5. GESTION DE LA LISTE DES OBJETS (CONSULTATION UNIQUEMENT) =====
/**
 * Met à jour l'affichage de la liste des objets par catégories (sans boutons de suppression)
 */
function updateObjectsList() {
  const container = document.getElementById('categoriesContainer');
  if (!container) return;
  
  container.innerHTML = '';
  
  // Pour chaque catégorie
  window.getCategoriesPoids().forEach(categorieName => {
    const objets = window.getObjetsByCategorie(categorieName);
    
    if (Object.keys(objets).length === 0) return;
    
    const categorySection = document.createElement('div');
    categorySection.className = 'category-section';
    categorySection.innerHTML = `
      <h3 class="category-title">${categorieName} (${Object.keys(objets).length} objets)</h3>
      <div class="objects-grid">
        ${Object.entries(objets)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([nom, poids]) => `
            <div class="object-card">
              <div class="object-info">
                <strong class="object-name">${nom}</strong>
                <span class="object-weight">${poids} kg</span>
              </div>
            </div>
          `).join('')}
      </div>
    `;
    
    container.appendChild(categorySection);
  });
}

/**
 * Peuple tous les selects avec les catégories
 */
function populateSelects() {
  // Select pour filtrer
  const categoryFilter = document.getElementById('categoryFilter');
  if (categoryFilter) {
    categoryFilter.innerHTML = `
      <option value="">Toutes les catégories</option>
      ${window.getCategoriesPoids().map(cat => `<option value="${cat}">${cat}</option>`).join('')}
    `;
  }
}

// ===== 6. RECHERCHE ET FILTRES =====
/**
 * Filtre les objets par catégorie
 * @param {string} categorie - Catégorie à afficher (vide = toutes)
 */
function filtrerParCategorie(categorie) {
  const sections = document.querySelectorAll('.category-section');
  
  sections.forEach(section => {
    const title = section.querySelector('.category-title').textContent;
    section.style.display = (!categorie || title.includes(categorie)) ? 'block' : 'none';
  });
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
  
  // Masquer les catégories vides lors de la recherche
  if (terme) {
    document.querySelectorAll('.category-section').forEach(section => {
      const visibleCards = section.querySelectorAll('.object-card[style="display: block"], .object-card:not([style*="display: none"])');
      section.style.display = visibleCards.length > 0 ? 'block' : 'none';
    });
  } else {
    // Réafficher toutes les catégories si pas de recherche
    document.querySelectorAll('.category-section').forEach(section => {
      section.style.display = 'block';
    });
  }
}

// ===== 7. SAUVEGARDE/CHARGEMENT =====
function saveInventairesPoids() {
  const inventaires = {};
  
  TABS_ORDER.forEach(tab => {
    const table = document.querySelector(`#inventaireTable${tab.charAt(0).toUpperCase() + tab.slice(1)}`);
    if (!table) return;
    
    const rows = [];
    table.querySelectorAll('tbody tr').forEach(row => {
      const categorySelect = row.querySelector('.category-select');
      const objectSelect = row.querySelector('.object-select');
      const quantityInput = row.querySelector('.quantity-input');
      const carriedCheckbox = row.querySelector('.carried-checkbox');
      
      if (objectSelect && objectSelect.value && quantityInput.value) {
        rows.push({
          categorie: categorySelect.value,
          objet: objectSelect.value,
          quantite: parseFloat(quantityInput.value),
          porte: carriedCheckbox.checked
        });
      }
    });
    
    inventaires[tab] = rows;
  });
  
  const data = {
    inventaires: inventaires,
    objets: window.monnaies.poids,
    dorusisBaseWeight: DORUSIS_BASE_WEIGHT,
    saveDate: new Date().toISOString(),
    version: "2.0"
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  
  a.href = url;
  a.download = `inventaires-poids-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  
  URL.revokeObjectURL(url);
  showNotification('💾 Inventaires sauvegardés');
}

/**
 * Charge les inventaires depuis un fichier
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
        ...window.monnaies.gemmes
      };
      // Aplatir les objets poids
      Object.values(window.monnaies.poids).forEach(categorie => {
        Object.assign(window.objets, categorie);
      });
      updateObjectsList();
    }
    
    // Charger les inventaires
    if (data.inventaires) {
      TABS_ORDER.forEach(tab => {
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
            const categorySelect = lastRow.querySelector('.category-select');
            const objectSelect = lastRow.querySelector('.object-select');
            const quantityInput = lastRow.querySelector('.quantity-input');
            const carriedCheckbox = lastRow.querySelector('.carried-checkbox');
            
            if (categorySelect && objectSelect && quantityInput) {
              categorySelect.value = item.categorie;
              updateObjetOptions(categorySelect);
              
              setTimeout(() => {
                objectSelect.value = item.objet;
                quantityInput.value = item.quantite;
                carriedCheckbox.checked = item.porte || false;
                updateInventairePoids(objectSelect);
              }, 50);
            }
          }
        });
      });
    }
    
    showNotification('✅ Inventaires chargés avec succès');
    
  } catch (error) {
    console.error('Erreur chargement:', error);
    alert('❌ Erreur lors du chargement du fichier');
  }
  
  // Réinitialiser l'input
  event.target.value = '';
}

// ===== 8. UTILITAIRES =====
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

// ===== 9. INITIALISATION =====
document.addEventListener('DOMContentLoaded', function() {
  console.log('🏋️ Initialisation du système de poids...');
  
  // Vérifier qu'on est sur la bonne page
  if (!document.querySelector('.tabs-container')) {
    console.log('❌ Pas sur la page des poids');
    return;
  }
  
  // Initialiser l'interface
  populateSelects();
  updateObjectsList();
  
  // Activer le premier onglet
  switchTab('dorusis');
  addInventaireRowPoids('dorusis');
  
  // Configurer les événements de sauvegarde
  const saveBtn = document.getElementById('saveInventoryBtn');
  const fileInput = document.getElementById('fileInputInventory');
  
  if (saveBtn) {
    saveBtn.addEventListener('click', saveInventairesPoids);
  }
  
  if (fileInput) {
    fileInput.addEventListener('change', loadInventairesPoids);
  }
  
  console.log('✅ Système de poids initialisé !');
});

// ===== EXPOSITION DES FONCTIONS GLOBALES =====
window.switchTab = switchTab;
window.addInventaireRowPoids = addInventaireRowPoids;
window.updateObjetOptions = updateObjetOptions;
window.updateInventairePoids = updateInventairePoids;
window.removeInventaireRowPoids = removeInventaireRowPoids;
window.duplicateRowPoids = duplicateRowPoids;
window.filtrerParCategorie = filtrerParCategorie;
window.rechercherObjets = rechercherObjets;
window.ajouterDorusisAuCheval = ajouterDorusisAuCheval;
window.retirerDorusis = retirerDorusis;
window.calculerPoidsDorusis = calculerPoidsDorusis;
window.ouvrirPopinAjout = ouvrirPopinAjout;
window.fermerPopinAjout = fermerPopinAjout;
window.ajouterNouvelObjetPopin = ajouterNouvelObjetPopin;// ===== SCRIPT UNIFIÉ POUR LA GESTION DES POIDS =====
// Un seul fichier poids.js pour tout gérer !

// ===== VARIABLES GLOBALES =====
let currentTab = 'dorusis'; // Onglet actuel
const DORUSIS_BASE_WEIGHT = 80; // Poids de base de Dorusis en kg
const TABS_ORDER = ['dorusis', 'cheval', 'guilde']; // Nouvel ordre des onglets

// ===== 1. GESTION DES ONGLETS =====
/**
 * Change d'onglet et affiche le bon inventaire
 */
function switchTab(tabName) {
  console.log(`Changement vers onglet: ${tabName}`);
  
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
    
    // Recalculer le total pour cet onglet
    updateTotalPoids();
  }
}

// ===== 2. GESTION DES OBJETS PERSONNALISÉS AVEC POP-IN =====
/**
 * Ouvre la pop-in pour ajouter un objet
 */
function ouvrirPopinAjout() {
  const popin = document.getElementById('popinAjout');
  if (popin) {
    // Peupler le select des catégories
    const categorySelect = document.getElementById('popinCategory');
    if (categorySelect) {
      categorySelect.innerHTML = window.getCategoriesPoids()
        .map(cat => `<option value="${cat}">${cat}</option>`)
        .join('');
    }
    
    // Réinitialiser le formulaire
    document.getElementById('popinName').value = '';
    document.getElementById('popinWeight').value = '';
    document.getElementById('popinDescription').value = '';
    
    // Afficher la pop-in
    popin.classList.add('active');
    document.getElementById('popinName').focus();
    
    // Empêcher le scroll de la page
    document.body.style.overflow = 'hidden';
  }
}

/**
 * Ferme la pop-in
 */
function fermerPopinAjout() {
  const popin = document.getElementById('popinAjout');
  if (popin) {
    popin.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/**
 * Ajoute un nouvel objet depuis la pop-in
 */
function ajouterNouvelObjetPopin(event) {
  event.preventDefault();
  
  const categorie = document.getElementById('popinCategory').value;
  const nom = document.getElementById('popinName').value.trim();
  const poids = parseFloat(document.getElementById('popinWeight').value);
  const description = document.getElementById('popinDescription').value.trim();
  
  // Vérifications
  if (!categorie || !nom || isNaN(poids) || poids < 0) {
    alert('⚠️ Veuillez remplir tous les champs obligatoires');
    return;
  }
  
  // Vérifier si l'objet existe déjà
  const poidsActuel = window.getPoidsObjet(nom);
  if (poidsActuel > 0) {
    const confirmer = confirm(`L'objet "${nom}" existe déjà. Le remplacer ?`);
    if (!confirmer) return;
  }
  
  // Ajouter l'objet
  window.ajouterObjetPoids(nom, poids, categorie);
  
  // Sauvegarder la description si fournie (optionnel)
  if (description) {
    console.log(`Description pour ${nom}: ${description}`);
  }
  
  // Rafraîchir l'interface
  updateObjectsList();
  populateSelects();
  
  // Fermer la pop-in
  fermerPopinAjout();
  
  // Message de confirmation
  showNotification(`✅ Objet "${nom}" créé dans ${categorie} (${poids} kg)`);
}

/**
 * Gestion des touches clavier pour la pop-in
 */
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    fermerPopinAjout();
  }
});

// ===== 3. GESTION DES INVENTAIRES =====
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
        <option value="">🗂️ Choisir catégorie</option>
        ${categoriesOptions}
      </select>
    </td>
    <td>
      <select onchange="updateInventairePoids(this)" class="object-select" disabled>
        <option value="">📦 Choisir objet</option>
      </select>
    </td>
    <td>
      <input type="number" value="1" min="0" step="0.1" 
             oninput="updateInventairePoids(this)" 
             class="quantity-input">
    </td>
    <td class="unit-weight">-</td>
    <td class="carried-weight-cell">
      <label class="checkbox-label">
        <input type="checkbox" class="carried-checkbox" onchange="updateInventairePoids(this)">
        <span class="carried-weight">-</span> kg
      </label>
    </td>
    <td class="total-weight">-</td>
    <td class="actions-cell">
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
 * Met à jour les objets quand une catégorie est choisie
 */
function updateObjetOptions(categorySelect) {
  const row = categorySelect.closest('tr');
  const objectSelect = row.querySelector('.object-select');
  const categorie = categorySelect.value;
  
  // Réinitialiser le select d'objets
  objectSelect.innerHTML = '<option value="">📦 Choisir objet</option>';
  
  if (!categorie) {
    objectSelect.disabled = true;
    updateInventairePoids(categorySelect); // Reset les valeurs
    return;
  }
  
  // Charger les objets de la catégorie
  const objets = window.getObjetsByCategorie(categorie);
  const options = Object.keys(objets)
    .sort()
    .map(nom => `<option value="${nom}">${nom}</option>`)
    .join('');
  
  objectSelect.innerHTML = `<option value="">📦 Choisir objet</option>${options}`;
  objectSelect.disabled = false;
  
  // Mettre à jour les calculs
  updateInventairePoids(categorySelect);
}

/**
 * Met à jour tous les calculs d'une ligne (LE CŒUR DU SYSTÈME)
 */
function updateInventairePoids(element) {
  const row = element.closest('tr');
  
  // Récupérer tous les éléments de la ligne
  const objectSelect = row.querySelector('.object-select');
  const quantityInput = row.querySelector('.quantity-input');
  const unitWeightCell = row.querySelector('.unit-weight');
  const carriedCheckbox = row.querySelector('.carried-checkbox');
  const carriedWeightSpan = row.querySelector('.carried-weight');
  const totalWeightCell = row.querySelector('.total-weight');
  
  // Récupérer les valeurs
  const objectName = objectSelect.value;
  const quantity = parseFloat(quantityInput.value) || 0;
  const unitWeight = objectName ? window.getPoidsObjet(objectName) : 0;
  const isCarried = carriedCheckbox.checked;
  
  // Calculs
  if (objectName && unitWeight > 0) {
    // 1. Poids unitaire
    unitWeightCell.textContent = unitWeight.toFixed(1) + ' kg';
    
    // 2. Poids porté (÷2 si coché)
    const carriedWeight = isCarried ? unitWeight / 2 : unitWeight;
    carriedWeightSpan.textContent = carriedWeight.toFixed(1);
    
    // 3. Poids total = quantité × poids porté
    const totalWeight = carriedWeight * quantity;
    totalWeightCell.textContent = totalWeight.toFixed(1) + ' kg';
    
  } else {
    // Reset si pas d'objet sélectionné
    unitWeightCell.textContent = '-';
    carriedWeightSpan.textContent = '-';
    totalWeightCell.textContent = '-';
  }
  
  // Mettre à jour le total général de l'onglet
  updateTotalPoids();
}

/**
 * Supprime une ligne d'inventaire
 */
function removeInventaireRowPoids(button) {
  const row = button.closest('tr');
  row.remove();
  updateTotalPoids();
}

/**
 * Duplique une ligne d'inventaire
 */
function duplicateRowPoids(button) {
  const row = button.closest('tr');
  const tbody = row.closest('tbody');
  
  // Cloner la ligne
  const newRow = row.cloneNode(true);
  tbody.appendChild(newRow);
  
  // Recalculer
  updateInventairePoids(newRow.querySelector('.object-select'));
}

/**
 * Calcule et affiche le total de poids pour l'onglet actuel
 */
function updateTotalPoids() {
  const currentTable = document.querySelector(`#tab-${currentTab} .inventory-table`);
  if (!currentTable) return;
  
  let total = 0;
  
  // Additionner tous les poids totaux
  currentTable.querySelectorAll('.total-weight').forEach(cell => {
    const text = cell.textContent.replace(' kg', '');
    const value = parseFloat(text);
    if (!isNaN(value)) {
      total += value;
    }
  });
  
  // Afficher le total
  const totalElement = document.getElementById('totalPoids');
  if (totalElement) {
    totalElement.textContent = total.toFixed(1);
  }
}

// ===== 4. FONCTIONS SPÉCIALES DORUSIS/CHEVAL =====
/**
 * Calcule le poids total de Dorusis (corps + équipements)
 * @returns {number} Poids total en kg
 */
function calculerPoidsDorusis() {
  const dorusisTable = document.getElementById('inventaireTableDorusis');
  if (!dorusisTable) return DORUSIS_BASE_WEIGHT;
  
  let poidsEquipements = 0;
  
  // Additionner tous les équipements de Dorusis
  dorusisTable.querySelectorAll('tbody tr').forEach(row => {
    const totalCell = row.querySelector('.total-weight');
    if (totalCell && totalCell.textContent !== '-') {
      const poids = parseFloat(totalCell.textContent.replace(' kg', ''));
      if (!isNaN(poids)) {
        poidsEquipements
