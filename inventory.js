'use strict';

/* ══════════════════════════════════════════════
   LE REGISTRE — inventory.js  v6
   • Export / import global (3 inventaires)
   • Déplacement d'objets entre inventaires
   • Jauge de charge avec capacité réglable
   • Ajout rapide, suppression annulable, toasts
   ══════════════════════════════════════════════ */

/* Registre de tous les inventaires connus */
const ALL_INVENTORIES = [
  { key: 'inv_perso',   label: '👤 Perso · Dorusis', defaultCapacity: 45  },
  { key: 'inv_chariot', label: '🛒 Chariot',          defaultCapacity: 400 },
  { key: 'inv_guilde',  label: '⚔️ Guilde',           defaultCapacity: 800 },
];

const DEFAULT_CATS = [
  { nom: 'Arme',           type: 'arme'   },
  { nom: 'Armure',         type: 'armure' },
  { nom: 'Outil',          type: 'autre'  },
  { nom: 'Consommable',    type: 'autre'  },
  { nom: 'Équipement',     type: 'autre'  },
  { nom: 'Objet précieux', type: 'autre'  },
  { nom: 'Monture',        type: 'autre'  },
  { nom: 'Divers',         type: 'autre'  },
];

const TYPE_ICONS = { arme: '⚔️', armure: '🛡️', autre: '📦' };

/* ══════════════════════════════════════════════
   FONCTIONS GLOBALES
   ══════════════════════════════════════════════ */

/** Exporte les 3 inventaires en un seul fichier JSON */
function globalExport() {
  const payload = {
    type:        'stella-global',
    exportedAt:  new Date().toISOString(),
    inventaires: {}
  };
  ALL_INVENTORIES.forEach(({ key, label }) => {
    try {
      const raw = localStorage.getItem(key);
      const d   = raw ? JSON.parse(raw) : {};
      payload.inventaires[key] = {
        label,
        items:      d.items      || [],
        customCats: d.customCats || [],
        capacity:   d.capacity,
      };
    } catch {
      payload.inventaires[key] = { label, items: [], customCats: [] };
    }
  });

  const total = Object.values(payload.inventaires)
    .reduce((s, inv) => s + inv.items.length, 0);

  _downloadJSON(payload, `stella-global-${_today()}.json`);
  _showToast(`Export global : ${total} objet(s) sur 3 inventaires`, { type: 'success' });
}

/**
 * Importe depuis un fichier JSON.
 * Auto-détecte si c'est un export global ou individuel.
 * @param {File} file
 */
function globalImport(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);

      /* ── Export GLOBAL ── */
      if (data.type === 'stella-global' && data.inventaires) {
        const total = Object.values(data.inventaires)
          .reduce((s, inv) => s + (inv.items || []).length, 0);

        const detail = ALL_INVENTORIES.map(({ key, label }) => {
          const n = (data.inventaires[key]?.items || []).length;
          return `${label} — ${n} objet(s)`;
        }).join('<br>');

        _confirmDialog({
          title:    'Import global',
          html:     `Ce fichier contient <strong>${total} objet(s)</strong> répartis sur les 3 inventaires :` +
                    `<div class="cm-list">${detail}</div>` +
                    `<br>Les 3 inventaires actuels seront <strong>remplacés</strong>.`,
          okLabel:  'Remplacer tout',
          danger:   true,
        }).then(ok => {
          if (!ok) return;
          ALL_INVENTORIES.forEach(({ key }) => {
            const inv = data.inventaires[key];
            if (!inv) return;
            localStorage.setItem(key, JSON.stringify({
              items:      inv.items || [],
              customCats: _normCats(inv.customCats),
              capacity:   inv.capacity,
              v: 6, savedAt: new Date().toISOString()
            }));
          });
          if (window.inv) { window.inv._load(); window.inv.render(); }
          _refreshIndexCounts();
          _showToast(`Import global réussi — ${total} objet(s) chargés`, { type: 'success' });
        });
        return;
      }

      /* ── Export INDIVIDUEL (ancien format) ── */
      const count = (data.items || []).length;
      _confirmDialog({
        title:   'Import individuel',
        html:    `Ce fichier contient un export individuel (<strong>${count} objet(s)</strong>).<br>` +
                 `L'importer dans l'inventaire actuel uniquement ?`,
        okLabel: 'Importer ici',
      }).then(ok => {
        if (!ok || !window.inv) return;
        window.inv.items      = data.items || [];
        window.inv.customCats = _normCats(data.customCats);
        window.inv._save();
        window.inv.render();
        _showToast(`${count} objet(s) importés`, { type: 'success' });
      });

    } catch {
      _showToast('Fichier JSON invalide ou corrompu.', { type: 'danger' });
    }
  };
  reader.readAsText(file);
}

/** Met à jour les compteurs de la page d'accueil si présents */
function _refreshIndexCounts() {
  ALL_INVENTORIES.forEach(({ key }) => {
    const el = document.getElementById(`count-${key}`);
    if (!el) return;
    try {
      const raw = localStorage.getItem(key);
      const n   = raw ? (JSON.parse(raw).items || []).length : 0;
      el.textContent = n + ' objet' + (n !== 1 ? 's' : '');
    } catch {}
  });
}

/* ══════════════════════════════════════════════
   CLASSE INVENTORY
   ══════════════════════════════════════════════ */

class Inventory {
  constructor(cfg) {
    this.key         = cfg.key;
    this.title       = cfg.title;
    this.items       = [];
    this.customCats  = [];
    this.capacity    = ALL_INVENTORIES.find(i => i.key === cfg.key)?.defaultCapacity || 50;
    this.editId      = null;
    this.moveItemId  = null;
    this.filter      = '';
    this.typeFilter  = '';
    this.magicFilter = false;
    this.sortKey     = 'nom';
    this.sortDir     = 1;
    this._firstRender = true;

    this._load();
    this._bindEvents();
    this._refreshCatSelect();
    this.render();
    this._updateIndexCounts();
  }

  /* ──────── Persistance ──────── */

  _load() {
    try {
      const raw = localStorage.getItem(this.key);
      if (!raw) return;
      const d = JSON.parse(raw);
      this.items      = Array.isArray(d.items) ? d.items : [];
      this.customCats = _normCats(d.customCats);
      if (parseFloat(d.capacity) > 0) this.capacity = parseFloat(d.capacity);
    } catch (e) { console.warn('Erreur chargement inventaire:', e); }
  }

  _save() {
    try {
      localStorage.setItem(this.key, JSON.stringify({
        items: this.items, customCats: this.customCats,
        capacity: this.capacity,
        v: 6, savedAt: new Date().toISOString()
      }));
    } catch (e) { console.warn('Erreur sauvegarde:', e); }
  }

  /* ──────── Catégories ──────── */

  get cats() { return [...DEFAULT_CATS, ...this.customCats]; }

  addCategory(nom, type = 'autre') {
    nom = (nom || '').trim();
    if (!nom) return;
    if (this.cats.some(c => c.nom === nom)) {
      _showToast(`La catégorie « ${nom} » existe déjà.`, { type: 'warn' });
      return;
    }
    this.customCats.push({ nom, type });
    this._save();
    this._refreshCatSelect();
    _showToast(`Catégorie « ${nom} » ajoutée`, { type: 'success' });
  }

  /* ──────── Computed ──────── */

  get filtered() {
    let items = [...this.items];
    if (this.filter) {
      const q = this.filter.toLowerCase();
      items = items.filter(i =>
        (i.nom || '').toLowerCase().includes(q) ||
        (i.categorie || '').toLowerCase().includes(q) ||
        (i.dommage || '').toLowerCase().includes(q) ||
        (i.autres || '').toLowerCase().includes(q) ||
        (i.caracteristiques || '').toLowerCase().includes(q)
      );
    }
    if (this.typeFilter) items = items.filter(i => (i.type || 'autre') === this.typeFilter);
    if (this.magicFilter) items = items.filter(i => !!i.magique);
    items.sort((a, b) => {
      const va = a[this.sortKey] ?? '', vb = b[this.sortKey] ?? '';
      if (typeof va === 'string' || typeof vb === 'string') {
        return String(va).localeCompare(String(vb), 'fr', { sensitivity: 'base', numeric: true }) * this.sortDir;
      }
      return va < vb ? -this.sortDir : va > vb ? this.sortDir : 0;
    });
    return items;
  }

  get totalWeight() {
    return this.items.reduce((s, i) => {
      const raw = (parseFloat(i.poids) || 0) * (parseFloat(i.quantite) || 0);
      return s + (i.porte ? raw / 2 : raw);
    }, 0);
  }
  get totalValue()  { return this.items.reduce((s, i) => s + (parseFloat(i.prix)||0)*(parseFloat(i.quantite)||0), 0); }
  get totalMagic()  { return this.items.filter(i => !!i.magique).reduce((s, i) => s + (parseInt(i.quantite) || 0), 0); }

  /* ──────── CRUD ──────── */

  _uid() { return `${Date.now()}_${Math.random().toString(36).slice(2,7)}`; }

  addItem(data) { this.items.push({ ...data, id: this._uid() }); this._save(); this.render(); }

  /** Suppression immédiate + toast « Annuler » (pas de confirm bloquant) */
  deleteItem(id) {
    const idx = this.items.findIndex(i => i.id === id);
    if (idx < 0) return;
    const [removed] = this.items.splice(idx, 1);
    this._save(); this.render();
    _showToast(`« ${removed.nom} » supprimé`, {
      type: 'danger',
      duration: 6500,
      actionLabel: 'Annuler',
      onAction: () => {
        this.items.splice(Math.min(idx, this.items.length), 0, removed);
        this._save(); this.render();
        _showToast(`« ${removed.nom} » restauré`, { type: 'success' });
      }
    });
  }

  dupeItem(id) {
    const s = this.items.find(i => i.id === id);
    if (!s) return;
    this.addItem({ ...s, nom: s.nom + ' (copie)', porte: false, surMoi: false });
    _showToast(`« ${s.nom} » dupliqué`, { type: 'success' });
  }

  updateItem(id, data) {
    const idx = this.items.findIndex(x => x.id === id);
    if (idx >= 0) { this.items[idx] = { ...this.items[idx], ...data }; this._save(); this.render(); }
  }

  toggleField(id, field) {
    const item = this.items.find(i => i.id === id);
    if (!item) return;
    item[field] = !item[field];
    this._save(); this._renderTable(); this._renderStats(); this._renderGauge();
  }

  /* ──────── Capacité / Jauge de charge ──────── */

  setCapacity(val) {
    const v = parseFloat(val);
    if (!(v > 0)) return;
    this.capacity = v;
    this._save();
    this._renderGauge();
    _showToast(`Capacité fixée à ${v} kg`, { type: 'success' });
  }

  editCapacity() {
    const wrap = document.getElementById('lgCapWrap');
    if (!wrap || wrap.querySelector('input')) return;
    const input = document.createElement('input');
    input.type = 'number'; input.min = '1'; input.step = '1';
    input.value = this.capacity;
    input.className = 'lg-cap-input';
    input.setAttribute('aria-label', 'Capacité de charge en kg');
    const done = (commit) => {
      if (commit && input.value) this.setCapacity(input.value);
      this._renderGauge(); // restaure le bouton
    };
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter')  { e.preventDefault(); done(true);  }
      if (e.key === 'Escape') { e.preventDefault(); done(false); }
    });
    input.addEventListener('blur', () => done(true));
    wrap.innerHTML = '';
    wrap.appendChild(input);
    input.focus(); input.select();
  }

  _renderGauge() {
    const gauge = document.getElementById('loadGauge');
    if (!gauge) return;
    const w   = this.totalWeight;
    const cap = this.capacity || 1;
    const pct = w / cap;

    const state =
      pct >= 1   ? 'over'  :
      pct >= .8  ? 'heavy' :
      pct >= .5  ? 'warn'  : 'ok';
    gauge.dataset.state = state;

    const fill = document.getElementById('lgFill');
    if (fill) fill.style.width = Math.min(pct * 100, 100) + '%';

    const cur = document.getElementById('lgCurrent');
    if (cur) cur.textContent = w.toFixed(2);

    const capWrap = document.getElementById('lgCapWrap');
    if (capWrap) {
      capWrap.innerHTML =
        `<button class="lg-cap-btn" type="button" onclick="inv.editCapacity()" ` +
        `title="Modifier la capacité de charge">${this.capacity} kg ✎</button>`;
    }

    const FLAVOR = {
      ok:    'Léger comme une plume.',
      warn:  'Bien chargé, mais le pas reste alerte.',
      heavy: 'Le dos commence à plier sous le fardeau…',
      over:  'Surcharge ! Il faut délester avant de reprendre la route.',
    };
    const status = document.getElementById('lgStatus');
    if (status) {
      status.innerHTML = `${FLAVOR[state]}<span class="lg-pct">${Math.round(pct * 100)} %</span>`;
    }
  }

  /* ──────── Déplacement d'objet ──────── */

  openMoveModal(id) {
    const item = this.items.find(i => i.id === id);
    if (!item) return;
    this.moveItemId = id;

    const nameEl = document.getElementById('moveItemName');
    if (nameEl) nameEl.textContent = item.nom;

    const destSel = document.getElementById('moveDest');
    if (destSel) {
      destSel.innerHTML = ALL_INVENTORIES
        .filter(inv => inv.key !== this.key)
        .map(inv => `<option value="${inv.key}">${inv.label}</option>`)
        .join('');
    }

    const qtyWrap  = document.getElementById('moveQtyWrap');
    const qtyInput = document.getElementById('moveQty');
    const qtyMax   = document.getElementById('moveQtyMax');
    if (qtyWrap && qtyInput) {
      if (parseFloat(item.quantite) > 1) {
        qtyWrap.style.display = '';
        qtyInput.max   = item.quantite;
        qtyInput.value = 1;
        if (qtyMax) qtyMax.textContent = `(max ${item.quantite})`;
      } else {
        qtyWrap.style.display = 'none';
      }
    }

    document.getElementById('moveModal').classList.add('active');
    destSel?.focus();
  }

  closeMoveModal() {
    document.getElementById('moveModal').classList.remove('active');
    this.moveItemId = null;
  }

  confirmMove() {
    const item = this.items.find(i => i.id === this.moveItemId);
    if (!item) return;

    const destKey = document.getElementById('moveDest')?.value;
    if (!destKey) { _showToast('Choisissez une destination.', { type: 'warn' }); return; }

    const srcQty   = parseFloat(item.quantite) || 1;
    const qtyInput = document.getElementById('moveQty');
    const moveQty  = srcQty > 1
      ? Math.min(Math.max(parseInt(qtyInput?.value) || 1, 1), srcQty)
      : srcQty;

    /* Charger la destination depuis localStorage */
    let destData = { items: [], customCats: [] };
    try {
      const raw = localStorage.getItem(destKey);
      if (raw) destData = JSON.parse(raw);
    } catch {}
    destData.items = destData.items || [];

    /* Ajouter à la destination (porte/surMoi remis à zéro) */
    destData.items.push({ ...item, id: this._uid(), quantite: moveQty, porte: false, surMoi: false });
    localStorage.setItem(destKey, JSON.stringify({
      ...destData, v: 6, savedAt: new Date().toISOString()
    }));

    /* Mettre à jour la source */
    if (moveQty >= srcQty) {
      this.items = this.items.filter(i => i.id !== this.moveItemId);
    } else {
      item.quantite = srcQty - moveQty;
    }
    this._save();
    this.render();
    this.closeMoveModal();

    const destLabel = ALL_INVENTORIES.find(i => i.key === destKey)?.label || destKey;
    _showToast(`${moveQty}× ${item.nom} → ${destLabel}`, { type: 'success' });
  }

  /* ──────── Modale d'édition ──────── */

  openModal(id = null) {
    this.editId = id;
    const form  = document.getElementById('itemForm');
    const title = document.getElementById('modalTitle');
    form.reset();
    this._refreshCatSelect();
    this._switchTypeFromCatSelect();
    if (id) {
      const item = this.items.find(i => i.id === id);
      if (!item) return;
      title.textContent = 'Modifier l\'objet';
      this._fillForm(form, item);
    } else {
      title.textContent = 'Nouvel objet';
    }
    document.getElementById('itemModal').classList.add('active');
    setTimeout(() => form.elements['nom']?.focus(), 60);
  }

  closeModal() {
    document.getElementById('itemModal').classList.remove('active');
    this.editId = null;
  }

  _fillForm(form, item) {
    const s = (n, v) => { const el = form.elements[n]; if (!el) return; el.type === 'checkbox' ? (el.checked = !!v) : (el.value = v ?? ''); };
    s('nom', item.nom); s('quantite', item.quantite); s('poids', item.poids);
    s('prix', item.prix); s('magique', item.magique);
    const catEl = form.elements['categorie'];
    if (catEl) {
      catEl.value = item.categorie || '';
      if (catEl.selectedIndex < 0) {
        const fallback = this.cats.find(c => c.type === (item.type || 'autre'));
        catEl.value = fallback?.nom || '';
      }
    }
    this._switchTypeFromCatSelect();
    ['initiative','attaque','parade','seconde_parade','dommage','autres','encaissement','caracteristiques']
      .forEach(f => s(f, item[f]));
  }

  _switchTypeFromCatSelect() {
    const sel = document.getElementById('formCategorie');
    if (!sel) return;
    const opt = sel.options[sel.selectedIndex];
    this._switchTypeFields(opt?.dataset.type || 'autre');
  }

  _switchTypeFields(type) {
    ['arme', 'armure', 'autre'].forEach(t => {
      const el = document.getElementById(`fields-${t}`);
      if (el) el.style.display = t === type ? '' : 'none';
    });
  }

  _refreshCatSelect() {
    const byType = t => this.cats.filter(c => c.type === t);
    const build = (cur) => {
      const opts = cats => cats.map(c =>
        `<option value="${c.nom}" data-type="${c.type}"${c.nom===cur?' selected':''}>${c.nom}</option>`
      ).join('');
      return `<optgroup label="⚔️ Armes">${opts(byType('arme'))}</optgroup>` +
             `<optgroup label="🛡️ Armures">${opts(byType('armure'))}</optgroup>` +
             `<optgroup label="📦 Autres">${opts(byType('autre'))}</optgroup>`;
    };
    const sel = document.getElementById('formCategorie');
    if (sel) sel.innerHTML = build(sel.value);
    const qa = document.getElementById('qaCat');
    if (qa) {
      const cur = qa.value || 'Divers';
      qa.innerHTML = build(cur);
    }
  }

  /**
   * Enregistre le formulaire.
   * @param {boolean} keepOpen — si vrai, garde la modale ouverte pour enchaîner
   */
  submitForm(keepOpen = false) {
    const form   = document.getElementById('itemForm');
    const g      = n => { const el = form.elements[n]; if (!el) return ''; return el.type === 'checkbox' ? el.checked : (el.value ?? '').trim(); };
    const catEl  = form.elements['categorie'];
    const selOpt = catEl?.options[catEl?.selectedIndex];
    const type   = selOpt?.dataset.type || 'autre';

    const data = {
      nom: g('nom'), categorie: g('categorie') || 'Divers', type,
      quantite: parseFloat(g('quantite')) || 1,
      poids:    parseFloat(g('poids'))    || 0,
      prix:     parseFloat(g('prix'))     || 0,
      magique:  g('magique'),
    };
    if (!data.nom) {
      _showToast('Le nom de l\'objet est obligatoire.', { type: 'warn' });
      const nomEl = form.elements['nom'];
      nomEl?.classList.add('field-error');
      setTimeout(() => nomEl?.classList.remove('field-error'), 600);
      nomEl?.focus();
      return;
    }

    if (type === 'arme') {
      Object.assign(data, {
        initiative: g('initiative'), attaque: g('attaque'),
        parade: g('parade'), seconde_parade: g('seconde_parade'),
        dommage: g('dommage'), autres: g('autres'),
      });
    } else if (type === 'armure') {
      data.encaissement = g('encaissement');
    } else {
      data.caracteristiques = g('caracteristiques');
    }

    const wasEdit = !!this.editId;
    this.editId ? this.updateItem(this.editId, data) : this.addItem(data);
    _showToast(wasEdit ? `« ${data.nom} » modifié` : `« ${data.nom} » ajouté`, { type: 'success' });

    if (keepOpen) {
      /* Enchaîner : nouveau formulaire vierge, même catégorie */
      this.editId = null;
      const keepCat = g('categorie');
      form.reset();
      this._refreshCatSelect();
      if (form.elements['categorie']) form.elements['categorie'].value = keepCat;
      this._switchTypeFromCatSelect();
      document.getElementById('modalTitle').textContent = 'Nouvel objet';
      form.elements['nom']?.focus();
    } else {
      this.closeModal();
    }
  }

  /* ──────── Ajout rapide ──────── */

  quickAdd(form) {
    const g = n => form.elements[n]?.value?.trim() ?? '';
    const nom = g('qa-nom');
    if (!nom) {
      form.elements['qa-nom']?.classList.add('field-error');
      setTimeout(() => form.elements['qa-nom']?.classList.remove('field-error'), 600);
      return;
    }
    const catSel = form.elements['qa-cat'];
    const selOpt = catSel?.options[catSel?.selectedIndex];
    this.addItem({
      nom,
      categorie: catSel?.value || 'Divers',
      type:      selOpt?.dataset.type || 'autre',
      quantite:  parseFloat(g('qa-qte'))   || 1,
      poids:     parseFloat(g('qa-poids')) || 0,
      prix:      parseFloat(g('qa-prix'))  || 0,
      magique:   false,
    });
    _showToast(`« ${nom} » ajouté`, { type: 'success' });
    form.elements['qa-nom'].value   = '';
    form.elements['qa-qte'].value   = 1;
    form.elements['qa-poids'].value = '';
    form.elements['qa-prix'].value  = '';
    form.elements['qa-nom'].focus();
  }

  /* ──────── Rendu ──────── */

  render() { this._renderStats(); this._renderGauge(); this._renderTable(); this._updateIndexCounts(); }

  _renderStats() {
    const $ = id => document.getElementById(id);
    if ($('statItems'))  $('statItems').textContent  = this.items.length;
    if ($('statWeight')) $('statWeight').textContent = _fmt(this.totalWeight, 'kg');
    if ($('statValue'))  $('statValue').textContent  = _fmt(this.totalValue,  'pm');
    if ($('statMagic'))  $('statMagic').textContent  = this.totalMagic;
  }

  _renderTable() {
    const tbody = document.getElementById('inventoryBody');
    if (!tbody) return;
    const items = this.filtered;

    const fW = items.reduce((s, i) => { const r = (parseFloat(i.poids)||0)*(parseFloat(i.quantite)||0); return s+(i.porte?r/2:r); }, 0);
    const fV = items.reduce((s, i) => s + (parseFloat(i.prix)||0)*(parseFloat(i.quantite)||0), 0);
    const $  = id => document.getElementById(id);
    if ($('footWeight')) $('footWeight').textContent = _fmt(fW, 'kg');
    if ($('footValue'))  $('footValue').textContent  = _fmt(fV, 'pm');
    if ($('footCount'))  $('footCount').textContent  = items.length + ' objet' + (items.length > 1 ? 's' : '');

    /* Animation des lignes uniquement au premier rendu */
    tbody.classList.toggle('rows-animate', this._firstRender);
    this._firstRender = false;

    if (!items.length) {
      const isFiltered = this.filter || this.typeFilter || this.magicFilter;
      tbody.innerHTML = `<tr><td colspan="8" class="empty-state">
        <div class="empty-icon">${isFiltered ? '🔍' : '📜'}</div>
        <p>${isFiltered
          ? 'Aucun objet ne correspond à cette recherche.'
          : 'Ce registre est encore vierge. Consignez votre premier objet.'}</p>
        ${isFiltered ? '' : '<button class="btn btn-primary" onclick="inv.openModal()">✦ Ajouter un objet</button>'}
      </td></tr>`;
      return;
    }
    tbody.innerHTML = items.map(i => this._renderRow(i)).join('');
  }

  _renderRow(item) {
    const type  = item.type || 'autre';
    const qty   = parseFloat(item.quantite) || 0;
    const poids = parseFloat(item.poids)    || 0;
    const prix  = parseFloat(item.prix)     || 0;
    const effW  = (poids * qty) * (item.porte ? .5 : 1);

    const magicBadge = item.magique ? ' <span class="magic-star" title="Objet magique">✨</span>' : '';
    const wLabel = effW.toFixed(2) + ' kg' + (item.porte ? ' <span class="halved-badge">÷2</span>' : '');

    let statsHtml = '<span class="stat-chips">';
    if (type === 'arme') {
      [['Init',item.initiative],['Atq',item.attaque],['Par',item.parade],['Par2',item.seconde_parade],['Dmg',item.dommage]]
        .filter(([,v])=>v&&String(v).trim())
        .forEach(([k,v])=>{ statsHtml+=`<span class="stat-chip">${k} <strong>${_esc(v)}</strong></span>`; });
      if (item.autres?.trim()) {
        const t = item.autres.trim();
        statsHtml += `<span class="stat-text" title="${_esc(t)}">${_esc(t.length>35?t.slice(0,33)+'…':t)}</span>`;
      }
    } else if (type === 'armure') {
      if (item.encaissement) statsHtml += `<span class="stat-chip">Enc <strong>${_esc(item.encaissement)}</strong></span>`;
    } else {
      if (item.caracteristiques) { const t=item.caracteristiques; statsHtml+=`<span class="stat-text" title="${_esc(t)}">${_esc(t.length>45?t.slice(0,43)+'…':t)}</span>`; }
    }
    statsHtml += '</span>';

    const rowClass = [item.surMoi?'row-onme':'', item.magique?'row-magic':''].filter(Boolean).join(' ');

    return `<tr data-id="${item.id}" class="${rowClass}">
      <td class="td-cat"><span class="type-badge type-${type}">${TYPE_ICONS[type]||'📦'} ${_esc(item.categorie)}</span>${magicBadge}</td>
      <td class="td-name">${_esc(item.nom)}</td>
      <td class="text-c td-qty" data-label="Quantité">${item.quantite}</td>
      <td class="text-c etat-cell td-etat" data-label="État">
        <label class="cb-label" title="Poids porté (÷2)">
          <input type="checkbox" class="cb-toggle" ${item.porte?'checked':''} onchange="inv.toggleField('${item.id}','porte')">
          <span class="cb-icon${item.porte?' cb-active':''}">⚖️</span>
        </label>
        <label class="cb-label" title="Sur moi">
          <input type="checkbox" class="cb-toggle" ${item.surMoi?'checked':''} onchange="inv.toggleField('${item.id}','surMoi')">
          <span class="cb-icon${item.surMoi?' cb-active':''}">👤</span>
        </label>
      </td>
      <td class="text-r td-weight" data-label="Poids total">${wLabel}</td>
      <td class="text-r hide-sm td-price" data-label="Prix / u">${prix.toFixed(2)} pm</td>
      <td class="hide-md-only td-stats" data-label="Caractéristiques">${statsHtml}</td>
      <td class="text-c td-actions" style="white-space:nowrap">
        <button class="icon-btn" onclick="inv.openModal('${item.id}')" title="Modifier" aria-label="Modifier">✏️</button>
        <button class="icon-btn" onclick="inv.openMoveModal('${item.id}')" title="Déplacer vers…" aria-label="Déplacer">🔄</button>
        <button class="icon-btn" onclick="inv.dupeItem('${item.id}')" title="Dupliquer" aria-label="Dupliquer">📋</button>
        <button class="icon-btn del" onclick="inv.deleteItem('${item.id}')" title="Supprimer" aria-label="Supprimer">🗑️</button>
      </td>
    </tr>`;
  }

  /* ──────── Tri ──────── */

  setSort(key) {
    this.sortDir = this.sortKey === key ? -this.sortDir : 1;
    this.sortKey = key;
    document.querySelectorAll('th[data-sort]').forEach(th => {
      th.classList.remove('sort-asc', 'sort-desc');
      if (th.dataset.sort === key) th.classList.add(this.sortDir===1?'sort-asc':'sort-desc');
    });
    this._renderTable();
  }

  /* ──────── Export individuel ──────── */

  exportJSON() {
    _downloadJSON({
      inventaire: this.title, exportedAt: new Date().toISOString(),
      items: this.items, customCats: this.customCats,
    }, `${this.key}-${_today()}.json`);
  }

  /* ──────── Impression PDF A4 ──────── */

  printInventory() {
    const TYPE_ORDER = { arme: 0, armure: 1, autre: 2 };
    const sorted = [...this.items].sort((a, b) => {
      const ta = TYPE_ORDER[a.type||'autre'] ?? 2, tb = TYPE_ORDER[b.type||'autre'] ?? 2;
      if (ta !== tb) return ta - tb;
      const ca = (a.categorie||'').toLowerCase(), cb = (b.categorie||'').toLowerCase();
      if (ca !== cb) return ca < cb ? -1 : 1;
      return (a.nom||'').toLowerCase() < (b.nom||'').toLowerCase() ? -1 : 1;
    });

    const win = window.open('', '_blank', 'width=860,height=760');
    if (!win) { _showToast('Autorisez les popups pour générer le PDF.', { type: 'warn' }); return; }
    win.document.write(this._buildPrintHTML(sorted));
    win.document.close();
  }

  _buildPrintHTML(items) {
    const now   = new Date();
    const date  = now.toLocaleDateString('fr-FR', { day:'2-digit', month:'long', year:'numeric' });
    const totalW = items.reduce((s,i)=>{ const r=(parseFloat(i.poids)||0)*(parseFloat(i.quantite)||0); return s+(i.porte?r/2:r); },0);
    const totalV = items.reduce((s,i)=>s+(parseFloat(i.prix)||0)*(parseFloat(i.quantite)||0),0);
    const totalQ = items.reduce((s,i)=>s+(parseInt(i.quantite)||0),0);
    const nbMagic = items.filter(i=>i.magique).length;

    /* ── Groupes par catégorie ── */
    const groups = [];
    let lastCat = null;
    for (const item of items) {
      if (item.categorie !== lastCat) {
        groups.push({ cat: item.categorie, type: item.type||'autre', items: [] });
        lastCat = item.categorie;
      }
      groups[groups.length-1].items.push(item);
    }

    const TYPE_ICON_PRINT = { arme:'⚔', armure:'🛡', autre:'◆' };
    const esc = s => s==null?'':String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

    const rows = groups.map(g => {
      const groupHdr = `<tr class="group-header">
        <td colspan="6">${TYPE_ICON_PRINT[g.type]||'◆'} ${esc(g.cat)}</td>
      </tr>`;
      const itemRows = g.items.map(item => {
        const type  = item.type||'autre';
        const poids = parseFloat(item.poids)||0;
        const prix  = parseFloat(item.prix) ||0;
        const qty   = parseInt(item.quantite)||0;
        const effW  = poids * qty * (item.porte ? .5 : 1);

        const flags = [
          item.magique ? '✨ Magique'         : '',
          item.surMoi  ? '👤 Sur moi'          : '',
          item.porte   ? '⚖ Porté (poids ÷2)' : '',
        ].filter(Boolean).join(' · ');

        let stats = '';
        if (type === 'arme') {
          const chips = [
            ['Init', item.initiative], ['Atq', item.attaque],
            ['Par',  item.parade],     ['Par2', item.seconde_parade],
            ['Dmg',  item.dommage],
          ].filter(([,v])=>v&&String(v).trim())
           .map(([k,v])=>`<span class="sc">${k}&nbsp;<b>${esc(v)}</b></span>`).join('');
          const autres = item.autres?.trim()
            ? `<div class="ct">${esc(item.autres)}</div>` : '';
          stats = chips + autres;
        } else if (type === 'armure') {
          stats = item.encaissement ? `<span class="sc">Enc&nbsp;<b>${esc(item.encaissement)}</b></span>` : '';
        } else {
          stats = item.caracteristiques
            ? `<div class="ct">${esc(item.caracteristiques)}</div>` : '';
        }

        return `<tr>
          <td>
            <span class="badge badge-${type}">${esc(item.categorie)}</span>
          </td>
          <td>
            <div class="iname">${esc(item.nom)}${item.magique?' <span class="mx">✨</span>':''}</div>
            ${flags ? `<div class="iflags">${flags}</div>` : ''}
          </td>
          <td class="tc">${qty}</td>
          <td class="tr">${effW.toFixed(2)}&nbsp;kg${item.porte?'<sup>÷2</sup>':''}</td>
          <td class="tr">${(prix*qty).toFixed(2)}&nbsp;pm</td>
          <td>${stats}</td>
        </tr>`;
      }).join('');
      return groupHdr + itemRows;
    }).join('');

    const magicStat = nbMagic > 0
      ? `<div class="si"><span>✨</span>${nbMagic} magique${nbMagic>1?'s':''}</div>` : '';

    return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>Inventaire ${esc(this.title)} — ${date}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
@page { size: A4 portrait; margin: 14mm 12mm 14mm 12mm; }
*    { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Crimson Text', Georgia, serif; font-size: 10.5pt; color: #1E0F07; background: #fff; line-height: 1.45; }

/* ── Header ── */
.hdr { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 9px; border-bottom: 2.5pt solid #3D1F0D; margin-bottom: 10px; }
.hdr-l h1 { font-family: 'Cinzel', serif; font-size: 17pt; color: #3D1F0D; letter-spacing: 2px; font-weight: 700; }
.hdr-l h1 .orn { color: #B8860B; }
.hdr-l p   { font-style: italic; color: #7A5C4F; font-size: 9.5pt; margin-top: 3px; }
.hdr-r     { text-align: right; font-size: 8.5pt; color: #7A5C4F; line-height: 1.7; }
.hdr-r strong { color: #3D1F0D; font-size: 9pt; }

/* ── Stats bar ── */
.sbar { display: flex; gap: 0; border: 1pt solid #D6C49A; border-radius: 4px; margin-bottom: 12px; overflow: hidden; }
.si   { flex: 1; padding: 6px 10px; font-size: 9.5pt; font-weight: 600; color: #3D1F0D; background: #F5EDD8; border-right: 1pt solid #D6C49A; }
.si:last-child { border-right: none; }
.si span { color: #B8860B; margin-right: 5px; }

/* ── Table ── */
table { width: 100%; border-collapse: collapse; font-size: 9pt; }
thead tr th { background: #3D1F0D; color: #F5EDD8; padding: 5px 7px; font-family: 'Cinzel', serif; font-size: 7pt; font-weight: 600; letter-spacing: 1px; text-align: left; }
td  { padding: 5px 7px; border-bottom: 0.4pt solid #E8D5B0; vertical-align: top; }
tr:nth-child(even) td { background: #FEFCF5; }
tr.group-header td {
  background: #6B3A2A;
  color: #F5EDD8;
  font-family: 'Cinzel', serif;
  font-size: 7.5pt;
  font-weight: 600;
  letter-spacing: 1.5px;
  padding: 4px 7px;
  border-bottom: none;
  text-transform: uppercase;
}
tr.group-header:not(:first-child) td { border-top: 1pt solid #3D1F0D; margin-top: 4pt; }
tr { page-break-inside: avoid; }

/* Cols */
.tc { text-align: center; }
.tr { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
sup { font-size: 6pt; color: #1565C0; }

/* ── Badges ── */
.badge { display: inline-block; padding: 1px 6px; border-radius: 8px; font-size: 7.5pt; font-weight: 700; white-space: nowrap; }
.badge-arme   { background: #FFEBEE; color: #7B0000; border: 0.4pt solid #EF9A9A; }
.badge-armure { background: #E3F2FD; color: #0D3B7A; border: 0.4pt solid #90CAF9; }
.badge-autre  { background: #EDE7F6; color: #311B92; border: 0.4pt solid #B39DDB; }

/* ── Item name ── */
.iname  { font-weight: 600; font-size: 10pt; color: #1E0F07; }
.mx     { font-size: 9pt; }
.iflags { font-size: 7pt; color: #7A5C4F; margin-top: 2px; font-style: italic; }

/* ── Stats ── */
.sc { display: inline-block; background: #F5EDD8; border: 0.4pt solid #D6C49A; border-radius: 2px; padding: 0 4px; font-size: 7.5pt; margin: 1px 2px 1px 0; white-space: nowrap; }
.ct { font-size: 8.5pt; font-style: italic; color: #2F1B14; margin-top: 1px; line-height: 1.4; }

/* ── Totals row ── */
.totals td { background: #3D1F0D !important; color: #F5EDD8 !important; font-weight: 700; font-family: 'Cinzel', serif; font-size: 8.5pt; border-bottom: none !important; padding: 6px 7px; }

/* ── Footer ── */
.ftr { margin-top: 12px; padding-top: 7px; border-top: 0.5pt solid #D6C49A; display: flex; justify-content: space-between; font-size: 8pt; color: #7A5C4F; font-style: italic; }

/* Print colours */
@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>

<!-- HEADER -->
<div class="hdr">
  <div class="hdr-l">
    <h1><span class="orn">⚜</span> INVENTAIRE &nbsp;·&nbsp; ${esc(this.title).toUpperCase()}</h1>
    <p>Liste complète des objets — ${items.length} entr${items.length>1?'ées':'ée'}</p>
  </div>
  <div class="hdr-r">
    <strong>${date}</strong><br>
    Généré depuis Le Registre<br>
    <em>Inventaires de Stella</em>
  </div>
</div>

<!-- STATS BAR -->
<div class="sbar">
  <div class="si"><span>📦</span>${items.length} objet${items.length>1?'s':''}</div>
  <div class="si"><span>⚖</span>${totalW.toFixed(2)} kg (effectif)</div>
  <div class="si"><span>💰</span>${totalV.toFixed(2)} pm</div>
  ${magicStat}
</div>

<!-- TABLE -->
<table>
  <thead>
    <tr>
      <th style="width:13%">Catégorie</th>
      <th style="width:25%">Nom de l'objet</th>
      <th style="width:5%;text-align:center">Qté</th>
      <th style="width:11%;text-align:right">Poids total</th>
      <th style="width:11%;text-align:right">Prix total</th>
      <th>Caractéristiques / Statistiques</th>
    </tr>
  </thead>
  <tbody>${rows}</tbody>
  <tfoot>
    <tr class="totals">
      <td colspan="2">⚜ TOTAUX</td>
      <td class="tc">${totalQ}</td>
      <td class="tr">${totalW.toFixed(2)} kg</td>
      <td class="tr">${totalV.toFixed(2)} pm</td>
      <td style="font-size:7.5pt;font-weight:400;color:#E8D5B0">* poids effectif (÷2 si porté)</td>
    </tr>
  </tfoot>
</table>

<!-- FOOTER -->
<div class="ftr">
  <span>⚜ Le Registre — Inventaires de Stella</span>
  <span>Imprimé le ${date}</span>
</div>

<script>
  // Police chargée → impression automatique
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function() { setTimeout(function(){ window.print(); }, 400); });
  } else {
    setTimeout(function(){ window.print(); }, 800);
  }
</script>
</body>
</html>`;
  }

  _updateIndexCounts() {
    const el = document.getElementById(`count-${this.key}`);
    if (el) el.textContent = this.items.length + ' objet' + (this.items.length > 1 ? 's' : '');
  }

  /* ──────── Liaison événements ──────── */

  _bindEvents() {
    document.getElementById('searchInput')?.addEventListener('input', e => { this.filter = e.target.value; this._renderTable(); });
    document.getElementById('typeFilter')?.addEventListener('change', e => { this.typeFilter = e.target.value; this._renderTable(); });
    document.getElementById('magicFilter')?.addEventListener('change', e => { this.magicFilter = e.target.checked; this._renderTable(); });
    document.getElementById('formCategorie')?.addEventListener('change', () => this._switchTypeFromCatSelect());

    document.getElementById('itemModal')?.addEventListener('click', e => { if (e.target.id==='itemModal') this.closeModal(); });
    document.getElementById('moveModal')?.addEventListener('click', e => { if (e.target.id==='moveModal') this.closeMoveModal(); });
    document.addEventListener('keydown', e => { if (e.key==='Escape') { this.closeModal(); this.closeMoveModal(); } });

    /* Raccourci « / » → focus recherche */
    document.addEventListener('keydown', e => {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      e.preventDefault();
      document.getElementById('searchInput')?.focus();
    });

    document.getElementById('itemForm')?.addEventListener('submit', e => { e.preventDefault(); this.submitForm(false); });
    document.getElementById('btnSaveNew')?.addEventListener('click', () => this.submitForm(true));

    /* Ajout rapide */
    document.getElementById('quickAdd')?.addEventListener('submit', e => { e.preventDefault(); this.quickAdd(e.target); });

    /* Quantité déplacement : clamper à la volée */
    document.getElementById('moveQty')?.addEventListener('input', e => {
      const max = parseInt(e.target.max) || 1;
      if (parseInt(e.target.value) > max) e.target.value = max;
      if (parseInt(e.target.value) < 1)   e.target.value = 1;
    });

    /* Import individuel/global (auto-détection) */
    document.getElementById('importFile')?.addEventListener('change', e => {
      const f = e.target.files[0];
      if (!f) return;
      globalImport(f);
      e.target.value = '';
    });

    document.getElementById('addCatBtn')?.addEventListener('click', () => {
      const inp    = document.getElementById('newCatInput');
      const typeEl = document.getElementById('newCatType');
      if (inp?.value.trim()) { this.addCategory(inp.value.trim(), typeEl?.value || 'autre'); inp.value=''; }
    });
    document.getElementById('newCatInput')?.addEventListener('keydown', e => {
      if (e.key==='Enter') { e.preventDefault(); document.getElementById('addCatBtn')?.click(); }
    });

    document.querySelectorAll('th[data-sort]').forEach(th => {
      th.addEventListener('click', () => this.setSort(th.dataset.sort));
    });
  }
}

/* ══════════════════════════════════════════════
   UTILITAIRES
   ══════════════════════════════════════════════ */

function _normCats(cc) {
  if (!Array.isArray(cc)) return [];
  return cc.map(c => typeof c === 'string' ? { nom: c, type: 'autre' } : c);
}

function _downloadJSON(obj, filename) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

/**
 * Notification empilable.
 * @param {string} msg
 * @param {{type?:'info'|'success'|'warn'|'danger', duration?:number, actionLabel?:string, onAction?:Function}} opts
 */
function _showToast(msg, opts = {}) {
  const { type = 'info', duration = 3400, actionLabel, onAction } = opts;

  let zone = document.getElementById('toastZone');
  if (!zone) {
    zone = Object.assign(document.createElement('div'), { id: 'toastZone' });
    zone.setAttribute('aria-live', 'polite');
    document.body.appendChild(zone);
  }

  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.appendChild(Object.assign(document.createElement('span'), { textContent: msg }));

  let timer;
  const dismiss = () => {
    clearTimeout(timer);
    t.classList.remove('toast-show');
    setTimeout(() => t.remove(), 320);
  };

  if (actionLabel && onAction) {
    const btn = Object.assign(document.createElement('button'), {
      className: 'toast-action', textContent: actionLabel, type: 'button'
    });
    btn.addEventListener('click', () => { onAction(); dismiss(); });
    t.appendChild(btn);
  }

  zone.appendChild(t);
  requestAnimationFrame(() => t.classList.add('toast-show'));
  timer = setTimeout(dismiss, duration);
}

/**
 * Dialogue de confirmation maison (remplace window.confirm).
 * @returns {Promise<boolean>}
 */
function _confirmDialog({ title = 'Confirmer', html = '', okLabel = 'Confirmer', cancelLabel = 'Annuler', danger = false } = {}) {
  return new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML = `
      <div class="modal-box confirm-box">
        <div class="modal-head">
          <h3>${title}</h3>
          <button class="modal-close" data-act="cancel" aria-label="Fermer">✕</button>
        </div>
        <div class="modal-body">
          <div class="confirm-msg">${html}</div>
        </div>
        <div class="modal-foot">
          <button class="btn btn-ghost" data-act="cancel">${cancelLabel}</button>
          <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-act="ok">${okLabel}</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    const close = (val) => {
      overlay.classList.remove('active');
      document.removeEventListener('keydown', onKey);
      setTimeout(() => overlay.remove(), 260);
      resolve(val);
    };
    const onKey = e => { if (e.key === 'Escape') close(false); };

    overlay.addEventListener('click', e => {
      if (e.target === overlay) close(false);
      const act = e.target.closest('[data-act]')?.dataset.act;
      if (act === 'ok')     close(true);
      if (act === 'cancel') close(false);
    });
    document.addEventListener('keydown', onKey);

    requestAnimationFrame(() => {
      overlay.classList.add('active');
      overlay.querySelector('[data-act="ok"]')?.focus();
    });
  });
}

function _esc(str) {
  if (str==null) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function _fmt(num, unit) { return (parseFloat(num)||0).toFixed(2) + ' ' + unit; }
function _today()        { return new Date().toISOString().slice(0,10); }
