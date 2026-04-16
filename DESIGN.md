# Design Brief — Time Reel

**Purpose & Context:** Next-generation short-form video platform. Users scroll infinite vertical feed, post videos, engage (like/comment/gift), discover trending creators. Dark mode maximizes video immersion on OLED screens. Premium aesthetic distinguishes from TikTok.

**Tone:** Futuristic, clean, intentional. Minimalist structure with selective color (cyan accents). No clutter, no distraction — video is hero.

**Palette & Semantics**

| Token | Light | Dark | Use |
|:------|:------|:-----|:----|
| `--background` | `0.99 0 0` (white) | `0.1 0 0` (almost-black) | Page background, OLED-optimized |
| `--card` | `0.96 0 0` | `0.16 0 0` | Video overlay cards (title, comments, creator profile) |
| `--primary` | `0.7 0.15 250` | `0.65 0.25 259` (cyan) | Like button, CTAs, active states, ring focus |
| `--secondary` | `0.85 0.1 280` | `0.2 0.12 280` (dark purple) | Secondary actions, borders, dividers |
| `--accent` | `0.7 0.15 250` | `0.65 0.25 259` | Synonymous with primary for consistency |
| `--chart-1` | `0.72 0.14 68` (gold) | `0.72 0.14 68` | Gift/coin currency (monetization highlight) |
| `--destructive` | Red (`0.55 0.22 25`) | Red (`0.65 0.19 22`) | Remove, block, negative actions |

**Typography**

| Layer | Font | Weight | Use | Scale |
|:------|:-----|:-------|:----|:------|
| Display | Space Grotesk | 700 | Video titles, creator names, section headers | 20px–32px |
| Body | DM Sans | 400/500 | Feed comments, bio text, timestamps | 14px–16px |
| Mono | Geist Mono | 400 | Coin counts, view stats, technical labels | 12px–14px |

**Elevation & Depth**

- **Layer 0 (Background):** `bg-background` — video canvas layer.
- **Layer 1 (Card):** `bg-card` — video info overlays (title, creator, stats) with `border-border` 1px.
- **Layer 2 (Popover):** Comments sheet, gift menu, share modal — `bg-popover` with `shadow-sm` + `border-border`.

**Structural Zones**

| Zone | Treatment | Notes |
|:-----|:----------|:------|
| Video Frame | 100% width, 100vh on mobile (full bleed) | No border, no padding; frame dominates |
| Info Overlay | `bg-card` with gradient fade (bottom-up) | Creator name, like count, share icon — stacked overlay |
| Comments | `bg-popover` sheet slides up from bottom | Half-height initially, scrollable, input field sticky |
| Header/Nav | Recessed, `bg-secondary/10` | Only on feed entry; hidden during video scroll |

**Spacing & Rhythm**

- **Radii:** 4px (small UI), 12px (cards), 24px (full button), 0px (video frame edge).
- **Density:** Tight (compact on mobile). 8px grid for internal spacing, 16px for zone gaps.
- **Rhythm:** Video frame occupies 100vh snap cell. Comments, header, nav recessed below or hidden.

**Component Patterns**

- **Like Button:** Icon-only, tappable 48px, cyan ring on active. Triggers `animate-heart-burst` on press.
- **Gift/Coin Button:** Icon + count. On tap, coin floats upward via `animate-coin-float`. Count increments.
- **Video Card:** Title + creator name overlay on video frame with gradient fade. No visible border.
- **Comment:** Dense row format — avatar (24px), username, timestamp, text, reply icon.
- **Share Menu:** Horizontal scrollable icons — TikTok share, Instagram, DM, copy link. Cyan primary action.

**Motion & Choreography**

| Interaction | Animation | Duration | Easing |
|:------------|:----------|:---------|:--------|
| Like heart | Heart burst (scale 1→1.8, fade out) | 0.6s | ease-out |
| Gift coin | Coin float (translate up 80px, scale 1→0.6, fade) | 1.2s | ease-out |
| Scroll snap | Smooth snap-to-video on scroll | N/A | `scroll-behavior: smooth` |
| Modal in | Slide up + fade in | 0.3s | cubic-bezier(0.4, 0, 0.2, 1) |

**Constraints**

- Mobile-first: optimized for 320px–480px phones. Scales to 768px+ tablets (wider layout, sidebar nav).
- No generic gradients; cyan accents used sparingly on interactive elements only.
- Video frame always full-width, centered. Comments/nav recessed or hidden to maximize video immersion.
- OLED-friendly: near-black background reduces burn-in risk.

**Signature Detail**

Snap-scroll to video + heart burst on like + coin float on gift. Three micro-interactions working in concert create momentum and tactile feel distinct from TikTok's rapid flick-scroll.

**Component Tokens (Utilities)**

- `.heart-burst` → `animate-heart-burst` (keyframe defined in `tailwind.config.js`)
- `.coin-float` → `animate-coin-float` (keyframe defined in `tailwind.config.js`)
- `.snap-scroll` → `scroll-snap-type: y mandatory; scroll-behavior: smooth`
- `.snap-center` → `scroll-snap-align: center; scroll-snap-stop: always`
- `.transition-smooth` → `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`
