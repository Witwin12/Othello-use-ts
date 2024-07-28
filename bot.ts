import Board from './Board';
import Player from './Player';

type Disc = 'B' | 'W' | null;

class BotPlayer extends Player {
    constructor(color: Disc) {
        super(color);
    }

    public decide_move(board: Board): Promise<[number, number]> {
        return new Promise((resolve) => {
            const botMoves = board.get_valid_moves(this.color);
            if (botMoves.length > 0) {
                const [row, col] = botMoves[0];
                resolve([row, col]);
            } else {
                throw new Error('No valid moves available for the bot.');
            }
        });
    }
}

export default BotPlayer;
