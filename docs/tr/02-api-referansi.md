# API Referansı

Tüm sınıflar, metodlar ve türler için kapsamlı dokümantasyon.

## ChronoPlayer

Chorono sahnelerini oynatmak için ana sınıf.

### Constructor

```ts
new ChronoPlayer(
  scene: ChronoScene,
  adapter: RenderAdapter,
  options?: ChronoPlayerOptions
)
```

**Parametreler:**
- `scene` — Animasyon sahnesi (editörden dışa aktarılan JSON)
- `adapter` — RenderAdapter uygulaması (ör. CanvasRenderAdapter)
- `options` — Opsiyonel yapılandırma

---

### Oynatma Metodları

#### `play()`
Geçerli konumdan oynatmayı başlatın veya devam ettirin.

```ts
player.play()
```

#### `pause()`
Oynatmayı duraklatın. Geçerli konum korunur.

```ts
player.pause()
```

#### `stop()`
Oynatmayı durdurun ve 0'a sıfırlayın.

```ts
player.stop()
```

#### `seek(timeMs: number)`
Belirli bir zaman noktasına atlayın (milisaniye cinsinden).

```ts
player.seek(500)  // 500ms'ye atla
```

---

### Çerçeve Kontrolü

#### `tick(timeMs: number)`
Belirli bir zaman noktasına adımla (özel döngüler veya testler için).

```ts
// Animasyonda manuel adım at
player.pause()
player.tick(0)
player.tick(16.67)  // ~60fps
player.tick(33.34)
```

---

### Parametreler

#### `setParam(name: string, value: RuntimeValue)`
Runtime'da sahne parametresini güncelle.

```ts
player.setParam('userName', 'Alice')
player.setParam('score', 1250)
player.setParam('isActive', true)
```

Parametreler editörde referans edilebilir ve durum makinesi koruma koşullarında kullanılabilir.

**Desteklenen türler:** `string | number | boolean`

---

### Durum Makineleri

#### `dispatch(event: string, smId?: string): void`
Durum makinesi olayı tetikle.

**Genel olay (tüm makineler):**
```ts
player.dispatch('hover')
player.dispatch('click')
```

**Belirli makine:**
```ts
player.dispatch('press', 'button-machine-id')
```

#### `getStateMachine(smId: string): StateMachineRuntime | undefined`
Bir durum makinesini ID ile alın (inceleme için).

```ts
const machine = player.getStateMachine('my-machine')
console.log(machine?.currentStateId)
```

---

### Olaylar

#### `on(type: string, callback: (event: any) => void): void`
Belirli bir olay türüne abone olun.

```ts
player.on('play', () => {
  console.log('Oynatma başladı')
})

player.on('stateChange', (evt) => {
  console.log(`Durum: ${evt.oldStateId} → ${evt.newStateId}`)
})
```

#### `onAny(callback: (event: any) => void): void`
Tüm olaylara abone olun.

```ts
player.onAny((event) => {
  console.log('Olay:', event)
})
```

---

### Özellikler

#### `currentTimeMs: number` (salt okunur)
Geçerli oynatma konumu (milisaniye cinsinden).

```ts
console.log(player.currentTimeMs)  // ör: 1500
```

#### `durationMs: number` (salt okunur)
Sahnedeki toplam süre (milisaniye cinsinden).

```ts
console.log(player.durationMs)  // ör: 3000
```

#### `isPlaying: boolean` (salt okunur)
Animasyonun şu anda oynatılıp oynatılmadığı.

```ts
if (player.isPlaying) {
  console.log('Oynatılıyor')
}
```

---

## CanvasRenderAdapter

Sahneleri 2D canvas context'ine render eder.

### Constructor

```ts
new CanvasRenderAdapter(ctx: CanvasRenderingContext2D)
```

**Parametreler:**
- `ctx` — Bir 2D canvas rendering context'i

### Kullanım

```ts
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const adapter = new CanvasRenderAdapter(ctx)

const player = new ChronoPlayer(scene, adapter)
```

### Özellikler

- Şekil renderlemesi (dikdörtgenler, daireler, yollar)
- Görsel ve video renderlemesi
- Özel fontlarla metin renderlemesi
- Blend modları ve kırpma
- Katman dönüşümleri ve opaklık
- Verimli yeniden çizim

---

## Özel RenderAdapter

WebGL, SVG vb. için özel rendering uygulamak üzere `RenderAdapter`'ı genişletin:

```ts
abstract class RenderAdapter {
  abstract render(frame: RenderFrame): void
}
```

### Örnek: WebGL Adapter (Sözde-kod)

```ts
class WebGLRenderAdapter extends RenderAdapter {
  constructor(private gl: WebGLRenderingContext) {
    super()
  }

  render(frame: RenderFrame): void {
    // WebGL context'i temizle
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)

    // Her katmanı render et
    for (const layer of frame.scene.layers) {
      this.renderLayer(layer, frame)
    }
  }

  private renderLayer(layer: Layer, frame: RenderFrame) {
    // WebGL rendering kodunuz
  }
}

// Kullanın
const adapter = new WebGLRenderAdapter(gl)
const player = new ChronoPlayer(scene, adapter)
```

---

## EventBridge

Düşük seviye olay sistemi (genellikle doğrudan kullanmaya gerek yok).

```ts
class EventBridge {
  on(type: string, callback: (event: any) => void): void
  onAny(callback: (event: any) => void): void
  emit(event: RuntimeEvent): void
}
```

---

## Olay Türleri

### Yaşam Döngüsü Olayları

| Olay | Yük | Ne Zaman |
|------|-----|---------|
| `play` | — | Oynatma başlar |
| `pause` | — | Oynatma duraklatılır |
| `stop` | — | Oynatma durdurulur |
| `tick` | `{ currentTimeMs }` | Her çerçeve |

### Zaman Çizelgesi Olayları

| Olay | Yük | Ne Zaman |
|------|-----|---------|
| `timelineStart` | `{ timelineId, timeMs }` | Zaman çizelgesi başlar |
| `timelineEnd` | `{ timelineId, timeMs }` | Zaman çizelgesi biter |
| `animationComplete` | — | Tüm sahne biter (loop=false) |

### Durum Makinesi Olayları

| Olay | Yük | Ne Zaman |
|------|-----|---------|
| `stateChange` | `{ smId, oldStateId, newStateId }` | Durum geçişi |
| `stateEnter` | `{ smId, stateId }` | Duruma giriş |
| `stateExit` | `{ smId, stateId }` | Durumdan çıkış |

### Parametre Olayları

| Olay | Yük | Ne Zaman |
|------|-----|---------|
| `paramChange` | `{ name, oldValue, newValue }` | Parameter güncellenir |

### Örnek: Olaylara Dinlemek

```ts
player.on('play', () => console.log('Başladı'))
player.on('stateChange', (evt) => {
  console.log(`SM ${evt.smId}: ${evt.oldStateId} → ${evt.newStateId}`)
})
player.on('paramChange', (evt) => {
  console.log(`${evt.name} = ${evt.newValue}`)
})
player.on('animationComplete', () => console.log('Bitti!'))
```

---

## ChronoPlayerOptions

Constructor'a geçirilen yapılandırma seçenekleri.

```ts
interface ChronoPlayerOptions {
  /**
   * Sahne bittiğinde yeniden başla.
   * @default false
   */
  loop?: boolean

  /**
   * Oynatma hızı çarpanı (0.5 = yarı hız, 2 = çift hız).
   * @default 1.0
   */
  speed?: number

  /**
   * Oluşturulduktan hemen sonra oynatmaya başla.
   * @default false
   */
  autoPlay?: boolean

  /**
   * Hedef kare hızı Hz cinsinden (tarayıcı bağımsız zamanlama için).
   * @default 60
   */
  tickRate?: number
}
```

### Örnek

```ts
const player = new ChronoPlayer(scene, adapter, {
  loop: true,
  speed: 0.5,      // Yarı hızda oynat
  autoPlay: false,
  tickRate: 60
})
```

---

## Tarayıcı Uyumluluğu

Desteklenen:
- Chrome/Edge 60+
- Firefox 55+
- Safari 12+
- iOS Safari 12+
- Android Browser 4.4+

---

## Terimler Sözlüğü

**Sahne** — Katmanlar, zaman çizelgeleri ve durum makineleriyle tamamlanmış bir animasyon.

**Zaman Çizelgesi** — Bir animasyon segmenti için keyframe dizisi.

**Katman** — Görsel bir eleman (şekil, görsel, metin, video vb.).

**Durum Makinesi** — Etkileşimli davranış için durumlar ve geçişler kümesi.

**Adapter** — Sahneleri görsel çıktıya dönüştüren renderer (canvas, WebGL vb.).

**Parameter** — Katman özelliklerine bağlanabilen dinamik veri değeri.

**Varlık** — Görsel, video, font veya diğer medya dosyası.

---

## Sonraki Adımlar

- [Durum Makineleri](./03-durum-makineleri.md) hakkında bilgi edinin
- [İleri Kullanım](./04-ileri-kullanim.md)'da optimizasyon
- [Örnekler](../../examples/)'e bakın
