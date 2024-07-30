type Disc = 'B' | 'W' | null;

/**
 * Class representing the Othello game board.
 */
class Board {
    private board: Disc[][]; // create board 8*8
    public currentPlayer: Disc; // track turn player
    private readonly directions: number[][] = [ // show directions that can place
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    constructor() {
        this.board = this.initializeBoard();
        this.currentPlayer = 'B'; // set player B start first 
    }

    /**
     * Initializes the game board with the starting positions.
     * @returns The initialized game board.
     */
    private initializeBoard(): Disc[][] {
        const board: Disc[][] = Array.from({ length: 8 }, () => Array(8).fill(null));
        board[3][3] = 'W';
        board[3][4] = 'B';
        board[4][3] = 'B';
        board[4][4] = 'W';
        return board; // create board 
    }

    /**
     * Checks if the given coordinates are within the board limits.
     * @param x - The row index.
     * @param y - The column index.
     * @returns True if the coordinates are within the board, false otherwise.
     */
    public isOnBoard(x: number, y: number): boolean {
        return x >= 0 && x < 8 && y >= 0 && y < 8; // check if the position is within the board
    }

    /**
     * Gets the opponent's disc color.
     * @param player - The current player's disc color.
     * @returns The opponent's disc color.
     */
    private getOpponent(player: Disc): Disc { // change turn player
        return player === 'B' ? 'W' : 'B';
    }

    /**
     * Gets the valid moves for the given player.
     * @param player - The current player's disc color.
     * @returns An array of valid move coordinates.
     */
    public get_valid_moves(player: Disc): [number, number][] {
        const validMoves: [number, number][] = [];
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                if (this.isValidMove(x, y, player)) {
                    validMoves.push([x, y]);
                }
            }
        }
        return validMoves; // show position that player can play
    }

    /**
     * Checks if a move is valid for the given player.
     * @param x - The row index of the move.
     * @param y - The column index of the move.
     * @param player - The current player's disc color.
     * @returns True if the move is valid, false otherwise.
     */
    private isValidMove(x: number, y: number, player: Disc): boolean {
        if (this.board[x][y] !== null) return false;

        const opponent = this.getOpponent(player);
        for (const [dx, dy] of this.directions) {
            let nx = x + dx;
            let ny = y + dy;
            let hasOpponentDisc = false;

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

    /**
     * Makes a move on the board for the given player.
     * @param x - The row index of the move.
     * @param y - The column index of the move.
     * @param player - The current player's disc color.
     * @returns True if the move was successful, false otherwise.
     */
    public makeMove(x: number, y: number, player: Disc): boolean {
        if (!this.isValidMove(x, y, player)) return false;

        this.board[x][y] = player;
        this.flipDiscs(x, y, player);
        this.currentPlayer = this.getOpponent(player);
        return true;
    }

    /**
     * Flips the discs on the board after a move.
     * @param x - The row index of the move.
     * @param y - The column index of the move.
     * @param player - The current player's disc color.
     */
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

    /**
     * Prints the current state of the board.
     */
    public printBoard(): void {
        console.log('Current board:');
        this.board.forEach(row => {
            console.log(row.map(cell => (cell === null ? '.' : cell)).join(' '));
        });
        console.log(`Current player: ${this.currentPlayer}`);
    }

    /**
     * Checks if the game has ended.
     * @returns True if the game has ended, false otherwise.
     */
    public isGameOver(): boolean {
        const player1Moves = this.get_valid_moves('B');
        const player2Moves = this.get_valid_moves('W');
        return player1Moves.length === 0 && player2Moves.length === 0;
    }

    /**
     * Counts the discs on the board.
     * @returns An object with the count of black and white discs.
     */
    public countDiscs(): { B: number, W: number } {
        let blackCount = 0;
        let whiteCount = 0;
        for (let row of this.board) {
            for (let cell of row) {
                if (cell === 'B') blackCount++;
                if (cell === 'W') whiteCount++;
            }
        }
        return { B: blackCount, W: whiteCount };
    }

    /**
     * Determines the winner of the game.
     * @returns 'B' if black wins, 'W' if white wins, 'D' if it's a draw, 'N' if the game is not over.
     */
    public getWinner(): 'B' | 'W' | 'D' | 'N' {
        if (!this.isGameOver()) return 'N';

        const { B, W } = this.countDiscs();
        if (B > W) return 'B';
        if (W > B) return 'W';
        return 'D';
    }
}

export default Board;
