// ===== OPTIMIZED CURRENCY CONVERTER =====

/**
 * Gestionnaire pour la page convertisseur de monnaies
 */

// ===== CONSTANTES =====
const CONVERTER_SELECTORS = {
  currencySelect: '#convCurrency',
  quantityInput: '#convQty',
  resultsTable: '#convResults'
};

const BASE_CURRENCIES = ['Fer', 'Argent', 'Or', 'Électrum', 'Platine'];

// ===== CLASSE PRINCIPALE =====
class CurrencyConverter {
  constructor() {
    this.currencySelect = null;
    this.quantityInput = null;
    this.resultsTable = null;
    this.isInitialized = false;
  }

  /**
   * Initialise le convertisseur
   */
  init() {
    if (this.isInitialized) return;

    // Vérifier que nous sommes sur la bonne page
    if (!document.getElementById('convCurrency')) {
      return;
    }

    this.currencySelect = document.querySelector(CONVERTER_SELECTORS.currencySelect);
    this.quantityInput = document.querySelector(CONVERTER_SELECTORS.quantityInput);
    this.resultsTable = document.querySelector(CONVERTER_SELECTORS.resultsTable);

    if (!this.currencySelect || !this.quantityInput || !this.resultsTable) {
      console.error('Éléments du convertisseur non trouvés');
      return;
    }

    this.populateSelect();
    this.setupEventListeners();
    this.convertAll();
    this.isInitialized = true;

    console.log('Convertisseur initialisé avec succès');
  }

  /**
   * Remplit le select avec toutes les devises disponibles
   */
  populateSelect() {
    const fragment = document.createDocumentFragment();
    
    // Trier toutes les devises par ordre alphabétique
    const allCurrencies = [
      ...Object.keys(monnaies.pieces),
      ...Object.keys(monnaies.gemmes)
    ].sort();

    allCurrencies.forEach(currencyName => {
      const option = document.createElement('option');
      option.value = currencyName;
      option.textContent = currencyName;
      fragment.appendChild(option);
    });

    this.currencySelect.appendChild(fragment);
  }

  /**
   * Configure les événements
   */
  setupEventListeners() {
    this.currencySelect.addEventListener('change', () => this.convertAll());
    this.quantityInput.addEventListener('input', () => this.convertAll());
    
    // Permettre la conversion en temps réel avec une légère temporisation
    let timeout;
    this.quantityInput.addEventListener('input', () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => this.convertAll(), 150);
    });
  }

  /**
   * Effectue la conversion pour toutes les devises de base
   */
  convertAll() {
    const selectedCurrency = this.currencySelect.value;
    const quantity = this.getQuantity();
    
    if (!selectedCurrency) return;

    const baseValue = this.calculateBaseValue(selectedCurrency, quantity);
    this.updateResultsTable(baseValue);
  }

  /**
   * Récupère et valide la quantité saisie
   * @returns {number} Quantité valide
   */
  getQuantity() {
    const value = parseFloat(this.quantityInput.value);
    return isNaN(value) || value < 0 ? 0 : value;
  }

  /**
   * Calcule la valeur de base en PM (Pièce Modèle)
   * @param {string} currencyName - Nom de la devise
   * @param {number} quantity - Quantité
   * @returns {number} Valeur en PM
   */
  calculateBaseValue(currencyName, quantity) {
    const currencyValue = monnaies.pieces[currencyName] !== undefined 
      ? monnaies.pieces[currencyName]
      : monnaies.gemmes[currencyName] || 0;
    
    return currencyValue * quantity;
  }

  /**
   * Met à jour le tableau des résultats
   * @param {number} baseValue - Valeur de base en PM
   */
  updateResultsTable(baseValue) {
    const tbody = this.resultsTable.querySelector('tbody');
    if (!tbody) return;

    // Vider le tableau existant
    tbody.innerHTML = '';

    // Créer les lignes pour chaque devise de base
    const fragment = document.createDocumentFragment();

    BASE_CURRENCIES.forEach(currency => {
      const currencyValue = monnaies.pieces[currency] || 1;
      const convertedValue = baseValue / currencyValue;
      
      const row = this.createResultRow(currency, convertedValue);
      fragment.appendChild(row);
    });

    tbody.appendChild(fragment);
  }

  /**
   * Crée une ligne de résultat
   * @param {string} currencyName - Nom de la devise
   * @param {number} value - Valeur convertie
   * @returns {HTMLTableRowElement} Ligne de tableau
   */
  createResultRow(currencyName, value) {
    const row = document.createElement('tr');
    
    // Formater la valeur avec une précision appropriée
    const formattedValue = this.formatValue(value);
    
    row.innerHTML = `
      <td><strong>${currencyName}</strong></td>
      <td>${formattedValue}</td>
    `;

    // Ajouter une classe CSS pour la mise en surbrillance si c'est la devise sélectionnée
    if (currencyName === this.currencySelect.value) {
      row.classList.add('highlighted-currency');
    }

    return row;
  }

  /**
   * Formate une valeur numérique pour l'affichage
   * @param {number} value - Valeur à formater
   * @returns {string} Valeur formatée
   */
  formatValue(value) {
    if (value === 0) return '0';
    if (value < 0.01) return value.toExponential(2);
    if (value >= 1000000) return value.toExponential(2);
    
    // Pour les valeurs normales, utiliser 2 décimales mais supprimer les zéros inutiles
    return parseFloat(value.toFixed(2)).toString();
  }

  /**
   * Réinitialise le convertisseur
   */
  reset() {
    if (this.quantityInput) {
      this.quantityInput.value = '1';
    }
    if (this.currencySelect) {
      this.currencySelect.selectedIndex = 0;
    }
    this.convertAll();
  }
}

// ===== INSTANCE GLOBALE =====
let converterInstance = null;

/**
 * Fonction d'initialisation appelée au chargement de la page
 */
function initializeConverter() {
  // Vérifier si nous sommes sur la page du convertisseur
  if (!document.getElementById('convCurrency')) {
    return;
  }

  converterInstance = new CurrencyConverter();
  converterInstance.init();
}

// ===== DÉMARRAGE =====
document.addEventListener('DOMContentLoaded', initializeConverter);

// ===== EXPOSITION POUR USAGE EXTERNE =====
window.CurrencyConverter = CurrencyConverter;

// ===== CSS SUPPLÉMENTAIRE POUR LE CONVERTISSEUR =====
// Ajout de styles dynamiques pour la mise en surbrillance
const addConverterStyles = () => {
  if (document.getElementById('converter-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'converter-styles';
  style.textContent = `
    .highlighted-currency {
      background-color: #e3f2fd !important;
      border: 2px solid #2196f3;
    }
    
    #convResultsTable tbody tr:hover {
      background-color: #f5f5f5;
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
  `;
  
  document.head.appendChild(style);
};

// Ajouter les styles au chargement
document.addEventListener('DOMContentLoaded', addConverterStyles);
