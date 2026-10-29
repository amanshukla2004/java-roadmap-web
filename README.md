# Java Roadmap Tracker

A progress tracker for the 141-topic Core Java roadmap in `Java_Roadmap_5_Playlists.xlsx`, mapped to 5 YouTube playlists (472 videos).

React + Vite + TypeScript + Tailwind CSS. There is no backend: your progress is saved in your browser's `localStorage`.

## Run it

Requires Node.js 20.19+.

```bash
npm install
npm run dev      # dev server at http://localhost:5173
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build
```

## Two versions

The same code builds two versions of the site, set by the `.env` files:

| Version | Playlists | Dev | Build (output) |
| --- | --- | --- | --- |
| Full | all 5 (A–E) | `npm run dev` (port 5173) | `npm run build` (`dist/`) |
| Lite | A, C, D: without **B** Dilip IT Academy and **E** Learn Coding | `npm run dev:lite` (port 5174) | `npm run build:lite` (`dist-lite/`) |

The Lite version reads the same `roadmap.json` and removes the excluded playlists when the page loads (`VITE_EXCLUDE_PLAYLISTS` in `.env.lite`). Topics that only B or E covered show as **Not covered**, with a YouTube search button. Each version keeps its own progress (`java-roadmap-progress` vs `java-roadmap-progress-lite`). To copy progress from one version to the other, use Export and Import.

## Deploy

The build is a plain static site: no server, no secrets. Navigation uses `#roadmap` / `#playlists`, so no rewrite rules are needed. Asset paths are relative (`base: "./"`), so it also works in a sub-folder.

The included configs deploy the **3-playlist version** (`npm run build:lite` → `dist-lite/`):

- **Vercel:** import the repo; `vercel.json` sets the build. Or run `npx vercel` from this folder.
- **Netlify:** import the repo; `netlify.toml` sets the build. Or drag the built `dist-lite/` folder onto app.netlify.com/drop.
- **GitHub Pages, Cloudflare Pages or any static host:** build with `npm run build:lite` and upload `dist-lite/`.

To deploy all 5 playlists instead, change the build command to `npm run build` and the output folder to `dist` in `vercel.json` / `netlify.toml`.

Each deployed site keeps its own progress in the visitor's browser. To move progress between sites, use Export and Import.

## Re-generate `src/data/roadmap.json`

The site reads all topics and videos from `src/data/roadmap.json`, which is generated from the Excel workbook. After you edit the workbook, run:

```bash
pip install openpyxl
python scripts/convert_roadmap.py                       # uses ./Java_Roadmap_5_Playlists.xlsx
python scripts/convert_roadmap.py path/to/other.xlsx    # or a different file
```

(`npm run convert` does the same thing.)

The script:

- reads playlist names and links from the `Roadmap` sheet's row-3 headers (columns G–K);
- reads topics from the `Roadmap` sheet (rows 4+). It ignores the formula in column F and the Status column M;
- builds each topic's video list from the `Playlist Index` sheet, using column G (`Roadmap #`) to match videos to topics, so every topic gets all its videos with their own links;
- checks the data and fails if there are not 141 topics and 472 videos, or if any video is not attached to a topic. It warns if the `Roadmap` columns G–K or the `Gaps - To Search` sheet disagree with the index.

These counts are fixed in the script (`EXPECTED_TOPICS` / `EXPECTED_VIDEOS`). If you add or remove topics or videos on purpose, update the two constants.

## Progress data

Progress is stored under one `localStorage` key, `java-roadmap-progress`:

```json
{ "topicStatus": { "4": "done", "7": "in-progress" }, "watched": { "A-33": true } }
```

- Video keys are `<playlist key>-<position in playlist>`. A video that belongs to several topics shares one watched state.
- Roadmap data is never stored there. Entries for IDs that no longer exist are kept rather than deleted, so your progress still loads after `roadmap.json` is re-generated.
- **Export** downloads this object as a JSON file. **Import** replaces your current progress with a file you exported before. **Reset** clears everything (after you confirm).
- The light/dark theme is remembered separately, under `java-roadmap-theme`.

## Using the site

- **Roadmap tab:** choose a phase on the left, or "All phases". Each topic is a single line:
  - click the circle to cycle its status (Not started → In progress → Done);
  - click the row to expand it and see the details and videos.

  Search, **★ Critical** and **Gaps** are always visible. Priority, status and playlist are under **Filters**.
- **Playlists tab:** pick a playlist to see all its videos in order. Each video shows the topics it covers and whether you've watched it. You can switch between All, To watch and Watched, and the "Up next" card shows the first video you haven't watched. Watched checkboxes are shared with the Roadmap tab.
- **⋯ menu:** export or import progress, or reset it.

## Project layout

```
scripts/convert_roadmap.py   Excel -> JSON converter (one-time / on workbook change)
src/data/roadmap.json        generated data (do not edit by hand)
src/hooks/useProgress.ts     all progress state + localStorage logic
src/hooks/useDarkMode.ts     theme toggle
src/lib/roadmap.ts           data loading and derived helpers (phases, totals, search links)
src/lib/filters.ts           search and filter logic
src/components/              UI components
```
