function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value;
  input.value = "";

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
    box.textContent += "> " + message + "\n" + data.response + "\n\n";
    box.scrollTop = box.scrollHeight;
  })
  .catch(err => {
    alert("Error talking to CrimznBot.");
    console.error(err);
  });
}

// Mobile autoplay fix
document.addEventListener('click', function () {
  const audio = document.getElementById('bg-audio');
  if (audio.paused) audio.play();
}, { once: true });

function toggleAudio() {
  const audio = document.getElementById('bg-audio');
  const btn = document.getElementById('toggle-audio');
  if (audio.paused) {
    audio.play();
    btn.textContent = "Pause Beat";
  } else {
    audio.pause();
    btn.textContent = "Play Beat";
  }
}
