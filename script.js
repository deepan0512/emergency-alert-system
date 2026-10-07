const sosBtn = document.getElementById("sosBtn");
const locationBtn = document.getElementById("locationBtn");
const statusDiv = document.getElementById("status");
const locationDiv = document.getElementById("location");
const resultDiv = document.getElementById("result");

const alertBox = document.getElementById("alertBox");
const alertTime = document.getElementById("alertTime");
const closeAlert = document.getElementById("closeAlert");

const historyText = document.getElementById("historyText");
const dashStatus = document.getElementById("dashStatus");
const dashLocation = document.getElementById("dashLocation");
const dashTime = document.getElementById("dashTime");


// =========================
// SOS BUTTON
// =========================

sosBtn.onclick = function () {

    statusDiv.innerText = "🚨 SOS ACTIVATED!";
    statusDiv.style.color = "red";

    dashStatus.innerText = "EMERGENCY ACTIVE";
    dashStatus.style.color = "red";

    dashTime.innerText = new Date().toLocaleString();

    alertTime.innerText = new Date().toLocaleString();

    alertBox.style.display = "block";

    historyText.innerText =
        "🚨 Emergency alert recorded at " +
        new Date().toLocaleString();

    resultDiv.innerHTML = `
        <div style="
            background:#fff0f0;
            border:2px solid red;
            border-radius:12px;
            padding:15px;
            margin-top:15px;
        ">
            <h2 style="color:red;">🚨 EMERGENCY ALERT</h2>
            <p><b>Status:</b> Emergency Activated</p>
            <p><b>Alert Time:</b> ${new Date().toLocaleString()}</p>
            <p><b>Action:</b> Emergency response required</p>
        </div>
    `;

    getLocation();
};


// =========================
// GET LOCATION
// =========================

function getLocation() {

    locationDiv.innerText = "📍 Getting your location...";

    if (!navigator.geolocation) {

        locationDiv.innerText =
            "❌ Location is not supported by this browser.";

        return;
    }

    navigator.geolocation.getCurrentPosition(

        function (position) {

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            locationDiv.innerHTML = `
                📍 <b>Your Location</b><br>
                Latitude: ${lat}<br>
                Longitude: ${lon}<br><br>

                <a href="https://www.google.com/maps?q=${lat},${lon}"
                   target="_blank">
                   🗺️ Open in Google Maps
                </a>
            `;

            dashLocation.innerText =
                lat + ", " + lon;
        },

        function (error) {

            locationDiv.innerHTML =
                "❌ Unable to get location.<br>" +
                "Please allow location permission and try again.";

            dashLocation.innerText = "Not Available";
        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}


// =========================
// GET MY LOCATION BUTTON
// =========================

locationBtn.onclick = function () {
    getLocation();
};


// =========================
// CLOSE ALERT
// =========================

closeAlert.onclick = function () {

    alertBox.style.display = "none";

    statusDiv.innerText = "Alert Closed";
    statusDiv.style.color = "black";
};


// =========================
// VOICE EMERGENCY
// =========================

const voiceBtn = document.getElementById("voiceBtn");
const transcript = document.getElementById("transcript");

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

if (SpeechRecognition) {

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    voiceBtn.onclick = function () {

        transcript.innerText = "🎤 Listening...";

        recognition.start();
    };

    recognition.onresult = function (event) {

        const text =
            event.results[0][0].transcript;

        transcript.innerText = "🗣️ " + text;

        analyzeEmergency(text);
    };

    recognition.onerror = function () {

        transcript.innerText =
            "❌ Could not understand your voice.";
    };

} else {

    transcript.innerText =
        "Speech recognition is not supported in this browser.";
}


// =========================
// EMERGENCY ANALYSIS
// =========================

function analyzeEmergency(text) {

    const message = text.toLowerCase();

    const criticalWords = [
        "attack",
        "attacking",
        "kidnap",
        "fire",
        "weapon",
        "gun",
        "knife",
        "save me"
    ];

    const highWords = [
        "danger",
        "following me",
        "threat",
        "someone is chasing me"
    ];

    const mediumWords = [
        "hurt",
        "injured",
        "accident",
        "fell down"
    ];

    let severity = "NORMAL";
    let isEmergency = false;

    if (
        criticalWords.some(word =>
            message.includes(word)
        )
    ) {

        severity = "CRITICAL";
        isEmergency = true;

    } else if (
        highWords.some(word =>
            message.includes(word)
        )
    ) {

        severity = "HIGH";
        isEmergency = true;

    } else if (
        mediumWords.some(word =>
            message.includes(word)
        )
    ) {

        severity = "MEDIUM";
        isEmergency = true;
    }


    if (isEmergency) {

        statusDiv.innerText =
            "🚨 EMERGENCY DETECTED!";

        statusDiv.style.color = "red";

        resultDiv.innerHTML = `
            🚨 SOS ACTIVATED<br>
            ⚠️ Severity:
            <strong>${severity}</strong><br>
            📝 Message: ${text}
        `;

        getLocation();

    } else {

        statusDiv.innerText =
            "✅ No emergency detected";

        statusDiv.style.color = "green";

        resultDiv.innerHTML =
            "🟢 Situation appears normal.";
    }
}