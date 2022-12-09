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
    image.id = "puzzleImage";
    image.alt = "";
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

// On click to view the archive, create the archive buttons for the puzzles until this point
function archive() {
    let archiveSection = document.getElementById("archive");
    for (var i = 0; i < timeDifference; i++) {
        let archiveItem = document.createElement("button");
        archiveItem.setAttribute('class', "archiveButton");
        archiveItem.setAttribute('value', i);
        archiveItem.innerHTML = "<p>" + (i + 1) + "</p>";
        archiveSection.appendChild(archiveItem);
    }
    var btn = document.getElementsByClassName("archiveButton");
    for (i = 0; i < btn.length; i++) {
        btn[i].addEventListener("click", function () {
            // Reloads the text input form after button is clicked to retrieve previous puzzle
            $("#answerContent").load(location.href + " #answerContent");
            // Stop countdown timer function from running when answerContent div is reloaded
            window.clearInterval(timerID);
            createPuzzle(this.value);
            // Remove hints and archive buttons for the currently answered puzzle
            var hintRemoval = document.getElementById("hints");
            while (hintRemoval.firstChild) { hintRemoval.removeChild(hintRemoval.firstChild);}
            while (archiveSection.firstChild) { archiveSection.removeChild(archiveSection.firstChild);}
        });
    }
}

// Retrieves previous puzzle after click on archive button
function retrievePuzzle() {
    let archiveRetrieve = this.value;
    createPuzzle(archiveRetrieve);
}
// Replaces answer submission on correct answer/6 incorrect guesses and starts countdown to next puzzle
function answerResolution() {
    if (localStorage.getItem("Answered") === "Correct") {
        answerContent.innerHTML = "<h2>You Got It!</h2>" + "<span class=\"answerTitle\">The answer was:</span> " + answers[puzzleSelect].Name + "</p><span class=\"answerTitle\">Next puzzle in:</span> " + "<span id=\"countdown\"></span>" + "<p>View the <span id=\"archives\">Archives</span>";
        window.setTimeout(getTimeRemaining, 0);
        timerID = window.setInterval(getTimeRemaining, 1000);
        document.getElementById("archives").addEventListener("click", function () {archive();});
    }
    else if (localStorage.getItem("Answered") === "Incorrect" && guesses === 6) {
        image.style.clipPath = "inset\(0\)";
        answerContent.innerHTML = "<h2>Unlucky</h2>" + "<p><span class=\"answerTitle\">The answer was:</span> " + answers[puzzleSelect].Name + "</p><span class=\"answerTitle\">Next puzzle in:</span> " + "<span id=\"countdown\"></span>" + "<p>View the <span id=\"archives\">Archives</span>";
        window.setTimeout(getTimeRemaining, 0);
        timerID = window.setInterval(getTimeRemaining, 1000);
        document.getElementById("archives").addEventListener("click", function () { archive();});
    }
    else {
        return [];
    }
}

// Determine if answer submitted is correct
function guessingGame() {
    let question = document.getElementById("answer").value;
    let checkAnswer = answers[puzzleSelect].Name;
    var testAnswer = checkAnswer.localeCompare(question, undefined, { sensitivity: "accent" });
    if (testAnswer === 0) {
        dropdown.innerHTML = "<p>You got it!</p>";
        image.style.clipPath = "inset\(0\)";
        guessResults[guesses].style.backgroundColor = "#3BB143";
        localStorage.setItem("guesses", guesses);
        localStorage.setItem("Answered", "Correct");
        answerResolution();
    }
    else {
        if (guesses < 5) {
            addHints(guesses);
        }
        guessResults[guesses].style.backgroundColor = "#D30000";
        guesses++;
        // Change styling of puzzle image to increase dimensions based on incorrect answer
        let test = image.style.clipPath;
        let answer = (test.replace("%\)", "").replace("inset\(", "")) / ((0.25 * guesses) + 0.75);
        image.style.clipPath = "inset\(" + answer + "%\)";
        localStorage.setItem("guesses", guesses);
        localStorage.setItem("Answered", "Incorrect");
        answerResolution();
    }
}

// Waits for enter press within text input to prevent page refresh and activate submit button in place of it
document.addEventListener("keypress", function (event) {
    if (event.key === "Enter" && event.target.closest("#answer")) {
        event.preventDefault();
        document.getElementById("submitAnswer").click();
    }
});

// Waits for enter press on help button to open via keyboard controls
document.addEventListener("keypress", function (event) {
    if (event.key === "Enter" && event.target.closest("#help")) {
        event.preventDefault();
        document.getElementById("help").click();
    }
});
// Waits for enter press on exit button to open via keyboard controls and close overlay
document.addEventListener("keypress", function (event) {
    if (event.key === "Enter" && event.target.closest("#closeOverlay")) {
        event.preventDefault();
        document.getElementById("closeOverlay").click();
    }
});

// Activates help overlay on click of help icon
function on() {
    document.getElementById("overlay").style.display = "block";
}

// Disable help overlay on click of x icon within help window
function off() {
    document.getElementById("overlay").style.display = "none";
}

