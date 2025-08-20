let prompt = document.querySelector(".search");
let Chatcontainer = document.querySelector("#chat-container");
let chatHistory = document.querySelector("#chat-history");
let imagebtn = document.querySelector("#img");
let imageinput = document.querySelector("#img input");
let sendBtn = document.querySelector("#send-btn");

const Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyAklI4Slcwh4WDfmRunZjxnlwFu7jDz8Gc";
let user = {
    data: null,
};

function createChatBox(html, className) {
    let div = document.createElement("div");
    div.innerHTML = html;
    div.classList.add(className);
    return div;
}

function addToSidebarHistory(message) {
    const li = document.createElement("li");
    li.textContent = message;
    chatHistory.appendChild(li);
}

async function generateResponse(AiChatBox) {
    let text = AiChatBox.querySelector(".Ai-chat-area");
    let RequestOption = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "contents": [
                {
                    "parts": [
                        {
                            "text": user.data
                        }
                    ]
                }
            ]
        })
    };

    try {
        let response = await fetch(Api_Url, RequestOption);
        let data = await response.json();
        let apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        text.innerHTML = apiResponse;
    } catch (error) {
        console.log(error);
        text.innerHTML = "Something went wrong. Try again!";
    } finally {
        Chatcontainer.scrollTo({ top: Chatcontainer.scrollHeight, behavior: "smooth" });
    }
}

function handleChatresponce(message) {
    user.data = message;
    prompt.value = "";

    let html = `<div class="user-chat-area">${user.data}</div><img src="https://i.pravatar.cc/300?img=47" class="user-img" alt="Stylish Avatar" />


/>`;
    let userChatBox = createChatBox(html, "user-chat-box");
    Chatcontainer.appendChild(userChatBox);
    addToSidebarHistory(user.data);

    Chatcontainer.scrollTo({ top: Chatcontainer.scrollHeight, behavior: "smooth" });

    setTimeout(() => {
        let html = `<img src="https://robohash.org/beautifulrobot123.png?set=set2" class="AI-img" /><div class="Ai-chat-area"></div>`;
        let aiChatbox = createChatBox(html, "Ai-chat-box");
        Chatcontainer.appendChild(aiChatbox);
        generateResponse(aiChatbox);
    }, 900);
}
         

// Enter key submit

sendBtn.addEventListener("click", () => {
  if (prompt.value.trim() !== "") {
    handleChatresponce(prompt.value);
  }
});
 

// Image upload
imageinput.addEventListener("change", () => {
    const file = imageinput.files[0];
    if (!file) return;
    let reader = new FileReader();
    reader.onload = (e) => {
        console.log("Image Data URL:", e.target.result);
    };
    reader.readAsDataURL(file);
});

// Open file input
imagebtn.addEventListener("click", () => {
    imagebtn.querySelector("input").click();
});
