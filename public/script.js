document.getElementById('chat-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const input = document.getElementById('user-input');
  const responseBox = document.getElementById('chat-response');
  const userMessage = input.value.trim();
  if (!userMessage) return;

  responseBox.innerText = "Thinking...";
  input.value = '';

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage })
    });

    const data = await res.json();
    responseBox.innerHTML = `<strong>CrimznBot:</strong> ${data.reply}`;
  } catch (err) {
    responseBox.innerHTML = `<strong>CrimznBot:</strong> Error reaching server.`;
  }
});
