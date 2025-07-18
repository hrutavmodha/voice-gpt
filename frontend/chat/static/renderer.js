const startBtn = document.getElementById("startBtn")
const convoBox = document.getElementById("convoBox")
let transcript = ""
function appendToConvo(sender, message) {
    const para = document.createElement("div");
    para.innerHTML = `<h3>${sender}:</h3> ${message}`;
    convoBox.appendChild(para);
    convoBox.scrollTop = convoBox.scrollHeight;
}
startBtn.addEventListener("click", () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.start();
    recognition.onresult = (event) => {
        transcript = event.results[0][0].transcript;
        appendToConvo("You", transcript);
        fetch("/process", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                command: transcript
            })
        }).then((res) => {
            return res.json()
        }).then((data) => {
            const utter = new SpeechSynthesisUtterance(data.message);
            utter.lang = "en-US";
            speechSynthesis.speak(utter);   
            appendToConvo("Bot", data.message);
        })
    }
    recognition.onerror = (e) => {
        appendToConvo("Error", e.error);
    }

})