# Vue 3 Example

Integration of @chorono/runtime with Vue 3 using Composition API.

## Features

✅ Reusable Vue component wrapping ChronoPlayer
✅ onMounted hook for initialization
✅ Reactive state for playback control
✅ Event listeners with Vue reactivity
✅ Parameter binding via v-model

## Setup

```bash
npm install
npm run dev
```

Visit http://localhost:5173

## Key Files

- `src/ChronoPlayer.vue` — Reusable Vue component
- `src/App.vue` — Main application
- `package.json` — Dependencies (Vue, Vite)

## Usage

```vue
<template>
  <ChronoPlayer
    :scene="myScene"
    @ready="handlePlayerReady"
    :options="{ loop: true }"
  />
</template>

<script setup>
import { ref } from 'vue'
import ChronoPlayer from './ChronoPlayer.vue'

const handlePlayerReady = (player) => {
  player.play()
}
</script>
```

## Learn More

See the main [documentation](../../docs/en/) for detailed guides.
