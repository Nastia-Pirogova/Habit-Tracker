import {todayStr} from "../services/dateService.js";

export function renderHabits(state) {
    ensureLayout();
    renderFilters(state);
    renderHabitList(state);
}

function ensureLayout() {
    const container = document.querySelector("#app");
    if (container.querySelector("#habit-list")) return;

    container.innerHTML = `
    <h1>Habit Tracker</h1>

    <div class="toolbar">
      <button id="add-btn">Add Habit</button>
      <input id="search-input" type="text" placeholder="Search habits..." />
    </div>
    
    <ul id="habit-list"></ul>

    <div id="filters">
      <button class="filter-btn" data-filter="active">Active</button>
      <button class="filter-btn" data-filter="archived">Archived</button>
    </div>

    <div id="modal" class="modal hidden">
      <div class="modal-content">
        <h2 id="modal-title">Add Habit</h2>
    
        <input id="habit-input" type="text" placeholder="Habit title" />
    
        <div class="modal-actions">
          <button id="modal-save">Save</button>
          <button id="modal-cancel">Cancel</button>
        </div>
      </div>
    </div>
  `;
}

function renderFilters(state) {
    const containerFilter = document.querySelector("#filters");

    const activeButton = containerFilter.querySelector('[data-filter="active"]');
    const archivedButton = containerFilter.querySelector('[data-filter="archived"]');

    activeButton.classList.toggle("is-active", state.filter === "active");
    archivedButton.classList.toggle("is-active", state.filter === "archived");
}

function renderHabitList(state) {
    const containerHabitList = document.querySelector("#habit-list");
    const today = todayStr();

    const habitsToRender = getHabitsToRender(state);

    if (habitsToRender.length === 0) {
        let msg = "";

        if (state.query.trim() !== "") {
            msg = "No habits match your search";
        } else {
            msg = state.filter === "active"
                ? "No active habits yet"
                : "No archived habits";
        }

        containerHabitList.innerHTML = `<li class="empty">${msg}</li>`;
        return;
    }


    containerHabitList.innerHTML = habitsToRender
        .map(
            (h) => `
        <li data-id="${h.id}" class="habit-item">
          <strong>${h.title}</strong>

          <button data-action="toggle">
            ${h.isDoneOn(today) ? "✅" : "⬜"}
          </button>

          <button data-action="delete" class="habit-btn-delete">🗑</button>

          <button data-action="archive" class="habit-btn-archive">
            ${h.archived ? "Unarchive" : "Archive"}
          </button>

          <button data-action="edit" class="habit-btn-edit">✏️</button>
           <span class="streak">🔥 ${h.getCurrentStreak(today)}</span>
           <span class="best">🏆 ${h.getBestStreak()}</span>
           <span class="stat">${h.getCompletion(7, today)}/7</span>
           <span class="stat">${h.getCompletion(30, today)}/30</span>
          
        </li>
      `
        )
        .join("");
}

function getHabitsToRender(state) {
    let habits = state.habits.filter((h) =>
        state.filter === "active" ? !h.archived : h.archived
    );

    if (state.query.trim() === "") {
        return habits;
    }

    return habits.filter((h) =>
        h.title.toLowerCase().includes(state.query.toLowerCase())
    );

}