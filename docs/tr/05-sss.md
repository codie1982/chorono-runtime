# SSS & Sorun Çözümü

Sık sorulan sorular ve çözümler.

## Kurulum & Kurulum

### S: Node.js olmadan @chorono/runtime kullanabilir miyim?
**C:** Evet! CDN versiyonunu kullanın:
```html
<script src="https://unpkg.com/@chorono/runtime/dist/chorono-runtime.global.js"></script>
```
Build adımı gerekli değildir.

### S: TypeScript desteği var mı?
**C:** Evet! Tam türler dahildir. Normal şekilde import edin:
```ts
import { ChronoPlayer, CanvasRenderAdapter } from '@chorono/runtime'
```

### S: Build aracına ihtiyacım var mı?
**C:** Hayır. Herhangi bir bundler (Webpack, Vite, Rollup, esbuild, vb.) veya CDN ile çalışır.

---

## Sahne & Varlıklar

### S: Sahneleri nereden alırım?
**C:** Chorono editöründen JSON olarak dışa aktarın.

### S: Dosyadan sahne nasıl yüklerim?
**C:** Fetch kullanın:
```ts
const response = await fetch('./scene.json')
const scene = await response.json()
const player = new ChronoPlayer(scene, adapter)
```

### S: Yüklendikten sonra sahneyi değiştirebilir miyim?
**C:** Önerilmez. Runtime immutable sahneler bekler. Dinamik içerik için **parametreleri** kullanın.

### S: Harici görselleri/videoları nasıl yönetim?
**C:** Sahnedeki varlık URL'sini ayarlayın:
```json
{
  "assets": [
    {
      "id": "img-1",
      "type": "image",
      "url": "https://example.com/image.jpg"
    }
  ]
}
```
Runtime bunları otomatik yükler.

### S: Gömülü (base64) varlıkları kullanabilir miyim?
**C:** Evet, editör varlıkları gömebilir. Data URI olarak gelir:
```json
{
  "assets": [
    {
      "id": "img-1",
      "type": "image",
      "url": "data:image/png;base64,iVBORw0KG..."
    }
  ]
}
```

### S: Varlıkları önceden yüklerim?
**C:** Runtime varlıkları isteğe bağlı yükler. Önceden yüklemek için:
```ts
async function preloadAssets(scene: ChronoScene) {
  const promises = scene.assets?.map(asset => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = resolve
      img.src = asset.url
    })
  }) || []

  await Promise.all(promises)
}

await preloadAssets(scene)
player.play()
```

---

## Oynatma & Zamanlama

### S: Animasyon neden oynatılmıyor?
**C:** `player.play()` çağırın:
```ts
const player = new ChronoPlayer(scene, adapter)
player.play()  // Gerekli!
```

### S: Otomatik oynatmayı nasıl yapırım?
**C:** `autoPlay` seçeneğini kullanın:
```ts
const player = new ChronoPlayer(scene, adapter, { autoPlay: true })
```

### S: Hızı değiştirebilir miyim?
**C:** Evet, `speed` seçeneğini kullanın:
```ts
const player = new ChronoPlayer(scene, adapter, { speed: 0.5 })  // Yarı hız
```

### S: Geçerli zamanı nasıl alırım?
**C:**
```ts
console.log(player.currentTimeMs)  // Milisaniye
console.log(player.durationMs)     // Toplam süre
```

### S: Belirli bir zamana atlayabilir miyim?
**C:** Evet:
```ts
player.seek(1500)  // 1.5 saniyeye atla
```

### S: Döngü nasıl yapılır?
**C:**
```ts
const player = new ChronoPlayer(scene, adapter, { loop: true })
```

---

## Durum Makineleri & Olaylar

### S: Olay nasıl gönderirim?
**C:**
```ts
player.dispatch('eventName')
```

### S: Belirli makineye olay nasıl gönderirim?
**C:**
```ts
player.dispatch('eventName', 'machine-id-123')
```

### S: Olayım geçişi tetiklemiyor?
**C:** Kontrol edin:
1. Makine ID'si doğru mu (eğer belirli makineyi hedefliyor)
2. Geçerli durumda bu olay için geçiş var mı
3. Koşul (varsa) true mi değerlendirilme

```ts
const sm = player.getStateMachine('my-machine')
console.log('Geçerli durum:', sm?.currentStateId)  // Buradan geçiş var mı?

player.setParam('score', 1000)  // Koşul parametreye bağlıysa
player.dispatch('myEvent')      // Sonra gönderin
```

### S: Durum değişikliklerini nasıl dinlerim?
**C:**
```ts
player.on('stateChange', ({ smId, oldStateId, newStateId }) => {
  console.log(`Durum değişti: ${oldStateId} → ${newStateId}`)
})
```

### S: Çoklu makinelerim olabilir mi?
**C:** Evet. Sahne birçok makine içerebilir. Hepsine veya belirli olana gönder:
```ts
player.dispatch('reset')           // Tüm makineler
player.dispatch('click', 'button')  // Belirli makine
```

---

## Parametreler & Veri Bağlama

### S: Sahneye veri nasıl iletim?
**C:** Parametreleri kullanın:
```ts
player.setParam('userName', 'Alice')
player.setParam('score', 1250)
player.setParam('isActive', true)
```

### S: Parametreler ne tür olabilir?
**C:** `string | number | boolean`

### S: Parametreyi nasıl okurum?
**C:** Built-in getter yoktur. Kendi takip etmeniz gerekir:
```ts
let currentUserName = 'Alice'
player.setParam('userName', currentUserName)

// Değişiklikleri dinle
player.on('paramChange', ({ name, newValue }) => {
  if (name === 'userName') {
    currentUserName = newValue
  }
})
```

### S: Parametreleri koşullarda kullanabilir miyim?
**C:** Evet:
```json
{
  "transition": {
    "from": "idle",
    "to": "error",
    "trigger": "submit",
    "guard": "score < 0"
  }
}
```

---

## Rendering & Performans

### S: Yüksek DPI ekranlarda canvas bulanık mı?
**C:** Cihaz piksel oranına ölçekle:
```ts
const dpr = window.devicePixelRatio || 1
canvas.width = 1024 * dpr
canvas.height = 768 * dpr
canvas.style.width = '1024px'
canvas.style.height = '768px'

const ctx = canvas.getContext('2d')
ctx.scale(dpr, dpr)
```

### S: Daha iyi performans nasıl elde ederim?
**C:**
1. Uygun canvas boyutu kullanın (4K değil, mobil de değil)
2. Görünür katmanları sınırlandırın
3. Varlık öğelerini önbelleğe alın
4. Olay işleyicilerini kısıtlayın
5. `requestAnimationFrame` kullanın

[İleri Kullanım](./04-ileri-kullanim.md)'da optimizasyon teknikleri.

### S: Canvas dışına render edebilir miyim?
**C:** Evet, özel RenderAdapter oluşturun (SVG, WebGL, Threejs vb.). [İleri Kullanım](./04-ileri-kullanim.md)'ı görün.

---

## Framework Entegrasyonu

### S: Bunu React ile kullanabilir miyim?
**C:** Evet. Ref ve useEffect kullanın:
```tsx
import { useEffect, useRef } from 'react'
import { ChronoPlayer, CanvasRenderAdapter } from '@chorono/runtime'

export function Animation({ scene }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    const player = new ChronoPlayer(scene, new CanvasRenderAdapter(ctx))
    player.play()

    return () => player.stop()
  }, [scene])

  return <canvas ref={canvasRef} width={1024} height={768} />
}
```

[/examples/react/](../../examples/react/) tam örneğine bakın.

### S: Vue ile nasıl?
**C:** `ref()` ve `onMounted` kullanın:
```vue
<template>
  <canvas ref="canvas"></canvas>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { ChronoPlayer, CanvasRenderAdapter } from '@chorono/runtime'

const canvas = ref(null)

onMounted(() => {
  const ctx = canvas.value.getContext('2d')
  const player = new ChronoPlayer(scene, new CanvasRenderAdapter(ctx))
  player.play()
})
</script>
```

[/examples/vue/](../../examples/vue/) tam örneğine bakın.

### S: Svelte, Angular vb. ile kullanabilir miyim?
**C:** Evet. Sadece bir JavaScript sınıfıdır, herhangi bir framework ile çalışır.

---

## Mobil & Tarayıcı Uyumluluğu

### S: Mobilde çalışır mı?
**C:** Evet. Canvas, iOS Safari ve Android tarayıcılarda desteklenir.

### S: Touch uyumlu mu?
**C:** Runtime oynatmayı yönetir. Siz touch olaylarını yönetin:
```ts
canvas.addEventListener('touchstart', () => {
  player.dispatch('click')
})
```

### S: Eski tarayıcılarda çalışır mı?
**C:** Canvas 2D gerekli (IE 9+, tüm modern tarayıcılar). IE 8 için fallback renderer gerekli.

### S: Offline çalışır mı?
**C:** Evet. Yüklendikten sonra tamamen offline çalışır. Varlıklar gömülü veya önceden önbelleğe alınmalıdır.

---

## Hatalar & Hata Ayıklama

### S: "canvas context is null" hatası?
**C:** Canvas öğesinin var olduğundan emin olun:
```ts
const canvas = document.querySelector('canvas')
if (!canvas) throw new Error('Canvas bulunamadı')

const ctx = canvas.getContext('2d')
if (!ctx) throw new Error('Canvas 2D desteklenmiyor')
```

### S: "Scene is invalid"?
**C:** Kontrol edin:
1. Sahne geçerli JSON mi
2. Sahnede gerekli alanlar var mı (id, durationMs, width, height)
3. Zaman çizelgeleri ve katmanlar var mı

### S: Hiçbir şey render edilmiyor?
**C:** Kontrol edin:
1. Canvas context oluşturuldu mu
2. Sahnede katmanlar ve zaman çizelgeleri var mı
3. `player.play()` çağırıldı mı
4. Konsol hatası var mı

### S: Durum makinesi geçmiyor?
**C:** Hata ayıklayın:
```ts
const sm = player.getStateMachine('my-machine')
console.log('Geçerli:', sm?.currentStateId)
console.log('Score:', playerScore)  // Koşul bunu kullanıyorsa

// Tüm olayları konsola kaydet
player.onAny(evt => console.log(evt))
```

### S: Performans yavaş mı?
**C:**
1. Canvas boyutunu kontrol edin (çok büyük değil mi)
2. DevTools'ta profil yapın
3. Katman sayısını azaltın
4. Bellek sızıntıları kontrol edin

---

## Genel

### S: Ücretsiz mi?
**C:** Evet, MIT Lisanslı.

### S: Ticari olarak kullanabilir miyim?
**C:** Evet, kısıtlama yoktur.

### S: Kaynak kodu nerede?
**C:** [chorono-editor](https://github.com/your-org/chorono-editor) deposunda `src/lib/player/`.

### S: Hata nasıl bildiririm?
**C:** [Issue açın](https://github.com/your-org/chorono-runtime/issues).

### S: Katkıda bulunabilir miyim?
**C:** Evet! Ana depodaki katkı yönergeleri kontrol edin.

---

## Hâlâ sorularınız mı var?

- 📖 Tam [dokümantasyonu](./index.md) okuyun
- 💻 [Örnekler](../../examples/) kontrol edin
- 🐛 [Issue açın](https://github.com/your-org/chorono-runtime/issues)
- 💬 Discord'a katılın (yakında)

**Mutlu animasyon yapımları! 🎨**
