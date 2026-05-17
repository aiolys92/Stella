'use strict';

/* ══════════════════════════════════════════════
   GESTIONNAIRE D'INVENTAIRE — inventory.js
   Logique partagée entre toutes les pages.
   Chaque page instancie : window.inv = new Inventory(config)
   ══════════════════════════════════════════════ */

const DEFAULT_CATS = [
  'Armes', 'Armures', 'Outils', 'Consommables',
  'Équipement de voyage', 'Objets précieux', 'Montures', 'Divers'
];

class Inventory {
  constructor(cfg) {
    this.key     = cfg.key;       // clé localStorage
    this.title   = cfg.title;     // titre affiché
    this.items   = [];
    this.customCats = [];
    this.editId  = null;
    this.filter  = '';
    this.typeFilter = '';
    this.sortKey = 'nom';
    this.sortDir = 1;

    this._load();
    this._bindEvents();
    this.render();
    this._updateIndexCounts(); // MAJ des compteurs sur index si présents
  }

  /* ──────── Persistance ──────── */

  _load() {
    try {
      const raw = localStorage.getItem(this.key);
      if (!raw) return;
      const d = JSON.parse(raw);
      this.items      = Array.isArray(d.items)      ? d.items      : [];
      this.customCats = Array.isArray(d.customCats) ? d.customCats : [];
    } catch (e) { console.warn('Erreur chargement inventaire:', e); }
  }

  _save() {
    try {
      localStorage.setItem(this.key, JSON.stringify({
        items:      this.items,
        customCats: this.customCats,
        v: 2,
        savedAt: new Date().toISOString()
      }));
    } catch (e) { console.warn('Erreur sauvegarde:', e); }
  }

  /* ──────── Computed ──────── */

  get cats() { return [...DEFAULT_CATS, ...this.customCats]; }

  get filtered() {
    let items = [...this.items];
    if (this.filter) {
      const q = this.filter.toLowerCase();
      items = items.filter(i =>
        (i.nom        || '').toLowerCase().includes(q) ||
        (i.categorie  || '').toLowerCase().includes(q) ||
        (i.dommage    || '').toLowerCase().includes(q) ||
        (i.caracteristiques || '').toLowerCase().includes(q)
      );
    }
    if (this.typeFilter) {
      items = items.filter(i => i.type === this.typeFilter);
    }
    items.sort((a, b) => {
      let va = a[this.sortKey] ?? '', vb = b[this.sortKey] ?? '';
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      if (va < vb) return -this.sortDir;
      if (va > vb) return  this.sortDir;
      return 0;
    });
    return items;
  }

  get totalWeight() {
    return this.items.reduce((s, i) =>
      s + (parseFloat(i.poids) || 0) * (parseFloat(i.quantite) || 0), 0);
  }
  get totalValue() {
    return this.items.reduce((s, i) =>
      s + (parseFloat(i.prix) || 0) * (parseFloat(i.quantite) || 0), 0);
  }

  /* ──────── CRUD ──────── */

  _uid() {
    return `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  }

  addItem(data) {
    this.items.push({ ...data, id: this._uid() });
    this._save();
    this.render();
  }

  updateItem(id, data) {
    const idx = this.items.findIndex(x => x.id === id);
    if (idx >= 0) {
      this.items[idx] = { ...this.items[idx], ...data };
      this._save();
      this.render();
    }
  }

  deleteItem(id) {
    if (!confirm('Supprimer cet objet définitivement ?')) return;
    this.items = this.items.filter(i => i.id !== id);
    this._save();
    this.render();
  }

  dupeItem(id) {
    const src = this.items.find(i => i.id === id);
    if (src) this.addItem({ ...src, nom: src.nom + ' (copie)' });
  }

  addCategory(name) {
    name = (name || '').trim();
    if (!name || this.cats.includes(name)) return;
    this.customCats.push(name);
    this._save();
    this._refreshCatSelect();
  }

  /* ──────── Modal ──────── */

  openModal(id = null) {
    this.editId = id;
    const form  = document.getElementById('itemForm');
    const title = document.getElementById('modalTitle');

    form.reset();
    this._refreshCatSelect();
    this._switchTypeFields('autre');

    if (id) {
      const item = this.items.find(i => i.id === id);
      if (!item) return;
      title.textContent = '✏️ Modifier l\'objet';
      this._fillForm(form, item);
    } else {
      title.textContent = '✨ Nouvel objet';
    }
    document.getElementById('itemModal').classList.add('active');
    setTimeout(() => form.elements['nom']?.focus(), 60);
  }

  closeModal() {
    document.getElementById('itemModal').classList.remove('active');
    this.editId = null;
  }

  _fillForm(form, item) {
    const s = (n, v) => { const el = form.elements[n]; if (el) el.value = v ?? ''; };
    s('nom',       item.nom);
    s('categorie', item.categorie);
    s('type',      item.type || 'autre');
    s('quantite',  item.quantite);
    s('poids',     item.poids);
    s('prix',      item.prix);
    // Champs spécifiques
    ['initiative','attaque','parade','seconde_parade','dommage',
     'encaissement','caracteristiques'].forEach(f => s(f, item[f]));
    this._switchTypeFields(item.type || 'autre');
  }

  _switchTypeFields(type) {
    ['arme', 'armure', 'autre'].forEach(t => {
      const el = document.getElementById(`fields-${t}`);
      if (el) el.style.display = t === type ? '' : 'none';
    });
  }

  _refreshCatSelect() {
    const sel = document.getElementById('formCategorie');
    if (!sel) return;
    const cur = sel.value;
    sel.innerHTML = this.cats
      .map(c => `<option value="${c}"${c === cur ? ' selected' : ''}>${c}</option>`)
      .join('');
  }

  submitForm() {
    const form = document.getElementById('itemForm');
    const g = n => (form.elements[n]?.value ?? '').trim();
    const type = g('type') || 'autre';

    const data = {
      nom:      g('nom'),
      categorie: g('categorie') || 'Divers',
      type,
      quantite: parseFloat(g('quantite')) || 1,
      poids:    parseFloat(g('poids'))    || 0,
      prix:     parseFloat(g('prix'))     || 0,
    };

    if (!data.nom) {
      alert('⚠️ Le nom de l\'objet est obligatoire.');
      form.elements['nom']?.focus();
      return;
    }

    if (type === 'arme') {
      Object.assign(data, {
        initiative:     g('initiative'),
        attaque:        g('attaque'),
        parade:         g('parade'),
        seconde_parade: g('seconde_parade'),
        dommage:        g('dommage'),
      });
    } else if (type === 'armure') {
      data.encaissement = g('encaissement');
    } else {
      data.caracteristiques = g('caracteristiques');
    }

    if (this.editId) {
      this.updateItem(this.editId, data);
    } else {
      this.addItem(data);
    }
    this.closeModal();
  }

  /* ──────── Rendu ──────── */

  render() {
    this._renderStats();
    this._renderTable();
    this._updateIndexCounts();
  }

  _renderStats() {
    const $ = id => document.getElementById(id);
    if ($('statItems'))  $('statItems').textContent  = this.items.length;
    if ($('statWeight')) $('statWeight').textContent = _fmt(this.totalWeight, 'kg');
    if ($('statValue'))  $('statValue').textContent  = _fmt(this.totalValue,  'pm');
  }

  _renderTable() {
    const tbody = document.getElementById('inventoryBody');
    if (!tbody) return;
    const items = this.filtered;

    // Mise à jour footer
    const footW = document.getElementById('footWeight');
    const footV = document.getElementById('footValue');
    const footN = document.getElementById('footCount');
    // Footer affiche les totaux des items FILTRÉS
    const fW = items.reduce((s, i) => s + (parseFloat(i.poids)||0)*(parseFloat(i.quantite)||0), 0);
    const fV = items.reduce((s, i) => s + (parseFloat(i.prix)||0)*(parseFloat(i.quantite)||0), 0);
    if (footW) footW.textContent = _fmt(fW, 'kg');
    if (footV) footV.textContent = _fmt(fV, 'pm');
    if (footN) footN.textContent = items.length + ' objet' + (items.length > 1 ? 's' : '');

    if (!items.length) {
      tbody.innerHTML = `<tr><td colspan="9" class="empty-state">
        <div class="empty-icon">📦</div>
        <p>Aucun objet trouvé dans cet inventaire</p>
        <button class="btn btn-primary" onclick="inv.openModal()">✨ Ajouter un objet</button>
      </td></tr>`;
      return;
    }

    tbody.innerHTML = items.map(item => this._renderRow(item)).join('');
  }

  _renderRow(item) {
    const ICONS  = { arme: '⚔️', armure: '🛡️', autre: '📦' };
    const LABELS = { arme: 'Arme', armure: 'Armure', autre: 'Autre' };
    const type   = item.type || 'autre';
    const qty    = parseFloat(item.quantite) || 0;
    const poids  = parseFloat(item.poids)    || 0;
    const prix   = parseFloat(item.prix)     || 0;
    const totW   = (poids * qty).toFixed(2);
    const totV   = (prix  * qty).toFixed(2);

    // Chips de stats
    let statsHtml = '<span class="stat-chips">';
    if (type === 'arme') {
      const parts = [
        ['Init', item.initiative],
        ['Atq',  item.attaque],
        ['Par',  item.parade],
        ['Par2', item.seconde_parade],
        ['Dmg',  item.dommage],
      ];
      statsHtml += parts
        .filter(([, v]) => v && v.trim())
        .map(([k, v]) => `<span class="stat-chip">${k} <strong>${_esc(v)}</strong></span>`)
        .join('');
    } else if (type === 'armure') {
      if (item.encaissement) {
        statsHtml += `<span class="stat-chip">Enc <strong>${_esc(item.encaissement)}</strong></span>`;
      }
    } else {
      if (item.caracteristiques) {
        const t = item.caracteristiques;
        const preview = t.length > 45 ? t.slice(0, 43) + '…' : t;
        statsHtml += `<span class="stat-text" title="${_esc(t)}">${_esc(preview)}</span>`;
      }
    }
    statsHtml += '</span>';

    return `<tr data-id="${item.id}">
      <td><span class="type-badge type-${type}">${ICONS[type]||'📦'} ${LABELS[type]||'Autre'}</span></td>
      <td style="font-weight:600">${_esc(item.nom)}</td>
      <td class="hide-sm"><span class="cat-tag">${_esc(item.categorie)}</span></td>
      <td class="text-c">${item.quantite}</td>
      <td class="text-r hide-sm">${poids.toFixed(2)} kg</td>
      <td class="text-r"><strong>${totW}</strong> kg</td>
      <td class="text-r hide-sm">${prix.toFixed(2)} pm</td>
      <td class="hide-md-only">${statsHtml}</td>
      <td class="text-c" style="white-space:nowrap">
        <button class="icon-btn" onclick="inv.openModal('${item.id}')" title="Modifier">✏️</button>
        <button class="icon-btn" onclick="inv.dupeItem('${item.id}')"  title="Dupliquer">📋</button>
        <button class="icon-btn del" onclick="inv.deleteItem('${item.id}')" title="Supprimer">🗑️</button>
      </td>
    </tr>`;
  }

  /* ──────── Tri ──────── */

  setSort(key) {
    this.sortDir = this.sortKey === key ? -this.sortDir : 1;
    this.sortKey = key;
    // Mise à jour des indicateurs visuels
    document.querySelectorAll('th[data-sort]').forEach(th => {
      th.classList.remove('sort-asc', 'sort-desc');
      if (th.dataset.sort === key) {
        th.classList.add(this.sortDir === 1 ? 'sort-asc' : 'sort-desc');
      }
    });
    this._renderTable();
  }

  /* ──────── Export / Import ──────── */

  exportJSON() {
    const payload = {
      inventaire: this.title,
      exportedAt: new Date().toISOString(),
      items:      this.items,
      customCats: this.customCats,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), {
      href:     url,
      download: `${this.key}-${new Date().toISOString().slice(0, 10)}.json`
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  importJSON(file) {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const d = JSON.parse(e.target.result);
        const count = (d.items || []).length;
        if (confirm(`📦 Importer ${count} objet(s) depuis "${file.name}" ?\nL'inventaire actuel sera remplacé.`)) {
          this.items      = d.items      || [];
          this.customCats = d.customCats || [];
          this._save();
          this.render();
        }
      } catch {
        alert('❌ Fichier JSON invalide ou corrompu.');
      }
    };
    reader.readAsText(file);
  }

  /* ──────── Compteurs index ──────── */

  _updateIndexCounts() {
    // Mise à jour des compteurs affichés sur la page index (si ouverte)
    const el = document.getElementById(`count-${this.key}`);
    if (el) el.textContent = this.items.length + ' objet' + (this.items.length > 1 ? 's' : '');
  }

  /* ──────── Liaison événements ──────── */

  _bindEvents() {
    // Recherche textuelle
    document.getElementById('searchInput')?.addEventListener('input', e => {
      this.filter = e.target.value;
      this._renderTable();
    });

    // Filtre par type
    document.getElementById('typeFilter')?.addEventListener('change', e => {
      this.typeFilter = e.target.value;
      this._renderTable();
    });

    // Changement de type dans le formulaire
    document.querySelector('[name="type"]')?.addEventListener('change', e => {
      this._switchTypeFields(e.target.value);
    });

    // Fermer modal sur clic overlay
    document.getElementById('itemModal')?.addEventListener('click', e => {
      if (e.target.id === 'itemModal') this.closeModal();
    });

    // Touche Échap pour fermer modal
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') this.closeModal();
    });

    // Soumission formulaire
    document.getElementById('itemForm')?.addEventListener('submit', e => {
      e.preventDefault();
      this.submitForm();
    });

    // Import fichier
    document.getElementById('importFile')?.addEventListener('change', e => {
      const f = e.target.files[0];
      if (f) { this.importJSON(f); e.target.value = ''; }
    });

    // Ajouter catégorie personnalisée
    document.getElementById('addCatBtn')?.addEventListener('click', () => {
      const inp = document.getElementById('newCatInput');
      if (inp?.value.trim()) {
        this.addCategory(inp.value.trim());
        inp.value = '';
      }
    });
    document.getElementById('newCatInput')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('addCatBtn')?.click();
      }
    });

    // En-têtes de tri
    document.querySelectorAll('th[data-sort]').forEach(th => {
      th.style.cursor = 'pointer';
      th.addEventListener('click', () => this.setSort(th.dataset.sort));
    });
  }
}

/* ──────── Utilitaires ──────── */

function _esc(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function _fmt(num, unit) {
  const n = parseFloat(num) || 0;
  return n.toFixed(2) + ' ' + unit;
}
