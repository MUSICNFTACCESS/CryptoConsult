document.getElementById('chat-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const input = document.getElementById('user-input');
  const chatbox = document.getElementById('chatbox');
  const userMessage = input.value;

  const userBubble = document.createElement('div');
  userBubble.className = 'user-message';
  userBubble.textContent = '> You: ' + userMessage;
  chatbox.appendChild(userBubble);

  input.value = '';

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage })
    });

    const data = await response.json();

    const botBubble = document.createElement('div');
    botBubble.className = 'bot-message';
    botBubble.innerHTML = 'CrimznBot: ' + data.reply;
    chatbox.appendChild(botBubble);
  } catch (err) {
    const errorBubble = document.createElement('div');
    errorBubble.className = 'bot-message';
    errorBubble.innerHTML = 'CrimznBot: Error reaching server';
    chatbox.appendChild(errorBubble);
  }
});
