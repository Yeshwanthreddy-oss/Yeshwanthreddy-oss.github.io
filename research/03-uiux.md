# UI/UX Audit — Network Engineer Portfolio

## Scope and audit basis

Audited `index.html`, `assets/css/styles.css`, `assets/js/main.js`, and all JSON files in `data/` as a static source review. No production files were changed. Findings about rendered behavior are inferred from the DOM, CSS, and rendering code; no live-browser or assistive-technology session was part of this pass.

The likely primary user is a recruiter or hiring manager who needs to answer three questions quickly: who is this candidate, what network-engineering depth do they have, and what proof supports the claims?

## A. Brutally honest audit

### 1. The page has two identities, and one of them is fictitious

This is the most serious failure because it damages trust before visual polish matters. The static `<head>`, structured data, Open Graph metadata, and no-JavaScript fallback all describe **Aisha Rahman, Business Analyst**, while the JSON-driven visible page describes **Yeshwanth Reddy Aleti, Network Engineer** (`index.html:8-16`, `index.html:23-40`, `index.html:66-75`, `index.html:209-223`; `data/site-config.json:3-10`; `data/hero.json:2-5`). JavaScript only updates `document.title`; it does not repair the description, author, social metadata, schema, or fallback (`assets/js/main.js:31-35`). A recruiter, crawler, link preview, or visitor with blocked JSON can therefore see the wrong person and profession.

The CSS banner still calls the portfolio “Alex Morgan” (`assets/css/styles.css:1-5`). That comment is not user-facing, but it confirms the site remains a reskinned template rather than a deliberately finished personal brand.

**Impact:** credibility loss, incorrect search indexing, broken social previews, and a strong impression that details were not checked.

### 2. The hierarchy looks refined but tells a generic story

The editorial typography, restrained teal/paper palette, clear section rhythm, and bounded content width are solid foundations (`assets/css/styles.css:8-43`, `assets/css/styles.css:121-166`). However, the hero spends its highest-value space on generic labels—“Professional Experience,” “Technical Expertise,” and “Team Collaboration”—that provide no differentiating evidence (`data/hero.json:7-19`). The summary repeats the résumé premise but gives no scale, specialty, certification, or outcome beyond “4+ years” (`data/hero.json:5`).

There are conflicting experience claims: the hero and biography say 4+ years, while the statistic says 3+ (`data/hero.json:5`; `data/about.json:4-10`). “82+ Technologies” is quantity theater: many entries are practices, responsibilities, operating systems, protocols, or duplicate concepts rather than technologies (`data/about.json:17-19`; `data/skills.json:31-102`). “1+ Projects Completed” is also weaker than simply presenting the strongest proof (`data/about.json:13-15`).

The page uses six large sections and a seven-item navigation (`index.html:121-197`; `data/navigation.json:6-35`), but it lacks a fast competency summary tied to the role. Recruiters must read long prose and scan chips to infer the candidate’s actual network stack.

### 3. Experience is an exhausting résumé dump

The first role contains eight long bullets, many repeating the same outcomes and vocabulary: capacity planning appears twice, performance and resilience recur, and nearly every bullet appends an improvement percentage (`data/experience.json:10-18`). The second role adds six more long bullets (`data/experience.json:27-33`). The renderer outputs all of them without grouping, prioritization, or progressive disclosure (`assets/js/main.js:166-195`).

The percentages—20%, 25%, 30%, and 35%—are presented without baselines, measurement windows, or scope. Visually, this reads as optimized résumé copy rather than credible operational evidence. The dark timeline is attractive, but the content density turns it into a wall of claims (`assets/css/styles.css:500-573`).

**Recommendation:** show three outcome-led bullets per role by default, then disclose “More responsibilities.” Put environment/scope in a compact metadata row (sites, cloud providers, vendors, scale) and retain only metrics that can be defended.

### 4. The skills section is taxonomy-free tag soup

This is the weakest major section. Three cards place 82+ items into “Programming Languages,” “Tools & Platforms,” and an enormous “Technical Skills” bucket (`data/skills.json:3-102`). The last bucket mixes protocol layers, vendors, security controls, operating systems, identity, ITSM, compliance, lifecycle tasks, and duplicate concepts. Examples include DNS and DNS Administration, DHCP and DHCP Administration, capacity planning twice, and overlapping access-management labels (`data/skills.json:45-48`, `data/skills.json:75-89`).

Every item gets equal visual weight as a pill (`assets/js/main.js:212-223`; `assets/css/styles.css:606-625`). That makes BGP, “Technical Documentation,” Windows 10/11, SOX, and “Operational Readiness” look equally central. Hovering a static tag inverts its color, falsely suggesting interactivity (`assets/css/styles.css:621-625`). There is no proficiency, recency, context, evidence link, or relationship to projects and roles.

On desktop, the auto-fit grid creates balanced cards but cannot rescue the huge third category (`assets/css/styles.css:575-600`). On mobile, all chips remain expanded; the section becomes a punishing scroll because there is no accordion behavior or mobile-specific content strategy (`assets/css/styles.css:968-1019`).

### 5. Project cards are placeholders, not case studies

Ten repositories are labeled “Featured Projects,” so nothing is actually featured (`data/projects.json:2-124`). Most descriptions are interchangeable filler: “learning exercise,” “industry best practices,” “software design patterns,” or “development capabilities” (`data/projects.json:5-6`, `data/projects.json:19-20`, `data/projects.json:45-46`, `data/projects.json:71-72`, `data/projects.json:94-95`, `data/projects.json:108-118`). They say nothing about the problem, architecture, candidate contribution, operational result, or relevance to network engineering.

All project image fields are empty, so cards display nearly identical generic icons over the same decorative gradient (`data/projects.json:13-16`, repeated through `data/projects.json:111-123`; `assets/js/main.js:263-276`; `assets/css/styles.css:647-675`). Existing project images under `assets/img/projects/` are not referenced by this data. The cards therefore look mass-produced and provide no visual proof.

Long repository names are used directly as titles and merely allowed to break (`assets/js/main.js:272-275`; `assets/css/styles.css:683-689`). Technology badges dominate because the descriptions are weak (`assets/css/styles.css:697-710`). GitHub and demo URLs are frequently identical; the renderer correctly suppresses duplicate demos, but this leaves a single generic “Code” action (`assets/js/main.js:250-261`). The card itself is a non-interactive `<div>`, so only a small footer link is actionable (`assets/js/main.js:243-277`).

On desktop, the equal card treatment creates a repository catalogue, not a portfolio narrative (`assets/css/styles.css:627-646`). On mobile, each 170px generic image consumes scarce vertical space before conveying any value (`assets/css/styles.css:647-659`), and there is no breakpoint to reduce or remove it.

### 6. Company identity is text-only and visually unsupported

Experience cards render company names as plain text and have no data field or DOM slot for a logo (`data/experience.json:5-8`, `data/experience.json:22-25`; `assets/js/main.js:186-194`). This misses a useful credibility cue for recognizable employers such as Northern Trust and Mphasis. The lowercase “trust” in “Northern trust, USA” is an avoidable brand-quality error (`data/experience.json:6`).

Adding raw logos without a system would create another problem: mixed aspect ratios, colors, and optical sizes would disrupt the restrained editorial layout. Logo treatment needs a controlled container and a text fallback, not arbitrary images pasted beside headings.

### 7. Accessibility has good foundations but incomplete interaction design

Positive foundations include a skip link, semantic sections and headings, a labelled navigation, `aria-expanded` on the menu button, focus-visible styling, reduced-motion handling, and descriptive labels on icon-only social links (`index.html:80-105`, `index.html:107-197`, `assets/css/styles.css:95-118`, `assets/js/main.js:108-117`, `assets/js/main.js:451-475`, `assets/css/styles.css:1021-1036`). Touch targets for social links are 46×46px (`assets/css/styles.css:424-435`).

But important gaps remain:

- The mobile menu does not close on Escape, does not return focus to the toggle, and does not close when focus leaves it (`assets/js/main.js:451-463`). Its hidden state is achieved only by transform, so links can remain in the keyboard tab order while visually off-screen (`assets/css/styles.css:983-997`).
- Active navigation is represented only by a class; `aria-current="page"` is never applied (`assets/js/main.js:491-507`).
- Form fields use placeholder text as their visible labels, producing labels such as “Your Name” instead of concise field names; the supplied success message is never used (`data/contact.json:27-52`; `assets/js/main.js:374-399`, `assets/js/main.js:404-414`). There is no inline error summary or status region.
- Focus on form controls removes the native outline and relies on border color alone (`assets/css/styles.css:883-888`). The global `:focus-visible` may still apply depending on specificity and browser behavior, but this should not be left ambiguous.
- Project thumbnail alt text mechanically repeats the title plus “project thumbnail,” adding little meaning (`assets/js/main.js:263-267`). Decorative screenshots should use empty alt; informative diagrams need content-specific alt from data.
- Muted 0.7–0.82rem text and translucent text are used extensively in badges, dates, labels, form notes, and dark sections (`assets/css/styles.css:545-550`, `assets/css/styles.css:703-710`, `assets/css/styles.css:830-867`, `assets/css/styles.css:901-905`). Contrast and legibility need measured verification, especially at 11–13px equivalent sizes.
- Hover-only feedback is common for cards and tags but there are no equivalent focus styles on those visual components (`assets/css/styles.css:588-625`, `assets/css/styles.css:642-667`). Static tags should not look interactive at all.

### 8. Loading and failure states are invisible

Nearly all meaningful body content is empty until ten JSON requests complete (`index.html:99-101`, `index.html:110-116`, `index.html:126-130`, `index.html:151-164`; `assets/js/main.js:536-550`). If a request fails, the only feedback is a console error; the affected section remains blank (`assets/js/main.js:550-553`). There are no skeletons, empty-state messages, retries, or section-level errors.

The independent loaders prevent one failure from blanking the whole page, which is good engineering (`assets/js/main.js:536-553`), but the user experience is unfinished. A section title itself can remain empty if its JSON fails. The reveal system then adds more delayed visibility to already async content (`assets/js/main.js:510-529`).

### 9. Visual craft is stronger than content craft, but some decoration is needless

The typography pairing and palette are distinctive, the spacing system is coherent, and line lengths are generally controlled (`assets/css/styles.css:25-43`, `assets/css/styles.css:120-166`, `assets/css/styles.css:290-334`). These are worth preserving.

However, the fixed full-screen noise overlay sits at `z-index: 9999` purely for atmosphere (`assets/css/styles.css:70-79`), every major content card rises on hover, and every project uses a decorative striped gradient (`assets/css/styles.css:346-359`, `assets/css/styles.css:581-591`, `assets/css/styles.css:633-675`). The repeated lift effect makes static content feel clickable even when it is not. This is visual polish without corresponding informational value.

The CSS uses `color-mix()` and backdrop blur for the fixed navbar (`assets/css/styles.css:183-195`) without an explicit fallback background declaration before `color-mix()`. Older browser behavior may reduce readability. Dark mode is not supported despite a tokenized palette; the only user preference honored is reduced motion (`assets/css/styles.css:8-43`, `assets/css/styles.css:1021-1036`).

## B. Concrete recommendations

### 1. Company-logo treatment

Use employer logos as secondary verification cues, never as the heading itself.

**Data and semantics**

- Extend each experience object with `companyName`, `companyUrl`, `logoSrc`, and `logoAlt`. Keep the visible company name in text even when a logo loads; this protects clarity and fallback behavior. The current data has only a single `company` string (`data/experience.json:5-8`, `data/experience.json:22-25`).
- Correct official capitalization and separate location from the company name: “Northern Trust” + “United States,” “Mphasis” + “India.”
- If the logo is adjacent to identical visible company text, use `alt=""` so screen readers do not announce the employer twice. If the logo replaces no text, use the official company name as alt. Prefer local SVG or WebP assets with documented permission; never hotlink corporate assets.
- Keep a monogram fallback generated from the company name if an asset is absent or fails. Do not remove the entire media slot on error as project images currently do (`assets/js/main.js:263-267`).

**Desktop composition**

- Add a 56×56px logo tile at the start of each timeline header. Use a neutral paper background, 1px subtle border, 8px radius, and 8–10px internal padding.
- Set the image to `max-width: 36px; max-height: 36px; object-fit: contain`; use a grayscale or low-saturation default and restore brand color only on hover/focus if a link is present. This keeps colorful marks from competing with role titles.
- Align role title, company, location, and dates in a three-part row: logo | identity | date. Preserve the current editorial title styling (`assets/css/styles.css:525-550`) but shorten the visible bullet set.

**Mobile composition**

- Reduce the tile to 44×44px and place it beside company/role text; move the date beneath the company rather than forcing a cramped right edge.
- Keep the logo and first line visible without expansion. Do not hide logos on mobile; they are compact recognition anchors.

**Accessibility**

- Ensure any linked logo has an accessible name that describes the destination, e.g. “Northern Trust website,” and a 44×44px target.
- Do not communicate employment status or company solely by logo. Preserve text and visible focus.
- Verify light and dark logo variants against their tile background; avoid CSS filters that make a mark unrecognizable.

### 2. Project-card composition

Reduce ten equal cards to **three featured case studies** plus a compact “More repositories” list. Featured projects should be selected for role relevance—network automation, cloud/WAN infrastructure, security, or observability—not repository recency alone.

**Required content model per featured project**

1. Short display title; keep the repository slug as secondary metadata.
2. One-sentence problem: what operational or security issue existed?
3. One-sentence approach: what architecture, protocol, or automation was built?
4. Proof/outcome: measured result, test coverage, deployment artifact, diagram, or explicitly “lab project” where no production result exists.
5. Candidate ownership: “Designed,” “Implemented,” or “Automated”—not vague “exploring.”
6. Three to five curated stack labels, grouped by purpose rather than dumping every language.
7. Links with clear labels: “Read case study,” “View source,” and only a genuine “Live demo” when one exists.
8. Optional company/organization mark only when the project is legitimately associated with that organization; never imply employer endorsement.

The current project schema and renderer support only title, generic description, technologies, image/icon, and links (`data/projects.json:3-16`; `assets/js/main.js:240-277`). Add structured fields such as `problem`, `approach`, `outcome`, `role`, `evidence`, `imageAlt`, and `featured`.

**Desktop composition**

- Use one lead case study spanning the full content width, with a 5:3 architecture diagram or interface image on one side and narrative on the other. Follow with two half-width cards.
- Put outcome and ownership near the title, before badges. Recruiters should see proof before tooling.
- Use a consistent visual system: real architecture diagrams, sanitized screenshots, or simple topology illustrations. Remove generic Font Awesome hero icons and striped placeholder panels (`assets/css/styles.css:647-675`).
- Make the card heading link the primary destination, but do not wrap the entire card if it contains multiple links. Add a visible `:focus-within` state equivalent to hover.

**Mobile composition**

- Stack media above text with `aspect-ratio: 16 / 9` and let height be content-driven rather than fixed at 170px (`assets/css/styles.css:647-659`).
- Limit the default summary to problem + outcome; disclose technical details with a native `<details>` element or a “Technical details” button.
- Keep actions full-width or at least 44px tall, with “View source” text rather than icon-dependent meaning.
- Move nonfeatured repositories into a dense list with title, one specialty label, and source link; this avoids ten oversized repeated cards.

**Accessibility**

- Store purpose-written `imageAlt` in project data. Use `alt=""` for decorative imagery and describe topology/diagram meaning when informative.
- Use semantic `<article>` elements with a heading per project. Expose technology lists as `<ul>` rather than unstructured spans.
- Do not rely on hover elevation to communicate clickability. Underline textual links, provide visible focus, and maintain logical DOM order: title → problem → outcome → details → actions.
- If technical details expand, use native `<details><summary>` where possible; it provides keyboard and state semantics without custom ARIA.

### 3. Expandable network-stack skills section

Replace the three generic cards with a layered, evidence-backed network-stack navigator. The requested L2–L7 labels should be presented as a **portfolio taxonomy**, not as a claim that these categories exactly match the OSI model. This matters because “L4 cloud/WAN” through “L7 governance” are competency layers, not literal OSI-layer mappings. Add helper copy such as: “A practical operating stack, organized from network foundation to governance.”

Recommended groups:

- **L2 — Routing & switching foundation:** VLANs, trunking, STP, EtherChannel, Cisco switching, Layer 2 troubleshooting. Move OSPF/BGP to the next group despite the requested shorthand; they are Layer 3 routing protocols.
- **L3 — Routing & security:** IPv4/IPv6, subnetting, OSPF, BGP, inter-VLAN routing, ACLs, NAT, segmentation, NGFW, IDS/IPS, IPsec/SSL VPN, Palo Alto, Fortinet, Cisco ISE.
- **L4 — Cloud & WAN:** SD-WAN, site-to-site connectivity, remote access, AWS/Azure networking, hybrid cloud connectivity, high availability, QoS, capacity planning.
- **L5 — Systems & identity:** Windows Server, Linux, Active Directory, Group Policy, DNS, DHCP, IAM, Microsoft 365 administration, backup/recovery.
- **L6 — Observability & response:** SolarWinds, Splunk, Wireshark, SNMP, NetFlow, SIEM, packet/log/traffic analysis, performance monitoring, incident response, root-cause analysis.
- **L7 — Governance & operations:** change/problem/incident management, configuration and firmware lifecycle, disaster recovery, SLA management, SOX, risk assessment, security audits, documentation, operational readiness.

Keep programming and automation as a cross-cutting rail—Python, PowerShell, Bash, infrastructure-as-code, and network automation—rather than forcing them into one layer (`data/skills.json:4-11`, `data/skills.json:95-101`).

**Component behavior**

- Render the groups as an accordion using one `<details>` per layer and a `<summary>` containing layer code, plain-language title, one-line capability statement, and item count.
- Default desktop state: open L3 and the layer most relevant to the target role; keep the rest collapsed. Default mobile state: all collapsed except one recommended layer. Never expand all 70+ items by default.
- Inside each panel, split content into **Core capabilities**, **Platforms/tools**, and **Evidence**. Evidence should deep-link to the relevant role or project; a skill without evidence remains secondary.
- Remove duplicates and normalize naming before rendering. Do not show “82+ Technologies”; show six competency layers and a smaller verified-skill count, or omit the count entirely (`data/about.json:17-19`; `data/skills.json:31-102`).
- Limit each visible subgroup to roughly 6–10 high-signal items. Put lower-priority terms behind “Show all” only if they add search value.

**Desktop composition**

- Use a two-column layout: a sticky layer index/mini topology on the left and the accordion on the right. Selecting a layer should scroll/focus its panel, not replace content invisibly.
- Use layer numbers as compact mono labels, preserving the existing editorial typography. Avoid seven colored bands; one accent plus tint variations will fit the current restrained palette.
- Add small evidence markers such as “Northern Trust,” “Mphasis,” or a project title, but treat them as links with text—not unexplained logos.

**Mobile composition**

- Use a single-column accordion with a minimum 48px summary row and generous tap spacing. Keep layer title and chevron visible; move counts and descriptions to a second line.
- Opening one panel may optionally close the prior panel to contain scroll length, but do not move keyboard focus unexpectedly.
- Avoid horizontal chip carousels. Wrapped chips are acceptable only within the expanded panel and should not have hover styling unless clickable.

**Accessibility**

- Prefer native `<details>/<summary>` semantics. If a custom accordion is unavoidable, each trigger must be a `<button>` with `aria-expanded`, `aria-controls`, and a stable controlled-panel ID.
- The collapsed state must remove panel content from sequential keyboard navigation. This directly avoids the current mobile-menu problem where transformed-offscreen content can remain focusable (`assets/css/styles.css:983-997`).
- Do not use color alone for active/open state; rotate a chevron and update text/state semantics. Preserve visible focus on the whole summary row.
- Ensure heading hierarchy remains valid: section `<h2>`, each layer `<h3>` within its summary, subgroup `<h4>` where needed.
- Announce counts in context (“12 skills”) and keep abbreviations expanded at first use. Avoid tooltips as the only explanation because they perform poorly on touch and keyboard.
- Respect reduced motion for panel transitions, consistent with the existing motion preference handling (`assets/css/styles.css:1021-1036`).

## Cross-cutting desktop, mobile, and accessibility priorities

1. **Fix identity correctness before visual iteration.** Static metadata, schema, fallback, visible data, and social previews must describe the same person and role (`index.html:8-75`, `index.html:209-223`; `data/site-config.json:2-10`).
2. **Replace volume with evidence.** Three defensible case studies, three outcome bullets per role, and six structured competency layers will outperform ten generic cards, fourteen long bullets, and 82 flat tags.
3. **Make responsive behavior content-aware.** Existing breakpoints mainly collapse grids and stack buttons (`assets/css/styles.css:968-1019`); they do not reduce repetition, prioritize content, or manage disclosure.
4. **Build complete states.** Every async section needs loading, empty, and error treatment; every expandable component needs keyboard, focus, and reduced-motion behavior (`assets/js/main.js:536-553`).
5. **Measure, do not assume, WCAG conformance.** Test all translucent dark-section text, tiny mono labels, focus states, mobile menu behavior, accordion semantics, and project image alternatives. Target WCAG 2.2 AA, including 44×44px pointer targets where practical.

## Recommended design direction

**Refine the visual system; redesign the information architecture.** The typography, palette, spacing, section headers, and overall editorial tone are worth keeping. The identity layer, project storytelling, skills taxonomy, evidence hierarchy, and interactive states are not. The highest-leverage sequence is: correct identity → restructure skills → turn projects into case studies → compress experience → complete responsive and accessible states.
