import Board from "./Board";
import HumanPlayer from "./human_player";
import BotPlayer from "./bot";
import Player from "./Player";

/**
 * Class representing the Othello game.
 */
class Othello {
    private board: Board;
    private player1!: Player;
    private player2!: Player;

    constructor() {
        this.board = new Board();
    }

    /**
     * Sets up the game based on the selected mode.
     * @param mode - The selected game mode.
     */
    public setupGame(mode: number): void {
        if (mode === 1) {
            this.player1 = new HumanPlayer('B');
            this.player2 = new BotPlayer('W');
        } else if (mode === 2) {
            this.player1 = new HumanPlayer('B');
            this.player2 = new HumanPlayer('W');
        } else if (mode === 3 ){
            this.player1 = new BotPlayer('B');
            this.player2 = new BotPlayer('W');
        }
    }

    /**
     * Starts the game.
     */
    public async startGame() {
        try {
            await this.gameLoop();
        } catch (e) {
            if (e === 'main') {
                console.log("Returning to main menu...");
                return;
            } else {
                throw e;
            }
        }
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
                try {
                    const move = await currentPlayer.decide_move(this.board);
                    if (this.board.makeMove(move[0], move[1], currentPlayer.get_color())) {
                        currentPlayer = currentPlayer === this.player1 ? this.player2 : this.player1;
                    } else {
                        console.log('Invalid move, try again.');
                    }
                } catch (e) {
                    if (e === 'main') {
                        throw 'main';
                    } else {
                        throw e;
                    }
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
        this.board.printBoard();
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

export default Othello;
