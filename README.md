# 🎮 AVRORA MINESWEEPER

Game Minesweeper klasik yang dibuat dengan HTML, CSS, dan JavaScript modern. Dilengkapi dengan Bootstrap 5, dark mode, sistem notifikasi, dan fitur-fitur interaktif untuk pengalaman bermain yang maksimal!

![Version](https://img.shields.io/badge/version-1.4-blue.svg)
![Bootstrap](https://img.shields.io/badge/bootstrap-5.3.3-purple.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Fitur Utama

### 🎯 Gameplay Klasik
- **3 Level Preset**: Mudah (8x8), Sedang (12x12), Sulit (16x16)
- **Custom Grid**: Buat ukuran papan sendiri (5x5 hingga 30x30)
- **Auto-Clear**: Otomatis membuka area kosong di sekitar sel dengan angka 0
- **Sistem Flag**: Klik kanan untuk menandai posisi bom
- **Timer Real-time**: Lacak waktu permainan Anda
- **🔒 Progress Protection**: Validasi konfirmasi saat ganti level/load game

### 🎨 Tampilan & UX Modern
- **🌗 Dark/Light Mode**: Toggle tema gelap/terang dengan animasi smooth
- **Bootstrap 5.3.3**: Framework modern untuk UI yang responsif
- **Background System**: Gambar background dinamis untuk light/dark mode
- **Glassmorphism**: Efek backdrop blur untuk UI yang elegan
- **Color Scheme**: 
  - Light Mode: Purple gradient (#667eea → #764ba2)
  - Dark Mode: Indigo/Purple (#6366f1 → #8b5cf6)
- **High Contrast Board**: Border tebal 3px dan shadow untuk visibilitas maksimal
- **Animasi Smooth**: Transisi dan efek visual yang halus
- **Desain Responsif**: Optimal di desktop dan mobile (<768px adaptive)
- **Icon System**: Bootstrap Icons 1.11.3 dengan efek interaktif

### 🔔 Sistem Notifikasi
- **Toast Notifications**: Notifikasi modern yang slide dari kanan atas
  - ✅ Success (hijau): Save/Load berhasil
  - ❌ Error (merah): Pesan kesalahan
  - ℹ️ Info (biru): Informasi umum
- **Modal Konfirmasi**: Popup konfirmasi dengan icon warning
  - Konfirmasi ganti level saat game berjalan
  - Konfirmasi load game saat game berjalan
  - Konfirmasi custom settings saat game berjalan
  - Konfirmasi game baru saat game berjalan
- **Result Modal**: Popup animasi kemenangan/kekalahan
  - Icon bouncing dengan animasi pulse
  - Statistik lengkap (waktu, level, best score)
  - Indikator rekor baru 🏆
  - Tombol "Main Lagi"

### 🎵 Audio
- **Sound Effects**: 
  - Klik sel 🖱️
  - Pasang bendera 🚩
  - Buka sel ✨
  - Menang 🎉
  - Kalah 💥
- **Toggle Sound**: Nyalakan/matikan sound dengan icon interaktif
- **Web Audio API**: Sound generator tanpa file eksternal

### 💾 Sistem Penyimpanan
- **Save/Load Game**: Simpan dan lanjutkan permainan kapan saja
  - Icon: 💾 Floppy disk untuk save
  - Icon: 📂 Folder terbuka untuk load
  - Notifikasi toast saat berhasil
  - Validasi konfirmasi jika game sedang berjalan
- **Best Score**: Menyimpan waktu terbaik untuk setiap level
- **Persistent Data**: Semua data tersimpan di localStorage browser
- **Progress Protection**: Tidak bisa kehilangan progress secara tidak sengaja

### 🏆 Leaderboard
- **Top 10 Ranking**: Untuk setiap level kesulitan (easy, medium, hard)
- **Medali**: 🥇 🥈 🥉 untuk top 3
- **History**: Lihat tanggal dan waktu pencapaian
- **Bootstrap Tabs**: Navigasi smooth antar level
- **Bootstrap Modal**: Fullscreen leaderboard view

## 🎯 Cara Bermain

### Kontrol Dasar
1. **Klik Kiri** pada sel untuk membuka
2. **Klik Kanan** pada sel untuk memasang bendera 🚩
3. Angka menunjukkan jumlah ranjau di 8 sel sekitarnya
4. Buka semua sel aman untuk menang!

### Tombol Kontrol Header
- **🎲 GAME BARU**: Mulai permainan baru (konfirmasi jika game berjalan)
- **🌗 Dark Mode**: Toggle tema gelap/terang (icon berubah: 🌙/☀️)
- **🔊 Sound**: Toggle sound effect (icon berubah: 🔊/🔇)
- **💾 Save**: Simpan permainan saat ini (floppy disk icon)
- **📂 Load**: Muat permainan tersimpan (folder icon)
- **🏆 Leaderboard**: Lihat ranking waktu terbaik

### Tips & Trik
- Mulai dari pojok atau tepi untuk area yang lebih aman
- Gunakan bendera untuk menandai bom yang sudah pasti
- Angka 0 akan membuka area sekitarnya secara otomatis
- Perhatikan pola angka untuk deduksi logis
- Save game Anda sebelum mencoba area berisiko tinggi!

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

### Frontend Framework & Libraries
- **Bootstrap 5.3.3**: Framework CSS modern untuk layout & components
- **Bootstrap Icons 1.11.3**: Icon font library untuk UI controls
- **HTML5**: Struktur semantik modern dengan modal & toast components
- **CSS3**: Variables, Flexbox, Grid, Animations, Gradients, Backdrop-filter
- **JavaScript ES6+**: Classes, Async/Await, Promises, Arrow Functions, LocalStorage

### UI/UX Features
- **Glassmorphism**: Backdrop blur effects untuk modern look
- **Toast Notifications**: Non-blocking notifications dengan auto-hide
- **Modal System**: 3 modals (Result, Leaderboard, Confirmation)
- **Responsive Design**: Mobile-first approach dengan breakpoint 768px
- **Dark Mode**: CSS variables untuk dynamic theming
- **Icon Animations**: Hover effects, rotation, scale transforms

### Core Technologies
- **Web Audio API**: Sound effects tanpa file eksternal
- **LocalStorage API**: Persistent data storage
- **Bootstrap Modal API**: Programmatic modal control
- **Bootstrap Toast API**: Toast notification system
- **CSS Grid**: Layout papan permainan yang responsif
- **Event Delegation**: Optimasi event handling

## 📁 Struktur File

```
avrora_minesweeper/
│
├── index.html          # HTML dengan Bootstrap 5 structure
├── style.css           # Custom styling + Bootstrap integration (888 baris)
├── script.js           # Game logic + Bootstrap API integration (838 baris)
├── assets/
│   ├── README.md      # Panduan background images
│   ├── bg-light.jpg   # Background untuk light mode (opsional)
│   └── bg-dark.jpg    # Background untuk dark mode (opsional)
└── README.md          # Dokumentasi lengkap (file ini)
```

## 🎮 Fitur Teknis

### Game Logic
- Algoritma penempatan bom acak yang seimbang
- Recursive flood-fill untuk auto-clear
- Validasi custom grid size (5-30)
- Validasi maksimal bom (80% dari total sel)
- Win/lose condition detection
- Progress protection dengan confirmation modal

### UI Components
```javascript
// Bootstrap Components:
- Cards: Game container dengan glassmorphism
- Modals: Result, Leaderboard, Confirmation
- Toasts: Success, Error, Info notifications
- Buttons: Primary, Secondary, Icon buttons
- Nav Pills: Leaderboard tabs
- Forms: Custom grid settings
```

### Data Persistence
```javascript
// Data yang disimpan di localStorage:
- bestScores: { easy, medium, hard, custom }
- leaderboard: { easy: [], medium: [], hard: [] }
- savedGame: { board, rows, cols, mines, flags, time, level }
- soundEnabled: boolean
- darkMode: boolean
```

### Notification System
```javascript
// Toast Types:
- showToast(message, 'success')  // Green toast
- showToast(message, 'error')    // Red toast
- showToast(message, 'info')     // Blue toast

// Modal Confirmation:
- showConfirm(message)           // Returns Promise<boolean>
```

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🔄 Update Log

### Version 1.4 (Current - Bootstrap Edition) 🎉
- ✨ **Bootstrap 5.3.3 Migration**: Complete UI overhaul
- 🎨 **Modern Design System**: Glassmorphism + gradient backgrounds
- 🔔 **Toast Notifications**: Success/Error/Info messages
- 💬 **Confirmation Modal**: Better UX untuk validasi
- 🎯 **Result Modal**: Animated win/lose popup dengan statistik
- 🌈 **Dark Mode Redesign**: Indigo/purple color scheme
- 🔒 **Progress Protection**: Validasi konfirmasi untuk prevent data loss
- 🎨 **High Contrast Board**: 3px borders untuk visibility
- 💾 **Better Icons**: Floppy disk (save) & folder (load)
- 🎭 **Icon Animations**: 44px buttons dengan hover effects
- 📱 **Enhanced Responsive**: Mobile optimizations
- 🐛 **Bug Fixes**: Fixed level change confirmation flow

### Version 1.3
- 🎨 Improved UI contrast and colors
- 🔧 Fixed header overlap issues
- 🐛 Fixed difficulty button click problems
- 🎨 Enhanced dark mode styling

### Version 1.2
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
- **Bootstrap 5.3.3** untuk framework UI modern
- **Bootstrap Icons 1.11.3** untuk icon system
- Sound effects menggunakan Web Audio API
- Glassmorphism design trend untuk modern UI
- Color schemes inspired by modern web design

## 🎨 Design Credits

### Color Palette
- **Light Mode**: Purple gradient (#667eea → #764ba2)
- **Dark Mode**: Indigo/Purple (#6366f1 → #8b5cf6 → #1e1b4b)
- **Success**: Emerald green (#10b981)
- **Error**: Red (#ef4444)
- **Warning**: Orange (#f59e0b)

### Typography
- **Font Family**: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif
- **Icon Set**: Bootstrap Icons 1.11.3

---

**⭐ Jangan lupa beri bintang jika Anda menyukai project ini!**

Selamat bermain dan semoga beruntung! 🎉💣🚩

## 📞 Support

Jika Anda menemukan bug atau punya saran:
- Buka issue di GitHub repository
- Contact: AfrizalAlka

## 🔮 Future Features (Roadmap)

- [ ] Multiplayer mode via WebSocket
- [ ] Achievement system dengan badges
- [ ] Daily challenges
- [ ] Theme customizer
- [ ] Export/import leaderboard
- [ ] PWA (Progressive Web App) support
- [ ] Touch gestures untuk mobile
- [ ] Hint system untuk pemula
- [ ] Replay system
- [ ] Social sharing untuk scores

**Happy Mining!** 🎮⛏️💎
