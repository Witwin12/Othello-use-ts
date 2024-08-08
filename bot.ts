import Board from './Board';
import Player from './Player';

type Disc = 'B' | 'W' | null;

/**
 * Class representing a bot player.
 */
class BotPlayer extends Player {
    constructor(color: Disc) {
        super(color);
    }

    /**
     * Decides the bot's move based on the available valid moves.
     * @param board - The current state of the board.
     * @returns A promise that resolves to the coordinates of the move ([row, column]).
     */
    public decide_move(board: Board): Promise<[number, number]> {
        return new Promise((resolve) => {
            const botMoves = board.get_valid_moves(this.color);
            setTimeout(() => {

            if (botMoves.length > 0) {
                    const [row, col] = botMoves[0];
                    resolve([row, col]);

            } else {
                throw new Error('No valid moves available for the bot.');
            }
            }, 100); // set a delay bot time
        });
    }
}

export default BotPlayer;
