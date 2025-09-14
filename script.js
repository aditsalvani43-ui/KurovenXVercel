const API_KEY = "https://docs.blackbox.ai/mcp"; // ganti ini dengan key dari akun Blackbox.ai-mu
const API_URL = "https://api.blackbox.ai/v1/chat/completions"; 
// Kalau docs-mu nyebut endpoint lain (mis: /chat/completions tanpa /v1), sesuaikan

const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function askBlackbox(prompt) {
  addMessage(prompt, "user");

  addMessage("Mengetik...", "bot");
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "chat", // model bisa berbeda, sesuaikan dengan case di dashboard-mu
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await res.json();
    // Hapus "Mengetik..." message
    const typingDiv = chatBox.querySelector(".msg.bot:last-child");
    if (typingDiv && typingDiv.innerText === "Mengetik...") {
      typingDiv.remove();
    }

    const reply = data.choices?.[0]?.message?.content || "Maaf, tidak ada respon.";
    addMessage(reply, "bot");

  } catch (err) {
    addMessage("⚠️ Error: Tidak bisa terhubung ke AI", "bot");
    console.error("Error dari Blackbox.ai:", err);
  }
}

sendBtn.addEventListener("click", () => {
  const text = userInput.value.trim();
  if (text) {
    askBlackbox(text);
    userInput.value = "";
  }
});

userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendBtn.click();
  }
});
