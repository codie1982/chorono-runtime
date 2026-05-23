# @chorono/runtime Documentation

Welcome to the complete documentation for `@chorono/runtime` — a framework-free, zero-dependency animation runtime for the web.

## Quick Links

- 🚀 [Getting Started](./01-getting-started.md) — Installation and first steps
- 📚 [API Reference](./02-api-reference.md) — Complete API documentation
- 🎭 [State Machines](./03-state-machines.md) — Interactive state management
- ⚙️ [Advanced Usage](./04-advanced.md) — Custom rendering, performance
- ❓ [FAQ & Troubleshooting](./05-faq.md) — Common questions and solutions

## Documentation Structure

### 1. [Getting Started](./01-getting-started.md)
Start here! Learn how to install, set up your first animation, and understand the basics.

- Installation options (npm, CDN)
- Basic setup with Canvas
- First working example
- Common patterns

### 2. [API Reference](./02-api-reference.md)
Complete reference for all classes, methods, and events.

- **ChronoPlayer** — Main animation player class
- **CanvasRenderAdapter** — 2D canvas rendering
- **EventBridge** — Event system
- **Configuration** — Options and settings
- **Type Definitions** — TypeScript interfaces

### 3. [State Machines](./03-state-machines.md)
Learn how to build interactive animations with state machines.

- State machine concepts
- Defining states and transitions
- Triggering events and transitions
- Guard conditions (parameter-based triggers)
- Cross-fades between states
- Real-world examples

### 4. [Advanced Usage](./04-advanced.md)
Dive deeper for advanced use cases and optimization.

- Implementing custom RenderAdapters
- Manual frame control with `tick()`
- Performance optimization techniques
- Browser compatibility and quirks
- Memory management and cleanup
- Debugging strategies

### 5. [FAQ & Troubleshooting](./05-faq.md)
Answers to common questions and solutions to problems.

- Asset loading and management
- Framework integration
- Mobile and browser support
- Error handling
- Scene format questions
- Performance troubleshooting

---

## Key Concepts

### Zero Dependencies
`@chorono/runtime` has **no external dependencies**. It works standalone on any modern browser without requiring Node modules or build tools.

### Framework Agnostic
Use it with **vanilla JavaScript**, React, Vue, Svelte, or any other framework. It's just a JavaScript class.

### Cross-Platform Consistency
The same engine powers web, Android, and the Chorono editor itself — guaranteeing identical playback everywhere.

### Scene Format
Scenes are JSON objects exported from the Chorono editor, containing:
- Timelines (keyframe sequences)
- Layers (visual elements)
- State machines (interactive logic)
- Assets (images, videos, fonts)
- Parameters (dynamic data bindings)

---

## What is @chorono/runtime?

It's a **player** for animations created in the Chorono editor. Think of it like:
- **Video player** for keyframe animations
- **Game engine** for interactive scenes
- **Animation library** with state machines and events

You export a scene from the editor (a JSON file), then use this runtime to play it on the web.

---

## Next Steps

1. **New to Chorono?** → Start with [Getting Started](./01-getting-started.md)
2. **Need API help?** → Check [API Reference](./02-api-reference.md)
3. **Building interactive content?** → Read [State Machines](./03-state-machines.md)
4. **Stuck on something?** → Look at [FAQ & Troubleshooting](./05-faq.md)

---

## Resources

- 📦 [NPM Package](https://npmjs.com/package/@chorono/runtime)
- 🔗 [GitHub Repository](https://github.com/your-org/chorono-runtime)
- 💬 [Discord Community](https://discord.gg/your-server) (coming soon)
- 🐛 [Report Issues](https://github.com/your-org/chorono-runtime/issues)

---

## Examples

See the [`/examples`](../../examples/) folder for:
- Vanilla JavaScript
- React with Hooks
- Vue 3 Composition API
- Interactive controls
- State machine demos
- Asset handling

---

## Support

- **Questions?** Check [FAQ](./05-faq.md) first
- **Found a bug?** [Open an issue](https://github.com/your-org/chorono-runtime/issues)
- **Want to contribute?** See our contributing guidelines

---

**Happy animating! 🎨**
