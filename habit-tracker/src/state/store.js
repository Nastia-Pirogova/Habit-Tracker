import {loadHabitsRaw, saveHabitsRaw} from "../services/storageService.js";
import {Habit} from "../models/Habit.js";

class Store {
    constructor() {
        this.state = {
            habits: [],
            selectedHabitId: null,
            filter: "active",
        };

        this.listeners = [];
    }

    init() {
        const raw = loadHabitsRaw();
        this.state.habits = raw.map((h) => new Habit(h));
        this.notify();
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    notify() {
        this.listeners.forEach((listener) => listener(this.state));
    }

    save() {
        saveHabitsRaw(this.state.habits.map((h) => h.toJSON()));
    }

    addHabit(data) {
        const habit = new Habit(data);
        this.state.habits.push(habit);
        this.save();
        this.notify();
    }

    toggleHabit(id, dateStr) {
        const habit = this.state.habits.find((h) => h.id === id);
        if (!habit) return;

        habit.toggle(dateStr);
        this.save();
        this.notify();
    }

    deleteHabit(id) {
        const before = this.state.habits.length;

        this.state.habits = this.state.habits.filter((h) => h.id !== id);

        if (this.state.habits.length === before) return;

        this.save();
        this.notify();
    }

    toggleArchive(id) {
        const habit = this.state.habits.find((h) => h.id === id);

        if (!habit) return;

        habit.archived = !habit.archived;

        this.save();
        this.notify();
    }

    setFilter(filter) {
        this.state.filter = filter
        this.notify();
    }
}

export const store = new Store();