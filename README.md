# ðŸŽ® AVRORA MINESWEEPER

Game Minesweeper klasik yang dibuat dengan HTML, CSS, dan JavaScript modern. Dilengkapi dengan Bootstrap 5, dark mode, sistem notifikasi, dan fitur-fitur interaktif untuk pengalaman bermain yang maksimal!

![Version](https://img.shields.io/badge/version-1.4-blue.svg)
![Bootstrap](https://img.shields.io/badge/bootstrap-5.3.3-purple.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## âœ¨ Fitur Utama

### 🎯 Gameplay Klasik
- **3 Level Preset**: Mudah (8x8), Sedang (12x12), Sulit (16x16)
- **Custom Grid**: Buat ukuran papan sendiri (5x5 hingga 30x30)
- **Auto-Clear**: Otomatis membuka area kosong di sekitar sel dengan angka 0
- **⚡ Chord Reveal**: Klik angka yang terbuka untuk auto-reveal sel sekitarnya
- **❓ Question Mark Mode**: Tandai sel yang masih ragu dengan `❓`
  - Cycle klik kanan: 🚩 Flag → ❓ Question → ⬜ Empty
  - Membantu strategi dan deduksi logis
- **Sistem Flag**: Klik kanan untuk menandai posisi bom
- **Timer Real-time**: Lacak waktu permainan Anda
- **🔒 Progress Protection**: Validasi konfirmasi saat ganti level/load game

### ðŸŽ¨ Tampilan & UX Modern
- **ðŸŒ— Dark/Light Mode**: Toggle tema gelap/terang dengan animasi smooth
- **Bootstrap 5.3.3**: Framework modern untuk UI yang responsif
- **Background System**: Gambar background dinamis untuk light/dark mode dengan cross-fade transition
- **Glassmorphism**: Efek backdrop blur untuk UI yang elegan
- **Color Scheme**: 
  - Light Mode: Purple gradient (#667eea â†’ #764ba2)
  - Dark Mode: Indigo/Purple (#6366f1 â†’ #8b5cf6)
- **High Contrast Board**: Border tebal 3px dan shadow untuk visibilitas maksimal
- **ðŸŽ­ Animasi Interaktif**: 
  - Smooth cross-fade background (0.6s ease-in-out)
  - Chord reveal pulse animation
  - Staggered cell reveal effect
  - Hover glow pada angka yang bisa di-chord
  - Explode animation saat kalah
- **Desain Responsif**: Optimal di desktop dan mobile (<768px adaptive)
- **Icon System**: Bootstrap Icons 1.11.3 dengan efek interaktif

### ðŸ”” Sistem Notifikasi
- **Toast Notifications**: Notifikasi modern yang slide dari kanan atas
  - âœ… Success (hijau): Save/Load berhasil
  - âŒ Error (merah): Pesan kesalahan
  - â„¹ï¸ Info (biru): Informasi umum
- **Modal Konfirmasi**: Popup konfirmasi dengan icon warning
  - Konfirmasi ganti level saat game berjalan
  - Konfirmasi load game saat game berjalan
  - Konfirmasi custom settings saat game berjalan
  - Konfirmasi game baru saat game berjalan
- **Result Modal**: Popup animasi kemenangan/kekalahan
  - Icon bouncing dengan animasi pulse
  - Statistik lengkap (waktu, level, best score)
  - Indikator rekor baru ðŸ†
  - Tombol "Main Lagi"

### ðŸŽµ Audio
- **Sound Effects**: 
  - Klik sel ðŸ–±ï¸
  - Pasang bendera ðŸš©
  - Buka sel âœ¨
  - Menang ðŸŽ‰
  - Kalah ðŸ’¥
- **Toggle Sound**: Nyalakan/matikan sound dengan icon interaktif
- **Web Audio API**: Sound generator tanpa file eksternal

### ðŸ’¾ Sistem Penyimpanan
- **Save/Load Game**: Simpan dan lanjutkan permainan kapan saja
  - Icon: ðŸ’¾ Floppy disk untuk save
  - Icon: ðŸ“‚ Folder terbuka untuk load
  - Notifikasi toast saat berhasil
  - Validasi konfirmasi jika game sedang berjalan
- **Best Score**: Menyimpan waktu terbaik untuk setiap level
- **Persistent Data**: Semua data tersimpan di localStorage browser
- **Progress Protection**: Tidak bisa kehilangan progress secara tidak sengaja

### ðŸ† Leaderboard
- **Top 10 Ranking**: Untuk setiap level kesulitan (easy, medium, hard)
- **Medali**: ðŸ¥‡ ðŸ¥ˆ ðŸ¥‰ untuk top 3
- **History**: Lihat tanggal dan waktu pencapaian
- **Bootstrap Tabs**: Navigasi smooth antar level
- **Bootstrap Modal**: Fullscreen leaderboard view

## ðŸŽ¯ Cara Bermain

### Kontrol Dasar
1. **Klik Kiri** pada sel untuk membuka
2. **Klik Kanan** untuk cycle marking:
   - Klik 1x: 🚩 Flag (tandai sebagai bom)
   - Klik 2x: ❓ Question (masih ragu)
   - Klik 3x: ⬜ Empty (hapus marking)
3. **⚡ Chord Reveal**: Klik pada angka yang sudah terbuka untuk auto-reveal
   - Pastikan jumlah bendera di sekitar angka sudah sesuai
   - Sel sekitar yang tidak ada bendera akan terbuka otomatis
   - Animasi staggered reveal untuk visual feedback
4. Angka menunjukkan jumlah ranjau di 8 sel sekitarnya
5. Buka semua sel aman untuk menang!

### Tombol Kontrol Header
- **ðŸŽ² GAME BARU**: Mulai permainan baru (konfirmasi jika game berjalan)
- **ðŸŒ— Dark Mode**: Toggle tema gelap/terang (icon berubah: ðŸŒ™/â˜€ï¸)
- **ðŸ"Š Sound**: Toggle sound effect (icon berubah: ðŸ"Š/ðŸ"‡)
- **ðŸ'¾ Save**: Simpan permainan saat ini (floppy disk icon)
- **ðŸ"‚ Load**: Muat permainan tersimpan (folder icon)
- **ðŸ† Leaderboard**: Lihat ranking waktu terbaik
- **⏯️ Pause**: Jeda permainan (hanya muncul saat game berjalan)

### Tips & Trik
- Mulai dari pojok atau tepi untuk area yang lebih aman
- **🚩 Gunakan flag** untuk menandai bom yang sudah pasti
- **❓ Gunakan question mark** untuk menandai sel yang masih ragu
- **⚡ Gunakan chord reveal** untuk membuka sel lebih cepat!
- Angka 0 akan membuka area sekitarnya secara otomatis
- Perhatikan pola angka untuk deduksi logis
- Save game Anda sebelum mencoba area berisiko tinggi!
- Hover pada angka untuk melihat glow effect (indikasi bisa di-chord)

## ðŸŽ² Level Kesulitan

| Level | Ukuran Grid | Jumlah Bom | Kesulitan |
|-------|-------------|------------|-----------|
| **Mudah** | 8x8 (64 sel) | 10 bom | â­ Pemula |
| **Sedang** | 12x12 (144 sel) | 20 bom | â­â­ Menengah |
| **Sulit** | 16x16 (256 sel) | 40 bom | â­â­â­ Expert |
| **Custom** | 5x5 - 30x30 | 1 - 80% sel | âš™ï¸ Sesuaikan |

## ðŸš€ Cara Menjalankan

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

## ðŸ’» Teknologi

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

## ðŸ“ Struktur File

```
avrora_minesweeper/
â”‚
â”œâ”€â”€ index.html          # HTML dengan Bootstrap 5 structure
â”œâ”€â”€ style.css           # Custom styling + Bootstrap integration (1070+ baris)
â”œâ”€â”€ script.js           # Game logic + Bootstrap API integration (893+ baris)
â”œâ”€â”€ assets/
â”‚   â”œâ”€â”€ README.md      # Panduan background images
â”‚   â”œâ”€â”€ img/
â”‚   â”‚   â”œâ”€â”€ light-bg.png   # Background untuk light mode
â”‚   â”‚   â””â”€â”€ dark-bg.png    # Background untuk dark mode
â””â”€â”€ README.md          # Dokumentasi lengkap (file ini)
```

## ðŸŽ® Fitur Teknis

### Game Logic
- Algoritma penempatan bom acak yang seimbang
- Recursive flood-fill untuk auto-clear
- **âš¡ Chord reveal algorithm**: Smart adjacent cell opening
- Flag counting system untuk chord validation
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
- âœ… Chrome 90+
- âœ… Firefox 88+
- âœ… Safari 14+
- âœ… Edge 90+
- âœ… Mobile browsers (iOS Safari, Chrome Mobile)

## ðŸ"„ Update Log

### Version 1.5 (Current - Power User Edition) 🎮
- ⏯️ **Pause/Resume Game**: Jeda permainan kapan saja
  - Tombol pause dinamis (hanya muncul saat game berjalan)
  - Timer otomatis berhenti saat pause
  - Board di-blur dengan overlay "PAUSED"
  - Tombol Resume besar di tengah overlay
  - Animasi smooth fadeIn & slideUp
  - Sound effect untuk pause/resume
  - Prevent interaksi board saat pause
  - Auto-hide pause button saat game over
- 🎨 **Enhanced UX**: Better game flow control
- 🐛 **Bug Prevention**: Tidak bisa click board saat pause

### Version 1.4 (Bootstrap Edition) 🎉
- ✨ **Bootstrap 5.3.3 Migration**: Complete UI overhaul
- 🎨 **Modern Design System**: Glassmorphism + gradient backgrounds
- 🌈 **Background Cross-fade**: Smooth 0.6s transition antara light/dark mode
- ⚡ **Chord Reveal Feature**: Klik angka terbuka untuk auto-reveal sel sekitar
- ❓ **Question Mark Mode**: Cycle 3-state marking (🚩 → ❓ → ⬜)
  - Tandai sel yang masih ragu dengan question mark
  - Blue gradient styling dengan pulse animation
  - Sound effect berbeda untuk setiap state
- 🎭 **Advanced Animations**: 
  - Pulse animation pada sel yang di-chord
  - Staggered reveal effect (30ms delay antar sel)
  - Hover glow effect untuk visual feedback
  - Smooth scale & opacity transitions
  - Question mark pulse animation
- 🔔 **Toast Notifications**: Success/Error/Info messages
- 💬 **Confirmation Modal**: Better UX untuk validasi
- 🎯 **Result Modal**: Animated win/lose popup dengan statistik
- 🌗 **Dark Mode Redesign**: Indigo/purple color scheme
- 🔒 **Progress Protection**: Validasi konfirmasi untuk prevent data loss
- 🎨 **High Contrast Board**: 3px borders untuk visibility
- 💾 **Better Icons**: Floppy disk (save) & folder (load)
- 🎭 **Icon Animations**: 44px buttons dengan hover effects
- 📱 **Enhanced Responsive**: Mobile optimizations
- 🐛 **Bug Fixes**: Fixed level change confirmation flow

### Version 1.3
- ðŸŽ¨ Improved UI contrast and colors
- ðŸ”§ Fixed header overlap issues
- ðŸ› Fixed difficulty button click problems
- ðŸŽ¨ Enhanced dark mode styling

### Version 1.2
- âœ¨ Added Dark/Light mode toggle
- ðŸŽµ Implemented sound effects system
- ðŸ’¾ Added save/load game functionality
- ðŸ† Created leaderboard system
- ðŸŽ¨ Enhanced UI with header controls
- ðŸ“± Improved mobile responsiveness

### Version 1.1
- ðŸŽ¯ Added custom grid size feature
- ðŸ“Š Implemented best score tracking
- âš™ï¸ Added grid size validation
- ðŸ’Ž Improved color contrast

### Version 1.0
- ðŸŽ® Core minesweeper gameplay
- ðŸŽ² 3 difficulty levels
- â±ï¸ Timer system
- ðŸš© Flag mechanism
- ðŸŽ¨ Modern responsive design

## ðŸ¤ Kontribusi

Kontribusi selalu terbuka! Silakan:
1. Fork repository ini
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## ðŸ“ Lisensi

Project ini bersifat open source dan bebas digunakan untuk pembelajaran dan modifikasi.

**MIT License** - Lihat file LICENSE untuk detail

## ðŸ‘¨â€ðŸ’» Developer

Developed with â¤ï¸ by **AfrizalAlka**

## ðŸ™ Acknowledgments

- Terinspirasi dari game Minesweeper klasik Microsoft
- **Bootstrap 5.3.3** untuk framework UI modern
- **Bootstrap Icons 1.11.3** untuk icon system
- Sound effects menggunakan Web Audio API
- Glassmorphism design trend untuk modern UI
- Color schemes inspired by modern web design

## ðŸŽ¨ Design Credits

### Color Palette
- **Light Mode**: Purple gradient (#667eea â†’ #764ba2)
- **Dark Mode**: Indigo/Purple (#6366f1 â†’ #8b5cf6 â†’ #1e1b4b)
- **Success**: Emerald green (#10b981)
- **Error**: Red (#ef4444)
- **Warning**: Orange (#f59e0b)

### Typography
- **Font Family**: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif
- **Icon Set**: Bootstrap Icons 1.11.3

---

**â­ Jangan lupa beri bintang jika Anda menyukai project ini!**

Selamat bermain dan semoga beruntung! ðŸŽ‰ðŸ’£ðŸš©

## ðŸ“ž Support

Jika Anda menemukan bug atau punya saran:
- Buka issue di GitHub repository
- Contact: AfrizalAlka

## ðŸ”® Future Features (Roadmap)

- [ ] Middle-click support untuk chord reveal
- [ ] Visual tutorial untuk chord reveal
- [ ] Multiplayer mode via WebSocket
- [ ] Achievement system dengan badges
- [ ] Daily challenges
- [ ] Theme customizer
- [ ] Export/import leaderboard
- [ ] PWA (Progressive Web App) support
- [ ] Touch gestures untuk mobile (long-press untuk flag)
- [ ] Hint system untuk pemula
- [ ] Replay system dengan step-by-step
- [ ] Social sharing untuk scores
- [ ] Customizable sound effects
- [ ] Animation speed settings

**Happy Mining!** ðŸŽ®â›ï¸ðŸ’Ž


