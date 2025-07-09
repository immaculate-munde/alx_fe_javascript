// Add event listener to the "Add" button
document.getElementById("add-button").addEventListener("click", addItem);

// Function to add an item to the list
function addItem() {
    const input = document.getElementById("input-text");
    const inputValue = input.value.trim();

    if (inputValue !== "") {
        const listItem = document.createElement("li");
        listItem.textContent = inputValue;
        document.getElementById("list-container").appendChild(listItem);
        input.value = "";
    }
}

