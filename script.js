// Load transactions from Firebase when the page loads
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
    list.innerHTML = transactions
        .slice(-5) // Show the last 5 transactions
        .map(t => `<li>${t.title}: $${t.amount} (${t.category})</li>`)
        .join('');
}
