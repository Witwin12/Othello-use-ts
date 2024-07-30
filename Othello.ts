import Board from "./Board";
import HumanPlayer from "./human_player";
import BotPlayer from "./bot";
import Player from "./Player";
import * as readline from 'readline';

/**
 * Class representing the Othello game.
 */
class Othello {
    private board: Board;
    private player1!: Player;
    private player2!: Player;
    private rl: readline.Interface;

    constructor() {
        this.board = new Board();
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    /**
     * Prompts the user to select the game mode.
     * @returns A promise that resolves to the selected game mode (1 for Human vs Bot, 2 for Human vs Human).
     */
    private async selectMode(): Promise<number> {
        return new Promise((resolve) => {
            const askQuestion = () => {
                this.rl.question('Select mode (1 for Human vs Bot, 2 for Human vs Human): ', (input) => {
                    const mode = Number(input.trim());
                    if (mode === 1 || mode === 2) {
                        resolve(mode);
                    } else {
                        console.log('Invalid selection. Please enter 1 or 2.');
                        askQuestion();
                    }
                });
            };
            askQuestion();
        });
    }

    /**
     * Sets up the game based on the selected mode.
     * @param mode - The selected game mode.
     */
    private setupGame(mode: number): void {
        if (mode === 1) {
            this.player1 = new HumanPlayer('B');
            this.player2 = new BotPlayer('W');
        } else if (mode === 2) {
            this.player1 = new HumanPlayer('B');
            this.player2 = new HumanPlayer('W');
        }
    }

    /**
     * Starts the game.
     */
    public async startGame() {
        const mode = await this.selectMode();
        this.setupGame(mode);
        await this.gameLoop();
        this.rl.close();
    }

    /**
     * The main game loop.
     */
    private async gameLoop() {
        let currentPlayer = this.player1;

        while (true) {
            this.board.printBoard();
            const validMoves = this.board.get_valid_moves(currentPlayer.get_color());
            console.log(`Valid moves: ${validMoves.map(move => `(${move[0]},${move[1]})`).join(', ')}`);

            if (validMoves.length > 0) {
                const move = await currentPlayer.decide_move(this.board);
                if (this.board.makeMove(move[0], move[1], currentPlayer.get_color())) {
                    currentPlayer = currentPlayer === this.player1 ? this.player2 : this.player1;
                } else {
                    console.log('Invalid move, try again.');
                }
            } else {
                console.log(`No valid moves for ${currentPlayer.get_color()}, skipping turn.`);
                currentPlayer = currentPlayer === this.player1 ? this.player2 : this.player1;
            }

            // Check if both players have no valid moves
            const player1Moves = this.board.get_valid_moves(this.player1.get_color());
            const player2Moves = this.board.get_valid_moves(this.player2.get_color());

            if (player1Moves.length === 0 && player2Moves.length === 0) {
                break;
            }
        }

        this.display_winner();
    }

    /**
     * Displays the winner of the game.
     */
    public display_winner() {
        const winner = this.board.getWinner();
        const scores = this.board.countDiscs();
        const scoreMessage = `Score - Black (B): ${scores.B}, White (W): ${scores.W}`;
        
        switch (winner) {
            case 'B':
                console.log('Black (B) wins!');
                break;
            case 'W':
                console.log('White (W) wins!');
                break;
            case 'D':
                console.log('The game is a draw!');
                break;
            default:
                console.log('The game is not over yet.');
        }
        console.log(scoreMessage);
    }
}

const game = new Othello();
game.startGame();
