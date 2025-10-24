// DevOps Minesweeper Game
class MinesweeperGame {
    constructor() {
        this.grid = [];
        this.mines = [];
        this.revealed = [];
        this.flagged = [];
        this.gameOver = false;
        this.gameWon = false;
        this.startTime = 0;
        this.timer = 0;
        this.timerInterval = null;
        
        // Game settings
        this.difficulty = 'easy';
        this.difficulties = {
            easy: { rows: 9, cols: 9, mines: 10 },
            medium: { rows: 16, cols: 16, mines: 40 },
            hard: { rows: 16, cols: 30, mines: 99 }
        };
        
        this.initializeGame();
        this.setupEventListeners();
        this.updateDisplay();
    }
    
    initializeGame() {
        const settings = this.difficulties[this.difficulty];
        this.rows = settings.rows;
        this.cols = settings.cols;
        this.mineCount = settings.mines;
        
        this.grid = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
        this.mines = [];
        this.revealed = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
        this.flagged = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
        this.gameOver = false;
        this.gameWon = false;
        this.startTime = 0;
        this.timer = 0;
        
        this.createGrid();
        this.updateDisplay();
    }
    
    createGrid() {
        const gridElement = document.getElementById('minesweeper-grid');
        gridElement.innerHTML = '';
        gridElement.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
        
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                cell.addEventListener('click', (e) => this.handleCellClick(e, row, col));
                cell.addEventListener('contextmenu', (e) => this.handleRightClick(e, row, col));
                cell.addEventListener('dblclick', (e) => this.handleDoubleClick(e, row, col));
                
                gridElement.appendChild(cell);
            }
        }
    }
    
    placeMines(firstRow, firstCol) {
        this.mines = [];
        let minesPlaced = 0;
        
        while (minesPlaced < this.mineCount) {
            const row = Math.floor(Math.random() * this.rows);
            const col = Math.floor(Math.random() * this.cols);
            
            // Don't place mine on first click or if already has mine
            if ((row === firstRow && col === firstCol) || this.mines.some(mine => mine.row === row && mine.col === col)) {
                continue;
            }
            
            this.mines.push({ row, col });
            this.grid[row][col] = -1; // -1 represents mine
            minesPlaced++;
        }
        
        // Calculate numbers for each cell
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.grid[row][col] !== -1) {
                    this.grid[row][col] = this.countAdjacentMines(row, col);
                }
            }
        }
    }
    
    countAdjacentMines(row, col) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const newRow = row + i;
                const newCol = col + j;
                if (newRow >= 0 && newRow < this.rows && newCol >= 0 && newCol < this.cols) {
                    if (this.mines.some(mine => mine.row === newRow && mine.col === newCol)) {
                        count++;
                    }
                }
            }
        }
        return count;
    }
    
    handleCellClick(e, row, col) {
        e.preventDefault();
        if (this.gameOver || this.gameWon || this.flagged[row][col]) return;
        
        if (this.startTime === 0) {
            this.startTime = Date.now();
            this.placeMines(row, col);
            this.startTimer();
        }
        
        this.revealCell(row, col);
        this.updateDisplay();
        this.checkWin();
    }
    
    handleRightClick(e, row, col) {
        e.preventDefault();
        if (this.gameOver || this.gameWon || this.revealed[row][col]) return;
        
        this.flagged[row][col] = !this.flagged[row][col];
        this.updateCellDisplay(row, col);
        this.updateDisplay();
    }
    
    handleDoubleClick(e, row, col) {
        e.preventDefault();
        if (this.gameOver || this.gameWon || !this.revealed[row][col]) return;
        
        // Toggle question mark
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (cell.classList.contains('question')) {
            cell.classList.remove('question');
        } else {
            cell.classList.add('question');
        }
    }
    
    revealCell(row, col) {
        if (this.revealed[row][col] || this.flagged[row][col]) return;
        
        this.revealed[row][col] = true;
        this.updateCellDisplay(row, col);
        
        if (this.grid[row][col] === -1) {
            // Mine hit!
            this.gameOver = true;
            this.stopTimer();
            this.revealAllMines();
            this.showGameOverModal(false);
        } else if (this.grid[row][col] === 0) {
            // Empty cell - reveal adjacent cells
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const newRow = row + i;
                    const newCol = col + j;
                    if (newRow >= 0 && newRow < this.rows && newCol >= 0 && newCol < this.cols) {
                        this.revealCell(newRow, newCol);
                    }
                }
            }
        }
    }
    
    updateCellDisplay(row, col) {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (!cell) return;
        
        cell.className = 'cell';
        
        if (this.flagged[row][col]) {
            cell.classList.add('flagged');
            cell.innerHTML = '<i class="fas fa-flag"></i>';
        } else if (this.revealed[row][col]) {
            cell.classList.add('revealed');
            if (this.grid[row][col] === -1) {
                cell.classList.add('mine');
                cell.innerHTML = '<i class="fas fa-bomb"></i>';
            } else if (this.grid[row][col] > 0) {
                cell.textContent = this.grid[row][col];
                cell.setAttribute('data-count', this.grid[row][col]);
            }
        } else if (cell.classList.contains('question')) {
            cell.classList.add('question');
            cell.innerHTML = '<i class="fas fa-question"></i>';
        } else {
            cell.innerHTML = '';
        }
    }
    
    revealAllMines() {
        this.mines.forEach(mine => {
            const cell = document.querySelector(`[data-row="${mine.row}"][data-col="${mine.col}"]`);
            if (cell) {
                cell.classList.add('mine-revealed');
                cell.innerHTML = '<i class="fas fa-bomb"></i>';
            }
        });
    }
    
    checkWin() {
        let revealedCount = 0;
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.revealed[row][col]) {
                    revealedCount++;
                }
            }
        }
        
        if (revealedCount === (this.rows * this.cols - this.mineCount)) {
            this.gameWon = true;
            this.stopTimer();
            this.showGameOverModal(true);
        }
    }
    
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timer = Math.floor((Date.now() - this.startTime) / 1000);
            this.updateDisplay();
        }, 1000);
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    updateDisplay() {
        document.getElementById('mines-count').textContent = this.mineCount - this.flagged.flat().filter(Boolean).length;
        document.getElementById('timer').textContent = this.timer.toString().padStart(3, '0');
        
        // Update best time
        const bestTimeKey = `minesweeper_best_${this.difficulty}`;
        const bestTime = localStorage.getItem(bestTimeKey) || 999;
        document.getElementById('best-time').textContent = bestTime.toString().padStart(3, '0');
    }
    
    showGameOverModal(won) {
        const modal = document.getElementById('game-over-modal');
        const result = document.getElementById('game-result');
        const icon = document.getElementById('result-icon');
        const finalTime = document.getElementById('final-time');
        const finalDifficulty = document.getElementById('final-difficulty');
        const finalBestTime = document.getElementById('final-best-time');
        
        if (won) {
            result.textContent = 'Congratulations!';
            icon.className = 'fas fa-trophy';
            icon.style.color = '#fbbf24';
            
            // Update best time
            const bestTimeKey = `minesweeper_best_${this.difficulty}`;
            const currentBest = parseInt(localStorage.getItem(bestTimeKey) || '999');
            if (this.timer < currentBest) {
                localStorage.setItem(bestTimeKey, this.timer.toString());
            }
        } else {
            result.textContent = 'Game Over!';
            icon.className = 'fas fa-bomb';
            icon.style.color = '#ef4444';
        }
        
        finalTime.textContent = this.timer.toString().padStart(3, '0');
        finalDifficulty.textContent = this.difficulty.charAt(0).toUpperCase() + this.difficulty.slice(1);
        
        const bestTimeKey = `minesweeper_best_${this.difficulty}`;
        const bestTime = localStorage.getItem(bestTimeKey) || '999';
        finalBestTime.textContent = bestTime.toString().padStart(3, '0');
        
        modal.classList.add('show');
    }
    
    setupEventListeners() {
        document.getElementById('new-game-btn').addEventListener('click', () => this.newGame());
        document.getElementById('difficulty-btn').addEventListener('click', () => this.toggleDifficulty());
        document.getElementById('hint-btn').addEventListener('click', () => this.showHint());
        document.getElementById('play-again-btn').addEventListener('click', () => this.playAgain());
        document.getElementById('close-modal-btn').addEventListener('click', () => this.closeModal());
    }
    
    newGame() {
        this.stopTimer();
        this.initializeGame();
    }
    
    toggleDifficulty() {
        const difficulties = ['easy', 'medium', 'hard'];
        const currentIndex = difficulties.indexOf(this.difficulty);
        this.difficulty = difficulties[(currentIndex + 1) % difficulties.length];
        
        const btn = document.getElementById('difficulty-btn');
        btn.innerHTML = `<i class="fas fa-cog"></i> ${this.difficulty.charAt(0).toUpperCase() + this.difficulty.slice(1)}`;
        
        this.newGame();
    }
    
    showHint() {
        if (this.gameOver || this.gameWon) return;
        
        // Find a safe cell to reveal
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (!this.revealed[row][col] && !this.flagged[row][col] && this.grid[row][col] !== -1) {
                    this.revealCell(row, col);
                    this.updateDisplay();
                    this.checkWin();
                    return;
                }
            }
        }
    }
    
    playAgain() {
        this.closeModal();
        this.newGame();
    }
    
    closeModal() {
        document.getElementById('game-over-modal').classList.remove('show');
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('💣 DevOps Minesweeper loaded!');
    
    const game = new MinesweeperGame();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'n' || e.key === 'N') {
            game.newGame();
        } else if (e.key === 'h' || e.key === 'H') {
            game.showHint();
        } else if (e.key === 'd' || e.key === 'D') {
            game.toggleDifficulty();
        }
    });
    
    // Add keyboard shortcuts info
    const shortcutsInfo = document.createElement('div');
    shortcutsInfo.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 1rem;
        border-radius: 10px;
        font-size: 0.875rem;
        z-index: 100;
        max-width: 200px;
        display: none;
    `;
    shortcutsInfo.innerHTML = `
        <strong>Keyboard Shortcuts:</strong><br>
        N: New Game<br>
        H: Hint<br>
        D: Difficulty<br>
        <br>
        <strong>Mouse:</strong><br>
        Left: Reveal<br>
        Right: Flag<br>
        Double: Question
    `;
    document.body.appendChild(shortcutsInfo);
    
    // Show shortcuts on first visit
    if (!localStorage.getItem('minesweeperVisited')) {
        setTimeout(() => {
            shortcutsInfo.style.display = 'block';
            setTimeout(() => {
                shortcutsInfo.style.display = 'none';
            }, 5000);
        }, 2000);
        localStorage.setItem('minesweeperVisited', 'true');
    }
    
    // Add click to show shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === '?') {
            shortcutsInfo.style.display = shortcutsInfo.style.display === 'none' ? 'block' : 'none';
        }
    });
});