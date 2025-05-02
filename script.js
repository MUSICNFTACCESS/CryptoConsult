function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  input.value = "";

  if (!message) return;

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
    box.scrollTop = box.scrollHeight;
  })
  .catch(err => {
    console.error(err);
    alert("Error talking to CrimznBot.");
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("chat-form").addEventListener("submit", (e) => {
    e.preventDefault();
    sendMessage();
  });
});
