document
  .getElementById("analysisForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const inputField = document.getElementById("inputValue");
    const inputValue = inputField.value;
    const outputDiv = document.getElementById("output");
    const statusDot = document.getElementById("statusDot");

    inputField.value = "";

    if (!inputValue.trim()) return;

    outputDiv.innerHTML += `
      <div class="message user">
          <div class="avatar">U</div>
          <div class="message-content">${inputValue}</div>
      </div>
  `;

    statusDot.classList.remove("inactive");
    statusDot.classList.add("active");

    const analyzingMessageId = `analyzingMessage-${Date.now()}`;
    outputDiv.innerHTML += `
  <div class="message bot" id="${analyzingMessageId}">
      <div class="avatar">AI</div>
      <div class="message-content">Analyzing...</div>
  </div>
  `;

    outputDiv.scrollTop = outputDiv.scrollHeight;

    try {
      const response = await fetch("https://social-media-performance-analysis.onrender.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputValue }),

      });

      const data = await response.json();

      console.log("Response data:", data);

      if (
        data &&
        data.outputs &&
        data.outputs[0] &&
        data.outputs[0].outputs &&
        data.outputs[0].outputs[0] &&
        data.outputs[0].outputs[0].results
      ) {
        const message = data.outputs[0].outputs[0].results.message.text;

        const analyzingMessage = document.getElementById(analyzingMessageId);
        if (analyzingMessage) {
          analyzingMessage.querySelector(".message-content").textContent =
            message;
        }
      } else {
        const analyzingMessage = document.getElementById(analyzingMessageId);
        if (analyzingMessage) {
          analyzingMessage.querySelector(".message-content").textContent =
            "Error: Unexpected response format.";
        }
      }
    } catch (error) {
      console.error("Error during fetch:", error);

      const analyzingMessage = document.getElementById(analyzingMessageId);
      if (analyzingMessage) {
        analyzingMessage.querySelector(".message-content").textContent =
          "Error: Unable to fetch data from the server.";
      }
    } finally {
      setTimeout(() => {
        statusDot.classList.remove("active");
        statusDot.classList.add("inactive");
      }, 2000);
    }
  });

document.getElementById("clearBtn").addEventListener("click", () => {
  const outputDiv = document.getElementById("output");
  outputDiv.innerHTML = "";
});
