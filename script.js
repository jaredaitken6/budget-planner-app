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
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    const transaction = { title, amount, category, date };
    saveTransaction(transaction);
    e.target.reset();
});

// Save transaction to Firebase
function saveTransaction(transaction) {
    database.ref('transactions').push(transaction)
        .then(() => console.log("Transaction saved!"))
        .catch((error) => console.error("Error saving transaction:", error));
}

// Load transactions from Firebase
function loadTransactions() {
    database.ref('transactions').on('value', (snapshot) => {
        const transactions = [];
        snapshot.forEach((childSnapshot) => {
            const transaction = childSnapshot.val();
            transaction.id = childSnapshot.key; // Store the Firebase key
            transactions.push(transaction);
        });
        updateSummary(transactions);
        updateRecentTransactions(transactions);
    });
}

// Update summary section
function updateSummary(transactions) {
    if (!transactions) return;
    const totalIncome = transactions
        .filter(t => t.category === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
        .filter(t => t.category !== 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    const netBalance = totalIncome - totalExpenses;

    document.getElementById('total-income').textContent = `$${totalIncome}`;
    document.getElementById('total-expenses').textContent = `$${totalExpenses}`;
    document.getElementById('net-balance').textContent = `$${netBalance}`;
}

// Update recent transactions list
function updateRecentTransactions(transactions) {
    if (!transactions) return;
    const list = document.getElementById('transactions-list');
    list.innerHTML = ''; // Clear the list before updating

    transactions.slice(-5).forEach((t) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `${t.title}: $${t.amount} (${t.category}) `;

        // Create a delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.style.marginLeft = '10px';
        deleteButton.style.backgroundColor = 'black';
        deleteButton.style.color = 'white';
        deleteButton.style.border = 'none';
        deleteButton.style.padding = '5px 10px';
        deleteButton.style.cursor = 'pointer';

        // Attach event listener to delete the transaction
        deleteButton.addEventListener('click', () => deleteTransaction(t.id));

        // Append the button to the list item
        listItem.appendChild(deleteButton);

        // Add list item to the transaction list
        list.appendChild(listItem);
    });
}

// Delete transaction from Firebase
function deleteTransaction(transactionId) {
    if (confirm("Are you sure you want to delete this transaction?")) {
        database.ref('transactions/' + transactionId).remove()
            .then(() => console.log("Transaction deleted!"))
            .catch((error) => console.error("Error deleting transaction:", error));
    }
}
