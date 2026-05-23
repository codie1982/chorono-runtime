# @chorono/runtime Dokümantasyonu

`@chorono/runtime` — Framework'süz, sıfır bağımlılıklı web animasyon runtime'ına hoş geldiniz.

## Hızlı Linkler

- 🚀 [Başlangıç Rehberi](./01-kurulum-baslangic.md) — Kurulum ve ilk adımlar
- 📚 [API Referansı](./02-api-referansi.md) — Tam API dokumentasyonu
- 🎭 [Durum Makineleri](./03-durum-makineleri.md) — İnteraktif durum yönetimi
- ⚙️ [İleri Kullanım](./04-ileri-kullanim.md) — Özel rendering, performans
- ❓ [SSS & Sorun Çözümü](./05-sss.md) — Sık sorulan sorular ve çözümler

## Dokümantasyon Yapısı

### 1. [Başlangıç Rehberi](./01-kurulum-baslangic.md)
Buradan başlayın! Kurulumu, ilk animasyonu ve temel kavramları öğrenin.

- Kurulum seçenekleri (npm, CDN)
- Canvas ile temel kurulum
- İlk çalışan örnek
- Yaygın desenler

### 2. [API Referansı](./02-api-referansi.md)
Tüm sınıflar, metodlar ve etkinlikler için tam referans.

- **ChronoPlayer** — Ana animasyon oynatıcı sınıfı
- **CanvasRenderAdapter** — 2D canvas rendering
- **EventBridge** — Olay sistemi
- **Yapılandırma** — Seçenekler ve ayarlar
- **Tip Tanımları** — TypeScript arayüzleri

### 3. [Durum Makineleri](./03-durum-makineleri.md)
Durum makineleriyle etkileşimli animasyonlar oluşturmayı öğrenin.

- Durum makinesi kavramları
- Durumlar ve geçişler tanımlama
- Olayları ve geçişleri tetikleme
- Koruma koşulları (parametre tabanlı tetikleyiciler)
- Durumlar arasında çapraz geçiş
- Gerçek dünya örnekleri

### 4. [İleri Kullanım](./04-ileri-kullanim.md)
İleri kullanım durumları ve optimizasyon için derinlemesine dalın.

- Özel RenderAdapter'lar uygulanması
- `tick()` ile manuel çerçeve denetimi
- Performans optimizasyon teknikleri
- Tarayıcı uyumluluğu ve özellikler
- Bellek yönetimi ve temizleme
- Hata ayıklama stratejileri

### 5. [SSS & Sorun Çözümü](./05-sss.md)
Sık sorulan sorulara ve sorunların çözümlerine cevaplar.

- Asset yükleme ve yönetimi
- Framework entegrasyonu
- Mobil ve tarayıcı desteği
- Hata işleme
- Sahne (scene) format soruları
- Performans sorun çözümü

---

## Temel Kavramlar

### Sıfır Bağımlılık
`@chorono/runtime` **hiçbir dış bağımlılığı yoktur**. Modern herhangi bir tarayıcıda Node modülleri veya yapı araçları olmadan çalışır.

### Framework Bağımsız
**Vanilla JavaScript**, React, Vue, Svelte veya başka herhangi bir framework ile kullanın. Sadece bir JavaScript sınıfıdır.

### Platformlar Arası Tutarlılık
Aynı motor web, Android ve Chorono editöründe çalışır — her yerde aynı oynatışı garantiler.

### Sahne (Scene) Formatı
Sahneler Chorono editöründen dışa aktarılan JSON nesneleridir ve şunları içerir:
- Zaman çizelgeleri (keyframe dizileri)
- Katmanlar (görsel öğeler)
- Durum makineleri (etkileşimli mantık)
- Varlıklar (görseller, videolar, fontlar)
- Parametreler (dinamik veri bağlamaları)

---

## @chorono/runtime Nedir?

Chorono editöründe oluşturulan animasyonlar için bir **oynatıcıdır**. Bunu şöyle düşünebilirsiniz:
- **Video oynatıcı** keyframe animasyonları için
- **Oyun motoru** etkileşimli sahneler için
- **Animasyon kütüphanesi** durum makineleri ve olaylarla

Editörden bir sahne dışa aktarırsınız (bir JSON dosyası), sonra web'de oynatmak için bu runtime'ı kullanırsınız.

---

## Sonraki Adımlar

1. **Chorono'ya yeni mi?** → [Başlangıç Rehberi](./01-kurulum-baslangic.md) ile başlayın
2. **API yardımına mı ihtiyacınız var?** → [API Referansı](./02-api-referansi.md) kontrol edin
3. **Etkileşimli içerik mi oluşturuyorsunuz?** → [Durum Makineleri](./03-durum-makineleri.md) okuyun
4. **Bir şeyde mi takıldınız?** → [SSS & Sorun Çözümü](./05-sss.md) bölümüne bakın

---

## Kaynaklar

- 📦 [NPM Paketi](https://npmjs.com/package/@chorono/runtime)
- 🔗 [GitHub Deposu](https://github.com/your-org/chorono-runtime)
- 💬 [Discord Topluluğu](https://discord.gg/your-server) (yakında)
- 🐛 [Sorun Bildirin](https://github.com/your-org/chorono-runtime/issues)

---

## Örnekler

[`/examples`](../../examples/) klasöründeki örneklere bakın:
- Vanilla JavaScript
- React with Hooks
- Vue 3 Composition API
- İnteraktif kontroller
- Durum makinesi demoları
- Varlık yönetimi

---

## Destek

- **Sorularınız mı var?** Önce [SSS](./05-sss.md) kontrol edin
- **Bir hata buldunuz mu?** [Bir sorun açın](https://github.com/your-org/chorono-runtime/issues)
- **Katkıda bulunmak ister misiniz?** Katkı yönergeleri için ana depoyu kontrol edin

---

**Mutlu animasyon yapımları! 🎨**
