<template>
  <canvas
    ref="canvas"
    :width="width"
    :height="height"
    :style="{ border: '1px solid #ddd', borderRadius: '8px', display: 'block', maxWidth: '100%' }"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ChronoPlayer as ChronoPlayerClass, CanvasRenderAdapter } from '@chorono/runtime'
import type { ChronoScene, ChronoPlayerOptions } from '@chorono/runtime'

interface Props {
  scene: ChronoScene
  options?: ChronoPlayerOptions
  width?: number
  height?: number
}

interface Emits {
  ready: [player: ChronoPlayerClass]
}

const props = withDefaults(defineProps<Props>(), {
  width: 800,
  height: 600
})

const emit = defineEmits<Emits>()

const canvas = ref<HTMLCanvasElement | null>(null)
let player: ChronoPlayerClass | null = null

onMounted(() => {
  if (!canvas.value) return

  const ctx = canvas.value.getContext('2d')
  if (!ctx) {
    console.error('Failed to get canvas context')
    return
  }

  // Create adapter and player
  const adapter = new CanvasRenderAdapter(ctx)
  player = new ChronoPlayerClass(props.scene, adapter, props.options)

  emit('ready', player)
})

defineExpose({
  getPlayer: () => player
})
</script>
