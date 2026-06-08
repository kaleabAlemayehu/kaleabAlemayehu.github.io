# Matrix Theme Migration Plan

## Objective
Migrate Hugo project from hugoplate theme to custom Matrix theme with interactive ixcd engine on homepage.

## Scope
- **IN**: New theme creation, all layout templates, CSS/Tailwind config, homepage with ixcd engine
- **OUT**: Content modifications (content/english/ untouched), new content creation

## Key Decisions Made
- **CSS**: Tailwind CSS (already configured)
- **Font**: JetBrains Mono from Google Fonts
- **Icons**: Font Awesome for social links
- **Homepage**: ixcd physics engine (interactive matrix rain) + intro text (name, role)
- **Theme Structure**: Custom Hugo theme under themes/matrix/

## Design System Reference
- **Colors**: #131313 bg, #00e639/#00ff41 green accent
- **Font**: JetBrains Mono (monospace)
- **Effects**: CRT scanlines, flicker animation, matrix glow
- **Layout**: Strict grid, 0px border radius, terminal UI

## Implementation Tasks

### Phase 1: Theme Foundation

- [x] TODO 1: Create theme directory structure
- [x] TODO 2: Create baseof.html
- [x] TODO 3: Create Matrix CSS file
- [x] TODO 4: Update tailwind.config.js
- [x] TODO 5: Create header partial
- [x] TODO 6: Create footer partial

### Phase 2: Homepage with ixcd Engine

- [x] TODO 7: Copy ixcd files to assets
- [x] TODO 8: Create homepage layout
- [x] TODO 9: Integrate ixcd engine with Hugo

### Phase 3: About Page

- [x] TODO 10: Create about layout
- [x] TODO 11: Add typing animation script

### Phase 4: Blog Pages

- [x] TODO 12: Create blog list layout
- [x] TODO 13: Create blog single layout

### Phase 5: Project Page & Config

- [x] TODO 14: Create project list layout
- [x] TODO 15: Update hugo.toml
- [x] TODO 16: Update data/theme.json
- [x] TODO 17: Clean up old theme files

### Final Verification Wave

- [x] TODO 18: Build and test Hugo site
- [x] TODO 19: Visual verification

## Files Created/Modified

### Theme Layouts (10 files)
- `themes/matrix/layouts/_default/baseof.html` — Base template with Matrix styling
- `themes/matrix/layouts/_default/taxonomy.html` — Taxonomy list
- `themes/matrix/layouts/_default/term.html` — Term list
- `themes/matrix/layouts/partials/header.html` — Navigation with green glow
- `themes/matrix/layouts/partials/footer.html` — Footer with social links
- `themes/matrix/layouts/index.html` — Homepage with ixcd engine
- `themes/matrix/layouts/about/list.html` — About page with terminal UI
- `themes/matrix/layouts/blog/list.html` — Blog list
- `themes/matrix/layouts/blog/single.html` — Blog detail
- `themes/matrix/layouts/project/list.html` — Project list

### Assets (4 files)
- `assets/css/matrix.css` — CRT scanlines, flicker, glow effects
- `assets/js/engine.js` — ixcd physics engine
- `assets/js/secret.js` — ixcd easter egg
- `assets/js/typing.js` — Typing animation

### Config Updates
- `tailwind.config.js` — Matrix colors (#00e639, #131313), JetBrains Mono
- `hugo.toml` — theme = "matrix"
- `data/theme.json` — Matrix colors and fonts
- `config/_default/languages.toml` — Fixed deprecated keys

## Build Status
- Hugo build: 30 pages, 0 errors, ~90ms
- One harmless deprecation warning: `.Site.LanguageCode` (Hugo internal)
