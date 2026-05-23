# Vanilla JavaScript Example

A complete example using @chorono/runtime with plain HTML, CSS, and JavaScript — no frameworks.

## Files

- `index.html` — Main HTML structure
- `style.css` — Styling
- `scene.js` — Example animation scene (minimal test scene)
- `main.js` — Application logic

## Running

### Option 1: Via CDN (No build required)
Just open `index.html` in a browser. The CDN script loads automatically.

### Option 2: Local server
```bash
npx http-server .
# Or
python -m http.server 8000
```

Then visit `http://localhost:8000`

## Features Demonstrated

✅ Basic playback controls (play, pause, stop)
✅ Timeline scrubbing (seek)
✅ Parameter binding (userName, score)
✅ Event listening
✅ State machine integration
✅ Event logging

## How It Works

1. **Scene Setup** — `scene.js` defines animation structure
2. **Player Creation** — `main.js` creates ChronoPlayer instance
3. **Controls** — Buttons and inputs trigger player methods
4. **Events** — Player emits events that update UI

## Learn More

See the main [documentation](../../docs/en/) for detailed guides.
