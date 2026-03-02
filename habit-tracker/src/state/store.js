import { loadHabitsRaw, saveHabitsRaw } from "../services/storageService.js";
import { Habit } from "../models/Habit.js";

class Store {
    constructor() {
        this.state = {
            habits: [],
            selectedHabitId: null,
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
}

export const store = new Store();