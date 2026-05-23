// Get elements
const canvas = document.getElementById('player')
const playBtn = document.getElementById('playBtn')
const pauseBtn = document.getElementById('pauseBtn')
const stopBtn = document.getElementById('stopBtn')
const timelineSlider = document.getElementById('timeline')
const timeDisplay = document.getElementById('time')
const userNameInput = document.getElementById('userName')
const scoreInput = document.getElementById('score')
const eventsLog = document.getElementById('events')
const clearEventsBtn = document.getElementById('clearEvents')

// Get canvas context
const ctx = canvas.getContext('2d')
if (!ctx) {
  alert('Canvas 2D not supported')
}

// Create player
const Chorono = window.Chorono
const adapter = new Chorono.CanvasRenderAdapter(ctx)
const player = new Chorono.ChronoPlayer(scene, adapter, {
  loop: false,
  speed: 1.0,
  autoPlay: false
})

// ============================================================================
// PLAYBACK CONTROLS
// ============================================================================

playBtn.addEventListener('click', () => {
  player.play()
  logEvent('Player started')
})

pauseBtn.addEventListener('click', () => {
  player.pause()
  logEvent('Player paused')
})

stopBtn.addEventListener('click', () => {
  player.stop()
  logEvent('Player stopped')
})

// ============================================================================
// TIMELINE SLIDER
// ============================================================================

// Seek when slider changes
timelineSlider.addEventListener('input', (e) => {
  const timeMs = parseFloat(e.target.value)
  player.seek(timeMs)
  logEvent(`Seeked to ${(timeMs / 1000).toFixed(2)}s`)
})

// Update slider as animation plays
player.on('tick', ({ currentTimeMs }) => {
  timelineSlider.value = currentTimeMs

  const seconds = (currentTimeMs / 1000).toFixed(2)
  const totalSeconds = (player.durationMs / 1000).toFixed(2)
  timeDisplay.textContent = `${seconds}s / ${totalSeconds}s`
})

// ============================================================================
// PARAMETERS
// ============================================================================

userNameInput.addEventListener('change', (e) => {
  const value = e.target.value || 'Guest'
  player.setParam('userName', value)
  logEvent(`Parameter "userName" = "${value}"`)
})

scoreInput.addEventListener('change', (e) => {
  const value = parseInt(e.target.value) || 0
  player.setParam('score', value)
  logEvent(`Parameter "score" = ${value}`)
})

// ============================================================================
// EVENT LOGGING
// ============================================================================

function logEvent(message) {
  const item = document.createElement('div')
  item.className = 'event-item'

  const timestamp = new Date().toLocaleTimeString()
  item.innerHTML = `<span class="event-time">[${timestamp}]</span> <span class="event-data">${message}</span>`

  eventsLog.insertBefore(item, eventsLog.firstChild)

  // Keep only last 20 events
  while (eventsLog.children.length > 20) {
    eventsLog.removeChild(eventsLog.lastChild)
  }
}

// ============================================================================
// PLAYER EVENTS
// ============================================================================

player.on('play', () => {
  logEvent('<span class="event-type">PLAY</span>')
  playBtn.style.opacity = '0.5'
  pauseBtn.style.opacity = '1'
})

player.on('pause', () => {
  logEvent('<span class="event-type">PAUSE</span>')
  playBtn.style.opacity = '1'
  pauseBtn.style.opacity = '0.5'
})

player.on('stop', () => {
  logEvent('<span class="event-type">STOP</span>')
  playBtn.style.opacity = '1'
  pauseBtn.style.opacity = '0.5'
})

player.on('stateChange', ({ smId, oldStateId, newStateId }) => {
  logEvent(`<span class="event-type">STATE_CHANGE</span> <span class="event-data">${smId}: ${oldStateId} → ${newStateId}</span>`)
})

player.on('animationComplete', () => {
  logEvent('<span class="event-type">ANIMATION_COMPLETE</span>')
})

player.on('timelineStart', ({ timelineId, timeMs }) => {
  logEvent(`<span class="event-type">TIMELINE_START</span> <span class="event-data">${timelineId} @ ${timeMs}ms</span>`)
})

player.on('timelineEnd', ({ timelineId, timeMs }) => {
  logEvent(`<span class="event-type">TIMELINE_END</span> <span class="event-data">${timelineId} @ ${timeMs}ms</span>`)
})

player.on('paramChange', ({ name, newValue }) => {
  logEvent(`<span class="event-type">PARAM_CHANGE</span> <span class="event-data">${name} = ${newValue}</span>`)
})

// ============================================================================
// CLEAR EVENTS
// ============================================================================

clearEventsBtn.addEventListener('click', () => {
  eventsLog.innerHTML = ''
})

// ============================================================================
// INITIALIZATION
// ============================================================================

logEvent('<span class="event-type">READY</span> <span class="event-data">Player initialized</span>')

// Example: Set initial parameters
player.setParam('userName', userNameInput.value)
player.setParam('score', parseInt(scoreInput.value))

// Auto-play on load (optional)
// player.play()
