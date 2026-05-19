const path = require('path');
const express = require('express');
const cors = require('cors');
const db = require('./db');
const { start } = require('repl');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await db.getExpenses();
    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load expenses' });
  }
});

app.post('/api/expenses', async (req, res) => {
  const { title, amount, category, date } = req.body;
  if (!title || !amount || !date) {
    return res.status(400).json({ error: 'Title, amount, and date are required' });
  }

  try {
    const expense = await db.addExpense({ title, amount, category, date });
    res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add expense' });
  }
});

app.delete('/api/expenses/:id', async (req, res) => {
  const expenseId = Number(req.params.id);

  try {
    await db.deleteExpense(expenseId);
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

app.put('/api/expenses/:id', async (req, res) => {
  const expenseId = Number(req.params.id);
  const { title, amount, category, date } = req.body;

  if (!title || !amount || !date) {
    return res.status(400).json({ error: 'Title, amount, and date are required' });
  }

  try {
    const expense = await db.updateExpense(expenseId, { title, amount, category, date });
    res.json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Expense Tracker server running on http://localhost:${PORT}`);
});
