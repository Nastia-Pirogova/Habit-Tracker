# Habit Tracker (Vanilla JS)

Habit Tracker is a Single Page Application built with pure JavaScript (no frameworks) for tracking daily and weekly habits.

The main goal of this project is to strengthen core JavaScript fundamentals, practice application architecture, and implement state management without using React, Vue, or other frontend frameworks.

---

## 🚀 Demo

https://nastia-pirogova.github.io/Habit-Tracker/habit-tracker/

---

## ✨ Features

- Centralized Store (single source of truth)
- Observer / Pub-Sub pattern for UI updates
- Habit model implemented as a class
- LocalStorage persistence
- Toggle habit completion for the current day
- Automatic UI re-render on state changes
- Full CRUD operations for habits (create / edit / delete)
- Habit archiving
- Current and best streak tracking
- Monthly calendar view
- 7-day and 30-day completion statistics
- Statistics dashboard
- Filtering and search with debounce
- Dark / light theme toggle
- JSON import / export
- Drag & Drop reordering
- Modal window for adding and editing habits

---

## 🧠 Tech Stack

- JavaScript (ES6+)
- Vite
- LocalStorage
- HTML5 / CSS3

---

## 🏗 Architecture

The application follows a modular architecture with a clear separation of concerns:

- `models/` – Business logic (e.g. `Habit` class)
- `services/` – Utility modules (LocalStorage, Date helpers)
- `state/` – Centralized Store & state management
- `ui/` – DOM rendering and event handling
- `utils/` – Helper functions (debounce, etc.)

### 🔄 State Flow

1. UI subscribes to the Store (`store.subscribe(render)`).
2. Store updates its internal state.
3. Store persists data to LocalStorage.
4. Store calls `notify()` to inform subscribers.
5. UI re-renders based on the updated state.

This architecture ensures:

- A single source of truth
- Clean separation between business logic and UI
- Scalable and maintainable structure
- Predictable and controlled state updates

---

## 📁 Project Structure
`src/`

`index.js`

`models/`

`Habit.js`

`services/`

`dateService.js`

`storageService.js`

`state/`

`store.js`

`ui/`

`renderHabits.js`

`styles/`

`main.css`


---

## 🔄 How It Works

### On Application Start

- Data is loaded from LocalStorage.
- Raw objects are converted into `Habit` class instances.
- The Store initializes state.
- The Store notifies subscribers.
- The UI renders based on the current state.

### When a Habit Is Toggled

- The model updates its internal data.
- The Store saves the updated state to LocalStorage.
- The Store calls `notify()`.
- The UI re-renders automatically.

---

## 🧪 Scripts

Install dependencies:

```bash
npm install
```

Run development server:
```bash
npm run dev
```
Build for production:
```bash
npm run build
```
Preview production build:
```bash
npm run preview
```

## 🎯 Purpose

This project is focused on:
- Strengthening JavaScript fundamentals
- Practicing OOP with classes
- Understanding state management patterns
- Building scalable frontend architecture without frameworks
