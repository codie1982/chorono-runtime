# Asset & Media Handling Example

Demonstrates asset types and storage modes.

## Supported Asset Types

- **Image** — PNG, JPG, WebP, GIF
- **Video** — MP4, WebM, OGG
- **Audio** — MP3, WAV, OGG
- **Font** — TTF, OTF, WOFF, WOFF2
- **SVG** — Scalable vectors
- **Lottie** — Lottie animations
- **Sprite Sheets** — Grid-based frame animations

## Storage Modes

- **Embedded** — Base64 in JSON (good for small assets)
- **External** — HTTP URL to CDN or server (good for large files)
- **Project-relative** — Part of exported scene package
- **Remote** — Loaded from remote URL at runtime

## Running

Just open `index.html` in a browser (no build required).

## Best Practices

1. **Preload assets** before playback for smooth animation
2. **Use external URLs** for large files (videos, high-res images)
3. **Embed small assets** to reduce HTTP requests
4. **Optimize formats** (WebP for modern browsers)
5. **Handle errors** with fallback content

## Learn More

See the main [documentation](../../docs/en/) for asset handling details.
