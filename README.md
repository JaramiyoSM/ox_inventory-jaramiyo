# ox_inventory &#183; Jaramiyo's cute edit ✿

A cute rebuild of ox_inventory in my soft cacao + rose "uwu" style — a single
rounded panel with **three tabs**:

- **Inventory** &mdash; your inventory (and any container you open, stacked below),
  each a card with a header (icon + name + weight) and a live **item search**,
  plus a fixed control bar (quantity · use · give · close).
- **Appearance** &mdash; **clothing** slots you can put on / take off with the
  in-game dressing **animation**, and an **actions** section with two extras:
  **Multi Job** and **toggle hair**.
- **Settings** &mdash; the controls cheatsheet and a **colour picker** that
  re-tints the whole UI live (and remembers your choice).

Warm slots that lift and glow on hover, cute tooltips / context menu / hotbar,
redesigned item notifications, bundled fonts, and little synthesised **sound
effects** — all my own clean source, no compiled black boxes. Everything is
**bilingual (English / Spanish)** straight from `locales/`.

The whole inventory is the full, open resource: ox_inventory's original systems
(items, stashes, shops, crafting, weapons, weight, drag-and-drop) are
Overextended's and untouched — I only rebuilt the interface and added the two
extra actions.

## Configuration

Everything is set with convars (put them in your `server.cfg`):

```cfg
# accent colour framework picks up (players can also change it in Settings)
setr inventory:framework "esx"        # or "qbx"

# Multi Job — how many jobs a player can hold in their pool
setr inventory:jrmyMaxJobs 3
```

- **Multi Job** is self-contained for **ESX** and **Qbox**: each player keeps a
  small pool of jobs in their metadata and can switch the active one or leave
  one. The active job is always in the pool, and everything is validated
  server-side (the NUI is never trusted).
- Job centres / other resources add a job to a player's pool with:
  `exports.ox_inventory:jrmyMultijobAdd(source, 'police', 0)`
- **Toggle hair** and the **clothing** slots are native (no framework), fail-safe
  (they store what was on and restore it, so a piece can never get stuck) and
  play the game's dressing animation.

## Languages

`locales/en.json` and `locales/es.json` include every string the UI adds
(`jrmy_*` keys). Set `setr ox:locale "es"` (or `en`) and the interface follows.
Add the same keys to another locale file to translate it further.

## Install

Download or clone, rename the folder to `ox_inventory`, and use it in place of
your current one. It's the complete resource (source **and** the compiled
`web/build`), based on ox_inventory `2.47.9`.

## Build it yourself (optional)

```bash
cd web
npm i
npm run build
```

## Credits

- **ox_inventory** by **[Overextended](https://github.com/overextended/ox_inventory)** (Linden, Luke, Dunak and contributors) &mdash; the entire inventory is their work.
- UI rebuild, sounds, and the Multi Job / appearance actions: **Jaramiyo** ✿

## License

**GPL-3.0-or-later**, the same as the original. The full license text is in
[LICENSE](LICENSE) and the attribution notice in [NOTICE.md](NOTICE.md) &mdash;
both preserved as the licence requires. This is a modified version of
ox_inventory, released under GPL-3.0-or-later as well.
