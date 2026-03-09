import "./styles/main.css";
import {store} from "./state/store.js";
import {renderHabits} from "./ui/renderHabits.js";
import {todayStr} from "./services/dateService.js";
import {debounce} from "./utils/debounce.js";

store.subscribe(renderHabits);
store.init();

document.addEventListener("click", (e) => {
    const action = e.target.dataset.action;
    const actionFilter = e.target.dataset.filter;
    const id = e.target.closest("li")?.dataset.id;

    if (action === "toggle" && id) {
        store.toggleHabit(id, todayStr());
    }

    if (e.target.id === "add-btn") {
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

        store.addHabit({title, frequency: {type: "daily"}});

        modal.classList.add("hidden");
        input.value = "";
    }


    if (action === "delete" && id) {
        store.deleteHabit(id);
    }

    if (action === "archive" && id) {
        store.toggleArchive(id);
    }

    if (actionFilter) store.setFilter(actionFilter);

    if (action === "edit" && id) {
        const title = prompt("New title:");
        if (title) {
            store.updateHabitTitle(id, title);
        }
    }
});

const debouncedSearch = debounce((value) => {
    store.setQuery(value);
}, 300);

document.addEventListener("input", (e) => {
    if (e.target.id === "search-input") {
        debouncedSearch(e.target.value);
    }
});