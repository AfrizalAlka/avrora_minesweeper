# 🎮 AVRORA MINESWEEPER

Game Minesweeper klasik yang dibuat dengan HTML, CSS, dan JavaScript murni. Dilengkapi dengan fitur-fitur modern untuk pengalaman bermain yang lebih interaktif dan menyenangkan!

![Version](https://img.shields.io/badge/version-1.2-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Fitur Utama

### 🎯 Gameplay Klasik
- **3 Level Preset**: Mudah (8x8), Sedang (12x12), Sulit (16x16)
- **Custom Grid**: Buat ukuran papan sendiri (5x5 hingga 30x30)
- **Auto-Clear**: Otomatis membuka area kosong di sekitar sel dengan angka 0
- **Sistem Flag**: Klik kanan untuk menandai posisi bom
- **Timer Real-time**: Lacak waktu permainan Anda

### 🎨 Tampilan & UX
- **🌗 Dark/Light Mode**: Toggle tema gelap/terang sesuai preferensi
- **Desain Responsif**: Optimal di desktop dan mobile
- **Animasi Smooth**: Transisi dan efek visual yang halus
- **UI Modern**: Interface yang clean dan user-friendly

### 🎵 Audio
- **Sound Effects**: 
  - Klik sel 🖱️
  - Pasang bendera 🚩
  - Buka sel ✨
  - Menang 🎉
  - Kalah 💥
- **Toggle Sound**: Nyalakan/matikan sound kapan saja

### 💾 Sistem Penyimpanan
- **Save/Load Game**: Simpan dan lanjutkan permainan kapan saja
- **Best Score**: Menyimpan waktu terbaik untuk setiap level
- **Persistent Data**: Semua data tersimpan di localStorage browser

### 🏆 Leaderboard
- **Top 10 Ranking**: Untuk setiap level kesulitan
- **Medali**: 🥇 🥈 🥉 untuk top 3
- **History**: Lihat tanggal dan waktu pencapaian

## 🎯 Cara Bermain

### Kontrol Dasar
1. **Klik Kiri** pada sel untuk membuka
2. **Klik Kanan** pada sel untuk memasang bendera 🚩
3. Angka menunjukkan jumlah ranjau di 8 sel sekitarnya
4. Buka semua sel aman untuk menang!

### Tombol Kontrol
- **🎲 Game Baru**: Mulai permainan baru
- **🌗 Dark Mode**: Toggle tema gelap/terang
- **🔊/🔇 Sound**: Nyalakan/matikan sound effect
- **💾 Save**: Simpan permainan saat ini
- **📂 Load**: Muat permainan tersimpan
- **🏆 Leaderboard**: Lihat ranking waktu terbaik

### Tips & Trik
- Mulai dari pojok atau tepi untuk area yang lebih aman
- Gunakan bendera untuk menandai bom yang sudah pasti
- Angka 0 akan membuka area sekitarnya secara otomatis
- Perhatikan pola angka untuk deduksi logis

## 🎲 Level Kesulitan

| Level | Ukuran Grid | Jumlah Bom | Kesulitan |
|-------|-------------|------------|-----------|
| **Mudah** | 8x8 (64 sel) | 10 bom | ⭐ Pemula |
| **Sedang** | 12x12 (144 sel) | 20 bom | ⭐⭐ Menengah |
| **Sulit** | 16x16 (256 sel) | 40 bom | ⭐⭐⭐ Expert |
| **Custom** | 5x5 - 30x30 | 1 - 80% sel | ⚙️ Sesuaikan |

## 🚀 Cara Menjalankan

### Metode 1: Direct Browser
1. Clone atau download repository ini
2. Buka file `index.html` dengan browser
3. Mulai bermain!

### Metode 2: Local Server (Laragon)
```bash
# Letakkan folder di c:\laragon\www\
# Akses melalui browser
http://localhost/avrora_minesweeper
```

### Metode 3: Live Server (VS Code)
1. Install extension "Live Server"
2. Klik kanan pada `index.html`
3. Pilih "Open with Live Server"

## 💻 Teknologi

### Frontend
- **HTML5**: Struktur semantik modern
- **CSS3**: Flexbox, Grid, Animations, Gradients
- **JavaScript ES6+**: Classes, Arrow Functions, LocalStorage

### Features
- **Web Audio API**: Sound effects tanpa file eksternal
- **LocalStorage API**: Persistent data storage
- **CSS Grid**: Layout papan permainan yang responsif
- **CSS Variables**: Dark mode theming
- **Event Delegation**: Optimasi event handling

## 📁 Struktur File

```
avrora_minesweeper/
│
├── index.html          # Struktur HTML utama
├── style.css           # Styling dan dark mode
├── script.js           # Logika game & fitur
└── README.md           # Dokumentasi (file ini)
```

## 🎮 Fitur Teknis

### Game Logic
- Algoritma penempatan bom acak yang seimbang
- Recursive flood-fill untuk auto-clear
- Validasi custom grid size
- Win/lose condition detection

### Data Persistence
```javascript
// Data yang disimpan:
- Best scores (per level)
- Leaderboard entries (top 10)
- Game state (save/load)
- User preferences (dark mode, sound)
```

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🔄 Update Log

### Version 1.2 (Current)
- ✨ Added Dark/Light mode toggle
- 🎵 Implemented sound effects system
- 💾 Added save/load game functionality
- 🏆 Created leaderboard system
- 🎨 Enhanced UI with header controls
- 📱 Improved mobile responsiveness

### Version 1.1
- 🎯 Added custom grid size feature
- 📊 Implemented best score tracking
- ⚙️ Added grid size validation
- 💎 Improved color contrast

### Version 1.0
- 🎮 Core minesweeper gameplay
- 🎲 3 difficulty levels
- ⏱️ Timer system
- 🚩 Flag mechanism
- 🎨 Modern responsive design

## 🤝 Kontribusi

Kontribusi selalu terbuka! Silakan:
1. Fork repository ini
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📝 Lisensi

Project ini bersifat open source dan bebas digunakan untuk pembelajaran dan modifikasi.

**MIT License** - Lihat file LICENSE untuk detail

## 👨‍💻 Developer

Developed with ❤️ by **AfrizalAlka**

## 🙏 Acknowledgments

- Terinspirasi dari game Minesweeper klasik Microsoft
- Sound effects menggunakan Web Audio API
- Icons menggunakan Unicode Emoji

---

**⭐ Jangan lupa beri bintang jika Anda menyukai project ini!**

Selamat bermain dan semoga beruntung! 🎉💣🚩

## 📞 Support

Jika Anda menemukan bug atau punya saran:
- Buka issue di GitHub
- Contact: [Your Contact Info]

**Happy Mining!** 🎮⛏️
