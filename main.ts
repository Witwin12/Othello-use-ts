import Othello from "./Othello";
const readlineSync = require('readline-sync');

/**
 * Prompts the user to select the game mode.
 * @returns The selected game mode (1 for Human vs Bot, 2 for Human vs Human, 3 for Bot vs Bot).
 */
const selectMode = (): number => {
    while (true) {
        const input: string = readlineSync.question('Select mode (1 for Human vs Bot, 2 for Human vs Human, 3 for Bot vs Bot, "main" to return to main menu): ');
        if (input.trim().toLowerCase() === 'main') {
            return -1; // Indicate returning to main menu
        }

        const mode = Number(input.trim());
        if (mode === 1 || mode === 2 || mode === 3) {
            return mode;
        } else {
            console.log('Invalid selection. Please enter 1, 2, or 3.');
        }
    }
};

const startGame = async () => {
    const mode = selectMode();
    if (mode === -1) {
        return; // Return to main menu
    }

    const game = new Othello();
    game.setupGame(mode);
    await game.startGame();
};

const main = async () => {
    while (true) {;
        console.log("Welcome to the Othello Game Menu!");
        console.log("1: Start Game");
        console.log("2: Exit");

        const choice: string = readlineSync.question('Enter choice (1 or 2): ');

        if (choice === '1') {
            await startGame();
        } else if (choice === '2') {
            console.log("Exiting the game. Goodbye!");
            process.exit();
        } else {
            console.log("Invalid choice. Please enter 1 or 2.");
        }
    }
};

main();
