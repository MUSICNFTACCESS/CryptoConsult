document.querySelector('form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const input = document.querySelector('input');
  const userMessage = input.value.trim();
  if (!userMessage) return;

  const chatBox = document.querySelector('#chatbox');
  chatBox.innerHTML += `> You: ${userMessage}<br>`;

  try {
    const response = await fetch('https://crimznbot.onrender.com/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage })
    });

    const data = await response.json();
    chatBox.innerHTML += `> CrimznBot: ${data.reply}<br>`;
  } catch (err) {
    chatBox.innerHTML += `> CrimznBot: Error reaching server.<br>`;
  }

  input.value = '';
});
