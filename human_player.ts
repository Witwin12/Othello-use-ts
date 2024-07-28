import * as readline from 'readline';
import Board from './Board';
import Player from './Player';

type Disc = 'B' | 'W' | null;

class human_player extends Player {
    private rl: readline.Interface;

    constructor(color: Disc) {
        super(color);
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    public decide_move(board: Board): Promise<[number, number]> {
        return new Promise((resolve) => {
            const askMove = () => {
                this.rl.question('Enter your move (row,col): ', (input) => {
                    const [rowStr, colStr] = input.split(',').map(str => str.trim());
                    const row = Number(rowStr);
                    const col = Number(colStr);

                    if (!isNaN(row) && !isNaN(col) && board.isOnBoard(row, col)) {
                        
                        resolve([row, col]);
                    } else {
                        console.log('Invalid input. Please enter numbers in the format (row,col) within the board limits.');
                        askMove(); // Ask again without closing
                    }
                });
            };
            askMove();
        });
    }
}

export default human_player;
