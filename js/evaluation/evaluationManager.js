import { Sounds } from '../background/sounds.js';

export class EvaluationManager {
    constructor(game) {
        this.game = game;
        this.confettiInstance = confetti.create(this.game.getCanvas(), { resize: true });
        this.confettiInterval = null;
    }

    updateScoreTable() {
        const scoreTableBody = document.querySelector('#scoreTable tbody');
        scoreTableBody.innerHTML = '';

        const sortedPlayers = this.game.getPlayers().sort((a, b) => b.points - a.points);

        sortedPlayers.forEach((player, index) => {
            const row = document.createElement('tr');

            const playerCell = document.createElement('td');
            const colorSquare = this.#createColorSquare(player.color);
            playerCell.appendChild(colorSquare);

            const scoreCell = document.createElement('td');
            scoreCell.textContent = player.points;

            if (index === 0) {
                const crownIcon = document.createElement('span');
                crownIcon.classList.add('fa-solid', 'fa-crown');
                crownIcon.style.color = 'gold';
                crownIcon.style.marginLeft = '10px';
                scoreCell.appendChild(crownIcon);
            }

            row.appendChild(playerCell);
            row.appendChild(scoreCell);
            scoreTableBody.appendChild(row);
        });
    }

    gameFinished() {
        this.updateScoreTable();
        this.#startConfetti();

        Sounds.soundEffects.allLevelsCompleted.play();
    }

    #createColorSquare(color) {
        const square = document.createElement('div');
        square.style.width = '20px';
        square.style.height = '20px';
        square.style.backgroundColor = color;
        square.style.display = 'inline-block';
        square.style.marginRight = '10px';
        return square;
    }

    #drawEndScreen(winner) {
        const ctx = this.game.getContext();
        const canvas = this.game.getCanvas();
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();

        ctx.fillStyle = 'black';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText("All levels completed!", canvas.width / 2, canvas.height / 2 - 40);

        ctx.fillStyle = winner.color;
        ctx.font = '60px Arial';
        ctx.fillText(`You are the Winner!`, canvas.width / 2, canvas.height / 2 + 40);
        
        ctx.restore();
    }

    #startConfetti() {
        const duration = 5 * 1000;
        const end = Date.now() + duration;

        this.confettiInterval = setInterval(() => {
            const timeLeft = end - Date.now();
            this.confettiInstance({
                particleCount: 100,
                startVelocity: 30,
                spread: 360,
                origin: {
                    x: Math.random(),
                    y: Math.random() - 0.2
                },
            });

            if (timeLeft <= 0) {
                clearInterval(this.confettiInterval);
                this.#stopConfetti();
                const winner = this.game.getPlayers().reduce((max, player) => (player.points > max.points ? player : max));
                this.#drawEndScreen(winner);
            }
        }, 250);
    }

    #stopConfetti() {
        this.confettiInstance.reset();
    }
}