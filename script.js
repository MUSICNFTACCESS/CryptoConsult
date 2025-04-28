const API_URL = "https://crimznbot.onrender.com/api/chat";

document.getElementById("chat-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const userInput = document.getElementById("user-input").value.trim();
  if (!userInput) return;

  const responseDiv = document.getElementById("chat-response");
  responseDiv.innerText = "Thinking...";

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userInput }),
    });

    const data = await res.json();
    if (data.reply) {
      responseDiv.innerText = data.reply;
    } else if (data.response) {
      responseDiv.innerText = data.response;
    } else {
      responseDiv.innerText = "No reply received.";
    }
  } catch (error) {
    console.error(error);
    responseDiv.innerText = "Error: Could not reach CrimznBot.";
  }
});
