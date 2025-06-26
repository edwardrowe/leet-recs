import { Content, ContentType } from './contentStore';

export function normalizeContentType(type: string): ContentType {
  const t = type.trim().toLowerCase();
  if (["movie", "film"].includes(t)) return "movie";
  if (["tv", "tv show", "tv-show", "show", "series"].includes(t)) return "tv-show";
  if (["book", "novel"].includes(t)) return "book";
  if (["game", "video game", "video-game", "videogame"].includes(t)) return "video-game";
  return "movie"; // fallback
}

export function parseCSV(csv: string): Content[] {
  const lines = csv.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map(h => h.trim());
  const nameIdx = headers.findIndex(h => /name/i.test(h));
  const typeIdx = headers.findIndex(h => /media type/i.test(h));
  const notesIdx = headers.findIndex(h => /notes/i.test(h));
  const thumbIdx = headers.findIndex(h => /thumbnail/i.test(h));
  if ([nameIdx, typeIdx, notesIdx, thumbIdx].some(idx => idx === -1)) return [];
  return lines.slice(1).map((line, i) => {
    const cols = line.split(",");
    let thumb = cols[thumbIdx] || "";
    // Always extract URL from 'filename (url)' format
    const match = thumb.match(/\((https?:\/\/[^)]+)\)/);
    const url = match ? match[1].trim() : "";
    return {
      id: `imported-${Date.now()}-${i}`,
      title: (cols[nameIdx] || "").trim(),
      type: normalizeContentType(cols[typeIdx] || "movie"),
      description: (cols[notesIdx] || "").trim(),
      thumbnailUrl: url,
    };
  });
} 