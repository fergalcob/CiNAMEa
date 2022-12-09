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
