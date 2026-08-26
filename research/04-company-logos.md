# Company identity and logo mapping

Source reviewed: `data/experience.json` (two employer records).

## Recommended mapping

| Employer string in data | Canonical display name | Canonical legal/company identity | Preferred logo source | Accessible alt text | Fallback initials |
|---|---|---|---|---|---|
| `Northern trust, USA` | **Northern Trust** | **Northern Trust Corporation** | Obtain the current logo directly from Northern Trust's official media/brand team. Identity reference: [Northern Trust Media Resources](https://www.northerntrust.com/canada/about-us/media-resources). Current official usage is visible in Northern Trust's [brand guidelines PDF](https://pages.e.northerntrust.com/rs/504-ZYK-173/images/NT_Guidelines_infographics.pdf) and [official wardrobe guide](https://www.northerntrust.com/content/dam/northerntrust/events/documents/nt-wardrobe-guide.pdf). | `Northern Trust logo` | `NT` |
| `Mphasis, India` | **Mphasis** | **Mphasis Limited** | Obtain the current logo directly from Mphasis. Identity reference: [Mphasis official website](https://www.mphasis.com/) and its official [brand announcement PDF](https://www.mphasis.com/content/dam/mphasis-com/global/en/news/press_releases/Press%20Release%20Mphasis.pdf). | `Mphasis logo` | `M` |

## Exact implementation identifiers

```json
{
  "Northern trust, USA": {
    "name": "Northern Trust",
    "legalName": "Northern Trust Corporation",
    "logo": null,
    "logoSource": "https://www.northerntrust.com/canada/about-us/media-resources",
    "alt": "Northern Trust logo",
    "fallbackInitials": "NT"
  },
  "Mphasis, India": {
    "name": "Mphasis",
    "legalName": "Mphasis Limited",
    "logo": null,
    "logoSource": "https://www.mphasis.com/",
    "alt": "Mphasis logo",
    "fallbackInitials": "M"
  }
}
```

`logo` is intentionally `null`: no clearly licensed, stable, production-safe SVG was found in Simple Icons or Wikimedia Commons. A local, approved asset should replace `null`; until then, render the fallback initials.

## Source and licensing notes

- **Simple Icons:** neither `Northern Trust` nor `Mphasis` appears in the current catalog. Do not construct a `cdn.simpleicons.org` URL for either company; it would be an invalid mapping.
- **Wikimedia Commons:** no current company-logo SVG was found for either employer.
- **English Wikipedia has SVG identity references**, but both are explicitly categorized as non-free, copyrighted logos used under Wikipedia's fair-use rationale:
  - [Northern Trust Corp. logo.svg](https://en.wikipedia.org/wiki/File:Northern_Trust_Corp._logo.svg)
  - [Mphasis logo.svg](https://en.wikipedia.org/wiki/File:Mphasis_logo.svg)
  These are useful for visual verification only and should not be copied or hotlinked into the portfolio without a separate right to use them.
- The Mphasis result is mildly time-sensitive because Mphasis announced a refreshed corporate brand in 2025. Confirm that any supplied asset matches the current official mark before adding it locally.
- Country suffixes in the source data identify job location, not the employer brand. They should not appear in the logo's accessible name.

## Accessibility guidance

- If the company name is already visible immediately beside the image, use empty alternative text (`alt=""`) so screen readers do not announce the same name twice.
- If the logo stands alone or is linked without adjacent company text, use the alt text in the table.
- Initials fallbacks should have the same accessible name as the company, for example `aria-label="Northern Trust"`; do not expose only `NT` or `M` to assistive technology.
