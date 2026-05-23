# Durum Makineleri Rehberi

Durum makinelerini kullanarak etkileşimli animasyonlar oluşturmayı öğrenin.

## Durum Makinesi Nedir?

Durum makinesi, herhangi bir anda ayrık durumlardan birinde olabilen bir sistemdir. Durumlar arasındaki geçişler olaylar tarafından tetiklenir.

**Örnek:** Durumları olan bir düğme animasyonu:
- `idle` — Düğme dinlenme halinde
- `hover` — Fare düğmenin üzerinde
- `pressed` — Düğmeye tıklanmış
- `loading` — İşlem yapılıyor

---

## Temel Kavramlar

### Durumlar

Bir durum görsel veya mantıksal bir koşulu temsil eder. Her durum şunlara sahip olabilir:
- Bağlantılı zaman çizelgesi (o durumda oynatılacak animasyon)
- Giriş işlemleri (duruma girerken çalışır)
- Çıkış işlemleri (durumdan çıkarken çalışır)

### Geçişler

Geçiş, bir durumdan diğerine hareket eder ve bir olay tarafından tetiklenir.

```
idle --[click]--> pressed
pressed --[release]--> idle
```

### Olaylar

Olaylar, durum makinesine geçişleri tetiklemek için gönderilen mesajlardır. Örnekler:
- `click`
- `hover`
- `release`
- `submit`

### Zaman Çizelgeleri

Bir duruma girdiğinizde, bağlantılı zaman çizelgesi oynatılır. Zaman çizelgeleri keyframe animasyonları içerir.

---

## Editörde Durum Makineleri Oluşturma

Chorono editöründe:

1. Her görsel varyant için durum oluşturun (idle, hover, pressed vb.)
2. Her duruma bir zaman çizelgesi atayın
3. Durumlar arasında geçişler tanımlayın
4. Geçişlere olay tetikleyicileri atayın

Bu JSON olarak dışa aktarılır ve runtime tarafından anlaşılır.

---

## Olay Gönderme

Geçişi tetiklemek için bir olay gönderin:

```ts
// Genel olay (tüm makineler duyar)
player.dispatch('click')

// Belirli makineye olay
player.dispatch('click', 'button-machine-id')
```

Bir olay gönderildiğinde:
1. Durum makinesi geçerli durumdan geçişleri kontrol eder
2. Eşleşen geçiş varsa, tetiklenir
3. Animasyon düzgün şekilde yeni duruma geçer

---

## Örnek: Düğme Animasyonu

### Sahne Tanımı

Bir düğme makinesi içeren sahne:

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

### Kodda Kullanımı

```ts
const player = new ChronoPlayer(scene, adapter)

// Kullanıcı hover ettiğinde
canvas.addEventListener('mouseenter', () => {
  player.dispatch('mouseEnter')
})

canvas.addEventListener('mouseleave', () => {
  player.dispatch('mouseLeave')
})

// Kullanıcı tıkladığında
canvas.addEventListener('click', () => {
  player.dispatch('click')
})

// Tıklamadan sonra release'i taklit edin
setTimeout(() => {
  player.dispatch('release')
}, 200)

player.play()
```

---

## Koruma Koşulları (Guard Conditions)

Koşullar parametrelere dayalı şartlardır. Geçiş, koşulu sağlanıyorsa tetiklenir.

### Örnek: Skor Eşiği

```json
{
  "transitions": [
    {
      "from": "playing",
      "to": "victory",
      "trigger": "levelComplete",
      "guard": "score >= 1000",  // Sadece skor 1000+ ise
      "duration": 500
    },
    {
      "from": "playing",
      "to": "defeat",
      "trigger": "levelComplete",
      "guard": "score < 1000",   // Aksi halde
      "duration": 300
    }
  ]
}
```

### Kodda

```ts
// Parameter ayarla
player.setParam('score', 1250)

// Olay gönder - geçiş koşula bağlı
player.dispatch('levelComplete')
// → Otomatik olarak 'victory' seçilir çünkü score >= 1000
```

### Koşul Sözdizimi

Koşullar basit ifadelerdir:
- `score >= 1000`
- `isActive == true`
- `health > 0`
- `name != ""`

Desteklenen operatörler: `==`, `!=`, `>`, `<`, `>=`, `<=`

---

## Çoklu Durum Makineleri

Bir sahne birden fazla bağımsız durum makinesine sahip olabilir. Her biri kendi durumunu yönetir.

### Örnek: Düğme + Yükleme Spinner'ı

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

### Onları ayrı ayrı kontrol etme

```ts
// Düğme makinesini tetikle
player.dispatch('click', 'button')

// Spinner makinesini tetikle
player.dispatch('spin', 'spinner')

// Veya tüm makinelere olay gönder
player.dispatch('reset')
```

---

## Durumlar Arasında Çapraz Geçiş

Geçişler, düzgün geçiş için bir süreye sahip olabilir:

```json
{
  "from": "idle",
  "to": "hover",
  "trigger": "mouseEnter",
  "duration": 200  // 200ms geçiş
}
```

200ms'de:
1. "idle" zaman çizelgesi mevcut keyframe'ini tamamlar
2. "hover" zaman çizelgesi oynatmaya başlar
3. Her ikisi de birlikte karışır (alfa geçişi)
4. 200ms sonra sadece "hover" oynatılır

---

## Durum Değişikliği Olayları

Durum makinesi geçişlerini dinleyin:

```ts
player.on('stateChange', ({ smId, oldStateId, newStateId }) => {
  console.log(`${smId}: ${oldStateId} → ${newStateId}`)
})
```

### Örnek: UI'ı Güncelleme

```ts
player.on('stateChange', ({ smId, newStateId }) => {
  if (smId === 'button') {
    document.getElementById('status').textContent = newStateId
  }
})
```

---

## İleri: Parametre Tabanlı Geçişler

Veriye dayalı karmaşık durum mantığı oluşturmak için koşulları kullanın.

### Örnek: Oyun Durumları

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

### Kullanımı

```ts
player.setParam('difficulty', 'hard')
player.dispatch('start')  // Geçiş tetiklenir (koşul true)

player.setParam('difficulty', 'impossible')
player.dispatch('start')  // Geçiş tetiklenmez (koşul false)
```

---

## En İyi Uygulamalar

### 1. Durum Makinelerini Basit Tutun

Her makine bir mantıksal konuyla ilgilenmelidir:
- ✅ Düğme durumları (idle, hover, pressed)
- ✅ Modal durumları (gizli, açık, kapanıyor)
- ❌ Düğme ve modal'ı aynı makinede karıştırma

### 2. Anlamlı İsimler Kullanın

```ts
// ✅ İyi
player.dispatch('buttonClicked')
player.dispatch('modelLoaded')
player.dispatch('userHovered')

// ❌ Belirsiz
player.dispatch('event1')
player.dispatch('trigger')
```

### 3. Parametreleri Olaylardan Önce Ayarlayın

Geçiş bir koşula bağlıysa:

```ts
// ✅ Doğru sıra
player.setParam('lives', 0)  // Parametreyi ilk ayarla
player.dispatch('die')       // Sonra olayı gönder

// ❌ Yanlış sıra
player.dispatch('die')       // Olay tetiklenir ama koşul güncellenen değeri görmez
player.setParam('lives', 0)
```

### 4. Asenkron İşlemleri Yönet

API çağrıları gibi asenkron görevler için parametreler + timeout kullanın:

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

### 5. UI Olaylarını Gönderilere Eşleyin

```ts
// Input alanı → Parameter
document.getElementById('name').addEventListener('change', (e) => {
  player.setParam('name', e.target.value)
})

// Düğme tıklaması → Olay gönderme
document.getElementById('submit').addEventListener('click', () => {
  player.dispatch('submit')
})

// Hover → Genel olay
document.addEventListener('mousemove', () => {
  player.dispatch('mousemove')
})
```

---

## Durum Makinelerini Hata Ayıklama

### Geçerli Durumu İnceleme

```ts
const sm = player.getStateMachine('button')
if (sm) {
  console.log('Geçerli durum:', sm.currentStateId)
}
```

### Tüm Durum Değişikliklerini Kaydet

```ts
player.on('stateChange', (evt) => {
  console.log(`[${new Date().toISOString()}] ${evt.smId}:`, evt)
})
```

### Koşul Değerlendirmesini Kontrol Et

Koşullar olay gönderdiğinizde değerlendirilir. Hiçbir şey olmazsa, koşul engellediği olabilir:

```ts
// Gönderilmeden önce parametreyi kontrol et
console.log('Score:', player.currentTimeMs)

// Sonra gönder
player.dispatch('levelComplete')
```

---

## Performans Hususları

- Durum makineleri **çok verimlidir** — minimum CPU kullanırlar
- Her çerçevede koşullar kontrol edilir ve geçişler değerlendirilir
- Zaman çizelgeleri geçiş sırasında çalışır (çapraz geçişler)
- Dış kütüphaneler gerekli değildir

---

## /examples Klasöründe Örnekler

Tam çalışan bir örnek için `/examples/state-machines/` klasörüne bakın:
- Multi-durum animasyonu
- Olay gönderme
- Koşul koşulları
- Geçerli durumu gösteren UI

---

## Sonraki Adımlar

- [İleri Kullanım](./04-ileri-kullanim.md) için özel rendering
- [SSS](./05-sss.md) sık sorulanlar
- [Örnekler](../../examples/) klasörüne bakın
