export function getInitialBoard(
    boardState: (string | undefined)[][], // 2D array of strings or undefined for the board state
    cellUpdateFn: (i: number, j: number, e: Event) => void, // Function to handle cell updates
    isInGridFn: (i: number, j: number) => boolean // Function to check if a cell is in the grid
): HTMLDivElement {
    let board: HTMLDivElement = document.createElement("div");
    board.classList.add("board");

    for (let i = 0; i < 5; i++) {
        let row: HTMLDivElement = document.createElement("div");
        row.classList.add("row");

        for (let j = 0; j < 5; j++) {
            let cell: HTMLDivElement = document.createElement("div");
            cell.classList.add("cell");

            if (isInGridFn(i, j)) {
                cell.classList.add("in-grid");
            } else {
                cell.classList.remove("in-grid");
            }

            cell.addEventListener("click", (e: Event) => {
                console.log(`Cell clicked at coordinates: (${i}, ${j})`);
                cellUpdateFn(i, j, e);
            });

            cell.innerHTML = boardState[i][j] || "&nbsp;";
            row.appendChild(cell);
        }
        board.appendChild(row);
    }
    return board;
}


