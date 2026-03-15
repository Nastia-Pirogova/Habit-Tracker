import {loadHabitsRaw, saveHabitsRaw} from "../services/storageService.js";
import {Habit} from "../models/Habit.js";

class Store {
    constructor() {
        this.state = {
            habits: [],
            selectedHabitId: null,
            filter: "active",
            query: "",
            calendarYear: new Date().getFullYear(),
            calendarMonth: new Date().getMonth(),
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

    updateHabitTitle(id, newTitle) {
        const habit = this.state.habits.find((h) => h.id === id);
        if (!habit) return;

        const title = newTitle.trim();
        if (title.length < 3) return;

        habit.title = title;
        this.save();
        this.notify();
    }

    setQuery(query) {
        this.state.query = query;
        this.notify();
    }

    selectHabit(id) {
        this.state.selectedHabitId = id;
        this.notify();
    }

    goToPrevMonth(){
        if (this.state.calendarMonth === 0) {
            this.state.calendarMonth = 11;
            this.state.calendarYear--;
        } else {
            this.state.calendarMonth--;
        }

        this.notify();
    }

    goToNextMonth(){
        if (this.state.calendarMonth === 11) {
            this.state.calendarMonth = 0;
            this.state.calendarYear++;
        } else {
            this.state.calendarMonth++;
        }

        this.notify();
    }

    reorderHabits(draggedId, targetId) {
        const habits = [...this.state.habits];

        const draggedIndex = habits.findIndex((h) => h.id === draggedId);
        const targetIndex = habits.findIndex((h) => h.id === targetId);

        if (draggedIndex === -1 || targetIndex === -1) return;

        const [movedHabit] = habits.splice(draggedIndex, 1);
        habits.splice(targetIndex, 0, movedHabit);

        this.state.habits = habits;
        this.save();
        this.notify();
    }

}

export const store = new Store();