const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const readline = require('readline');
const https = require('https');
const os = require('os');
const ffmpegStatic = require('ffmpeg-static');

let ffprobePath;
try {
    ffprobePath = require('ffprobe-static').path;
} catch (e) {
    ffprobePath = path.join(__dirname, 'node_modules', 'ffprobe-static', 'bin', 'win32', 'x64', 'ffprobe.exe');
}

// ─────────────────────────────────────────────
//  CONFIG
// ─────────────────────────────────────────────
const IS_PKG = typeof process.pkg !== 'undefined';
const APP_DIR = IS_PKG ? path.dirname(process.execPath) : process.cwd();
const BIN_FOLDER = 'yardimci-araclar';
const BIN_DIR = path.join(APP_DIR, BIN_FOLDER);

const C = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    red: '\x1b[31m',
    white: '\x1b[37m',
    bgBlue: '\x1b[44m',
    bgCyan: '\x1b[46m',
};

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────
function cls() { process.stdout.write('\x1Bc'); }

function ask(question) {
    return new Promise(resolve => rl.question(question, resolve));
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function hr(char = '─', len = 60) {
    return C.dim + char.repeat(len) + C.reset;
}

function printHeader() {
    cls();
    console.log(`${C.cyan}${C.bright}`);
    console.log(`  ██╗   ██╗██╗██████╗ ███████╗ ██████╗`);
    console.log(`  ██║   ██║██║██╔══██╗██╔════╝██╔═══██╗`);
    console.log(`  ██║   ██║██║██║  ██║█████╗  ██║   ██║`);
    console.log(`  ╚██╗ ██╔╝██║██║  ██║██╔══╝  ██║   ██║`);
    console.log(`   ╚████╔╝ ██║██████╔╝███████╗╚██████╔╝`);
    console.log(`    ╚═══╝  ╚═╝╚═════╝ ╚══════╝ ╚═════╝`);
    console.log(`${C.reset}${C.blue}${C.bright}`);
    console.log(`  ██████╗  ██████╗ ██╗    ██╗███╗   ██╗██╗      ██████╗  █████╗ ██████╗ `);
    console.log(` ██╔══██╗██╔═══██╗██║    ██║████╗  ██║██║     ██╔═══██╗██╔══██╗██╔══██╗`);
    console.log(` ██║  ██║██║   ██║██║ █╗ ║██║╔██╗ ██║██║     ██║   ██║███████║ ██║  ██║`);
    console.log(` ██║  ██║██║   ██║██║███╗██║██║╚██╗██║██║     ██║   ██║██╔══██║██║  ██║`);
    console.log(` ██████╔╝╚██████╔╝╚███╔███╔╝██║ ╚████║███████╗╚██████╔╝██║  ██║██████╔╝`);
    console.log(` ╚═════╝  ╚═════╝  ╚══╝╚══╝ ╚═╝  ╚═══╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝ `);
    console.log(`${C.reset}`);
    console.log(`  ${C.dim}YouTube • TikTok • Instagram • Twitter • Vimeo • 1000+ Platform${C.reset}`);
    console.log(`  ${C.dim}Powered by yt-dlp + ffmpeg | Altai Squad Edition${C.reset}`);
    console.log(``);
}

// ─────────────────────────────────────────────
//  BINARY MANAGEMENT
// ─────────────────────────────────────────────
function ensureBinDir() {
    if (!fs.existsSync(BIN_DIR)) {
        fs.mkdirSync(BIN_DIR, { recursive: true });
    }
}

function getBinaryPath(fileName, bundledSource) {
    ensureBinDir();
    const localPath = path.join(BIN_DIR, fileName);
    if (!fs.existsSync(localPath) && bundledSource && fs.existsSync(bundledSource)) {
        try {
            fs.copyFileSync(bundledSource, localPath);
        } catch (e) {
            console.error(`${C.red}❌ ${fileName} dosyası hazırlanamadı: ${e.message}${C.reset}`);
        }
    }
    return localPath;
}

function downloadFile(url, destPath) {
    return new Promise((resolve, reject) => {
        // Each call gets its own fresh write stream (handles redirects cleanly)
        const doGet = (u, outputPath) => {
            const file = fs.createWriteStream(outputPath);
            https.get(u, (res) => {
                if (res.statusCode === 301 || res.statusCode === 302) {
                    file.close();
                    fs.unlink(outputPath, () => { });
                    doGet(res.headers.location, outputPath);
                    return;
                }
                if (res.statusCode !== 200) {
                    file.close();
                    reject(new Error(`HTTP ${res.statusCode}`));
                    return;
                }
                const total = parseInt(res.headers['content-length'] || '0');
                let downloaded = 0;
                res.on('data', chunk => {
                    downloaded += chunk.length;
                    file.write(chunk);
                    if (total > 0) {
                        const pct = ((downloaded / total) * 100).toFixed(1);
                        process.stdout.write(`\r  ${C.cyan}⬇  yt-dlp.exe indiriliyor: ${C.bright}${pct}%${C.reset}   `);
                    }
                });
                res.on('end', () => { file.end(); resolve(); });
                res.on('error', (err) => { file.close(); reject(err); });
            }).on('error', (err) => { file.close(); reject(err); });
        };
        doGet(url, destPath);
    });
}

async function ensureYtDlp() {
    const ytDlpPath = path.join(BIN_DIR, 'yt-dlp.exe');
    // Also check bundled yt-dlp (for pkg build)
    const bundledYtDlp = path.join(__dirname, 'yt-dlp.exe');
    if (!fs.existsSync(ytDlpPath)) {
        if (fs.existsSync(bundledYtDlp)) {
            fs.copyFileSync(bundledYtDlp, ytDlpPath);
        } else {
            console.log(`\n  ${C.yellow}⚠  yt-dlp.exe bulunamadı, internetten indiriliyor...${C.reset}`);
            const YT_DLP_URL = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe';
            try {
                await downloadFile(YT_DLP_URL, ytDlpPath);
                console.log(`\n  ${C.green}✅ yt-dlp.exe başarıyla indirildi.${C.reset}\n`);
            } catch (e) {
                console.log(`\n  ${C.red}❌ yt-dlp.exe indirilemedi: ${e.message}${C.reset}`);
                console.log(`  ${C.dim}Lütfen https://github.com/yt-dlp/yt-dlp/releases adresinden yt-dlp.exe'yi indirip`);
                console.log(`  '${BIN_DIR}' klasörüne koyun, ardından programı yeniden başlatın.${C.reset}\n`);
                process.exit(1);
            }
        }
    }
    return ytDlpPath;
}

// ─────────────────────────────────────────────
//  PLATFORM DETECTION
// ─────────────────────────────────────────────
function detectPlatform(url) {
    if (/youtube\.com|youtu\.be/i.test(url)) return '🎥 YouTube';
    if (/tiktok\.com/i.test(url)) return '🎵 TikTok';
    if (/instagram\.com/i.test(url)) return '📷 Instagram';
    if (/twitter\.com|x\.com/i.test(url)) return '🐦 Twitter / X';
    if (/facebook\.com|fb\.watch/i.test(url)) return '👥 Facebook';
    if (/vimeo\.com/i.test(url)) return '🎞  Vimeo';
    if (/dailymotion\.com/i.test(url)) return '📺 Dailymotion';
    if (/reddit\.com/i.test(url)) return '🤖 Reddit';
    if (/twitch\.tv/i.test(url)) return '🎮 Twitch';
    if (/pinterest\.com/i.test(url)) return '📌 Pinterest';
    return '🌐 Web Sitesi';
}

// ─────────────────────────────────────────────
//  MENUS
// ─────────────────────────────────────────────
async function mainMenu() {
    printHeader();
    console.log(`  ${C.bright}Lütfen bir işlem seçin:${C.reset}\n`);
    console.log(`  ${C.green}${C.bright}1)${C.reset}  🎬  Tekli Video İndir`);
    console.log(`  ${C.cyan}${C.bright}2)${C.reset}  📋  Playlist İndir`);
    console.log(`  ${C.blue}${C.bright}3)${C.reset}  🔍  Video Bilgisi Göster`);
    console.log(`  ${C.yellow}${C.bright}4)${C.reset}  🧹  Sistem Temizliği (Uninstall)`);
    console.log(`  ${C.red}${C.bright}5)${C.reset}  🚪  Çıkış\n`);
    console.log(hr());

    const choice = await ask(`\n  ${C.cyan}Seçiminiz (1-5): ${C.reset}`);

    if (choice === '1') await videoDownloadFlow(false);
    else if (choice === '2') await videoDownloadFlow(true);
    else if (choice === '3') await showVideoInfo();
    else if (choice === '4') await handleUninstall();
    else if (choice === '5') { console.log(`\n  ${C.magenta}Güle güle! Altai Squad iyi günler diler. 🎬${C.reset}\n`); process.exit(0); }
    else {
        console.log(`\n  ${C.red}⚠  Geçersiz seçim. Tekrar deneyin.${C.reset}`);
        await sleep(1200);
        await mainMenu();
    }
}

// ─────────────────────────────────────────────
//  FORMAT / QUALITY SELECTION
// ─────────────────────────────────────────────
async function selectFormatAndQuality() {
    console.log(`\n  ${C.bright}Konteyner Format Seçin:${C.reset}`);
    console.log(`  ${C.green}1)${C.reset}  MP4  ${C.dim}(Evrensel, önerilen)${C.reset}`);
    console.log(`  ${C.cyan}2)${C.reset}  WebM ${C.dim}(YouTube yerli format, küçük boyut)${C.reset}`);
    console.log(`  ${C.blue}3)${C.reset}  MKV  ${C.dim}(Altyazı ve çok ses desteği)${C.reset}`);

    const fChoice = await ask(`\n  ${C.cyan}Format (1-3) [Varsayılan: 1]: ${C.reset}`);
    const formatMap = { '1': 'mp4', '2': 'webm', '3': 'mkv' };
    const container = formatMap[fChoice] || 'mp4';

    console.log(`\n  ${C.bright}Video Kalitesi Seçin:${C.reset}`);
    console.log(`  ${C.green}1)${C.reset}  360p  ${C.dim}(Hızlı indirme, küçük dosya)${C.reset}`);
    console.log(`  ${C.green}2)${C.reset}  480p  ${C.dim}(Standart kalite)${C.reset}`);
    console.log(`  ${C.yellow}3)${C.reset}  720p  ${C.dim}(HD - önerilen)${C.reset}`);
    console.log(`  ${C.cyan}4)${C.reset}  1080p ${C.dim}(Full HD)${C.reset}`);
    console.log(`  ${C.blue}5)${C.reset}  1440p ${C.dim}(2K)${C.reset}`);
    console.log(`  ${C.magenta}6)${C.reset}  2160p ${C.dim}(4K - varsa)${C.reset}`);
    console.log(`  ${C.bright}7)${C.reset}  En İyi ${C.dim}(Mevcut en yüksek kalite)${C.reset}`);

    const qChoice = await ask(`\n  ${C.cyan}Kalite (1-7) [Varsayılan: 3]: ${C.reset}`);
    // Return numeric height (null = no limit) instead of raw format string
    const heightMap = {
        '1': 360,
        '2': 480,
        '3': 720,
        '4': 1080,
        '5': 1440,
        '6': 2160,
        '7': null,  // best available
    };
    const height = heightMap[qChoice] !== undefined ? heightMap[qChoice] : 720;

    return { container, height };
}

// Build a codec-compatible yt-dlp format string for the chosen container.
// Strategy: giderek gevşeyen fallback zinciri — her adımda hem video hem ses
// garantilenmeye çalışılır. Hiçbir codec kısıtlaması uymasa bile son fallback
// her zaman `bestvideo+bestaudio` veya `best` ile tamamlanır.
function buildFormatString(height, container) {
    const h = height ? `[height<=${height}]` : '';

    if (container === 'mp4') {
        // MP4 için en uyumlu codec H.264 (avc1)'dir. 
        // Eğer kaynakta yoksa bile --recode-video ile dönüştüreceğiz.
        return [
            // 1. Tercih: Native H.264 video + m4a ses
            `bestvideo[ext=mp4]${h}[vcodec^=avc]+bestaudio[ext=m4a]`,
            // 2. Tercih: Herhangi bir H.264 video + herhangi bir ses
            `bestvideo${h}[vcodec^=avc]+bestaudio`,
            // 3. Tercih: Herhangi bir mp4 video + herhangi bir ses
            `bestvideo[ext=mp4]${h}+bestaudio`,
            // 4. Fallback: En iyi video + en iyi ses (recode-video ile mp4'e çevrilecek)
            `bestvideo${h}+bestaudio`,
            `best${h}`,
            `best`,
        ].join('/');
    }

    if (container === 'webm') {
        // WebM için vp9/av1 + opus tercih edilir ama zorunlu değil.
        // Opus yoksa ffmpeg webm container'a yazarken sesi dönüştürür.
        return [
            // 1. Tercih: native webm video + webm/opus ses
            `bestvideo[ext=webm]${h}[vcodec^=vp]+bestaudio[ext=webm]`,
            // 2. Tercih: herhangi bir webm video + herhangi bir ses
            `bestvideo[ext=webm]${h}+bestaudio`,
            // 3. Tercih: vp9/av1 video + herhangi bir ses
            `bestvideo[vcodec^=vp]${h}+bestaudio`,
            // 4. Tercih: av1 video + herhangi bir ses
            `bestvideo[vcodec^=av01]${h}+bestaudio`,
            // 5. Tercih: kalite sınırlı herhangi bir video + herhangi bir ses
            `bestvideo${h}+bestaudio`,
            // 6. Son çare: hepsi birleşik akış
            `best${h}`,
            `best`,
        ].join('/');
    }

    // MKV: en esnek container — codec kısıtlaması yok, kalite önce gelir
    return [
        `bestvideo${h}+bestaudio`,
        `best${h}`,
        `best`,
    ].join('/');
}

async function selectOutputDir() {
    console.log(`\n  ${C.bright}İndirme Konumu:${C.reset}`);
    console.log(`  ${C.green}1)${C.reset}  Program yanı ${C.dim}(${APP_DIR})${C.reset}`);
    console.log(`  ${C.cyan}2)${C.reset}  Masaüstü`);
    console.log(`  ${C.blue}3)${C.reset}  İndirilenler klasörü`);
    console.log(`  ${C.yellow}4)${C.reset}  Özel konum gir`);

    const dChoice = await ask(`\n  ${C.cyan}Konum (1-4) [Varsayılan: 1]: ${C.reset}`);

    if (dChoice === '2') {
        const desktop = path.join(os.homedir(), 'Desktop');
        return desktop;
    } else if (dChoice === '3') {
        const downloads = path.join(os.homedir(), 'Downloads');
        return downloads;
    } else if (dChoice === '4') {
        const custom = await ask(`\n  ${C.cyan}Klasör yolu girin: ${C.reset}`);
        if (custom.trim()) return custom.trim();
    }
    return APP_DIR;
}

// ─────────────────────────────────────────────
//  VIDEO DOWNLOAD FLOW
// ─────────────────────────────────────────────
async function videoDownloadFlow(isPlaylist) {
    printHeader();
    const label = isPlaylist ? 'Playlist' : 'Tekli Video';
    console.log(`  ${C.bright}${C.cyan}--- ${label} İndirme Paneli ---${C.reset}\n`);

    const url = await ask(`  ${C.blue}URL girin: ${C.reset}`);
    if (!url || !url.includes('http')) {
        console.log(`\n  ${C.red}❌ Geçerli bir URL girin! (http... ile başlamalı)${C.reset}`);
        await sleep(2000);
        return videoDownloadFlow(isPlaylist);
    }

    const platform = detectPlatform(url);
    console.log(`\n  ${C.green}✅ Platform tespit edildi: ${C.bright}${platform}${C.reset}`);

    const { container, height } = await selectFormatAndQuality();
    const outputDir = await selectOutputDir();

    await runDownload({ url, container, height, outputDir, isPlaylist });
}

function formatProgress(output) {
    // Match yt-dlp progress lines: [download]  45.2% of   12.34MiB at   2.30MiB/s ETA 00:03
    const m = output.match(/\[download\]\s+([\d.]+)%(?:\s+of\s+[\S]+)?(?:\s+at\s+([\S]+))?(?:\s+ETA\s+([\S]+))?/);
    if (m) {
        const pct = m[1].padStart(6);
        const speed = m[2] ? `  ${C.yellow}⚡ ${m[2]}/s${C.reset}` : '';
        const eta = m[3] ? `  ${C.blue}⏱  ETA ${m[3]}${C.reset}` : '';
        return `\r  ${C.cyan}🚀 İndiriliyor: ${C.bright}${pct}%${C.reset}${speed}${eta}      `;
    }
    // Merger / postprocess
    if (/\[Merger\]|\[ffmpeg\]|\[ExtractAudio\]/i.test(output)) {
        return `\r  ${C.magenta}⚙  Dönüştürülüyor...${C.reset}                               `;
    }
    return null;
}

async function runDownload({ url, container, height, outputDir, isPlaylist }) {
    const ytDlpPath = await ensureYtDlp();
    getBinaryPath('ffmpeg.exe', ffmpegStatic);   // ensure ffmpeg is in BIN_DIR
    getBinaryPath('ffprobe.exe', ffprobePath);   // ensure ffprobe is in BIN_DIR
    const outputTemplate = path.join(outputDir, '%(title)s.%(ext)s');

    // Build a codec-compatible format string based on the chosen container
    const formatStr = buildFormatString(height, container);

    const args = [
        '--newline',
        '--progress',
        '-o', outputTemplate,
        '--ffmpeg-location', BIN_DIR,
        '--merge-output-format', container,
        '-f', formatStr,
        '--no-mtime',
        '--windows-filenames',
        // Birden fazla ses/video akışının doğru seçilmesi için:
        '--audio-multistreams',
        '--video-multistreams',
        // Takılmaları önlemek için akıcı başlatma ve ses senkronizasyonu:
        '--ffmpeg-params', '-movflags +faststart -async 1',
        // Container uyumluluğu için gerekirse yeniden kodla (kasmayı önler):
        '--recode-video', container,
        // Ağ hataları için otomatik yeniden deneme:
        '--retries', '5',
        '--fragment-retries', '5',
    ];

    // MP4 seçildiğinde ses codec'ini AAC'ye zorla
    if (container === 'mp4') {
        args.push('--postprocessor-args', 'ffmpeg:-c:a aac');
    }

    if (!isPlaylist) args.push('--no-playlist');
    else args.push('--yes-playlist');

    args.push(url);

    console.log(`\n  ${C.dim}${hr()}${C.reset}`);
    console.log(`  ${C.yellow}⚙  İndirme başlatılıyor, lütfen bekleyin...${C.reset}\n`);

    return new Promise((resolve) => {
        const child = spawn(ytDlpPath, args, { windowsHide: true });

        let lastWasProgress = false;
        let errorLines = [];

        child.stdout.on('data', (data) => {
            const lines = data.toString().split('\n');
            lines.forEach(line => {
                const prog = formatProgress(line);
                if (prog) {
                    process.stdout.write(prog);
                    lastWasProgress = true;
                } else if (line.trim()) {
                    if (lastWasProgress) { process.stdout.write('\n'); lastWasProgress = false; }
                    // Show useful info lines (title, destination, etc.)
                    if (/\[download\] Destination:|^\[youtube\]|^\[info\]|\[Merger\]|\[ffmpeg\]/i.test(line)) {
                        console.log(`  ${C.dim}${line.trim()}${C.reset}`);
                    }
                }
            });
        });

        child.stderr.on('data', (data) => {
            const msg = data.toString().trim();
            if (msg.includes('ERROR:')) errorLines.push(msg);
        });

        child.on('close', async (code) => {
            if (lastWasProgress) process.stdout.write('\n');
            console.log();

            if (code === 0) {
                console.log(`  ${C.green}${C.bright}✅ BAŞARILI! Video '${outputDir}' klasörüne kaydedildi.${C.reset}`);
            } else {
                console.log(`  ${C.red}${C.bright}❌ HATA: İndirme başarısız oldu (Kod: ${code})${C.reset}`);
                if (errorLines.length) {
                    console.log(`  ${C.red}${errorLines.slice(-3).join('\n  ')}${C.reset}`);
                }
                console.log(`\n  ${C.dim}İpuçları:${C.reset}`);
                console.log(`  ${C.dim}• URL'nin doğru olduğundan emin olun${C.reset}`);
                console.log(`  ${C.dim}• Özel/üye-yalnızca videolar indirilemeyebilir${C.reset}`);
                console.log(`  ${C.dim}• İnternet bağlantınızı kontrol edin${C.reset}`);
            }

            console.log(`\n  ${C.blue}Ana menüye dönülüyor... (4 sn)${C.reset}`);
            await sleep(4000);
            await mainMenu();
            resolve();
        });
    });
}

// ─────────────────────────────────────────────
//  VIDEO INFO
// ─────────────────────────────────────────────
async function showVideoInfo() {
    printHeader();
    console.log(`  ${C.bright}${C.blue}--- Video Bilgisi ---${C.reset}\n`);

    const url = await ask(`  ${C.blue}URL girin: ${C.reset}`);
    if (!url || !url.includes('http')) {
        console.log(`\n  ${C.red}❌ Geçerli bir URL girin!${C.reset}`);
        await sleep(2000);
        return showVideoInfo();
    }

    const ytDlpPath = await ensureYtDlp();
    console.log(`\n  ${C.yellow}⚙  Bilgi alınıyor...${C.reset}\n`);

    return new Promise((resolve) => {
        const args = ['--dump-json', '--no-playlist', '--no-download-archive', url];
        const child = spawn(ytDlpPath, args, { windowsHide: true });

        let jsonStr = '';
        let errStr = '';

        child.stdout.on('data', d => { jsonStr += d.toString(); });
        child.stderr.on('data', d => { errStr += d.toString(); });

        child.on('close', async (code) => {
            if (code === 0) {
                try {
                    const info = JSON.parse(jsonStr.trim().split('\n')[0]);
                    const dur = info.duration ? formatDuration(info.duration) : 'N/A';
                    const views = info.view_count ? Number(info.view_count).toLocaleString('tr-TR') : 'N/A';
                    const likes = info.like_count ? Number(info.like_count).toLocaleString('tr-TR') : 'N/A';
                    const upload = info.upload_date ? `${info.upload_date.substring(0, 4)}-${info.upload_date.substring(4, 6)}-${info.upload_date.substring(6, 8)}` : 'N/A';

                    console.log(hr());
                    console.log(`  ${C.bright}${C.cyan}📹 Başlık:    ${C.reset}${info.title || 'N/A'}`);
                    console.log(`  ${C.bright}${C.green}📺 Kanal:     ${C.reset}${info.channel || info.uploader || 'N/A'}`);
                    console.log(`  ${C.bright}${C.yellow}⏱  Süre:      ${C.reset}${dur}`);
                    console.log(`  ${C.bright}${C.blue}📅 Tarih:     ${C.reset}${upload}`);
                    console.log(`  ${C.bright}${C.magenta}👁  İzlenme:  ${C.reset}${views}`);
                    console.log(`  ${C.bright}${C.cyan}👍 Beğeni:   ${C.reset}${likes}`);

                    // Available formats
                    if (info.formats && info.formats.length) {
                        const videoFormats = info.formats
                            .filter(f => f.height && f.vcodec !== 'none')
                            .map(f => `${f.height}p`)
                            .filter((v, i, a) => a.indexOf(v) === i)
                            .sort((a, b) => parseInt(a) - parseInt(b));
                        if (videoFormats.length) {
                            console.log(`  ${C.bright}${C.green}🎞  Kaliteler: ${C.reset}${videoFormats.join(' · ')}`);
                        }
                    }
                    console.log(hr());
                } catch (e) {
                    console.log(`  ${C.red}⚠  JSON ayrıştırma hatası: ${e.message}${C.reset}`);
                }
            } else {
                console.log(`  ${C.red}❌ Bilgi alınamadı. URL'yi kontrol edin.${C.reset}`);
                if (errStr.includes('ERROR:')) {
                    const errLine = errStr.split('\n').find(l => l.includes('ERROR:'));
                    if (errLine) console.log(`  ${C.dim}${errLine}${C.reset}`);
                }
            }

            await ask(`\n  ${C.cyan}Ana menüye dönmek için Enter'a basın... ${C.reset}`);
            await mainMenu();
            resolve();
        });
    });
}

function formatDuration(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}s ${m}d ${s}sn`;
    if (m > 0) return `${m}d ${s}sn`;
    return `${s}sn`;
}

// ─────────────────────────────────────────────
//  UNINSTALL
// ─────────────────────────────────────────────
async function handleUninstall() {
    printHeader();
    console.log(`  ${C.red}${C.bright}!!! DİKKAT !!!${C.reset}\n`);
    console.log(`  Bu işlem aşağıdakileri kalıcı olarak SİLECEKTİR:\n`);
    console.log(`  ${C.dim}•${C.reset} ${C.yellow}'${BIN_FOLDER}'${C.reset} klasörü ve içindeki tüm araçlar (ffmpeg, yt-dlp vb.)`);
    console.log(`  ${C.dim}•${C.reset} Program dizinindeki .mp4, .webm, .mkv, .avi, .mov dosyaları`);
    console.log(`  ${C.dim}•${C.reset} Eski sürümden kalma root dizinindeki binary dosyaları\n`);

    const answer = await ask(`  ${C.yellow}Devam etmek istiyor musunuz? (e/h): ${C.reset}`);
    if (answer.toLowerCase() !== 'e') {
        return mainMenu();
    }

    try {
        // Delete yardimci-araclar
        if (fs.existsSync(BIN_DIR)) {
            fs.rmSync(BIN_DIR, { recursive: true, force: true });
            console.log(`\n  ${C.green}✅ '${BIN_FOLDER}' klasörü silindi.${C.reset}`);
        }

        // Legacy root cleanup
        ['ffmpeg.exe', 'ffprobe.exe', 'yt-dlp.exe'].forEach(bin => {
            const rootBin = path.join(APP_DIR, bin);
            if (fs.existsSync(rootBin)) fs.unlinkSync(rootBin);
        });

        // Delete video files
        const videoExts = ['.mp4', '.webm', '.mkv', '.avi', '.mov', '.flv', '.m4v', '.ts', '.part'];
        const files = fs.readdirSync(APP_DIR);
        let deleted = 0;
        files.forEach(file => {
            const ext = path.extname(file).toLowerCase();
            if (videoExts.includes(ext)) {
                fs.unlinkSync(path.join(APP_DIR, file));
                deleted++;
            }
        });

        if (deleted > 0) {
            console.log(`  ${C.green}✅ ${deleted} video dosyası silindi.${C.reset}`);
        }

        console.log(`\n  ${C.green}${C.bright}✅ Temizlik tamamlandı! Geriye kalan .exe dosyasını silerek tamamen kaldırabilirsiniz.${C.reset}`);
        console.log(`  ${C.blue}5 saniye içinde kapanıyor...${C.reset}`);
        await sleep(5000);
        process.exit(0);
    } catch (e) {
        console.log(`\n  ${C.red}❌ Temizlik sırasında hata: ${e.message}${C.reset}`);
        await sleep(3000);
        await mainMenu();
    }
}

// ─────────────────────────────────────────────
//  BOOT
// ─────────────────────────────────────────────
async function boot() {
    cls();
    process.stdout.write(`\n  ${C.yellow}⚙  Sistem dosyaları kontrol ediliyor...${C.reset}\n`);

    ensureBinDir();
    getBinaryPath('ffmpeg.exe', ffmpegStatic);
    getBinaryPath('ffprobe.exe', ffprobePath);

    // Check yt-dlp — copy bundled version if available (lazy download on first use)
    const ytDlpInBin = path.join(BIN_DIR, 'yt-dlp.exe');
    const ytDlpBundled = path.join(__dirname, 'yt-dlp.exe');
    if (!fs.existsSync(ytDlpInBin) && fs.existsSync(ytDlpBundled)) {
        fs.copyFileSync(ytDlpBundled, ytDlpInBin);
    }

    await mainMenu();
}

boot().catch(err => {
    console.error(`\n${C.red}Kritik hata: ${err.message}${C.reset}`);
    process.exit(1);
});
