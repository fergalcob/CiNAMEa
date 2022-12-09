// Initial variable declarations
var initialDate = new Date(2022, 10, 15);
var currentDate = new Date();
var guesses;
let tests = [];
let comparisonTest = '';
let guessResults = document.getElementById("guessValues").children;
let puzzleImage = document.getElementById("dailyImage");
let hintList = document.getElementById("hints");
let answerContent = document.getElementById("answerContent");
let image;
let timerID;
let dropdown;
let puzzleSelect;

initialDate.setHours(0, 0, 0, 0);
currentDate.setHours(0, 0, 0, 0);

// Determines days elapsed since first puzzle
function timeCalculation(initialDate, currentDate) {
    timeDifference = Math.floor((currentDate.getTime() - initialDate.getTime()) / 86400000);
    return timeDifference;
}

// Calculate time remaining until midnight in order to determine when next puzzle will be generated
function getTimeRemaining() {
    var midnightTonight = new Date();
    midnightTonight.setHours(24, 0, 0, 0);
    var beginningCountdown = new Date();
    var countdown = document.getElementById("countdown");
    while (Date.parse(midnightTonight) != Date.parse(beginningCountdown)) {
        let total = Date.parse(midnightTonight) - Date.parse(beginningCountdown);
        let seconds = Math.floor((total / 1000) % 60);
        let minutes = Math.floor((total / 1000 / 60) % 60);
        let hours = Math.floor((total / (1000 * 60 * 60)) % 24);
        if (hours < 10 || minutes < 10 || seconds < 10) {
            if (hours < 10) {
                hours = '0' + hours;
            }
            if (minutes < 10) {
                minutes = '0' + minutes;
            }
            if (seconds < 10) {
                seconds = '0' + seconds;
            }
        }
        countdown.innerHTML = hours + "H:" + minutes + "M:" + seconds + "S";
        return [];
    }
}