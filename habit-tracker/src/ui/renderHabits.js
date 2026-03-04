import {todayStr} from "../services/dateService.js";

export function renderHabits(state) {
    ensureLayout();


    const containerFilter = document.querySelector("#filters");

    const activeButton = containerFilter.querySelector('[data-filter="active"]');
    const archivedButton = containerFilter.querySelector('[data-filter="archived"]');

    activeButton.classList.toggle("is-active", state.filter === "active");
    archivedButton.classList.toggle("is-active", state.filter === "archived");

    const containerHabitList = document.querySelector("#habit-list");
    const today = todayStr();

    let habitsToRender = state.habits.filter(h => {
        if (state.filter === "active") {
            return !h.archived;
        } else {
            return h.archived
        }
    });

    if (habitsToRender.length === 0) {
        const msg = state.filter === "active"
            ? "No active habits yet"
            : "No archived habits";
        containerHabitList.innerHTML = `<li class="empty">${msg}</li>`;
        return;
    }

    containerHabitList.innerHTML = habitsToRender.map(
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
    <div id="filters">
        <button class="filter-btn" data-filter="active">Active</button>
        <button class="filter-btn" data-filter="archived">Archived</button>
    </div>
       
  `;

}

