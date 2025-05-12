document.getElementById('chat-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const input = document.getElementById('user-input');
  const responseBox = document.getElementById('chat-response');
  const userMessage = input.value.trim();
  if (!userMessage) return;

  responseBox.innerText = "Thinking...";

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage })
    });

    const data = await res.json();
    responseBox.innerHTML = `<div><strong>CrimznBot:</strong> ${data.reply}</div>`;
    input.value = '';
  } catch (err) {
    responseBox.innerHTML = `<div><strong>CrimznBot:</strong> Error reaching server.</div>`;
  }
});
