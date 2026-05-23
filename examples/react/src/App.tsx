import { useRef, useState } from 'react'
import { ChronoPlayer as ChronoPlayerClass } from '@chorono/runtime'
import { ChronoPlayer } from './ChronoPlayer'
import './App.css'

// Example scene (same as vanilla JS example)
const scene = {
  id: 'react-demo-scene',
  name: 'React Demo',
  durationMs: 3000,
  width: 800,
  height: 600,
  backgroundColor: '#ffffff',
  parameters: [
    { id: 'p1', name: 'userName', defaultValue: 'Guest' },
    { id: 'p2', name: 'score', defaultValue: 0 }
  ],
  layers: [],
  timelines: [],
  stateMachines: [],
  assets: []
}

function App() {
  const playerRef = useRef<ChronoPlayerClass | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [userName, setUserName] = useState('Guest')
  const [score, setScore] = useState(0)

  const handlePlayerReady = (player: ChronoPlayerClass) => {
    playerRef.current = player
    setDuration(player.durationMs)

    // Update time display
    player.on('tick', ({ currentTimeMs }) => {
      setCurrentTime(currentTimeMs)
    })

    // Update play state
    player.on('play', () => setIsPlaying(true))
    player.on('pause', () => setIsPlaying(false))
    player.on('stop', () => {
      setIsPlaying(false)
      setCurrentTime(0)
    })
  }

  const play = () => playerRef.current?.play()
  const pause = () => playerRef.current?.pause()
  const stop = () => playerRef.current?.stop()

  const seek = (timeMs: number) => {
    playerRef.current?.seek(timeMs)
    setCurrentTime(timeMs)
  }

  const updateUserName = (value: string) => {
    setUserName(value)
    playerRef.current?.setParam('userName', value)
  }

  const updateScore = (value: number) => {
    setScore(value)
    playerRef.current?.setParam('score', value)
  }

  return (
    <div className="app">
      <div className="container">
        <h1>Chorono Runtime</h1>
        <p>React Example</p>

        <div className="player-wrapper">
          <ChronoPlayer
            scene={scene}
            onReady={handlePlayerReady}
            width={800}
            height={600}
            options={{ loop: false }}
          />
        </div>

        <div className="controls">
          <button onClick={play} className="btn btn-primary" disabled={isPlaying}>
            Play
          </button>
          <button onClick={pause} className="btn" disabled={!isPlaying}>
            Pause
          </button>
          <button onClick={stop} className="btn">
            Stop
          </button>
          <span className="spacer"></span>
          <span className="time">
            {(currentTime / 1000).toFixed(2)}s / {(duration / 1000).toFixed(2)}s
          </span>
        </div>

        <div className="slider-container">
          <label htmlFor="timeline">Timeline:</label>
          <input
            id="timeline"
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={(e) => seek(parseFloat(e.target.value))}
          />
        </div>

        <div className="params">
          <h3>Parameters</h3>
          <div className="param-input">
            <label htmlFor="userName">User Name:</label>
            <input
              id="userName"
              type="text"
              value={userName}
              onChange={(e) => updateUserName(e.target.value)}
            />
          </div>
          <div className="param-input">
            <label htmlFor="score">Score:</label>
            <input
              id="score"
              type="number"
              value={score}
              onChange={(e) => updateScore(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
