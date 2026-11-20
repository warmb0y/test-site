function createDisplacementMap(el) {
  const rect = el.getBoundingClientRect();
  const w = Math.round(rect.width), h = Math.round(rect.height);
  if (w < 4 || h < 4) return null;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  const imageData = ctx.createImageData(w, h);
  const data = imageData.data;
  let radius = parseFloat(window.getComputedStyle(el).borderRadius) || 22;
  radius = Math.min(radius, w / 2, h / 2);
  const cx = w / 2, cy = h / 2;
  const hw = w / 2 - radius, hh = h / 2 - radius;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const dx = Math.abs(x - cx) - hw;
      const dy = Math.abs(y - cy) - hh;
      const d = Math.sqrt(Math.max(dx, 0) ** 2 + Math.max(dy, 0) ** 2) - radius;
      let gx = 0, gy = 0;
      if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        gx = dx / len; gy = dy / len;
      }
      let strength = 0;
      if (d < 0) {
        const normDist = Math.min(1, Math.max(0, -d / radius));
        strength = (1 - normDist) * (1 - normDist);
      }
      strength = Math.min(1, strength * 1.2);
      data[idx] = Math.max(0, Math.min(255, Math.round(gx * strength * 127 + 128)));
      data[idx + 1] = Math.max(0, Math.min(255, Math.round(gy * strength * 127 + 128)));
      data[idx + 2] = 128;
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
}

export function initLiquidGlass() {
  const supportsSvgFilter = (() => {
    const div = document.createElement('div');
    div.style.backdropFilter = 'url(#test)';
    return div.style.backdropFilter !== '';
  })();

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', '0'); svg.setAttribute('height', '0');
  svg.style.position = 'absolute';
  svg.style.pointerEvents = 'none';
  document.body.appendChild(svg);

  const liquidEls = document.querySelectorAll('[data-liquid]');
  let idCounter = 0;
  liquidEls.forEach((el) => {
    const dataUrl = createDisplacementMap(el);
    if (!dataUrl) return;
    const filterId = `liquid-${idCounter++}`;
    const filter = document.createElementNS(svgNS, 'filter');
    filter.setAttribute('id', filterId);
    filter.setAttribute('x', '0'); filter.setAttribute('y', '0');
    filter.setAttribute('width', '100%'); filter.setAttribute('height', '100%');
    filter.setAttribute('filterUnits', 'objectBoundingBox');
    filter.setAttribute('color-interpolation-filters', 'sRGB');
    const feImage = document.createElementNS(svgNS, 'feImage');
    feImage.setAttribute('href', dataUrl);
    feImage.setAttribute('result', 'displacementMap');
    feImage.setAttribute('x', '0'); feImage.setAttribute('y', '0');
    feImage.setAttribute('width', '100%'); feImage.setAttribute('height', '100%');
    feImage.setAttribute('preserveAspectRatio', 'none');
    const feDisplacement = document.createElementNS(svgNS, 'feDisplacementMap');
    feDisplacement.setAttribute('in', 'SourceGraphic');
    feDisplacement.setAttribute('in2', 'displacementMap');
    feDisplacement.setAttribute('scale', '8');
    feDisplacement.setAttribute('xChannelSelector', 'R');
    feDisplacement.setAttribute('yChannelSelector', 'G');
    filter.appendChild(feImage);
    filter.appendChild(feDisplacement);
    svg.appendChild(filter);
    if (supportsSvgFilter) {
      el.style.backdropFilter = `url(#${filterId}) blur(0.3px) saturate(1.3)`;
      el.style.webkitBackdropFilter = `url(#${filterId}) blur(0.3px) saturate(1.3)`;
    }
  });
}