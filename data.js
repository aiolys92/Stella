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
    
    // GEMMES - VALEURS CORRIGÉES SELON LE TABLEAU EXCEL
    gemmes: {
      "Rubis": 83.3333,
      "Emeraude": 72.9167,
      "Saphir": 62.5,
      "Diamant": 62.5,
      "Topaze": 52.0833,
      "Aigue-Marine": 41.6667,
      "Améthyste": 31.25,
      "Grenat": 20.8333,
      "Péridot": 15.625,
      "Cyanite": 14.5833,
      "Citrine": 12.5,
      "Pierre de Lune": 12.5,
      "Pierre de Soleil": 10.4167,
      "Tourmaline": 10.4167,
      "Aventurine": 0.9375,
      "Turquoise": 0.8333,
      "Œil de loup (Chrysobéryl)": 0.8333,
      "Œil de taureau (Quartz brun)": 0.7812,
      "Œil de tigre (Quartz orange)": 0.7292,
      "Œil de faucon (Quartz bleu)": 0.625,
      "Morion (Quartz fumé)": 0.4167,
      "Rhodite (Quartz rose)": 0.3125,
      "Cristal (Quartz incolore)": 0.2083,
      "Lapis Lazuli": 0.1875,
      "Onyx (Jaspe noir)": 0.1771,
      "Cornaline (Jaspe rouge)": 0.1562,
      "Chrysoprase (Jaspe vert)": 0.125,
      "Sardoine (Jaspe brun)": 0.0938,
      "Agate (Jaspe multicolore)": 0.0833,
      "Opale": 0.0729,
      "Obsidienne": 0.0521,
      "Serpentine": 0.0417,
      "Malachite": 0.0208,
      "Hématite": 0.0208,
      "Perle": 104.1667,
      "Ambre": 0.1146,
      "Corail": 0.1042,
      "Jais": 0.0417,
      "Nacre": 0.0417,
      "Ecaille": 0.0208
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

// ===== BASE DE DONNÉES DÉTAILLÉE DES GEMMES SELON LE TABLEAU EXCEL =====
window.gemmesDetaillees = {
  "Rubis": {
    surnom: "Escarboucle",
    valeur: 83.3333,
    couleur: "Rouge",
    lienZodiacal: "Sirène/Ecrevisse",
    lienDivin: "Perun, Gibil",
    symbolique: "Volonté, Courage",
    durete: 9,
    notes: "Pierre de protection"
  },
  "Emeraude": {
    surnom: "Turanite",
    valeur: 72.9167,
    couleur: "Vert",
    lienZodiacal: "Cerf/Tortue",
    lienDivin: "Turan, Arcton",
    symbolique: "Renaissance, Sagesse",
    durete: 9,
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
    valeur: 62.5,
    couleur: "Incolore",
    lienZodiacal: "Paon/Licorne",
    lienDivin: "Usil, Atonar, Laran",
    symbolique: "Invincibilité, Constance",
    durete: 10,
    notes: "Protège contre la folie"
  },
  "Topaze": {
    surnom: "",
    valeur: 52.0833,
    couleur: "Jaune/Bleu/Rose",
    lienZodiacal: "Sirène/Phénix/Papillon/Ecrevisse/Tortue/Dauphins/Cerf/Epée",
    lienDivin: "Tannun",
    symbolique: "Gaité, Énergie",
    durete: 8,
    notes: "Pierre de soin"
  },
  "Aigue-Marine": {
    surnom: "Llyrite",
    valeur: 41.6667,
    couleur: "Bleu pâle",
    lienZodiacal: "Dauphins/Tortue/Sirène/Nuage/Ouréarque/Epée/Papillon/Epée",
    lienDivin: "Llyr, Tannun, Ulfer",
    symbolique: "Sensibilité, Persévérance",
    durete: 7,
    notes: "Protège les marins"
  },
  "Améthyste": {
    surnom: "Pérunite",
    valeur: 31.25,
    couleur: "Violet",
    lienZodiacal: "Phénix/Ouréarque/Licorne/Epée/Sirène/Nuage/Dauphins/Tortu",
    lienDivin: "Perun, Arcton, Ninmah",
    symbolique: "Sagesse, Equilibre",
    durete: 7,
    notes: "Pierre d'apaisement, protège des poisons"
  },
  "Grenat": {
    surnom: "Usilite",
    valeur: 20.8333,
    couleur: "Rouge/Pourpre/Violet",
    lienZodiacal: "Ouréarque/Sirène/Tortue/Phénix/Epée",
    lienDivin: "Usil",
    symbolique: "Force, Charisme",
    durete: 7,
    notes: "Pierre d'armure, Pierre de lumière"
  },
  "Péridot": {
    surnom: "Turmisite",
    valeur: 15.625,
    couleur: "Vert",
    lienZodiacal: "Tortue/Cerf/Paon/Epée/Sirène/Ouréarque",
    lienDivin: "Thalna",
    symbolique: "Equilibre, Fidélité, Cha",
    durete: 7,
    notes: "Pierre des paladins Pierre de protection"
  },
  "Cyanite": {
    surnom: "",
    valeur: 14.5833,
    couleur: "Bleu",
    lienZodiacal: "Epée/Ouréarque/Tortue/Phénix/Dauphins/Cerf/Licorne",
    lienDivin: "Shua",
    symbolique: "Dextérité, Paix",
    durete: "4-6+",
    notes: "Sert de boussole"
  },
  "Citrine": {
    surnom: "",
    valeur: 12.5,
    couleur: "Jaune",
    lienZodiacal: "Papillon/Paon/Ouréarque/Nuage/Sirène/Epée",
    lienDivin: "Thalna, Arcton",
    symbolique: "Vitalité, Joie, Arts",
    durete: 7,
    notes: "Pierre de lumière, protection contre le venir"
  },
  "Pierre de Lune": {
    surnom: "Tivirite",
    valeur: 12.5,
    couleur: "Lait à reflets bleus",
    lienZodiacal: "Sirène/Ecrevisse/Papillon/Dauphins/Epée/Sirène/Tortue/Nuage/Ouréarque",
    lienDivin: "Tivir, Damona",
    symbolique: "Imagination, Pureté",
    durete: "6+",
    notes: '"Œil de poisson", Pierre de pluie'
  },
  "Pierre de Soleil": {
    surnom: "Atonarite",
    valeur: 10.4167,
    couleur: "Orange",
    lienZodiacal: "Ecrevisse/Paon",
    lienDivin: "Atonar, Palustris",
    symbolique: "Richesse, Jouvence",
    durete: 6,
    notes: "Pierre de résilience"
  },
  "Tourmaline": {
    surnom: "",
    valeur: 10.4167,
    couleur: "Rose/Vert/Bleu/Noir",
    lienZodiacal: "Ouréarque/Papillon/Tortue/Cerf/Ecrevisse",
    lienDivin: "Turan",
    symbolique: "Quiétude, Protection",
    durete: "7+",
    notes: "Pierre électrique, Pierre de bouclier"
  },
  "Aventurine": {
    surnom: "Pierre du destin",
    valeur: 0.9375,
    couleur: "Vert",
    lienZodiacal: "Cerf/Papillon/Phénix/Epée/Ecrevisse",
    lienDivin: "Usil, Narax",
    symbolique: "Harmonie, Prospérité",
    durete: "6+",
    notes: "Pierre de chance"
  },
  "Turquoise": {
    surnom: "Pierre des dieux",
    valeur: 0.8333,
    couleur: "Bleu-vert",
    lienZodiacal: "Perun, Thalna, Weru",
    lienDivin: "Perun, Thalna, Weru",
    symbolique: "Protection, Énergie",
    durete: 7,
    notes: "Pierre de piété, Protège les voyageurs"
  },
  "Œil de loup (Chrysobéryl)": {
    surnom: "Ulferite",
    valeur: 0.8333,
    couleur: "Jaune-doré",
    lienZodiacal: "Tortue/Epée",
    lienDivin: "Ulfer",
    symbolique: "Sang-froid, Abondance",
    durete: "8+",
    notes: "Protège les survivants"
  },
  "Œil de taureau (Quartz brun)": {
    surnom: "",
    valeur: 0.7812,
    couleur: "Brun-rouge",
    lienZodiacal: "Cerf",
    lienDivin: "Turan, Ulfer, Nimnah",
    symbolique: "Courage, Fertilité",
    durete: 7,
    notes: "Appréciée des esprits"
  },
  "Œil de tigre (Quartz orange)": {
    surnom: "",
    valeur: 0.7292,
    couleur: "Orange",
    lienZodiacal: "Paon/Papillon/Ecrevisse/Epée/Tortue/Licorne/Cerf/Papillon",
    lienDivin: "Narax, Atonar, Weru, Laran",
    symbolique: "Liberté, Largesse",
    durete: 7,
    notes: "Protège les guerriers"
  },
  "Œil de faucon (Quartz bleu)": {
    surnom: "",
    valeur: 0.625,
    couleur: "Gris-bleu",
    lienZodiacal: "Papillon/Nuage/Ouréarque",
    lienDivin: "Thalna, Palustris, Narax",
    symbolique: "Empathie, Evolution",
    durete: 7,
    notes: "Pierre de vision, Pierre de protection"
  },
  "Morion (Quartz fumé)": {
    surnom: "",
    valeur: 0.4167,
    couleur: "Brun",
    lienZodiacal: "Ouréarque/Sirène/Paon/Epée/Phénix",
    lienDivin: "Usil, Voltumna, Narax",
    symbolique: "Eveil, Volonté",
    durete: 7,
    notes: "Pierre de protection, Pierre de clairvoyance"
  },
  "Rhodite (Quartz rose)": {
    surnom: "Pierre du cœur",
    valeur: 0.3125,
    couleur: "Rose",
    lienZodiacal: "Cerf/Epée/Nuage/Ouréarque",
    lienDivin: "Turan, Tannun",
    symbolique: "Calme, Tendresse",
    durete: 7,
    notes: "Pierre d'amour, Pierre de beauté"
  },
  "Cristal (Quartz incolore)": {
    surnom: "",
    valeur: 0.2083,
    couleur: "Incolore",
    lienZodiacal: "Paon/Epée",
    lienDivin: "Usil, Damona, Palustris",
    symbolique: "Clairvoyance, Méditation",
    durete: 7,
    notes: "Amplification"
  },
  "Lapis Lazuli": {
    surnom: "Pierre de vérité",
    valeur: 0.1875,
    couleur: "Bleu",
    lienZodiacal: "Nuage/Licorne/Papillon/Paon/Epée/Tortue/Phénix/Dauphins/Cerf",
    lienDivin: "Weru, Ulfer",
    symbolique: "Honnêteté, Intuition",
    durete: 5,
    notes: "Pierre d'amitié"
  },
  "Onyx (Jaspe noir)": {
    surnom: "Griffe",
    valeur: 0.1771,
    couleur: "Noir",
    lienZodiacal: "Licorne",
    lienDivin: "Llyr, Voltumna, Guyone",
    symbolique: "Onirisme, Maîtrise de soi",
    durete: 6,
    notes: "Pierre des fantômes, Pierre des secrets"
  },
  "Cornaline (Jaspe rouge)": {
    surnom: "",
    valeur: 0.1562,
    couleur: "Rouge/Orange",
    lienZodiacal: "Sirène/Cerf/Tortue/Ecrevisse/Licorne/Paon/Epée",
    lienDivin: "Gibil, Arcton",
    symbolique: "Vitalité, Initiative",
    durete: "6+",
    notes: "Pierre de résilience"
  },
  "Chrysoprase (Jaspe vert)": {
    surnom: "",
    valeur: 0.125,
    couleur: "Vert",
    lienZodiacal: "Ouréarque/Paon/Tortue",
    lienDivin: "Guyone",
    symbolique: "Compassion, Clairvoyance",
    durete: "6+",
    notes: "Pierre de sceau, protège du venin, Invisibilité"
  },
  "Sardoine (Jaspe brun)": {
    surnom: "",
    valeur: 0.0938,
    couleur: "Brun-fauve",
    lienZodiacal: "Licorne/Tortue/Cerf/Sirène",
    lienDivin: "Laran, Usil, Suvix",
    symbolique: "Protection, Courage",
    durete: 6,
    notes: "Pierre de guérison, Pierre de puissance"
  },
  "Agate (Jaspe multicolore)": {
    surnom: "Aurore",
    valeur: 0.0833,
    couleur: "Multicolores",
    lienZodiacal: "Epée/Tortue/Ecrevisse/Sirène/Papillon/Paon/Phénix/Nuage",
    lienDivin: "Thalna, Ulfer",
    symbolique: "Curiosité, Adaptabilité",
    durete: "5+",
    notes: "Pierre de bonheur, Pierre de paix"
  },
  "Opale": {
    surnom: "",
    valeur: 0.0729,
    couleur: "Multicolores",
    lienZodiacal: "",
    lienDivin: "Atonar, Turan, Shua",
    symbolique: "Espoir, Beauté, Arts",
    durete: "5+",
    notes: "Pierre de prémonition"
  },
  "Obsidienne": {
    surnom: "Laranite",
    valeur: 0.0521,
    couleur: "Noir",
    lienZodiacal: "Sirène/Epée/Phénix/Ouréarque",
    lienDivin: "Laran, Usil, Voltumna",
    symbolique: "Introspection, Occultisme",
    durete: "5+",
    notes: "Pierre de siège, Pierre de sceaux, combustile"
  },
  "Serpentine": {
    surnom: "",
    valeur: 0.0417,
    couleur: "Vert écaillé",
    lienZodiacal: "Paon/Sirène/Dauphins",
    lienDivin: "Guyone, Llyr",
    symbolique: "Guérison, Force",
    durete: "4-4+",
    notes: "Ferreux, pigment rouge"
  },
  "Malachite": {
    surnom: "",
    valeur: 0.0208,
    couleur: "Vert sombre",
    lienZodiacal: "",
    lienDivin: "Tannun",
    symbolique: "Protection, Jouvence",
    durete: 4,
    notes: "Protège les voyageurs et enfants, Pierre de santé"
  },
  "Hématite": {
    surnom: "",
    valeur: 0.0208,
    couleur: "Brun-noir à noir métallique",
    lienZodiacal: "Licorne",
    lienDivin: "Laran, Gibil, Suvix",
    symbolique: "Rigueur, Persévérance",
    durete: 4,
    notes: "Ferreux, pigment rouge"
  },
  "Perle": {
    surnom: "Larmes de Llyr",
    valeur: 104.1667,
    couleur: "Rose/Bleu/Noir",
    lienZodiacal: "Ecrevisse/Papillon/Epée/Dauphins",
    lienDivin: "Tivir, Perun, Turan, Damona",
    symbolique: "Pouvoir, Pureté",
    durete: 3,
    notes: "Pierre de protection"
  },
  "Ambre": {
    surnom: "Larmes d'Atonar",
    valeur: 0.1146,
    couleur: "Orange",
    lienZodiacal: "Epée/Papillon/Ecrevisse/Tortue",
    lienDivin: "Atonar",
    symbolique: "Sérénité, Sagesse",
    durete: 3,
    notes: "Pierre électrique, combustible"
  },
  "Corail": {
    surnom: "Sang de basilisk",
    valeur: 0.1042,
    couleur: "Blanc/Jaune/Orange/Rouge",
    lienZodiacal: "Paon/Dauphins/Cerf/Ecrevisse",
    lienDivin: "Llyr, Nimnah, Guyone",
    symbolique: "Vigueur, Fertilité",
    durete: "3+",
    notes: "Pierre de protection, Pierre onirique"
  },
  "Jais": {
    surnom: "Thanarite",
    valeur: 0.0417,
    couleur: "Noir",
    lienZodiacal: "Ecrevisse/Sirène/Nuage",
    lienDivin: "Voltumna, Suvix",
    symbolique: "Protection",
    durete: "2-4",
    notes: "Pierre de protection, Pierre de deuil, combustible"
  },
  "Nacre": {
    surnom: "",
    valeur: 0.0417,
    couleur: "Nacre",
    lienZodiacal: "Ecrevisse/Sirène/Nuage",
    lienDivin: "Tivir, Llyr, Nimnah",
    symbolique: "Douceur, Simplicité",
    durete: "2-4",
    notes: "Pierre d'apaisement"
  },
  "Ecaille": {
    surnom: "",
    valeur: 0.0208,
    couleur: "Vert/Brun/Blanc",
    lienZodiacal: "Tortue/Ecrevisse/Sirène",
    lienDivin: "Thalna, Llyr, Tannun",
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
