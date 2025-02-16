const SERVER_URL = "https://texttospeach-btn2.onrender.com"; // Fixed URL

let voiceSelect = document.querySelector("select");

// Function to send text to the backend and play audio
async function textToSpeech(text, voice) {
    try {
        const response = await fetch(`${SERVER_URL}/speak`, { // Correct URL
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