// Initial variable declarations
var initialDate = new Date(2022, 10, 15);
var currentDate = new Date();
var guesses;
let textMatches = [];
let comparisonTest = '';
let guessResults = document.getElementById("guessValues").children;
let puzzleImage = document.getElementById("dailyImage");
let hintList = document.getElementById("hints");
let answerContent = document.getElementById("answerContent");
let image;
let countdownID;
let dropdown;
let puzzleSelect;
let archiveEnabled;
let archiveRetrieve;

// Set start and current times to midnight so that days passed return integer values when calculating days elapsed
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
        // Calculate the time remaining until midnight
        let totalTimeRemaining = Date.parse(midnightTonight) - Date.parse(beginningCountdown);
        let secondsRemaining = Math.floor((totalTimeRemaining / 1000) % 60);
        let minutesRemaining = Math.floor((totalTimeRemaining / 1000 / 60) % 60);
        let hoursRemaining = Math.floor((totalTimeRemaining / (1000 * 60 * 60)) % 24);
        // Adds leading zero to countdown if less than 10 units remaining
        if (hoursRemaining < 10 || minutes < 10 || seconds < 10) {
            if (hoursRemaining < 10) {
                hoursRemaining = '0' + hoursRemaining;
            }
            if (minutesRemaining < 10) {
                minutesRemaining = '0' + minutesRemaining;
            }
            if (secondsRemaining < 10) {
                secondsRemaining = '0' + secondsRemaining;
            }
        }
        countdown.innerHTML = hoursRemaining+ "H:" + minutesRemaining + "M:" + secondsRemaining + "S";
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
function comparison(comparisonValue) {
    try {
        comparisonTest = new RegExp(comparisonValue, "i");
        if (comparisonValue === "") {
            return [];
        }
        for (var i = 0; i < films[0].Name.length; i++) {
            if (films[0].Name[i].match(comparisonTest)) {
                textMatches.push(films[0].Name[i]);
            }
        }
    }
    // Alert the user if text input contains invalid characters
    catch (e) {
        alert("Your answer contains invalid characters");
    }
    return textMatches;
}

// Adds the answers found by comparison function to dropdown list
function answerCheck(textFragments) {
    dropdown = document.getElementById("answers");
    let listItem = '';
    textMatches = [];
    textMatches = comparison(textFragments);
    for (var i = 0; i < textMatches.length && i < 20; i++) {
        listItem += '<li onclick="autoFill(this.textContent)">' + textMatches[i] + '</li>';
    }
    dropdown.innerHTML = "<ul>" + listItem + "</ul>";
}
function autoFill(selected) {
    document.getElementById("answer").value = selected;
    while (dropdown.firstChild) { dropdown.removeChild(dropdown.firstChild); }
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
    if (archiveEnabled === false) {
        for (var i = 0; i < timeDifference; i++) {
            let archiveItem = document.createElement("button");
            archiveItem.setAttribute('class', "archiveButton");
            archiveItem.setAttribute('value', i);
            archiveItem.setAttribute('id', i);
            archiveItem.innerHTML = "<p>" + (i + 1) + "</p>";
            archiveSection.appendChild(archiveItem);
        }
        // Prevent archive from being written multiple times
        archiveEnabled = true;
        // Prevent same archive button from being pressed multiple times in a row
        if (archiveRetrieve !== undefined) {
            let deactivateButton = document.getElementById(archiveRetrieve);
            deactivateButton.disabled = true;
            deactivateButton.style.backgroundColor = "#797979";
        }
    }
    var btn = document.getElementsByClassName("archiveButton");
    for (i = 0; i < btn.length; i++) {
        btn[i].addEventListener("click", function () {
            // Reloads the text input form after button is clicked to retrieve previous puzzle
            $("#answerContent").load(location.href + " #answerContent");
            // Stop countdown timer function from running when answerContent div is reloaded
            window.clearInterval(countdownID);
            // Retrieves previous puzzle after click on archive button
            archiveRetrieve = this.value;
            createPuzzle(archiveRetrieve);
            // Remove hints and archive buttons for the currently answered puzzle
            var hintRemoval = document.getElementById("hints");
            while (hintRemoval.firstChild) { hintRemoval.removeChild(hintRemoval.firstChild); }
            while (archiveSection.firstChild) { archiveSection.removeChild(archiveSection.firstChild); }
        });
    }
}

// Replaces answer submission on correct answer/6 incorrect guesses and starts countdown to next puzzle
function answerResolution() {
    if (localStorage.getItem("Answered") === "Correct") {
        answerContent.innerHTML = "<h2>You Got It!</h2>" + "<span class=\"answerTitle\">The answer was:</span> " + answers[puzzleSelect].Name + "</p><span class=\"answerTitle\">Next puzzle in:</span> " + "<span id=\"countdown\"></span>" + "<p><span id=\"archives\">View the Archives</span>";
        // Display countdown timer without initial delay
        window.setTimeout(getTimeRemaining, 0);
        // Calls countdown timer function to update every second
        countdownID = window.setInterval(getTimeRemaining, 1000);
        document.getElementById("archives").addEventListener("click", function () { archive(); });
        archiveEnabled = false;
    }
    else if (localStorage.getItem("Answered") === "Incorrect" && guesses === 6) {
        image.style.clipPath = "inset\(0\)";
        answerContent.innerHTML = "<h2>Unlucky!</h2>" + "<p><span class=\"answerTitle\">The answer was:</span> " + answers[puzzleSelect].Name + "</p><span class=\"answerTitle\">Next puzzle in:</span> " + "<span id=\"countdown\"></span>" + "<p><span id=\"archives\" tabindex=\"0\">View the Archives</span>";
        window.setTimeout(getTimeRemaining, 0);
        countdownID = window.setInterval(getTimeRemaining, 1000);
        document.getElementById("archives").addEventListener("click", function () { archive(); });
        archiveEnabled = false;
    }
    else {
        return [];
    }
}

// Determine if answer submitted is correct
function guessingGame() {
    let answerSubmission = document.getElementById("answer");
    let checkAnswer = answers[puzzleSelect].Name;
    var testAnswer = checkAnswer.localeCompare(answerSubmission.value, undefined, { sensitivity: "accent" });
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
        // Reset text input field on submission of guess
        answerSubmission.value = "";
        answerCheck(answerSubmission.value);
        // Change styling of puzzle image to increase dimensions based on incorrect answer
        let test = image.style.clipPath;
        // Update image dimensions shown based on incorrect guesses
        let answer = (test.replace("%\)", "").replace("inset\(", "")) / ((0.25 * guesses) + 0.75);
        image.style.clipPath = "inset\(" + answer + "%\)";
        localStorage.setItem("guesses", guesses);
        localStorage.setItem("Answered", "Incorrect");
        answerResolution();
    }
}

// Waits for enter press on help button to open via keyboard controls
document.addEventListener("keypress", function (event) {
    if (event.key === "Enter" && event.target.closest("#help")) {
        event.preventDefault();
        document.getElementById("help").click();
    }
    // Waits for enter press on exit button to open via keyboard controls and close overlay
    else if (event.key === "Enter" && event.target.closest("#closeOverlay")) {
        event.preventDefault();
        document.getElementById("closeOverlay").click();
    }
    // Waits for enter press on archive button to open via keyboard controls to create archive list
    else if (event.key === "Enter" && event.target.closest("#archives")) {
        event.preventDefault();
        document.getElementById("archives").click();
    }
    // Waits for enter press within text input to prevent page refresh and activate submit button in place of it
    else if(event.key === "Enter" && event.target.closest("#answer")) {
        event.preventDefault();
        document.getElementById("submitAnswer").click();
    }
});

// Activates help overlay on click of help icon as per https://www.w3schools.com/howto/howto_css_overlay.asp
function on() {
    document.getElementById("overlay").style.display = "block";
}

// Disable help overlay on click of x icon within help window as per https://www.w3schools.com/howto/howto_css_overlay.asp
function off() {
    document.getElementById("overlay").style.display = "none";
}

