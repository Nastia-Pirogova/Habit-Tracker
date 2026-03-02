import {todayStr} from "../services/dateService.js";
import {store} from "../state/store.js";

export function renderHabits(state) {
    const container = document.querySelector("#app");

    container.innerHTML = `
    <h1>Habit Tracker</h1>
    <button id="add-btn">Add Habit</button>
    <ul>
      ${state.habits
        .map(
            (h) => `
          <li data-id="${h.id}">
            <strong>${h.title}</strong>
            <button data-action="toggle">
              ${h.isDoneOn(todayStr()) ? "✅" : "⬜"}
            </button>
          </li>
        `
        )
        .join("")}
    </ul>
  `;
}