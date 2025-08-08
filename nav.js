const NAV_CONFIG = {
  links: [
    { href: 'index.html', text: 'Accueil', icon: '🏠' },
    { href: 'dorusis.html', text: 'Dorusis', icon: '👤' },
    { href: 'guilde.html', text: 'Guilde', icon: '⚔️' },
    { href: 'poids.html', text: 'Poids', mobileText: 'Poids', icon: '🏋️' },
    { href: 'liste.html', text: 'Liste', mobileText: 'Liste', icon: '📋' },
    { href: 'convertisseur.html', text: 'Convertisseur', mobileText: 'Convert', icon: '🔄' },
    { href: 'grimoire.html', text: 'Grimoire', icon: '📖' }
  ],
  
  // Pages qui ne doivent pas avoir la sidebar (ex: page d'accueil avec nav custom)
  excludeFromSidebar: ['index.html']
};

// ===== CLASSE PRINCIPALE =====
class NavigationManager {
  constructor() {
    this.currentPage = this.getCurrentPage();
    this.isMobile = this.checkMobile();
    this.isInitialized = false;
  }

  /**
   * Initialise le système de navigation
   */
  init() {
    if (this.isInitialized) return;

    this.cleanup();
    this.injectNavigation();
    this.setupEventListeners();
    this.updateActiveLink();
    this.isInitialized = true;

    console.log('Navigation initialisée pour:', this.currentPage);
  }

  /**
   * Détermine la page actuelle
   * @returns {string} Nom de la page actuelle
   */
  getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    return page === '' ? 'index.html' : page;
  }

  /**
   * Vérifie si l'appareil est mobile
   * @returns {boolean} True si mobile
   */
  checkMobile() {
    return window.innerWidth <= 768;
  }

  /**
   * Nettoie la navigation existante
   */
  cleanup() {
    document.querySelectorAll('.sidebar, .mobile-nav').forEach(el => el.remove());
  }

  /**
   * Injecte la navigation appropriée
   */
  injectNavigation() {
    this.injectMobileNav();
    
    // Injecter la sidebar seulement si pas exclue
    if (!NAV_CONFIG.excludeFromSidebar.includes(this.currentPage)) {
      this.injectSidebar();
    }
  }

  /**
   * Crée et injecte la sidebar desktop
   */
  injectSidebar() {
    const sidebar = document.createElement('div');
    sidebar.className = 'sidebar';
    
    const title = document.createElement('h2');
    title.textContent = 'Navigation';
    sidebar.appendChild(title);

    // Créer les liens
    NAV_CONFIG.links.forEach(linkConfig => {
      const link = this.createNavLink(linkConfig, false);
      sidebar.appendChild(link);
    });

    // Injecter avant le contenu
    const content = document.querySelector('.content');
    if (content) {
      document.body.insertBefore(sidebar, content);
    } else {
      document.body.insertBefore(sidebar, document.body.firstChild);
    }
  }

  /**
   * Crée et injecte la navigation mobile
   */
  injectMobileNav() {
    const mobileNav = document.createElement('div');
    mobileNav.className = 'mobile-nav';

    // Créer les liens mobiles
    NAV_CONFIG.links.forEach(linkConfig => {
      const link = this.createNavLink(linkConfig, true);
      mobileNav.appendChild(link);
    });

    document.body.insertBefore(mobileNav, document.body.firstChild);
  }

  /**
   * Crée un lien de navigation
   * @param {Object} config - Configuration du lien
   * @param {boolean} isMobile - Si c'est pour la version mobile
   * @returns {HTMLAnchorElement} Élément de lien
   */
  createNavLink(config, isMobile = false) {
    const link = document.createElement('a');
    link.href = config.href;
    
    // Texte différent pour mobile si disponible
    const text = isMobile && config.mobileText ? config.mobileText : config.text;
    
    // Ajouter icône si disponible
    if (config.icon && isMobile) {
      link.innerHTML = `${config.icon} ${text}`;
    } else {
      link.textContent = text;
    }

    // Marquer le lien actuel
    if (config.href === this.currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }

    // Attributs d'accessibilité
    link.setAttribute('aria-label', `Aller à la page ${config.text}`);

    return link;
  }

  /**
   * Met à jour le lien actif
   */
  updateActiveLink() {
    document.querySelectorAll('.sidebar a, .mobile-nav a').forEach(link => {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
      
      if (link.getAttribute('href') === this.currentPage) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  /**
   * Configure les événements
   */
  setupEventListeners() {
    // Réinitialiser la navigation au redimensionnement
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const newIsMobile = this.checkMobile();
        if (newIsMobile !== this.isMobile) {
          this.isMobile = newIsMobile;
          this.init(); // Réinitialiser si changement mobile/desktop
        }
      }, 250);
    });

    // Gestion des clics sur les liens (pour SPA future si besoin)
    document.addEventListener('click', (e) => {
      if (e.target.matches('.sidebar a, .mobile-nav a')) {
        // Ici on pourrait ajouter une logique SPA
        // Pour l'instant, navigation normale
      }
    });
  }

  /**
   * Réinitialise la navigation (utile pour les changements dynamiques)
   */
  refresh() {
    this.isInitialized = false;
    this.currentPage = this.getCurrentPage();
    this.init();
  }

  /**
   * Ajoute un lien personnalisé à la navigation
   * @param {Object} linkConfig - Configuration du nouveau lien
   */
  addCustomLink(linkConfig) {
    if (!linkConfig.href || !linkConfig.text) {
      console.error('Configuration de lien invalide');
      return;
    }

    NAV_CONFIG.links.push(linkConfig);
    this.refresh();
  }

  /**
   * Supprime un lien de la navigation
   * @param {string} href - href du lien à supprimer
   */
  removeLink(href) {
    const index = NAV_CONFIG.links.findIndex(link => link.href === href);
    if (index !== -1) {
      NAV_CONFIG.links.splice(index, 1);
      this.refresh();
    }
  }
}

// ===== INSTANCE GLOBALE =====
let navigationManager = null;

/**
 * Initialise le gestionnaire de navigation
 */
function initializeNavigation() {
  navigationManager = new NavigationManager();
  navigationManager.init();
}

/**
 * Fonction utilitaire pour actualiser la navigation
 */
function refreshNavigation() {
  if (navigationManager) {
    navigationManager.refresh();
  }
}

// ===== STYLES CSS SUPPLÉMENTAIRES =====
const addNavigationStyles = () => {
  if (document.getElementById('nav-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'nav-styles';
  style.textContent = `
    /* Styles pour les liens actifs */
    .sidebar a.active,
    .mobile-nav a.active {
      background-color: rgba(255, 255, 255, 0.2);
      border-left: 3px solid #fff;
      padding-left: 9px;
    }
    
    .mobile-nav a.active {
      border-left: none;
      border-bottom: 2px solid #fff;
      padding-left: 12px;
    }
    
    /* Animation de transition */
    .sidebar a,
    .mobile-nav a {
      transition: all 0.2s ease;
      position: relative;
    }
    
    /* Indicateur de chargement */
    .nav-loading::after {
      content: '...';
      animation: navLoading 1s infinite;
    }
    
    @keyframes navLoading {
      0%, 33% { content: ''; }
      34%, 66% { content: '.'; }
      67%, 99% { content: '..'; }
      100% { content: '...'; }
    }
  `;
  
  document.head.appendChild(style);
};

// ===== DÉMARRAGE =====
document.addEventListener('DOMContentLoaded', () => {
  addNavigationStyles();
  initializeNavigation();
});

// ===== EXPOSITION POUR USAGE EXTERNE =====
window.NavigationManager = NavigationManager;
window.refreshNavigation = refreshNavigation;
