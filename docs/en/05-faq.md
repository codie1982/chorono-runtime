# FAQ & Troubleshooting

Common questions and solutions.

## Installation & Setup

### Q: Can I use @chorono/runtime without Node.js?
**A:** Yes! Use the CDN version:
```html
<script src="https://unpkg.com/@chorono/runtime/dist/chorono-runtime.global.js"></script>
```
No build step needed.

### Q: What about TypeScript?
**A:** Full types are included. Just import normally:
```ts
import { ChronoPlayer, CanvasRenderAdapter } from '@chorono/runtime'
```

### Q: Do I need a build tool?
**A:** No. Works with any bundler (Webpack, Vite, Rollup, esbuild, etc.) or CDN.

---

## Scene & Assets

### Q: Where do I get scenes?
**A:** Export from the Chorono editor as JSON.

### Q: How do I load a scene from a file?
**A:** Use fetch:
```ts
const response = await fetch('./scene.json')
const scene = await response.json()
const player = new ChronoPlayer(scene, adapter)
```

### Q: Can I modify a scene after loading?
**A:** Not recommended. The runtime expects immutable scenes. If you need dynamic content, use **parameters** instead.

### Q: How do I handle external images/videos?
**A:** Set the asset URL in the scene:
```json
{
  "assets": [
    {
      "id": "img-1",
      "type": "image",
      "url": "https://example.com/image.jpg"
    }
  ]
}
```
The runtime loads them automatically.

### Q: Can I use embedded (base64) assets?
**A:** Yes, the editor can embed assets. They come as data URIs:
```json
{
  "assets": [
    {
      "id": "img-1",
      "type": "image",
      "url": "data:image/png;base64,iVBORw0KG..."
    }
  ]
}
```

### Q: How do I preload assets?
**A:** The runtime loads assets on-demand. To preload:
```ts
async function preloadAssets(scene: ChronoScene) {
  const promises = scene.assets?.map(asset => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = resolve
      img.src = asset.url
    })
  }) || []

  await Promise.all(promises)
}

await preloadAssets(scene)
player.play()
```

---

## Playback & Timing

### Q: Why doesn't the animation play?
**A:** Call `player.play()`:
```ts
const player = new ChronoPlayer(scene, adapter)
player.play()  // Required!
```

### Q: How do I make it auto-play?
**A:** Use the `autoPlay` option:
```ts
const player = new ChronoPlayer(scene, adapter, { autoPlay: true })
```

### Q: Can I change the speed?
**A:** Yes, use the `speed` option:
```ts
const player = new ChronoPlayer(scene, adapter, { speed: 0.5 })  // Half speed
```

### Q: How do I get the current time?
**A:**
```ts
console.log(player.currentTimeMs)  // Milliseconds
console.log(player.durationMs)     // Total duration
```

### Q: Can I jump to a specific time?
**A:** Yes:
```ts
player.seek(1500)  // Jump to 1.5 seconds
```

### Q: What about looping?
**A:**
```ts
const player = new ChronoPlayer(scene, adapter, { loop: true })
```

---

## State Machines & Events

### Q: How do I dispatch an event?
**A:**
```ts
player.dispatch('eventName')
```

### Q: How do I dispatch to a specific machine?
**A:**
```ts
player.dispatch('eventName', 'machine-id-123')
```

### Q: My event doesn't trigger a transition?
**A:** Check:
1. Machine ID is correct (if targeting specific machine)
2. Current state has a transition for that event
3. Guard condition (if present) evaluates to true

```ts
const sm = player.getStateMachine('my-machine')
console.log('Current state:', sm?.currentStateId)  // Is transition from here?

player.setParam('score', 1000)  // If guard depends on parameter
player.dispatch('myEvent')      // Then dispatch
```

### Q: How do I listen to state changes?
**A:**
```ts
player.on('stateChange', ({ smId, oldStateId, newStateId }) => {
  console.log(`State changed: ${oldStateId} → ${newStateId}`)
})
```

### Q: Can I have multiple machines?
**A:** Yes. The scene can have many machines. Dispatch to all or specific:
```ts
player.dispatch('reset')           // All machines
player.dispatch('click', 'button')  // Specific machine
```

---

## Parameters & Data Binding

### Q: How do I pass data to the scene?
**A:** Use parameters:
```ts
player.setParam('userName', 'Alice')
player.setParam('score', 1250)
player.setParam('isActive', true)
```

### Q: What types can parameters be?
**A:** `string | number | boolean`

### Q: How do I read a parameter?
**A:** There's no built-in getter. If you need to read back:
```ts
let currentUserName = 'Alice'
player.setParam('userName', currentUserName)

// Listen for changes
player.on('paramChange', ({ name, newValue }) => {
  if (name === 'userName') {
    currentUserName = newValue
  }
})
```

### Q: Can I use parameters in guards?
**A:** Yes:
```json
{
  "transition": {
    "from": "idle",
    "to": "error",
    "trigger": "submit",
    "guard": "score < 0"
  }
}
```

---

## Rendering & Performance

### Q: The canvas is blurry on high-DPI screens?
**A:** Scale to device pixel ratio:
```ts
const dpr = window.devicePixelRatio || 1
canvas.width = 1024 * dpr
canvas.height = 768 * dpr
canvas.style.width = '1024px'
canvas.style.height = '768px'

const ctx = canvas.getContext('2d')
ctx.scale(dpr, dpr)
```

### Q: How do I get better performance?
**A:**
1. Use appropriate canvas size (not 4K on mobile)
2. Limit visible layers
3. Cache asset elements
4. Throttle event handlers
5. Use `requestAnimationFrame` for smooth timing

See [Advanced Usage](./04-advanced.md) for optimization techniques.

### Q: Can I render to something other than Canvas?
**A:** Yes, create a custom RenderAdapter (SVG, WebGL, Threejs, etc.). See [Advanced Usage](./04-advanced.md#custom-render-adapters).

---

## Framework Integration

### Q: Can I use this with React?
**A:** Yes. Use a ref and useEffect:
```tsx
import { useEffect, useRef } from 'react'
import { ChronoPlayer, CanvasRenderAdapter } from '@chorono/runtime'

export function Animation({ scene }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    const player = new ChronoPlayer(scene, new CanvasRenderAdapter(ctx))
    player.play()

    return () => player.stop()
  }, [scene])

  return <canvas ref={canvasRef} width={1024} height={768} />
}
```

See `/examples/react/` for full example.

### Q: What about Vue?
**A:** Use `ref()` and `onMounted`:
```vue
<template>
  <canvas ref="canvas"></canvas>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { ChronoPlayer, CanvasRenderAdapter } from '@chorono/runtime'

const canvas = ref(null)

onMounted(() => {
  const ctx = canvas.value.getContext('2d')
  const player = new ChronoPlayer(scene, new CanvasRenderAdapter(ctx))
  player.play()
})
</script>
```

See `/examples/vue/` for full example.

### Q: Can I use this with Svelte, Angular, etc.?
**A:** Yes. It's just a JavaScript class, works with any framework.

---

## Mobile & Browser Compatibility

### Q: Does this work on mobile?
**A:** Yes. Canvas is supported on iOS Safari and Android browsers.

### Q: Is it touch-compatible?
**A:** The runtime handles playback. You handle touch events:
```ts
canvas.addEventListener('touchstart', () => {
  player.dispatch('click')
})
```

### Q: What about old browsers?
**A:** Canvas 2D is required (IE 9+, all modern browsers). For IE 8, use a fallback renderer.

### Q: Does it work offline?
**A:** Yes. Once loaded, it works entirely offline. Assets must be embedded or pre-cached.

---

## Errors & Debugging

### Q: I see "canvas context is null"?
**A:** Make sure the canvas element exists and the context is created:
```ts
const canvas = document.querySelector('canvas')
if (!canvas) throw new Error('Canvas not found')

const ctx = canvas.getContext('2d')
if (!ctx) throw new Error('Canvas 2D not supported')
```

### Q: "Scene is invalid"?
**A:** Check:
1. Scene is valid JSON
2. Scene has required fields (id, durationMs, width, height)
3. Timelines and layers exist

### Q: Nothing renders?
**A:** Check:
1. Canvas context is created
2. Scene has layers and timelines
3. `player.play()` is called
4. No console errors

### Q: State machine doesn't transition?
**A:** Debug:
```ts
const sm = player.getStateMachine('my-machine')
console.log('Current:', sm?.currentStateId)
console.log('Score:', player.currentParam?.('score'))  // If guard uses score

// Check for console errors
player.onAny(evt => console.log(evt))
```

### Q: Performance is slow?
**A:**
1. Check canvas size (not too large)
2. Profile in DevTools
3. Reduce layer count
4. Check for memory leaks

---

## General

### Q: Is it free?
**A:** Yes, MIT Licensed.

### Q: Can I use it commercially?
**A:** Yes, no restrictions.

### Q: Where's the source code?
**A:** In the [chorono-editor](https://github.com/your-org/chorono-editor) repo at `src/lib/player/`.

### Q: How do I report a bug?
**A:** [Create an issue](https://github.com/your-org/chorono-runtime/issues).

### Q: Can I contribute?
**A:** Yes! Check the contributing guidelines in the main repo.

---

## Still have questions?

- 📖 Read the full [documentation](./index.md)
- 💻 Check the [examples](../../examples/)
- 🐛 [Open an issue](https://github.com/your-org/chorono-runtime/issues)
- 💬 Join our Discord (coming soon)

**Happy animating! 🎨**
