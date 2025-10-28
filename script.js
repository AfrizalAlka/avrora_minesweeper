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

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createBoard();
    }

    setupEventListeners() {
        document.getElementById('new-game').addEventListener('click', () => this.resetGame());

        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                const level = e.target.dataset.level;
                switch (level) {
                    case 'easy':
                        this.rows = 8;
                        this.cols = 8;
                        this.minesCount = 10;
                        break;
                    case 'medium':
                        this.rows = 12;
                        this.cols = 12;
                        this.minesCount = 20;
                        break;
                    case 'hard':
                        this.rows = 16;
                        this.cols = 16;
                        this.minesCount = 40;
                        break;
                }
                this.resetGame();
            });
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
        gameBoard.style.gridTemplateColumns = `repeat(${this.cols}, 35px)`;

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;

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

        if (!this.gameStarted) {
            this.gameStarted = true;
            this.placeMines(row, col);
            this.startTimer();
        }

        this.revealCell(row, col);
    }

    revealCell(row, col) {
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
            this.endGame(false);
        } else {
            if (cell.adjacentMines > 0) {
                cellElement.textContent = cell.adjacentMines;
                cellElement.classList.add(`number-${cell.adjacentMines}`);
            } else {
                // Reveal adjacent cells if no adjacent mines
                for (let di = -1; di <= 1; di++) {
                    for (let dj = -1; dj <= 1; dj++) {
                        this.revealCell(row + di, col + dj);
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
            statusMessage.textContent = `🎉 Selamat! Anda Menang! Waktu: ${this.timer} detik`;
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
