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

    saveGame() {
        if (!this.gameStarted || this.gameOver) {
            alert('Tidak ada game aktif untuk disimpan!');
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
        alert('✅ Game berhasil disimpan!');
        this.playSound('flag');
    }

    loadGame() {
        const saved = localStorage.getItem('minesweeper-saved-game');
        if (!saved) {
            alert('Tidak ada game tersimpan!');
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

        alert('✅ Game berhasil dimuat!');
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
            }
        }
    }

    toggleDarkMode() {
        this.darkMode = !this.darkMode;
        document.body.classList.toggle('dark-mode', this.darkMode);
        this.saveSetting('darkMode', this.darkMode);
        this.playSound('click');
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        this.saveSetting('soundEnabled', this.soundEnabled);

        const soundBtn = document.getElementById('sound-toggle');
        soundBtn.textContent = this.soundEnabled ? '🔊' : '🔇';

        if (this.soundEnabled) {
            this.playSound('click');
        }
    }

    showLeaderboard() {
        const modal = document.getElementById('leaderboard-modal');
        modal.classList.add('show');
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
        this.createBoard();

        // Apply dark mode if enabled
        if (this.darkMode) {
            document.body.classList.add('dark-mode');
        }

        // Update sound button
        const soundBtn = document.getElementById('sound-toggle');
        if (soundBtn) {
            soundBtn.textContent = this.soundEnabled ? '🔊' : '🔇';
        }
    }

    setupEventListeners() {
        document.getElementById('new-game').addEventListener('click', () => this.resetGame());

        // Header controls
        document.getElementById('dark-mode-toggle').addEventListener('click', () => this.toggleDarkMode());
        document.getElementById('sound-toggle').addEventListener('click', () => this.toggleSound());
        document.getElementById('save-game').addEventListener('click', () => this.saveGame());
        document.getElementById('load-game').addEventListener('click', () => this.loadGame());
        document.getElementById('show-leaderboard').addEventListener('click', () => this.showLeaderboard());

        // Leaderboard modal
        document.getElementById('close-leaderboard').addEventListener('click', () => {
            document.getElementById('leaderboard-modal').classList.remove('show');
            this.playSound('click');
        });

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.displayLeaderboardTab(e.target.dataset.tab);
                this.playSound('click');
            });
        });

        // Close modal on outside click
        document.getElementById('leaderboard-modal').addEventListener('click', (e) => {
            if (e.target.id === 'leaderboard-modal') {
                e.target.classList.remove('show');
                this.playSound('click');
            }
        });

        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                const level = e.target.dataset.level;
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
        document.getElementById('apply-custom').addEventListener('click', () => {
            const rows = parseInt(document.getElementById('custom-rows').value);
            const cols = parseInt(document.getElementById('custom-cols').value);
            const mines = parseInt(document.getElementById('custom-mines').value);

            // Validation
            if (rows < 5 || rows > 30 || cols < 5 || cols > 30) {
                alert('Ukuran grid harus antara 5 dan 30!');
                return;
            }

            const maxMines = Math.floor((rows * cols) * 0.8); // Max 80% of cells
            if (mines < 1 || mines > maxMines) {
                alert(`Jumlah bom harus antara 1 dan ${maxMines}!`);
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
        if (this.gameOver || this.board[row][col].flagged || this.board[row][col].revealed) {
            return;
        }

        this.playSound('click');

        if (!this.gameStarted) {
            this.gameStarted = true;
            this.placeMines(row, col);
            this.startTimer();
        }

        this.revealCell(row, col, true); // true = initial click, play sound
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
        if (this.gameOver || this.board[row][col].revealed) {
            return;
        }

        this.playSound('flag');

        const cell = this.board[row][col];
        const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);

        if (cell.flagged) {
            cell.flagged = false;
            cellElement.classList.remove('flagged');
            cellElement.textContent = '';
            this.flagsCount--;
        } else {
            cell.flagged = true;
            cellElement.classList.add('flagged');
            cellElement.textContent = '🚩';
            this.flagsCount++;
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

        if (won) {
            this.playSound('win');
            this.updateBestScore();

            // Add to leaderboard for preset difficulties
            if (['easy', 'medium', 'hard'].includes(this.currentLevel)) {
                this.addToLeaderboard(this.currentLevel, this.timer);
            }

            const bestScore = this.bestScores[this.currentLevel];
            let message = `🎉 Selamat! Anda Menang! Waktu: ${this.timer} detik`;

            if (this.timer === bestScore) {
                message += ' 🏆 NEW BEST SCORE!';
            }

            statusMessage.textContent = message;
            statusMessage.className = 'status-message show win';
        } else {
            statusMessage.textContent = '💥 Game Over! Anda Kalah!';
            statusMessage.className = 'status-message show lose';
            this.revealAllMines();
        }
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

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.updateTimer();
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
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

        document.getElementById('status-message').className = 'status-message';

        this.createBoard();
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new Minesweeper();
});
