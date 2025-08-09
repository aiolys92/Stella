// ===== NAVIGATION MANAGER OPTIMISÉ =====

/**
 * Gestionnaire de navigation unifié et optimisé
 * Version 2.0 - Performance et accessibilité améliorées
 */

// ===== CONFIGURATION =====
const NAV_CONFIG = {
  links: [
    { href: 'index.html', text: 'Accueil', icon: '🏠', priority: 1 },
    { href: 'dorusis.html', text: 'Dorusis', icon: '👤', priority: 2 },
    { href: 'guilde.html', text: 'Guilde', icon: '⚔️', priority: 3 },
    { href: 'poids.html', text: 'Poids', mobileText: 'Poids', icon: '🏋️', priority: 4 },
    { href: 'liste.html', text: 'Liste', mobileText: 'Liste', icon: '📋', priority: 5 },
    { href: 'convertisseur.html', text: 'Convertisseur', mobileText: 'Convert', icon: '🔄', priority: 6 },
    { href: 'grimoire.html', text: 'Grimoire', icon: '📖', priority: 7 }
  ],
  
  // Pages sans sidebar (navigation personnalisée)
  excludeFromSidebar: ['index.html'],
  
  // Breakpoint mobile
  mobileBreakpoint: 768,
  
  // Délai pour le debouncing du resize
  resizeDebounce: 250
};

// ===== CLASSE PRINCIPALE =====
class NavigationManager {
  constructor() {
    this.currentPage = this.getCurrentPage();
    this.isMobile = this.checkMobile();
    this.isInitialized = false;
    this.resizeTimer = null;
    this.elements = {
      sidebar: null,
      mobileNav: null
    };
  }

  /**
   * Initialise le système de navigation
   * @returns {boolean} Succès de l'initialisation
   */
  init() {
    if (this.isInitialized) {
      console.warn('Navigation déjà initialisée');
      return true;
    }

    try {
      this.cleanup();
      this.injectNavigation();
      this.setupEventListeners();
      this.updateActiveLink();
      this.addNavigationStyles();
      this.isInitialized = true;

      console.log(`✅ Navigation initialisée pour: ${this.currentPage} (${this.isMobile ? 'mobile' : 'desktop'})`);
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la navigation:', error);
      return false;
    }
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
    return window.innerWidth <= NAV_CONFIG.mobileBreakpoint;
  }

  /**
   * Nettoie la navigation existante
   */
  cleanup() {
    // Supprimer les éléments existants
    document.querySelectorAll('.sidebar, .mobile-nav').forEach(el => el.remove());
    
    // Nettoyer les références
    this.elements.sidebar = null;
    this.elements.mobileNav = null;
  }

  /**
   * Injecte la navigation appropriée
   */
  injectNavigation() {
    // Toujours injecter la navigation mobile
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
    const sidebar = document.createElement('nav');
    sidebar.className = 'sidebar';
    sidebar.setAttribute('aria-label', 'Navigation principale');
    
    // Titre de la sidebar
    const title = document.createElement('h2');
    title.textContent = 'Navigation';
    sidebar.appendChild(title);

    // Liste des liens
    const linksList = document.createElement('ul');
    linksList.className = 'nav-links';
    linksList.setAttribute('role', 'menubar');

    NAV_CONFIG.links
      .sort((a, b) => a.priority - b.priority)
      .forEach(linkConfig => {
        const listItem = document.createElement('li');
        listItem.setAttribute('role', 'none');
        
        const link = this.createNavLink(linkConfig, false);
        link.setAttribute('role', 'menuitem');
        
        listItem.appendChild(link);
        linksList.appendChild(listItem);
      });

    sidebar.appendChild(linksList);

    // Injecter avant le contenu principal
    const content = document.querySelector('.content');
    if (content && content.parentNode) {
      content.parentNode.insertBefore(sidebar, content);
    } else {
      document.body.insertBefore(sidebar, document.body.firstChild);
    }

    this.elements.sidebar = sidebar;
  }

  /**
   * Crée et injecte la navigation mobile
   */
  injectMobileNav() {
    const mobileNav = document.createElement('nav');
    mobileNav.className = 'mobile-nav';
    mobileNav.setAttribute('aria-label', 'Navigation mobile');

    // Conteneur scrollable
    const navContainer = document.createElement('div');
    navContainer.className = 'mobile-nav-container';

    // Créer les liens mobiles
    NAV_CONFIG.links
      .sort((a, b) => a.priority - b.priority)
      .forEach(linkConfig => {
        const link = this.createNavLink(linkConfig, true);
        navContainer.appendChild(link);
      });

    mobileNav.appendChild(navContainer);
    document.body.insertBefore(mobileNav, document.body.firstChild);

    this.elements.mobileNav = mobileNav;
  }

  /**
   * Crée un lien de navigation optimisé
   * @param {Object} config - Configuration du lien
   * @param {boolean} isMobile - Si c'est pour la version mobile
   * @returns {HTMLAnchorElement} Élément de lien
   */
  createNavLink(config, isMobile = false) {
    const link = document.createElement('a');
    link.href = config.href;
    link.className = 'nav-link';
    
    // Texte approprié pour le contexte
    const text = isMobile && config.mobileText ? config.mobileText : config.text;
    
    // Contenu du lien
    if (config.icon) {
      const icon = document.createElement('span');
      icon.className = 'nav-icon';
      icon.textContent = config.icon;
      icon.setAttribute('aria-hidden', 'true');
      link.appendChild(icon);
      
      const textSpan = document.createElement('span');
      textSpan.className = 'nav-text';
      textSpan.textContent = text;
      link.appendChild(textSpan);
    } else {
      link.textContent = text;
    }

    // État actif
    if (config.href === this.currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }

    // Attributs d'accessibilité
    link.setAttribute('aria-label', `Aller à la page ${config.text}`);
    
    // Préchargement pour les performances
    if (config.href !== this.currentPage) {
      link.setAttribute('rel', 'prefetch');
    }

    return link;
  }

  /**
   * Met à jour les liens actifs
   */
  updateActiveLink() {
    const allLinks = document.querySelectorAll('.sidebar a, .mobile-nav a');
    
    allLinks.forEach(link => {
      const href = link.getAttribute('href');
      const isActive = href === this.currentPage;
      
      link.classList.toggle('active', isActive);
      
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  /**
   * Configure les événements
   */
  setupEventListeners() {
    // Gestion du redimensionnement avec debouncing
    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        this.handleResize();
      }, NAV_CONFIG.resizeDebounce);
    });

    // Gestion des clics de navigation
    document.addEventListener('click', (e) => {
      if (e.target.closest('.nav-link')) {
        this.handleNavClick(e);
      }
    });

    // Support clavier pour l'accessibilité
    document.addEventListener('keydown', (e) => {
      if (e.target.closest('.nav-link')) {
        this.handleKeyNavigation(e);
      }
    });

    // Gestion du changement d'historique (pour les SPA)
    window.addEventListener('popstate', () => {
      this.currentPage = this.getCurrentPage();
      this.updateActiveLink();
    });
  }

  /**
   * Gère le redimensionnement de la fenêtre
   */
  handleResize() {
    const newIsMobile = this.checkMobile();
    
    if (newIsMobile !== this.isMobile) {
      this.isMobile = newIsMobile;
      console.log(`📱 Basculement vers ${this.isMobile ? 'mobile' : 'desktop'}`);
      
      // Réinitialiser uniquement si nécessaire
      this.refresh();
    }
  }

  /**
   * Gère les clics de navigation
   * @param {Event} e - Événement de clic
   */
  handleNavClick(e) {
    const link = e.target.closest('.nav-link');
    if (!link) return;

    // Ajouter une classe de chargement
    link.classList.add('loading');
    
    // Retirer la classe après un court délai
    setTimeout(() => {
      link.classList.remove('loading');
    }, 300);

    // Ici on pourrait ajouter une logique SPA si nécessaire
    // Pour l'instant, navigation normale
  }

  /**
   * Gère la navigation au clavier
   * @param {Event} e - Événement clavier
   */
  handleKeyNavigation(e) {
    const link = e.target;
    
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        link.click();
        break;
        
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        this.focusNextLink(link);
        break;
        
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        this.focusPrevLink(link);
        break;
    }
  }

  /**
   * Focus sur le lien suivant
   * @param {HTMLElement} currentLink - Lien actuel
   */
  focusNextLink(currentLink) {
    const container = currentLink.closest('.sidebar, .mobile-nav');
    const links = container.querySelectorAll('.nav-link');
    const currentIndex = Array.from(links).indexOf(currentLink);
    const nextIndex = (currentIndex + 1) % links.length;
    links[nextIndex].focus();
  }

  /**
   * Focus sur le lien précédent
   * @param {HTMLElement} currentLink - Lien actuel
   */
  focusPrevLink(currentLink) {
    const container = currentLink.closest('.sidebar, .mobile-nav');
    const links = container.querySelectorAll('.nav-link');
    const currentIndex = Array.from(links).indexOf(currentLink);
    const prevIndex = currentIndex === 0 ? links.length - 1 : currentIndex - 1;
    links[prevIndex].focus();
  }

  /**
   * Ajoute les styles CSS nécessaires
   */
  addNavigationStyles() {
    if (document.getElementById('nav-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'nav-styles';
    style.textContent = `
      /* Styles de navigation optimisés */
      .nav-links {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      
      .nav-link {
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.2s ease;
        position: relative;
        overflow: hidden;
      }
      
      .nav-link.loading::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        animation: nav-loading 0.6s ease-in-out;
      }
      
      @keyframes nav-loading {
        to { left: 100%; }
      }
      
      .nav-icon {
        font-size: 1.1em;
        flex-shrink: 0;
      }
      
      .nav-text {
        flex: 1;
      }
      
      .mobile-nav-container {
        display: flex;
        gap: 4px;
        overflow-x: auto;
        scroll-behavior: smooth;
        padding: 0 8px;
      }
      
      .mobile-nav-container::-webkit-scrollbar {
        height: 4px;
      }
      
      .mobile-nav-container::-webkit-scrollbar-track {
        background: rgba(0,0,0,0.1);
      }
      
      .mobile-nav-container::-webkit-scrollbar-thumb {
        background: var(--accent-gold);
        border-radius: 2px;
      }
      
      /* Animation de focus pour l'accessibilité */
      .nav-link:focus {
        outline: 2px solid var(--accent-gold);
        outline-offset: 2px;
        border-radius: var(--border-radius);
      }
      
      /* Indicateur de page active amélioré */
      .sidebar .nav-link.active {
        background: rgba(218, 165, 32, 0.3);
        border-left: 4px solid var(--accent-gold);
        padding-left: 11px;
      }
      
      .mobile-nav .nav-link.active {
        background: rgba(218, 165, 32, 0.3);
        border-bottom: 2px solid var(--accent-gold);
      }
      
      /* Responsive amélioré */
      @media (max-width: ${NAV_CONFIG.mobileBreakpoint}px) {
        .mobile-nav .nav-text {
          font-size: 0.75rem;
        }
      }
      
      /* Mode haut contraste */
      @media (prefers-contrast: high) {
        .nav-link.active {
          border-width: 3px;
        }
      }
      
      /* Préférence de mouvement réduit */
      @media (prefers-reduced-motion: reduce) {
        .nav-link {
          transition: none;
        }
        
        @keyframes nav-loading {
          to { left: 100%; }
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * Réinitialise la navigation
   */
  refresh() {
    this.isInitialized = false;
    this.currentPage = this.getCurrentPage();
    return this.init();
  }

  /**
   * Ajoute un lien personnalisé
   * @param {Object} linkConfig - Configuration du nouveau lien
   * @returns {boolean} Succès de l'ajout
   */
  addCustomLink(linkConfig) {
    if (!linkConfig.href || !linkConfig.text) {
      console.error('Configuration de lien invalide');
      return false;
    }

    // Assigner une priorité par défaut
    if (!linkConfig.priority) {
      linkConfig.priority = NAV_CONFIG.links.length + 1;
    }

    NAV_CONFIG.links.push(linkConfig);
    this.refresh();
    return true;
  }

  /**
   * Supprime un lien
   * @param {string} href - href du lien à supprimer
   * @returns {boolean} Succès de la suppression
   */
  removeLink(href) {
    const index = NAV_CONFIG.links.findIndex(link => link.href === href);
    if (index === -1) return false;

    NAV_CONFIG.links.splice(index, 1);
    this.refresh();
    return true;
  }

  /**
   * Obtient les statistiques de navigation
   * @returns {Object} Statistiques
   */
  getStats() {
    return {
      isInitialized: this.isInitialized,
      currentPage: this.currentPage,
      isMobile: this.isMobile,
      linksCount: NAV_CONFIG.links.length,
      hasSidebar: !!this.elements.sidebar,
      hasMobileNav: !!this.elements.mobileNav
    };
  }

  /**
   * Détruit le gestionnaire
   */
  destroy() {
    // Nettoyer les timers
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }

    // Supprimer les éléments
    this.cleanup();

    // Supprimer les styles
    const styles = document.getElementById('nav-styles');
    if (styles) {
      styles.remove();
    }

    // Réinitialiser l'état
    this.isInitialized = false;
    console.log('Navigation détruite');
  }
}

// ===== INSTANCE GLOBALE ET FONCTIONS UTILITAIRES =====
let navigationManager = null;

/**
 * Initialise le gestionnaire de navigation
 * @returns {boolean} Succès de l'initialisation
 */
function initializeNavigation() {
  if (navigationManager) {
    console.warn('Navigation déjà initialisée');
    return true;
  }

  navigationManager = new NavigationManager();
  return navigationManager.init();
}

/**
 * Actualise la navigation
 * @returns {boolean} Succès de l'actualisation
 */
function refreshNavigation() {
  if (!navigationManager) {
    return initializeNavigation();
  }
  return navigationManager.refresh();
}

/**
 * Obtient les statistiques de navigation
 * @returns {Object|null} Statistiques ou null
 */
function getNavigationStats() {
  return navigationManager?.getStats() || null;
}

/**
 * Ajoute un lien personnalisé
 * @param {Object} linkConfig - Configuration du lien
 * @returns {boolean} Succès
 */
function addNavigationLink(linkConfig) {
  return navigationManager?.addCustomLink(linkConfig) || false;
}

/**
 * Supprime un lien de navigation
 * @param {string} href - href du lien
 * @returns {boolean} Succès
 */
function removeNavigationLink(href) {
  return navigationManager?.removeLink(href) || false;
}

// ===== DÉMARRAGE AUTOMATIQUE =====
document.addEventListener('DOMContentLoaded', () => {
  // Petite temporisation pour s'assurer que tout est chargé
  setTimeout(initializeNavigation, 50);
});

// ===== NETTOYAGE À LA FERMETURE =====
window.addEventListener('beforeunload', () => {
  if (navigationManager) {
    navigationManager.destroy();
  }
});

// ===== EXPOSITION POUR USAGE EXTERNE =====
window.NavigationManager = NavigationManager;
window.refreshNavigation = refreshNavigation;
window.getNavigationStats = getNavigationStats;
window.addNavigationLink = addNavigationLink;
window.removeNavigationLink = removeNavigationLink;

console.log('✅ Module de navigation optimisé chargé');
