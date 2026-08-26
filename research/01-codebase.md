# Codebase Research: Yeshwanth Reddy Portfolio

## Executive summary

This repository is a build-free, single-page static portfolio intended for GitHub Pages. `index.html` supplies the page shell and section landmarks, `assets/css/styles.css` supplies the entire visual system, `assets/js/main.js` fetches one JSON file per section and renders the content into empty mount points, and `data/*.json` is the effective content layer. The implementation is small and direct, but it is not meaningfully useful without JavaScript: most visible content, navigation, headings, links, and form controls are created only after ten parallel fetches complete.

The requested experience-logo, project-art, and skills-redesign work has clear integration points in the corresponding JSON schemas and loader functions. The most important prerequisite is to make media metadata explicit (source, alternative text, and optional dimensions) rather than deriving accessibility text from titles or encoding presentation in icon class strings. No production files were changed for this research.

## Architecture map

| Area | Files | Responsibility |
|---|---|---|
| Document shell | `index.html` | Static metadata, semantic section order, empty render targets, global third-party font/icon dependencies, and the script entry point. The six content sections and their mount IDs are declared at `index.html:105-198`; the sole application script is loaded at `index.html:227`. |
| Client renderer | `assets/js/main.js` | Fetch helper, ten independent section loaders, HTML escaping, DOM construction, navigation behavior, scroll state, and reveal animation. The boot coordinator is `assets/js/main.js:536-555`. |
| Content/data | `data/*.json` | Section copy and records. Navigation, hero, about, experience, skills, projects, education, contact, and footer each have a dedicated file. `site-config.json` only changes `document.title` at runtime (`assets/js/main.js:31-35`). |
| Presentation | `assets/css/styles.css` | Reset, design tokens, layout, every section component, responsive breakpoints, reduced-motion handling, and print rules. Core tokens are centralized at `assets/css/styles.css:8-43`; responsive rules start at `assets/css/styles.css:968`, reduced motion at `assets/css/styles.css:1021`, and print at `assets/css/styles.css:1038`. |
| Static assets | `assets/favicon.svg`, `assets/img/projects/*.jpg` | Favicon plus ten project images. None of the JPG files is currently referenced because every `image` value in `data/projects.json` is empty (`data/projects.json:14`, `data/projects.json:26`, `data/projects.json:40`, and through `data/projects.json:122`). |
| Error/fallback | `404.html`, `<noscript>` in `index.html` | Standalone 404 and no-JS fallback. Both still identify the original Aisha Rahman template rather than Yeshwanth (`404.html:6`, `index.html:208-223`). |
| Deployment/discovery | `robots.txt`, `sitemap.xml` | Static crawler files, both with stale `AlexMorgan.com` URLs (`robots.txt:4`; `sitemap.xml:4`). |
| Template tooling | `setup-portfolio.sh`, `README.md` | Interactive personalization script and minimal template documentation. The script generates `profile.json` and a `package.json` (`setup-portfolio.sh:52-104`) but the renderer never fetches `profile.json`; its HTML substitutions and CSS variable names also do not match the current source (`setup-portfolio.sh:77-83`, `setup-portfolio.sh:106-112`). |

There is no `package.json`, bundler, framework, test suite, lint configuration, service worker, server-side component, or CI workflow in the current tree. The repository can be served by any static HTTP server and deployed directly.

## Vanilla stack and external dependencies

- HTML5 landmarks and native controls. The page uses a primary `<nav>`, `<main>`, six `<section>` elements, a `<footer>`, and a skip link (`index.html:80-105`, `index.html:121-206`).
- Plain CSS with custom properties, grid/flexbox, `clamp()`, `color-mix()`, media queries, and CSS-generated ornament. The aesthetic and font roles are described in the file header (`assets/css/styles.css:1-6`).
- Browser-native JavaScript only: `fetch`, promises, optional chaining, `matchMedia`, `requestAnimationFrame`, `IntersectionObserver`, DOM APIs, constraint validation, and `mailto:` navigation (`assets/js/main.js:7-26`, `assets/js/main.js:404-414`, `assets/js/main.js:478-530`).
- Google Fonts loads Fraunces, Hanken Grotesk, and JetBrains Mono (`index.html:48-54`). Font Awesome 6.4.0 is loaded from cdnjs and data files store Font Awesome class names as content (`index.html:57-63`; for example `data/skills.json:5-7`). These are runtime network dependencies; there is no local fallback for icons when the CDN is unavailable.
- GitHub Pages-compatible relative paths are used for CSS, JS, JSON, and project imagery. One exception is the unused `/avatar.png` root-relative value (`data/hero.json:6`), which would behave differently under a project subpath and has no renderer.

## Rendering and data flow

1. The browser parses a mostly empty semantic shell. Section titles and content containers are present but blank (`index.html:121-195`). Static `<head>` metadata is immediately available, although it contains the wrong person and domain (`index.html:7-42`, `index.html:65-77`).
2. On `DOMContentLoaded`, ten loader functions run concurrently through `Promise.allSettled` (`assets/js/main.js:536-550`). A failed loader is logged and does not prevent the others from completing (`assets/js/main.js:537`, `assets/js/main.js:551-553`). There is no visible loading, empty, or error state.
3. Every loader calls the shared `getJSON()` wrapper, which fetches a relative URL and throws on non-2xx responses (`assets/js/main.js:10-14`). The site therefore must be served over HTTP; opening `index.html` directly can block JSON fetches.
4. Each loader clears its mount node and constructs DOM elements from its JSON payload. Most values are assigned with `textContent` or passed through `escapeHtml()` (`assets/js/main.js:22-26`). The notable exception is `hero.summary`, which is assigned directly to `innerHTML` (`assets/js/main.js:70-80`).
5. Only after all loaders settle does `setupInteractions()` query the generated links and cards (`assets/js/main.js:443-449`, `assets/js/main.js:550-555`). This ordering is important: any redesigned renderer must finish inserting relevant elements before interaction setup, or explicitly initialize its own interactions.
6. Interaction state is ephemeral. The mobile menu toggles `.active` and `aria-expanded` (`assets/js/main.js:451-462`); same-page links use an offset scroll (`assets/js/main.js:465-475`); an observer applies `.is-active` to navigation (`assets/js/main.js:491-508`); and a second observer adds reveal classes and inline delays (`assets/js/main.js:510-530`). No state is persisted.

Data ownership is fragmented in two places. `data/profile.json` duplicates identity, bio, contact, and site metadata (`data/profile.json:2-17`) but is never fetched. Rendered identity instead comes from `hero.json`, `about.json`, `contact.json`, `footer.json`, and `site-config.json`. This makes drift likely: the hero says 4+ years (`data/hero.json:5`) while the About statistic says 3+ (`data/about.json:7-11`), and the static head describes an unrelated person (`index.html:8-17`).

## Existing conventions

- Loader names follow `loadX`; each owns one JSON endpoint and one or more fixed DOM IDs.
- Array inputs default to `[]`; some record sets filter an `_instructions` sentinel before rendering (`assets/js/main.js:166-169`, `assets/js/main.js:212-214`, `assets/js/main.js:240-242`). There is no schema validation.
- User-facing strings are generally escaped before interpolation. External links consistently receive `target="_blank"` and `rel="noopener noreferrer"` (`assets/js/main.js:16-20`, `assets/js/main.js:250-260`).
- Component classes are section-specific and CSS is organized in the same order as the page: navigation, hero, about, timeline, skills, projects, education, contact, footer.
- Responsive grids primarily use `auto-fit`/`auto-fill` with `minmax(min(100%, ...), 1fr)`, allowing cards to collapse without many breakpoints (`assets/css/styles.css:575-580`, `assets/css/styles.css:627-632`).
- Animation is progressive and respects the initial reduced-motion preference in both JS and CSS (`assets/js/main.js:7`, `assets/js/main.js:514`; `assets/css/styles.css:1021-1035`).

## Integration surface: experience logos

Current source shape: each experience has `title`, `company`, `period`, `location`, duplicate `description`, and `responsibilities` (`data/experience.json:4-19`, `data/experience.json:21-35`). The renderer ignores `location`, prefers responsibilities over description, and emits a text-only timeline header (`assets/js/main.js:166-194`). The timeline is styled as a single vertical rail with a decorative dot (`assets/css/styles.css:500-524`), while title/company/period styles live at `assets/css/styles.css:525-550`.

Recommended extension seam:

- Add an optional structured field such as `companyLogo: { "src": "assets/img/experience/northern-trust.svg", "alt": "Northern Trust", "width": 48, "height": 48 }` to each experience record. Keep it optional so text-only records remain valid.
- Update only `loadExperience()` to insert a media wrapper adjacent to the existing header text. Do not encode logo URLs in CSS and do not infer `alt` from the filename.
- Extend the `.timeline-header`/new logo classes rather than replacing the timeline layout. The flex-wrap behavior already protects narrow screens (`assets/css/styles.css:525-531`). If the logo is purely repetitive beside visible company text, use empty `alt=""`; if it conveys an employer identity not otherwise named, use the employer name.
- Add explicit dimensions or an aspect-ratio wrapper to prevent layout shift. Use an `onerror` fallback that hides only the failed image while retaining company text; the current project renderer demonstrates a basic remove-on-error pattern (`assets/js/main.js:263-267`).
- Decide whether `location` should become visible during the same redesign; it exists but is currently dead data (`data/experience.json:8`, `data/experience.json:25`).

## Integration surface: project artwork

The data model already has `image` and `icon` per project (`data/projects.json:5-16` and repeated for all records). `loadProjects()` selects the image when non-empty and otherwise renders the icon (`assets/js/main.js:263-267`). Images are lazy-loaded and asynchronously decoded, with title-derived alt text and removal on error. CSS already provides a fixed 170px media frame, `object-fit: cover`, hover zoom, and a gradient overlay (`assets/css/styles.css:647-675`).

This is the lowest-risk enhancement surface: populate the existing `image` fields with repository-relative asset paths. However, the ten checked-in JPGs are analytics-themed (`assets/img/projects/`) while the JSON projects are infrastructure/security repositories, so blindly wiring by list order would create misleading visual semantics. Use explicit per-record mapping and verify that each image actually depicts the named project.

For a durable redesign, replace the string with (or supplement it by) `art: { src, alt, focalPoint }`. The current generated alt `${project.title} — project thumbnail` is generic and repeats the adjacent heading (`assets/js/main.js:263-266`); decorative art should have empty alt, while informative screenshots need content-specific alt. Optional `object-position`/focal-point metadata would let wide screenshots survive the fixed crop. If cards become fully clickable, preserve the existing explicit Code/Demo link semantics and avoid nested interactive elements (`assets/js/main.js:250-260`, `assets/js/main.js:269-276`).

## Integration surface: skills redesign

`data/skills.json` contains three categories: 3 programming languages, 12 tools/platforms, and 67 technical skills (`data/skills.json:3-103`). Each category has a Font Awesome icon class and a flat string array. `loadSkills()` maps every category to a generic card and every skill to a non-semantic `<span>` (`assets/js/main.js:202-224`). CSS lays categories into responsive cards and skills into wrapping tags (`assets/css/styles.css:575-625`).

The data imbalance is the core redesign constraint: one card holds dozens of tags while the other two are sparse. A visual-only CSS change cannot fix hierarchy, scanning, or meaning. The clean seam is to evolve `categories[].skills` from strings to optional objects (for example `{ name, group, level, featured, icon }`) while accepting legacy strings during migration. Suggested domain groups for the existing technical list are networking/routing, network security, VPN/remote access, cloud, observability/incident response, systems/identity, operations/governance, and automation.

The renderer should move to semantic lists (`<ul><li>`) or grouped definition structures, expose all content without hover, and treat proficiency levels as claims requiring evidence rather than decorative progress bars. Search/filter controls would require a new interaction initializer after rendering; disclosure groups can use native `<details>/<summary>` to minimize script and retain keyboard behavior. Any new icon field should be presentation-only with `aria-hidden="true"`, matching the existing category icons (`assets/js/main.js:218-222`).

## Accessibility strengths and risks

### Existing strengths

- The page declares `lang="en"`, uses landmarks, and includes a skip link (`index.html:1-2`, `index.html:80-105`). The skip link becomes visible on focus (`assets/css/styles.css:95-109`).
- The mobile navigation button has an accessible name, control relationship, and synchronized expanded state (`index.html:88-98`; `assets/js/main.js:451-461`).
- Decorative Font Awesome icons are generally marked `aria-hidden="true"`; icon-only social links receive platform labels (`assets/js/main.js:108-117`).
- Form controls receive explicit labels and retain native required/type validation (`assets/js/main.js:374-386`, `assets/js/main.js:404-406`).
- Global `:focus-visible` styling and a dark-section variant are present (`assets/css/styles.css:111-118`). Reduced motion is honored in scrolling and reveal behavior (`assets/js/main.js:465-475`, `assets/css/styles.css:1021-1035`).

### Risks and remediation priorities

1. **Critical content depends on JavaScript and successful fetches.** Empty headings and containers are the initial DOM (`index.html:121-195`), and loader failures only reach the console (`assets/js/main.js:536-553`). Screen-reader and keyboard users can encounter a nearly empty page under blocked scripts/CDNs, file-protocol use, or JSON errors. The `<noscript>` fallback is stale and only covers a short biography (`index.html:208-223`). Prefer meaningful static core content or at minimum accessible per-section loading/error states.
2. **Identity and metadata are materially wrong.** The title, descriptions, canonical URL, social metadata, structured Person data, and no-script copy identify Aisha Rahman/example.com (`index.html:8-42`, `index.html:65-77`, `index.html:211-223`); the 404 does too (`404.html:6`). Runtime code changes only `document.title`, not metadata (`assets/js/main.js:31-35`). This harms assistive context, search results, and link previews.
3. **The mobile menu is not a complete keyboard/dialog pattern.** It does not close on Escape, restore focus, close on outside click, or respond to viewport changes (`assets/js/main.js:451-462`). It also remains in DOM tab order while visually translated off-screen because CSS uses `transform` rather than `display`/`visibility` (`assets/css/styles.css:979-997`). Users may tab into invisible links.
4. **Active navigation is visual only.** The observer toggles `.is-active` but not `aria-current="location"` (`assets/js/main.js:491-508`). Assistive technology receives no current-section state.
5. **Focus style is explicitly removed from form fields.** Inputs and textareas use `outline: none` on focus and rely on a border-color change (`assets/css/styles.css:883-888`). Although global `:focus-visible` may still win depending on cascade/specificity, this is fragile and the gold border alone may not be sufficiently distinguishable. Define a direct `:focus-visible` outline for controls.
6. **Skills and project cards lack semantic grouping.** Skills are spans in divs (`assets/js/main.js:217-223`), projects are generic div cards (`assets/js/main.js:243-277`), and experience records are generic divs (`assets/js/main.js:169-195`). Use lists/articles where the collection and record boundaries are meaningful.
7. **Image alternatives are not modeled.** Project alt text is mechanically derived from the title (`assets/js/main.js:263-266`), and experience logos have no schema yet. The redesign should explicitly distinguish decorative from informative media.
8. **Hover-only transformations are widespread.** Cards, tags, artwork, and links change on hover (`assets/css/styles.css:588-625`, `assets/css/styles.css:642-667`, `assets/css/styles.css:726-728`) without equivalent component-level focus states. Interactive links retain the global outline, but non-interactive cards/tags should not imply clickability through hover styling.
9. **404 keyboard focus is not styled.** Its inline CSS defines only `a:hover` (`404.html:55-68`). Add a visible focus treatment and update the identity.
10. **Third-party visual dependencies can disappear.** Icon meaning relies on Font Awesome loaded from a CDN (`index.html:57-63`); several labels pair an icon with text, but the project fallback can become an empty decorative media area when the stylesheet is unavailable (`assets/js/main.js:263-267`). Local SVGs or text-safe fallbacks are more robust.

## Adjacent technical debt and implementation cautions

- `main.js` and `styles.css` retain unrelated template names in their headers (`assets/js/main.js:2`; `assets/css/styles.css:2`). This is harmless at runtime but confirms incomplete personalization.
- `hero.summary` is the only content field deliberately inserted as raw HTML (`assets/js/main.js:70-80`). Today it is trusted local JSON, but this breaks the otherwise consistent escaping contract and should not be copied into new media/rendering code.
- The contact fallback email is also stale (`assets/js/main.js:345-347`). The local data currently prevents it from showing, but a malformed contact file would expose the wrong address.
- `site-config.json` contains description, author, keywords, branding, and settings (`data/site-config.json:2-16`), yet only its title is consumed (`assets/js/main.js:31-35`). `enableAnimations` and `navbarScrollEffect` therefore do nothing.
- The setup script is unsafe as a source of truth for future changes: it creates files absent from the current app and searches for obsolete placeholders/variables (`setup-portfolio.sh:77-112`). It also writes JSON without escaping shell input (`setup-portfolio.sh:54-75`).
- No automated schema, accessibility, link, HTML, or visual regression tests exist. For the proposed redesign, at minimum validate every JSON file, test loaders with missing/empty media, keyboard-test mobile navigation and any skills disclosure/filter, and run an accessibility audit at desktop and narrow breakpoints.

## Recommended implementation order for later agents

1. Correct static identity/metadata and decide whether `profile.json` becomes the canonical source or is removed; this eliminates conflicting content ownership.
2. Define backward-compatible JSON media schemas with explicit alt/decorative semantics.
3. Wire project artwork first, because renderer and CSS support already exist; audit each image-to-project mapping.
4. Add experience logos with text-preserving fallbacks and fixed dimensions.
5. Restructure skills data into balanced domain groups, then replace flat spans with semantic grouped lists/disclosures.
6. Close keyboard/navigation/error-state gaps and verify reduced-motion, no-image, no-CDN, and narrow-screen behavior.

