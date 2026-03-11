<div align="center">

<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=30&pause=1000&color=00B4FF&center=true&vCenter=true&width=600&lines=🎬+Altai+Video+Downloader;YouTube+%E2%80%A2+TikTok+%E2%80%A2+Instagram+%26+1000%2B" alt="Typing SVG" />

<br/>

[![Release](https://img.shields.io/github/v/release/Taka-source14/VideoDownloadManager?style=for-the-badge&color=00B4FF&label=Son+Sürüm)](https://github.com/Taka-source14/VideoDownloadManager/releases/latest)
[![Downloads](https://img.shields.io/github/downloads/Taka-source14/VideoDownloadManager/total?style=for-the-badge&color=00cc66&label=İndirme)](https://github.com/Taka-source14/VideoDownloadManager/releases)
[![License](https://img.shields.io/github/license/Taka-source14/VideoDownloadManager?style=for-the-badge&color=yellow)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Windows-0078D6?style=for-the-badge&logo=windows)](https://github.com/Taka-source14/VideoDownloadManager/releases/latest)

<br/>

**YouTube, TikTok, Instagram, Twitter/X ve 1000+ platformdan video indiren,  
tamamen bağımsız (standalone) Windows CLI uygulaması.**

*Kurulum yok · Bağımlılık yok · Tek .exe dosyası*

</div>

---

## ⚡ Hızlı Başlangıç

### 1. İndir

<div align="center">

[**📥 altayvideo.exe İndir (Son Sürüm)**](https://github.com/Taka-source14/VideoDownloadManager/releases/latest)

</div>

1. Yukarıdaki bağlantıdan `altayvideo.exe` dosyasını indirin
2. İstediğiniz bir klasöre koyun
3. Çift tıklayın — başka bir şey gerekmez

> **Not:** Windows Defender "bilinmeyen yayıncı" uyarısı verebilir → "Yine de çalıştır" deyin.  
> Bu, tüm `pkg` ile derlenmiş uygulamalarda normaldir. Kaynak kodu bu repoda tam olarak mevcuttur.

---

## 🎬 Ekran Görüntüsü

```
  ██╗   ██╗██╗██████╗ ███████╗ ██████╗
  ██║   ██║██║██╔══██╗██╔════╝██╔═══██╗
  ██║   ██║██║██║  ██║█████╗  ██║   ██║
  ╚██╗ ██╔╝██║██║  ██║██╔══╝  ██║   ██║
   ╚████╔╝ ██║██████╔╝███████╗╚██████╔╝
    ╚═══╝  ╚═╝╚═════╝ ╚══════╝ ╚═════╝

  ██████╗  ██████╗ ██╗    ██╗███╗   ██╗██╗      ██████╗  █████╗ ██████╗
 ██╔══██╗██╔═══██╗██║    ██║████╗  ██║██║     ██╔═══██╗██╔══██╗██╔══██╗
 ██║  ██║██║   ██║██║ █╗ ██║██╔██╗ ██║██║     ██║   ██║███████║██║  ██║
 ██║  ██║██║   ██║██║███╗██║██║╚██╗██║██║     ██║   ██║██╔══██║██║  ██║
 ██████╔╝╚██████╔╝╚███╔███╔╝██║ ╚████║███████╗╚██████╔╝██║  ██║██████╔╝
 ╚═════╝  ╚═════╝  ╚══╝╚══╝ ╚═╝  ╚═══╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝

  YouTube • TikTok • Instagram • Twitter • Vimeo • 1000+ Platform
  Powered by yt-dlp + ffmpeg | Altai Squad Edition

  Lütfen bir işlem seçin:

  1)  🎬  Tekli Video İndir
  2)  📋  Playlist İndir
  3)  🔍  Video Bilgisi Göster
  4)  🧹  Sistem Temizliği (Uninstall)
  5)  🚪  Çıkış
```

---

## ✨ Özellikler

| Özellik | Detay |
|---|---|
| 🌍 **1000+ Platform** | YouTube, TikTok, Instagram, Twitter/X, Facebook, Vimeo, Dailymotion, Reddit, Twitch ve daha fazlası |
| 🎞 **3 Format** | MP4 · WebM · MKV |
| 📐 **7 Kalite** | 360p · 480p · 720p · 1080p · 1440p · 4K · En İyi |
| 📋 **Playlist** | Tüm playlist'i tek seferde indir |
| 🔍 **Video Bilgisi** | İndirmeden önce başlık, kanal, süre, izlenme ve mevcut kaliteleri görüntüle |
| 📁 **Konum Seçimi** | Program yanı · Masaüstü · İndirilenler · Özel klasör |
| 🚀 **Canlı İlerleme** | `İndiriliyor: 73.4%  ⚡ 4.2MiB/s  ⏱ ETA 00:18` |
| 🔧 **Codec Uyumu** | MP4→H.264+AAC · WebM→VP9+Opus · MKV→Her codec |
| 🧹 **Temiz Kaldırma** | Tek menüden tam uninstall — bilgisayarda iz bırakmaz |
| 📦 **Standalone** | Node.js, Python, ffmpeg kurulumu **gerekmez** |

---

## 🗂 Proje Yapısı

```
VideoDownloadManager/
├── download.js          ← Ana uygulama (tek dosyada ~590 satır)
├── package.json         ← Proje yapılandırması + pkg build ayarları
├── package-lock.json    ← Bağımlılık kilidi (reproducible build)
├── build.bat            ← Exe derleme yardımcı scripti
├── .gitignore
├── LICENSE
└── README.md
```

> **Çalışma zamanı oluşturulan klasör:**
```
├── yardimci-araclar/    ← Otomatik oluşur (ffmpeg, ffprobe, yt-dlp)
```


## 🔒 Nasıl Çalışır?

```
altayvideo.exe başlar
        │
        ▼
yardimci-araclar/ klasörü oluşturulur
ffmpeg.exe + ffprobe.exe oraya kopyalanır
yt-dlp.exe yoksa GitHub'dan otomatik indirilir
        │
        ▼
Kullanıcı menüsü → URL gir → Format + Kalite seç
        │
        ▼
yt-dlp, seçilen platforma istek atar
Ayrı video + audio stream indirir
ffmpeg ile birleştirir (codec-uyumlu)
        │
        ▼
Seçilen klasöre .mp4 / .webm / .mkv kaydedilir
```

---

## 🌍 Desteklenen Platformlar

<details>
<summary>Tüm listeyi göster (seçilen örnekler)</summary>

| Platform | Durum | Not |
|---|---|---|
| YouTube | ✅ | Video · Shorts · Playlist · Kanal |
| TikTok | ✅ | Watermark'sız |
| Instagram | ✅ | Reel · Post · IGTV |
| Twitter / X | ✅ | |
| Facebook | ✅ | |
| Vimeo | ✅ | |
| Dailymotion | ✅ | |
| Reddit | ✅ | |
| Twitch | ✅ | VOD |
| Pinterest | ✅ | |
| **1000+ site** | ✅ | [yt-dlp desteklenen siteler](https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md) |

</details>

---

## ❓ Sık Sorulan Sorular

**Windows Defender uyarı veriyor, virüs mü?**  
Hayır. `pkg` ile derlenen tüm Node.js uygulamaları bu uyarıyı alır çünkü Node.js runtime'ı exe'ye gömülü gelir ve imzalanmamıştır. Tüm kaynak kodu bu repoda açık olarak mevcuttur, inceleyebilirsiniz.

**Neden 200MB?**  
Node.js runtime (~90MB) + ffmpeg (~120MB) + uygulama kodu exe içinde gömülüdür. Kullanıcı bilgisayarına ek kurulum gerekmez.

**Playlist indirirken hata alıyorum?**  
Üye-yalnızca (members-only) veya özel içerikler indirilemez. Herkese açık playlist'lerde sorun yaşanmamalıdır.

**yt-dlp neden ayrı bir dosya?**  
yt-dlp çok sık güncelleniyor (YouTube API değişiklikleri). Ayrı tutularak `.exe`'yi yeniden derlemeden güncellenebilir.

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) ile lisanslanmıştır.

```
Copyright (c) 2026 Taka-source14 / Altai Squad
```

---

<div align="center">

**Altai Squad tarafından ❤️ ile yapıldı**

[⭐ Star](https://github.com/Taka-source14/VideoDownloadManager) · [🐛 Sorun Bildir](https://github.com/Taka-source14/VideoDownloadManager/issues) · [📥 İndir](https://github.com/Taka-source14/VideoDownloadManager/releases/latest)

</div>
