# Darbar Tech — UI/UX Improvement Guide

Typing correctness is fixed. This is a short, prioritized punch-list for the
visual layer: color, content, and icons.

## 1. Color — pick a real palette, stop using raw Tailwind grays

**Problem:** `globals.css` only sets 3 CSS variables (`--foreground`,
`--background`, `--text-color`). Every component then reaches for raw
Tailwind defaults (`bg-slate-800`, `text-green-500`, `text-gray-400`,
`border-gray-600`) directly in JSX. Nothing routes through the theme, so
"dark mode" and "light mode" are really just two background colors behind
the same hardcoded gray/green UI.

**Fix — define a real token set in `globals.css` and use only these:**

```css
[data-theme="dark"] {
  --bg: #0f172a;          /* page background */
  --surface: #1a2436;      /* cards, modal, keyboard */
  --border: #2a3650;
  --text-primary: #f1f5f9;
  --text-muted: #8b98b3;
  --accent: #22c55e;        /* correct / success */
  --accent-hover: #16a34a;
  --error: #ef4444;         /* wrong key */
  --warning: #f59e0b;       /* combo-stroke hint */
}

[data-theme="light"] {
  --bg: #f8fafc;
  --surface: #ffffff;
  --border: #e2e8f0;
  --text-primary: #0f172a;
  --text-muted: #64748b;
  --accent: #16a34a;
  --accent-hover: #15803d;
  --error: #dc2626;
  --warning: #d97706;
}
```

Then replace every `bg-slate-800`, `text-green-500`, `border-gray-600`, etc.
across `Modal.tsx`, `Navbar.tsx`, `PreetiKeyboardKey.tsx`,
`UnicodeKeyboardKey.tsx` with `bg-[var(--surface)]`,
`text-[var(--accent)]`, `border-[var(--border)]`. One source of truth, and
light mode stops looking like dark mode with the lights on.

**Cut the palette down.** Right now green (correct), amber (combo hint),
red (error), slate/gray (chrome) all compete for attention with no
hierarchy. Green + red should be reserved *only* for typing feedback;
everything else (buttons, borders, nav) should live in neutral
surface/border/text tones so the feedback colors actually pop when they
matter.

## 2. Icons — stop mixing metaphors

**Problem:** `icons/LucideIcons.js` pulls a random assortment
(`RotateCcw`, `Sun`, `Moon`, `Menu`, `VolumeOff`, `Delete`,
`CornerDownLeft`, `X`, `ArrowRight`) with no consistent stroke width or
sizing convention, and several (`VolumeOff`/`Volume2`) aren't wired to any
actual sound feature yet — dead icons imply dead features.

**Fix:**
- Standardize every icon to `strokeWidth={1.75}` and one size scale
  (`16` for inline, `20` for buttons, `24` for nav) — don't let each
  component pick its own size ad hoc.
- Remove unused icons (`VolumeOff`/`Volume2`) until the sound feature
  ships, or ship the feature.
- Icons that carry meaning (restart, backspace, enter) need a visible
  text label or `aria-label` — an icon alone is not self-explanatory for
  a first-time user of a typing trainer.

## 3. Content — write for a nervous first-time user

**Problem:** Metadata and in-app copy are inconsistent in register.
Result messages ("🎉 तपाईंले कार्य पूरा गर्नुभयो।") are warm, but error
and empty states have no copy at all — a wrong key just flashes red with
no explanation, and there's no guidance text anywhere on *how* Preeti vs
Unicode differ before the user picks one.

**Fix — three concrete additions:**
1. **Mode picker copy.** One line under each language toggle:
   *"Preeti — phonetic, easier if you've used it before."*
   *"Unicode — standard layout, used by most government systems."*
2. **Empty/first-run state.** Before the user's first keystroke, show a
   dimmed hint sentence like `Start typing to begin →` instead of a bare
   blank test area.
3. **Error state copy** (Learn page, strict mode): when blocked on a
   wrong key, show the expected key inline — *"Try `Shift + 4` next"* —
   not just a red flash. The flash alone doesn't teach anything.

## 4. Quick wins (do these first, <1hr total)
- [ ] Give the active/correct/error keyboard key states distinct,
      non-overlapping colors (see §1 tokens above) — right now green
      (next key) and green (correct) are the same color, so users can't
      tell "type this" from "you typed this right."
- [ ] Add `focus-visible` outlines in `--accent` to every button/link —
      currently keyboard focus is invisible site-wide.
- [ ] Consistent corner radius: pick one (`rounded-lg` = 8px) and apply
      everywhere; Modal, Navbar, and keyboard keys currently all use
      different radii.
- [ ] Consistent spacing scale: audit for stray `p-3`/`p-4`/`p-5` used
      interchangeably on similarly-weighted containers.

## Priority order
1. Color tokens (§1) — everything else depends on this existing first.
2. Keyboard key state colors (quick win) — directly affects usability of
   the core feature.
3. Icon cleanup (§2).
4. Copy pass (§3).
