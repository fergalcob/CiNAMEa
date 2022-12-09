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
// Calculates which puzzle to choose from based on date
function puzzleCalculator(overallTime, numberOfPuzzles) {
    puzzleSelect = overallTime;
    /*
    Calculates the puzzle selection from currently available list.
    Currently the project has a limited number of puzzles and so once the number of days passed has exceeded the total number of puzzles
    the choice will loop back to the starting point.
    Ideally, the project would be continuously updated and so this operation would no longer be necessary.
    */
    while (overallTime >= numberOfPuzzles) {
        overallTime = overallTime - numberOfPuzzles;
        puzzleSelect = overallTime;
    }
    return puzzleSelect;
}
var timeDifference = timeCalculation(initialDate, currentDate);

// On page load, puzzle is calculated and guesses are initialized 
window.onload = createPuzzle(timeDifference);

// Chooses puzzle and adds the correct image
function createPuzzle(overallDays) {
    var puzzleSelect = puzzleCalculator(overallDays, answers.length);
    while (puzzleImage.firstChild) { puzzleImage.removeChild(puzzleImage.firstChild); }
    // Create and set styling for puzzle image
    image = document.createElement("img");
    image.src = answers[puzzleSelect].URL;
    image.style.width = "100%";
    image.style.clipPath = "inset(40%)";
    image.id = "test";
    let section = document.getElementById("dailyImage");
    section.appendChild(image);

    // Set guesses and if already answered, retrieve guesses for todays puzzle
    if (isNaN(localStorage.getItem("days"))) {
        localStorage.setItem("days", "0");

    }
    else if ((Number(localStorage.getItem("days")) > overallDays) || (Number(localStorage.getItem("days")) < overallDays)) {
        localStorage.setItem("days", overallDays);
        localStorage.setItem("guesses", "0");
        localStorage.setItem("Answered", "Unanswered");
    }
    else if ((Number(localStorage.getItem("days")) < overallDays)) {
        localStorage.setItem("days", overallDays);
        localStorage.setItem("guesses", "0");
        localStorage.setItem("Answered", "Unanswered");
    }
    guesses = Number(localStorage.getItem("guesses"));

    // For previously answered puzzle, retrieve and set styling for guesses & image reveal
    for (var i = 0; i <= guesses; i++) {
        if (guesses === 0) {
            for (var count = 0; count < 6; count++) {
                guessResults[count].style.backgroundColor = "#666666";
            }
        }
        else if (guesses != 0 && i < guesses) {
            let test = image.style.clipPath;
            test = (test.replace("%\)", "").replace("inset\(", "")) / ((0.25 * guesses) + 0.75);
            image.style.clipPath = "inset\(" + test + "%\)";
            guessResults[i].style.backgroundColor = "#D30000";
            if (i < 5) { addHints(i); }
        }
        else if (i === guesses && localStorage.getItem("Answered") === "Correct") {
            guessResults[i].style.backgroundColor = "#3BB143";
            image.style.clipPath = "inset\(0\)";
        }
    }
    answerResolution();
}
// Determine relevant answers for dropdown to display based on form text input
function comparison(testVal) {
    try {
        comparisonTest = new RegExp(testVal, "i");
        if (testVal === "") {
            return [];
        }
        for (var i = 0; i < films[0].Name.length; i++) {
            if (films[0].Name[i].match(comparisonTest)) {
                tests.push(films[0].Name[i]);
            }
        }
    }
    // Alert the user if text input contains invalid characters
    catch (e) {
        alert("Your answer contains invalid characters");
    }
    return tests;
}

// Adds the answers found by comparison function to dropdown list
function answerCheck(testVal) {
    dropdown = document.getElementById("answers");
    let listItem = '';
    tests = [];
    tests = comparison(testVal);
    for (var i = 0; i < tests.length && i < 20; i++) {
        listItem += '<li onclick="autoFill(this.textContent)">' + tests[i] + '</li>';
    }
    dropdown.innerHTML = "<ul>" + listItem + "</ul>";
}
function autoFill(selected) {
    document.getElementById("answer").value = selected;
    while (dropdown.firstChild) { dropdown.removeChild(dropdown.firstChild);}
}
document.getElementById("answerContent").addEventListener("keyup", function (e) {
    if (e.target) {
        answerCheck(e.target.value);
    }
}
);

// Add hint to hint section if guess is incorrect
function addHints(newHint) {
    let hints = hintList.appendChild(document.createElement('li'));
    var hintItems = ["Year of Release", "Genre", "Director", "Runtime", "Rotten Tomatoes Score"];
    hints.innerHTML = "<span class=\"hintTitle\">" + hintItems[newHint] + ": </span>" + answers[puzzleSelect][hintItems[newHint]];
}
