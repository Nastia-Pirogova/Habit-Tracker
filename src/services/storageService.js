const KEY = "habit-tracker:v1";

export function loadHabitsRaw() {
    try {
        const json = localStorage.getItem(KEY);
        if (!json) return [];
        const data = JSON.parse(json);
        return Array.isArray(data) ? data : [];
    } catch (e) {
        console.warn("Failed to load habits:", e);
        return [];
    }
}

export function saveHabitsRaw(habitsRaw) {
    try {
        localStorage.setItem(KEY, JSON.stringify(habitsRaw));
    } catch (e) {
        console.warn("Failed to save habits:", e);
    }
}