# ox_inventory &#183; Jaramiyo's cute edit ✿

A cute reskin **and rich rebuild** of ox_inventory in my soft cacao + rose "uwu"
style: each inventory is a rounded cacao card with a header (icon + name +
weight), a live item **search**, warm slots that lift and glow rose on hover,
cute tooltips / context menu / hotbar, redesigned item notifications, bundled
fonts, little synth **sound effects** (with a mute toggle), and a small
**actions menu** with two extras — **Multi Job** and **toggle hair**.

The whole visual layer is my own clean source (no compiled black boxes). All of
ox_inventory's original systems — items, stashes, shops, crafting, weapons,
weight, drag-and-drop, locales — are Overextended's and untouched.

## What's in it

**Look &amp; feel:**

- Cacao + soft-pink theme, rounded slots that glow rose on hover, cute tooltips,
  context menu, hotbar and redesigned item-notification cards.
- Each inventory is a **card** with a rich header (icon + name + weight) and a
  client-side **item search** that dims non-matching items — positions and
  drag-and-drop stay untouched.
- **Baloo 2 / Karla / JetBrains Mono** bundled locally (no CDN, works offline).
- Soft Web-Audio **sounds** (hover / pickup / drop / use / open / close) with a
  mute toggle in the controls dialog.

**Actions menu (2 extras):** a rose button opens a little menu with —

- **Toggle hair** &mdash; hides/shows the ped's hair instantly. Native, no framework.
- **Multi Job** &mdash; a self-contained multi-job for **ESX** and **Qbox**: each
  player keeps a small pool of jobs (stored in their metadata) and can switch the
  active one or leave one.
  - The active job is always in the pool. Max jobs: convar `inventory:jrmyMaxJobs`
    (default `3`).
  - Other resources (job centres) add jobs to a player's pool:
    `exports.ox_inventory:jrmyMultijobAdd(source, 'police', 0)`
  - The framework is read from the `inventory:framework` convar (the same one
    ox_inventory already uses). Every change is validated server-side; the NUI is
    never trusted.

## Install

**Full resource (recommended):** download or clone, rename the folder to
`ox_inventory`, and use it in place of your current one. Based on ox_inventory
`2.47.9`. This includes the Multi Job + toggle-hair actions.

**Just the look:** copy the **`web/build`** folder over your existing
`ox_inventory/web/build`. You get the full cute UI + sounds; the actions-menu
button appears, but its two actions need the Lua — for those, use the full
resource (or also copy `modules/jrmy/` and add the two script lines to
`fxmanifest.lua`).

## Build it yourself (optional)

```bash
cd web
npm i
npm run build
```

## Credits

- **ox_inventory** by **[Overextended](https://github.com/overextended/ox_inventory)** (Linden, Luke, Dunak and contributors) &mdash; the entire inventory is their work.
- UI redesign, sounds, and the Multi Job + toggle-hair actions: **Jaramiyo** ✿

## License

**GPL-3.0-or-later**, the same as the original. The full license text is in
[LICENSE](LICENSE) and the attribution notice in [NOTICE.md](NOTICE.md) &mdash;
both preserved as the licence requires. This is a modified version of
ox_inventory, and the modifications are released under GPL-3.0-or-later as well.
