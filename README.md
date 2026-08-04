# ox_inventory &#183; Jaramiyo's cute edit ✿

A full cute reskin of ox_inventory in my soft cacao + rose "uwu" style — warm
cacao slots that lift and glow rose when you hover them, pastel-pink accents,
rounded corners, Baloo 2 type, and little synthesised **sound effects** for
hovering, picking up, dropping and using items and for opening the inventory
(with a mute toggle in the controls dialog).

**This is a UI-only reskin.** I only restyled the `web/` interface (the SCSS
theme, a few cute touches, and the sounds). Every bit of ox_inventory's Lua —
the item logic, stashes, shops, crafting, weapons, weight, the drag-and-drop
mechanics and all the locales — is Overextended's, untouched. It behaves exactly
like normal ox_inventory; it's just adorable now.

## What I changed

- Rewrote the SCSS theme: cacao surface palette, soft-pink accent, rounded slots
  that lift + glow rose on hover, cute tooltips / context menu / hotbar / item
  notifications, a rose scrollbar and a rounded weight bar.
- Bundled **Baloo 2 / Karla / JetBrains Mono** fonts locally (no CDN — they
  always load, even offline). Numbers use JetBrains Mono.
- Added soft Web-Audio sound effects (`web/src/utils/sfx.ts`) wired into hover /
  pickup / drop / use / open / close, with a mute toggle (remembered in
  `localStorage`) inside the "useful controls" dialog.
- No changes to Lua, item logic, drag-and-drop, weight, or the locales.

## Install

**Option A &mdash; just the look (recommended, zero backend risk):**

Copy the **`web/build`** folder from here over your existing
`ox_inventory/web/build` and restart the resource. That's the whole redesign, so
you keep your exact ox_inventory version and everything keeps working.

**Option B &mdash; full resource:**

Download or clone this, rename the folder to `ox_inventory`, and use it in place
of your current one. Based on ox_inventory `2.47.9`.

## Build it yourself (optional)

```bash
cd web
npm i
npm run build
```

## Credits

- **ox_inventory** by **[Overextended](https://github.com/overextended/ox_inventory)** (Linden, Luke, Dunak and contributors) &mdash; the entire inventory is their work.
- UI redesign + sounds: **Jaramiyo** ✿

## License

**GPL-3.0-or-later**, the same as the original. The full license text is in
[LICENSE](LICENSE) and the attribution notice in [NOTICE.md](NOTICE.md) &mdash;
both preserved as the licence requires. This is a modified version of
ox_inventory, and the modifications (the UI redesign) are released under
GPL-3.0-or-later as well.
