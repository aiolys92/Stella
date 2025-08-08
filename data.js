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
      "Ecaille": 0.02,
    },
    // NOUVELLE CATÉGORIE : POIDS ORGANISÉ PAR CATÉGORIES
    poids: {
      "Équipements et Armures": {
        "Armure de cuir clouté": 6,
        "Bottes de Talna": 1,
        "Cape de Voltumna": 1,
        "Casque": 2,
        "Bouclier": 3,
        "Cotte de mailles": 20,
        "Armure de plaques": 30,
        "Gants": 0.5,
        "Braconnières": 2
      },
      
      "Armes": {
        "Dague": 1,
        "Dagues de lancé": 1,
        "Baton Férré (argent/or)": 1,
        "Épée courte": 2,
        "Épée longue": 3,
        "Épée à deux mains": 6,
        "Hache de guerre": 4,
        "Arc long": 2,
        "Carquois + 20 flèches": 3,
        "Arbalète": 5,
        "Lance": 3
      },
      
      "Outils et Équipements": {
        "Kit de crochetage": 1,
        "Outils spécialisé (Dessin)": 6,
        "Grappin": 4,
        "Corde (15m)": 5,
        "Piton": 0.25,
        "Marteau": 3,
        "Pelle": 5,
        "Scie": 2,
        "Hache": 4,
        "Trousse de soins": 1,
        "Kit d'escalade": 12,
        "Matériel d'alpinisme": 15
      },
      
      "Consommables et Provisions": {
        "Gourde": 1,
        "Ration": 1,
        "Parchemin": 0.1,
        "Torche": 1,
        "Chandelle": 0.1,
        "Huile (fiole)": 0.5,
        "Potion de soin": 0.3,
        "Antidote": 0.2,
        "Pain": 0.5,
        "Fromage": 0.3,
        "Viande séchée": 0.2
      },
      
      "Équipement de Voyage": {
        "Sac à dos": 2,
        "Couverture": 3,
        "Lanterne": 2,
        "Tente (2 personnes)": 20,
        "Sac de couchage": 4,
        "Kit de cuisine": 8,
        "Gourde de voyage": 2,
        "Carte": 0.1,
        "Boussole": 0.2,
        "Longue-vue": 1
      },
      
      "Objets Précieux": {
        "Livre": 2,
        "Grimoire": 3,
        "Parchemin magique": 0.1,
        "Composants magiques": 1,
        "Pierre runique": 5,
        "Cristal magique": 2,
        "Amulette": 0.2,
        "Bague magique": 0.1
      },
      
      "Objets Lourds": {
        "Enclume": 50,
        "Coffre": 25,
        "Cheval de trait": 80,
        "Charrette": 200,
        "Tonneau": 30,
        "Meule": 100,
        "Table": 40,
        "Chaise": 10,
        "Armoire": 60
      },
      
      "Montures et Créatures": {
        "Cheval de guerre": 500,
        "Poney": 200,
        "Mulet": 300,
        "Chien de garde": 35,
        "Faucon": 2,
        "Chat": 4,
        "Familier magique": 5
      },
      
      "Objets Personnalisés": {
        "Objet personnalisé 1": 1,
        "Objet personnalisé 2": 1,
        "Objet personnalisé 3": 1
      }
    }
  };
}

// Objets combinés pour compatibilité (version aplatie)
window.objets = {
  ...window.monnaies.pieces,
  ...window.monnaies.gemmes
};

// Aplatir les objets poids pour compatibilité
Object.values(window.monnaies.poids).forEach(categorie => {
  Object.assign(window.objets, categorie);
});

// Configuration des unités pour chaque catégorie
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
    nom: "kg", // ou votre unité préférée
    label: "Poids en kg",
    decimales: 1
  }
};

// Fonction utilitaire pour obtenir l'unité d'une catégorie
window.getUnite = function(categorie) {
  return window.unitesConfig[categorie] || { nom: "", label: "", decimales: 2 };
};

// Fonction pour obtenir toutes les catégories de poids
window.getCategoriesPoids = function() {
  return Object.keys(window.monnaies.poids);
};

// Fonction pour obtenir les objets d'une catégorie
window.getObjetsByCategorie = function(categorie) {
  return window.monnaies.poids[categorie] || {};
};

// Fonction pour obtenir le poids d'un objet
window.getPoidsObjet = function(nomObjet) {
  for (const categorie of Object.values(window.monnaies.poids)) {
    if (categorie[nomObjet] !== undefined) {
      return categorie[nomObjet];
    }
  }
  return 0;
};

// Fonction pour ajouter un nouvel objet personnalisé
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

// Fonction pour supprimer un objet personnalisé
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

// Fonction pour modifier le poids d'un objet
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
