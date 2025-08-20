let prompt = document.querySelector(".search");
let Chatcontainer = document.querySelector("#chat-container");
let chatHistory = document.querySelector("#chat-history");
let imagebtn = document.querySelector("#img");
let imageinput = document.querySelector("#img input");
let sendBtn = document.querySelector("#send-btn");
let imagePreviewSection = document.querySelector(".image-preview-section");
let previewImg = document.querySelector("#preview-img");
let imageText = document.querySelector("#image-text");

const Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyAklI4Slcwh4WDfmRunZjxnlwFu7jDz8Gc";

let user = {
    data: null,
};

let imageData = {
    base64: null,
    fileType: null
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

    let history = JSON.parse(localStorage.getItem("chatHistory")) || [];
    history.push(message);
    localStorage.setItem("chatHistory", JSON.stringify(history));
}

async function generateResponse(AiChatBox) {
    let text = AiChatBox.querySelector(".Ai-chat-area");

    let body = {
        "contents": [
            {
                "parts": user.data
            }
        ]
    };

    let RequestOption = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
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
    prompt.value = "";

    let isImageIncluded = imageData.base64 !== null;

    let userHtml = `<div class="user-chat-area">`;

    if (isImageIncluded) {
        userHtml += `<img src="data:${imageData.fileType};base64,${imageData.base64}" class="uploaded-image" /><br>`;
    }

    userHtml += `${message}</div><img src="https://i.pravatar.cc/300?img=47" class="user-img" alt="User" />`;

    let userChatBox = createChatBox(userHtml, "user-chat-box");
    Chatcontainer.appendChild(userChatBox);
    addToSidebarHistory(isImageIncluded ? "Image & Text" : message);
    Chatcontainer.scrollTo({ top: Chatcontainer.scrollHeight, behavior: "smooth" });

    let aiHtml = `<img src="https://robohash.org/beautifulrobot123.png?set=set2" class="AI-img" /><div class="Ai-chat-area"></div>`;
    let aiChatBox = createChatBox(aiHtml, "Ai-chat-box");
    Chatcontainer.appendChild(aiChatBox);

    if (isImageIncluded) {
        user.data = [
            {
                inlineData: {
                    mimeType: imageData.fileType,
                    data: imageData.base64,
                }
            },
            {
                text: message || "Can you describe this image?"
            }
        ];
    } else {
        user.data = [{ text: message }];
    }

    generateResponse(aiChatBox);

    // Reset image data after sending
    imageData = { base64: null, fileType: null };
    imagePreviewSection.style.display = "none";
    imageText.value = "";
}

// Send button
sendBtn.addEventListener("click", () => {
    const textToSend = imageData.base64 ? imageText.value : prompt.value;
    if (textToSend.trim() !== "" || imageData.base64) {
        handleChatresponce(textToSend);
    }
});

// Enter key support
prompt.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && prompt.value.trim() !== "") {
        handleChatresponce(prompt.value);
    }
});

// Open file input
imagebtn.addEventListener("click", () => {
    imageinput.click();
});

// Image upload preview
imageinput.addEventListener("change", () => {
    const file = imageinput.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = (e) => {
        let base64 = e.target.result.split(',')[1];
        imageData.base64 = base64;
        imageData.fileType = file.type;
        previewImg.src = e.target.result;
        imagePreviewSection.style.display = "block";
        imageText.focus();
    };
    reader.readAsDataURL(file);
});

// Load saved history from localStorage on page load
window.addEventListener("DOMContentLoaded", () => {
    const savedHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    savedHistory.forEach((msg) => addToSidebarHistory(msg));
});

// Delete all chat history
function deleteAllHistory() {
    localStorage.removeItem("chatHistory");
    chatHistory.innerHTML = "";
}

// Add delete button under chat history
const deleteBtn = document.createElement("button");
deleteBtn.textContent = " Delete All History";
deleteBtn.style.cssText = ` 
   margin-top: 10px;
padding: 5px 10px;
font-size: 14px;
background-color: #040303ff;
border: 1px solid #00ff88;
color: white;
border-radius: 4px;
cursor: pointer;
transform: scale(1.1);
  box-shadow: 0 0 15px #00ff88aa;

`;
deleteBtn.addEventListener("click", deleteAllHistory); 
chatHistory.parentElement.appendChild(deleteBtn);
