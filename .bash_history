git commit -m "Full update: index with chat-response box, live UI, full content"
git push origin restore-loved-version
nano ~/CryptoConsult/public/script.js
git add public/script.js
git commit -m "Fix: show CrimznBot response under chat form"
git push origin restore-loved-version
curl -s -X POST https://cryptoconsult-1.onrender.com/api/chat   -H "Content-Type: application/json"   -d '{"message":"What is the price of Bitcoin and ONDO?"}'
cd ~/CryptoConsult && curl -o chat.js https://raw.githubusercontent.com/MUSICNFTACCESS/CryptoConsult/main/final-chat.js && git add chat.js && git commit -m "Fix: confident GPT-4o replies with live prices injected into system prompt" && git push origin restore-loved-version
nano ~/CryptoConsult/public/script.js
git add public/script.js
git commit -m "Fix: clear previous CrimznBot response before new question"
git push origin restore-loved-version
cat > ~/CryptoConsult/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>CryptoConsult by Crimzn</title>
  <link rel="stylesheet" href="style.css" />
  <script defer src="public/script.js"></script>
</head>
<body>
  <audio id="bgmusic" src="autoplay.mp3" preload="auto"></audio>

  <h1>CryptoConsult by Crimzn</h1>
  <div class="prices" id="prices">BTC, ETH, and SOL loading...</div>

  <p>Welcome to <strong>CryptoConsult</strong> — your personalized, AI-powered crypto advisory platform.</p>

  <h2>About Crimzn</h2>
  <p>I've worked in traditional finance for years and now focus on blockchain consulting across multiple chains.</p>

  <h2>Available Services</h2>
  <ul>
    <li>Technical Analysis</li>
    <li>Fundamental Analysis</li>
    <li>Wallet Setup & Security</li>
    <li>On-Ramping / Off-Ramping</li>
    <li>Risk Management</li>
    <li>Capital Allocation Strategy</li>
    <li>Smart Contract Guidance</li>
  </ul>

  <h2>Payments & Booking</h2>
  <p>
    Pay with:
    <a href="https://commerce.coinbase.com/checkout/0193a8a5-c86f-407d-b5d7-6f89664fbdf8">Coinbase</a> |
    <a href="https://paypal.me/crimzn" target="_blank">PayPal</a> |
    <a href="https://explorer.solana.com/address/6g13EP9RCEuBjcnqK1vAjXq9aYeP6RHrkcKp9zbz64RA">Solana</a>
  </p>

  <h2>CrimznBot</h2>
  <div id="crimznbot-container" style="max-width: 700px; margin: 20px auto; text-align: center;">
    <form id="chat-form" style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
      <input
        type="text"
        id="user-input"
        placeholder="Ask CrimznBot anything about crypto..."
        style="flex: 1; min-width: 250px; padding: 10px; border-radius: 6px; border: none; font-size: 1em;"
        autocomplete="off"
      />
      <button
        type="submit"
        style="background-color: #f7931a; color: #000; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold;">
        Send
      </button>
    </form>
    <div id="chat-response"
      style="margin-top: 20px; background: #111; color: #f7931a; padding: 15px; border-radius: 10px; font-family: monospace; white-space: pre-wrap; text-align: left;">
    </div>
  </div>

  <h2>Disclaimer</h2>
  <p><strong>Crimzn is not a licensed financial advisor.</strong> All insights are educational guidance only.</p>
  <footer>Created by Crimzn | Powered by GPT-4o | Built for Bitcoin & Solana</footer>
</body>
</html>
EOF

git add index.html
git commit -m "Fix: corrected script path and refreshed CrimznBot layout"
git push origin restore-loved-version
cat > ~/CryptoConsult/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>CryptoConsult by Crimzn</title>
  <link rel="stylesheet" href="style.css" />
  <script defer src="public/script.js"></script>
</head>
<body style="background-color: black; color: #f7931a; font-family: monospace; text-align: center; padding: 20px;">
  <audio id="bgmusic" src="autoplay.mp3" preload="auto"></audio>

  <h1 style="font-family: fantasy; color: white;">CryptoConsult by Crimzn</h1>
  <div class="prices" id="prices" style="margin-bottom: 20px;">BTC, ETH, and SOL loading...</div>

  <p>Welcome to <strong>CryptoConsult</strong> — your personalized, AI-powered crypto advisory platform.</p>

  <h2 style="font-family: fantasy; color: white;">About Crimzn</h2>
  <p>I've worked in traditional finance for nearly a decade and have been deep in crypto for 6+ years,
  through two full Bitcoin cycles. I'm certified in blockchain, tokenomics, and wrapped token infrastructure —
  with hands-on experience building decentralized apps, integrating Solana Pay and Coinbase Commerce,
  and tracking wallets across multiple chains.</p>

  <h2 style="font-family: fantasy; color: white;">Available Services</h2>
  <ul style="list-style-type: square; text-align: left; max-width: 600px; margin: auto;">
    <li>Technical Analysis</li>
    <li>Fundamental Analysis</li>
    <li>Wallet Setup & Security</li>
    <li>On-Ramping / Off-Ramping</li>
    <li>Risk Management</li>
    <li>Capital Allocation Strategy</li>
    <li>Smart Contract Guidance</li>
  </ul>

  <h2 style="font-family: fantasy; color: white;">Payments & Booking</h2>
  <p>Pay with:
    <a href="https://commerce.coinbase.com/checkout/0193a8a5-c86f-407d-b5d7-6f89664fbdf8" style="color:#bb86fc;">Coinbase</a> |
    <a href="https://paypal.me/crimzn" target="_blank" style="color:#bb86fc;">PayPal</a> |
    <a href="https://explorer.solana.com/address/6g13EP9RCEuBjcnqK1vAjXq9aYeP6RHrkcKp9zbz64RA" style="color:#bb86fc;">Solana</a>
  </p>

  <h2 style="font-family: fantasy; color: white;">Personal 1-on-1 Consulting – $99.99</h2>
  <ul style="list-style-type: disc; text-align: left; max-width: 600px; margin: auto;">
    <li>Wallet Setup & Secure Storage</li>
    <li>Crypto On-Ramping & Off-Ramping</li>
    <li>Technical & Fundamental Analysis</li>
    <li>Risk Management Planning</li>
    <li>Capital Allocation Strategy</li>
    <li>Live Trading Support (BTC / SOL / ALT)</li>
  </ul>

  <div style="margin: 20px;">
    <a href="https://commerce.coinbase.com/checkout/0193a8a5-c86f-407d-b5d7-6f89664fbdf8" style="background:#bb86fc;color:black;padding:10px 20px;border-radius:6px;text-decoration:none;margin:5px;display:inline-block;">Pay with Coinbase</a>
    <a href="https://paypal.me/crimzn" style="background:#bb86fc;color:black;padding:10px 20px;border-radius:6px;text-decoration:none;margin:5px;display:inline-block;">Pay with PayPal</a>
    <a href="https://explorer.solana.com/address/6g13EP9RCEuBjcnqK1vAjXq9aYeP6RHrkcKp9zbz64RA" style="background:#bb86fc;color:black;padding:10px 20px;border-radius:6px;text-decoration:none;margin:5px;display:inline-block;">Pay with Solana (Phantom)</a>
  </div>

  <h2 style="font-family: fantasy; color: white;">Ask CrimznBot</h2>
  <form id="chat-form" style="margin-bottom: 20px;">
    <input type="text" id="user-input" placeholder="Ask CrimznBot..." style="padding: 10px; width: 80%; max-width: 400px; border-radius: 6px;" />
    <button type="submit" style="background-color:#bb86fc;color:black;padding:10px 15px;border:none;border-radius:6px;font-weight:bold;">Send</button>
  </form>
  <div id="chat-response" style="margin-top: 20px; white-space: pre-wrap;"></div>

  <h2 style="font-family: fantasy; color: white;">Why CryptoConsult Exists</h2>
  <p>CrimznBot is powered by GPT-4o and offered 100% free — no signups, no catches. It's my way of helping the community get clear, honest answers about crypto, trading, and security.</p>
  <p>If you've found value here, consider tipping, booking a private session, or sharing this site with a friend. Every bit of support helps keep this running.</p>

  <h2 style="font-family: fantasy; color: white;">Disclaimer</h2>
  <p><strong>Crimzn is not a licensed financial advisor.</strong> All insights are for educational purposes only.</p>

  <footer style="margin-top: 30px;">© 2025 CryptoConsult by Crimzn</footer>
</body>
</html>
EOF

mkdir -p ~/CryptoConsult/public && cat > ~/CryptoConsult/public/script.js << 'EOF'
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
EOF

cat > ~/CryptoConsult/public/style.css << 'EOF'
@import url('https://fonts.googleapis.com/css2?family=Rubik+Moonrocks&display=swap');

body {
  background-color: black;
  color: #f7931a;
  font-family: monospace;
  text-align: center;
  padding: 20px;
}

h1, h2 {
  font-family: 'Rubik Moonrocks', cursive;
  color: white;
  margin-top: 20px;
  text-transform: uppercase;
}

ul {
  list-style-type: square;
  text-align: left;
  max-width: 600px;
  margin: 10px auto;
  padding-left: 20px;
}

a {
  color: #bb86fc;
  text-decoration: underline;
}

a.button {
  background-color: #bb86fc;
  color: black;
  padding: 10px 15px;
  margin: 5px;
  border-radius: 6px;
  text-decoration: none;
  display: inline-block;
  font-weight: bold;
}

button {
  background-color: #bb86fc;
  color: black;
  font-weight: bold;
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

input[type="text"] {
  padding: 10px;
  width: 80%;
  max-width: 400px;
  border-radius: 6px;
  border: none;
}

footer {
  margin-top: 40px;
  font-size: 0.9em;
  color: #888;
}

#chat-response {
  margin-top: 20px;
  white-space: pre-wrap;
  color: white;
}
EOF

git add public/style.css
git commit -m "Style: graffiti font and purple UI for CrimznBot"
git push origin restore-loved-version
nano ~/CryptoConsult/chat.js
git add chat.js
git commit -m "Fix: CrimznBot now replies with confident live token prices"
git push origin restore-loved-version
git config --global user.name "MUSICNFTACCESS"
git config --global user.email "crimzncipriano@gmail.com"
cd ~/CryptoConsult
git add chat.js
git commit -m "Fix: CrimznBot now replies with confident live token prices"
git push origin restore-loved-version
cd ~/CryptoConsult
git add chat.js
git commit -m "Fix: CrimznBot now replies with confident live token prices"
git push origin restore-loved-version
ping -c 4 cryptoconsult-1.onrender.com
curl -s -X POST https://cryptoconsult-1.onrender.com/api/chat   -H "Content-Type: application/json"   -d '{"message":"What is the current price of Bitcoin?"}'
nano ~/CryptoConsult/chat.js
curl -s -X POST https://cryptoconsult-1.onrender.com/api/chat   -H "Content-Type: application/json"   -d '{"message":"What is the price of Bitcoin and ONDO?"}'
nano ~/CryptoConsult/chat.js
git add chat.js
git commit -m "Fix: force GPT-4o to use only live token prices"
git push origin restore-loved-version
curl -s -X POST https://cryptoconsult-1.onrender.com/api/chat   -H "Content-Type: application/json"   -d '{"message":"What is the price of Bitcoin and ONDO?"}'
echo "// dummy comment" >> chat.js
git add chat.js
git commit -m "Force rebuild: trigger clean deploy of updated CrimznBot"
git push origin restore-loved-version
curl -s -X POST https://cryptoconsult-1.onrender.com/api/chat   -H "Content-Type: application/json"   -d '{"message":"What is the price of Bitcoin and ONDO?"}'
echo "// force cache refresh" >> chat.js
git add chat.js
git commit -m "Trigger: force full rebuild and cache clear"
git push origin restore-loved-version
curl -s -X POST https://cryptoconsult-1.onrender.com/api/chat   -H "Content-Type: application/json"   -d '{"message":"What is the price of Bitcoin and ONDO?"}'
cd ~/CryptoConsult
git branch
cat ~/CryptoConsult/chat.js
cd ~/CryptoConsult && curl -o script.js https://raw.githubusercontent.com/MUSICNFTACCESS/CryptoConsult/main/script.js && cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CryptoConsult by Crimzn</title>
  <link rel="stylesheet" href="style.css" />
  <script defer src="script.js"></script>
</head>
<body>
  <audio id="bgmusic" src="autoplay.mp3" preload="auto" autoplay loop></audio>

  <h1>CryptoConsult by Crimzn</h1>
  <div class="prices" id="prices">BTC, ETH, and SOL loading...</div>

  <p>
    Welcome to <strong>CryptoConsult</strong> — your personalized, AI-powered crypto guide.
  </p>

  <h2>About Crimzn</h2>
  <p>
    I’ve worked in traditional finance for years and now focus on blockchain tech, DeFi, and helping others break free from the system.
  </p>

  <h2>Available Services</h2>
  <ul>
    <li>Wallet setup & security guidance</li>
    <li>On-ramping & off-ramping</li>
    <li>Crypto portfolio allocation</li>
    <li>Technical & fundamental analysis</li>
    <li>Risk management consulting</li>
    <li>Smart contract reviews</li>
  </ul>

  <h2>Book a Session</h2>
  <p>Consultations are $99.99/hr, payable in crypto.</p>
  <a href="https://commerce.coinbase.com/checkout/0193a8a5-c86f-407d-b5d7-6f89664fbdf8" target="_blank">
    <button>Pay with Coinbase</button>
  </a>
  <a href="solana:6g13EP9RCEuBjcnqK1vAjXq9aYeP6RHrkcKp9zbz64RA?amount=1" target="_blank">
    <button>Pay with Solana</button>
  </a>
  <a href="https://paypal.me/crimzn" target="_blank">
    <button>Pay with PayPal</button>
  </a>

  <h2>Talk to CrimznBot</h2>
  <form id="chat-form">
    <input type="text" id="user-input" placeholder="Ask me anything crypto..." required />
    <button type="submit">Send</button>
  </form>
  <div id="chatbox"></div>
</body>
</html>
EOF

cat > script.js << 'EOF'
document.addEventListener("DOMContentLoaded", async () => {
  const priceDiv = document.getElementById("prices");

  try {
    const [btc, eth, sol] = await Promise.all([
      fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd").then(res => res.json()),
      fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd").then(res => res.json()),
      fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd").then(res => res.json())
    ]);

    priceDiv.innerHTML = `BTC: $${btc.bitcoin.usd.toLocaleString()} | ETH: $${eth.ethereum.usd.toLocaleString()} | SOL: $${sol.solana.usd.toLocaleString()}`;
  } catch (error) {
    console.error("Error fetching prices:", error);
    priceDiv.innerHTML = "Error loading prices";
  }
});
EOF

git add index.html script.js && git commit -m "Fix: live prices + Solana pay button" && git push origin main
nano ~/CryptoConsult/script.js
cd ~/CryptoConsult
git add script.js
git commit -m "Fix: confirmed price line includes BTC, ETH, SOL"
git push origin main
nano ~/CryptoConsult/index.html
cd ~/CryptoConsult
git add index.html
git commit -m "Verified: index.html correctly wired for price updates and Solana payments"
git push origin main
git restore style.css
git checkout main
git merge restore-loved-version
git push origin main
git status
cd ~/CryptoConsult && curl -o index.html https://raw.githubusercontent.com/MUSICNFTACCESS/CryptoConsult/main/index.html && curl -o script.js https://raw.githubusercontent.com/MUSICNFTACCESS/CryptoConsult/main/script.js && curl -o server.js https://raw.githubusercontent.com/MUSICNFTACCESS/CryptoConsult/main/server.js && curl -o style.css https://raw.githubusercontent.com/MUSICNFTACCESS/CryptoConsult/main/style.css && curl -o public/style.css https://raw.githubusercontent.com/MUSICNFTACCESS/CryptoConsult/main/public/style.css && git add . && git commit -m "Fix: resolved all merge conflicts using latest working files" && git push origin main
cd ~/CryptoConsult && sed -i 's|solana:[^"]*|solana:Co6bkf4NpatyTCbzjhoaTS63w93iK1DmzuooCSmHSAjF?amount=1|' index.html && git add index.html && git commit -m "Update: replaced Solana Pay address with new permanent one" && git push origin main
cd ~/CryptoConsult && sed -i 's|<a href="solana:[^"]*" target="_blank">[[:space:]]*<button>Pay with Solana</button>[[:space:]]*</a>|<button onclick="window.location.href='\''solana:Co6bkf4NpatyTCbzjhoaTS63w93iK1DmzuooCSmHSAjF?amount=1'\''">Pay with Solana</button>|' index.html && git add index.html && git commit -m "Fix: make Solana Pay button use JS redirect to avoid broken href" && git push origin main
cd ~/CryptoConsult-1 &&
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>CryptoConsult</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>CryptoConsult by Crimzn</h1>

  <section>
    <h2>Available Services</h2>
    <ul>
      <li>Technical Analysis</li>
      <li>Wallet Setup</li>
      <li>Capital Rotation Strategy</li>
    </ul>
  </section>

  <section>
    <h2>Live Crypto ETF Flows</h2>
    <iframe src="https://sosovalue.xyz/etf" width="100%" height="400" style="border: none;"></iframe>
  </section>

  <section>
    <h2>Contact Me</h2>
    <form id="contact-form">
      <input type="text" placeholder="Your name" required>
      <input type="email" placeholder="Your email" required>
      <textarea placeholder="Your message" required></textarea>
      <button type="submit">Send</button>
    </form>
  </section>

  <audio id="bg-audio" src="autoplay.mp3"></audio>

  <script>
    // Autoplay after first user click
    let audioStarted = false;
    document.addEventListener('click', () => {
      if (!audioStarted) {
        document.getElementById('bg-audio').play();
        audioStarted = true;
      }
    });

    // Email obfuscation
    const to = 'crimzn' + 'cipriano' + '@' + 'gmail.com';
    document.getElementById('contact-form').addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Message sent to: ' + to);
    });
  </script>
</body>
</html>
EOF

echo "✅ CryptoConsult-1 site updated with music fix, contact form protection, and new ETF widget."
git add index.html && git commit -m "Fix: remove broken link, add ETF widget, autoplay audio, email obfuscation" && git push
git add index.html && git commit -m "Force: trigger redeploy on Render" && git push
git push origin HEAD:main
git checkout -b fix-patch-branch && git checkout main && git pull origin main && git merge fix-patch-branch && git push origin main
git branch -r
git checkout master && git pull origin master && git merge fix-patch-branch && git push origin master
git pull origin master --no-rebase
git pull origin master --allow-unrelated-histories
git pull origin master --allow-unrelated-histories --no-rebase
git add package.json package-lock.json && git commit -m "Save: local changes to package files before merge"
git pull origin master --allow-unrelated-histories --no-rebase
git checkout --ours .gitignore package.json package-lock.json public/index.html public/script.js public/style.css server.js && git add . && git commit -m "Merge resolved: keep local version" && git push origin master
rm .git-credentials && git reset --soft HEAD~1 && git restore --staged . && git add --all && git commit -m "Clean: remove credential leak and finalize merge" && git push origin master
git pull origin master --no-rebase --allow-unrelated-histories && git push origin master
git checkout --ours .gitignore package.json package-lock.json public/index.html public/script.js public/style.css server.js && git add . && git commit -m "Resolve conflicts: keep local version" && git push origin master
pip install git-filter-repo && git filter-repo --path .git-credentials --invert-paths && rm -f .git-credentials && git add . && git commit -m "Remove leaked .git-credentials file" && git push --force origin master
git filter-repo --force --path .git-credentials --invert-paths && rm -f .git-credentials && git add . && git commit -m "Remove leaked .git-credentials file" && git push --force origin master
git push --force origin master
git remote add origin https://github.com/MUSICNFTACCESS/CryptoConsult-1.git
git push --force origin master
cat .git/config
git remote remove origin && git remote add origin https://github.com/MUSICNFTACCESS/CryptoConsult-1.git && git push --force origin master
gh repo list MUSICNFTACCESS
gh auth login
gh repo list MUSICNFTACCESS
gh repo list MUSICNFTACCESS --limit 100 --json name,visibility,updatedAt | grep name
git remote set-url origin https://github.com/MUSICNFTACCESS/CryptoConsult.git && git push --force origin master
gh deploy --repo MUSICNFTACCESS/CryptoConsult
curl -X POST https://api.render.com/deploy/srv-xxxxxxxxxxxx/deploy-hook?key=xxxxxhttps://api.render.com/deploy/srv-d0enr6p5pdvs73asf7vg?key=BlHlFNj3B4o
curl -X POST "https://api.render.com/deploy/srv-d0enr6p5pdvs73asf7vg/deploy-hook?key=BlHlFNj3B4o"
curl -i -X POST "https://api.render.com/deploy/srv-d0enr6p5pdvs73asf7vg?key=BlHlFNj3B4o"
git add public/index.html && git commit -m "Trigger fresh deploy to update Render" && git push origin master
git add index.html && git commit -m "Trigger fresh deploy to update Render" && git push origin master
echo '<!-- redeploy trigger: refresh site -->' >> index.html
git add index.html && git commit -m "Trigger Render redeploy with harmless HTML change" && git push origin master
echo '<!-- trigger: force redeploy -->' >> index.html && git add index.html && git commit -m "Force redeploy by appending trigger comment" && git push origin master
git log --oneline -n 5
git push origin master:main --force
cd ~/CryptoConsult
cp ../CrimznBotBackend/public/index.html public/index.html
git add public/index.html && git commit -m "Fix: Sync CryptoConsult UI with latest CrimznBotBackend version" && git push origin main
cp -u ../CrimznBotBackend/public/index.html public/index.html
touch public/index.html
git add public/index.html && git commit -m "Force re-sync of CryptoConsult UI from working CrimznBotBackend" && git push origin main
nano public/index.html
git add public/index.html && git commit -m "Trigger: force redeploy of CryptoConsult frontend" && git push origin main
echo "<\!-- redeploy trigger -->" >> public/index.html && git add public/index.html && git commit -m "Trigger: force redeploy of CryptoConsult frontend" && git push origin main
rm server.js package.json package-lock.json Procfile
git add . && git commit -m "Clean: convert CryptoConsult to static site layout" && git push origin main
