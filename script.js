import { Sudoku } from "./sudoku.js";
import { BOX_SIZE, GRID_SIZE, convertIndexToPosition, convertPositionToIndex } from "./untilities.js";
import { startTimer, stopTimer} from "./timer.js";

const sudoku = new Sudoku();
let cells;
let selectedCellIndex;
let selectedCell;

startTimer();
init();

function init() {
    initCells();
    initNumbers();
    initRemover();
    initKeyEvent();
}

function initCells() {
    cells = document.querySelectorAll('.cell');
    fillCells();
    initCellsEvent();
}

function fillCells() {
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const { row, column } = convertIndexToPosition(i);

        if (sudoku.grid[row][column] != null) {
            cells[i].classList.add('filled');
            cells[i].innerHTML = sudoku.grid[row][column];
        }
    }
}

function initCellsEvent() {
    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => onCellClick(cell, index));
    });
}

function onCellClick(clicedCell, index) {
    cells.forEach(cell => cell.classList.remove('selected', 'highlighted','error'));

    if (clicedCell.classList.contains('filled')) {
        selectedCellIndex = null;
        selectedCell = null;
    } else {
        selectedCellIndex = index;
        selectedCell = clicedCell;
        clicedCell.classList.add('selected');
        highlightCellBy(index);
    }
    if (clicedCell.innerHTML === '') return;
    cells.forEach(cell => {
        if (cell.innerHTML === clicedCell.innerHTML) cell.classList.add('selected');
    });
}

function highlightCellBy(index) {
    highlightCollumBy(index);
    highlightRowBy(index);
    highlightBoxBy(index);
}

function highlightCollumBy(index) {
    const column = index % GRID_SIZE;
    for (let row = 0; row < GRID_SIZE; row++) {
        const cellIndex = convertPositionToIndex(row, column);
        cells[cellIndex].classList.add('highlighted');
    }
}

function highlightRowBy(index) {
    const row = Math.floor(index / GRID_SIZE);
    for (let column = 0; column < GRID_SIZE; column++) {
        const cellIndex = convertPositionToIndex(row, column);
        cells[cellIndex].classList.add('highlighted');
    }
}

function highlightBoxBy(index) {
    const column = index % GRID_SIZE;
    const row = Math.floor(index / GRID_SIZE);
    const firstRowInBox = row - row % BOX_SIZE;
    const firstColumnInBox = column - column % BOX_SIZE;

    for (let iRow = firstRowInBox; iRow < firstRowInBox + BOX_SIZE; iRow++) {
        for (let iColumn = firstColumnInBox; iColumn < firstColumnInBox + BOX_SIZE; iColumn++) {
            const cellIndex = convertPositionToIndex(iRow, iColumn);
            cells[cellIndex].classList.add('highlighted');
        }
    }
}

function initNumbers() {
    const numbers = document.querySelectorAll('.number');
    numbers.forEach(number => {
        number.addEventListener('click', () => onNumberClick(parseInt(number.innerHTML)));
    });
}

function onNumberClick(number) {
    if (!selectedCell) return;
    if (selectedCell.classList.contains('filled')) return;

    cells.forEach(cell => cell.classList.remove('error','shake', 'zoom','selected'));
    selectedCell.classList.add('selected');
    setValueInSelectedCell(number);

    if (!sudoku.hasEmptyCells()){
        setTimeout(()=> winAnimation(),500);
    }
}


function updateNumberButtonsVisibility() {
    const numbers = document.querySelectorAll('.number');
    const count = Array(10).fill(0);

    for (let row = 0; row < GRID_SIZE; row++) {
        for (let column = 0; column < GRID_SIZE; column++) {
            const value = sudoku.grid[row][column];
            if (value !== null) count[value]++;
        }
    }

    numbers.forEach(number => {
        const num = parseInt(number.innerHTML);
        if (count[num] >= 9) {
            number.classList.add('disabled');
        } else {
            number.classList.remove('disabled');
        }
    });
}


function setValueInSelectedCell(value) {
    const { row, column } = convertIndexToPosition(selectedCellIndex);
    const duplicatesPositions = sudoku.getDuplicatePositions(row, column, value);
    if (duplicatesPositions.length) {
        highlightDuplicates(duplicatesPositions);
        return;
    }
    sudoku.grid[row][column] =value;
    selectedCell.innerHTML = value;
    setTimeout(()=> selectedCell.classList.add('zoom'), 0);

    onCellClick(selectedCell, selectedCellIndex);

    updateNumberButtonsVisibility();
}

function highlightDuplicates(duplicatesPositions) {
    duplicatesPositions.forEach(duplicate => {
        const index = convertPositionToIndex(duplicate.row, duplicate.column);
        setTimeout(() => cells[index].classList.add('error', 'shake'), 0);
    });
}

function initRemover(){
    const remove = document.querySelector('.remove');
    remove.addEventListener('click', () => onRemoveClick());
}
function onRemoveClick(){
    if (!selectedCell) return;
    if(selectedCell.classList.contains('filled')) return;

    cells.forEach(cell => cell.classList.remove('error','shake', 'zoom','selected'));
    selectedCell.classList.add('selected');

    const {row, column} = convertIndexToPosition (selectedCellIndex);
    selectedCell.innerHTML = '';
    sudoku.grid[row][column] = null;

    updateNumberButtonsVisibility();
}

updateNumberButtonsVisibility();

function initKeyEvent (){
    document.addEventListener('keydown', event =>{
        if(event.key === 'Backspace'){
            onRemoveClick();
        } else if (event.key >= '1' && event.key <="9"){
            onNumberClick(parseInt(event.key));
        }
    });
}



function winAnimation() {
    stopTimer();

    cells.forEach(cell => cell.classList.remove('error', 'shake', 'zoom', 'selected', 'highlighted'));
    setTimeout(() => {
        cells.forEach((cell, i) => {
            setTimeout(() => {
                cell.style.transition ='opacity 0.5s ease-out'
                cell.style.opacity = '0';
            }, i * 20);
        });

        setTimeout(() => {
            cells.forEach((cell, i) => {
                setTimeout(() => {
                    cell.style.opacity = '1';
                }, i * 20);
            });
        }, 800);
    }, 200);
}
    document.getElementById('restart-btn').addEventListener('click', function() {
    setTimeout(function() {
    location.reload();
    });
});