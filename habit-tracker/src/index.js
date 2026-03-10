import "./styles/main.css";
import {store} from "./state/store.js";
import {renderHabits} from "./ui/renderHabits.js";
import {todayStr} from "./services/dateService.js";
import {debounce} from "./utils/debounce.js";

store.subscribe(renderHabits);
store.init();

let modalMode = "add";
let editingHabitId = null;

document.addEventListener("click", (e) => {
    const action = e.target.dataset.action;
    const actionFilter = e.target.dataset.filter;
    const id = e.target.closest("li")?.dataset.id;


    if (action === "toggle" && id) {
        store.toggleHabit(id, todayStr());
    }

    if (e.target.id === "add-btn") {
        modalMode = "add"
        editingHabitId = null

        const modal = document.querySelector("#modal");
        modal.classList.remove("hidden");
    }

    if (e.target.id === "modal-cancel") {
        const modal = document.querySelector("#modal");
        const input = document.querySelector("#habit-input");

        modal.classList.add("hidden");
        input.value = "";
    }

    if (e.target.id === "modal-save") {
        const modal = document.querySelector("#modal");
        const input = document.querySelector("#habit-input");

        const title = input.value.trim();

        if (!title) return;

        if (modalMode === "add") {
            store.addHabit({title, frequency: {type: "daily"}});
        } else if (modalMode === "edit") {
            const title = input.value.trim();

            if (!title) return;

            if (title) {
                store.updateHabitTitle(editingHabitId, title);
            }
        }

        modal.classList.add("hidden");
        input.value = "";
    }

    if (action === "edit" && id) {
        const modal = document.querySelector("#modal");
        const input = document.querySelector("#habit-input");
        const modalTitle = document.querySelector("#modal-title");

        const habit = store.state.habits.find((h) => h.id === id);
        if (!habit) return;

        modalMode = "edit";
        editingHabitId = id;

        modalTitle.innerText = "Edit Habit";
        input.value = habit.title;

        modal.classList.remove("hidden");
        input.focus();
    }


    if (action === "delete" && id) {
        store.deleteHabit(id);
    }

    if (action === "archive" && id) {
        store.toggleArchive(id);
    }

    if (actionFilter) store.setFilter(actionFilter);


});

const debouncedSearch = debounce((value) => {
    store.setQuery(value);
}, 300);

document.addEventListener("input", (e) => {
    if (e.target.id === "search-input") {
        debouncedSearch(e.target.value);
    }
});