# Lanevia product demo site

Marketing and demo site for **Lanevia**, a concept startup from the Indiana University S307 Group 10 semester project: an AI dash cam (RoadSense One) whose road data is shared only with each driver's consent. Every company, person and record on the site is fictional.

- **Live site:** https://alex-j-monroe.github.io/S307_lanevia_dashcamera/ (after the first deploy)
- **Editing content:** read [docs/UPDATING.md](docs/UPDATING.md). Teammates never need to touch code.
- **This README:** for the technical maintainer.

Built with the same setup as the Net Impact IU website (`Net-Impact-IU/website`).

## How it works

| Piece | What it does |
| --- | --- |
| [Astro](https://astro.build) | Builds the site into plain HTML pages. Only the 3D model and table sorting use JavaScript. |
| `src/content/` | Every word on the site, plus the demo data snapshot. Layout files never contain copy. |
| [Pages CMS](https://pagescms.org) + `.pages.yml` | The editing forms. Saving a form commits to this repo. |
| GitHub Actions (`.github/workflows/deploy.yml`) | Checks content, builds, and publishes to GitHub Pages on every push to `main`. |
| three.js | The interactive low-poly RoadSense One model on the home page. |

## Project map

```
.pages.yml                    Editing forms (one entry per form)
src/content/settings/site.json  Company name, contact email, announcement strip, class disclaimer
src/content/pages/            Text for Home, How it works, For data buyers (JSON)
src/content/data/             Demo data snapshot exported from the Lab 7/9 dataset (JSON)
src/lib/data.ts               Loads all content
src/lib/url.ts                url() helper: always use it for internal links and images
src/styles/global.css         Design tokens (Lanevia amber palette, type, spacing) and shared styles
src/components/               Header, Footer, CameraModel (3D), DataTable (sortable)
src/pages/                    Home, How it works, For data buyers, 404
scripts/check-content.mjs     Runs before every build; blocks a deploy on missing fields or IDs in buyer data
```

## Brand rules

- Amber `#d97706` is a **background** color. Text on amber is near-black `#1c1917` (5.5:1 contrast). Never put white text on amber (3.19:1 fails WCAG AA).
- Amber text uses `#92400e`.
- Change colors only in the `:root` tokens in `global.css`.
- No customer testimonials or reviews: the company is fictional, so any quote would be invented.
- Keep the class-project disclaimer in the footer.

## Run it locally

Requires Node 20 or newer.

```
npm ci
npm run dev        # http://localhost:4321
npm run build      # outputs to dist/
```

## First-time GitHub setup

1. Create a new **public** repository on your account (for example `lanevia`) and push this folder to `main`.
2. In the repo: **Settings > Pages > Build and deployment > Source: GitHub Actions**.
3. Push any change (or run the workflow from the **Actions** tab). The site appears at `https://<username>.github.io/<repo>/`.
4. Go to [app.pagescms.org](https://app.pagescms.org), sign in with GitHub, and open the repository. The forms from `.pages.yml` appear in the sidebar.
5. Add teammates under **Settings > Collaborators** so they can edit in Pages CMS.

## Updating the demo data

The tables come from `src/content/data/road_events.json` and `buyer_view.json`, exported from the same dataset as the Supabase tables (`detected_event` and the `buyer_road_events` view). GitHub Pages is static, so the site never connects to the database. To refresh, re-export those two queries to JSON, or edit rows in Pages CMS. The content check refuses any buyer row containing customer, device or clip IDs.
