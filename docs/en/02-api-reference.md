# API Reference

Complete documentation of all classes, methods, and types.

## ChronoPlayer

The main class for playing Chorono scenes.

### Constructor

```ts
new ChronoPlayer(
  scene: ChronoScene,
  adapter: RenderAdapter,
  options?: ChronoPlayerOptions
)
```

**Parameters:**
- `scene` — The animation scene (JSON exported from editor)
- `adapter` — A RenderAdapter implementation (e.g., CanvasRenderAdapter)
- `options` — Optional configuration

---

### Playback Methods

#### `play()`
Start or resume playback from the current position.

```ts
player.play()
```

#### `pause()`
Pause playback. The current position is preserved.

```ts
player.pause()
```

#### `stop()`
Stop playback and reset to time 0.

```ts
player.stop()
```

#### `seek(timeMs: number)`
Jump to a specific time in milliseconds.

```ts
player.seek(500)  // Jump to 500ms
```

---

### Frame Control

#### `tick(timeMs: number)`
Step to a specific time (useful for custom loops or tests).

```ts
// Manually step through animation
player.pause()
player.tick(0)
player.tick(16.67)  // ~60fps
player.tick(33.34)
```

---

### Parameters

#### `setParam(name: string, value: RuntimeValue)`
Update a scene parameter at runtime.

```ts
player.setParam('userName', 'Alice')
player.setParam('score', 1250)
player.setParam('isActive', true)
```

Parameters can be referenced in the editor and used in state machine guards.

**Supported types:** `string | number | boolean`

---

### State Machines

#### `dispatch(event: string, smId?: string): void`
Fire a state machine event.

**Global event (all machines):**
```ts
player.dispatch('hover')
player.dispatch('click')
```

**Specific machine:**
```ts
player.dispatch('press', 'button-machine-id')
```

#### `getStateMachine(smId: string): StateMachineRuntime | undefined`
Get a state machine by ID (for inspection).

```ts
const machine = player.getStateMachine('my-machine')
console.log(machine?.currentStateId)
```

---

### Events

#### `on(type: string, callback: (event: any) => void): void`
Subscribe to a specific event type.

```ts
player.on('play', () => {
  console.log('Started playing')
})

player.on('stateChange', (evt) => {
  console.log(`State: ${evt.oldStateId} → ${evt.newStateId}`)
})
```

#### `onAny(callback: (event: any) => void): void`
Subscribe to all events.

```ts
player.onAny((event) => {
  console.log('Event:', event)
})
```

---

### Properties

#### `currentTimeMs: number` (read-only)
Current playback position in milliseconds.

```ts
console.log(player.currentTimeMs)  // e.g., 1500
```

#### `durationMs: number` (read-only)
Total duration of the scene in milliseconds.

```ts
console.log(player.durationMs)  // e.g., 3000
```

#### `isPlaying: boolean` (read-only)
Whether the animation is currently playing.

```ts
if (player.isPlaying) {
  console.log('Playing')
}
```

---

## CanvasRenderAdapter

Renders scenes to a 2D canvas context.

### Constructor

```ts
new CanvasRenderAdapter(ctx: CanvasRenderingContext2D)
```

**Parameters:**
- `ctx` — A 2D canvas rendering context

### Usage

```ts
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const adapter = new CanvasRenderAdapter(ctx)

const player = new ChronoPlayer(scene, adapter)
```

### Features

- Shape rendering (rectangles, circles, paths)
- Image and video rendering
- Text with custom fonts
- Blend modes and clipping
- Layer transforms and opacity
- Efficient redraw

---

## Custom RenderAdapter

To implement custom rendering (WebGL, SVG, etc.), extend `RenderAdapter`:

```ts
abstract class RenderAdapter {
  abstract render(frame: RenderFrame): void
}
```

### Example: WebGL Adapter (Pseudo-code)

```ts
class WebGLRenderAdapter extends RenderAdapter {
  constructor(private gl: WebGLRenderingContext) {
    super()
  }

  render(frame: RenderFrame): void {
    // Clear the WebGL context
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)

    // Render each layer
    for (const layer of frame.scene.layers) {
      this.renderLayer(layer, frame)
    }
  }

  private renderLayer(layer: Layer, frame: RenderFrame) {
    // Your WebGL rendering code
  }
}

// Use it
const adapter = new WebGLRenderAdapter(gl)
const player = new ChronoPlayer(scene, adapter)
```

---

## EventBridge

Low-level event system (usually not needed directly).

```ts
class EventBridge {
  on(type: string, callback: (event: any) => void): void
  onAny(callback: (event: any) => void): void
  emit(event: RuntimeEvent): void
}
```

---

## Event Types

### Lifecycle Events

| Event | Payload | When |
|-------|---------|------|
| `play` | — | Playback starts |
| `pause` | — | Playback pauses |
| `stop` | — | Playback stops |
| `tick` | `{ currentTimeMs }` | Every frame |

### Timeline Events

| Event | Payload | When |
|-------|---------|------|
| `timelineStart` | `{ timelineId, timeMs }` | Timeline begins |
| `timelineEnd` | `{ timelineId, timeMs }` | Timeline ends |
| `animationComplete` | — | Entire scene finishes (loop=false) |

### State Machine Events

| Event | Payload | When |
|-------|---------|------|
| `stateChange` | `{ smId, oldStateId, newStateId }` | State machine transitions |
| `stateEnter` | `{ smId, stateId }` | Entering a state |
| `stateExit` | `{ smId, stateId }` | Leaving a state |

### Parameter Events

| Event | Payload | When |
|-------|---------|------|
| `paramChange` | `{ name, oldValue, newValue }` | Parameter updated via `setParam()` |

### Example: Listening to Events

```ts
player.on('play', () => console.log('Started'))
player.on('stateChange', (evt) => {
  console.log(`SM ${evt.smId}: ${evt.oldStateId} → ${evt.newStateId}`)
})
player.on('paramChange', (evt) => {
  console.log(`${evt.name} = ${evt.newValue}`)
})
player.on('animationComplete', () => console.log('Done!'))
```

---

## ChronoPlayerOptions

Configuration options passed to the constructor.

```ts
interface ChronoPlayerOptions {
  /**
   * Whether to restart when the scene finishes.
   * @default false
   */
  loop?: boolean

  /**
   * Playback speed multiplier (0.5 = half speed, 2 = double speed).
   * @default 1.0
   */
  speed?: number

  /**
   * Start playing immediately on creation.
   * @default false
   */
  autoPlay?: boolean

  /**
   * Target frame rate in Hz (for browser-independent timing).
   * @default 60
   */
  tickRate?: number
}
```

### Example

```ts
const player = new ChronoPlayer(scene, adapter, {
  loop: true,
  speed: 0.5,      // Play at half speed
  autoPlay: false,
  tickRate: 60
})
```

---

## ChronoScene

The scene object exported from the Chorono editor.

```ts
interface ChronoScene {
  id: string
  name: string
  durationMs: number
  width: number
  height: number
  backgroundColor?: string

  parameters?: Parameter[]
  layers?: Layer[]
  timelines?: Timeline[]
  stateMachines?: StateMachineDefinition[]
  assets?: Asset[]
}
```

### Key Properties

- **id** — Unique scene identifier
- **name** — Human-readable name
- **durationMs** — Total animation duration in milliseconds
- **width, height** — Canvas dimensions in pixels
- **parameters** — Dynamic data bindings
- **layers** — Visual elements (shapes, images, text, etc.)
- **timelines** — Keyframe sequences
- **stateMachines** — Interactive state definitions
- **assets** — Images, videos, fonts, etc.

---

## RenderFrame

Data passed to the render adapter every frame.

```ts
interface RenderFrame {
  scene: ChronoScene
  timeMs: number              // Current playback time
  overrides: OverrideMap      // Visual property overrides
  paramValues: ParamValueMap  // Current parameter values
  assets: AssetElementMap     // Loaded asset elements
}
```

---

## Type Definitions

Full TypeScript definitions are included. Import them:

```ts
import type {
  ChronoScene,
  ChronoPlayer,
  ChronoPlayerOptions,
  RenderAdapter,
  RenderFrame,
  Asset,
  Layer,
  Timeline,
  StateMachineDefinition,
  RuntimeValue,
  RuntimeEvent
} from '@chorono/runtime'
```

---

## Browser Compatibility

Supported:
- Chrome/Edge 60+
- Firefox 55+
- Safari 12+
- iOS Safari 12+
- Android Browser 4.4+

---

## Glossary

**Scene** — A complete animation with layers, timelines, and state machines.

**Timeline** — A sequence of keyframes for an animation segment.

**Layer** — A visual element (shape, image, text, video, etc.).

**State Machine** — A set of states and transitions for interactive behavior.

**Adapter** — A renderer that converts scenes into visual output (canvas, WebGL, etc.).

**Parameter** — A dynamic data value that can be bound to layer properties.

**Asset** — An image, video, font, or other media file.

---

## Next Steps

- Learn about [State Machines](./03-state-machines.md)
- See [Advanced Usage](./04-advanced.md) for optimization
- Check [examples](../../examples/) for real code
