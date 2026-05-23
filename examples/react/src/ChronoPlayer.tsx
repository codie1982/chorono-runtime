import { useEffect, useRef } from 'react'
import { ChronoPlayer as ChronoPlayerClass, CanvasRenderAdapter } from '@chorono/runtime'
import type { ChronoScene, ChronoPlayerOptions } from '@chorono/runtime'

interface ChronoPlayerProps {
  scene: ChronoScene
  options?: ChronoPlayerOptions
  onReady?: (player: ChronoPlayerClass) => void
  width?: number
  height?: number
}

export function ChronoPlayer({
  scene,
  options,
  onReady,
  width = 800,
  height = 600
}: ChronoPlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const playerRef = useRef<ChronoPlayerClass | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) {
      console.error('Failed to get canvas context')
      return
    }

    // Create adapter and player
    const adapter = new CanvasRenderAdapter(ctx)
    const player = new ChronoPlayerClass(scene, adapter, options)

    playerRef.current = player
    onReady?.(player)

    // Cleanup on unmount
    return () => {
      player.stop()
    }
  }, [scene, options, onReady])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        display: 'block',
        maxWidth: '100%',
        height: 'auto'
      }}
    />
  )
}
