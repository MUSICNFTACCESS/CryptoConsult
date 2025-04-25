document.getElementById("chat-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const userInput = document.getElementById("user-input").value;
  const responseBox = document.getElementById("chat-response");
  responseBox.innerHTML = "Thinking...";

  try {
    const res = await fetch("https://crimznbot.onrender.com/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: userInput })
    });

    const data = await res.json();
    responseBox.innerHTML = data.reply || "No response.";
  } catch (err) {
    responseBox.innerHTML = "Error: Failed to fetch";
  }
});
