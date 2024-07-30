import Board from './Board';

type Disc = 'B' | 'W' | null;

/**
 * Abstract class representing a player in the game.
 */
abstract class Player {
    color: Disc;

    /**
     * Constructor for Player.
     * @param color - The color of the player's discs ('B' for black, 'W' for white, null for empty).
     */
    constructor(color: Disc) {
        this.color = color;
    }

    /**
     * Gets the color of the player's discs.
     * @returns The color of the player's discs.
     */
    public get_color(): Disc {
        return this.color;
    }

    /**
     * Abstract method for deciding the player's move.
     * @param board - The current state of the board.
     * @returns A promise that resolves to the coordinates of the move ([row, column]).
     */
    public abstract decide_move(board: Board): Promise<[number, number]>;
}

export default Player;
