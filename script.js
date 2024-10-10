var questionInput = document.getElementById("question");
var answerContentDiv = document.getElementById("answerContent");
var apiUrl = "https://widipe.com/openai";
var historyList = document.getElementById("history");
var likeCount = 0; // Counter untuk likes

async function sendBeg() {
    try {
        // Show loading animation
        answerContentDiv.innerHTML = '<div class="loading"></div>';
        
        const question = questionInput.value;
        const url = `${apiUrl}?text=${encodeURIComponent(question)}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Request failed with status: ${response.status}`);
        }

        const data = await response.json();
        
        // Memformat jawaban dengan benar
        const formattedAnswer = formatApiResult(data.result);
        
        answerContentDiv.innerHTML = formattedAnswer;

        // Add question and answer to history
        addToHistory(question, data.result);
        questionInput.value = ""; // Clear input field
    } catch (error) {
        answerContentDiv.innerHTML = "Sorry, an error occurred: " + error.message;
        console.log(error.message);
    }
}

// Fungsi untuk memformat hasil API agar lebih rapi
function formatApiResult(result) {
    // Menghapus tanda #, ##, ### yang menandakan heading
    let formattedHtml = result
        .replace(/### (.+)/g, '<h3>$1</h3>') // Mengubah heading 3
        .replace(/## (.+)/g, '<h2>$1</h2>') // Mengubah heading 2
        .replace(/# (.+)/g, '<h1>$1</h1>') // Mengubah heading 1
        .replace(/```html([\s\S]+?)```/g, '<pre><code class="language-html">$1</code></pre>') // Mengubah blok kode HTML
        .replace(/```css([\s\S]+?)```/g, '<pre><code class="language-css">$1</code></pre>') // Mengubah blok kode CSS
        .replace(/```([\s\S]+?)```/g, '<pre><code>$1</code></pre>') // Mengubah blok kode umum
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') // Mengubah teks tebal
        .replace(/- (.+)/g, '<li>$1</li>') // Mengubah list
        .replace(/<\/li>(?!\s*<li>)/g, '</li></ul>') // Menutup list
        .replace(/<li>/g, '<ul><li>') // Membuka list baru
        .replace(/\n/g, '<br>'); // Mengganti line break dengan <br>

    return `<div class="formatted-answer">${formattedHtml}</div>`;
}


function addToHistory(question, answer) {
    var listItem = document.createElement("li");
    listItem.className = "border-b border-gray-500 py-2";
    listItem.innerHTML = `<strong>Q:</strong> ${question}`;
    historyList.appendChild(listItem);
}

// Fungsi untuk tombol Like
function likeAnswer() {
    likeCount++;
    alert(`Jawaban ini telah di-like ${likeCount} kali.`);
}

// Fungsi untuk menyalin jawaban ke clipboard
function copyAnswer() {
    const answerText = answerContentDiv.innerText;
    navigator.clipboard.writeText(answerText).then(() => {
        alert("Jawaban berhasil disalin!");
    });
}

// Fungsi untuk membaca jawaban secara keras
function readAloud() {
    const speech = new SpeechSynthesisUtterance(answerContentDiv.innerText);
    speech.lang = 'id-ID'; // Bisa disesuaikan dengan bahasa
    window.speechSynthesis.speak(speech);
}
