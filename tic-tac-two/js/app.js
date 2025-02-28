import * as UI from "./ui.js";
import { GameBrain } from "./game.js";

let h1 = document.createElement("h1");
h1.innerHTML = "Tic Tac Two";
document.body.appendChild(h1);

let game = new GameBrain();

game.makeAMove(1, 1);
game.makeAMove(0, 0);

let board = UI.getBoard(game.board);
document.body.appendChild(board);