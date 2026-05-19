const form = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const totalLabel = document.getElementById('total');

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

const fetchExpenses = async () => {
  const response = await fetch('/api/expenses');
  return await response.json();
};

const refreshExpenses = async () => {
  const expenses = await fetchExpenses();
  expenseList.innerHTML = '';
  let total = 0;

  if (expenses.length === 0) {
    expenseList.innerHTML = '<p class="empty">No expenses yet. Add one above.</p>';
  }

  expenses.forEach((expense) => {
    total += Number(expense.amount);

    const card = document.createElement('div');
    card.className = 'expense-card';
    card.innerHTML = `
      <div class="info">
        <strong>${expense.title}</strong>
        <span>${expense.category || 'No category'} • ${expense.date}</span>
      </div>
      <div class="actions">
        <span>${formatCurrency(expense.amount)}</span>
        <button data-id="${expense.id}">Delete</button>
      </div>
    `;

    const deleteButton = card.querySelector('button');
    deleteButton.addEventListener('click', async () => {
      await fetch(`/api/expenses/${expense.id}`, {
        method: 'DELETE',
      });
      refreshExpenses();
    });

    expenseList.appendChild(card);
  });

  totalLabel.textContent = `Total: ${formatCurrency(total)}`;
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    title: document.getElementById('title').value.trim(),
    amount: Number(document.getElementById('amount').value),
    category: document.getElementById('category').value.trim(),
    date: document.getElementById('date').value,
  };

  await fetch('/api/expenses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  form.reset();
  refreshExpenses();
});

refreshExpenses();
