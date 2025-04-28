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

    if (!res.ok) {
      const errorText = await res.text();
      responseDiv.innerText = `Server Error ${res.status}: ${errorText}`;
      return;
    }

    const data = await res.json();
    responseDiv.innerText = data.reply || "No reply.";
  } catch (error) {
    console.error(error);
    responseDiv.innerText = "Error: Could not reach CrimznBot.";
  }
});
