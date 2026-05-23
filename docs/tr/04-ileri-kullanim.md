# İleri Kullanım

Performans, özel rendering ve hata ayıklamayı derinlemesine inceleyin.

## Özel RenderAdapter'lar

Özel rendering için (WebGL, SVG vb.) `RenderAdapter`'ı genişletin.

### RenderAdapter Temel Sınıfı

```ts
abstract class RenderAdapter {
  abstract render(frame: RenderFrame): void
}
```

### Örnek: SVG Adapter (Taslak)

```ts
class SVGRenderAdapter extends RenderAdapter {
  private svg: SVGSVGElement

  constructor(container: HTMLElement, width: number, height: number) {
    super()
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    this.svg.setAttribute('width', String(width))
    this.svg.setAttribute('height', String(height))
    container.appendChild(this.svg)
  }

  render(frame: RenderFrame): void {
    // Önceki içeriği temizle
    this.svg.innerHTML = ''

    // Her katmanı render et
    for (const layer of frame.scene.layers) {
      this.renderLayer(layer, frame)
    }
  }

  private renderLayer(layer: Layer, frame: RenderFrame) {
    // Geçerli zaman için katman özelliklerini hesapla
    const props = this.computeLayerProperties(layer, frame)

    // Katman türüne göre SVG elemanı oluştur
    switch (layer.type) {
      case 'rect':
        this.renderRect(layer, props)
        break
      case 'text':
        this.renderText(layer, props)
        break
      case 'image':
        this.renderImage(layer, props, frame)
        break
    }
  }

  private renderRect(layer: Layer, props: LayerProps) {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('x', String(props.x))
    rect.setAttribute('y', String(props.y))
    rect.setAttribute('width', String(props.width))
    rect.setAttribute('height', String(props.height))
    rect.setAttribute('fill', props.color)
    rect.setAttribute('opacity', String(props.opacity))
    this.svg.appendChild(rect)
  }

  private renderText(layer: Layer, props: LayerProps) {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    text.setAttribute('x', String(props.x))
    text.setAttribute('y', String(props.y))
    text.setAttribute('font-size', String(props.fontSize))
    text.setAttribute('fill', props.color)
    text.textContent = props.text
    this.svg.appendChild(text)
  }

  private renderImage(layer: Layer, props: LayerProps, frame: RenderFrame) {
    const image = document.createElementNS('http://www.w3.org/2000/svg', 'image')
    const asset = frame.assets.get(layer.assetId)
    if (asset) {
      image.setAttribute('href', asset.src)
      image.setAttribute('x', String(props.x))
      image.setAttribute('y', String(props.y))
      image.setAttribute('width', String(props.width))
      image.setAttribute('height', String(props.height))
      this.svg.appendChild(image)
    }
  }

  private computeLayerProperties(layer: Layer, frame: RenderFrame): LayerProps {
    // Katman özelliklerini almak için geçerli zaman'da keyframe'ler değerlendir
    return {
      x: layer.x || 0,
      y: layer.y || 0,
      width: layer.width || 100,
      height: layer.height || 100,
      color: layer.color || '#000',
      opacity: layer.opacity ?? 1,
      fontSize: layer.fontSize || 16,
      text: layer.text || ''
    }
  }
}

// Kullanın
const container = document.getElementById('animation')
const adapter = new SVGRenderAdapter(container, 1024, 768)
const player = new ChronoPlayer(scene, adapter)
```

---

## Manuel Çerçeve Denetimi

Animasyonı adım adım ilerletmek için `tick()` kullanın. Test ve senkronize oynatma için kullanışlıdır.

### Duraklat ve Adım At

```ts
player.pause()

// 16.67ms'lik adımlarla ilerleme (60fps)
setInterval(() => {
  player.tick(player.currentTimeMs + 16.67)
}, 16.67)
```

### Harici Timer ile Senkronize

```ts
let startTime = 0

requestAnimationFrame(function animate(now) {
  if (!startTime) startTime = now
  const elapsed = now - startTime

  player.tick(elapsed)

  requestAnimationFrame(animate)
})
```

### Test Etme

```ts
// Animasyonun belirli bir noktasını test et
player.seek(1500)  // 1.5s'ye atla
player.tick(1500)

// Duruyu kontrol et
console.log(player.currentTimeMs)  // 1500
```

---

## Performans Optimizasyonu

### 1. Canvas Çözünürlüğü

Yüksek DPI ekranlar için cihaz piksel oranında render edin:

```ts
const dpr = window.devicePixelRatio || 1
canvas.width = 1024 * dpr
canvas.height = 768 * dpr
canvas.style.width = '1024px'
canvas.style.height = '768px'

const ctx = canvas.getContext('2d')
ctx.scale(dpr, dpr)
```

### 2. Yalnızca Görünür Katmanlar

Görünmez veya ekran dışı katmanları render etmeyin:

```ts
// Özel adapter'da
private shouldRender(layer: Layer, props: LayerProps): boolean {
  // Katmanın görünür olup olmadığını kontrol et
  if (props.opacity <= 0) return false

  // Ekran dışında mı kontrol et
  if (props.x + props.width < 0) return false
  if (props.y + props.height < 0) return false

  return true
}
```

### 3. Varlık Önbelleği

İlk kullanımda varlıkları çöz ve önbelleğe al:

```ts
class CachedAssetManager {
  private cache = new Map<string, HTMLImageElement>()

  getImage(assetId: string, src: string): HTMLImageElement {
    if (this.cache.has(assetId)) {
      return this.cache.get(assetId)!
    }

    const img = new Image()
    img.src = src
    this.cache.set(assetId, img)
    return img
  }
}
```

### 4. Olay İşleyicilerini Kısıtla

Her çerçevede UI'ı güncellemeyin:

```ts
let lastUpdate = 0

player.on('tick', ({ currentTimeMs }) => {
  const now = Date.now()
  if (now - lastUpdate < 100) return  // Saniyede maksimum 10 güncelleme

  document.getElementById('time').textContent = 
    (currentTimeMs / 1000).toFixed(2) + 's'

  lastUpdate = now
})
```

### 5. requestAnimationFrame Kullanın

Tarayıcı otomatik olarak yenileme oranına senkronize eder:

```ts
function animate() {
  // Güncelleme buraya gelir, tarayıcı zamanlamayı yönetir
  requestAnimationFrame(animate)
}

animate()
```

---

## Tarayıcı Uyumluluğu

### Canvas Desteği

Tüm modern tarayıcılar Canvas 2D'yi destekler. Eski tarayıcılar için:

```ts
function getCanvasContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D | null {
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    console.error('Canvas 2D desteklenmiyor')
    return null
  }
  return ctx
}

const ctx = getCanvasContext(canvas)
if (!ctx) {
  // Alternatif rendering'e geçiş yap
}
```

### Özellik Algılama

```ts
const hasImageData = ctx.createImageData !== undefined
const hasCanvasFilter = ctx.filter !== undefined
const hasLineDash = ctx.setLineDash !== undefined
```

---

## Bellek Yönetimi

### Sayfa Ayrılırken Temizle

```ts
window.addEventListener('beforeunload', () => {
  player.stop()
  // Varlıkları temizle
  scene.assets?.forEach(asset => {
    if (asset.objectUrl) {
      URL.revokeObjectURL(asset.objectUrl)
    }
  })
})
```

### Uzun Çalışan Sayfalar

Olay dinleyicilerini kaldırın ve oynatmayı durdurun:

```ts
function cleanup() {
  player.stop()
  player.onAny(() => {})  // İşleyicileri temizle

  // Sahneyi kaldır
  scene = null
}

// Sayfalar arası geçişte çağırın
router.beforeEach(() => {
  cleanup()
})
```

---

## Hata Ayıklama Teknikleri

### Konsol Günlüğü

```ts
player.onAny((event) => {
  console.log(`[${event.type}]`, event)
})
```

### Performans Izlemesi

```ts
let frameCount = 0
let lastSecond = Date.now()

player.on('tick', () => {
  frameCount++

  const now = Date.now()
  if (now - lastSecond >= 1000) {
    console.log(`FPS: ${frameCount}`)
    frameCount = 0
    lastSecond = now
  }
})
```

### Görsel Hata Ayıklama

Hata ayıklama katmanı ekleyin:

```ts
function createDebugOverlay() {
  const overlay = document.createElement('div')
  overlay.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: rgba(0,0,0,0.8);
    color: lime;
    padding: 10px;
    font-family: monospace;
    font-size: 12px;
    z-index: 9999;
  `

  player.on('tick', ({ currentTimeMs }) => {
    const totalMs = player.durationMs
    const pct = ((currentTimeMs / totalMs) * 100).toFixed(1)
    
    overlay.innerHTML = `
      <div>Zaman: ${(currentTimeMs/1000).toFixed(2)}s</div>
      <div>İlerleme: ${pct}%</div>
      <div>Durum: ${player.getStateMachine('main')?.currentStateId}</div>
    `
  })

  document.body.appendChild(overlay)
}

createDebugOverlay()
```

---

## İleri: Host Tarafından Yönlendirilen Döngü

Oyunlar veya gerçek zamanlı uygulamalar için animasyonu kendi döngünüzden yönetin:

```ts
class GameEngine {
  private player: ChronoPlayer
  private scene: ChronoScene
  private adapter: CanvasRenderAdapter

  constructor(canvas: HTMLCanvasElement, scene: ChronoScene) {
    this.scene = scene
    this.adapter = new CanvasRenderAdapter(canvas.getContext('2d')!)
    this.player = new ChronoPlayer(scene, adapter)
  }

  update(deltaMs: number) {
    // Oyun mantığını güncelle
    this.updatePhysics(deltaMs)
    this.updateInput(deltaMs)
    this.updateAI(deltaMs)

    // Animasyonu geçerli oyun zamanına ilerlet
    this.player.tick(this.gameTime)
  }

  render() {
    // Adapter tick() çağrılırken otomatik render eder
  }

  private updatePhysics(deltaMs: number) {
    // Fizik kodunuz
  }

  private updateInput(deltaMs: number) {
    // İnput işleme ve oynatıcıya olay gönderme
    if (isKeyPressed('Space')) {
      this.player.dispatch('jump')
    }
  }

  private updateAI(deltaMs: number) {
    // AI güncellemeleri
  }
}
```

---

## Hata Yönetimi

Try-catch'e sarın:

```ts
try {
  player.dispatch('unknown-event')
} catch (err) {
  console.error('Gönderme başarısız:', err)
}

player.on('error', (err) => {
  console.error('Runtime hatası:', err)
  // Hatayı kullanıcıya gösterin
  alert('Animasyon hatası: ' + err.message)
})
```

---

## Sonraki Adımlar

- [SSS](./05-sss.md) sık sorulan soruları kontrol edin
- [Örnekler](../../examples/) tam kodları keşfedin
- Ana [API Referansı](./02-api-referansi.md) detaylı doklar
