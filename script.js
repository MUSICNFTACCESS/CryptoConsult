document.querySelector('form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const input = document.querySelector('input');
  const userMessage = input.value.trim();
  if (!userMessage) return;

  const chatBox = document.querySelector('#chatbox');

  // Clear previous content so only the latest exchange is shown
  chatBox.innerHTML = '';

  chatBox.innerHTML += `<div>> You: ${userMessage}</div>`;

  try {
    const response = await fetch('https://crimznbot.onrender.com/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage })
    });

    const data = await response.json();
    chatBox.innerHTML += `<div><strong>CrimznBot:</strong> ${data.reply}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (err) {
    chatBox.innerHTML += '<div><strong>CrimznBot:</strong> Error reaching server.</div>';
  }

  input.value = '';
});
