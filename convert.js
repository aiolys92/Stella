const CONVERTER_CONFIG = {
  selectors: {
    currencySelect: '#convCurrency',
    quantityInput: '#convQty',
    resultsTable: '#convResults'
  },
  baseCurrencies: ['Fer', 'Argent', 'Or', 'Électrum', 'Platine'],
  debounceDelay: 150,
  precision: {
    display: 2,
    calculation: 4
  }
};

// ===== GESTIONNAIRE PRINCIPAL =====
class CurrencyConverter {
  constructor() {
    this.elements = {};
    this.isInitialized = false;
    this.debounceTimer = null;
  }

  /**
   * Initialise le convertisseur
   * @returns {boolean} Succès de l'initialisation
   */
  init() {
    if (this.isInitialized) {
      console.warn('Convertisseur déjà initialisé');
      return true;
    }

    // Vérifier la présence des éléments requis
    if (!this.cacheElements()) {
      console.error('Éléments du convertisseur non trouvés');
      return false;
    }

    // Vérifier la disponibilité des données
    if (!this.validateData()) {
      console.error('Données de monnaies non disponibles');
      return false;
    }

    this.populateSelect();
    this.setupEventListeners();
    this.performInitialConversion();
    
    this.isInitialized = true;
    console.log('✅ Convertisseur initialisé avec succès');
    return true;
  }

  /**
   * Met en cache les éléments DOM
   * @returns {boolean} Succès du cache
   */
  cacheElements() {
    try {
      this.elements.currencySelect = document.querySelector(CONVERTER_CONFIG.selectors.currencySelect);
      this.elements.quantityInput = document.querySelector(CONVERTER_CONFIG.selectors.quantityInput);
      this.elements.resultsTable = document.querySelector(CONVERTER_CONFIG.selectors.resultsTable);

      return this.elements.currencySelect && 
             this.elements.quantityInput && 
             this.elements.resultsTable;
    } catch (error) {
      console.error('Erreur lors du cache des éléments:', error);
      return false;
    }
  }

  /**
   * Valide la disponibilité des données
   * @returns {boolean} Données valides
   */
  validateData() {
    return window.monnaies && 
           window.monnaies.pieces && 
           window.monnaies.gemmes &&
           Object.keys(window.monnaies.pieces).length > 0 &&
           Object.keys(window.monnaies.gemmes).length > 0;
  }

  /**
   * Remplit le select avec toutes les devises
   */
  populateSelect() {
    const fragment = document.createDocumentFragment();
    
    // Ajouter une option par défaut
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Sélectionnez une monnaie...';
    fragment.appendChild(defaultOption);

    // Groupe des pièces
    const piecesGroup = this.createOptGroup('Monnaies Métalliques', window.monnaies.pieces);
    fragment.appendChild(piecesGroup);

    // Groupe des gemmes
    const gemmesGroup = this.createOptGroup('Gemmes Précieuses', window.monnaies.gemmes);
    fragment.appendChild(gemmesGroup);

    // Nettoyer et remplir le select
    this.elements.currencySelect.innerHTML = '';
    this.elements.currencySelect.appendChild(fragment);
  }

  /**
   * Crée un groupe d'options pour le select
   * @param {string} label - Label du groupe
   * @param {Object} items - Items du groupe
   * @returns {HTMLOptGroupElement} Groupe d'options
   */
  createOptGroup(label, items) {
    const optgroup = document.createElement('optgroup');
    optgroup.label = label;

    // Trier les items par ordre alphabétique
    const sortedItems = Object.keys(items).sort();

    sortedItems.forEach(itemName => {
      const option = document.createElement('option');
      option.value = itemName;
      option.textContent = itemName;
      option.dataset.value = items[itemName];
      optgroup.appendChild(option);
    });

    return optgroup;
  }

  /**
   * Configure les événements avec optimisations
   */
  setupEventListeners() {
    // Événement de changement de devise
    this.elements.currencySelect.addEventListener('change', () => {
      this.convertAll();
    });

    // Événement de changement de quantité avec debouncing
    this.elements.quantityInput.addEventListener('input', () => {
      this.debouncedConversion();
    });

    // Validation en temps réel
    this.elements.quantityInput.addEventListener('blur', () => {
      this.validateQuantity();
    });
  }

  /**
   * Conversion avec debouncing pour optimiser les performances
   */
  debouncedConversion() {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.convertAll();
    }, CONVERTER_CONFIG.debounceDelay);
  }

  /**
   * Valide et corrige la quantité saisie
   */
  validateQuantity() {
    const value = parseFloat(this.elements.quantityInput.value);
    if (isNaN(value) || value < 0) {
      this.elements.quantityInput.value = '1';
      this.convertAll();
    }
  }

  /**
   * Effectue la conversion principale
   */
  convertAll() {
    const selectedCurrency = this.elements.currencySelect.value;
    const quantity = this.getValidatedQuantity();
    
    if (!selectedCurrency) {
      this.displayEmptyState();
      return;
    }

    const baseValue = this.calculateBaseValue(selectedCurrency, quantity);
    this.updateResultsTable(baseValue);
    this.highlightSelectedCurrency(selectedCurrency);
  }

  /**
   * Récupère et valide la quantité
   * @returns {number} Quantité validée
   */
  getValidatedQuantity() {
    const value = parseFloat(this.elements.quantityInput.value);
    return isNaN(value) || value < 0 ? 1 : value;
  }

  /**
   * Calcule la valeur de base en PM
   * @param {string} currencyName - Nom de la devise
   * @param {number} quantity - Quantité
   * @returns {number} Valeur en PM
   */
  calculateBaseValue(currencyName, quantity) {
    const currencyValue = this.getCurrencyValue(currencyName);
    return currencyValue * quantity;
  }

  /**
   * Obtient la valeur d'une devise
   * @param {string} currencyName - Nom de la devise
   * @returns {number} Valeur de la devise
   */
  getCurrencyValue(currencyName) {
    return window.monnaies.pieces[currencyName] !== undefined 
      ? window.monnaies.pieces[currencyName]
      : window.monnaies.gemmes[currencyName] || 0;
  }

  /**
   * Met à jour le tableau des résultats
   * @param {number} baseValue - Valeur de base en PM
   */
  updateResultsTable(baseValue) {
    const tbody = this.elements.resultsTable.querySelector('tbody');
    if (!tbody) {
      console.error('Corps de tableau non trouvé');
      return;
    }

    // Créer le contenu du tableau
    const fragment = document.createDocumentFragment();

    CONVERTER_CONFIG.baseCurrencies.forEach(currency => {
      const row = this.createResultRow(currency, baseValue);
      fragment.appendChild(row);
    });

    // Remplacer le contenu en une seule opération DOM
    tbody.innerHTML = '';
    tbody.appendChild(fragment);
  }

  /**
   * Crée une ligne de résultat optimisée
   * @param {string} currencyName - Nom de la devise
   * @param {number} baseValue - Valeur de base
   * @returns {HTMLTableRowElement} Ligne de résultat
   */
  createResultRow(currencyName, baseValue) {
    const row = document.createElement('tr');
    const currencyValue = this.getCurrencyValue(currencyName);
    const convertedValue = baseValue / currencyValue;
    
    row.innerHTML = `
      <td><strong>${currencyName}</strong></td>
      <td>${currencyValue.toFixed(CONVERTER_CONFIG.precision.calculation)} PM</td>
      <td>${this.formatDisplayValue(convertedValue)}</td>
    `;

    row.dataset.currency = currencyName;
    return row;
  }

  /**
   * Formate une valeur pour l'affichage
   * @param {number} value - Valeur à formater
   * @returns {string} Valeur formatée
   */
  formatDisplayValue(value) {
    if (value === 0) return '0';
    if (value < 0.01) return value.toExponential(2);
    if (value >= 1000000) return value.toExponential(2);
    
    return parseFloat(value.toFixed(CONVERTER_CONFIG.precision.display)).toLocaleString('fr-FR');
  }

  /**
   * Met en surbrillance la devise sélectionnée
   * @param {string} selectedCurrency - Devise sélectionnée
   */
  highlightSelectedCurrency(selectedCurrency) {
    const tbody = this.elements.resultsTable.querySelector('tbody');
    if (!tbody) return;

    // Supprimer les surbrillances précédentes
    tbody.querySelectorAll('tr').forEach(row => {
      row.classList.remove('highlighted-currency');
    });

    // Ajouter la surbrillance à la devise sélectionnée
    const targetRow = tbody.querySelector(`tr[data-currency="${selectedCurrency}"]`);
    if (targetRow) {
      targetRow.classList.add('highlighted-currency');
    }
  }

  /**
   * Affiche l'état vide
   */
  displayEmptyState() {
    const tbody = this.elements.resultsTable.querySelector('tbody');
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="3" class="empty-state-cell">
            <em>Sélectionnez une monnaie pour voir les conversions</em>
          </td>
        </tr>
      `;
    }
  }

  /**
   * Effectue la conversion initiale
   */
  performInitialConversion() {
    // Sélectionner l'Or par défaut si disponible
    if (window.monnaies.pieces['Or']) {
      this.elements.currencySelect.value = 'Or';
    }
    this.convertAll();
  }

  /**
   * Réinitialise le convertisseur
   */
  reset() {
    if (!this.isInitialized) return;

    this.elements.quantityInput.value = '1';
    this.elements.currencySelect.selectedIndex = 0;
    this.displayEmptyState();
    
    // Déclencher une notification si disponible
    if (typeof showNotification === 'function') {
      showNotification('🔄 Convertisseur réinitialisé');
    }
  }

  /**
   * Obtient les statistiques du convertisseur
   * @returns {Object} Statistiques
   */
  getStats() {
    return {
      isInitialized: this.isInitialized,
      totalCurrencies: Object.keys(window.monnaies.pieces).length + Object.keys(window.monnaies.gemmes).length,
      baseCurrencies: CONVERTER_CONFIG.baseCurrencies.length,
      currentSelection: this.elements.currencySelect?.value || null,
      currentQuantity: this.getValidatedQuantity()
    };
  }

  /**
   * Nettoie les ressources du convertisseur
   */
  destroy() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    
    this.elements = {};
    this.isInitialized = false;
    console.log('Convertisseur détruit');
  }
}

// ===== GESTIONNAIRE GLOBAL =====
class ConverterManager {
  constructor() {
    this.instance = null;
    this.isReady = false;
  }

  /**
   * Initialise le gestionnaire
   */
  init() {
    // Vérifier si on est sur la bonne page
    if (!document.querySelector(CONVERTER_CONFIG.selectors.currencySelect)) {
      return false;
    }

    // Attendre que les données soient chargées
    if (!window.monnaies) {
      setTimeout(() => this.init(), 100);
      return false;
    }

    this.instance = new CurrencyConverter();
    const success = this.instance.init();
    
    if (success) {
      this.isReady = true;
      this.addStyles();
    }

    return success;
  }

  /**
   * Ajoute les styles CSS nécessaires
   */
  addStyles() {
    if (document.getElementById('converter-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'converter-styles';
    style.textContent = `
      .highlighted-currency {
        background-color: rgba(218, 165, 32, 0.2) !important;
        border-left: 4px solid #DAA520;
        font-weight: bold;
      }
      
      .empty-state-cell {
        text-align: center;
        padding: 20px;
        color: #666;
        font-style: italic;
      }
      
      #convResultsTable tbody tr {
        transition: all 0.3s ease;
      }
      
      #convResultsTable tbody tr:hover {
        background-color: rgba(139, 69, 19, 0.1);
        transform: translateX(2px);
      }
      
      .converter-loading {
        opacity: 0.6;
        pointer-events: none;
      }
      
      .converter-error {
        background-color: #ffebee;
        border: 1px solid #f44336;
        padding: 10px;
        border-radius: 4px;
        margin: 10px 0;
        color: #d32f2f;
      }

      /* Animation de chargement */
      @keyframes converter-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
      
      .converter-loading tbody {
        animation: converter-pulse 1.5s ease-in-out infinite;
      }

      /* Responsive pour mobile */
      @media (max-width: 768px) {
        #convResultsTable {
          font-size: 0.9rem;
        }
        
        #convResultsTable th,
        #convResultsTable td {
          padding: 8px 4px;
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * Obtient l'instance du convertisseur
   * @returns {CurrencyConverter|null} Instance ou null
   */
  getInstance() {
    return this.instance;
  }

  /**
   * Réinitialise le convertisseur
   */
  reset() {
    if (this.instance) {
      this.instance.reset();
    }
  }

  /**
   * Détruit le gestionnaire
   */
  destroy() {
    if (this.instance) {
      this.instance.destroy();
      this.instance = null;
    }
    this.isReady = false;
  }
}

// ===== INSTANCE GLOBALE =====
let converterManager = null;

/**
 * Initialise le système de conversion
 */
function initializeConverter() {
  if (converterManager) {
    console.warn('Gestionnaire de convertisseur déjà existant');
    return;
  }

  converterManager = new ConverterManager();
  const success = converterManager.init();
  
  if (!success) {
    console.log('Convertisseur non initialisé (page non compatible ou données manquantes)');
  }
}

/**
 * Fonction de réinitialisation accessible globalement
 */
function resetConverter() {
  if (converterManager) {
    converterManager.reset();
  }
}

/**
 * Obtient les statistiques du convertisseur
 * @returns {Object|null} Statistiques ou null
 */
function getConverterStats() {
  return converterManager?.getInstance()?.getStats() || null;
}

// ===== UTILITAIRES ADDITIONNELS =====

/**
 * Convertit une valeur entre deux devises spécifiques
 * @param {string} fromCurrency - Devise source
 * @param {string} toCurrency - Devise cible
 * @param {number} amount - Montant à convertir
 * @returns {number|null} Résultat de la conversion ou null
 */
function convertBetweenCurrencies(fromCurrency, toCurrency, amount) {
  if (!window.monnaies || !fromCurrency || !toCurrency || isNaN(amount)) {
    return null;
  }

  const getValue = (name) => 
    window.monnaies.pieces[name] ?? window.monnaies.gemmes[name] ?? 0;

  const fromValue = getValue(fromCurrency);
  const toValue = getValue(toCurrency);

  if (fromValue === 0 || toValue === 0) {
    return null;
  }

  return (fromValue * amount) / toValue;
}

/**
 * Obtient la liste de toutes les devises disponibles
 * @returns {Array} Liste des devises
 */
function getAllCurrencies() {
  if (!window.monnaies) return [];

  return [
    ...Object.keys(window.monnaies.pieces),
    ...Object.keys(window.monnaies.gemmes)
  ].sort();
}

/**
 * Valide si une devise existe
 * @param {string} currencyName - Nom de la devise
 * @returns {boolean} Existe ou non
 */
function isValidCurrency(currencyName) {
  if (!window.monnaies || !currencyName) return false;
  
  return window.monnaies.pieces[currencyName] !== undefined ||
         window.monnaies.gemmes[currencyName] !== undefined;
}

// ===== DÉMARRAGE AUTOMATIQUE =====
document.addEventListener('DOMContentLoaded', initializeConverter);

// ===== EXPOSITION POUR USAGE EXTERNE =====
window.CurrencyConverter = CurrencyConverter;
window.ConverterManager = ConverterManager;
window.resetConverter = resetConverter;
window.getConverterStats = getConverterStats;
window.convertBetweenCurrencies = convertBetweenCurrencies;
window.getAllCurrencies = getAllCurrencies;
window.isValidCurrency = isValidCurrency;

// ===== GESTION DES ERREURS GLOBALES =====
window.addEventListener('error', (event) => {
  if (event.message.includes('converter') || event.message.includes('currency')) {
    console.error('Erreur dans le convertisseur:', event.error);
    
    // Tentative de récupération
    setTimeout(() => {
      if (converterManager && !converterManager.isReady) {
        converterManager.destroy();
        converterManager = null;
        initializeConverter();
      }
    }, 1000);
  }
});

console.log('✅ Module de conversion optimisé chargé');
