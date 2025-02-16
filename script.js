const SERVER_URL = "https://texttospeach-btn2.onrender.com"; // Your backend server URL

let voiceSelect = document.querySelector("select");

// Function to fetch available Azure voices (optional)
async function getAzureVoices() {
    try {
        const response = await fetch("https://eastus.tts.speech.microsoft.com/cognitiveservices/voices/list", {
            headers: { "Ocp-Apim-Subscription-Key": "YOUR_AZURE_API_KEY" }
        });
        const voices = await response.json();

        // Populate select dropdown with voices
        voiceSelect.innerHTML = ""; // Clear existing options
        voices.forEach(voice => {
            let option = new Option(voice.DisplayName, voice.ShortName);
            voiceSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching Azure voices:", error);
    }
}

// Function to send text to the backend and play audio
async function textToSpeech(text, voice) {
    try {
        const response = await fetch(`${SERVER_URL}/speak`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, voice }),
        });

        if (!response.ok) {
            throw new Error("Error generating speech");
        }

        // Convert response to audio
        const audioBlob = await response.blob();
        const audioURL = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioURL);
        audio.play();
    } catch (error) {
        console.error("Azure TTS Error:", error);
        alert("Error generating speech. Please check your server.");
    }
}

// Handle button click to start speech synthesis
document.querySelector("button").addEventListener("click", () => {
    let text = document.querySelector("textarea").value.trim();
    let selectedVoice = voiceSelect.value || "en-US-JennyNeural"; // Default voice

    if (text === "") {
        alert("Please enter text to convert to speech.");
        return;
    }

    textToSpeech(text, selectedVoice);
});

// Load Azure voices when the page loads (optional)
getAzureVoices();