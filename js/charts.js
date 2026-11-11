/* Petits graphiques SVG faits maison (pas de bibliothèque externe,
 * pour que l'appli marche aussi hors connexion). */
const Charts = {
  COLORS: { buts: '#0b7a3b', passes: '#1f6fd1', minutes: '#f2a900' },

  /* Barres groupées : séries = [{key, label, color, values[]}], labels = [] */
  bars(labels, series, { height = 180 } = {}) {
    const W = 340, H = height, padL = 26, padB = 26, padT = 10, padR = 6;
    const max = Math.max(1, ...series.flatMap(s => s.values));
    const step = niceStep(max);
    const top = Math.ceil(max / step) * step;
    const n = labels.length;
    const groupW = (W - padL - padR) / Math.max(n, 1);
    const barW = Math.max(2, Math.min(16, (groupW - 4) / series.length));
    const y = v => padT + (H - padT - padB) * (1 - v / top);
    let svg = `<svg viewBox="0 0 ${W} ${H}" role="img">`;
    for (let v = 0; v <= top; v += step) {
      svg += `<line class="axis" x1="${padL}" x2="${W - padR}" y1="${y(v)}" y2="${y(v)}"/>`;
      svg += `<text x="${padL - 4}" y="${y(v) + 3}" text-anchor="end">${v}</text>`;
    }
    labels.forEach((lab, i) => {
      const gx = padL + i * groupW + (groupW - barW * series.length) / 2;
      series.forEach((s, j) => {
        const v = s.values[i] || 0;
        const h = H - padB - y(v);
        svg += `<rect x="${gx + j * barW}" y="${y(v)}" width="${barW - 1}" height="${Math.max(0, h)}" rx="2" fill="${s.color}"><title>${esc(lab)} – ${s.label} : ${v}</title></rect>`;
      });
      if (n <= 12 || i % Math.ceil(n / 12) === 0) {
        svg += `<text x="${padL + i * groupW + groupW / 2}" y="${H - 8}" text-anchor="middle">${esc(lab)}</text>`;
      }
    });
    return svg + '</svg>';
  },

  /* Courbes : séries = [{label, color, values[]}] */
  lines(labels, series, { height = 180 } = {}) {
    const W = 340, H = height, padL = 26, padB = 26, padT = 10, padR = 10;
    const max = Math.max(1, ...series.flatMap(s => s.values));
    const step = niceStep(max);
    const top = Math.ceil(max / step) * step;
    const n = labels.length;
    const x = i => n <= 1 ? (W + padL - padR) / 2 : padL + (W - padL - padR) * i / (n - 1);
    const y = v => padT + (H - padT - padB) * (1 - v / top);
    let svg = `<svg viewBox="0 0 ${W} ${H}" role="img">`;
    for (let v = 0; v <= top; v += step) {
      svg += `<line class="axis" x1="${padL}" x2="${W - padR}" y1="${y(v)}" y2="${y(v)}"/>`;
      svg += `<text x="${padL - 4}" y="${y(v) + 3}" text-anchor="end">${v}</text>`;
    }
    series.forEach(s => {
      const pts = s.values.map((v, i) => `${x(i)},${y(v)}`).join(' ');
      svg += `<polyline points="${pts}" fill="none" stroke="${s.color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
      s.values.forEach((v, i) => {
        svg += `<circle cx="${x(i)}" cy="${y(v)}" r="3" fill="${s.color}"><title>${esc(labels[i])} – ${s.label} : ${v}</title></circle>`;
      });
    });
    labels.forEach((lab, i) => {
      if (n <= 12 || i % Math.ceil(n / 12) === 0) {
        svg += `<text x="${x(i)}" y="${H - 8}" text-anchor="middle">${esc(lab)}</text>`;
      }
    });
    return svg + '</svg>';
  },

  legend(series) {
    return `<div class="legend">${series.map(s => `<span><i style="background:${s.color}"></i>${s.label}</span>`).join('')}</div>`;
  }
};

function niceStep(max) {
  const raw = max / 4;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const n = raw / pow;
  const nice = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return Math.max(1, nice * pow);
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
