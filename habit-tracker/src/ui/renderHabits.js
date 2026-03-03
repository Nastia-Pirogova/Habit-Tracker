import {todayStr} from "../services/dateService.js";

export function renderHabits(state) {
    ensureLayout();

    const containerHabitList = document.querySelector("#habit-list");
    const today = todayStr();
    containerHabitList.innerHTML = state.habits.map(
        (h) => `
              <li data-id="${h.id}">
                <strong>${h.title}</strong>
                <button data-action="toggle">
                  ${h.isDoneOn(today) ? "✅" : "⬜"}
                </button>
                <button data-action="delete">🗑</button>
                 <button data-action="archive">${h.archived ? "Unarchive" : "Archive"}</button>
              </li>
            `
    ).join("")

}

function ensureLayout() {
    const container = document.querySelector("#app");
    if (container.querySelector("#habit-list")) return;

    container.innerHTML = `
    <h1>Habit Tracker</h1>
    <button id="add-btn">Add Habit</button>
    <ul id="habit-list"></ul>
  `;

}

