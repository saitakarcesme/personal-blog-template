---
title: "Game of Evil"
date: "2026-03-17"
githubUrl: "https://github.com/saitakarcesme/gameofevil"
---

`gameofevil` is a desktop narrative horror prototype built with Electron, plain HTML/CSS, and modular JavaScript. The whole game takes place inside a hostile terminal window that treats the player like an accomplice, pushing them through four escalating moral decisions and sixteen possible endings.

### What the game does

- Presents the story as a locked terminal session on a fake desktop.
- Tracks three visible pressure meters: balance, influence level, and global risk.
- Branches through `2 -> 4 -> 8 -> 16` choices/endings.
- Stores progress locally with `localStorage`, including unlocked endings and the latest unfinished session.
- Supports both English and Turkish from the same codebase.
- Uses a looping background audio bed, popup notifications, glitch effects, screen shake, and a broken-screen ending state.

### Current status

The core loop, branching paths, language support, endings gallery, save/load flow, and desktop packaging are all in place. It's designed to be a polished prototype with atmospheric sound design and strict terminal-based presentation.
