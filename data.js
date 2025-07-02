if (!window.monnaies) {
  window.monnaies = {
    pieces: {
      "Platine": 3, "Or": 1, "Argent": 1, "Électrum": 1, "Fer": 96,
      "Nickel": 0, "Cuivre": 0, "Titane": 0, "Plomp": 0
    },
    gemmes: {
      "Rubis": 7680, "Émeraude": 6720, "Saphir": 5760, "Diamant": 960,
      "Topaze": 4800, "Aigue-Marine": 3840, "Améthyste": 2880, "Grenat": 1920,
      "Péridot": 1440, "Cyanite": 384.0, "Citrine": 307.2, "Pierre de Lune": 1152,
      "Pierre de Soleil": 1152, "Tourmaline": 960, "Aventurine": 86.4, "Turquoise": 81.6,
      "Œil de loup": 76.8, "Œil de taureau": 67.2, "Œil de tigre": 57.6, "Œil de faucon": 48.0,
      "Morion": 38.4, "Rhodite": 28.8, "Cristal": 19.2, "Lapis Lazuli": 17.28, "Onyx": 16.32,
      "Cornaline": 14.4, "Chrysoprase": 11.52, "Sardoine": 8.64, "Agate": 7.68,
      "Opale": 6.72, "Obsidienne": 4.8, "Serpentine": 2.88, "Malachite": 1.92,
      "Hématite": 0.96, "Perle": 9600, "Ambre": 10.56, "Corail": 9.6,
      "Jais": 5.76, "Nacre": 3.84, "Écaille": 1.92
    }
  };
}

window.objets = {
  ...window.monnaies.pieces,
  ...window.monnaies.gemmes
};
