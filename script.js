// ==========================================
// SpeakSense - Text & Speech Analyzer
// ==========================================


// Get text area
const textInput = document.getElementById("textInput");


// ==========================================
// SPEECH TO TEXT
// ==========================================

function startSpeech() {

    // Check browser support

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

        document.getElementById("speechStatus").innerText =
            "❌ Speech recognition is not supported in this browser.";

        return;
    }


    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.interimResults = false;

    recognition.continuous = false;


    document.getElementById("speechStatus").innerText =
        "🎤 Listening... Speak now";


    recognition.start();


    recognition.onresult = function(event) {

        const spokenText =
            event.results[0][0].transcript;

        textInput.value += spokenText + " ";

        document.getElementById("speechStatus").innerText =
            "✅ Speech converted to text!";

        analyzeText();
    };


    recognition.onerror = function(event) {

        document.getElementById("speechStatus").innerText =
            "❌ Error: " + event.error;
    };


    recognition.onend = function() {

        if (
            document.getElementById("speechStatus").innerText ===
            "🎤 Listening... Speak now"
        ) {
            document.getElementById("speechStatus").innerText =
                "Microphone stopped.";
        }
    };
}



// ==========================================
// TEXT ANALYSIS
// ==========================================

function analyzeText() {

    const text = textInput.value.trim();


    if (text === "") {

        alert("Please enter or speak some text.");

        return;
    }


    // -----------------------------
    // WORD COUNT
    // -----------------------------

    const words = text.match(/\b[\w']+\b/g) || [];

    const wordCount = words.length;

    document.getElementById("wordCount").innerText =
        wordCount;


    // -----------------------------
    // CHARACTER COUNT
    // -----------------------------

    const characterCount = text.length;

    document.getElementById("charCount").innerText =
        characterCount;


    // -----------------------------
    // SENTENCE COUNT
    // -----------------------------

    const sentences =
        text.split(/[.!?]+/)
            .filter(sentence => sentence.trim().length > 0);

    const sentenceCount = sentences.length;

    document.getElementById("sentenceCount").innerText =
        sentenceCount;


    // -----------------------------
    // READING TIME
    // -----------------------------

    const readingSeconds =
        Math.max(1, Math.ceil(wordCount / 3));

    document.getElementById("readingTime").innerText =
        readingSeconds + " sec";


    // -----------------------------
    // AVERAGE WORD LENGTH
    // -----------------------------

    let totalLength = 0;

    words.forEach(word => {
        totalLength += word.length;
    });


    const averageLength =
        wordCount > 0
            ? (totalLength / wordCount).toFixed(1)
            : 0;


    document.getElementById("averageWordLength").innerText =
        averageLength;


    // -----------------------------
    // LONGEST WORD
    // -----------------------------

    let longestWord = "-";


    words.forEach(word => {

        if (word.length > longestWord.length) {

            longestWord = word;
        }

    });


    document.getElementById("longestWord").innerText =
        longestWord;


    // -----------------------------
    // MOST USED WORD
    // -----------------------------

    const frequency = {};


    words.forEach(word => {

        const cleanWord =
            word.toLowerCase();

        frequency[cleanWord] =
            (frequency[cleanWord] || 0) + 1;

    });


    let mostUsedWord = "-";

    let highestFrequency = 0;


    for (let word in frequency) {

        if (frequency[word] > highestFrequency) {

            highestFrequency =
                frequency[word];

            mostUsedWord = word;
        }

    }


    document.getElementById("mostUsedWord").innerText =
        mostUsedWord;


    // -----------------------------
    // SENTIMENT
    // -----------------------------

    analyzeSentiment(text);
}



// ==========================================
// SIMPLE SENTIMENT ANALYSIS
// ==========================================

function analyzeSentiment(text) {

    const positiveWords = [

        "good",
        "great",
        "amazing",
        "excellent",
        "happy",
        "love",
        "wonderful",
        "awesome",
        "beautiful",
        "best",
        "enjoy",
        "enjoyed",
        "fantastic",
        "success",
        "positive",
        "nice"

    ];


    const negativeWords = [

        "bad",
        "sad",
        "hate",
        "terrible",
        "worst",
        "angry",
        "horrible",
        "poor",
        "failure",
        "negative",
        "problem",
        "boring",
        "disappointed",
        "difficult"

    ];


    const words =
        text.toLowerCase()
            .match(/\b[\w']+\b/g) || [];


    let positiveScore = 0;

    let negativeScore = 0;


    words.forEach(word => {

        if (positiveWords.includes(word)) {

            positiveScore++;
        }


        if (negativeWords.includes(word)) {

            negativeScore++;
        }

    });


    const result =
        document.getElementById("sentimentResult");


    if (positiveScore > negativeScore) {

        result.innerText =
            "😊 Positive";

    }

    else if (negativeScore > positiveScore) {

        result.innerText =
            "😞 Negative";

    }

    else {

        result.innerText =
            "😐 Neutral";

    }

}



// ==========================================
// TEXT TO SPEECH
// ==========================================

function speakText() {

    const text =
        textInput.value.trim();


    if (text === "") {

        alert("Please enter some text first.");

        return;
    }


    // Stop any previous speech

    window.speechSynthesis.cancel();


    const speech =
        new SpeechSynthesisUtterance(text);


    speech.lang = "en-US";

    speech.rate = 1;

    speech.pitch = 1;


    window.speechSynthesis.speak(speech);
}



// ==========================================
// STOP SPEECH
// ==========================================

function stopSpeaking() {

    window.speechSynthesis.cancel();
}



// ==========================================
// CLEAR EVERYTHING
// ==========================================

function clearText() {

    textInput.value = "";


    document.getElementById("wordCount").innerText = "0";

    document.getElementById("charCount").innerText = "0";

    document.getElementById("sentenceCount").innerText = "0";

    document.getElementById("readingTime").innerText = "0 sec";

    document.getElementById("averageWordLength").innerText = "0";

    document.getElementById("longestWord").innerText = "-";

    document.getElementById("mostUsedWord").innerText = "-";

    document.getElementById("sentimentResult").innerText =
        "Waiting for analysis...";

    document.getElementById("speechStatus").innerText = "";

    stopSpeaking();
}