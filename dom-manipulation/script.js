let quotes = [];
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

window.onload = function () {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [
      { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
      { text: "Don't watch the clock; do what it does. Keep going.", category: "Inspiration" },
      { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
    ];
  }

  createAddQuoteForm();
  populateCategories();
  filterQuotes();
};

function createAddQuoteForm() {
  const formContainer = document.getElementById("quoteFormContainer");

  const inputText = document.createElement("input");
  inputText.type = "text";
  inputText.id = "newQuoteText";
  inputText.placeholder = "Enter a new quote";

  const inputCategory = document.createElement("input");
  inputCategory.type = "text";
  inputCategory.id = "newQuoteCategory";
  inputCategory.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.onclick = addQuote;

  formContainer.appendChild(inputText);
  formContainer.appendChild(inputCategory);
  formContainer.appendChild(addButton);
}

function filterQuotes() {
  const filter = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", filter);

  const filtered = filter === "all" ? quotes : quotes.filter(q => q.category === filter);

  if (filtered.length === 0) {
    quoteDisplay.innerHTML = "No quotes found in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  const quote = filtered[randomIndex];

  quoteDisplay.innerHTML = `"${quote.text}" — <em>${quote.category}</em>`;
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

newQuoteBtn.addEventListener("click", filterQuotes);

function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text === "" || category === "") {
    alert("Please enter both quote text and category.");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotesToLocalStorage();

  quoteDisplay.innerHTML = `"${newQuote.text}" — <em>${newQuote.category}</em>`;
  sessionStorage.setItem("lastQuote", JSON.stringify(newQuote));

  textInput.value = "";
  categoryInput.value = "";

  populateCategories();
}

function saveQuotesToLocalStorage() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function populateCategories() {
  const filter = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))];

  filter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    filter.appendChild(option);
  });

  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    filter.value = savedFilter;
  }
}

document.getElementById("exportBtn").addEventListener("click", function () {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
});

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (!Array.isArray(importedQuotes)) {
        alert("Invalid file format.");
        return;
      }
      quotes.push(...importedQuotes);
      saveQuotesToLocalStorage();
      populateCategories();
      alert("Quotes imported successfully!");
    } catch (err) {
      alert("Failed to import JSON file.");
      console.error(err);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ✅ Required async/await function
async function fetchQuotesFromServer() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=3");
  const serverData = await response.json();
  return serverData.map(post => ({
    text: post.title,
    category: "Server"
  }));
}

// ✅ Server sync using async/await
async function syncWithServer() {
  const status = document.getElementById("syncStatus");
  status.innerHTML = "🔄 Syncing with server...";

  try {
    const serverQuotes = await fetchQuotesFromServer();
    quotes = [...serverQuotes, ...quotes];
    saveQuotesToLocalStorage();
    populateCategories();
    filterQuotes();
    status.innerHTML = "✅ Synced successfully. Server quotes added.";
  } catch (error) {
    status.innerHTML = "❌ Failed to sync with server.";
    console.error("Sync error:", error);
  }
}

document.getElementById("syncBtn").addEventListener("click", syncWithServer);
