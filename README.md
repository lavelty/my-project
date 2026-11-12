# Koru Florya

Koru Florya Alışveriş ve Yaşam Merkezi için hazırlanmış bir web sitesi tasarım çalışması. Düz HTML, CSS ve JavaScript, GitHub Pages üzerinde yayında.

Canlı: https://lavelty.github.io/my-project/

## Sayfalar

- **Ana sayfa:** kat ve mağaza rehberi, yeme içme, etkinlik vitrini, ziyaretçi hizmetleri, ulaşım haritası ve canlı ring servis sayacı
- **Etkinlikler ve etkinlik detayı:** yaklaşan, bu hafta, bu ay, geçmiş ve kampanyalar; Google, Apple ve Outlook takvim bağlantıları
- **Mağaza sayfaları:** 177 mağazanın her biri için kat, kategori, çalışma saati ve yol tarifi
- **Kat planları:** her kat için açıklama, hizmetler ve mağaza kartları
- **KVKK ve kullanım şartları**

İçerik (mağaza listesi, kategoriler, etkinlikler, ring servis saatleri, yasal metinler) koruflorya.com'dan alınmıştır. Fotoğrafların çoğu Unsplash'tandır ve gerçek AVM fotoğraflarıyla değiştirilmelidir.

## İçeriği güncelleme

```bash
# 1. assets/data/stores.json veya assets/data/events.json dosyasını düzenle
# 2. Üretilen dosyaları ve SEO dosyalarını yenile
node tools/build-data.mjs
```

Resmi siteyle karşılaştırmak için: `node tools/sync-from-koruflorya.mjs` (yalnızca rapor verir). Ayrıntılar için `CLAUDE.md` dosyasına bak.

## Yerelde çalıştırma

```bash
npx http-server . -p 4173 -c-1
```

## Yayına almadan önce

- Koru Florya'dan yazılı izin alın: resmi sitenin kullanım şartları logo ve görsellerin kopyalanmasını izne bağlıyor.
- Gerçek kat planı çizimi (SVG, PDF veya DWG) varsa `KF.PLAN_FILES` ile bağlanabilir.
- Özel alan adı kullanılacaksa `tools/build-seo.mjs` içindeki `SITE` değerini değiştirip `node tools/build-data.mjs` çalıştırın.
