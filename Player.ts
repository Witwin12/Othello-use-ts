import Board from './Board';

type Disc = 'B' | 'W' | null;

abstract class Player {
    color: Disc;

    constructor(color: Disc) {
        this.color = color;
    }

    public get_color(): Disc {
        return this.color;
    }

    public abstract decide_move(board: Board): Promise<[number, number]>;
}

export default Player;
