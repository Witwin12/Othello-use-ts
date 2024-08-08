const readlineSync = require('readline-sync');
import Board from './Board';
import Player from './Player';

type Disc = 'B' | 'W' | null;

/**
 * Class representing a human player.
 */
class HumanPlayer extends Player {
    constructor(color: Disc) {
        super(color);
    }

    /**
     * Prompts the human player to enter their move and validates the input.
     * @param board - The current state of the board.
     * @returns A promise that resolves to the coordinates of the move ([row, column]).
     */
    public decide_move(board: Board): Promise<[number, number]> {
        return new Promise((resolve,reject) => {
            const askMove = () => {
                const input: string = readlineSync.question('Enter your move (row,col): ');
                if (input.trim().toLowerCase() === 'main') {
                    reject('main'); // Indicate returning to main menu
                    return;
                }
                const [rowStr, colStr] = input.split(',').map(str => str.trim());
                const row = Number(rowStr);
                const col = Number(colStr);

                if (!isNaN(row) && !isNaN(col) && board.isOnBoard(row, col)) {
                    resolve([row, col]);
                } else {
                    console.log('Invalid move, try again.');
                    const validMoves = board.get_valid_moves(this.color);
                    board.printBoard();
                    console.log(`Valid moves: ${validMoves.map(move => `(${move[0]},${move[1]})`).join(', ')}`);
                    askMove(); // Ask again
                }
            };
            askMove();
        });
    }
}

export default HumanPlayer;
