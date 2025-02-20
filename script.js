// Ensure Firebase is initialized first
if (!window.database) {
    console.error("Firebase not initialized!");
}

// Load transactions on page load
window.onload = function () {
    loadTransactions();
};

// Handle form submission
document.getElementById('add-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    let amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    // ✅ Make sure incomes are positive, and expenses are negative
    if (category !== "income") {
        amount = -Math.abs(amount); // Ensure expenses are stored as negative values
    }

    const transaction = { title, amount, category, date };
    saveTransaction(transaction);
    e.target.reset();
});


// Save transaction to Firebase
function saveTransaction(transaction) {
    const newRef = database.ref('transactions').push();
    transaction.id = newRef.key; // ✅ Store Firebase key
    newRef.set(transaction)
        .then(() => console.log("Transaction saved!"))
        .catch((error) => console.error("Error saving transaction:", error));
}

// Load transactions from Firebase
function loadTransactions() {
    database.ref('transactions').on('value', (snapshot) => {
        const transactions = [];
        snapshot.forEach((childSnapshot) => {
            transactions.push(childSnapshot.val());
        });

        updateSummary(transactions);
        updateRecentTransactions(transactions);
    });
}


// Update summary section
function updateSummary(transactions) {
    if (!transactions) return;

    const totalIncome = transactions
        .filter(t => t.amount > 0) // ✅ Only count positive amounts as income
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
        .filter(t => t.amount < 0) // ✅ Only count negative amounts as expenses
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const netBalance = totalIncome - totalExpenses;

    document.getElementById('total-income').textContent = `$${totalIncome}`;
    document.getElementById('total-expenses').textContent = `$${totalExpenses}`;
    document.getElementById('net-balance').textContent = `$${netBalance}`;
}


// Update recent transactions list
function updateRecentTransactions(transactions) {
    if (!transactions) return;

    const list = document.getElementById("transactions-list");
    list.innerHTML = ""; // Clear existing transactions

    transactions.slice(-5).forEach((transaction) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${transaction.title}: $${transaction.amount} (${transaction.category})`;

        // Create a delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.setAttribute("data-id", transaction.id);

        // Attach event listener
        deleteBtn.addEventListener("click", () => {
            deleteTransaction(transaction.id);
        });

        // Append button to the list item
        listItem.appendChild(deleteBtn);
        list.appendChild(listItem);
    });
}

function deleteTransaction(id) {
    const confirmDelete = confirm("Are you sure you want to delete this transaction?");
    if (!confirmDelete) return;

    database.ref(`transactions/${id}`).remove()
        .then(() => {
            console.log("Transaction successfully deleted.");
            loadTransactions(); // Refresh the UI
        })
        .catch((error) => console.error("Error deleting transaction:", error));
}


