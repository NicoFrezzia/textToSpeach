require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const API_KEY = process.env.AZURE_SPEECH_KEY;
const REGION = process.env.AZURE_REGION;
const ENDPOINT = `https://${REGION}.tts.speech.microsoft.com/cognitiveservices/v1`;

// Azure TTS Route
app.post("/speak", async (req, res) => {
    try {
        const { text, voice } = req.body;

        const response = await axios.post(
            ENDPOINT,
            `<speak version='1.0' xml:lang='en-US'>
                <voice xml:lang='en-US' name='${voice}'>${text}</voice>
            </speak>`,
            {
                headers: {
                    "Ocp-Apim-Subscription-Key": API_KEY,
                    "Content-Type": "application/ssml+xml",
                    "X-Microsoft-OutputFormat": "audio-16khz-32kbitrate-mono-mp3"
                },
                responseType: "arraybuffer",
            }
        );

        res.setHeader("Content-Type", "audio/mpeg");
        res.send(response.data);
    } catch (error) {
        console.error("Azure TTS Error:", error);
        res.status(500).json({ error: "Error generating speech" });
    }
});

// ✅ FIXED: Ensure PORT is defined
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));