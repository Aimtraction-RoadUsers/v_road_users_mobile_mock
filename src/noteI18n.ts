// src/features/mobility/noteI18n.ts
import { type NoteCode } from "./useAvailability";



export function noteToText(
  code: NoteCode | undefined,
  t: (k: string) => string,
): string | undefined {
  if (!code) return undefined;
  const keyMap: Record<NoteCode, string> = {
    set_destination: "notes.set_destination",
    scooters_night: "notes.scooters_night",
    scooters_too_long: "notes.scooters_too_long",
    share_night_few_drivers: "notes.share_night_few_drivers",
    taxi_night_longer_eta: "notes.taxi_night_longer_eta",
  };
  return t(keyMap[code]);
}