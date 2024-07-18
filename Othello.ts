import * as readline from 'readline';

type Disc = 'B' | 'W' | null; //create Disc type can be B,W or NULL

class Othello {
    private board: Disc[][];//create board 8*8
    private currentPlayer: Disc;// track turn player
    private readonly directions: number[][] = [ //show directions that can place
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    constructor() {
        this.board = this.initBoard();
        this.currentPlayer = 'B';//set player B start first ปัก
    }

    private initBoard(): Disc[][] {
        const board: Disc[][] = Array.from({ length: 8 }, () => Array(8).fill(null));
        board[3][3] = 'W';
        board[3][4] = 'B';
        board[4][3] = 'B';
        board[4][4] = 'W';
        return board;//create board 
    }

    private isOnBoard(x: number, y: number): boolean {
        return x >= 0 && x < 8 && y >= 0 && y < 8;// check player input correct
    }

    private getOpponent(player: Disc): Disc {
        return player === 'B' ? 'W' : 'B'; //change turn player
    }

    private isValidMove(x: number, y: number, player: Disc): boolean {
        if (this.board[x][y] !== null) return false; 

        const opponent = this.getOpponent(player);
        for (const [dx, dy] of this.directions) {
            let nx = x + dx;
            let ny = y + dy;
            let hasOpponentDisc = false; //check position that player can play

            while (this.isOnBoard(nx, ny) && this.board[nx][ny] === opponent) {
                nx += dx;
                ny += dy;
                hasOpponentDisc = true;
            }

            if (hasOpponentDisc && this.isOnBoard(nx, ny) && this.board[nx][ny] === player) {
                return true;
            }
        }
        return false;
    }

    public getValidMoves(player: Disc): [number, number][] {
        const validMoves: [number, number][] = [];
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                if (this.isValidMove(x, y, player)) {
                    validMoves.push([x, y]);
                }
            }
        }
        return validMoves; //show position that player can play
    }

    private flipDiscs(x: number, y: number, player: Disc): void {
        const opponent = this.getOpponent(player);

        for (const [dx, dy] of this.directions) {
            let nx = x + dx;
            let ny = y + dy;
            const discsToFlip: [number, number][] = [];

            while (this.isOnBoard(nx, ny) && this.board[nx][ny] === opponent) {
                discsToFlip.push([nx, ny]);
                nx += dx;
                ny += dy;
            }

            if (this.isOnBoard(nx, ny) && this.board[nx][ny] === player) {
                for (const [fx, fy] of discsToFlip) {
                    this.board[fx][fy] = player;
                }
            }
        }
    }

    public makeMove(x: number, y: number, player: Disc): boolean {
        if (!this.isValidMove(x, y, player)) return false;

        this.board[x][y] = player;
        this.flipDiscs(x, y, player);
        this.currentPlayer = this.getOpponent(player);
        return true;
    }

    public getCurrentPlayer(): Disc {
        return this.currentPlayer;
    }

    public printBoard(): void {
        console.log(this.board.map(row => row.map(cell => cell || '.').join(' ')).join('\n'));
    }
public checkGameEnd(): void {
    const bCount = this.board.flat().filter(cell => cell === 'B').length;
    const wCount = this.board.flat().filter(cell => cell === 'W').length;

    console.log(`Final Score - B: ${bCount}, W: ${wCount}`);

    if (bCount > wCount) {
        console.log('Player B wins!');
    } else if (wCount > bCount) {
        console.log('Player W wins!');
    } else {
        console.log('The game is a draw!');
    }
}

}

// Game Loop with Input Handling
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const game = new Othello();

function displayValidMoves() {
    const validMoves = game.getValidMoves(game.getCurrentPlayer());
    console.log('Valid moves:', validMoves.map(move => `(${move[0]},${move[1]})`).join(', '));
}

function promptMove() {
    game.printBoard();
    const currentPlayer = game.getCurrentPlayer();
    console.log(`Current player: ${currentPlayer}`);

    displayValidMoves();

    rl.question('Enter your move (row,col): ', (input) => {
        const [rowStr, colStr] = input.split(',');
        const row = Number(rowStr);
        const col = Number(colStr);

        if (!isValidInput(rowStr, colStr, row, col)) {
            console.log('Invalid input. Please enter your move in the format "row,col" with values between 0 and 7.');
            promptMove(); // Prompt again for a valid move
            return;
        }

        if (game.makeMove(row, col, currentPlayer)) {
            // Check if the game should end
            const validMovesNext = game.getValidMoves(game.getCurrentPlayer());
            if (validMovesNext.length === 0) {
                console.log('No valid moves left for both players. Game over!');
                game.checkGameEnd(); // Call to check the winner
                rl.close(); // Close the input stream
            } else {
                promptMove(); // Continue the game
            }
        } else {
            console.log('Invalid move. Try again.');
            promptMove(); // Prompt again for a valid move
        }
    });
}
function isValidInput(rowStr: string, colStr: string, row: number, col: number): boolean {
    if (!rowStr || !colStr) return false;
    if (isNaN(row) || isNaN(col)) return false;
    if (row < 0 || row > 7 || col < 0 || col > 7) return false;
    return true;
}

promptMove();