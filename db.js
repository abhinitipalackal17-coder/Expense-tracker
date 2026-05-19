const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const dbDir = '/data';
if(!fs.existsSync(dbDir)){
  fs.mkdirSync(dbDir,{recursive:true});
}

const dbFile = path.join(dbDir,'expenses.db');
const db = new sqlite3.Database(dbFile);

const init = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT,
      date TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

const getExpenses = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM expenses ORDER BY date DESC, id DESC', (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const addExpense = ({ title, amount, category, date }) => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`
      INSERT INTO expenses (title, amount, category, date)
      VALUES (?, ?, ?, ?)
    `);

    stmt.run(title, amount, category || '', date, function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, title, amount, category: category || '', date });
    });
  });
};

const deleteExpense = (id) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM expenses WHERE id = ?', id, function (err) {
      if (err) return reject(err);
      resolve();
    });
  });
};

const updateExpense = (id, { title, amount, category, date }) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE expenses SET title = ?, amount = ?, category = ?, date = ? WHERE id = ?`,
      title,
      amount,
      category || '',
      date,
      id,
      function (err) {
        if (err) return reject(err);
        resolve({ id, title, amount, category: category || '', date });
      }
    );
  });
};

init();

module.exports = {
  getExpenses,
  addExpense,
  deleteExpense,
  updateExpense,
};
