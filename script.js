document.querySelector('form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const input = document.querySelector('textarea');
  const userMessage = input.value.trim();
  if (!userMessage) return;

  const chatBox = document.querySelector('#chatbox');
  chatBox.innerHTML += `> You: ${userMessage}\n`;

  try {
    const response = await fetch('https://crimznbot.onrender.com/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage })
    });

    const data = await response.json();
    chatBox.innerHTML += `> CrimznBot: ${data.reply}\n`;
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (err) {
    chatBox.innerHTML += `> CrimznBot: Error reaching server.\n`;
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  input.value = '';
});
