import { findEmptyCell } from "./sudokuGenerat.js";

let timerInterval;
let elapsedTime = 0; // Час у секундах
let isPaused = false;

export function startTimer() {
    stopTimer(); // Щоб уникнути подвійного запуску
    timerInterval = setInterval(() => {
        if (!isPaused) {
            elapsedTime++;
            updateTimerDisplay();
        }
    }, 1000);
}

export function stopTimer() {
    clearInterval(timerInterval);
}

export function BtnPause() {
    isPaused = !isPaused;
    document.getElementById('pause-btn').textContent = isPaused ? "▶️" : "⏸️";
}

function updateTimerDisplay() {
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    document.getElementById('timer').textContent = 
    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Підключаємо обробник події до кнопки паузи
document.getElementById('pause-btn').addEventListener('click', BtnPause);

export function checkGameStatus(grid) {
    if (findEmptyCell(grid) === null) { // Якщо немає порожніх клітинок
        stopTimer(); 
    }
}
