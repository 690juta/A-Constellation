# A Constellation

**An atlas of remembered things.** A static, deep-space memory map built with HTML, CSS, JavaScript modules, SVG, and curated JSON.

## Run locally

Use any static local server from this directory. For example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

Do not open `index.html` directly with `file://`; the browser needs to fetch the JSON files over HTTP.

## Add a memory

Edit `data/memories.json`. Each memory uses a stable ID, title, text, optional dates, optional parent, connections, branch, and reveal order.

- `dateRemembered`: when the detail was first learned or experienced.
- `dateNoticed`: when it was consciously noticed or chosen to be preserved.
- `dateNoticed` drives the recent-memory pulse.
- Unknown dates should remain `null`, not be guessed.
- `parentId` expresses the origin of a growing memory.
- `connections` expresses additional relationships between memories.
- `branchId` references an ID in `data/branches.json`.

The six initial memories are seed data from the initial list. Dates and relationships are intentionally left blank until known.

## GitHub Pages

This is a static site and can be published from the repository root using GitHub Pages. Relative paths (`./css/...`, `./data/...`) are used so the project works as a repository subpath too.

## Privacy

Anything committed to a public repository can be read by visitors. Do not put private memories into a public repository unless you intend to publish them.

## MVP scope

- Interactive SVG star field
- Selectable memory stars and connected-memory navigation
- Pan and reset view
- Progressive reveal
- Optional recent-memory pulse based on `dateNoticed`
- Branch colors and high-degree sparkle styling
- Validation of IDs, dates, branches, parents, and connections
