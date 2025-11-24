class Minesweeper {
    constructor() {
        this.board = [];
        this.rows = 8;
        this.cols = 8;
        this.minesCount = 10;
        this.flagsCount = 0;
        this.revealedCount = 0;
        this.gameOver = false;
        this.gameStarted = false;
        this.timer = 0;
        this.timerInterval = null;
        this.currentLevel = 'easy';
        this.isPaused = false;
        this.hintsRemaining = 3;
        this.hintsUsed = false;

        // Game features settings
        this.featureSettings = {
            pauseEnabled: this.loadSetting('pauseEnabled', true),
            hintEnabled: this.loadSetting('hintEnabled', true),
            questionEnabled: this.loadSetting('questionEnabled', true)
        };

        // Statistics
        this.statistics = this.loadStatistics();
        this.currentGameStartTime = null;
        this.currentWinStreak = 0;

        // Replay System
        this.replayRecording = [];
        this.isRecording = false;
        this.currentReplay = null;
        this.replayPlayback = {
            isPlaying: false,
            currentMoveIndex: 0,
            speed: 1,
            interval: null
        };

        // Sound settings
        this.soundEnabled = this.loadSetting('soundEnabled', true);

        // Dark mode
        this.darkMode = this.loadSetting('darkMode', false);

        // Leaderboard
        this.leaderboard = this.loadLeaderboard();

        // Load best scores from localStorage
        this.bestScores = this.loadBestScores();

        // Initialize sounds
        this.initSounds();

        this.init();
    }

    initSounds() {
        // Create audio context for sound effects
        this.sounds = {
            click: this.createBeep(800, 0.1, 'sine'),
            flag: this.createBeep(600, 0.1, 'square'),
            question: this.createBeep(700, 0.12, 'sine'),
            reveal: this.createBeep(400, 0.15, 'triangle'),
            win: this.createBeep(1000, 0.3, 'sine'),
            lose: this.createBeep(200, 0.5, 'sawtooth')
        };
    }

    createBeep(frequency, duration, type = 'sine') {
        return () => {
            if (!this.soundEnabled) return;

            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = type;

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        };
    }

    playSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }

    loadSetting(key, defaultValue) {
        const saved = localStorage.getItem(`minesweeper-${key}`);
        return saved !== null ? JSON.parse(saved) : defaultValue;
    }

    saveSetting(key, value) {
        localStorage.setItem(`minesweeper-${key}`, JSON.stringify(value));
    }

    loadLeaderboard() {
        const saved = localStorage.getItem('minesweeper-leaderboard');
        return saved ? JSON.parse(saved) : {
            easy: [],
            medium: [],
            hard: []
        };
    }

    saveLeaderboard() {
        localStorage.setItem('minesweeper-leaderboard', JSON.stringify(this.leaderboard));
    }

    addToLeaderboard(level, time) {
        if (!this.leaderboard[level]) {
            this.leaderboard[level] = [];
        }

        const entry = {
            time: time,
            date: new Date().toLocaleDateString('id-ID'),
            timestamp: Date.now()
        };

        this.leaderboard[level].push(entry);
        this.leaderboard[level].sort((a, b) => a.time - b.time);
        this.leaderboard[level] = this.leaderboard[level].slice(0, 10); // Keep top 10

        this.saveLeaderboard();
    }

    showToast(message, type = 'info') {
        const toastEl = document.getElementById('notification-toast');
        const toastBody = toastEl.querySelector('.toast-message');
        const toastIcon = toastEl.querySelector('.toast-icon');

        // Set message
        toastBody.textContent = message;

        // Remove all type classes
        toastEl.classList.remove('toast-success', 'toast-error', 'toast-info');

        // Set icon and type class
        if (type === 'success') {
            toastEl.classList.add('toast-success');
            toastIcon.className = 'toast-icon bi bi-check-circle-fill';
        } else if (type === 'error') {
            toastEl.classList.add('toast-error');
            toastIcon.className = 'toast-icon bi bi-x-circle-fill';
        } else {
            toastEl.classList.add('toast-info');
            toastIcon.className = 'toast-icon bi bi-info-circle-fill';
        }

        // Show toast
        const toast = new bootstrap.Toast(toastEl, {
            autohide: true,
            delay: 3000
        });
        toast.show();
    }

    showConfirm(message) {
        return new Promise((resolve) => {
            const modal = document.getElementById('confirm-modal');
            const messageEl = document.getElementById('confirm-message');
            const okBtn = document.getElementById('confirm-ok-btn');

            // Set message
            messageEl.textContent = message;

            // Show modal
            const bsModal = new bootstrap.Modal(modal);
            bsModal.show();

            // Handle OK button
            const handleOk = () => {
                bsModal.hide();
                okBtn.removeEventListener('click', handleOk);
                modal.removeEventListener('hidden.bs.modal', handleCancel);
                resolve(true);
            };

            // Handle Cancel (modal close)
            const handleCancel = () => {
                okBtn.removeEventListener('click', handleOk);
                modal.removeEventListener('hidden.bs.modal', handleCancel);
                resolve(false);
            };

            okBtn.addEventListener('click', handleOk);
            modal.addEventListener('hidden.bs.modal', handleCancel);
        });
    }

    saveGame() {
        if (!this.gameStarted || this.gameOver) {
            this.showToast('Tidak ada game aktif untuk disimpan!', 'error');
            return;
        }

        const gameState = {
            board: this.board,
            rows: this.rows,
            cols: this.cols,
            minesCount: this.minesCount,
            flagsCount: this.flagsCount,
            revealedCount: this.revealedCount,
            timer: this.timer,
            currentLevel: this.currentLevel,
            timestamp: Date.now()
        };

        localStorage.setItem('minesweeper-saved-game', JSON.stringify(gameState));
        this.showToast('Game berhasil disimpan!', 'success');
        this.playSound('flag');
    }

    async loadGame() {
        // Validasi jika game sedang berjalan
        if (this.gameStarted && !this.gameOver) {
            const confirmed = await this.showConfirm('Game sedang berjalan! Progress akan hilang jika Anda load game tersimpan. Lanjutkan?');
            if (!confirmed) {
                return;
            }
        }

        const saved = localStorage.getItem('minesweeper-saved-game');
        if (!saved) {
            this.showToast('Tidak ada game tersimpan!', 'error');
            return;
        }

        const gameState = JSON.parse(saved);

        // IMPORTANT: Stop any existing timer first to prevent multiple timers
        this.stopTimer();

        // Restore game state
        this.board = gameState.board;
        this.rows = gameState.rows;
        this.cols = gameState.cols;
        this.minesCount = gameState.minesCount;
        this.flagsCount = gameState.flagsCount;
        this.revealedCount = gameState.revealedCount;
        this.timer = gameState.timer;
        this.currentLevel = gameState.currentLevel;
        this.gameStarted = true;
        this.gameOver = false;

        // Re-render board
        this.renderBoard();
        this.restoreBoardState();

        // Start timer (now safely after stopping old one)
        this.startTimer();

        // Update UI
        this.updateMinesCount();
        this.updateFlagsCount();
        this.updateTimer();
        this.displayBestScore();

        this.showToast('Game berhasil dimuat!', 'success');
        this.playSound('reveal');
    }

    restoreBoardState() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const cell = this.board[i][j];
                const cellElement = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);

                if (cell.revealed) {
                    cellElement.classList.add('revealed');
                    if (cell.mine) {
                        cellElement.classList.add('mine');
                        cellElement.textContent = '💣';
                    } else if (cell.adjacentMines > 0) {
                        cellElement.textContent = cell.adjacentMines;
                        cellElement.classList.add(`number-${cell.adjacentMines}`);
                    }
                }

                if (cell.flagged) {
                    cellElement.classList.add('flagged');
                    cellElement.textContent = '🚩';
                }

                if (cell.questioned) {
                    cellElement.classList.add('questioned');
                    cellElement.textContent = '❓';
                }
            }
        }
    }

    toggleDarkMode() {
        this.darkMode = !this.darkMode;
        document.body.classList.toggle('dark-mode', this.darkMode);
        this.saveSetting('darkMode', this.darkMode);
        this.updateDarkModeIcon();
        this.playSound('click');
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        this.saveSetting('soundEnabled', this.soundEnabled);
        this.updateSoundIcon();

        if (this.soundEnabled) {
            this.playSound('click');
        }
    }

    showLeaderboard() {
        const modal = document.getElementById('leaderboard-modal');
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
        this.displayLeaderboardTab('easy');
        this.playSound('click');
    }

    displayLeaderboardTab(level) {
        const content = document.getElementById('leaderboard-content');
        const entries = this.leaderboard[level] || [];

        if (entries.length === 0) {
            content.innerHTML = '<p style="text-align: center; color: #999;">Belum ada data</p>';
            return;
        }

        content.innerHTML = entries.map((entry, index) => {
            const rankClass = index < 3 ? `rank-${index + 1}` : '';
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;

            return `
                <div class="leaderboard-item ${rankClass}">
                    <div class="leaderboard-rank">${medal}</div>
                    <div class="leaderboard-info">
                        <div class="leaderboard-date">${entry.date}</div>
                    </div>
                    <div class="leaderboard-time">${entry.time}s</div>
                </div>
            `;
        }).join('');
    }

    loadStatistics() {
        const saved = localStorage.getItem('minesweeper-statistics');
        return saved ? JSON.parse(saved) : {
            totalGames: 0,
            totalWins: 0,
            totalLosses: 0,
            totalPlaytime: 0,
            fastestWin: null,
            totalHintsUsed: 0,
            currentWinStreak: 0,
            longestWinStreak: 0,
            perfectGames: 0,
            totalMinesFound: 0,
            byDifficulty: {
                easy: { games: 0, wins: 0, losses: 0, totalTime: 0 },
                medium: { games: 0, wins: 0, losses: 0, totalTime: 0 },
                hard: { games: 0, wins: 0, losses: 0, totalTime: 0 },
                custom: { games: 0, wins: 0, losses: 0, totalTime: 0 }
            }
        };
    }

    saveStatistics() {
        localStorage.setItem('minesweeper-statistics', JSON.stringify(this.statistics));
    }

    updateStatistics(won) {
        // Update overall stats
        this.statistics.totalGames++;
        this.statistics.totalPlaytime += this.timer;

        if (won) {
            this.statistics.totalWins++;

            // Update fastest win
            if (this.statistics.fastestWin === null || this.timer < this.statistics.fastestWin) {
                this.statistics.fastestWin = this.timer;
            }

            // Update win streak
            this.statistics.currentWinStreak++;
            if (this.statistics.currentWinStreak > this.statistics.longestWinStreak) {
                this.statistics.longestWinStreak = this.statistics.currentWinStreak;
            }

            // Check if perfect game (no hints used)
            if (!this.hintsUsed) {
                this.statistics.perfectGames++;
            }

            // Count mines found
            this.statistics.totalMinesFound += this.minesCount;
        } else {
            this.statistics.totalLosses++;
            this.statistics.currentWinStreak = 0;
        }

        // Update hints used
        const hintsUsedThisGame = 3 - this.hintsRemaining;
        this.statistics.totalHintsUsed += hintsUsedThisGame;

        // Update difficulty-specific stats
        const difficulty = this.currentLevel;
        if (this.statistics.byDifficulty[difficulty]) {
            this.statistics.byDifficulty[difficulty].games++;
            this.statistics.byDifficulty[difficulty].totalTime += this.timer;
            if (won) {
                this.statistics.byDifficulty[difficulty].wins++;
            } else {
                this.statistics.byDifficulty[difficulty].losses++;
            }
        }

        this.saveStatistics();
    }

    showStatistics() {
        const modal = document.getElementById('statistics-modal');
        const bsModal = new bootstrap.Modal(modal);

        // Update overall stats
        document.getElementById('total-games').textContent = this.statistics.totalGames;
        document.getElementById('total-wins').textContent = this.statistics.totalWins;
        document.getElementById('total-losses').textContent = this.statistics.totalLosses;

        const winRate = this.statistics.totalGames > 0
            ? ((this.statistics.totalWins / this.statistics.totalGames) * 100).toFixed(1)
            : 0;
        document.getElementById('win-rate').textContent = winRate + '%';

        // Update time stats
        document.getElementById('fastest-win').textContent = this.statistics.fastestWin !== null
            ? this.statistics.fastestWin + 's'
            : '-';

        const avgTime = this.statistics.totalGames > 0
            ? Math.round(this.statistics.totalPlaytime / this.statistics.totalGames)
            : 0;
        document.getElementById('average-time').textContent = avgTime > 0 ? avgTime + 's' : '-';

        const totalMinutes = Math.floor(this.statistics.totalPlaytime / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        const remainingMinutes = totalMinutes % 60;
        const playtimeText = totalHours > 0
            ? `${totalHours}h ${remainingMinutes}m`
            : totalMinutes > 0 ? `${totalMinutes}m` : '-';
        document.getElementById('total-playtime').textContent = playtimeText;

        // Update achievements
        document.getElementById('hints-used').textContent = this.statistics.totalHintsUsed;
        document.getElementById('win-streak').textContent = this.statistics.longestWinStreak;
        document.getElementById('perfect-games').textContent = this.statistics.perfectGames;
        document.getElementById('total-mines').textContent = this.statistics.totalMinesFound;

        // Update difficulty stats
        const difficultyStatsContainer = document.getElementById('difficulty-stats');
        const difficulties = [
            { key: 'easy', label: 'Easy', icon: '😊' },
            { key: 'medium', label: 'Medium', icon: '😐' },
            { key: 'hard', label: 'Hard', icon: '😤' },
            { key: 'custom', label: 'Custom', icon: '⚙️' }
        ];

        difficultyStatsContainer.innerHTML = difficulties.map(diff => {
            const stats = this.statistics.byDifficulty[diff.key];
            const winRate = stats.games > 0 ? ((stats.wins / stats.games) * 100).toFixed(1) : 0;
            const avgTime = stats.games > 0 ? Math.round(stats.totalTime / stats.games) : 0;

            return `
                <div class="difficulty-stat-item">
                    <div class="difficulty-stat-header">
                        <span class="difficulty-icon">${diff.icon}</span>
                        <span class="difficulty-name">${diff.label}</span>
                    </div>
                    <div class="difficulty-stat-values">
                        <div class="difficulty-stat-value">
                            <small>Games:</small>
                            <strong>${stats.games}</strong>
                        </div>
                        <div class="difficulty-stat-value">
                            <small>Wins:</small>
                            <strong>${stats.wins}</strong>
                        </div>
                        <div class="difficulty-stat-value">
                            <small>Win Rate:</small>
                            <strong>${winRate}%</strong>
                        </div>
                        <div class="difficulty-stat-value">
                            <small>Avg Time:</small>
                            <strong>${avgTime > 0 ? avgTime + 's' : '-'}</strong>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        bsModal.show();
        this.playSound('click');
    }

    resetStatistics() {
        if (confirm('Yakin ingin mereset semua statistik? Aksi ini tidak dapat dibatalkan!')) {
            this.statistics = {
                totalGames: 0,
                totalWins: 0,
                totalLosses: 0,
                totalPlaytime: 0,
                fastestWin: null,
                totalHintsUsed: 0,
                currentWinStreak: 0,
                longestWinStreak: 0,
                perfectGames: 0,
                totalMinesFound: 0,
                byDifficulty: {
                    easy: { games: 0, wins: 0, losses: 0, totalTime: 0 },
                    medium: { games: 0, wins: 0, losses: 0, totalTime: 0 },
                    hard: { games: 0, wins: 0, losses: 0, totalTime: 0 },
                    custom: { games: 0, wins: 0, losses: 0, totalTime: 0 }
                }
            };
            this.saveStatistics();
            this.showStatistics(); // Refresh display
            this.showToast('✅ Statistik telah direset', 'success');
        }
    }

    // ============================================
    // REPLAY SYSTEM
    // ============================================

    recordReplayMetadata() {
        // Create a copy of board data for replay
        const boardData = [];
        for (let i = 0; i < this.rows; i++) {
            boardData[i] = [];
            for (let j = 0; j < this.cols; j++) {
                boardData[i][j] = {
                    mine: this.board[i][j].mine,
                    adjacentMines: this.board[i][j].adjacentMines
                };
            }
        }

        this.currentReplay = {
            version: '1.0',
            date: new Date().toISOString(),
            difficulty: this.currentLevel,
            rows: this.rows,
            cols: this.cols,
            minesCount: this.minesCount,
            boardData: boardData,
            moves: [],
            result: null,
            finalTime: 0,
            hintsUsed: 0
        };
    }

    recordMove(type, row, col) {
        if (!this.currentReplay) return;

        this.currentReplay.moves.push({
            type: type,        // 'reveal' or 'flag'
            row: row,
            col: col,
            timestamp: Date.now(),
            gameTime: this.timer
        });
    }

    stopRecording(won) {
        this.isRecording = false;

        if (this.currentReplay) {
            this.currentReplay.result = won ? 'win' : 'loss';
            this.currentReplay.finalTime = this.timer;
            this.currentReplay.hintsUsed = 3 - this.hintsRemaining;

            // Replay button is now shown in the result modal
        }
    }

    showReplayModal() {
        if (!this.currentReplay || !this.currentReplay.moves.length) {
            this.showToast('❌ Tidak ada replay tersedia', 'error');
            return;
        }

        const modal = document.getElementById('replay-modal');
        const bsModal = new bootstrap.Modal(modal);

        // Update replay info
        document.getElementById('replay-difficulty').textContent = this.currentReplay.difficulty.toUpperCase();
        document.getElementById('replay-result').textContent = this.currentReplay.result === 'win' ? '🏆 WIN' : '💥 LOSS';
        document.getElementById('replay-time').textContent = this.currentReplay.finalTime + 's';
        document.getElementById('replay-moves').textContent = this.currentReplay.moves.length;

        // Setup playback controls
        this.setupReplayControls();

        // Initialize replay board
        this.initReplayBoard();

        bsModal.show();
        this.playSound('click');
    }

    setupReplayControls() {
        const slider = document.getElementById('replay-slider');
        const playBtn = document.getElementById('replay-play');
        const prevBtn = document.getElementById('replay-prev');
        const nextBtn = document.getElementById('replay-next');
        const firstBtn = document.getElementById('replay-first');
        const lastBtn = document.getElementById('replay-last');
        const speedSelect = document.getElementById('replay-speed-select');
        const exportBtn = document.getElementById('export-replay-btn');
        const importBtn = document.getElementById('import-replay-btn');
        const fileInput = document.getElementById('replay-file-input');

        const totalMoves = this.currentReplay.moves.length;
        slider.max = totalMoves;
        slider.value = 0;
        slider.disabled = false;
        document.getElementById('total-moves').textContent = totalMoves;
        document.getElementById('current-move').textContent = 0;

        // Enable buttons
        playBtn.disabled = false;
        prevBtn.disabled = false;
        nextBtn.disabled = false;
        firstBtn.disabled = false;
        lastBtn.disabled = false;

        // Remove old event listeners by cloning
        const newPlayBtn = playBtn.cloneNode(true);
        playBtn.parentNode.replaceChild(newPlayBtn, playBtn);
        const newPrevBtn = prevBtn.cloneNode(true);
        prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
        const newNextBtn = nextBtn.cloneNode(true);
        nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
        const newFirstBtn = firstBtn.cloneNode(true);
        firstBtn.parentNode.replaceChild(newFirstBtn, firstBtn);
        const newLastBtn = lastBtn.cloneNode(true);
        lastBtn.parentNode.replaceChild(newLastBtn, lastBtn);
        const newSlider = slider.cloneNode(true);
        slider.parentNode.replaceChild(newSlider, slider);

        // Play/Pause
        newPlayBtn.addEventListener('click', () => this.toggleReplayPlayback());

        // Previous
        newPrevBtn.addEventListener('click', () => {
            this.stopReplayPlayback();
            if (this.replayPlayback.currentMoveIndex > 0) {
                this.replayPlayback.currentMoveIndex--;
                this.renderReplayMove(this.replayPlayback.currentMoveIndex);
            }
        });

        // Next
        newNextBtn.addEventListener('click', () => {
            this.stopReplayPlayback();
            if (this.replayPlayback.currentMoveIndex < totalMoves) {
                this.replayPlayback.currentMoveIndex++;
                this.renderReplayMove(this.replayPlayback.currentMoveIndex);
            }
        });

        // First
        newFirstBtn.addEventListener('click', () => {
            this.stopReplayPlayback();
            this.replayPlayback.currentMoveIndex = 0;
            this.renderReplayMove(0);
        });

        // Last
        newLastBtn.addEventListener('click', () => {
            this.stopReplayPlayback();
            this.replayPlayback.currentMoveIndex = totalMoves;
            this.renderReplayMove(totalMoves);
        });

        // Slider
        newSlider.addEventListener('input', (e) => {
            this.stopReplayPlayback();
            this.replayPlayback.currentMoveIndex = parseInt(e.target.value);
            this.renderReplayMove(this.replayPlayback.currentMoveIndex);
        });

        // Speed
        speedSelect.addEventListener('change', (e) => {
            this.replayPlayback.speed = parseFloat(e.target.value);
        });

        // Export
        exportBtn.addEventListener('click', () => this.exportReplay());

        // Import
        importBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => this.importReplay(e));

        // Reset playback state
        this.replayPlayback.currentMoveIndex = 0;
        this.replayPlayback.isPlaying = false;
    }

    initReplayBoard() {
        const container = document.getElementById('replay-board');
        container.innerHTML = '';
        container.className = 'replay-board-grid';

        // Adjust grid size
        const cellSize = Math.min(30, 400 / Math.max(this.currentReplay.rows, this.currentReplay.cols));
        container.style.gridTemplateColumns = `repeat(${this.currentReplay.cols}, ${cellSize}px)`;

        // Create empty board
        for (let i = 0; i < this.currentReplay.rows; i++) {
            for (let j = 0; j < this.currentReplay.cols; j++) {
                const cell = document.createElement('div');
                cell.className = 'replay-cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.style.width = cellSize + 'px';
                cell.style.height = cellSize + 'px';
                container.appendChild(cell);
            }
        }
    }

    renderReplayMove(moveIndex) {
        // Reset board
        const cells = document.querySelectorAll('.replay-cell');
        cells.forEach(cell => {
            cell.className = 'replay-cell';
            cell.textContent = '';
        });

        // Track revealed and flagged cells
        const revealedCells = new Set();
        const flaggedCells = new Set();

        // Render all moves up to current index
        for (let i = 0; i < moveIndex && i < this.currentReplay.moves.length; i++) {
            const move = this.currentReplay.moves[i];
            const cellKey = `${move.row}-${move.col}`;

            if (move.type === 'reveal') {
                revealedCells.add(cellKey);
            } else if (move.type === 'flag') {
                if (flaggedCells.has(cellKey)) {
                    flaggedCells.delete(cellKey);
                } else {
                    flaggedCells.add(cellKey);
                }
            }
        }

        // Apply visual states
        cells.forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            const cellKey = `${row}-${col}`;
            const boardCell = this.currentReplay.boardData[row][col];

            if (revealedCells.has(cellKey)) {
                cell.classList.add('revealed');
                if (boardCell.mine) {
                    cell.classList.add('mine');
                    cell.textContent = '💣';
                } else if (boardCell.adjacentMines > 0) {
                    cell.textContent = boardCell.adjacentMines;
                    cell.classList.add(`number-${boardCell.adjacentMines}`);
                }
            } else if (flaggedCells.has(cellKey)) {
                cell.classList.add('flagged');
                cell.textContent = '🚩';
            }
        });

        // Update UI
        document.getElementById('replay-slider').value = moveIndex;
        document.getElementById('current-move').textContent = moveIndex;
    }

    toggleReplayPlayback() {
        if (this.replayPlayback.isPlaying) {
            this.stopReplayPlayback();
        } else {
            this.startReplayPlayback();
        }
    }

    startReplayPlayback() {
        this.replayPlayback.isPlaying = true;
        const playBtn = document.getElementById('replay-play');
        playBtn.innerHTML = '<i class=\"bi bi-pause-fill\"></i>';

        const baseSpeed = 500; // ms between moves
        const interval = baseSpeed / this.replayPlayback.speed;

        this.replayPlayback.interval = setInterval(() => {
            if (this.replayPlayback.currentMoveIndex >= this.currentReplay.moves.length) {
                this.stopReplayPlayback();
                return;
            }

            this.replayPlayback.currentMoveIndex++;
            this.renderReplayMove(this.replayPlayback.currentMoveIndex);
        }, interval);
    }

    stopReplayPlayback() {
        this.replayPlayback.isPlaying = false;
        const playBtn = document.getElementById('replay-play');
        if (playBtn) {
            playBtn.innerHTML = '<i class=\"bi bi-play-fill\"></i>';
        }

        if (this.replayPlayback.interval) {
            clearInterval(this.replayPlayback.interval);
            this.replayPlayback.interval = null;
        }
    }

    exportReplay() {
        if (!this.currentReplay) {
            this.showToast('❌ Tidak ada replay untuk di-export', 'error');
            return;
        }

        const replayData = JSON.stringify(this.currentReplay, null, 2);
        const blob = new Blob([replayData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `minesweeper-replay-${this.currentReplay.difficulty}-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showToast('✅ Replay berhasil di-export!', 'success');
    }

    importReplay(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const replayData = JSON.parse(e.target.result);

                // Validate replay data
                if (!replayData.version || !replayData.moves || !Array.isArray(replayData.moves)) {
                    throw new Error('Invalid replay format');
                }

                this.currentReplay = replayData;
                this.showToast('✅ Replay berhasil di-import!', 'success');

                // Close and reopen modal to refresh
                const modal = bootstrap.Modal.getInstance(document.getElementById('replay-modal'));
                if (modal) modal.hide();

                setTimeout(() => this.showReplayModal(), 300);
            } catch (error) {
                this.showToast('❌ File replay tidak valid!', 'error');
                console.error('Import replay error:', error);
            }
        };

        reader.readAsText(file);
        event.target.value = ''; // Reset input
    }

    loadBestScores() {
        const saved = localStorage.getItem('minesweeper-best-scores');
        return saved ? JSON.parse(saved) : {
            easy: null,
            medium: null,
            hard: null,
            custom: null
        };
    }

    saveBestScores() {
        localStorage.setItem('minesweeper-best-scores', JSON.stringify(this.bestScores));
    }

    updateBestScore() {
        // Don't update best score if hints were used
        if (this.hintsUsed) {
            this.displayBestScore();
            return;
        }

        const currentBest = this.bestScores[this.currentLevel];
        if (currentBest === null || this.timer < currentBest) {
            this.bestScores[this.currentLevel] = this.timer;
            this.saveBestScores();
        }
        this.displayBestScore();
    }

    displayBestScore() {
        const bestScore = this.bestScores[this.currentLevel];
        document.getElementById('best-score').textContent = bestScore !== null ? `${bestScore}s` : '-';
    }

    init() {
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        this.setupSettingsListeners();
        this.createBoard();

        // Apply dark mode if enabled
        if (this.darkMode) {
            document.body.classList.add('dark-mode');
            this.updateDarkModeIcon();
        }

        // Update sound button icon
        this.updateSoundIcon();
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ignore if typing in input field
            if (e.target.tagName === 'INPUT') {
                return;
            }

            // Ignore if modal is open (except for ESC)
            const modalOpen = document.querySelector('.modal.show');
            if (modalOpen && e.key !== 'Escape') {
                return;
            }

            const key = e.key.toLowerCase();

            switch (key) {
                case 'n':
                    e.preventDefault();
                    this.handleNewGame();
                    this.showToast('⌨️ Keyboard: New Game (N)', 'info');
                    break;

                case 'r':
                    e.preventDefault();
                    this.handleNewGame();
                    this.showToast('⌨️ Keyboard: Restart (R)', 'info');
                    break;

                case 's':
                    e.preventDefault();
                    this.saveGame();
                    break;

                case 'l':
                    e.preventDefault();
                    this.loadGame();
                    break;

                case 'h':
                    e.preventDefault();
                    if (this.gameStarted && !this.gameOver) {
                        this.useHint();
                    }
                    break;

                case ' ':
                    e.preventDefault();
                    if (this.isPaused) {
                        this.resumeGame();
                        this.showToast('⌨️ Keyboard: Resume (Space)', 'info');
                    } else if (this.gameStarted && !this.gameOver) {
                        this.pauseGame();
                        this.showToast('⌨️ Keyboard: Pause (Space)', 'info');
                    }
                    break;

                case 'escape':
                    // Close any open modal
                    if (modalOpen) {
                        const modal = bootstrap.Modal.getInstance(modalOpen);
                        if (modal) modal.hide();
                    }
                    // Or resume if paused
                    else if (this.isPaused) {
                        this.resumeGame();
                        this.showToast('⌨️ Keyboard: Resume (ESC)', 'info');
                    }
                    break;

                case 'd':
                    e.preventDefault();
                    this.toggleDarkMode();
                    break;

                case 'm':
                    e.preventDefault();
                    this.toggleSound();
                    break;

                case 'b':
                    e.preventDefault();
                    this.showLeaderboard();
                    this.showToast('⌨️ Keyboard: Leaderboard (B)', 'info');
                    break;

                case 't':
                    e.preventDefault();
                    this.showStatistics();
                    this.showToast('⌨️ Keyboard: Statistics (T)', 'info');
                    break;

                case 'v':
                    e.preventDefault();
                    if (this.currentReplay && this.currentReplay.moves.length > 0) {
                        this.showReplayModal();
                        this.showToast('⌨️ Keyboard: View Replay (V)', 'info');
                    }
                    break;

                case 'g':
                    e.preventDefault();
                    this.showSettings();
                    this.showToast('⌨️ Keyboard: Settings (G)', 'info');
                    break;

                case '?':
                    e.preventDefault();
                    this.showKeyboardHelp();
                    break;
            }
        });
    }

    async handleNewGame() {
        // Validasi jika game sedang berjalan
        if (this.gameStarted && !this.gameOver) {
            const confirmed = await this.showConfirm('Game sedang berjalan! Progress akan hilang jika Anda mulai game baru. Lanjutkan?');
            if (!confirmed) {
                return;
            }
        }
        this.resetGame();
    }

    showKeyboardHelp() {
        const helpMessage = `
            <div style="text-align: left;">
                <h5 class="mb-3"><i class="bi bi-keyboard"></i> Keyboard Shortcuts</h5>
                <table class="table table-sm table-borderless" style="font-size: 0.9rem;">
                    <tbody>
                        <tr><td><kbd>N</kbd> / <kbd>R</kbd></td><td>New Game / Restart</td></tr>
                        <tr><td><kbd>S</kbd></td><td>Save Game</td></tr>
                        <tr><td><kbd>L</kbd></td><td>Load Game</td></tr>
                        <tr><td><kbd>H</kbd></td><td>Use Hint</td></tr>
                        <tr><td><kbd>Space</kbd></td><td>Pause / Resume</td></tr>
                        <tr><td><kbd>D</kbd></td><td>Toggle Dark Mode</td></tr>
                        <tr><td><kbd>M</kbd></td><td>Toggle Sound</td></tr>
                        <tr><td><kbd>B</kbd></td><td>Show Leaderboard</td></tr>
                        <tr><td><kbd>T</kbd></td><td>Show Statistics</td></tr>
                        <tr><td><kbd>V</kbd></td><td>View Replay</td></tr>
                        <tr><td><kbd>G</kbd></td><td>Game Settings</td></tr>
                        <tr><td><kbd>ESC</kbd></td><td>Close Modal / Resume</td></tr>
                        <tr><td><kbd>?</kbd></td><td>Show This Help</td></tr>
                    </tbody>
                </table>
            </div>
        `;

        const modal = document.getElementById('confirm-modal');
        const messageEl = document.getElementById('confirm-message');
        const okBtn = document.getElementById('confirm-ok-btn');
        const titleEl = modal.querySelector('.modal-title');

        // Backup original title
        const originalTitle = titleEl.innerHTML;

        // Set help content
        titleEl.innerHTML = '<i class="bi bi-keyboard-fill text-primary me-2"></i> Keyboard Shortcuts';
        messageEl.innerHTML = helpMessage;
        okBtn.textContent = 'Got it!';

        // Show modal
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        // Handle close
        const handleClose = () => {
            titleEl.innerHTML = originalTitle;
            okBtn.innerHTML = '<i class="bi bi-check-circle me-1"></i> Lanjutkan';
            modal.removeEventListener('hidden.bs.modal', handleClose);
        };

        okBtn.addEventListener('click', () => {
            bsModal.hide();
        }, { once: true });

        modal.addEventListener('hidden.bs.modal', handleClose);
    }

    showSettings() {
        const modal = document.getElementById('settings-modal');
        const bsModal = new bootstrap.Modal(modal);

        // Load current settings to checkboxes
        document.getElementById('enable-pause').checked = this.featureSettings.pauseEnabled;
        document.getElementById('enable-hint').checked = this.featureSettings.hintEnabled;
        document.getElementById('enable-question').checked = this.featureSettings.questionEnabled;

        bsModal.show();
    }

    setupSettingsListeners() {
        // Pause toggle
        document.getElementById('enable-pause').addEventListener('change', (e) => {
            this.featureSettings.pauseEnabled = e.target.checked;
            this.saveSetting('pauseEnabled', e.target.checked);
            this.showToast(`💤 Pause ${e.target.checked ? 'diaktifkan' : 'dinonaktifkan'}`, 'info');
        });

        // Hint toggle
        document.getElementById('enable-hint').addEventListener('change', (e) => {
            this.featureSettings.hintEnabled = e.target.checked;
            this.saveSetting('hintEnabled', e.target.checked);
            this.showToast(`💡 Hint ${e.target.checked ? 'diaktifkan' : 'dinonaktifkan'}`, 'info');
        });

        // Question mark toggle
        document.getElementById('enable-question').addEventListener('change', (e) => {
            this.featureSettings.questionEnabled = e.target.checked;
            this.saveSetting('questionEnabled', e.target.checked);
            this.showToast(`❓ Question Mark ${e.target.checked ? 'diaktifkan' : 'dinonaktifkan'}`, 'info');
        });
    }

    updateDarkModeIcon() {
        const darkModeBtn = document.getElementById('dark-mode-toggle');
        const icon = darkModeBtn.querySelector('i');
        if (this.darkMode) {
            icon.className = 'bi bi-sun-fill';
        } else {
            icon.className = 'bi bi-moon-stars-fill';
        }
    }

    updateSoundIcon() {
        const soundBtn = document.getElementById('sound-toggle');
        const icon = soundBtn.querySelector('i');
        if (this.soundEnabled) {
            icon.className = 'bi bi-volume-up-fill';
        } else {
            icon.className = 'bi bi-volume-mute-fill';
        }
    }

    setupEventListeners() {
        document.getElementById('new-game').addEventListener('click', () => this.handleNewGame());

        // Play again button in result modal
        document.getElementById('play-again-btn').addEventListener('click', () => {
            const modal = bootstrap.Modal.getInstance(document.getElementById('result-modal'));
            if (modal) modal.hide();
            this.resetGame();
        });

        document.getElementById('view-replay-btn').addEventListener('click', () => {
            const modal = bootstrap.Modal.getInstance(document.getElementById('result-modal'));
            if (modal) modal.hide();
            this.showReplayModal();
        });

        // Header controls
        document.getElementById('dark-mode-toggle').addEventListener('click', () => this.toggleDarkMode());
        document.getElementById('sound-toggle').addEventListener('click', () => this.toggleSound());
        document.getElementById('save-game').addEventListener('click', () => this.saveGame());
        document.getElementById('load-game').addEventListener('click', () => this.loadGame());
        document.getElementById('show-leaderboard').addEventListener('click', () => this.showLeaderboard());
        document.getElementById('show-statistics').addEventListener('click', () => this.showStatistics());
        document.getElementById('reset-stats-btn').addEventListener('click', () => this.resetStatistics());
        document.getElementById('show-replay').addEventListener('click', () => this.showReplayModal());
        document.getElementById('pause-game').addEventListener('click', () => this.pauseGame());
        document.getElementById('resume-game').addEventListener('click', () => this.resumeGame());
        document.getElementById('hint-btn').addEventListener('click', () => this.useHint());
        document.getElementById('settings-btn').addEventListener('click', () => this.showSettings());

        // Leaderboard tabs - use Bootstrap nav-link
        document.querySelectorAll('.nav-link[data-bs-toggle="pill"]').forEach(link => {
            link.addEventListener('shown.bs.tab', (e) => {
                const level = e.target.getAttribute('data-bs-target').replace('#', '');
                this.displayLeaderboardTab(level);
                this.playSound('click');
            });
        });

        // Difficulty buttons - correct class name
        document.querySelectorAll('.btn-difficulty').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const level = e.currentTarget.dataset.level;

                // Validasi jika game sedang berjalan dan level berbeda
                if (this.gameStarted && !this.gameOver && this.currentLevel !== level) {
                    const confirmed = await this.showConfirm('Game sedang berjalan! Progress akan hilang jika Anda ganti level. Lanjutkan?');
                    if (!confirmed) {
                        return;
                    }
                }

                document.querySelectorAll('.btn-difficulty').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');

                this.currentLevel = level;

                const customSettings = document.getElementById('custom-settings');

                switch (level) {
                    case 'easy':
                        this.rows = 8;
                        this.cols = 8;
                        this.minesCount = 10;
                        customSettings.style.display = 'none';
                        break;
                    case 'medium':
                        this.rows = 12;
                        this.cols = 12;
                        this.minesCount = 20;
                        customSettings.style.display = 'none';
                        break;
                    case 'hard':
                        this.rows = 16;
                        this.cols = 16;
                        this.minesCount = 40;
                        customSettings.style.display = 'none';
                        break;
                    case 'custom':
                        customSettings.style.display = 'block';
                        return; // Don't reset game yet, wait for custom input
                }
                this.resetGame();
            });
        });

        // Custom settings
        document.getElementById('apply-custom').addEventListener('click', async () => {
            // Validasi jika game sedang berjalan
            if (this.gameStarted && !this.gameOver) {
                const confirmed = await this.showConfirm('Game sedang berjalan! Progress akan hilang jika Anda terapkan pengaturan custom. Lanjutkan?');
                if (!confirmed) {
                    return;
                }
            }

            const rows = parseInt(document.getElementById('custom-rows').value);
            const cols = parseInt(document.getElementById('custom-cols').value);
            const mines = parseInt(document.getElementById('custom-mines').value);

            // Validation
            if (rows < 5 || rows > 30 || cols < 5 || cols > 30) {
                this.showToast('Ukuran grid harus antara 5 dan 30!', 'error');
                return;
            }

            const maxMines = Math.floor((rows * cols) * 0.8); // Max 80% of cells
            if (mines < 1 || mines > maxMines) {
                this.showToast(`Jumlah bom harus antara 1 dan ${maxMines}!`, 'error');
                return;
            }

            this.rows = rows;
            this.cols = cols;
            this.minesCount = mines;
            this.currentLevel = 'custom';
            this.resetGame();
        });
    }

    createBoard() {
        this.board = [];
        for (let i = 0; i < this.rows; i++) {
            this.board[i] = [];
            for (let j = 0; j < this.cols; j++) {
                this.board[i][j] = {
                    mine: false,
                    revealed: false,
                    flagged: false,
                    questioned: false,
                    adjacentMines: 0
                };
            }
        }

        this.renderBoard();
        this.updateMinesCount();
        this.updateFlagsCount();
        this.updateTimer();
        this.displayBestScore();
    }

    placeMines(excludeRow, excludeCol) {
        let minesPlaced = 0;
        while (minesPlaced < this.minesCount) {
            const row = Math.floor(Math.random() * this.rows);
            const col = Math.floor(Math.random() * this.cols);

            // Don't place mine on first clicked cell or if already has mine
            if ((row === excludeRow && col === excludeCol) || this.board[row][col].mine) {
                continue;
            }

            this.board[row][col].mine = true;
            minesPlaced++;
        }

        this.calculateAdjacentMines();
    }

    calculateAdjacentMines() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (!this.board[i][j].mine) {
                    let count = 0;
                    for (let di = -1; di <= 1; di++) {
                        for (let dj = -1; dj <= 1; dj++) {
                            const ni = i + di;
                            const nj = j + dj;
                            if (ni >= 0 && ni < this.rows && nj >= 0 && nj < this.cols && this.board[ni][nj].mine) {
                                count++;
                            }
                        }
                    }
                    this.board[i][j].adjacentMines = count;
                }
            }
        }
    }

    renderBoard() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = '';

        // Calculate cell size dynamically based on number of columns
        let cellSize = 35; // Default size for small grids

        // Scale down cell size based on number of columns
        if (this.cols > 16) {
            // For grids larger than 16 columns, scale proportionally
            cellSize = Math.max(600 / this.cols, 18); // Minimum 18px
        }

        // Also consider rows for very tall grids
        if (this.rows > 16) {
            const rowBasedSize = Math.max(600 / this.rows, 18);
            cellSize = Math.min(cellSize, rowBasedSize);
        }

        // Round to nearest integer for cleaner rendering
        cellSize = Math.floor(cellSize);

        gameBoard.style.gridTemplateColumns = `repeat(${this.cols}, ${cellSize}px)`;

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.style.width = `${cellSize}px`;
                cell.style.height = `${cellSize}px`;
                cell.style.fontSize = `${Math.max(Math.floor(cellSize * 0.55), 10)}px`;

                cell.addEventListener('click', () => this.handleCellClick(i, j));
                cell.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.handleRightClick(i, j);
                });

                gameBoard.appendChild(cell);
            }
        }
    }

    handleCellClick(row, col) {
        if (this.gameOver || this.board[row][col].flagged || this.isPaused) {
            return;
        }

        // Chord reveal: if cell is already revealed and has a number, try to open surrounding cells
        if (this.board[row][col].revealed) {
            const cell = this.board[row][col];
            if (cell.adjacentMines > 0) {
                this.chordReveal(row, col);
            }
            return;
        }

        // Auto-remove question mark when clicking to reveal
        const cell = this.board[row][col];
        const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);

        if (cell.questioned) {
            cell.questioned = false;
            cellElement.classList.remove('questioned');
            cellElement.textContent = '';
        }

        this.playSound('click');

        if (!this.gameStarted) {
            this.gameStarted = true;
            this.placeMines(row, col);
            this.startTimer();
        }

        // Record move for replay
        if (this.isRecording) {
            this.recordMove('reveal', row, col);
        }

        this.revealCell(row, col, true); // true = initial click, play sound
    }

    countAdjacentFlags(row, col) {
        let flagCount = 0;
        for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
                if (di === 0 && dj === 0) continue;

                const newRow = row + di;
                const newCol = col + dj;

                if (newRow >= 0 && newRow < this.rows && newCol >= 0 && newCol < this.cols) {
                    if (this.board[newRow][newCol].flagged) {
                        flagCount++;
                    }
                }
            }
        }
        return flagCount;
    }

    chordReveal(row, col) {
        const cell = this.board[row][col];
        const flagCount = this.countAdjacentFlags(row, col);

        // Only reveal if the number of adjacent flags matches the cell's number
        if (flagCount === cell.adjacentMines) {
            this.playSound('click');

            // Add highlight animation to the clicked cell
            const clickedCellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            clickedCellElement.classList.add('chord-highlight');
            setTimeout(() => {
                clickedCellElement.classList.remove('chord-highlight');
            }, 400);

            // Collect cells to reveal
            const cellsToReveal = [];
            for (let di = -1; di <= 1; di++) {
                for (let dj = -1; dj <= 1; dj++) {
                    if (di === 0 && dj === 0) continue;

                    const newRow = row + di;
                    const newCol = col + dj;

                    if (newRow >= 0 && newRow < this.rows && newCol >= 0 && newCol < this.cols) {
                        const adjacentCell = this.board[newRow][newCol];
                        if (!adjacentCell.revealed && !adjacentCell.flagged) {
                            cellsToReveal.push({ row: newRow, col: newCol });
                        }
                    }
                }
            }

            // Reveal cells with staggered animation
            cellsToReveal.forEach((cellPos, index) => {
                setTimeout(() => {
                    const cellElement = document.querySelector(`[data-row="${cellPos.row}"][data-col="${cellPos.col}"]`);
                    cellElement.classList.add('chord-reveal');

                    this.revealCell(cellPos.row, cellPos.col, false);

                    // Remove animation class after animation completes
                    setTimeout(() => {
                        cellElement.classList.remove('chord-reveal');
                    }, 300);
                }, index * 30); // 30ms delay between each cell
            });
        }
    }

    revealCell(row, col, playSound = false) {
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
            return;
        }

        const cell = this.board[row][col];
        if (cell.revealed || cell.flagged) {
            return;
        }

        cell.revealed = true;
        this.revealedCount++;

        const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        cellElement.classList.add('revealed');

        if (cell.mine) {
            cellElement.classList.add('mine');
            cellElement.textContent = '💣';
            this.gameOver = true;
            this.playSound('lose');
            this.endGame(false);
        } else {
            // Only play sound once for the initial click
            if (playSound) {
                this.playSound('reveal');
            }

            if (cell.adjacentMines > 0) {
                cellElement.textContent = cell.adjacentMines;
                cellElement.classList.add(`number-${cell.adjacentMines}`);
            } else {
                // Reveal adjacent cells if no adjacent mines (recursive, no sound)
                for (let di = -1; di <= 1; di++) {
                    for (let dj = -1; dj <= 1; dj++) {
                        this.revealCell(row + di, col + dj, false); // false = no sound for recursive calls
                    }
                }
            }

            this.checkWin();
        }
    }

    handleRightClick(row, col) {
        if (this.gameOver || this.board[row][col].revealed || this.isPaused) {
            return;
        }

        const cell = this.board[row][col];
        const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);

        // Cycle based on question mark setting
        if (this.featureSettings.questionEnabled) {
            // Cycle: Empty → Flag → Question → Empty
            if (cell.flagged) {
                // Flag → Question
                this.playSound('question');
                cell.flagged = false;
                cell.questioned = true;
                cellElement.classList.remove('flagged');
                cellElement.classList.add('questioned');
                cellElement.textContent = '❓';
                this.flagsCount--;
            } else if (cell.questioned) {
                // Question → Empty
                this.playSound('click');
                cell.questioned = false;
                cellElement.classList.remove('questioned');
                cellElement.textContent = '';
            } else {
                // Empty → Flag
                this.playSound('flag');
                cell.flagged = true;
                cellElement.classList.add('flagged');
                cellElement.textContent = '🚩';
                this.flagsCount++;
            }
        } else {
            // Simple cycle: Empty → Flag → Empty (no question mark)
            if (cell.flagged) {
                // Flag → Empty
                this.playSound('click');
                cell.flagged = false;
                cellElement.classList.remove('flagged');
                cellElement.textContent = '';
                this.flagsCount--;
            } else {
                // Empty → Flag
                this.playSound('flag');
                cell.flagged = true;
                cellElement.classList.add('flagged');
                cellElement.textContent = '🚩';
                this.flagsCount++;
            }
        }

        // Record move for replay
        if (this.isRecording) {
            this.recordMove('flag', row, col);
        }

        this.updateFlagsCount();
    }

    checkWin() {
        const totalCells = this.rows * this.cols;
        const safeCells = totalCells - this.minesCount;

        if (this.revealedCount === safeCells) {
            this.gameOver = true;
            this.endGame(true);
        }
    }

    endGame(won) {
        this.stopTimer();
        const statusMessage = document.getElementById('status-message');

        // Stop recording and save replay
        if (this.isRecording) {
            this.stopRecording(won);
        }

        // Update statistics
        this.updateStatistics(won);

        if (won) {
            this.playSound('win');
            this.updateBestScore();

            // Add to leaderboard for preset difficulties (only if no hints used)
            if (['easy', 'medium', 'hard'].includes(this.currentLevel) && !this.hintsUsed) {
                this.addToLeaderboard(this.currentLevel, this.timer);
            }

            const bestScore = this.bestScores[this.currentLevel];
            const isNewRecord = !this.hintsUsed && this.timer === bestScore;

            // Show win modal
            this.showResultModal(true, isNewRecord);
        } else {
            // Show lose modal
            this.showResultModal(false);
            this.revealAllMines();
        }
    }

    showResultModal(isWin, isNewRecord = false) {
        const modal = document.getElementById('result-modal');
        const modalContent = document.getElementById('result-modal-content');
        const modalTitle = document.getElementById('result-modal-title');
        const resultIcon = document.getElementById('result-icon');
        const resultMessage = document.getElementById('result-message');
        const resultStats = document.getElementById('result-stats');
        const viewReplayBtn = document.getElementById('view-replay-btn');

        // Clear previous classes
        modalContent.classList.remove('win', 'lose');

        // Show/hide replay button based on replay availability
        if (this.currentReplay) {
            viewReplayBtn.style.display = 'inline-block';
        } else {
            viewReplayBtn.style.display = 'none';
        }

        if (isWin) {
            modalContent.classList.add('win');
            modalTitle.innerHTML = '<i class="bi bi-trophy-fill"></i> KEMENANGAN!';
            resultIcon.textContent = '🎉';

            // Show different message if hints were used
            if (this.hintsUsed) {
                resultMessage.textContent = 'Selamat! Anda Menang! (Hint digunakan)';
            } else {
                resultMessage.textContent = isNewRecord ? '🏆 REKOR BARU!' : 'Selamat! Anda Menang!';
            }

            const hintsUsedCount = 3 - this.hintsRemaining;
            resultStats.innerHTML = `
                <div class="result-stat-item">
                    <div class="result-stat-label">⏱️ Waktu</div>
                    <div class="result-stat-value">${this.timer}s</div>
                </div>
                <div class="result-stat-item">
                    <div class="result-stat-label">💣 Bom</div>
                    <div class="result-stat-value">${this.minesCount}</div>
                </div>
                <div class="result-stat-item">
                    <div class="result-stat-label">💡 Hints</div>
                    <div class="result-stat-value">${hintsUsedCount}/3</div>
                </div>
                <div class="result-stat-item">
                    <div class="result-stat-label">🏆 Best</div>
                    <div class="result-stat-value">${this.bestScores[this.currentLevel] || '-'}</div>
                </div>
            `;

            this.playSound('win');
        } else {
            modalContent.classList.add('lose');
            modalTitle.innerHTML = '<i class="bi bi-x-circle-fill"></i> GAME OVER';
            resultIcon.textContent = '💥';
            resultMessage.textContent = 'Anda Kalah!';

            resultStats.innerHTML = `
                <div class="result-stat-item">
                    <div class="result-stat-label">⏱️ Waktu</div>
                    <div class="result-stat-value">${this.timer}s</div>
                </div>
                <div class="result-stat-item">
                    <div class="result-stat-label">💣 Bom</div>
                    <div class="result-stat-value">${this.minesCount}</div>
                </div>
            `;

            this.playSound('lose');
        }

        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    }

    revealAllMines() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.board[i][j].mine) {
                    const cellElement = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
                    cellElement.classList.add('revealed', 'mine');
                    cellElement.textContent = '💣';
                }
            }
        }
    }

    pauseGame() {
        if (!this.featureSettings.pauseEnabled || !this.gameStarted || this.gameOver || this.isPaused) {
            return;
        }

        this.isPaused = true;
        this.stopTimer();

        // Show pause overlay with animation
        const overlay = document.getElementById('pause-overlay');
        const board = document.getElementById('game-board');
        overlay.style.display = 'flex';
        board.classList.add('paused');

        // Update pause button
        const pauseBtn = document.getElementById('pause-game');
        pauseBtn.style.display = 'none';

        this.playSound('click');
    }

    resumeGame() {
        if (!this.isPaused) {
            return;
        }

        this.isPaused = false;
        this.startTimer();

        // Hide pause overlay with animation
        const overlay = document.getElementById('pause-overlay');
        const board = document.getElementById('game-board');
        overlay.style.display = 'none';
        board.classList.remove('paused');

        // Update pause button
        const pauseBtn = document.getElementById('pause-game');
        pauseBtn.style.display = 'flex';

        this.playSound('click');
    }

    useHint() {
        if (this.hintsRemaining <= 0 || this.gameOver || !this.gameStarted || this.isPaused) {
            if (this.hintsRemaining <= 0) {
                this.showHintMessage('Hint sudah habis! (Max 3 per game)', 'warning');
            }
            return;
        }

        // Find all safe unrevealed cells
        const safeCells = [];
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const cell = this.board[i][j];
                if (!cell.mine && !cell.revealed && !cell.flagged) {
                    safeCells.push({ row: i, col: j });
                }
            }
        }

        if (safeCells.length === 0) {
            this.showHintMessage('Tidak ada sel aman yang bisa di-hint!', 'info');
            return;
        }

        // Pick random safe cell
        const randomIndex = Math.floor(Math.random() * safeCells.length);
        const hintCell = safeCells[randomIndex];

        // Highlight the cell
        const cellElement = document.querySelector(`[data-row="${hintCell.row}"][data-col="${hintCell.col}"]`);
        cellElement.classList.add('hint-highlight');

        // Remove highlight after animation
        setTimeout(() => {
            cellElement.classList.remove('hint-highlight');
        }, 3000);

        // Update hint count
        this.hintsRemaining--;
        this.hintsUsed = true;
        this.updateHintButton();

        // Show message
        this.showHintMessage(`💡 Hint: Sel di baris ${hintCell.row + 1}, kolom ${hintCell.col + 1} aman! (${this.hintsRemaining} tersisa)`, 'success');

        // Play sound
        this.playSound('reveal');
    }

    updateHintButton() {
        const hintBtn = document.getElementById('hint-btn');
        const hintCount = document.getElementById('hint-count');

        hintCount.textContent = this.hintsRemaining;

        if (this.hintsRemaining <= 0) {
            hintBtn.classList.add('disabled');
            hintBtn.style.opacity = '0.5';
            hintBtn.style.cursor = 'not-allowed';
        } else {
            hintBtn.classList.remove('disabled');
            hintBtn.style.opacity = '1';
            hintBtn.style.cursor = 'pointer';
        }
    }

    showHintMessage(message, type = 'info') {
        const hintInfo = document.getElementById('hint-info');
        const hintMessage = document.getElementById('hint-message');

        hintMessage.textContent = message;

        // Remove previous type classes
        hintInfo.classList.remove('alert-success', 'alert-warning', 'alert-info', 'alert-danger');

        // Add new type class
        if (type === 'success') {
            hintInfo.classList.add('alert-success');
        } else if (type === 'warning') {
            hintInfo.classList.add('alert-warning');
        } else if (type === 'danger') {
            hintInfo.classList.add('alert-danger');
        } else {
            hintInfo.classList.add('alert-info');
        }

        hintInfo.style.display = 'block';
        hintInfo.classList.add('show');

        // Auto hide after 5 seconds
        setTimeout(() => {
            hintInfo.classList.remove('show');
            setTimeout(() => {
                hintInfo.style.display = 'none';
            }, 150);
        }, 5000);
    }

    startTimer() {
        this.currentGameStartTime = Date.now();
        this.isRecording = true;
        this.replayRecording = [];
        this.recordReplayMetadata();

        this.timerInterval = setInterval(() => {
            this.timer++;
            this.updateTimer();
        }, 1000);

        // Show buttons based on feature settings
        const pauseBtn = document.getElementById('pause-game');
        const hintBtn = document.getElementById('hint-btn');
        const undoBtn = document.getElementById('undo-btn');
        const redoBtn = document.getElementById('redo-btn');

        if (this.featureSettings.pauseEnabled) {
            pauseBtn.style.display = 'flex';
        }
        if (this.featureSettings.hintEnabled) {
            hintBtn.style.display = 'flex';
            this.updateHintButton();
        }
        if (this.featureSettings.undoEnabled) {
            undoBtn.style.display = 'flex';
            redoBtn.style.display = 'flex';
            this.updateUndoRedoButtons();
        }
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        // Hide pause and hint buttons when timer stops
        const pauseBtn = document.getElementById('pause-game');
        const hintBtn = document.getElementById('hint-btn');
        pauseBtn.style.display = 'none';
        hintBtn.style.display = 'none';
    }

    updateTimer() {
        document.getElementById('timer').textContent = this.timer;
    }

    updateMinesCount() {
        document.getElementById('mines-count').textContent = this.minesCount;
    }

    updateFlagsCount() {
        document.getElementById('flags-count').textContent = this.flagsCount;
    }

    resetGame() {
        this.stopTimer();
        this.gameOver = false;
        this.gameStarted = false;
        this.timer = 0;
        this.flagsCount = 0;
        this.revealedCount = 0;
        this.isPaused = false;
        this.hintsRemaining = 3;
        this.hintsUsed = false;
        this.isRecording = false;
        this.replayRecording = [];

        // Hide replay button
        document.getElementById('show-replay').style.display = 'none';

        // Hide pause overlay if visible
        const overlay = document.getElementById('pause-overlay');
        const board = document.getElementById('game-board');
        overlay.style.display = 'none';
        board.classList.remove('paused');

        // Hide hint info
        const hintInfo = document.getElementById('hint-info');
        hintInfo.style.display = 'none';
        hintInfo.classList.remove('show');

        document.getElementById('status-message').className = 'status-message';

        this.createBoard();
        this.updateHintButton();
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new Minesweeper();
});
