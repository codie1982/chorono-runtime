# State Machines Guide

Learn how to build interactive animations using state machines.

## What is a State Machine?

A state machine is a system that can be in one of several discrete states at any given time. Transitions between states are triggered by events.

**Example:** A button animation with states:
- `idle` — Button at rest
- `hover` — Mouse over button
- `pressed` — Button clicked
- `loading` — Processing action

---

## Basic Concepts

### States

A state represents a visual or logical condition. Each state can have:
- A linked timeline (animation to play when in that state)
- Entry actions (run when entering)
- Exit actions (run when leaving)

### Transitions

A transition moves from one state to another, triggered by an event.

```
idle --[click]--> pressed
pressed --[release]--> idle
```

### Events

Events are messages dispatched to the state machine to trigger transitions. Examples:
- `click`
- `hover`
- `release`
- `submit`

### Timelines

When you enter a state, its associated timeline plays. Timelines contain keyframe animations.

---

## Creating State Machines in the Editor

In Chorono editor:

1. Create states for each visual variant (idle, hover, pressed, etc.)
2. Assign a timeline to each state
3. Define transitions between states
4. Assign event triggers to transitions

This exports as JSON that the runtime understands.

---

## Dispatching Events

To trigger a transition, dispatch an event:

```ts
// Global event (all machines hear it)
player.dispatch('click')

// Event to a specific machine
player.dispatch('click', 'button-machine-id')
```

When an event is dispatched:
1. The state machine checks transitions from the current state
2. If a matching transition exists, it fires
3. The animation smoothly transitions to the new state

---

## Example: Button Animation

### Scene Definition

A scene with a button machine might have:

```json
{
  "stateMachines": [
    {
      "id": "button",
      "label": "Button",
      "initialState": "idle",
      "states": [
        {
          "id": "idle",
          "label": "Idle",
          "timeline": "timeline-idle"
        },
        {
          "id": "hover",
          "label": "Hover",
          "timeline": "timeline-hover"
        },
        {
          "id": "pressed",
          "label": "Pressed",
          "timeline": "timeline-pressed"
        }
      ],
      "transitions": [
        {
          "from": "idle",
          "to": "hover",
          "trigger": "mouseEnter",
          "duration": 200
        },
        {
          "from": "hover",
          "to": "idle",
          "trigger": "mouseLeave",
          "duration": 200
        },
        {
          "from": "hover",
          "to": "pressed",
          "trigger": "click",
          "duration": 100
        },
        {
          "from": "pressed",
          "to": "idle",
          "trigger": "release",
          "duration": 300
        }
      ]
    }
  ]
}
```

### Using it in Code

```ts
const player = new ChronoPlayer(scene, adapter)

// When user hovers
canvas.addEventListener('mouseenter', () => {
  player.dispatch('mouseEnter')
})

canvas.addEventListener('mouseleave', () => {
  player.dispatch('mouseLeave')
})

// When user clicks
canvas.addEventListener('click', () => {
  player.dispatch('click')
})

// Simulate release after click
setTimeout(() => {
  player.dispatch('release')
}, 200)

player.play()
```

---

## Guard Conditions

Guards are conditions based on parameters. A transition only fires if its guard is true.

### Example: Score Threshold

```json
{
  "transitions": [
    {
      "from": "playing",
      "to": "victory",
      "trigger": "levelComplete",
      "guard": "score >= 1000",  // Only if score is 1000+
      "duration": 500
    },
    {
      "from": "playing",
      "to": "defeat",
      "trigger": "levelComplete",
      "guard": "score < 1000",   // Otherwise
      "duration": 300
    }
  ]
}
```

### In Code

```ts
// Set parameter
player.setParam('score', 1250)

// Dispatch event - transition depends on guard
player.dispatch('levelComplete')
// → Automatically chooses 'victory' because score >= 1000
```

### Guard Syntax

Guards are simple expressions:
- `score >= 1000`
- `isActive == true`
- `health > 0`
- `name != ""`

Supported operators: `==`, `!=`, `>`, `<`, `>=`, `<=`

---

## Multiple State Machines

A scene can have multiple independent state machines. Each handles its own state.

### Example: Button + Loading Spinner

```json
{
  "stateMachines": [
    {
      "id": "button",
      "states": [ /* ... */ ]
    },
    {
      "id": "spinner",
      "states": [ /* ... */ ]
    }
  ]
}
```

### Controlling them separately

```ts
// Trigger button machine
player.dispatch('click', 'button')

// Trigger spinner machine
player.dispatch('spin', 'spinner')

// Or dispatch to all machines
player.dispatch('reset')
```

---

## Cross-Fades Between States

Transitions can have a duration for smooth cross-fading:

```json
{
  "from": "idle",
  "to": "hover",
  "trigger": "mouseEnter",
  "duration": 200  // 200ms fade
}
```

During the 200ms:
1. The "idle" timeline finishes its current keyframe
2. The "hover" timeline starts playing
3. Both are blended together (alpha fading)
4. After 200ms, only "hover" plays

---

## State Change Events

Listen for state machine transitions:

```ts
player.on('stateChange', ({ smId, oldStateId, newStateId }) => {
  console.log(`${smId}: ${oldStateId} → ${newStateId}`)
})
```

### Example: Updating UI

```ts
player.on('stateChange', ({ smId, newStateId }) => {
  if (smId === 'button') {
    document.getElementById('status').textContent = newStateId
  }
})
```

---

## Advanced: Parameter-Based Transitions

Use guard conditions to create complex state logic based on data.

### Example: Game States

```json
{
  "states": [
    { "id": "idle", "timeline": "t-idle" },
    { "id": "playing", "timeline": "t-playing" },
    { "id": "paused", "timeline": "t-paused" },
    { "id": "gameOver", "timeline": "t-gameover" }
  ],
  "transitions": [
    {
      "from": "idle",
      "to": "playing",
      "trigger": "start",
      "guard": "difficulty != 'impossible'"
    },
    {
      "from": "playing",
      "to": "paused",
      "trigger": "pause"
    },
    {
      "from": "paused",
      "to": "playing",
      "trigger": "resume"
    },
    {
      "from": "playing",
      "to": "gameOver",
      "trigger": "die",
      "guard": "lives <= 0"
    }
  ]
}
```

### Using it

```ts
player.setParam('difficulty', 'hard')
player.dispatch('start')  // Transition fires (guard is true)

player.setParam('difficulty', 'impossible')
player.dispatch('start')  // Transition doesn't fire (guard is false)
```

---

## Best Practices

### 1. Keep State Machines Simple

Each machine should handle one logical concern:
- ✅ Button states (idle, hover, pressed)
- ✅ Modal states (hidden, open, closing)
- ❌ Mixing button + modal in one machine

### 2. Use Meaningful Names

```ts
// ✅ Good
player.dispatch('buttonClicked')
player.dispatch('modelLoaded')
player.dispatch('userHovered')

// ❌ Vague
player.dispatch('event1')
player.dispatch('trigger')
```

### 3. Set Parameters Before Events

If a transition depends on a guard:

```ts
// ✅ Correct order
player.setParam('lives', 0)  // Set parameter first
player.dispatch('die')       // Then dispatch event

// ❌ Wrong order
player.dispatch('die')       // Event fires, but guard doesn't see updated value
player.setParam('lives', 0)
```

### 4. Handle Async Operations

For async tasks (API calls), use parameters + timeouts:

```ts
async function loadData() {
  player.dispatch('loadStart')
  
  try {
    const data = await fetch('/api/data')
    player.setParam('data', data)
    player.dispatch('loadSuccess')
  } catch (err) {
    player.dispatch('loadError')
  }
}
```

### 5. Map UI Events to Dispatches

```ts
// Input field → Parameter
document.getElementById('name').addEventListener('change', (e) => {
  player.setParam('name', e.target.value)
})

// Button click → Dispatch event
document.getElementById('submit').addEventListener('click', () => {
  player.dispatch('submit')
})

// Hover → Global event
document.addEventListener('mousemove', () => {
  player.dispatch('mousemove')
})
```

---

## Debugging State Machines

### Inspect Current State

```ts
const sm = player.getStateMachine('button')
if (sm) {
  console.log('Current state:', sm.currentStateId)
}
```

### Log All State Changes

```ts
player.on('stateChange', (evt) => {
  console.log(`[${new Date().toISOString()}] ${evt.smId}:`, evt)
})
```

### Check Guard Evaluation

Guards are evaluated when you dispatch an event. If nothing happens, the guard might be blocking it:

```ts
// Before dispatch, check parameter
console.log('Score:', player.currentTimeMs)  // Or use getParam() if available

// Then dispatch
player.dispatch('levelComplete')
```

---

## Performance Considerations

- State machines are **very efficient** — they use minimal CPU
- Each frame, guards are checked and transitions evaluated
- Timelines run during transitions (cross-fades)
- No external libraries needed

---

## Examples in the /examples Folder

See `/examples/state-machines/` for a complete working example with:
- Multi-state animation
- Event dispatching
- Guard conditions
- UI showing current state

---

## Next Steps

- See [Advanced Usage](./04-advanced.md) for custom rendering
- Check [FAQ](./05-faq.md) for common questions
- Explore the [examples](../../examples/)
