import { Content, ContentType } from './contentStore';

export function normalizeContentType(type: string): ContentType {
  const t = type.trim().toLowerCase();
  if (["movie", "film"].includes(t)) return "movie";
  if (["tv", "tv show", "tv-show", "show", "series"].includes(t)) return "tv-show";
  if (["book", "novel"].includes(t)) return "book";
  if (["game", "video game", "video-game", "videogame"].includes(t)) return "video-game";
  return "movie"; // fallback
}

// Minimal CSV row splitter that handles quoted fields
function splitCSVRow(row: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    if (char === '"') {
      if (inQuotes && row[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function extractThumbnailUrl(cell: string): string {
  if (!cell) return "";
  // Remove leading/trailing quotes (single, double, or triple)
  let clean = cell.trim().replace(/^"+|"+$/g, '').replace(/^'+|'+$/g, '');
  // Try to extract URL in parentheses
  const parenMatch = clean.match(/\((https?:\/\/[^)]+)\)/);
  if (parenMatch) return parenMatch[1].trim();
  // Otherwise, extract the first http(s) URL
  const urlMatch = clean.match(/https?:\/\/\S+/);
  if (urlMatch) return urlMatch[0].replace(/[)\],]/g, '').trim();
  return "";
}

export function parseCSV(csv: string): Content[] {
  const lines = csv.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = splitCSVRow(lines[0]).map(h => h.trim());
  const nameIdx = headers.findIndex(h => /name/i.test(h));
  const typeIdx = headers.findIndex(h => /media type/i.test(h));
  const notesIdx = headers.findIndex(h => /notes/i.test(h));
  const thumbIdx = headers.findIndex(h => /thumbnail/i.test(h));
  if ([nameIdx, typeIdx, notesIdx, thumbIdx].some(idx => idx === -1)) return [];
  return lines.slice(1).map((line, i) => {
    const cols = splitCSVRow(line);
    let thumb = cols[thumbIdx] || "";
    const url = extractThumbnailUrl(thumb);
    return {
      id: `imported-${Date.now()}-${i}`,
      title: (cols[nameIdx] || "").trim(),
      type: normalizeContentType(cols[typeIdx] || "movie"),
      description: (cols[notesIdx] || "").trim(),
      thumbnailUrl: url,
    };
  });
} 