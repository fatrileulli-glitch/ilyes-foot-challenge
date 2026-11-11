/* Ilyes Foot Challenge – logique de l'appli */
const D = Store.load();
const $view = document.getElementById('view');

/* ---------- Utilitaires dates ---------- */
const pad = n => String(n).padStart(2, '0');
const toISO = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const today = () => toISO(new Date());
const parseISO = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (s, n) => { const d = parseISO(s); d.setDate(d.getDate() + n); return toISO(d); };
const fmtDate = (s, opts = { weekday: 'short', day: 'numeric', month: 'short' }) =>
  parseISO(s).toLocaleDateString('fr-FR', opts);
const fmtShort = s => { const d = parseISO(s); return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`; };
/* Une saison va d'août à juillet. */
const seasonOf = s => { const d = parseISO(s); const y = d.getMonth() >= 7 ? d.getFullYear() : d.getFullYear() - 1; return `${y}-${y + 1}`; };
const currentSeason = () => seasonOf(today());
const dayNumber = s => Math.round(parseISO(s).getTime() / 86400000);

function toast(msg, ms = 2600) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.add('hidden'), ms);
}

function openModal(html, onMount) {
  const m = document.getElementById('modal');
  document.getElementById('modal-card').innerHTML = html;
  m.classList.remove('hidden');
  if (onMount) onMount(document.getElementById('modal-card'));
}
function closeModal() { document.getElementById('modal').classList.add('hidden'); }
document.getElementById('modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });

function save() { Store.save(); checkBadges(); }

function resultOf(m) {
  if (m.scoreNous == null || m.scoreEux == null || m.scoreNous === '' || m.scoreEux === '') return null;
  return +m.scoreNous > +m.scoreEux ? 'win' : +m.scoreNous < +m.scoreEux ? 'loss' : 'draw';
}
const RES_LABEL = { win: 'Victoire', draw: 'Nul', loss: 'Défaite' };

/* ---------- Défi du jour ---------- */
function defiOf(dateStr) {
  const n = DEFIS.length;
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const mult = [5, 7, 11, 13, 17].find(k => gcd(k, n) === 1) || 1;
  return DEFIS[(dayNumber(dateStr) * mult) % n];
}
function streak() {
  let d = today();
  if (!D.defis[d]) d = addDays(d, -1);
  let s = 0;
  while (D.defis[d]) { s++; d = addDays(d, -1); }
  return s;
}
function bestStreak() {
  const days = Object.keys(D.defis).sort();
  let best = 0, cur = 0, prev = null;
  days.forEach(d => { cur = prev && addDays(prev, 1) === d ? cur + 1 : 1; best = Math.max(best, cur); prev = d; });
  return best;
}

/* ---------- Badges ---------- */
const BADGES = [
  { id: 'premier-match', ico: '📒', name: 'Premier match', desc: 'Noter un match dans le carnet', test: () => D.matches.length >= 1 },
  { id: 'buteur', ico: '⚽', name: 'Buteur', desc: 'Marquer son premier but', test: () => totalOf(D.matches, 'buts') >= 1 },
  { id: 'triple', ico: '🎩', name: 'Coup du chapeau', desc: '3 buts dans un même match', test: () => D.matches.some(m => +m.buts >= 3) },
  { id: 'buts-10', ico: '🔥', name: '10 buts', desc: '10 buts au total', test: () => totalOf(D.matches, 'buts') >= 10 },
  { id: 'passeur', ico: '🎯', name: 'Passeur', desc: '5 passes décisives au total', test: () => totalOf(D.matches, 'passes') >= 5 },
  { id: 'jong-10', ico: '🦶', name: '10 jongles', desc: 'Record de 10 jongles', test: () => D.juggle.record >= 10 },
  { id: 'jong-50', ico: '🥉', name: '50 jongles', desc: 'Record de 50 jongles', test: () => D.juggle.record >= 50 },
  { id: 'jong-100', ico: '🥈', name: '100 jongles', desc: 'Record de 100 jongles', test: () => D.juggle.record >= 100 },
  { id: 'jong-250', ico: '🥇', name: '250 jongles', desc: 'Record de 250 jongles', test: () => D.juggle.record >= 250 },
  { id: 'defi-1', ico: '✅', name: 'Premier défi', desc: 'Réussir un défi du jour', test: () => Object.keys(D.defis).length >= 1 },
  { id: 'serie-3', ico: '📆', name: '3 jours d\'affilée', desc: 'Défi du jour 3 jours de suite', test: () => bestStreak() >= 3 },
  { id: 'serie-10', ico: '🏅', name: '10 jours d\'affilée', desc: 'Défi du jour 10 jours de suite', test: () => bestStreak() >= 10 },
  { id: 'defis-30', ico: '💪', name: '30 défis', desc: '30 défis réussis au total', test: () => Object.keys(D.defis).length >= 30 },
  { id: 'quiz-parfait', ico: '🧠', name: 'Sans faute', desc: '10/10 à un quiz', test: () => D.quiz.perfect },
  { id: 'quiz-expert', ico: '🎓', name: 'Expert du foot', desc: 'Au moins 8/10 au niveau Expert', test: () => (D.quiz.best.expert || 0) >= 8 },
  { id: 'album-5', ico: '📸', name: 'Collectionneur', desc: '5 souvenirs avec un « meilleur moment »', test: () => D.matches.filter(m => m.moment).length >= 5 }
];
function checkBadges(silent = false) {
  const unlocked = [];
  BADGES.forEach(b => {
    if (!D.badges[b.id] && b.test()) { D.badges[b.id] = today(); unlocked.push(b); }
  });
  if (unlocked.length) {
    Store.save();
    if (!silent) toast(`🏆 Badge débloqué : ${unlocked.map(b => b.name).join(', ')} !`, 3500);
  }
}
function totalOf(list, key) { return list.reduce((s, m) => s + (+m[key] || 0), 0); }

/* ---------- Navigation ---------- */
const VIEWS = { accueil: viewAccueil, carnet: viewCarnet, defis: viewDefis, agenda: viewAgenda, quiz: viewQuiz, album: viewAlbum };
let state = { carnetSeason: currentSeason(), albumSeason: currentSeason(), defisTab: 'jour', showPast: false };

function go(tab) {
  if (!VIEWS[tab]) tab = 'accueil';
  if (location.hash !== '#' + tab) history.replaceState(null, '', '#' + tab);
  document.querySelectorAll('.tabbar button').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  stopJuggle();
  VIEWS[tab]();
  window.scrollTo(0, 0);
}
document.querySelectorAll('.tabbar button').forEach(b => b.addEventListener('click', () => go(b.dataset.tab)));
window.addEventListener('hashchange', () => go(location.hash.slice(1)));

/* ---------- Accueil ---------- */
function upcomingEvents() {
  const t = today();
  return D.events.filter(e => e.date >= t).sort((a, b) => (a.date + (a.heureRdv || a.heureDebut || '')).localeCompare(b.date + (b.heureRdv || b.heureDebut || '')));
}
function viewAccueil() {
  const next = upcomingEvents()[0];
  const defi = defiOf(today());
  const done = D.defis[today()];
  const season = D.matches.filter(m => seasonOf(m.date) === currentSeason());
  const name = esc(D.profile.name || 'champion');
  $view.innerHTML = `
    <h2>Salut ${name} 👋</h2>
    <div class="card ${done ? '' : 'highlight'}">
      <div class="row between"><h3>🎯 Défi du jour</h3>${done ? '<span class="tag win">Réussi ✓</span>' : ''}</div>
      <p><b>${esc(defi.titre)}</b> <span class="tag">${esc(defi.cat)}</span></p>
      <p class="small">${esc(defi.desc)}</p>
      <div class="row between"><span class="small muted">🔥 Série : ${streak()} jour(s)</span>
      <button class="btn small" onclick="go('defis')">Voir le défi</button></div>
    </div>
    <div class="card">
      <h3>📅 Prochain rendez-vous</h3>
      ${next ? eventLine(next) : '<p class="muted small">Rien de prévu. Ajoute les entraînements et matchs dans l\'agenda.</p>'}
      <button class="btn secondary small" onclick="go('agenda')">Ouvrir l'agenda</button>
    </div>
    <div class="card">
      <h3>📒 Saison ${currentSeason()}</h3>
      <div class="stats">
        <div class="stat"><b>${season.length}</b><span>matchs</span></div>
        <div class="stat"><b>${totalOf(season, 'buts')}</b><span>buts</span></div>
        <div class="stat"><b>${totalOf(season, 'passes')}</b><span>passes déc.</span></div>
        <div class="stat"><b>${D.juggle.record}</b><span>record jongles</span></div>
      </div>
      <div class="form-actions"><button class="btn" onclick="editMatch()">+ Noter un match</button></div>
    </div>
    <div class="card">
      <h3>🏆 Badges : ${Object.keys(D.badges).length} / ${BADGES.length}</h3>
      <button class="btn secondary small" onclick="state.defisTab='badges';go('defis')">Voir mes badges</button>
    </div>`;
}

/* ---------- Carnet du joueur ---------- */
function seasonsList() {
  const s = new Set([currentSeason(), ...D.matches.map(m => seasonOf(m.date))]);
  return [...s].sort().reverse();
}
function viewCarnet() {
  const seasons = seasonsList();
  const list = D.matches.filter(m => seasonOf(m.date) === state.carnetSeason).sort((a, b) => a.date.localeCompare(b.date));
  const res = { win: 0, draw: 0, loss: 0 };
  list.forEach(m => { const r = resultOf(m); if (r) res[r]++; });
  const buts = totalOf(list, 'buts'), passes = totalOf(list, 'passes'), minutes = totalOf(list, 'minutes');

  let charts = '';
  if (list.length) {
    const labels = list.map(m => fmtShort(m.date));
    let cb = 0, cp = 0;
    const cumB = list.map(m => (cb += +m.buts || 0));
    const cumP = list.map(m => (cp += +m.passes || 0));
    const sBP = [
      { label: 'Buts', color: Charts.COLORS.buts, values: list.map(m => +m.buts || 0) },
      { label: 'Passes déc.', color: Charts.COLORS.passes, values: list.map(m => +m.passes || 0) }
    ];
    const sCum = [
      { label: 'Buts (cumul)', color: Charts.COLORS.buts, values: cumB },
      { label: 'Passes (cumul)', color: Charts.COLORS.passes, values: cumP }
    ];
    const sMin = [{ label: 'Minutes jouées', color: Charts.COLORS.minutes, values: list.map(m => +m.minutes || 0) }];
    charts = `
      <div class="card chart"><h3>Buts et passes par match</h3>${Charts.bars(labels, sBP)}${Charts.legend(sBP)}</div>
      <div class="card chart"><h3>Progression sur la saison</h3>${Charts.lines(labels, sCum)}${Charts.legend(sCum)}</div>
      <div class="card chart"><h3>Temps de jeu</h3>${Charts.bars(labels, sMin)}${Charts.legend(sMin)}</div>`;
  }

  $view.innerHTML = `
    <div class="row between"><h2>📒 Carnet du joueur</h2>
      <select id="season" style="width:auto">${seasons.map(s => `<option ${s === state.carnetSeason ? 'selected' : ''}>${s}</option>`).join('')}</select>
    </div>
    <button class="btn block" onclick="editMatch()">+ Noter un match</button>
    <div style="height:14px"></div>
    <div class="stats">
      <div class="stat"><b>${list.length}</b><span>matchs</span></div>
      <div class="stat"><b>${buts}</b><span>buts</span></div>
      <div class="stat"><b>${passes}</b><span>passes déc.</span></div>
      <div class="stat"><b>${minutes}</b><span>minutes</span></div>
      <div class="stat"><b>${res.win}-${res.draw}-${res.loss}</b><span>V-N-D</span></div>
      <div class="stat"><b>${list.length ? (buts / list.length).toFixed(1).replace('.', ',') : '0'}</b><span>buts / match</span></div>
    </div>
    <div style="height:14px"></div>
    ${charts}
    <div class="card"><h3>Mes matchs</h3>
      ${list.length ? `<ul class="list">${list.slice().reverse().map(matchLine).join('')}</ul>`
      : '<div class="empty"><div class="big">📒</div>Aucun match noté pour cette saison.<br>Après ton prochain match, note tes buts, tes passes et le score !</div>'}
    </div>`;
  document.getElementById('season').addEventListener('change', e => { state.carnetSeason = e.target.value; viewCarnet(); });
}
function matchLine(m) {
  const r = resultOf(m);
  const score = r ? `${m.scoreNous} - ${m.scoreEux}` : '';
  return `<li><div class="row between">
    <div class="grow"><b>${esc(m.adversaire || 'Match')}</b> ${r ? `<span class="tag ${r}">${RES_LABEL[r]} ${score}</span>` : ''}
      <div class="small muted">${fmtDate(m.date)} · ${m.domicile === 'ext' ? 'Extérieur' : 'Domicile'} · ⚽ ${+m.buts || 0} · 🎯 ${+m.passes || 0} · ⏱ ${+m.minutes || 0} min</div></div>
    <button class="btn ghost small" onclick="editMatch('${m.id}')">Modifier</button></div></li>`;
}

function editMatch(id, prefill = {}) {
  const m = id ? D.matches.find(x => x.id === id) : Object.assign({ date: today(), domicile: 'dom', buts: 0, passes: 0, minutes: '' }, prefill);
  if (!m) return;
  openModal(`
    <h2>${id ? 'Modifier le match' : 'Noter un match'}</h2>
    <form id="f-match">
      <div class="form-grid">
        <div><label>Date</label><input type="date" name="date" required value="${esc(m.date)}"></div>
        <div><label>Lieu</label><select name="domicile"><option value="dom" ${m.domicile !== 'ext' ? 'selected' : ''}>Domicile</option><option value="ext" ${m.domicile === 'ext' ? 'selected' : ''}>Extérieur</option></select></div>
      </div>
      <label>Adversaire</label><input name="adversaire" required placeholder="Nom de l'équipe adverse" value="${esc(m.adversaire || '')}">
      <div class="form-grid">
        <div><label>Score de mon équipe</label><input type="number" min="0" name="scoreNous" inputmode="numeric" value="${esc(m.scoreNous ?? '')}"></div>
        <div><label>Score adverse</label><input type="number" min="0" name="scoreEux" inputmode="numeric" value="${esc(m.scoreEux ?? '')}"></div>
        <div><label>⚽ Mes buts</label><input type="number" min="0" name="buts" inputmode="numeric" value="${esc(m.buts ?? 0)}"></div>
        <div><label>🎯 Passes décisives</label><input type="number" min="0" name="passes" inputmode="numeric" value="${esc(m.passes ?? 0)}"></div>
        <div><label>⏱ Temps de jeu (min)</label><input type="number" min="0" max="200" name="minutes" inputmode="numeric" value="${esc(m.minutes ?? '')}"></div>
      </div>
      <label>🌟 Mon meilleur moment</label><textarea name="moment" placeholder="Ex. : mon but du pied gauche en fin de match">${esc(m.moment || '')}</textarea>
      <label>📸 Photo souvenir (facultatif)</label><input type="file" name="photo" accept="image/*">
      <img id="photo-prev" class="photo-preview hidden" alt="">
      <label class="row" style="font-weight:400"><input type="checkbox" name="removePhoto" style="width:auto"> Supprimer la photo actuelle</label>
      <div class="form-actions">
        <button class="btn" type="submit">Enregistrer</button>
        <button class="btn ghost" type="button" onclick="closeModal()">Annuler</button>
        ${id ? `<button class="btn danger" type="button" id="del-match">Supprimer</button>` : ''}
      </div>
    </form>`, async card => {
    const prev = card.querySelector('#photo-prev');
    const removeRow = card.querySelector('[name=removePhoto]').closest('label');
    removeRow.style.display = 'none';
    if (id) {
      const p = await PhotoDB.get(id);
      if (p) { prev.src = p; prev.classList.remove('hidden'); removeRow.style.display = ''; }
    }
    prev.style.display = prev.classList.contains('hidden') ? 'none' : '';
    let newPhoto = null;
    card.querySelector('[name=photo]').addEventListener('change', async e => {
      const f = e.target.files[0];
      if (!f) return;
      try { newPhoto = await resizeImage(f); prev.src = newPhoto; prev.style.display = ''; }
      catch (err) { toast('Photo illisible, essaie une autre image.'); }
    });
    if (id) card.querySelector('#del-match').addEventListener('click', async () => {
      if (!confirm('Supprimer ce match du carnet et de l\'album ?')) return;
      D.matches = D.matches.filter(x => x.id !== id);
      await PhotoDB.del(id);
      save(); closeModal(); go(currentTab());
    });
    card.querySelector('#f-match').addEventListener('submit', async e => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const rec = id ? m : { id: Store.uid() };
      ['date', 'domicile', 'adversaire', 'moment'].forEach(k => rec[k] = (fd.get(k) || '').trim());
      ['scoreNous', 'scoreEux', 'minutes'].forEach(k => rec[k] = fd.get(k) === '' ? '' : Math.max(0, +fd.get(k)));
      ['buts', 'passes'].forEach(k => rec[k] = Math.max(0, +fd.get(k) || 0));
      if (!id) D.matches.push(rec);
      try {
        if (newPhoto) { await PhotoDB.put(rec.id, newPhoto); rec.hasPhoto = true; }
        else if (fd.get('removePhoto')) { await PhotoDB.del(rec.id); rec.hasPhoto = false; }
      } catch (err) { toast('La photo n\'a pas pu être enregistrée.'); }
      state.carnetSeason = seasonOf(rec.date);
      save(); closeModal();
      toast(rec.buts > 0 ? `Bravo pour ${rec.buts > 1 ? 'tes ' + rec.buts + ' buts' : 'ton but'} ! ⚽` : 'Match enregistré ✓');
      go(currentTab());
    });
  });
}
const currentTab = () => (location.hash.slice(1) || 'accueil');

/* ---------- Défis ---------- */
let juggle = { count: 0, active: false };
function stopJuggle() { juggle = { count: 0, active: false }; document.onkeydown = null; }

function viewDefis() {
  const tab = state.defisTab;
  $view.innerHTML = `
    <h2>🎯 Défis à la maison</h2>
    <div class="segmented">
      <button data-t="jour" class="${tab === 'jour' ? 'active' : ''}">Défi du jour</button>
      <button data-t="jongles" class="${tab === 'jongles' ? 'active' : ''}">Jongles</button>
      <button data-t="badges" class="${tab === 'badges' ? 'active' : ''}">Badges</button>
    </div>
    <div id="defis-body"></div>`;
  $view.querySelectorAll('.segmented button').forEach(b => b.addEventListener('click', () => { stopJuggle(); state.defisTab = b.dataset.t; viewDefis(); }));
  ({ jour: defisJour, jongles: defisJongles, badges: defisBadges })[tab](document.getElementById('defis-body'));
}

function defisJour(el) {
  const t = today();
  const defi = defiOf(t);
  const done = D.defis[t];
  const s = streak();
  const next = [1, 2, 3].map(i => ({ d: addDays(t, i), f: defiOf(addDays(t, i)) }));
  const last14 = Array.from({ length: 14 }, (_, i) => addDays(t, i - 13));
  el.innerHTML = `
    <div class="card ${done ? '' : 'highlight'}">
      <span class="tag">${esc(defi.cat)}</span>
      <h3 style="margin-top:8px">${esc(defi.titre)}</h3>
      <p>${esc(defi.desc)}</p>
      <p><b>Objectif :</b> ${esc(defi.objectif)}</p>
      ${done ? '<p class="tag win">Défi réussi aujourd\'hui ✓</p><br><button class="btn ghost small" id="undo">Annuler</button>'
      : '<button class="btn block" id="done">J\'ai réussi le défi ! ✅</button>'}
      <p class="small muted">⚠️ Entraîne-toi dehors ou dans un espace dégagé, loin des fenêtres et des objets fragiles.</p>
    </div>
    <div class="card">
      <h3>🔥 Série en cours : ${s} jour${s > 1 ? 's' : ''}</h3>
      <p class="small muted">Meilleure série : ${bestStreak()} jour(s) · Défis réussis : ${Object.keys(D.defis).length}</p>
      <div class="row" style="gap:4px">${last14.map(d => `<span title="${fmtDate(d)}" style="width:20px;height:20px;border-radius:5px;display:inline-block;background:${D.defis[d] ? 'var(--green)' : 'var(--border)'}"></span>`).join('')}</div>
      <p class="small muted">Les 14 derniers jours</p>
    </div>
    <div class="card"><h3>Les prochains défis</h3><ul class="list">
      ${next.map(n => `<li><b>${fmtDate(n.d)}</b> – ${esc(n.f.titre)} <span class="tag">${esc(n.f.cat)}</span></li>`).join('')}
    </ul></div>`;
  const b = el.querySelector('#done');
  if (b) b.addEventListener('click', () => { D.defis[t] = defi.id; save(); toast('Bien joué ! 💪'); viewDefis(); });
  const u = el.querySelector('#undo');
  if (u) u.addEventListener('click', () => { delete D.defis[t]; Store.save(); viewDefis(); });
}

function defisJongles(el) {
  const sessions = D.juggle.sessions.slice(-15);
  el.innerHTML = `
    <div class="card" style="text-align:center">
      <div class="small muted">Record : <b id="rec">${D.juggle.record}</b> jongles</div>
      <button class="juggle-btn" id="jbtn" aria-label="Compter un jongle">0</button>
      <p class="juggle-hint small muted">Un parent ou un copain tape sur le ballon à chaque jongle<br>(ou touche Espace sur un ordinateur).</p>
      <div class="form-actions" style="justify-content:center">
        <button class="btn" id="jend">Ballon tombé – enregistrer</button>
        <button class="btn ghost" id="jreset">Remettre à 0</button>
      </div>
    </div>
    <div class="card">
      <h3>Saisir un score</h3>
      <div class="row"><input type="number" min="0" id="jmanual" placeholder="Nombre de jongles" inputmode="numeric" class="grow" style="width:auto">
      <button class="btn" id="jadd">Ajouter</button></div>
    </div>
    ${sessions.length ? `<div class="card chart"><h3>Mes dernières séries</h3>${Charts.bars(sessions.map(s => fmtShort(s.date)), [{ label: 'Jongles', color: Charts.COLORS.buts, values: sessions.map(s => s.count) }])}</div>` : ''}`;
  const btn = el.querySelector('#jbtn');
  const tap = () => { juggle.count++; juggle.active = true; btn.textContent = juggle.count; if (navigator.vibrate) navigator.vibrate(15); };
  btn.addEventListener('click', tap);
  document.onkeydown = e => { if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT') { e.preventDefault(); tap(); } };
  el.querySelector('#jreset').addEventListener('click', () => { juggle.count = 0; btn.textContent = '0'; });
  el.querySelector('#jend').addEventListener('click', () => {
    if (!juggle.count) return toast('Commence à compter d\'abord !');
    recordJuggle(juggle.count); juggle.count = 0;
  });
  el.querySelector('#jadd').addEventListener('click', () => {
    const v = parseInt(el.querySelector('#jmanual').value, 10);
    if (!(v > 0)) return toast('Entre un nombre de jongles.');
    recordJuggle(v);
  });
}
function recordJuggle(n) {
  const isRecord = n > D.juggle.record;
  D.juggle.sessions.push({ date: today(), count: n });
  if (D.juggle.sessions.length > 500) D.juggle.sessions = D.juggle.sessions.slice(-500);
  if (isRecord) D.juggle.record = n;
  save();
  toast(isRecord ? `🎉 Nouveau record : ${n} jongles !` : `${n} jongles enregistrés. Record : ${D.juggle.record}`);
  viewDefis();
}

function defisBadges(el) {
  el.innerHTML = `<div class="card"><p class="small muted">${Object.keys(D.badges).length} badge(s) débloqué(s) sur ${BADGES.length}</p>
    <div class="badges">${BADGES.map(b => {
      const on = D.badges[b.id];
      return `<div class="badge ${on ? 'on' : ''}"><div class="ico">${b.ico}</div><div class="name">${esc(b.name)}</div>
        <div class="desc">${on ? 'Le ' + fmtDate(on, { day: 'numeric', month: 'short', year: 'numeric' }) : esc(b.desc)}</div></div>`;
    }).join('')}</div></div>`;
}

/* ---------- Agenda du club ---------- */
function eventLine(e, actions = false) {
  const isMatch = e.type === 'match';
  return `<div class="row between"><div class="grow">
      <span class="tag ${isMatch ? 'match' : ''}">${isMatch ? 'Match' : 'Entraînement'}</span>
      <b>${isMatch && e.adversaire ? 'vs ' + esc(e.adversaire) : ''}</b>
      <div class="small"><b>${fmtDate(e.date, { weekday: 'long', day: 'numeric', month: 'long' })}</b></div>
      <div class="small muted">${e.heureRdv ? '🕒 RDV ' + esc(e.heureRdv) : ''}${e.heureDebut ? ' · Début ' + esc(e.heureDebut) : ''}${e.lieu ? '<br>📍 ' + esc(e.lieu) : ''}${e.notes ? '<br>📝 ' + esc(e.notes) : ''}</div>
    </div>
    ${actions ? `<div style="display:flex;flex-direction:column;gap:6px">
      <button class="btn ghost small" onclick="editEvent('${e.id}')">Modifier</button>
      <button class="btn ghost small" onclick="exportICS(['${e.id}'])">📲 Calendrier</button>
      ${isMatch && e.date <= today() ? `<button class="btn secondary small" onclick="eventToMatch('${e.id}')">→ Carnet</button>` : ''}
    </div>` : ''}</div>`;
}
function viewAgenda() {
  const up = upcomingEvents();
  const past = D.events.filter(e => e.date < today()).sort((a, b) => b.date.localeCompare(a.date));
  $view.innerHTML = `
    <h2>📅 Mon agenda du club</h2>
    <p class="small muted">Entraînements et matchs à Tremblay-en-France, à saisir à la main (par toi ou tes parents) d'après les infos données par le club.</p>
    <div class="form-actions" style="margin-top:0;margin-bottom:14px">
      <button class="btn" onclick="editEvent(null,'entrainement')">+ Entraînement</button>
      <button class="btn" onclick="editEvent(null,'match')">+ Match</button>
      ${up.length ? `<button class="btn ghost" onclick="exportICS()">📲 Tout exporter</button>` : ''}
    </div>
    <div class="card"><h3>À venir</h3>
      ${up.length ? `<ul class="list">${up.map(e => `<li>${eventLine(e, true)}</li>`).join('')}</ul>`
      : '<div class="empty"><div class="big">📅</div>Aucun rendez-vous à venir.</div>'}
    </div>
    ${past.length ? `<div class="card"><div class="row between"><h3>Passés (${past.length})</h3>
      <button class="btn ghost small" id="toggle-past">${state.showPast ? 'Masquer' : 'Afficher'}</button></div>
      ${state.showPast ? `<ul class="list">${past.map(e => `<li>${eventLine(e, true)}</li>`).join('')}</ul>` : ''}</div>` : ''}
    <p class="small muted">« 📲 Calendrier » crée un fichier .ics à ouvrir pour ajouter le rendez-vous dans l'agenda du téléphone.</p>`;
  const tp = document.getElementById('toggle-past');
  if (tp) tp.addEventListener('click', () => { state.showPast = !state.showPast; viewAgenda(); });
}
function knownPlaces() {
  return [...new Set(D.events.map(e => e.lieu).filter(Boolean))];
}
function editEvent(id, type = 'entrainement') {
  const e = id ? D.events.find(x => x.id === id) : { type, date: today(), heureRdv: '', heureDebut: '', lieu: '', adversaire: '', notes: '' };
  if (!e) return;
  openModal(`
    <h2>${id ? 'Modifier' : 'Ajouter'} ${e.type === 'match' ? 'un match' : 'un entraînement'}</h2>
    <form id="f-ev">
      <label>Type</label>
      <select name="type"><option value="entrainement" ${e.type !== 'match' ? 'selected' : ''}>Entraînement</option><option value="match" ${e.type === 'match' ? 'selected' : ''}>Match</option></select>
      <label>Date</label><input type="date" name="date" required value="${esc(e.date)}">
      <div class="form-grid">
        <div><label>Heure de rendez-vous</label><input type="time" name="heureRdv" value="${esc(e.heureRdv)}"></div>
        <div><label>Heure de début</label><input type="time" name="heureDebut" value="${esc(e.heureDebut)}"></div>
      </div>
      <label>Lieu (adresse ou nom du stade)</label>
      <input name="lieu" list="places" placeholder="Ex. : stade, gymnase, adresse…" value="${esc(e.lieu)}">
      <datalist id="places">${knownPlaces().map(p => `<option value="${esc(p)}">`).join('')}</datalist>
      <div id="adv-wrap"><label>Adversaire</label><input name="adversaire" value="${esc(e.adversaire)}"></div>
      <label>Notes (tenue, transport, à apporter…)</label><textarea name="notes">${esc(e.notes)}</textarea>
      ${id ? '' : `<label>Répéter chaque semaine jusqu'au (facultatif)</label><input type="date" name="repeat">`}
      <div class="form-actions">
        <button class="btn" type="submit">Enregistrer</button>
        <button class="btn ghost" type="button" onclick="closeModal()">Annuler</button>
        ${id ? '<button class="btn danger" type="button" id="del-ev">Supprimer</button>' : ''}
      </div>
    </form>`, card => {
    const typeSel = card.querySelector('[name=type]');
    const adv = card.querySelector('#adv-wrap');
    const sync = () => adv.style.display = typeSel.value === 'match' ? '' : 'none';
    typeSel.addEventListener('change', sync); sync();
    if (id) card.querySelector('#del-ev').addEventListener('click', () => {
      if (!confirm('Supprimer ce rendez-vous ?')) return;
      D.events = D.events.filter(x => x.id !== id); save(); closeModal(); viewAgenda();
    });
    card.querySelector('#f-ev').addEventListener('submit', ev => {
      ev.preventDefault();
      const fd = new FormData(ev.target);
      const base = {};
      ['type', 'date', 'heureRdv', 'heureDebut', 'lieu', 'adversaire', 'notes'].forEach(k => base[k] = (fd.get(k) || '').trim());
      if (base.type !== 'match') base.adversaire = '';
      if (id) Object.assign(e, base);
      else {
        const until = fd.get('repeat');
        let d = base.date, n = 0;
        do { D.events.push(Object.assign({ id: Store.uid() }, base, { date: d })); d = addDays(d, 7); n++; }
        while (until && d <= until && n < 60);
        if (n > 1) toast(`${n} rendez-vous ajoutés`);
      }
      save(); closeModal(); viewAgenda();
    });
  });
}
function eventToMatch(id) {
  const e = D.events.find(x => x.id === id);
  if (!e) return;
  editMatch(null, { date: e.date, adversaire: e.adversaire });
}
function icsEscape(s) { return String(s || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n'); }
function exportICS(ids) {
  const list = ids ? D.events.filter(e => ids.includes(e.id)) : upcomingEvents();
  if (!list.length) return;
  const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Ilyes Foot Challenge//FR', 'CALSCALE:GREGORIAN'];
  list.forEach(e => {
    const day = e.date.replace(/-/g, '');
    const startT = e.heureRdv || e.heureDebut;
    const title = e.type === 'match' ? `Match${e.adversaire ? ' vs ' + e.adversaire : ''}` : 'Entraînement foot';
    const desc = [e.heureRdv && 'Rendez-vous : ' + e.heureRdv, e.heureDebut && 'Début : ' + e.heureDebut, e.notes].filter(Boolean).join('\n');
    lines.push('BEGIN:VEVENT', `UID:${e.id}@ilyes-foot-challenge`, `DTSTAMP:${stamp}`);
    if (startT) {
      const [h, m] = startT.split(':').map(Number);
      const end = new Date(2000, 0, 1, h, m + 120);
      lines.push(`DTSTART:${day}T${pad(h)}${pad(m)}00`, `DTEND:${day}T${pad(end.getHours())}${pad(end.getMinutes())}00`);
    } else {
      lines.push(`DTSTART;VALUE=DATE:${day}`, `DTEND;VALUE=DATE:${addDays(e.date, 1).replace(/-/g, '')}`);
    }
    lines.push(`SUMMARY:${icsEscape(title)}`);
    if (e.lieu) lines.push(`LOCATION:${icsEscape(e.lieu)}`);
    if (desc) lines.push(`DESCRIPTION:${icsEscape(desc)}`);
    lines.push('END:VEVENT');
  });
  lines.push('END:VCALENDAR');
  download(lines.join('\r\n'), list.length === 1 ? `foot-${list[0].date}.ics` : 'agenda-foot.ics', 'text/calendar');
}
function download(content, filename, type) {
  const blob = new Blob([content], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

/* ---------- Quiz ---------- */
let quiz = null;
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function viewQuiz() {
  if (quiz && !quiz.finished) return renderQuestion();
  quiz = null;
  $view.innerHTML = `
    <h2>❓ Quiz foot</h2>
    <p class="muted">Règles du jeu, grands joueurs et clubs. 10 questions par partie.</p>
    ${Object.entries(QUIZ).map(([k, lvl]) => `
      <div class="card"><div class="row between">
        <div><h3>${lvl.label}</h3><div class="small muted">Meilleur score : ${D.quiz.best[k] != null ? D.quiz.best[k] + '/10' : '—'}</div></div>
        <button class="btn" onclick="startQuiz('${k}')">Jouer</button></div></div>`).join('')}
    <p class="small muted">Les règles indiquées sont celles du football à 11 (Lois du Jeu). Chez les jeunes, certaines règles changent selon la catégorie (taille du terrain, nombre de joueurs…) : demande à ton éducateur.</p>`;
}
function startQuiz(level) {
  const qs = shuffle(QUIZ[level].questions).slice(0, 10).map(q => {
    const order = shuffle(q.o.map((_, i) => i));
    return { ...q, o: order.map(i => q.o[i]), a: order.indexOf(q.a) };
  });
  quiz = { level, qs, i: 0, score: 0, answered: false, finished: false };
  renderQuestion();
}
function renderQuestion() {
  const q = quiz.qs[quiz.i];
  $view.innerHTML = `
    <div class="row between"><h2>❓ ${QUIZ[quiz.level].label}</h2><span class="small muted">${quiz.i + 1} / ${quiz.qs.length}</span></div>
    <div class="progress"><div style="width:${(quiz.i / quiz.qs.length) * 100}%"></div></div>
    <div class="card">
      <span class="tag">${esc(q.cat)}</span>
      <h3 style="margin-top:8px">${esc(q.q)}</h3>
      ${q.o.map((o, i) => `<button class="quiz-option" data-i="${i}">${esc(o)}</button>`).join('')}
      <div id="explain"></div>
    </div>
    <button class="btn ghost small" onclick="quiz=null;viewQuiz()">Quitter le quiz</button>`;
  $view.querySelectorAll('.quiz-option').forEach(b => b.addEventListener('click', () => answer(+b.dataset.i)));
}
function answer(i) {
  if (quiz.answered) return;
  quiz.answered = true;
  const q = quiz.qs[quiz.i];
  const ok = i === q.a;
  if (ok) quiz.score++;
  $view.querySelectorAll('.quiz-option').forEach(b => {
    const j = +b.dataset.i;
    if (j === q.a) b.classList.add('correct');
    else if (j === i) b.classList.add('wrong');
    b.disabled = true;
  });
  const last = quiz.i === quiz.qs.length - 1;
  document.getElementById('explain').innerHTML = `
    <p><b>${ok ? '✅ Bonne réponse !' : '❌ Raté !'}</b> ${esc(q.e)}</p>
    <button class="btn block" id="next">${last ? 'Voir mon score' : 'Question suivante'}</button>`;
  document.getElementById('next').addEventListener('click', () => {
    if (last) return finishQuiz();
    quiz.i++; quiz.answered = false; renderQuestion();
  });
}
function finishQuiz() {
  quiz.finished = true;
  const { score, level, qs } = quiz;
  const prevBest = D.quiz.best[level];
  if (prevBest == null || score > prevBest) D.quiz.best[level] = score;
  if (score === qs.length && qs.length === 10) D.quiz.perfect = true;
  D.quiz.played = (D.quiz.played || 0) + 1;
  save();
  const msg = score === 10 ? 'Sans faute, incroyable ! 🏆' : score >= 8 ? 'Excellent ! 🔥' : score >= 5 ? 'Pas mal, continue ! 💪' : 'Rejoue pour progresser ! 📚';
  $view.innerHTML = `
    <h2>❓ Résultat</h2>
    <div class="card" style="text-align:center">
      <div style="font-size:3rem;font-weight:800;color:var(--green)">${score}/${qs.length}</div>
      <p>${msg}</p>
      <p class="small muted">Niveau ${QUIZ[level].label} · Meilleur score : ${D.quiz.best[level]}/10</p>
      <div class="form-actions" style="justify-content:center">
        <button class="btn" onclick="startQuiz('${level}')">Rejouer</button>
        <button class="btn ghost" onclick="quiz=null;viewQuiz()">Changer de niveau</button>
      </div>
    </div>`;
}

/* ---------- Album de saison ---------- */
function viewAlbum() {
  const seasons = seasonsList();
  const list = D.matches.filter(m => seasonOf(m.date) === state.albumSeason).sort((a, b) => b.date.localeCompare(a.date));
  $view.innerHTML = `
    <div class="row between"><h2>📸 Album de saison</h2>
      <select id="aseason" style="width:auto">${seasons.map(s => `<option ${s === state.albumSeason ? 'selected' : ''}>${s}</option>`).join('')}</select>
    </div>
    <p class="small muted">Chaque match noté dans le carnet apparaît ici. Ajoute une photo et ton meilleur moment pour en faire un souvenir.</p>
    ${list.length ? `<div class="album">${list.map(m => {
      const r = resultOf(m);
      return `<div class="album-card">
        <div class="photo" data-photo="${m.id}">⚽</div>
        <div class="body">
          <div class="small muted">${fmtDate(m.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
          <div class="row between"><b>${m.domicile === 'ext' ? '@ ' : 'vs '}${esc(m.adversaire)}</b>${r ? `<span class="score">${m.scoreNous} - ${m.scoreEux}</span>` : ''}</div>
          <div class="small">${r ? `<span class="tag ${r}">${RES_LABEL[r]}</span> ` : ''}⚽ ${+m.buts || 0} · 🎯 ${+m.passes || 0}</div>
          ${m.moment ? `<blockquote>${esc(m.moment)}</blockquote>` : ''}
          <div class="form-actions" style="margin-top:10px"><button class="btn ghost small" onclick="editMatch('${m.id}')">Modifier</button></div>
        </div></div>`;
    }).join('')}</div>`
      : '<div class="card empty"><div class="big">📸</div>L\'album est vide pour cette saison.<br><br><button class="btn" onclick="editMatch()">+ Ajouter un match</button></div>'}`;
  document.getElementById('aseason').addEventListener('change', e => { state.albumSeason = e.target.value; viewAlbum(); });
  $view.querySelectorAll('[data-photo]').forEach(async el => {
    const p = await PhotoDB.get(el.dataset.photo);
    if (p) el.innerHTML = `<img src="${p}" alt="Photo du match">`;
  });
}

/* ---------- Réglages, sauvegarde ---------- */
document.getElementById('btn-settings').addEventListener('click', () => {
  openModal(`
    <h2>⚙️ Réglages</h2>
    <form id="f-prof">
      <label>Prénom du joueur</label><input name="name" value="${esc(D.profile.name)}">
      <label>Club</label><input name="club" placeholder="Nom du club" value="${esc(D.profile.club)}">
      <label>Poste</label><input name="poste" placeholder="Ex. : attaquant" value="${esc(D.profile.poste)}">
      <div class="form-actions"><button class="btn" type="submit">Enregistrer</button></div>
    </form>
    <hr style="border:0;border-top:1px solid var(--border);margin:18px 0">
    <h3>💾 Sauvegarde</h3>
    <p class="small muted">Les données restent uniquement sur cet appareil, dans le navigateur. Si le navigateur est effacé, elles sont perdues : pense à faire une sauvegarde de temps en temps. Elle permet aussi de passer sur un autre téléphone.</p>
    <div class="form-actions">
      <button class="btn secondary" id="exp">Exporter une sauvegarde</button>
      <label class="btn secondary" style="margin:0">Importer<input type="file" id="imp" accept="application/json,.json" hidden></label>
    </div>
    <div class="form-actions"><button class="btn danger small" id="reset">Tout effacer</button>
    <button class="btn ghost small" onclick="closeModal()">Fermer</button></div>`, card => {
    card.querySelector('#f-prof').addEventListener('submit', e => {
      e.preventDefault();
      const fd = new FormData(e.target);
      ['name', 'club', 'poste'].forEach(k => D.profile[k] = (fd.get(k) || '').trim());
      save(); updateTitle(); closeModal(); go(currentTab()); toast('Profil enregistré ✓');
    });
    card.querySelector('#exp').addEventListener('click', async () => {
      let photos = {};
      try { photos = await PhotoDB.all(); } catch (e) { /* pas de photos */ }
      download(JSON.stringify({ app: 'ilyes-foot-challenge', version: 1, exportedAt: new Date().toISOString(), data: D, photos }), `sauvegarde-foot-${today()}.json`, 'application/json');
    });
    card.querySelector('#imp').addEventListener('change', e => {
      const f = e.target.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = async () => {
        try {
          const json = JSON.parse(r.result);
          if (json.app !== 'ilyes-foot-challenge' || !json.data) throw new Error('format');
          if (!confirm('Remplacer toutes les données actuelles par cette sauvegarde ?')) return;
          Object.keys(D).forEach(k => delete D[k]);
          Object.assign(D, DEFAULT_DATA(), json.data);
          for (const [id, p] of Object.entries(json.photos || {})) await PhotoDB.put(id, p);
          Store.save(); checkBadges(true); updateTitle(); closeModal(); go('accueil'); toast('Sauvegarde importée ✓');
        } catch (err) { toast('Ce fichier n\'est pas une sauvegarde valide.'); }
      };
      r.readAsText(f);
    });
    card.querySelector('#reset').addEventListener('click', async () => {
      if (!confirm('Effacer TOUTES les données (matchs, agenda, records, badges, photos) ? C\'est définitif.')) return;
      Object.keys(D).forEach(k => delete D[k]);
      Object.assign(D, DEFAULT_DATA());
      try { const all = await PhotoDB.all(); for (const id of Object.keys(all)) await PhotoDB.del(id); } catch (e) { /* rien */ }
      Store.save(); updateTitle(); closeModal(); go('accueil');
    });
  });
});

function updateTitle() {
  const n = (D.profile.name || '').trim();
  document.getElementById('app-title').textContent = `⚽ ${n ? n + ' ' : ''}Foot Challenge`;
}

/* ---------- Démarrage ---------- */
updateTitle();
checkBadges(true);
go(location.hash.slice(1) || 'accueil');
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').catch(() => { /* hors ligne non disponible */ });
}
