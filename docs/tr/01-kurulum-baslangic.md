# @chorono/runtime ile Başlangıç

Kurulumu, ilk animasyonu ve temel konseptleri öğrenin.

## Kurulum

### NPM üzerinden (Bundled uygulamalar için önerilen)

```bash
npm install @chorono/runtime
```

Sonra JavaScript kodunuza import edin:

```ts
import { ChronoPlayer, CanvasRenderAdapter } from '@chorono/runtime'
```

### CDN üzerinden (Standalone HTML için)

HTML `<head>` bölümüne şunu ekleyin:

```html
<script src="https://unpkg.com/@chorono/runtime@0.1.0/dist/chorono-runtime.global.js"></script>
```

Ardından global `Chorono` nesnesini kullanın:

```html
<script>
  const player = new Chorono.ChronoPlayer(scene, adapter)
</script>
```

---

## Temel Kurulum

### Adım 1: Canvas Elemanı

```html
<canvas id="animation" width="1024" height="768"></canvas>
```

### Adım 2: Sahneyinizi Alın

Chorono editöründen bir sahne dışa aktarın (JSON dosyası). Kaydedin veya sunucunuzdan yükleyin:

```ts
const scene = {
  id: 'scene-123',
  name: 'Animasyonum',
  durationMs: 3000,
  width: 1024,
  height: 768,
  // ... daha fazla özellik
}
```

### Adım 3: Player Oluşturun

```ts
import { ChronoPlayer, CanvasRenderAdapter } from '@chorono/runtime'

// Canvas ve 2D context'i alın
const canvas = document.getElementById('animation')
const ctx = canvas.getContext('2d')

// Adapter oluşturun (oynatıcıya nasıl render edeceğini söyler)
const adapter = new CanvasRenderAdapter(ctx)

// Player oluşturun
const player = new ChronoPlayer(scene, adapter, {
  loop: true,
  speed: 1.0
})
```

### Adım 4: Oynatın!

```ts
player.play()
```

---

## Tam Örnek

**HTML:**
```html
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>Chorono Animasyonu</title>
  <style>
    body {
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: #1a1a1a;
    }
    canvas {
      border: 1px solid #333;
    }
  </style>
</head>
<body>
  <canvas id="player" width="1024" height="768"></canvas>

  <script src="https://unpkg.com/@chorono/runtime@0.1.0/dist/chorono-runtime.global.js"></script>
  <script src="./scene.js"></script>
  <script src="./app.js"></script>
</body>
</html>
```

**JavaScript (app.js):**
```js
const canvas = document.getElementById('player')
const ctx = canvas.getContext('2d')

// Player oluşturun
const adapter = new Chorono.CanvasRenderAdapter(ctx)
const player = new Chorono.ChronoPlayer(scene, adapter, {
  loop: true
})

// Olaylara dinleyin
player.on('stateChange', (evt) => {
  console.log(`Durum değişti: ${evt.oldStateId} → ${evt.newStateId}`)
})

player.on('animationComplete', () => {
  console.log('Animasyon bitti!')
})

// Oynatmaya başlayın
player.play()
```

---

## Bundler ile (ES Modüller)

**package.json:**
```json
{
  "type": "module",
  "dependencies": {
    "@chorono/runtime": "^0.1.0"
  }
}
```

**main.js:**
```ts
import { ChronoPlayer, CanvasRenderAdapter } from '@chorono/runtime'
import scene from './scenes/my-animation.json'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const adapter = new CanvasRenderAdapter(ctx)
const player = new ChronoPlayer(scene, adapter, { loop: true })

player.play()
```

---

## Sahneleri Dinamik Olarak Yükleme

### JSON dosyasından (fetch)

```ts
async function loadAndPlay() {
  const response = await fetch('./scenes/animation.json')
  const scene = await response.json()

  const player = new ChronoPlayer(scene, adapter)
  player.play()
}

loadAndPlay()
```

### Chorono Editör dışa aktarımından

Editörden dışa aktardığınızda, tüm sahneyi içeren bir `.json` dosyası alırsınız. Yukarıda gösterildiği gibi yükleyin.

---

## Yaygın Desenler

### Oynat/Duraklat Kontrolleri

```ts
const playBtn = document.getElementById('play')
const pauseBtn = document.getElementById('pause')

playBtn.addEventListener('click', () => player.play())
pauseBtn.addEventListener('click', () => player.pause())
```

### Zaman Çizelgesi Kaydırıcısı

```ts
const slider = document.getElementById('timeline')

slider.addEventListener('input', (e) => {
  const timeMs = parseFloat(e.target.value)
  player.seek(timeMs)
})

// Animasyon oynarken kaydırıcıyı güncelle
player.on('tick', (evt) => {
  slider.value = evt.currentTimeMs
})
```

### Parametre Bağlama

```ts
// Runtime'da sahne parametresini güncelle
const userInput = document.getElementById('userName')

userInput.addEventListener('input', (e) => {
  player.setParam('userName', e.target.value)
})
```

### Durum Değişikliklerine Yanıt Verme

```ts
player.on('stateChange', ({ smId, newStateId }) => {
  console.log(`Makine ${smId} duruma girdi: ${newStateId}`)
  
  // Duruma göre UI'ı güncelleyin
  document.getElementById('status').textContent = newStateId
})
```

---

## Sonraki Adımlar

- Tam [API Referansı](./02-api-referansi.md)nı okuyun
- [Durum Makineleri](./03-durum-makineleri.md) hakkında bilgi edinin
- [Örnekler](../../examples/) klasörüne bakın
- [İleri Kullanım](./04-ileri-kullanim.md) için optimizasyon ipuçları

---

## Sorun Çözümü

**Canvas render edilmiyor mu?**
- Canvas context'i `getContext('2d')` ile oluşturduğunuzdan emin olun
- Sahnede katmanlar ve zaman çizelgeleri olup olmadığını kontrol edin

**Animasyon oynatılmıyor mu?**
- Başlatmak için `player.play()` çağırın
- Konsolu hata iletileri için kontrol edin

**CDN scripti eksik mi?**
- Script'i kendi kodunuzdan önce eklediğinizden emin olun
- 404 hataları için konsolu kontrol edin

Daha fazla yardım için [SSS & Sorun Çözümü](./05-sss.md) bölümüne bakın.
