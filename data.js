// ===== BASE DE DONNÉES UNIFIÉE DES MONNAIES ET GEMMES =====

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
    
    // GEMMES UNIFIÉES - VALEURS LES PLUS PETITES CONSERVÉES
    gemmes: {
      "Perle": 10.000,
      "Rubis": 8.000,
      "Emeraude": 7.000,
      "Saphir": 6.000,
      "Topaze": 5.000,
      "Aigue-Marine": 4.000,
      "Améthyste": 3.000,
      "Grenat": 2.000,
      "Péridot": 1.500,
      "Cyanite": 1.400,
      "Citrine": 1.300,
      "Pierre de Lune": 1.200,
      "Pierre de Soleil": 1.100,
      "Tourmaline": 1.000,
      "Diamant": 1.000, // Valeur la plus petite conservée
      "Aventurine": 90,
      "Turquoise": 85,
      "Œil de loup (Chrysobéryl)": 80,
      "Œil de taureau (Quartz brun)": 70,
      "Œil de tigre (Quartz brun)": 60,
      "Œil de faucon (Quartz bleu)": 50,
      "Quartz fumé": 40,
      "Quartz rose": 30,
      "Cristal (Quartz incolore)": 20,
      "Lapis Lazuli": 18,
      "Jais (Jaspe noir)": 17,
      "Onyxline (Jaspe rouge)": 15,
      "Chrysoprase (Jaspe vert)": 12,
      "Ambre": 11,
      "Corail": 10,
      "Sardoine (Jaspe brun)": 9,
      "Agate (Jaspe multicolore)": 8,
      "Obsidienne": 7,
      "Jais": 6,
      "Serpentine": 5,
      "Nacre": 4,
      "Malachite": 3,
      "Hématite": 2,
      "Ecaille": 2
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

// ===== BASE DE DONNÉES COMPLÈTE DES GEMMES AVEC TOUTES LES INFORMATIONS =====
window.gemmesDetaillees = {
  "Rubis": {
    surnom: "Escarboucle",
    valeur: 8.000,
    couleur: "Rouge",
    lienZodiacal: "Sirène/Ecrevisse",
    lienDivin: "Perun, Gibil",
    symbolique: "Volonté, Courage",
    durete: 9,
    notes: "Pierre de protection"
  },
  "Emeraude": {
    surnom: "Turanite",
    valeur: 7.000,
    couleur: "Vert",
    lienZodiacal: "Cerf/Tortue",
    lienDivin: "Turan, Arcton",
    symbolique: "Renaissance, Sagesse",
    durete: 8,
    notes: "Pierre de fortification"
  },
  "Saphir": {
    surnom: "Werunite",
    valeur: 6.000,
    couleur: "Bleu",
    lienZodiacal: "Nuage/Tortue/Phénix/Epée/Dauphins",
    lienDivin: "Weru, Tannun, Shua",
    symbolique: "Justice, Pureté, Liberté",
    durete: 9,
    notes: "Pierre céleste"
  },
  "Diamant": {
    surnom: "Pierre des fous",
    valeur: 1.000, // Valeur la plus petite conservée
    couleur: "Incolore",
    lienZodiacal: "Paon/Licorne/Ourlarque",
    lienDivin: "Usil, Atonar, Laran",
    symbolique: "Invincible, Constance",
    durete: 10,
    notes: "Protège contre la folie"
  },
  "Topaze": {
    surnom: "",
    valeur: 5.000,
    couleur: "Jaune/Bleu/Rose",
    lienZodiacal: "Sirène/Phénix/Papillon/Ecrevisse/Tortue/Dauphins/Cerf/Epée",
    lienDivin: "Tannun",
    symbolique: "Gaité, Energie",
    durete: 8,
    notes: "Pierre de soin"
  },
  "Aigue-Marine": {
    surnom: "Llyrite",
    valeur: 4.000,
    couleur: "Bleu pâle",
    lienZodiacal: "Dauphins/Tortue/Sirène/Nuage/Ourlarque/Epée/Papillon/Epée",
    lienDivin: "Llyr, Tannun, Ulfer",
    symbolique: "Sensibilité, Persévérance",
    durete: 8,
    notes: "Protège les marins"
  },
  "Améthyste": {
    surnom: "Pérunite",
    valeur: 3.000,
    couleur: "Violet",
    lienZodiacal: "Phénix/Ourlarque/Licorne/Epée/Sirène/Nuage/Dauphins/Cerf",
    lienDivin: "Perun, Arcton, Ninmah",
    symbolique: "Sagesse, Equilibre",
    durete: 7,
    notes: "Pierre d'apaisement, protège des poisons"
  },
  "Grenat": {
    surnom: "Usilite",
    valeur: 2.000,
    couleur: "Rouge/Pourpre/Violet",
    lienZodiacal: "Ourlarque/Sirène/Tortue/Phénix/Epée",
    lienDivin: "Usil",
    symbolique: "Force, Charisme",
    durete: 7,
    notes: "Pierre d'armure, Pierre de lumière"
  },
  "Péridot": {
    surnom: "Turmite",
    valeur: 1.500,
    couleur: "Vert",
    lienZodiacal: "Tortue/Cerf/Paon/Epée/Sirène/Ourlarque",
    lienDivin: "Turina",
    symbolique: "Equilibre, Fidélité, Chance",
    durete: 7,
    notes: "Pierre de la paladin Pierre de protection"
  },
  "Cyanite": {
    surnom: "",
    valeur: 1.400,
    couleur: "Bleu",
    lienZodiacal: "Epée/Ourlarque/Tortue/Phénix/Dauphins/Cerf/Licorne",
    lienDivin: "Shua",
    symbolique: "Dextérité, Paix",
    durete: "4-6+",
    notes: "Sort de boussole"
  },
  "Citrine": {
    surnom: "",
    valeur: 1.300,
    couleur: "Jaune",
    lienZodiacal: "Papillon/Paon/Ourlarque/Nuage/Sirène/Epée",
    lienDivin: "Thalma, Arcton",
    symbolique: "Vitalité, Joie, Arts",
    durete: 7,
    notes: "Pierre de lumière, protection contre le vent"
  },
  "Pierre de Lune": {
    surnom: "Tilvrite",
    valeur: 1.200,
    couleur: "Lait et reflets bleus",
    lienZodiacal: "Ecrevisse/Papillon/Dauphins/Epée/Sirène/Tortue/Nuage/Ourlarque",
    lienDivin: "Tilvir, Darona",
    symbolique: "Imagination, Pureté",
    durete: "6+",
    notes: '"Œil de poisson", Pierre de pluie'
  },
  "Pierre de Soleil": {
    surnom: "Atonarite",
    valeur: 1.100,
    couleur: "Doré pailleté",
    lienZodiacal: "Paon/Sirène/Licorne",
    lienDivin: "Atonar, Palustris",
    symbolique: "Richesse, Jouvence",
    durete: "6+",
    notes: "Pierre d'orientation, Pierre de lumière"
  },
  "Tourmaline": {
    surnom: "",
    valeur: 1.000,
    couleur: "Rose/Vert/Bleu/Noir",
    lienZodiacal: "Tortue/Ourlarque/Papillon/Tortue/Cerf/Ecrevisse",
    lienDivin: "Turan",
    symbolique: "Quiétude, Protection",
    durete: "7+",
    notes: "Pierre électrique, Pierre de bouclier"
  },
  "Aventurine": {
    surnom: "Pierre du destin",
    valeur: 90,
    couleur: "Vert",
    lienZodiacal: "Cerf/Papillon/Phénix/Epée/Ecrevisse",
    lienDivin: "Usil, Narax",
    symbolique: "Harmonie, Prospérité",
    durete: "6+",
    notes: "Pierre de chance"
  },
  "Turquoise": {
    surnom: "Pierre des dieux",
    valeur: 85,
    couleur: "Bleu-vert",
    lienZodiacal: "Phénix/Nuage/Dauphins/Cerf/Sirène/Epée/Tortue",
    lienDivin: "Perun, Thalma, Weru",
    symbolique: "Communication, Energie",
    durete: "5+",
    notes: "Pierre de piété, Protège les voyageurs"
  },
  "Œil de loup (Chrysobéryl)": {
    surnom: "Ulférite",
    valeur: 80,
    couleur: "Jaune-doré",
    lienZodiacal: "Tortue/Epée",
    lienDivin: "Ulfer",
    symbolique: "Sang-froid, Abondance",
    durete: "8+",
    notes: "Protège les survivants"
  },
  "Œil de taureau (Quartz brun)": {
    surnom: "",
    valeur: 70,
    couleur: "Jaune-rouge",
    lienZodiacal: "Cerf",
    lienDivin: "Turan, Ulfer, Ninmah",
    symbolique: "Courage, Fermeté",
    durete: 7,
    notes: "Apporte le succès aux sports"
  },
  "Œil de tigre (Quartz brun)": {
    surnom: "",
    valeur: 60,
    couleur: "Orange",
    lienZodiacal: "Paon/Papillon/Ecrevisse/Epée/Tortue/Licorne/Cerf/Papillon",
    lienDivin: "Narax, Arcton, Weru, Laran",
    symbolique: "Liberté, Largesse",
    durete: 7,
    notes: "Protège les guerriers"
  },
  "Œil de faucon (Quartz bleu)": {
    surnom: "",
    valeur: 50,
    couleur: "Gris-bleu",
    lienZodiacal: "Papillon/Nuage/Ourlarque/",
    lienDivin: "Thalma, Palustris, Narax",
    symbolique: "Empathie, Evolution",
    durete: 7,
    notes: "Pierre de vision, Pierre de protection"
  },
  "Quartz fumé": {
    surnom: "",
    valeur: 40,
    couleur: "Brun",
    lienZodiacal: "Ourlarque/Sirène/Tortue/Epée/Phénix",
    lienDivin: "Usil, Voltumna, Narax",
    symbolique: "Eveil, Volonté",
    durete: 7,
    notes: "Pierre de protection, Pierre de clairvoyance"
  },
  "Quartz rose": {
    surnom: "Pierre du cœur",
    valeur: 30,
    couleur: "Rose",
    lienZodiacal: "Cerf/Epée/Nuage/Ourlarque",
    lienDivin: "Turan, Tannun",
    symbolique: "Calme, Tendresse",
    durete: 7,
    notes: "Pierre d'amour, Pierre de beauté"
  },
  "Cristal (Quartz incolore)": {
    surnom: "",
    valeur: 20,
    couleur: "Incolore",
    lienZodiacal: "Ourlarque",
    lienDivin: "Usil, Darona, Palustris",
    symbolique: "Clairvoyance, Méditatif",
    durete: 7,
    notes: "Amplificateur"
  },
  "Lapis Lazuli": {
    surnom: "Pierre de vérité",
    valeur: 18,
    couleur: "Bleu",
    lienZodiacal: "Nuage/Licorne/Papillon/Paon/Epée/Tortue/Phénix/Dauphins/Cerf",
    lienDivin: "Weru, Ulfer",
    symbolique: "Honnêteté, Intuition",
    durete: "5+",
    notes: "Pierre d'amitié"
  },
  "Jais (Jaspe noir)": {
    surnom: "",
    valeur: 17,
    couleur: "Noir",
    lienZodiacal: "Ourlarque/Paon/Tortue",
    lienDivin: "Llyr, Voltumna, Guyona",
    symbolique: "Durisme, Maîtrise",
    durete: "6-",
    notes: "Pierre des ténèbres, Pierre des secrets"
  },
  "Onyxline (Jaspe rouge)": {
    surnom: "Corne",
    valeur: 15,
    couleur: "Rouge/Orange",
    lienZodiacal: "Sirène/Cerf/Tortue/Ecrevisse/Licorne/Paon/Epée",
    lienDivin: "Gibil, Arcton",
    symbolique: "Vitalité, Initiative",
    durete: "6+",
    notes: "Pierre de résilience"
  },
  "Chrysoprase (Jaspe vert)": {
    surnom: "",
    valeur: 12,
    couleur: "Vert",
    lienZodiacal: "Cerf/Epée/Ecrevisse",
    lienDivin: "Guyona",
    symbolique: "Compassion, Clairvoyance",
    durete: "6+",
    notes: "Pierre de sceau, protège du venin, Invisibilité"
  },
  "Sardoine (Jaspe brun)": {
    surnom: "",
    valeur: 9,
    couleur: "Brun-fauve",
    lienZodiacal: "Licorne/Tortue/Cerf/sirène",
    lienDivin: "Laran, Usil, Suvix",
    symbolique: "Protection, Courage",
    durete: "6+",
    notes: "Pierre de guérison"
  },
  "Agate (Jaspe multicolore)": {
    surnom: "Aurore",
    valeur: 8,
    couleur: "Marron/Bleu/Blanc/Rouge",
    lienZodiacal: "Papillon/Cerf/Dauphins/Ecrevisse/Epée/Nuage",
    lienDivin: "Thalma, Ulfer",
    symbolique: "Curiosité, Adaptabilité",
    durete: "6+",
    notes: "Pierre de bonheur, Pierre de paix"
  },
  "Obsidienne": {
    surnom: "",
    valeur: 7,
    couleur: "Multicolore",
    lienZodiacal: "Epée/Tortue/Ecrevisse/Sirène/Papillon/Paon/Phénix/Nuage",
    lienDivin: "Atonar, Turan, Shua",
    symbolique: "Espoir, Beauté, Arts",
    durete: 6,
    notes: "Pierre de prémonition"
  },
  "Serpentine": {
    surnom: "Laranite",
    valeur: 5,
    couleur: "Vert",
    lienZodiacal: "Sirène/Epée/Phénix/Ourlarque",
    lienDivin: "Laran, Usil, Voltumna",
    symbolique: "Introspection, Occultisme",
    durete: "5+",
    notes: "Pierre de siège, Pierre de sceaux, combustible"
  },
  "Malachite": {
    surnom: "",
    valeur: 3,
    couleur: "Vert écaillé",
    lienZodiacal: "Tortue/Papillon/Sirène/Dauphins",
    lienDivin: "Guyona, Llyr",
    symbolique: "Guérison, Force",
    durete: "2+ à 4",
    notes: "Pierre de sceau, talisman, Pierre des rêves"
  },
  "Hématite": {
    surnom: "",
    valeur: 2,
    couleur: "Vert sombre",
    lienZodiacal: "Paon/Sirène/Phénix/Epée",
    lienDivin: "Tannun",
    symbolique: "Protection, Jouvence",
    durete: 4,
    notes: "Protège les voyageurs et enfants, Pierre de fer"
  },
  "Perle": {
    surnom: "Larmes de Llyr",
    valeur: 10.000,
    couleur: "Blanc/Rose/Bleu/Noir",
    lienZodiacal: "Ecrevisse/Papillon/Epée/Dauphins",
    lienDivin: "Tilvir, Perun, Turan, Darona",
    symbolique: "Douceur, Pureté",
    durete: 3,
    notes: "Parreux, pigment rouge"
  },
  "Ambre": {
    surnom: "Larmes d'Atona",
    valeur: 11,
    couleur: "Orange",
    lienZodiacal: "Paon/Cerf/Papillon/Ecrevisse/Tortue",
    lienDivin: "Atonar",
    symbolique: "Sérénité, Sagesse",
    durete: "2+",
    notes: "Pierre électrique, combustible"
  },
  "Corail": {
    surnom: "Sang de basaltik",
    valeur: 10,
    couleur: "Blanc/Jaune/Orange/Rouge/",
    lienZodiacal: "Dauphins/Cerf/Ecrevisse",
    lienDivin: "Llyr, Ninmah, Guyona",
    symbolique: "Vigueur, Fertilité",
    durete: "3+",
    notes: "Pierre de protection, Pierre magique"
  },
  "Jais": {
    surnom: "Thanrite",
    valeur: 6,
    couleur: "Noir",
    lienZodiacal: "Ourlarque/Ecrevisse/Nuage",
    lienDivin: "Voltumna, Suvix",
    symbolique: "Richesse, Spiritualité",
    durete: "2-4",
    notes: "Pierre de protection, Pierre de deuil, combustible"
  },
  "Nacre": {
    surnom: "",
    valeur: 4,
    couleur: "Nacre",
    lienZodiacal: "Ecrevisse/Sirène/Nuage",
    lienDivin: "Tilvir, Llyr, Ninmah",
    symbolique: "Douceur, Intuition",
    durete: "2-4",
    notes: "Pierre d'apaisement"
  },
  "Ecaille": {
    surnom: "",
    valeur: 2,
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
  
  console.log('Validation des données:', rapport);
  return rapport;
};

// ===== INITIALISATION ET VALIDATION =====
console.log('📊 Base de données unifiée chargée');
console.log(`💰 ${Object.keys(window.monnaies.pieces).length} monnaies`);
console.log(`💎 ${Object.keys(window.monnaies.gemmes).length} gemmes`);
console.log(`⚖️ ${Object.keys(window.monnaies.poids).length} catégories de poids`);

// Validation automatique au chargement
setTimeout(() => {
  window.validerDonnees();
}, 100);
