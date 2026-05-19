# Expense Tracker

A personal, easy-to-use expense tracker with a local SQLite database.

## Features

- Add expenses with title, amount, category, and date
- View a running total of expenses
- Delete expenses
- Local SQLite storage via Express backend

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

3. Open your browser at `http://localhost:3000`

## Development

For automatic server reload during development:

```bash
npm run dev
```

## Project structure

- `server.js` - Express API server
- `db.js` - SQLite database helper and schema initialization
- `public/` - Frontend UI
- `data/expenses.db` - SQLite database file (created automatically)
