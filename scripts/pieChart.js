import zlib from "zlib";

// ExcelJS cannot create charts, so the pie is drawn here and embedded as an
// image. Uses only Node's built-in zlib - nothing to install.

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

const crc32 = (buf) => {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++)
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};

const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
};

/** Encode an RGBA pixel buffer as a PNG. */
function encodePng(width, height, rgba) {
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type: RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const hexToRgb = (hex) => {
  const h = hex.replace("#", "").slice(-6);
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
};

/**
 * Draw a pie chart.
 * @param {{value:number, color:string}[]} slices
 * @param {{size?:number, samples?:number, gap?:number}} opts
 * @returns {Buffer} PNG buffer with a transparent background
 */
export function renderPieChart(slices, opts = {}) {
  const size = opts.size || 600;
  const samples = opts.samples || 3; // supersampling for smooth edges
  const gap = opts.gap ?? 0.0035; // sliver of background between slices

  const data = slices.filter((s) => s.value > 0);
  const total = data.reduce((sum, s) => sum + s.value, 0);
  if (!total) return null;

  // Cumulative slice boundaries as fractions of a full turn
  let acc = 0;
  const bounds = data.map((s) => {
    const from = acc;
    acc += s.value / total;
    return { from, to: acc, rgb: hexToRgb(s.color) };
  });

  const centre = size / 2;
  const radius = centre - size * 0.02;
  const rgba = Buffer.alloc(size * size * 4); // zero-filled = transparent
  const step = 1 / samples;
  const perPixel = samples * samples;
  const multi = bounds.length > 1;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let hits = 0;

      for (let sy = 0; sy < samples; sy++) {
        for (let sx = 0; sx < samples; sx++) {
          const dx = x + (sx + 0.5) * step - centre;
          const dy = y + (sy + 0.5) * step - centre;
          if (dx * dx + dy * dy > radius * radius) continue;

          // Angle measured clockwise from 12 o'clock, as a 0..1 fraction
          let theta = Math.atan2(dx, -dy);
          if (theta < 0) theta += Math.PI * 2;
          const frac = theta / (Math.PI * 2);

          const slice =
            bounds.find((s) => frac >= s.from && frac < s.to) ||
            bounds[bounds.length - 1];

          // Leave a gap on each boundary so neighbouring slices stay distinct
          if (multi && (frac - slice.from < gap || slice.to - frac < gap))
            continue;

          r += slice.rgb[0];
          g += slice.rgb[1];
          b += slice.rgb[2];
          hits++;
        }
      }

      if (!hits) continue;
      const i = (y * size + x) * 4;
      rgba[i] = Math.round(r / hits);
      rgba[i + 1] = Math.round(g / hits);
      rgba[i + 2] = Math.round(b / hits);
      rgba[i + 3] = Math.round((hits / perPixel) * 255);
    }
  }

  return encodePng(size, size, rgba);
}

export default renderPieChart;
