import type { RadioType } from "@/lib/radio";

export function formatRadioType(type: RadioType) {
  if (type === "album") return "Album";
  if (type === "playlist") return "Playlist";
  return "Song";
}
