# React Example

Integration of @chorono/runtime with React 18+ using Hooks.

## Features

✅ Custom React component wrapping ChronoPlayer
✅ useEffect for initialization and cleanup
✅ React state for playback control
✅ Event listeners integrated with React
✅ Parameter binding via React state

## Setup

```bash
npm install
npm run dev
```

Visit http://localhost:5173

## Key Files

- `src/ChronoPlayer.tsx` — Reusable React component
- `src/App.tsx` — Main application
- `package.json` — Dependencies (React, Vite)

## Usage

```tsx
import { ChronoPlayer } from './ChronoPlayer'
import { ChronoPlayer as ChronoPlayerClass } from '@chorono/runtime'

function MyComponent() {
  const handlePlayerReady = (player: ChronoPlayerClass) => {
    // Use player instance
    player.play()
  }

  return (
    <ChronoPlayer
      scene={myScene}
      onReady={handlePlayerReady}
      options={{ loop: true }}
    />
  )
}
```

## Learn More

See the main [documentation](../../docs/en/) for detailed guides.
