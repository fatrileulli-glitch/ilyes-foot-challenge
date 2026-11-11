/* Stockage local : tout reste sur l'appareil (localStorage pour les données,
 * IndexedDB pour les photos, plus volumineuses). Rien n'est envoyé sur Internet. */
const STORE_KEY = 'ifc-data-v1';

const DEFAULT_DATA = () => ({
  profile: { name: 'Ilyes', club: '', poste: '' },
  matches: [],   // {id, date, adversaire, domicile, scoreNous, scoreEux, buts, passes, minutes, moment, note}
  events: [],    // {id, type: 'entrainement'|'match', date, heureRdv, heureDebut, lieu, adversaire, notes}
  juggle: { record: 0, sessions: [] }, // sessions: {date, count}
  defis: {},     // { 'AAAA-MM-JJ': idDuDefi }
  quiz: { best: {}, perfect: false, played: 0 },
  badges: {}     // { idBadge: 'AAAA-MM-JJ' }
});

const Store = {
  data: null,
  load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      this.data = raw ? Object.assign(DEFAULT_DATA(), JSON.parse(raw)) : DEFAULT_DATA();
    } catch (e) {
      console.error(e);
      this.data = DEFAULT_DATA();
    }
    return this.data;
  },
  save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(this.data));
      return true;
    } catch (e) {
      console.error(e);
      alert('Impossible d\'enregistrer : la mémoire du navigateur est peut-être pleine.');
      return false;
    }
  },
  uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }
};

/* Photos dans IndexedDB */
const PhotoDB = {
  db: null,
  open() {
    if (this.db) return Promise.resolve(this.db);
    return new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) return reject(new Error('IndexedDB indisponible'));
      const req = indexedDB.open('ifc-photos', 1);
      req.onupgradeneeded = () => req.result.createObjectStore('photos');
      req.onsuccess = () => { this.db = req.result; resolve(this.db); };
      req.onerror = () => reject(req.error);
    });
  },
  async tx(mode, fn) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const t = db.transaction('photos', mode);
      const store = t.objectStore('photos');
      const req = fn(store);
      t.oncomplete = () => resolve(req && req.result);
      t.onerror = () => reject(t.error);
    });
  },
  put(id, dataUrl) { return this.tx('readwrite', s => s.put(dataUrl, id)); },
  get(id) { return this.tx('readonly', s => s.get(id)).catch(() => null); },
  del(id) { return this.tx('readwrite', s => s.delete(id)).catch(() => null); },
  async all() {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const out = {};
      const t = db.transaction('photos', 'readonly');
      const req = t.objectStore('photos').openCursor();
      req.onsuccess = () => {
        const c = req.result;
        if (c) { out[c.key] = c.value; c.continue(); } else resolve(out);
      };
      req.onerror = () => reject(req.error);
    });
  }
};

/* Réduit une photo (max 1000 px, JPEG) pour économiser la mémoire. */
function resizeImage(file, max = 1000, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Image illisible'));
      img.onload = () => {
        const ratio = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * ratio);
        c.height = Math.round(img.height * ratio);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
