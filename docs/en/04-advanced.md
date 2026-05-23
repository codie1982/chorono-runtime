# Advanced Usage

Deep dive into performance, custom rendering, and debugging.

## Custom Render Adapters

Create a custom adapter to render with WebGL, SVG, or any other technology.

### RenderAdapter Base Class

```ts
abstract class RenderAdapter {
  abstract render(frame: RenderFrame): void
}
```

### Example: SVG Adapter (Skeleton)

```ts
class SVGRenderAdapter extends RenderAdapter {
  private svg: SVGSVGElement

  constructor(container: HTMLElement, width: number, height: number) {
    super()
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    this.svg.setAttribute('width', String(width))
    this.svg.setAttribute('height', String(height))
    container.appendChild(this.svg)
  }

  render(frame: RenderFrame): void {
    // Clear previous content
    this.svg.innerHTML = ''

    // Render each layer
    for (const layer of frame.scene.layers) {
      this.renderLayer(layer, frame)
    }
  }

  private renderLayer(layer: Layer, frame: RenderFrame) {
    // Get computed properties for this layer at current time
    const props = this.computeLayerProperties(layer, frame)

    // Create SVG element based on layer type
    switch (layer.type) {
      case 'rect':
        this.renderRect(layer, props)
        break
      case 'text':
        this.renderText(layer, props)
        break
      case 'image':
        this.renderImage(layer, props, frame)
        break
    }
  }

  private renderRect(layer: Layer, props: LayerProps) {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('x', String(props.x))
    rect.setAttribute('y', String(props.y))
    rect.setAttribute('width', String(props.width))
    rect.setAttribute('height', String(props.height))
    rect.setAttribute('fill', props.color)
    rect.setAttribute('opacity', String(props.opacity))
    this.svg.appendChild(rect)
  }

  private renderText(layer: Layer, props: LayerProps) {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    text.setAttribute('x', String(props.x))
    text.setAttribute('y', String(props.y))
    text.setAttribute('font-size', String(props.fontSize))
    text.setAttribute('fill', props.color)
    text.textContent = props.text
    this.svg.appendChild(text)
  }

  private renderImage(layer: Layer, props: LayerProps, frame: RenderFrame) {
    const image = document.createElementNS('http://www.w3.org/2000/svg', 'image')
    const asset = frame.assets.get(layer.assetId)
    if (asset) {
      image.setAttribute('href', asset.src)
      image.setAttribute('x', String(props.x))
      image.setAttribute('y', String(props.y))
      image.setAttribute('width', String(props.width))
      image.setAttribute('height', String(props.height))
      this.svg.appendChild(image)
    }
  }

  private computeLayerProperties(layer: Layer, frame: RenderFrame): LayerProps {
    // Evaluate keyframes at current time to get layer properties
    // This is simplified; real implementation would interpolate keyframes
    return {
      x: layer.x || 0,
      y: layer.y || 0,
      width: layer.width || 100,
      height: layer.height || 100,
      color: layer.color || '#000',
      opacity: layer.opacity ?? 1,
      fontSize: layer.fontSize || 16,
      text: layer.text || ''
    }
  }
}

// Usage
const container = document.getElementById('animation')
const adapter = new SVGRenderAdapter(container, 1024, 768)
const player = new ChronoPlayer(scene, adapter)
```

---

## Manual Frame Control

Use `tick()` to step through animation frame-by-frame. Useful for testing or synchronized playback.

### Pause and Step

```ts
player.pause()

// Step 16.67ms at a time (60fps)
setInterval(() => {
  player.tick(player.currentTimeMs + 16.67)
}, 16.67)
```

### Synchronized with External Timer

```ts
let startTime = 0

requestAnimationFrame(function animate(now) {
  if (!startTime) startTime = now
  const elapsed = now - startTime

  player.tick(elapsed)

  requestAnimationFrame(animate)
})
```

### Testing

```ts
// Test a specific point in the animation
player.seek(1500)  // Jump to 1.5s
player.tick(1500)

// Verify state at that time
console.log(player.currentTimeMs)  // 1500
```

---

## Performance Optimization

### 1. Canvas Resolution

For high-DPI displays, render at device pixel ratio but scale down in CSS:

```ts
const dpr = window.devicePixelRatio || 1
canvas.width = 1024 * dpr
canvas.height = 768 * dpr
canvas.style.width = '1024px'
canvas.style.height = '768px'

const ctx = canvas.getContext('2d')
ctx.scale(dpr, dpr)
```

### 2. Visible Layers Only

Don't render invisible or off-screen layers:

```ts
// In custom adapter
private shouldRender(layer: Layer, props: LayerProps): boolean {
  // Check if layer is visible
  if (props.opacity <= 0) return false

  // Check if off-screen
  if (props.x + props.width < 0) return false
  if (props.y + props.height < 0) return false

  return true
}
```

### 3. Asset Caching

Decode and cache assets on first use:

```ts
class CachedAssetManager {
  private cache = new Map<string, HTMLImageElement>()

  getImage(assetId: string, src: string): HTMLImageElement {
    if (this.cache.has(assetId)) {
      return this.cache.get(assetId)!
    }

    const img = new Image()
    img.src = src
    this.cache.set(assetId, img)
    return img
  }
}
```

### 4. Throttle Event Handlers

Don't update UI on every frame:

```ts
let lastUpdate = 0

player.on('tick', ({ currentTimeMs }) => {
  const now = Date.now()
  if (now - lastUpdate < 100) return  // Update max 10x per second

  document.getElementById('time').textContent = 
    (currentTimeMs / 1000).toFixed(2) + 's'

  lastUpdate = now
})
```

### 5. Use requestAnimationFrame

Browser automatically syncs to refresh rate:

```ts
function animate() {
  // Update happens here, browser handles timing
  requestAnimationFrame(animate)
}

animate()
```

---

## Browser Compatibility

### Canvas Support

All modern browsers support Canvas 2D. For older browsers:

```ts
function getCanvasContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D | null {
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    console.error('Canvas 2D not supported')
    return null
  }
  return ctx
}

const ctx = getCanvasContext(canvas)
if (!ctx) {
  // Fallback to alternative rendering
}
```

### Feature Detection

```ts
const hasImageData = ctx.createImageData !== undefined
const hasCanvasFilter = ctx.filter !== undefined
const hasLineDash = ctx.setLineDash !== undefined
```

---

## Memory Management

### Cleanup on Page Leave

```ts
window.addEventListener('beforeunload', () => {
  player.stop()
  // Clean up any assets
  scene.assets?.forEach(asset => {
    if (asset.objectUrl) {
      URL.revokeObjectURL(asset.objectUrl)
    }
  })
})
```

### Long-Running Pages

Unbind event listeners and stop playback:

```ts
function cleanup() {
  player.stop()
  player.onAny(() => {})  // Clear handlers

  // Unload scene
  scene = null
}

// Call when switching pages
router.beforeEach(() => {
  cleanup()
})
```

---

## Debugging Techniques

### Console Logging

```ts
player.onAny((event) => {
  console.log(`[${event.type}]`, event)
})
```

### Performance Monitoring

```ts
let frameCount = 0
let lastSecond = Date.now()

player.on('tick', () => {
  frameCount++

  const now = Date.now()
  if (now - lastSecond >= 1000) {
    console.log(`FPS: ${frameCount}`)
    frameCount = 0
    lastSecond = now
  }
})
```

### Visual Debugging

Add a debug overlay:

```ts
function createDebugOverlay() {
  const overlay = document.createElement('div')
  overlay.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: rgba(0,0,0,0.8);
    color: lime;
    padding: 10px;
    font-family: monospace;
    font-size: 12px;
    z-index: 9999;
  `

  player.on('tick', ({ currentTimeMs }) => {
    const totalMs = player.durationMs
    const pct = ((currentTimeMs / totalMs) * 100).toFixed(1)
    
    overlay.innerHTML = `
      <div>Time: ${(currentTimeMs/1000).toFixed(2)}s</div>
      <div>Progress: ${pct}%</div>
      <div>State: ${player.getStateMachine('main')?.currentStateId}</div>
    `
  })

  document.body.appendChild(overlay)
}

createDebugOverlay()
```

---

## Advanced: Host-Driven Animation Loop

For games or real-time applications, drive animation from your own loop:

```ts
class GameEngine {
  private player: ChronoPlayer
  private scene: ChronoScene
  private adapter: CanvasRenderAdapter

  constructor(canvas: HTMLCanvasElement, scene: ChronoScene) {
    this.scene = scene
    this.adapter = new CanvasRenderAdapter(canvas.getContext('2d')!)
    this.player = new ChronoPlayer(scene, adapter)
  }

  update(deltaMs: number) {
    // Update game logic
    this.updatePhysics(deltaMs)
    this.updateInput(deltaMs)
    this.updateAI(deltaMs)

    // Advance animation to current game time
    this.player.tick(this.gameTime)
  }

  render() {
    // Adapter renders automatically when tick() is called
  }

  private updatePhysics(deltaMs: number) {
    // Your physics code
  }

  private updateInput(deltaMs: number) {
    // Handle input and dispatch events to player
    if (isKeyPressed('Space')) {
      this.player.dispatch('jump')
    }
  }

  private updateAI(deltaMs: number) {
    // AI updates
  }
}
```

---

## Error Handling

Wrap player operations in try-catch:

```ts
try {
  player.dispatch('unknown-event')
} catch (err) {
  console.error('Dispatch failed:', err)
}

player.on('error', (err) => {
  console.error('Runtime error:', err)
  // Show error to user
  alert('Animation error: ' + err.message)
})
```

---

## Next Steps

- Check [FAQ](./05-faq.md) for specific questions
- Explore [examples](../../examples/) for complete code
- Read the main [API Reference](./02-api-reference.md) for detailed docs
