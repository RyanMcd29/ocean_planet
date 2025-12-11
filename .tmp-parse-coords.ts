import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

function cleanString(value?: string | null): string | null {
  if (!value) return null;
  const normalized = value
    .replace(/\uFEFF/g, '')
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/�/g, '°')
    .trim();
  return normalized.length ? normalized : null;
}

function parseDms(part: string): number | null {
  const cleaned = part.replace(/−/g, '-');
  const parts = (cleaned.match(/-?\d+(?:\.\d+)?/g) || []).map(Number).filter((n) => !Number.isNaN(n));
  if (parts.length === 0) return null;
  const [deg, min = 0, sec = 0] = parts;
  const sign = /[SW]/i.test(part) || deg < 0 ? -1 : 1;
  const value = Math.abs(deg) + min / 60 + sec / 3600;
  return value * sign;
}

function parseCoordinates(raw: string | null, fallbackIndex = 0): { lat: number; lng: number } {
  const cleaned = cleanString(raw);
  if (cleaned) {
    const normalized = cleaned.replace(/[º�]/g, '°').replace(/\s+/g, ' ').trim();
    const decimalMatch = normalized.match(/-?\d+(?:\.\d+)?/g);
    if (decimalMatch && decimalMatch.length >= 2 && !normalized.includes('°') && !normalized.includes("'")) {
      return { lat: Number(decimalMatch[0]), lng: Number(decimalMatch[1]) };
    }

    const dmsParts = normalized.split(/[ ,]+(?=[-]?\d)/).filter(Boolean);
    if (dmsParts.length >= 2) {
      const lat = parseDms(dmsParts[0]);
      const lng = parseDms(dmsParts[1]);
      if (lat !== null && lng !== null) {
        return { lat, lng };
      }
    }

    if (decimalMatch && decimalMatch.length >= 4) {
      const [degLat, minLat, degLng, minLng] = decimalMatch.map(Number);
      if (![degLat, minLat, degLng, minLng].some((num) => Number.isNaN(num))) {
        return {
          lat: degLat + minLat / 60,
          lng: degLng + minLng / 60,
        };
      }
    }
  }

  return {
    lat: -31.95 - fallbackIndex * 0.02,
    lng: 115.86 + fallbackIndex * 0.02,
  };
}

const csvPath = path.join(process.cwd(), 'server', 'seed-data', 'dive-sites', 'dive-sites.csv');
const fileContents = fs.readFileSync(csvPath, 'utf-8');
const rows = parse(fileContents, { columns: true, skip_empty_lines: true, bom: true });
let idx = 0;
for (const row of rows.slice(0, 5)) {
  const coords = parseCoordinates(row['Coordinates'] ?? null, idx);
  console.log(row['Name'], coords);
  idx += 1;
}
