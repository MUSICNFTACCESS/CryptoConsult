// === DEBUG PANEL START ===
const debugBox = document.createElement('div');
debugBox.id = 'debug-box';
debugBox.style.cssText = 'position:fixed;bottom:0;left:0;width:100%;max-height:150px;overflow:auto;background:#111;color:#0f0;font-size:12px;padding:5px;z-index:9999;border-top:2px solid #f90;font-family:monospace;';
document.addEventListener('DOMContentLoaded', () => {
  document.body.appendChild(debugBox);
});

function logDebug(message) {
  const div = document.createElement('div');
  div.textContent = '> ' + message;
  debugBox.appendChild(div);
  debugBox.scrollTop = debugBox.scrollHeight;
}
// === DEBUG PANEL END ===

function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  input.value = "";

  if (!message) return;

  logDebug("You: " + message);

  fetch("https://crimznbot.onrender.com/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message })
  })
  .then(res => res.json())
  .then(data => {
    const box = document.getElementById("chat-box");
    box.textContent += "> " + message + "\n" + data.reply + "\n\n";
    logDebug("Bot: " + data.reply);
    box.scrollTop = box.scrollHeight;
  })
  .catch(err => {
    console.error(err);
    alert("Error talking to CrimznBot.");
    logDebug("ERROR: " + err.message);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("chat-form").addEventListener("submit", (e) => {
    e.preventDefault();
    sendMessage();
  });
});
