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
        const title = prompt("Habit title:");
        if (title) {
            store.addHabit({title, frequency: {type: "daily"}});
        }
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