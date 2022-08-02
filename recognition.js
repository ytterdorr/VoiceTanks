var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

// var colors = ['aqua', 'azure', 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral', 'crimson', 'cyan', 'fuchsia', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'indigo', 'ivory', 'khaki', 'lavender', 'lime', 'linen', 'magenta', 'maroon', 'moccasin', 'navy', 'olive', 'orange', 'orchid', 'peru', 'pink', 'plum', 'purple', 'red', 'salmon', 'sienna', 'silver', 'snow', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'white', 'yellow'];

let directions = ['left', 'right', 'back', 'forward', 'shoot']

var recognition = new SpeechRecognition();
if (SpeechGrammarList) {
    // SpeechGrammarList is not currently available in Safari, and does not have any effect in any other browser.
    // This code is provided as a demonstration of possible capability. You may choose not to use it.
    var speechRecognitionList = new SpeechGrammarList();
    var grammar = '#JSGF V1.0; grammar directions; public <direction> = ' + directions.join(' | ') + ' ;'
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
}
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var diagnostic = document.querySelector('.output');
var bg = document.querySelector('html');
var hints = document.querySelector('.hints');
let output = document.querySelector('.output')

var colorHTML = '';
directions.forEach(function (v, i, a) {
    console.log(v, i);
    colorHTML += '<span style="background-direction:' + i % 2 == 0 ? 'gray' : 'white' + ';"> ' + v + ' </span>';
});
hints.innerHTML = "";

function startListening() {
    recognition.start();
    console.log('Ready to receive a direction command.');
    document.querySelector('.start-button').classList.add('gray-border')
}

// document.body.onclick = function () {
//     startListening();
// }

document.querySelector('.start-button').addEventListener('click', startListening)

recognition.onresult = function (event) {

    // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
    // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
    // It has a getter so it can be accessed like an array
    // The first [0] returns the SpeechRecognitionResult at the last position.
    // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
    // These also have getters so they can be accessed like arrays.
    // The second [0] returns the SpeechRecognitionAlternative at position 0.
    // We then return the transcript property of the SpeechRecognitionAlternative object

    // remove border on start button
    document.querySelector('.start-button').classList.remove('gray-border')
    var direction = event.results[0][0].transcript;
    diagnostic.textContent = 'Result received: ' + direction + '.';
    output.innerHTML = direction;
    console.log('Confidence: ' + event.results[0][0].confidence);

    // Update cannonballs
    moveCannonBalls();

    // handle turning
    if (direction == "left" || direction == "right") {
        turnPlayer(direction)
    }

    // Handle moving
    if (direction == "forward" || direction == "back") {
        movePlayer(direction)
    }

    if (direction == "shoot") {
        createCannonBall(playerPosition, playerDirection)
    }

    // Finally draw
    drawGame()

}

recognition.onspeechend = function () {
    recognition.stop();
}

recognition.onnomatch = function (event) {
    diagnostic.textContent = "I didn't recognise that direction.";
}

recognition.onerror = function (event) {
    diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
}
