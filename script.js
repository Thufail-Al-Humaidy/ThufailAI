var questionInput = document.getElementById("question");
var answerDiv = document.getElementById("answer");
var apiUrl = "https://widipe.com/openai";
var historyList = document.getElementById("history");

async function sendBeg() {
    try {
        // Show loading animation
        answerDiv.innerHTML = '<div class="loading"></div>';
        
        const question = questionInput.value;
        const url = `${apiUrl}?text=${encodeURIComponent(question)}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Request failed with status: ${response.status}`);
        }

        const data = await response.json();
        answerDiv.innerHTML = data.result;

        // Add question and answer to history
        addToHistory(question, data.result);
        questionInput.value = ""; // Clear input field
    } catch (error) {
        answerDiv.innerHTML = "Sorry, an error occurred: " + error.message;
        console.log(error.message);
    }
}

function addToHistory(question, answer) {
    var listItem = document.createElement("li");
    listItem.className = "border-b border-gray-500 py-2";
    listItem.innerHTML = `<strong>Q:</strong> ${question}`;
    historyList.appendChild(listItem);
}

function renderApiResult(result) {
  // Pisahkan teks berdasarkan blok kode dan teks lainnya
  let formattedHtml = result
    .replace(/```html([^`]+)```/g, '<pre><code>$1</code></pre>') // Mengubah blok kode menjadi <pre><code>
    .replace(/### (.+)/g, '<h3>$1</h3>') // Mengubah heading menjadi <h3>
    .replace(/\n/g, '<br>') // Mengganti line break dengan <br>
    .replace(/\- (.+)/g, '<li>$1</li>') // Mengganti bullet point dengan <li>
    .replace(/(\n\n)/g, '</p><p>') // Memisahkan paragraf
    .replace(/\*\*(.+?)\\/g, '<strong>$1</strong>');
  // Tambahkan wrapper <p> di awal dan akhir
  return `<p>${formattedHtml}</p>`;
}
