// ===== BASE DE DONNÉES COMPLÈTE ET CORRIGÉE =====

if (!window.monnaies) {
  window.monnaies = {
    pieces: {
      "Platine": 3,
      "Or": 1, 
      "Argent": 1, 
      "Électrum": 1, 
      "Fer": 0.01041667,
      "Nickel": 0,
      "Cuivre": 0,
      "Titane": 0,
      "Plomp": 0,
    },
    
    // GEMMES - VALEURS CORRECTES SELON VOTRE SPÉCIFICATION
    gemmes: {
      "Rubis": 83.33,
      "Emeraude": 72.92,
      "Saphir": 62.5,
      "Diamant": 52.08,
      "Topaze": 52.08,
      "Aigue-Marine": 41.67,
      "Améthyste": 31.25,
      "Grenat": 20.83,
      "Péridot": 14.58,
      "Cyanite": 13.54,
      "Citrine": 12.5,
      "Pierre de Lune": 11.46,
      "Pierre de Soleil": 10.42,
      "Tourmaline": 9.38,
      "Aventurine": 8.33,
      "Turquoise": 7.29,
      "Œil de loup (Chrysobéryl)": 0.89,
      "Œil de taureau (Quartz brun)": 0.73,
      "Œil de tigre (Quartz brun)": 0.62,
      "Œil de faucon (Quartz bleu)": 0.52,
      "Quartz fumé": 0.42,
      "Quartz rose": 0.31,
      "Cristal (Quartz incolore)": 0.21,
      "Lapis Lazuli": 0.19,
      "Jais (Jaspe noir)": 0.17,
      "Onyxline (Jaspe rouge)": 0.16,
      "Chrysoprase (Jaspe vert)": 0.12,
      "Sardoine (Jaspe brun)": 0.09,
      "Agate (Jaspe multicolore)": 0.08,
      "Obsidienne": 0.07,
      "Serpentine": 0.05,
      "Malachite": 0.03,
      "Ambre": 0.02,
      "Perle": 104.17,
      "Hématite": 0.1,
      "Corail": 0.1,
      "Jais": 0.06,
      "Nacre": 0.04,
      "Ecaille": 0.02
    },
    
    // POIDS ORGANISÉ PAR CATÉGORIES
    poids: {
      "Équipements et Armures": {
        "Armure de cuir clouté": 6,
        "Bottes de Talna": 1,
        "Cape de Voltumna": 1
      },
      
      "Armes": {
        "Dague": 1,
        "Dagues de lancé": 1,
        "Baton Férré (argent/or)": 1
      },
      
      "Outils et Équipements": {
        "Kit de crochetage": 1,
        "Outils spécialisé (Dessin)": 6,
        "Grappin": 4,
        "Corde": 1
      },
      
      "Consommables et Provisions": {
        "Gourde": 1,
        "Ration": 1,
        "Parchemin": 0.1,
        "Torche": 1
      },
      
      "Équipement de Voyage": {
        // Catégorie pour les futurs ajouts
      },
      
      "Objets Précieux": {
        // Catégorie pour les futurs ajouts
      },
      
      "Objets Lourds": {
        "Cheval de trait": 80
      },
      
      "Montures et Créatures": {
        // Catégorie pour les futurs ajouts
      },
      
      "Personnages": {
        "Dorusis (1.80m, forte musculature)": 80
      },
      
      "Objets Personnalisés": {
        // Catégorie pour les futurs ajouts
      }
    }
  };
}

// ===== BASE DE DONNÉES DÉTAILLÉE DES GEMMES SELON L'IMAGE =====
window.gemmesDetaillees = {
  "Rubis": {
    surnom: "Escarboucle",
    valeur: 83.33,
    couleur: "Rouge",
    lienZodiacal: "Sirène/Ecrevisse",
    lienDivin: "Perun, Gibil",
    symbolique: "Volonté, Courage",
    durete: 9,
    notes: "Pierre de protection"
  },
  "Emeraude": {
    surnom: "Turanite",
    valeur: 72.92,
    couleur: "Vert",
    lienZodiacal: "Cerf/Tortue",
    lienDivin: "Turan, Arcton",
    symbolique: "Renaissance, Sagesse",
    durete: 8,
    notes: "Pierre de fortification"
  },
  "Saphir": {
    surnom: "Werunite",
    valeur: 62.5,
    couleur: "Bleu",
    lienZodiacal: "Nuage/Tortue/Phénix/Epée/Dauphins",
    lienDivin: "Weru, Tannun, Shua",
    symbolique: "Justice, Pureté, Liberté",
    durete: 9,
    notes: "Pierre céleste"
  },
  "Diamant": {
    surnom: "Pierre des fous",
    valeur: 52.08,
    couleur: "Incolore",
    lienZodiacal: "Paon/Licorne/Ourlarque",
    lienDivin: "Usil, Atonar, Laran",
    symbolique: "Invincible, Constance",
    durete: 10,
    notes: "Protège contre la folie"
  },
  "Topaze": {
    surnom: "",
    valeur: 52.08,
    couleur: "Jaune/Bleu/Rose",
    lienZodiacal: "Sirène/Phénix/Papillon/Ecrevisse/Tortue/Dauphins/Cerf/Epée",
    lienDivin: "Tannun",
    symbolique: "Gaité, Energie",
    durete: 8,
    notes: "Pierre de soin"
  },
  "Aigue-Marine": {
    surnom: "Llyrite",
    valeur: 41.67,
    couleur: "Bleu pâle",
    lienZodiacal: "Dauphins/Tortue/Sirène/Nuage/Ourlarque/Epée/Papillon/Epée",
    lienDivin: "Llyr, Tannun, Ulfer",
    symbolique: "Sensibilité, Persévérance",
    durete: 8,
    notes: "Protège les marins"
  },
  "Améthyste": {
    surnom: "Pérunite",
    valeur: 31.25,
    couleur: "Violet",
    lienZodiacal: "Phénix/Ourlarque/Licorne/Epée/Sirène/Nuage/Dauphins/Cerf",
    lienDivin: "Perun, Arcton, Ninmah",
    symbolique: "Sagesse, Equilibre",
    durete: 7,
    notes: "Pierre d'apaisement, protège des poisons"
  },
  "Grenat": {
    surnom: "Usilite",
    valeur: 20.83,
    couleur: "Rouge/Pourpre/Violet",
    lienZodiacal: "Ourlarque/Sirène/Tortue/Phénix/Epée",
    lienDivin: "Usil",
    symbolique: "Force, Charisme",
    durete: 7,
    notes: "Pierre d'armure, Pierre de lumière"
  },
  "Péridot": {
    surnom: "Turmite",
    valeur: 14.58,
    couleur: "Vert",
    lienZodiacal: "Tortue/Cerf/Paon/Epée/Sirène/Ourlarque",
    lienDivin: "Turina",
    symbolique: "Equilibre, Fidélité, Chance",
    durete: 7,
    notes: "Pierre de la paladin Pierre de protection"
  },
  "Cyanite": {
    surnom: "",
    valeur: 13.54,
    couleur: "Bleu",
    lienZodiacal: "Epée/Ourlarque/Tortue/Phénix/Dauphins/Cerf/Licorne",
    lienDivin: "Shua",
    symbolique: "Dextérité, Paix",
    durete: "4-6+",
    notes: "Sort de boussole"
  },
  "Citrine": {
    surnom: "",
    valeur: 12.5,
    couleur: "Jaune",
    lienZodiacal: "Papillon/Paon/Ourlarque/Nuage/Sirène/Epée",
    lienDivin: "Thalma, Arcton",
    symbolique: "Vitalité, Joie, Arts",
    durete: 7,
    notes: "Pierre de lumière, protection contre le vent"
  },
  "Pierre de Lune": {
    surnom: "Tilvrite",
    valeur: 11.46,
    couleur: "Lait et reflets bleus",
    lienZodiacal: "Ecrevisse/Papillon/Dauphins/Epée/Sirène/Tortue/Nuage/Ourlarque",
    lienDivin: "Tilvir, Darona",
    symbolique: "Imagination, Pureté",
    durete: "6+",
    notes: '"Œil de poisson", Pierre de pluie'
  },
  "Pierre de Soleil": {
    surnom: "Atonarite",
    valeur: 10.42,
    couleur: "Doré pailleté",
    lienZodiacal: "Paon/Sirène/Licorne",
    lienDivin: "Atonar, Palustris",
    symbolique: "Richesse, Jouvence",
    durete: "6+",
    notes: "Pierre d'orientation, Pierre de lumière"
  },
  "Tourmaline": {
    surnom: "",
    valeur: 9.38,
    couleur: "Rose/Vert/Bleu/Noir",
    lienZodiacal: "Tortue/Ourlarque/Papillon/Tortue/Cerf/Ecrevisse",
    lienDivin: "Turan",
    symbolique: "Quiétude, Protection",
    durete: "7+",
    notes: "Pierre électrique, Pierre de bouclier"
  },
  "Aventurine": {
    surnom: "Pierre du destin",
    valeur: 8.33,
    couleur: "Vert",
    lienZodiacal: "Cerf/Papillon/Phénix/Epée/Ecrevisse",
    lienDivin: "Usil, Narax",
    symbolique: "Harmonie, Prospérité",
    durete: "6+",
    notes: "Pierre de chance"
  },
  "Turquoise": {
    surnom: "Pierre des dieux",
    valeur: 7.29,
    couleur: "Bleu-vert",
    lienZodiacal: "Phénix/Nuage/Dauphins/Cerf/Sirène/Epée/Tortue",
    lienDivin: "Perun, Thalma, Weru",
    symbolique: "Communication, Energie",
    durete: "5+",
    notes: "Pierre de piété, Protège les voyageurs"
  },
  "Œil de loup (Chrysobéryl)": {
    surnom: "Ulférite",
    valeur: 0.89,
    couleur: "Jaune-doré",
    lienZodiacal: "Tortue/Epée",
    lienDivin: "Ulfer",
    symbolique: "Sang-froid, Abondance",
    durete: "8+",
    notes: "Protège les survivants"
  },
  "Œil de taureau (Quartz brun)": {
    surnom: "",
    valeur: 0.73,
    couleur: "Jaune-rouge",
    lienZodiacal: "Cerf",
    lienDivin: "Turan, Ulfer, Ninmah",
    symbolique: "Courage, Fermeté",
    durete: 7,
    notes: "Apporte le succès aux sports"
  },
  "Œil de tigre (Quartz brun)": {
    surnom: "",
    valeur: 0.62,
    couleur: "Orange",
    lienZodiacal: "Paon/Papillon/Ecrevisse/Epée/Tortue/Licorne/Cerf/Papillon",
    lienDivin: "Narax, Arcton, Weru, Laran",
    symbolique: "Liberté, Largesse",
    durete: 7,
    notes: "Protège les guerriers"
  },
  "Œil de faucon (Quartz bleu)": {
    surnom: "",
    valeur: 0.52,
    couleur: "Gris-bleu",
    lienZodiacal: "Papillon/Nuage/Ourlarque/",
    lienDivin: "Thalma, Palustris, Narax",
    symbolique: "Empathie, Evolution",
    durete: 7,
    notes: "Pierre de vision, Pierre de protection"
  },
  "Quartz fumé": {
    surnom: "",
    valeur: 0.42,
    couleur: "Brun",
    lienZodiacal: "Ourlarque/Sirène/Tortue/Epée/Phénix",
    lienDivin: "Usil, Voltumna, Narax",
    symbolique: "Eveil, Volonté",
    durete: 7,
    notes: "Pierre de protection, Pierre de clairvoyance"
  },
  "Quartz rose": {
    surnom: "Pierre du cœur",
    valeur: 0.31,
    couleur: "Rose",
    lienZodiacal: "Cerf/Epée/Nuage/Ourlarque",
    lienDivin: "Turan, Tannun",
    symbolique: "Calme, Tendresse",
    durete: 7,
    notes: "Pierre d'amour, Pierre de beauté"
  },
  "Cristal (Quartz incolore)": {
    surnom: "",
    valeur: 0.21,
    couleur: "Incolore",
    lienZodiacal: "Ourlarque",
    lienDivin: "Usil, Darona, Palustris",
    symbolique: "Clairvoyance, Méditatif",
    durete: 7,
    notes: "Amplificateur"
  },
  "Lapis Lazuli": {
    surnom: "Pierre de vérité",
    valeur: 0.19,
    couleur: "Bleu",
    lienZodiacal: "Nuage/Licorne/Papillon/Paon/Epée/Tortue/Phénix/Dauphins/Cerf",
    lienDivin: "Weru, Ulfer",
    symbolique: "Honnêteté, Intuition",
    durete: "5+",
    notes: "Pierre d'amitié"
  },
  "Jais (Jaspe noir)": {
    surnom: "",
    valeur: 0.17,
    couleur: "Noir",
    lienZodiacal: "Ourlarque/Paon/Tortue",
    lienDivin: "Llyr, Voltumna, Guyona",
    symbolique: "Durisme, Maîtrise",
    durete: "6-",
    notes: "Pierre des ténèbres, Pierre des secrets"
  },
  "Onyxline (Jaspe rouge)": {
    surnom: "Corne",
    valeur: 0.16,
    couleur: "Rouge/Orange",
    lienZodiacal: "Sirène/Cerf/Tortue/Ecrevisse/Licorne/Paon/Epée",
    lienDivin: "Gibil, Arcton",
    symbolique: "Vitalité, Initiative",
    durete: "6+",
    notes: "Pierre de résilience"
  },
  "Chrysoprase (Jaspe vert)": {
    surnom: "",
    valeur: 0.12,
    couleur: "Vert",
    lienZodiacal: "Cerf/Epée/Ecrevisse",
    lienDivin: "Guyona",
    symbolique: "Compassion, Clairvoyance",
    durete: "6+",
    notes: "Pierre de sceau, protège du venin, Invisibilité"
  },
  "Sardoine (Jaspe brun)": {
    surnom: "",
    valeur: 0.09,
    couleur: "Brun-fauve",
    lienZodiacal: "Licorne/Tortue/Cerf/sirène",
    lienDivin: "Laran, Usil, Suvix",
    symbolique: "Protection, Courage",
    durete: "6+",
    notes: "Pierre de guérison"
  },
  "Agate (Jaspe multicolore)": {
    surnom: "Aurore",
    valeur: 0.08,
    couleur: "Marron/Bleu/Blanc/Rouge",
    lienZodiacal: "Papillon/Cerf/Dauphins/Ecrevisse/Epée/Nuage",
    lienDivin: "Thalma, Ulfer",
    symbolique: "Curiosité, Adaptabilité",
    durete: "6+",
    notes: "Pierre de bonheur, Pierre de paix"
  },
  "Obsidienne": {
    surnom: "",
    valeur: 0.07,
    couleur: "Multicolore",
    lienZodiacal: "Epée/Tortue/Ecrevisse/Sirène/Papillon/Paon/Phénix/Nuage",
    lienDivin: "Atonar, Turan, Shua",
    symbolique: "Espoir, Beauté, Arts",
    durete: 6,
    notes: "Pierre de prémonition"
  },
  "Serpentine": {
    surnom: "Laranite",
    valeur: 0.05,
    couleur: "Vert écaillé",
    lienZodiacal: "Sirène/Epée/Phénix/Ourlarque",
    lienDivin: "Laran, Usil, Voltumna",
    symbolique: "Introspection, Occultisme",
    durete: "5+",
    notes: "Pierre de siège, Pierre de sceaux, combustible"
  },
  "Malachite": {
    surnom: "",
    valeur: 0.03,
    couleur: "Vert écaillé",
    lienZodiacal: "Tortue/Papillon/Sirène/Dauphins",
    lienDivin: "Guyona, Llyr",
    symbolique: "Guérison, Force",
    durete: "2+ à 4",
    notes: "Pierre de sceau, talisman, Pierre des rêves"
  },
  "Ambre": {
    surnom: "Larmes d'Atona",
    valeur: 0.02,
    couleur: "Orange",
    lienZodiacal: "Paon/Cerf/Papillon/Ecrevisse/Tortue",
    lienDivin: "Atonar",
    symbolique: "Sérénité, Sagesse",
    durete: "2+",
    notes: "Pierre électrique, combustible"
  },
  "Perle": {
    surnom: "Larmes de Llyr",
    valeur: 104.17,
    couleur: "Blanc/Rose/Bleu/Noir",
    lienZodiacal: "Ecrevisse/Papillon/Epée/Dauphins",
    lienDivin: "Tilvir, Perun, Turan, Darona",
    symbolique: "Douceur, Pureté",
    durete: 3,
    notes: "Parreux, pigment rouge"
  },
  "Hématite": {
    surnom: "",
    valeur: 0.1,
    couleur: "Brun-rouge à noir métallique",
    lienZodiacal: "Paon/Sirène/Phénix/Epée",
    lienDivin: "Laran, Gibil, Suvix",
    symbolique: "Rigueur, Puissance",
    durete: 4,
    notes: "Protège les voyageurs et enfants, Pierre de fer"
  },
  "Corail": {
    surnom: "Sang de basaltik",
    valeur: 0.1,
    couleur: "Blanc/Jaune/Orange/Rouge",
    lienZodiacal: "Dauphins/Cerf/Ecrevisse",
    lienDivin: "Llyr, Ninmah, Guyona",
    symbolique: "Vigueur, Fertilité",
    durete: "3+",
    notes: "Pierre de protection, Pierre magique"
  },
  "Jais": {
    surnom: "Thanrite",
    valeur: 0.06,
    couleur: "Noir",
    lienZodiacal: "Ourlarque/Ecrevisse/Nuage",
    lienDivin: "Voltumna, Suvix",
    symbolique: "Richesse, Spiritualité",
    durete: "2-4",
    notes: "Pierre de protection, Pierre de deuil, combustible"
  },
  "Nacre": {
    surnom: "",
    valeur: 0.04,
    couleur: "Nacre",
    lienZodiacal: "Ecrevisse/Sirène/Nuage",
    lienDivin: "Tilvir, Llyr, Ninmah",
    symbolique: "Douceur, Intuition",
    durete: "2-4",
    notes: "Pierre d'apaisement"
  },
  "Ecaille": {
    surnom: "",
    valeur: 0.02,
    couleur: "Vert/Brun/Blanc",
    lienZodiacal: "Tortue/Ecrevisse/Sirène/Dauphins",
    lienDivin: "Thalma, Llyr, Tannun",
    symbolique: "Longévité, Sagesse",
    durete: "2+",
    notes: "Pierre d'endurance"
  }
};

// ===== SYNCHRONISATION DES DONNÉES =====
// Synchroniser les valeurs entre monnaies.gemmes et gemmesDetaillees
Object.keys(window.gemmesDetaillees).forEach(nom => {
  window.monnaies.gemmes[nom] = window.gemmesDetaillees[nom].valeur;
});

// ===== OBJETS COMBINÉS POUR COMPATIBILITÉ =====
window.objets = {
  ...window.monnaies.pieces,
  ...window.monnaies.gemmes
};

// Aplatir les objets poids pour compatibilité
Object.values(window.monnaies.poids).forEach(categorie => {
  Object.assign(window.objets, categorie);
});

// ===== CONFIGURATION DES UNITÉS =====
window.unitesConfig = {
  pieces: {
    nom: "PM", // Pièce Modèle
    label: "Valeur en PM",
    decimales: 2
  },
  gemmes: {
    nom: "PM", // Pièce Modèle
    label: "Valeur en PM", 
    decimales: 2
  },
  poids: {
    nom: "kg",
    label: "Poids en kg",
    decimales: 1
  }
};

// ===== FONCTIONS UTILITAIRES =====

/**
 * Obtient l'unité d'une catégorie
 * @param {string} categorie - La catégorie (pieces, gemmes, poids)
 * @returns {Object} Configuration de l'unité
 */
window.getUnite = function(categorie) {
  return window.unitesConfig[categorie] || { nom: "", label: "", decimales: 2 };
};

/**
 * Obtient toutes les catégories de poids
 * @returns {Array} Liste des catégories
 */
window.getCategoriesPoids = function() {
  return Object.keys(window.monnaies.poids);
};

/**
 * Obtient les objets d'une catégorie de poids
 * @param {string} categorie - Nom de la catégorie
 * @returns {Object} Objets de la catégorie
 */
window.getObjetsByCategorie = function(categorie) {
  return window.monnaies.poids[categorie] || {};
};

/**
 * Obtient le poids d'un objet
 * @param {string} nomObjet - Nom de l'objet
 * @returns {number} Poids de l'objet en kg
 */
window.getPoidsObjet = function(nomObjet) {
  for (const categorie of Object.values(window.monnaies.poids)) {
    if (categorie[nomObjet] !== undefined) {
      return categorie[nomObjet];
    }
  }
  return 0;
};

/**
 * Obtient les informations détaillées d'une gemme
 * @param {string} nomGemme - Nom de la gemme
 * @returns {Object|null} Détails de la gemme ou null
 */
window.getGemmeDetails = function(nomGemme) {
  return window.gemmesDetaillees[nomGemme] || null;
};

/**
 * Ajoute un nouvel objet personnalisé
 * @param {string} nom - Nom de l'objet
 * @param {number} poids - Poids en kg
 * @param {string} categorie - Catégorie (défaut: 'Objets Personnalisés')
 * @returns {boolean} Succès de l'ajout
 */
window.ajouterObjetPoids = function(nom, poids, categorie = 'Objets Personnalisés') {
  if (!nom || poids === undefined) {
    console.error('Nom et poids requis pour ajouter un objet');
    return false;
  }
  
  // Créer la catégorie si elle n'existe pas
  if (!window.monnaies.poids[categorie]) {
    window.monnaies.poids[categorie] = {};
  }
  
  window.monnaies.poids[categorie][nom] = parseFloat(poids);
  window.objets[nom] = parseFloat(poids);
  
  console.log(`Objet ajouté: ${nom} - ${poids} kg dans ${categorie}`);
  return true;
};

/**
 * Supprime un objet personnalisé
 * @param {string} nom - Nom de l'objet à supprimer
 * @returns {boolean} Succès de la suppression
 */
window.supprimerObjetPoids = function(nom) {
  for (const [categorieNom, objets] of Object.entries(window.monnaies.poids)) {
    if (objets[nom] !== undefined) {
      delete objets[nom];
      delete window.objets[nom];
      console.log(`Objet supprimé: ${nom} de ${categorieNom}`);
      return true;
    }
  }
  return false;
};

/**
 * Modifie le poids d'un objet
 * @param {string} nom - Nom de l'objet
 * @param {number} nouveauPoids - Nouveau poids en kg
 * @returns {boolean} Succès de la modification
 */
window.modifierObjetPoids = function(nom, nouveauPoids) {
  for (const objets of Object.values(window.monnaies.poids)) {
    if (objets[nom] !== undefined) {
      objets[nom] = parseFloat(nouveauPoids);
      window.objets[nom] = parseFloat(nouveauPoids);
      console.log(`Poids modifié: ${nom} - ${nouveauPoids} kg`);
      return true;
    }
  }
  return false;
};

/**
 * Valide la cohérence des données
 * @returns {Object} Rapport de validation
 */
window.validerDonnees = function() {
  const rapport = {
    erreurs: [],
    avertissements: [],
    statistiques: {
      pieces: Object.keys(window.monnaies.pieces).length,
      gemmes: Object.keys(window.monnaies.gemmes).length,
      categoriesPoids: Object.keys(window.monnaies.poids).length
    }
  };
  
  // Vérifier les valeurs négatives
  Object.entries(window.monnaies.pieces).forEach(([nom, valeur]) => {
    if (valeur < 0) {
      rapport.erreurs.push(`Valeur négative pour la pièce: ${nom}`);
    }
  });
  
  Object.entries(window.monnaies.gemmes).forEach(([nom, valeur]) => {
    if (valeur < 0) {
      rapport.erreurs.push(`Valeur négative pour la gemme: ${nom}`);
    }
  });
  
  // Vérifier la cohérence entre gemmes et gemmesDetaillees
  Object.keys(window.monnaies.gemmes).forEach(nom => {
    if (window.gemmesDetaillees[nom] && 
        window.gemmesDetaillees[nom].valeur !== window.monnaies.gemmes[nom]) {
      rapport.avertissements.push(`Incohérence de valeur pour ${nom}`);
    }
  });
  
  // Vérifier les gemmes manquantes dans gemmesDetaillees
  Object.keys(window.monnaies.gemmes).forEach(nom => {
    if (!window.gemmesDetaillees[nom]) {
      rapport.avertissements.push(`Détails manquants pour la gemme: ${nom}`);
    }
  });
  
  console.log('Validation des données:', rapport);
  return rapport;
};

/**
 * Recherche une gemme par nom ou surnom
 * @param {string} terme - Terme de recherche
 * @returns {Array} Liste des gemmes correspondantes
 */
window.rechercherGemme = function(terme) {
  const termeLower = terme.toLowerCase();
  const resultats = [];
  
  Object.entries(window.gemmesDetaillees).forEach(([nom, details]) => {
    if (nom.toLowerCase().includes(termeLower) ||
        (details.surnom && details.surnom.toLowerCase().includes(termeLower)) ||
        details.couleur.toLowerCase().includes(termeLower)) {
      resultats.push({
        nom: nom,
        details: details
      });
    }
  });
  
  return resultats;
};

/**
 * Obtient les gemmes par couleur
 * @param {string} couleur - Couleur recherchée
 * @returns {Array} Liste des gemmes de cette couleur
 */
window.getGemmesParCouleur = function(couleur) {
  const couleurLower = couleur.toLowerCase();
  const resultats = [];
  
  Object.entries(window.gemmesDetaillees).forEach(([nom, details]) => {
    if (details.couleur.toLowerCase().includes(couleurLower)) {
      resultats.push({
        nom: nom,
        details: details
      });
    }
  });
  
  return resultats.sort((a, b) => b.details.valeur - a.details.valeur);
};

/**
 * Obtient les gemmes par lien divin
 * @param {string} divinite - Nom de la divinité
 * @returns {Array} Liste des gemmes liées à cette divinité
 */
window.getGemmesParDivinite = function(divinite) {
  const diviniteLower = divinite.toLowerCase();
  const resultats = [];
  
  Object.entries(window.gemmesDetaillees).forEach(([nom, details]) => {
    if (details.lienDivin && details.lienDivin.toLowerCase().includes(diviniteLower)) {
      resultats.push({
        nom: nom,
        details: details
      });
    }
  });
  
  return resultats.sort((a, b) => b.details.valeur - a.details.valeur);
};

/**
 * Obtient les statistiques complètes
 * @returns {Object} Statistiques détaillées
 */
window.getStatistiques = function() {
  const stats = {
    pieces: {
      total: Object.keys(window.monnaies.pieces).length,
      valeurMax: Math.max(...Object.values(window.monnaies.pieces)),
      valeurMin: Math.min(...Object.values(window.monnaies.pieces)),
      valeurMoyenne: Object.values(window.monnaies.pieces).reduce((a, b) => a + b, 0) / Object.keys(window.monnaies.pieces).length
    },
    gemmes: {
      total: Object.keys(window.monnaies.gemmes).length,
      valeurMax: Math.max(...Object.values(window.monnaies.gemmes)),
      valeurMin: Math.min(...Object.values(window.monnaies.gemmes)),
      valeurMoyenne: Object.values(window.monnaies.gemmes).reduce((a, b) => a + b, 0) / Object.keys(window.monnaies.gemmes).length,
      parCouleur: {},
      parDurete: {}
    },
    poids: {
      categories: Object.keys(window.monnaies.poids).length,
      objetsTotal: Object.values(window.monnaies.poids).reduce((total, cat) => total + Object.keys(cat).length, 0)
    }
  };
  
  // Statistiques par couleur pour les gemmes
  Object.values(window.gemmesDetaillees).forEach(details => {
    const couleurs = details.couleur.split('/');
    couleurs.forEach(couleur => {
      const c = couleur.trim();
      stats.gemmes.parCouleur[c] = (stats.gemmes.parCouleur[c] || 0) + 1;
    });
  });
  
  // Statistiques par dureté pour les gemmes
  Object.values(window.gemmesDetaillees).forEach(details => {
    const durete = details.durete.toString();
    stats.gemmes.parDurete[durete] = (stats.gemmes.parDurete[durete] || 0) + 1;
  });
  
  return stats;
};

/**
 * Exporte toutes les données au format JSON
 * @returns {string} Données au format JSON
 */
window.exporterDonnees = function() {
  const donnees = {
    version: "2.1",
    dateExport: new Date().toISOString(),
    monnaies: window.monnaies,
    gemmesDetaillees: window.gemmesDetaillees,
    statistiques: window.getStatistiques()
  };
  
  return JSON.stringify(donnees, null, 2);
};

/**
 * Importe des données depuis un JSON
 * @param {string} jsonData - Données JSON à importer
 * @returns {boolean} Succès de l'import
 */
window.importerDonnees = function(jsonData) {
  try {
    const donnees = JSON.parse(jsonData);
    
    if (donnees.monnaies) {
      window.monnaies = donnees.monnaies;
    }
    
    if (donnees.gemmesDetaillees) {
      window.gemmesDetaillees = donnees.gemmesDetaillees;
    }
    
    // Resynchroniser
    Object.keys(window.gemmesDetaillees).forEach(nom => {
      window.monnaies.gemmes[nom] = window.gemmesDetaillees[nom].valeur;
    });
    
    // Reconstruire objets combinés
    window.objets = {
      ...window.monnaies.pieces,
      ...window.monnaies.gemmes
    };
    
    Object.values(window.monnaies.poids).forEach(categorie => {
      Object.assign(window.objets, categorie);
    });
    
    console.log('✅ Données importées avec succès');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'import:', error);
    return false;
  }
};

// ===== INITIALISATION ET VALIDATION =====
console.log('📊 Base de données corrigée et complète chargée');
console.log(`💰 ${Object.keys(window.monnaies.pieces).length} monnaies`);
console.log(`💎 ${Object.keys(window.monnaies.gemmes).length} gemmes`);
console.log(`⚖️ ${Object.keys(window.monnaies.poids).length} catégories de poids`);

// Validation automatique au chargement
setTimeout(() => {
  const validation = window.validerDonnees();
  if (validation.erreurs.length === 0) {
    console.log('✅ Toutes les données sont cohérentes');
  } else {
    console.warn('⚠️ Erreurs détectées:', validation.erreurs);
  }
  
  if (validation.avertissements.length > 0) {
    console.info('ℹ️ Avertissements:', validation.avertissements);
  }
}, 100);

// ===== INFORMATIONS DE DEBUG =====
window.debugGemmes = function() {
  console.log('=== DEBUG GEMMES ===');
  console.log('Gemmes les plus chères:');
  Object.entries(window.monnaies.gemmes)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .forEach(([nom, valeur]) => {
      console.log(`  ${nom}: ${valeur} PM`);
    });
  
  console.log('Couleurs disponibles:');
  const couleurs = new Set();
  Object.values(window.gemmesDetaillees).forEach(details => {
    details.couleur.split('/').forEach(c => couleurs.add(c.trim()));
  });
  console.log(`  ${Array.from(couleurs).sort().join(', ')}`);
  
  console.log('Divinités liées:');
  const divinites = new Set();
  Object.values(window.gemmesDetaillees).forEach(details => {
    if (details.lienDivin) {
      details.lienDivin.split(',').forEach(d => divinites.add(d.trim()));
    }
  });
  console.log(`  ${Array.from(divinites).sort().join(', ')}`);
};

// ===== CONTRÔLE DE QUALITÉ =====
window.verifierCoherence = function() {
  console.log('🔍 Vérification de la cohérence des données...');
  
  let erreurs = 0;
  
  // Vérifier que toutes les gemmes dans monnaies.gemmes ont des détails
  Object.keys(window.monnaies.gemmes).forEach(nom => {
    if (!window.gemmesDetaillees[nom]) {
      console.error(`❌ Gemme sans détails: ${nom}`);
      erreurs++;
    }
  });
  
  // Vérifier que toutes les gemmes détaillées sont dans monnaies.gemmes
  Object.keys(window.gemmesDetaillees).forEach(nom => {
    if (window.monnaies.gemmes[nom] === undefined) {
      console.error(`❌ Détails sans gemme correspondante: ${nom}`);
      erreurs++;
    }
  });
  
  // Vérifier la cohérence des valeurs
  Object.entries(window.gemmesDetaillees).forEach(([nom, details]) => {
    if (window.monnaies.gemmes[nom] !== details.valeur) {
      console.error(`❌ Valeur incohérente pour ${nom}: ${window.monnaies.gemmes[nom]} vs ${details.valeur}`);
      erreurs++;
    }
  });
  
  if (erreurs === 0) {
    console.log('✅ Toutes les données sont cohérentes !');
  } else {
    console.log(`❌ ${erreurs} erreur(s) détectée(s)`);
  }
  
  return erreurs === 0;
};

// Vérification automatique
setTimeout(() => {
  window.verifierCoherence();
}, 200);
