Minimal, dark-only personal blog template built with **React**, **TypeScript**, and **Tailwind CSS**.

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Content

- **Blog posts (Markdown)**: `data/posts/*.md`
  - Frontmatter:

```md
---
title: "Post Title"
date: "YYYY-MM-DD"
---
```

- **Podcasts (YouTube links)**: `data/podcasts.ts`
  - Add a new object to `podcastEpisodes` and it will render automatically.

## Routes

- **Home**: `/`
- **Post detail**: `/posts/[slug]`
- **Podcast episode**: `/podcasts/[episode]`

## Build

```bash
npm run build
npm start
```
