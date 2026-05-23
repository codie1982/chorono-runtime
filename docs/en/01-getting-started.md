# Getting Started with @chorono/runtime

Learn how to install, set up, and run your first animation.

## Installation

### Via NPM (Recommended for bundled apps)

```bash
npm install @chorono/runtime
```

Then import in your JavaScript:

```ts
import { ChronoPlayer, CanvasRenderAdapter } from '@chorono/runtime'
```

### Via CDN (For standalone HTML)

Add this to your HTML `<head>`:

```html
<script src="https://unpkg.com/@chorono/runtime@0.1.0/dist/chorono-runtime.global.js"></script>
```

Then use the global `Chorono` object:

```html
<script>
  const player = new Chorono.ChronoPlayer(scene, adapter)
</script>
```

---

## Basic Setup

### Step 1: Get a Canvas Element

```html
<canvas id="animation" width="1024" height="768"></canvas>
```

### Step 2: Get Your Scene

Export a scene from the Chorono editor (it's a JSON file). Save it or load it from your server:

```ts
const scene = {
  id: 'scene-123',
  name: 'My Animation',
  durationMs: 3000,
  width: 1024,
  height: 768,
  // ... more properties
}
```

### Step 3: Create a Player

```ts
import { ChronoPlayer, CanvasRenderAdapter } from '@chorono/runtime'

// Get the canvas and 2D context
const canvas = document.getElementById('animation')
const ctx = canvas.getContext('2d')

// Create an adapter (tells the player how to render)
const adapter = new CanvasRenderAdapter(ctx)

// Create the player
const player = new ChronoPlayer(scene, adapter, {
  loop: true,
  speed: 1.0
})
```

### Step 4: Play!

```ts
player.play()
```

---

## Complete Example

**HTML:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Chorono Animation</title>
  <style>
    body {
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: #1a1a1a;
    }
    canvas {
      border: 1px solid #333;
    }
  </style>
</head>
<body>
  <canvas id="player" width="1024" height="768"></canvas>

  <script src="https://unpkg.com/@chorono/runtime@0.1.0/dist/chorono-runtime.global.js"></script>
  <script src="./scene.js"></script>
  <script src="./app.js"></script>
</body>
</html>
```

**JavaScript (app.js):**
```js
const canvas = document.getElementById('player')
const ctx = canvas.getContext('2d')

// Create player
const adapter = new Chorono.CanvasRenderAdapter(ctx)
const player = new Chorono.ChronoPlayer(scene, adapter, {
  loop: true
})

// Listen for events
player.on('stateChange', (evt) => {
  console.log(`State changed: ${evt.oldStateId} → ${evt.newStateId}`)
})

player.on('animationComplete', () => {
  console.log('Animation finished!')
})

// Start playing
player.play()
```

---

## With a Bundler (ES Modules)

**package.json:**
```json
{
  "type": "module",
  "dependencies": {
    "@chorono/runtime": "^0.1.0"
  }
}
```

**main.js:**
```ts
import { ChronoPlayer, CanvasRenderAdapter } from '@chorono/runtime'
import scene from './scenes/my-animation.json'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const adapter = new CanvasRenderAdapter(ctx)
const player = new ChronoPlayer(scene, adapter, { loop: true })

player.play()
```

---

## Loading Scenes Dynamically

### From a JSON file (fetch)

```ts
async function loadAndPlay() {
  const response = await fetch('./scenes/animation.json')
  const scene = await response.json()

  const player = new ChronoPlayer(scene, adapter)
  player.play()
}

loadAndPlay()
```

### From Chorono Editor export

When you export from the editor, you get a `.json` file containing the entire scene. Just load it as shown above.

---

## Common Patterns

### Play/Pause Controls

```ts
const playBtn = document.getElementById('play')
const pauseBtn = document.getElementById('pause')

playBtn.addEventListener('click', () => player.play())
pauseBtn.addEventListener('click', () => player.pause())
```

### Timeline Slider

```ts
const slider = document.getElementById('timeline')

slider.addEventListener('input', (e) => {
  const timeMs = parseFloat(e.target.value)
  player.seek(timeMs)
})

// Update slider as animation plays
player.on('tick', (evt) => {
  slider.value = evt.currentTimeMs
})
```

### Parameter Binding

```ts
// Update scene parameter at runtime
const userInput = document.getElementById('userName')

userInput.addEventListener('input', (e) => {
  player.setParam('userName', e.target.value)
})
```

### Responding to State Changes

```ts
player.on('stateChange', ({ smId, newStateId }) => {
  console.log(`Machine ${smId} entered state: ${newStateId}`)
  
  // Update UI based on state
  document.getElementById('status').textContent = newStateId
})
```

---

## Next Steps

- Read the full [API Reference](./02-api-reference.md)
- Learn about [State Machines](./03-state-machines.md)
- Check out the [examples](../../examples/) folder
- See [Advanced Usage](./04-advanced.md) for optimization tips

---

## Troubleshooting

**Canvas not rendering?**
- Make sure the canvas context is created with `getContext('2d')`
- Check that the scene has layers and timelines

**Animation doesn't play?**
- Call `player.play()` to start it
- Check console for error messages

**Missing CDN script?**
- Make sure you've included the script before your own code
- Check the console for 404 errors

For more help, see [FAQ & Troubleshooting](./05-faq.md).
