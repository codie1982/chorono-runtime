# @chorono/runtime

Framework-free runtime player for [Chorono](../chorono-nextjs) animations. Plays
scenes exported from the editor using the **same evaluation engine** — identical
timeline interpolation, state machines, triggers, and rendering.

> **Distribution repo.** Source of truth lives in `chorono-nextjs`
> (`src/lib/player/`). The `dist/` here is produced by `npm run build:runtime`
> (tsup) in that repo and copied over for publishing. Do not edit `dist/` by hand.

## Install

```bash
npm install @chorono/runtime
```

Or via CDN (used by the editor's standalone HTML export):

```html
<script src="https://unpkg.com/@chorono/runtime/dist/chorono-runtime.global.js"></script>
```

## Usage

### ES module / bundler

```ts
import { ChronoPlayer, CanvasRenderAdapter } from '@chorono/runtime'

const canvas = document.querySelector('canvas')!
const player = new ChronoPlayer(scene, new CanvasRenderAdapter(canvas.getContext('2d')!), { loop: true })

player.play()
player.setParam('userName', 'Engin')
player.dispatch('hover')               // state-machine event
player.on('animationComplete', () => console.log('done'))
```

### Browser global (CDN)

```html
<canvas id="c" width="800" height="600"></canvas>
<script src="https://unpkg.com/@chorono/runtime/dist/chorono-runtime.global.js"></script>
<script>
  const ctx = document.getElementById('c').getContext('2d')
  const player = new Chorono.ChronoPlayer(scene, new Chorono.CanvasRenderAdapter(ctx), { loop: true })
  player.play()
</script>
```

## Protocol

The same control surface on every platform (web / android / core):

| API | Description |
|-----|-------------|
| `play()` / `pause()` / `stop()` / `seek(ms)` | Playback control |
| `tick(timeMs)` | Host-driven frame (custom loop / tests) |
| `dispatch(event, smId?)` | Fire a state-machine event |
| `setParam(name, value)` | Override a scene parameter |
| `on(type, cb)` / `onAny(cb)` | Subscribe to runtime events |

## Build (from chorono-nextjs)

```bash
npm run build:runtime      # tsup → dist/runtime
# then copy dist/runtime/* into this repo's dist/
```
