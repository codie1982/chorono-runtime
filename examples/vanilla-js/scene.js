// Example scene (minimal structure for testing)
const scene = {
  id: 'demo-scene-001',
  name: 'Vanilla JS Demo',
  durationMs: 3000,
  width: 800,
  height: 600,
  backgroundColor: '#ffffff',

  parameters: [
    {
      id: 'param-1',
      name: 'userName',
      defaultValue: 'Guest'
    },
    {
      id: 'param-2',
      name: 'score',
      defaultValue: 0
    }
  ],

  layers: [
    {
      id: 'layer-bg',
      name: 'Background',
      type: 'rect',
      x: 0,
      y: 0,
      width: 800,
      height: 600,
      fill: '#667eea',
      opacity: 1
    },
    {
      id: 'layer-title',
      name: 'Title',
      type: 'text',
      x: 400,
      y: 100,
      text: 'Chorono Runtime',
      fontSize: 48,
      fill: '#ffffff',
      textAlign: 'center',
      opacity: 1
    },
    {
      id: 'layer-box',
      name: 'Content Box',
      type: 'rect',
      x: 100,
      y: 200,
      width: 600,
      height: 300,
      fill: '#ffffff',
      opacity: 1,
      borderRadius: 8
    },
    {
      id: 'layer-message',
      name: 'Message',
      type: 'text',
      x: 400,
      y: 300,
      text: 'Animation Playback',
      fontSize: 32,
      fill: '#667eea',
      textAlign: 'center',
      opacity: 1
    },
    {
      id: 'layer-time',
      name: 'Time Display',
      type: 'text',
      x: 400,
      y: 400,
      text: 'Playing...',
      fontSize: 16,
      fill: '#666666',
      textAlign: 'center',
      opacity: 1
    }
  ],

  timelines: [
    {
      id: 'timeline-main',
      name: 'Main Timeline',
      startMs: 0,
      endMs: 3000,
      layers: [
        {
          layerId: 'layer-bg',
          keyframes: [
            {
              timeMs: 0,
              values: { opacity: 1, fill: '#667eea' }
            },
            {
              timeMs: 1500,
              values: { opacity: 1, fill: '#764ba2' }
            },
            {
              timeMs: 3000,
              values: { opacity: 1, fill: '#667eea' }
            }
          ]
        },
        {
          layerId: 'layer-title',
          keyframes: [
            {
              timeMs: 0,
              values: { opacity: 0, fontSize: 48 }
            },
            {
              timeMs: 500,
              values: { opacity: 1, fontSize: 48 }
            },
            {
              timeMs: 2500,
              values: { opacity: 1, fontSize: 48 }
            },
            {
              timeMs: 3000,
              values: { opacity: 0, fontSize: 48 }
            }
          ]
        },
        {
          layerId: 'layer-box',
          keyframes: [
            {
              timeMs: 0,
              values: { opacity: 0, x: 100, y: 200 }
            },
            {
              timeMs: 800,
              values: { opacity: 1, x: 100, y: 200 }
            },
            {
              timeMs: 2200,
              values: { opacity: 1, x: 100, y: 200 }
            },
            {
              timeMs: 3000,
              values: { opacity: 0, x: 100, y: 200 }
            }
          ]
        },
        {
          layerId: 'layer-message',
          keyframes: [
            {
              timeMs: 0,
              values: { opacity: 0, fontSize: 32 }
            },
            {
              timeMs: 1000,
              values: { opacity: 1, fontSize: 32 }
            },
            {
              timeMs: 2000,
              values: { opacity: 1, fontSize: 32 }
            },
            {
              timeMs: 3000,
              values: { opacity: 0, fontSize: 32 }
            }
          ]
        },
        {
          layerId: 'layer-time',
          keyframes: [
            {
              timeMs: 0,
              values: { opacity: 0, fontSize: 16 }
            },
            {
              timeMs: 1500,
              values: { opacity: 1, fontSize: 16 }
            },
            {
              timeMs: 2500,
              values: { opacity: 1, fontSize: 16 }
            },
            {
              timeMs: 3000,
              values: { opacity: 0, fontSize: 16 }
            }
          ]
        }
      ]
    }
  ],

  stateMachines: [
    {
      id: 'main-machine',
      label: 'Main State Machine',
      initialState: 'playing',
      states: [
        {
          id: 'playing',
          label: 'Playing',
          timeline: 'timeline-main'
        },
        {
          id: 'paused',
          label: 'Paused',
          timeline: 'timeline-main'
        }
      ],
      transitions: [
        {
          from: 'playing',
          to: 'paused',
          trigger: 'pause',
          duration: 0
        },
        {
          from: 'paused',
          to: 'playing',
          trigger: 'play',
          duration: 0
        }
      ]
    }
  ],

  assets: []
}
