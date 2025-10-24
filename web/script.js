// DevOps Snake Game
class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;
        
        // Game state
        this.gameRunning = false;
        this.gamePaused = false;
        this.score = 0;
        this.level = 1;
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        this.gameSpeed = 150;
        
        // Snake
        this.snake = [
            {x: 10, y: 10}
        ];
        this.dx = 0;
        this.dy = 0;
        
        // Food
        this.food = {x: 15, y: 15};
        this.foodType = 'normal';
        
        // DevOps tools for food
        this.devopsTools = [
            {name: 'GitHub', icon: 'fab fa-github', color: '#333', points: 10},
            {name: 'Docker', icon: 'fas fa-ship', color: '#2496ed', points: 15},
            {name: 'Kubernetes', icon: 'fas fa-cube', color: '#326ce5', points: 20},
            {name: 'ArgoCD', icon: 'fas fa-sync', color: '#ef7b4d', points: 25},
            {name: 'Helm', icon: 'fas fa-anchor', color: '#0f1689', points: 30},
            {name: 'Jenkins', icon: 'fas fa-cogs', color: '#d24939', points: 35}
        ];
        
        this.initializeGame();
        this.setupEventListeners();
        this.updateDisplay();
    }
    
    initializeGame() {
        this.snake = [{x: 10, y: 10}];
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.level = 1;
        this.gameSpeed = 150;
        this.generateFood();
    }
    
    setupEventListeners() {
        // Button events
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('pause-btn').addEventListener('click', () => this.togglePause());
        document.getElementById('reset-btn').addEventListener('click', () => this.resetGame());
        document.getElementById('play-again-btn').addEventListener('click', () => this.playAgain());
        document.getElementById('close-modal-btn').addEventListener('click', () => this.closeModal());
        
        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Prevent arrow keys from scrolling
        document.addEventListener('keydown', (e) => {
            if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }
        });
    }
    
    handleKeyPress(e) {
        if (!this.gameRunning || this.gamePaused) return;
        
        const key = e.key;
        
        switch(key) {
            case 'ArrowUp':
                if (this.dy !== 1) {
                    this.dx = 0;
                    this.dy = -1;
                }
                break;
            case 'ArrowDown':
                if (this.dy !== -1) {
                    this.dx = 0;
                    this.dy = 1;
                }
                break;
            case 'ArrowLeft':
                if (this.dx !== 1) {
                    this.dx = -1;
                    this.dy = 0;
                }
                break;
            case 'ArrowRight':
                if (this.dx !== -1) {
                    this.dx = 1;
                    this.dy = 0;
                }
                break;
            case ' ':
                e.preventDefault();
                this.togglePause();
                break;
        }
    }
    
    startGame() {
        if (!this.gameRunning) {
            this.gameRunning = true;
            this.gamePaused = false;
            this.gameLoop();
            this.updateButtons();
        }
    }
    
    togglePause() {
        if (this.gameRunning) {
            this.gamePaused = !this.gamePaused;
            if (!this.gamePaused) {
                this.gameLoop();
            }
            this.updateButtons();
        }
    }
    
    resetGame() {
        this.gameRunning = false;
        this.gamePaused = false;
        this.initializeGame();
        this.draw();
        this.updateDisplay();
        this.updateButtons();
    }
    
    playAgain() {
        this.closeModal();
        this.resetGame();
        this.startGame();
    }
    
    closeModal() {
        document.getElementById('game-over-modal').classList.remove('show');
    }
    
    updateButtons() {
        const startBtn = document.getElementById('start-btn');
        const pauseBtn = document.getElementById('pause-btn');
        const resetBtn = document.getElementById('reset-btn');
        
        if (this.gameRunning) {
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            resetBtn.disabled = false;
            
            if (this.gamePaused) {
                pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
            } else {
                pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
            }
        } else {
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            resetBtn.disabled = false;
            pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        }
    }
    
    gameLoop() {
        if (!this.gameRunning || this.gamePaused) return;
        
        this.update();
        this.draw();
        
        if (this.gameRunning) {
            setTimeout(() => this.gameLoop(), this.gameSpeed);
        }
    }
    
    update() {
        const head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
        
        // Check wall collision
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            this.gameOver();
            return;
        }
        
        // Check self collision
        for (let segment of this.snake) {
            if (head.x === segment.x && head.y === segment.y) {
                this.gameOver();
                return;
            }
        }
        
        this.snake.unshift(head);
        
        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.eatFood();
        } else {
            this.snake.pop();
        }
    }
    
    eatFood() {
        this.score += this.food.points;
        this.updateDisplay();
        
        // Level up every 100 points
        const newLevel = Math.floor(this.score / 100) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            this.gameSpeed = Math.max(50, this.gameSpeed - 10);
            this.showLevelUp();
        }
        
        this.generateFood();
    }
    
    generateFood() {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
        } while (this.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
        
        this.food = newFood;
        this.foodType = this.devopsTools[Math.floor(Math.random() * this.devopsTools.length)];
        this.food.points = this.foodType.points;
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#f8fafc';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.ctx.strokeStyle = '#e2e8f0';
        this.ctx.lineWidth = 1;
        for (let i = 0; i <= this.tileCount; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.gridSize, 0);
            this.ctx.lineTo(i * this.gridSize, this.canvas.height);
            this.ctx.moveTo(0, i * this.gridSize);
            this.ctx.lineTo(this.canvas.width, i * this.gridSize);
            this.ctx.stroke();
        }
        
        // Draw snake
        this.snake.forEach((segment, index) => {
            if (index === 0) {
                // Head
                this.ctx.fillStyle = '#10b981';
                this.ctx.fillRect(segment.x * this.gridSize + 2, segment.y * this.gridSize + 2, 
                                this.gridSize - 4, this.gridSize - 4);
                
                // Eyes
                this.ctx.fillStyle = '#ffffff';
                this.ctx.fillRect(segment.x * this.gridSize + 6, segment.y * this.gridSize + 6, 3, 3);
                this.ctx.fillRect(segment.x * this.gridSize + 11, segment.y * this.gridSize + 6, 3, 3);
            } else {
                // Body
                this.ctx.fillStyle = '#059669';
                this.ctx.fillRect(segment.x * this.gridSize + 3, segment.y * this.gridSize + 3, 
                                this.gridSize - 6, this.gridSize - 6);
            }
        });
        
        // Draw food
        this.ctx.fillStyle = this.foodType.color;
        this.ctx.fillRect(this.food.x * this.gridSize + 4, this.food.y * this.gridSize + 4, 
                         this.gridSize - 8, this.gridSize - 8);
        
        // Draw food icon (simplified)
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.foodType.name.charAt(0), 
                          this.food.x * this.gridSize + this.gridSize/2, 
                          this.food.y * this.gridSize + this.gridSize/2 + 4);
    }
    
    gameOver() {
        this.gameRunning = false;
        this.gamePaused = false;
        
        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore);
        }
        
        this.showGameOverModal();
        this.updateDisplay();
        this.updateButtons();
    }
    
    showGameOverModal() {
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('final-level').textContent = this.level;
        document.getElementById('final-high-score').textContent = this.highScore;
        document.getElementById('game-over-modal').classList.add('show');
    }
    
    showLevelUp() {
        // Create level up notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--gradient-primary);
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            font-size: 1.25rem;
            font-weight: 600;
            z-index: 1001;
            animation: levelUpAnimation 2s ease;
        `;
        notification.textContent = `Level ${this.level}!`;
        
        // Add animation CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes levelUpAnimation {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
                50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(1); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
            document.head.removeChild(style);
        }, 2000);
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('high-score').textContent = this.highScore;
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 DevOps Snake Game loaded!');
    
    const game = new SnakeGame();
    
    // Add touch controls for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', (e) => {
        if (!game.gameRunning || game.gamePaused) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        const minSwipeDistance = 50;
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    // Swipe right
                    if (game.dx !== -1) {
                        game.dx = 1;
                        game.dy = 0;
                    }
                } else {
                    // Swipe left
                    if (game.dx !== 1) {
                        game.dx = -1;
                        game.dy = 0;
                    }
                }
            }
        } else {
            // Vertical swipe
            if (Math.abs(deltaY) > minSwipeDistance) {
                if (deltaY > 0) {
                    // Swipe down
                    if (game.dy !== -1) {
                        game.dx = 0;
                        game.dy = 1;
                    }
                } else {
                    // Swipe up
                    if (game.dy !== 1) {
                        game.dx = 0;
                        game.dy = -1;
                    }
                }
            }
        }
    });
    
    // Prevent context menu on long press
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    
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
        Arrow Keys: Move<br>
        Space: Pause/Resume<br>
        <br>
        <strong>Mobile:</strong><br>
        Swipe to move
    `;
    document.body.appendChild(shortcutsInfo);
    
    // Show shortcuts on first visit
    if (!localStorage.getItem('snakeGameVisited')) {
        setTimeout(() => {
            shortcutsInfo.style.display = 'block';
            setTimeout(() => {
                shortcutsInfo.style.display = 'none';
            }, 5000);
        }, 2000);
        localStorage.setItem('snakeGameVisited', 'true');
    }
    
    // Add click to show shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'h' || e.key === 'H') {
            shortcutsInfo.style.display = shortcutsInfo.style.display === 'none' ? 'block' : 'none';
        }
    });
});