export function getInitialBoard(boardState, cellUpdateFn, isInGridFn) {
    let board = document.createElement("div");
    board.classList.add("board");

    for (let i = 0; i < 5; i++) {
        let row = document.createElement("div");
        row.classList.add("row");

        for (let j = 0; j < 5; j++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");

            if (isInGridFn(i, j)) {
                cell.classList.add("in-grid");
            } else {
                cell.classList.remove("in-grid");
            }

            cell.addEventListener("click", (e) => { 
                console.log(`Cell clicked at coordinates: (${i}, ${j})`);
                cellUpdateFn(i, j, e) });
            cell.innerHTML = boardState[i][j] || "&nbsp;";
            row.appendChild(cell);
        }
        board.appendChild(row);
    }
    return board;
};


