---
title: "Door 17"
date: "2026-03-17"
githubUrl: "https://github.com/saitakarcesme/door-17"
---

Door 17 is a browser horror puzzle set inside an abandoned hospital. The player wakes up with a note that says "Find Door 17" and has to work through a network of rooms where every scene offers exactly three doors. The goal is not random guessing. The strongest route comes from following clue continuity across symbols, sounds, records, medical objects, and repeating spaces.

### Features

- Graph-based progression with recurring rooms, loops, detours, and recoverable mistakes
- Exactly 3 doors per room
- Deduction-focused clue chains with hospital-themed symbolism
- Pressure system surfaced through atmosphere, UI stress, and audio escalation
- Multiple endings, including true escape, normal escape, false Door 17, capture, re-experimentation, loop, collapse, and lost trail
- Persistent Endings Gallery
- Full English and Turkish localization for UI, narrative, rooms, doors, endings, and gallery content
- Responsive desktop-first presentation with cinematic overlays, flicker, and stress distortion
- Dynamic Web Audio soundtrack with mute and volume controls

### Notes

- Endings unlock permanently in the gallery via `localStorage`.
- The soundtrack and sound effects are generated in the browser with the Web Audio API, so there are no external audio assets to manage.
- Whisper cues use browser speech synthesis when available and fall back to an in-engine voice effect otherwise.
