# 🎬 Altai Video Downloader — Kullanım Kılavuzu

YouTube, TikTok, Instagram, Twitter ve 1000+ platformdan video indiren, tamamen bağımsız (standalone) bir Windows CLI uygulaması.

---

## ⚡ Hemen İndir

[Releases](https://github.com/Taka-source14/altayvideo/releases) sayfasından `altayvideo.exe` dosyasını indirip istediğiniz bir klasöre koyun — kurulum gerekmez.

---

## 🚀 Adım Adım Kullanım

### 1. Programı Çalıştırın

`altayvideo.exe` dosyasına çift tıklayın. Renkli ana menü açılacaktır.

### 2. Video İndirme

- Menüden `1` seçin → Video İndir
- URL'yi yapıştırın (YouTube, TikTok, Instagram, Twitter vb.)
- Format seçin: **MP4** / WebM / MKV
- Kalite seçin: 360p / 480p / **720p** / 1080p / 4K / En İyi
- İndirme konumunu seçin (program yanı, Masaüstü, İndirilenler veya özel)
- İndirme ilerlemesini canlı takip edin: `İndiriliyor: 45.2% ⚡ 3.1MiB/s ⏱ ETA 00:22`

### 3. Playlist İndirme

- Menüden `2` seçin → Playlist İndir
- YouTube playlist veya kanal URL'si girin → format ve kalite seçin → tüm videolar indirilir

### 4. Video Bilgisi Göster

- Menüden `3` seçin → URL girin
- İndirme yapmadan: Başlık, Kanal, Süre, İzlenme sayısı, Mevcut kaliteler görüntülenir

### 5. Sistem Temizliği (Uninstall)

- Menüden `4` seçin → `e` ile onaylayın
- `yardimci-araclar/` klasörü + video dosyaları silinir
- Geriye kalan `.exe` dosyasını da sildiğinizde bilgisayarınızda hiçbir iz kalmaz

---

## 🌍 Desteklenen Platformlar

| Platform | Durum |
|---|---|
| YouTube | ✅ Video + Playlist + Shorts |
| TikTok | ✅ |
| Instagram | ✅ Reel + Video + IGTV |
| Twitter / X | ✅ |
| Facebook | ✅ |
| Vimeo | ✅ |
| Dailymotion | ✅ |
| Reddit | ✅ |
| Twitch | ✅ VOD |
| 1000+ site | ✅ yt-dlp destekli |

---

## 🛠 Bilmeniz Gerekenler

- **İlk açılışta** program yanında `yardimci-araclar/` klasörü oluşur (ffmpeg, ffprobe, yt-dlp).
- **yt-dlp.exe** eksikse program otomatik olarak GitHub'dan indirir.
- İndirilen videolar seçtiğiniz klasöre kaydedilir.
- Windows Defender uyarısı görebilirsiniz — bu `pkg` ile derlenen tüm uygulamalarda normaldir; kodu inceleyebilirsiniz.

---

## 🔨 Geliştirici: Kaynak Koddan Build

```bat
# Gereksinimler: Node.js 18+
git clone https://github.com/Taka-source14/altayvideo
cd altayvideo
build.bat
```

`dist/altayvideo.exe` oluşacaktır.

---

## 🛡️ Gizlilik

Program hiçbir veriyi dışarı göndermez. İnternet bağlantısı yalnızca video indirmek ve (opsiyonel) yt-dlp.exe güncellemek için kullanılır.

---

*Altai Squad tarafından sevgiyle yapılmıştır* 🎬
