const transactions = [];

document.getElementById('add-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    const transaction = { title, amount, category, date };
    transactions.push(transaction);
    updateSummary();
    updateRecentTransactions();
    e.target.reset();
});

function updateSummary() {
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

function updateRecentTransactions() {
    const list = document.getElementById('transactions-list');
    list.innerHTML = transactions
        .slice(-5)
        .map(t => `<li>${t.title}: $${t.amount} (${t.category})</li>`)
        .join('');
}