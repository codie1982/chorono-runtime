# @chorono/runtime

A **framework-free**, **zero-dependency** runtime player for Chorono animations. Play scenes exported from the Chorono editor on the web with the **same evaluation engine** — identical timeline interpolation, state machines, triggers, and rendering.

Perfect for standalone web players, embeds, and integrations where you control the host environment.

---

## 📚 Documentation

**[English Docs](./docs/en/)** | **[Türkçe Dokümantasyon](./docs/tr/)**

- [Getting Started](./docs/en/01-getting-started.md)
- [API Reference](./docs/en/02-api-reference.md)
- [State Machines Guide](./docs/en/03-state-machines.md)
- [Advanced Usage](./docs/en/04-advanced.md)
- [FAQ & Troubleshooting](./docs/en/05-faq.md)

---

## 📦 Examples

See [`/examples`](./examples/) for complete working examples:

- [**Vanilla JavaScript**](./examples/vanilla-js/) — HTML + CSS + JS
- [**React**](./examples/react/) — React Hooks integration
- [**Vue 3**](./examples/vue/) — Vue Composition API
- [**Interactive Controls**](./examples/interactive-controls/) — Play, pause, seek, parameters
- [**State Machines**](./examples/state-machines/) — State transitions and events
- [**Asset & Media Handling**](./examples/assets-media/) — Images, videos, fonts

---

---

## Features

- **Zero dependencies** — Ships as a single ~127KB minified module (or 61KB gzipped via CDN)
- **Framework-agnostic** — Works with vanilla JS, React, Vue, Svelte, or no framework at all
- **Multiple formats** — CommonJS, ES Module, or browser global script tag
- **Same engine as editor** — Identical playback behavior across all platforms
- **State machines** — Trigger transitions, dispatch events, and respond to user input
- **Parameters** — Bind data to scenes dynamically and mutate them at runtime
- **Event system** — Subscribe to animation lifecycle, state changes, and custom events
- **Canvas rendering** — Hardware-accelerated 2D rendering via canvas context
- **Host-driven timing** — Play autonomously or step manually frame-by-frame

---

## Installation

### NPM / Yarn / PNPM

```bash
npm install @chorono/runtime
```

### Browser / CDN

```html
<script src="https://unpkg.com/@chorono/runtime@0.1.0/dist/chorono-runtime.global.js"></script>
<!-- Globals: Chorono.ChronoPlayer, Chorono.CanvasRenderAdapter, etc. -->
```

Or use jsDelivr:

```html
<script src="https://cdn.jsdelivr.net/npm/@chorono/runtime@0.1.0/dist/chorono-runtime.global.js"></script>
```

---

## Quick Start

### 1. Basic Canvas Setup

```ts
import { ChronoPlayer, CanvasRenderAdapter } from '@chorono/runtime'

// Get a canvas element
const canvas = document.querySelector('canvas')!
const ctx = canvas.getContext('2d')!

// Assume `scene` is JSON exported from Chorono editor
const adapter = new CanvasRenderAdapter(ctx)
const player = new ChronoPlayer(scene, adapter, { loop: true })

// Play the animation
player.play()
```

### 2. Listen to Events

```ts
player.on('animationComplete', () => {
  console.log('Animation finished')
})

player.on('stateChange', ({ smId, newStateId }) => {
  console.log(`State machine "${smId}" entered state "${newStateId}"`)
})

player.onAny((event) => {
  console.log('Event:', event)
})
```

### 3. Bind Data Parameters

```ts
// Pass dynamic data to the scene
player.setParam('userName', 'Alice')
player.setParam('score', 1250)
player.setParam('isActive', true)
```

Parameters can be referenced in the editor via expressions and used in state machine guards (conditional transitions).

### 4. Dispatch State Machine Events

```ts
// Trigger a transition (fire a state machine event)
player.dispatch('hover')                    // global event
player.dispatch('click', 'machine-id-123')  // to a specific machine
```

### 5. Browser Global Usage

```html
<canvas id="player" width="1024" height="768"></canvas>

<script src="https://unpkg.com/@chorono/runtime/dist/chorono-runtime.global.js"></script>
<script>
  const ctx = document.getElementById('player').getContext('2d')
  const player = new Chorono.ChronoPlayer(scene, new Chorono.CanvasRenderAdapter(ctx))
  
  player.play()
  
  document.addEventListener('click', () => {
    player.dispatch('click')
  })
</script>
```

---

## API Reference

### ChronoPlayer

#### Constructor

```ts
new ChronoPlayer(scene: ChronoScene, adapter: RenderAdapter, options?: ChronoPlayerOptions)
```

#### Playback Control

| Method | Description |
|--------|-------------|
| `play()` | Start playback from current position |
| `pause()` | Pause playback (position preserved) |
| `stop()` | Stop and reset to 0ms |
| `seek(timeMs: number)` | Jump to a specific time |

#### Frame Control

| Method | Description |
|--------|-------------|
| `tick(timeMs: number)` | Step to a specific time (for custom loops or tests) |

#### Parameters & Events

| Method | Description |
|--------|-------------|
| `setParam(name: string, value: string \| number \| boolean)` | Update a scene parameter at runtime |
| `dispatch(event: string, smId?: string)` | Fire a state machine event globally or for a specific machine |
| `on(type: string, callback: Function)` | Subscribe to a specific event type |
| `onAny(callback: Function)` | Subscribe to all events |

#### State & Properties

| Property | Type | Description |
|----------|------|-------------|
| `currentTimeMs` | `number` | Current playback position in milliseconds |
| `durationMs` | `number` | Total scene duration in milliseconds |
| `isPlaying` | `boolean` | Whether animation is currently playing |

---

## Scene Format

Scenes are JSON objects exported from the Chorono editor. They contain:

- **Timelines** — Sequences of keyframed layers
- **Layers** — Visual elements (shapes, images, text, video)
- **State Machines** — Sets of states and transitions
- **Assets** — Images, videos, fonts, SVGs
- **Parameters** — Dynamic values that can be bound to properties

Example scene structure:

```json
{
  "id": "scene-123",
  "name": "My Animation",
  "durationMs": 3000,
  "width": 1024,
  "height": 768,
  "parameters": [
    { "id": "p1", "name": "userName", "defaultValue": "Guest" },
    { "id": "p2", "name": "score", "defaultValue": 0 }
  ],
  "timelines": [ /* ... */ ],
  "layers": [ /* ... */ ],
  "stateMachines": [ /* ... */ ],
  "assets": [ /* ... */ ]
}
```

---

## Rendering

### CanvasRenderAdapter

Renders scenes to a 2D canvas context.

```ts
const canvas = document.querySelector('canvas')!
const ctx = canvas.getContext('2d')!
const adapter = new CanvasRenderAdapter(ctx)

const player = new ChronoPlayer(scene, adapter)
```

The adapter handles:
- Shape drawing (rects, circles, paths)
- Image and video rendering
- Text rendering with custom fonts
- Blend modes and clipping
- Layer transforms and opacity

### Custom Rendering

To implement custom rendering (WebGL, SVG, etc.), extend `RenderAdapter`:

```ts
class MyCustomAdapter extends RenderAdapter {
  render(frame: RenderFrame): void {
    // Your rendering code
  }
}

const player = new ChronoPlayer(scene, new MyCustomAdapter())
```

---

## State Machines

State machines define interactive behavior. Each machine has states and transitions triggered by events.

### Example: Button Toggle

```json
{
  "id": "button-machine",
  "states": [
    {
      "id": "idle",
      "label": "Idle (unpressed)",
      "timeline": "timeline-idle"
    },
    {
      "id": "pressed",
      "label": "Pressed",
      "timeline": "timeline-pressed"
    }
  ],
  "transitions": [
    {
      "from": "idle",
      "to": "pressed",
      "trigger": "press",
      "duration": 200
    },
    {
      "from": "pressed",
      "to": "idle",
      "trigger": "release",
      "duration": 200
    }
  ]
}
```

Dispatch events:

```ts
player.dispatch('press')    // idle → pressed
player.dispatch('release')  // pressed → idle
```

### Guards (Conditional Transitions)

Transitions can have guards — conditions based on parameters that must be true to fire.

```json
{
  "from": "idle",
  "to": "error",
  "guard": "score < 0",  // Guard condition
  "duration": 300
}
```

Guard-based transitions auto-fire every frame if conditions are met.

---

## Events

The player emits events for lifecycle and state changes.

### Event Types

| Event | Payload | When |
|-------|---------|------|
| `play` | — | Playback starts |
| `pause` | — | Playback pauses |
| `stop` | — | Playback stops |
| `timelineStart` | `{ timelineId, timeMs }` | A timeline begins |
| `timelineEnd` | `{ timelineId, timeMs }` | A timeline completes |
| `animationComplete` | — | Entire scene finishes (when loop=false) |
| `stateChange` | `{ smId, oldStateId, newStateId }` | State machine transitions |
| `paramChange` | `{ name, oldValue, newValue }` | A parameter is updated |

```ts
player.on('stateChange', (evt) => {
  console.log(`State machine "${evt.smId}" changed states`)
})

player.on('paramChange', (evt) => {
  console.log(`Parameter "${evt.name}" = ${evt.newValue}`)
})
```

---

## Assets

Assets are images, videos, fonts, SVGs, and other media. The scene references assets by ID.

### Asset Types

- **image** — PNG, JPG, WebP, etc.
- **video** — MP4, WebM, Ogg
- **audio** — MP3, WAV, OGG
- **font** — TTF, OTF, WOFF
- **svg** — Scalable vector graphics
- **lottie** — Lottie animation files
- **spriteSheet** — Grid-based frame animations
- **gif** — Animated GIFs

Assets can be:
- **Embedded** — Base64-encoded in the scene JSON
- **External** — Hosted on a CDN or your server
- **Project-relative** — Part of the exported scene package

---

## Options

### ChronoPlayerOptions

```ts
interface ChronoPlayerOptions {
  loop?: boolean              // Repeat when finished (default: false)
  speed?: number              // Playback speed multiplier (default: 1.0)
  autoPlay?: boolean          // Start playing immediately (default: false)
  tickRate?: number           // Frame rate target in Hz (default: 60)
}
```

Usage:

```ts
const player = new ChronoPlayer(scene, adapter, {
  loop: true,
  speed: 0.5,      // Play at half speed
  autoPlay: true
})
```

---

## Platforms

This is a **distribution package**. The same engine runs on:

- **Web** (this package: `@chorono/runtime`) — Canvas 2D rendering
- **Android** ([`chorono-android-sdk`](../chorono-android-sdk)) — Native Android rendering
- **Editor** ([`chorono-editor`](../chorono-editor)) — Desktop application

All platforms use identical timeline evaluation, state machine logic, and parameter resolution — guaranteeing consistent playback everywhere. A scene exported from the editor plays identically on web, Android, and in the editor itself.

---

## Performance

- **Bundle size**: ~127KB minified, ~61KB gzipped
- **No external dependencies** — No version conflicts
- **Optimized** — Single draw call per frame, efficient event dispatching
- **Hardware acceleration** — Leverages canvas and browser compositing

For large scenes or high frame counts:
- Use `CanvasRenderAdapter` with a high-DPI canvas for crisp rendering
- Limit the number of simultaneous animations on a page
- Use `dispose()` to clean up resources when done

---

## Debugging

### Enable Logging

```ts
// Print all events to console
player.onAny((event) => {
  console.log('[Chorono]', event)
})
```

### Frame-by-Frame Stepping

```ts
player.pause()

// Step frame-by-frame
setInterval(() => {
  player.tick(player.currentTimeMs + 16.67)  // ~60fps
}, 16.67)
```

### State Inspection

```ts
// Check current state of a machine
const machine = player.getStateMachine('my-machine')
console.log(machine.currentStateId)
```

---

## Examples

### React Integration

```tsx
import { useEffect, useRef } from 'react'
import { ChronoPlayer, CanvasRenderAdapter } from '@chorono/runtime'

export function ChronoAnimation({ scene }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const playerRef = useRef<ChronoPlayer | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext('2d')!
    const adapter = new CanvasRenderAdapter(ctx)
    playerRef.current = new ChronoPlayer(scene, adapter, { loop: true })
    playerRef.current.play()

    return () => {
      playerRef.current?.stop()
    }
  }, [scene])

  return <canvas ref={canvasRef} width={1024} height={768} />
}
```

### Vue Integration

```vue
<template>
  <canvas ref="canvas" width="1024" height="768"></canvas>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { ChronoPlayer, CanvasRenderAdapter } from '@chorono/runtime'

const canvas = ref(null)
let player = null

onMounted(() => {
  const ctx = canvas.value.getContext('2d')
  const adapter = new CanvasRenderAdapter(ctx)
  player = new ChronoPlayer(scene, adapter, { loop: true })
  player.play()
})

onUnmounted(() => {
  player?.stop()
})
</script>
```

### Interactive Buttons

```html
<canvas id="player" width="800" height="600"></canvas>
<button id="playBtn">Play</button>
<button id="pauseBtn">Pause</button>
<input type="range" id="timeline" min="0" max="3000" />

<script src="https://unpkg.com/@chorono/runtime/dist/chorono-runtime.global.js"></script>
<script>
  const Chorono = window.Chorono
  const ctx = document.getElementById('player').getContext('2d')
  const player = new Chorono.ChronoPlayer(
    scene,
    new Chorono.CanvasRenderAdapter(ctx)
  )

  document.getElementById('playBtn').onclick = () => player.play()
  document.getElementById('pauseBtn').onclick = () => player.pause()
  
  document.getElementById('timeline').oninput = (e) => {
    player.seek(parseFloat(e.target.value))
  }
</script>
```

---

## Repository Structure

This is a **distribution package**. Source code lives in [`chorono-editor`](../chorono-editor) at `src/lib/player/`.

```
chorono-editor/src/lib/player/     ← Source of truth
  ├── ChronoPlayer.ts
  ├── CanvasRenderAdapter.ts
  ├── TimelineEngine.ts
  ├── StateMachineRuntime.ts
  └── ...

chorono-runtime/ (this repo)        ← Published distribution
  ├── dist/
  │   ├── chorono-runtime.mjs       (ES Module)
  │   ├── chorono-runtime.js        (CommonJS)
  │   ├── chorono-runtime.global.js (Browser global)
  │   ├── chorono-runtime.d.ts      (TypeScript definitions)
  │   └── *.map                     (Source maps)
  └── package.json
```

### Building

The build is managed in `chorono-editor`:

```bash
# In chorono-editor repo
npm run build:runtime      # tsup → dist/

# Outputs are copied to chorono-runtime/dist/ for publishing
```

Do not edit files in `dist/` by hand — they are generated.

---

## License

MIT License — see [LICENSE](./LICENSE) for details.

You are free to:
- Use this in commercial projects
- Modify and distribute
- Use privately

You only need to:
- Include a copy of the license and copyright notice

---

## Support

- **Report issues**: [GitHub Issues](https://github.com/your-org/chorono/issues)
- **Documentation**: Full API docs in TypeScript definitions
- **Examples**: Check the `/examples` folder in this repo
