import {todayStr, addDays} from "../services/dateService.js";

export class Habit {
    constructor({
                    id,
                    title,
                    description = "",
                    frequency = {type: "daily"},
                    createdAt,
                    history = [],
                    archived = false,
                }) {
        if (!title || title.trim().length < 2) {
            throw new Error("Habit title is required (min 2 chars)");
        }

        this.id = id ?? crypto.randomUUID();
        this.title = title.trim();
        this.description = description.trim();
        this.frequency = frequency;
        this.createdAt = createdAt ?? new Date().toISOString();
        this.archived = archived;


        this.history = new Set(history);
    }

    isDoneOn(dateStr) {
        return this.history.has(dateStr);
    }

    toggle(dateStr = todayStr()) {
        if (this.history.has(dateStr)) this.history.delete(dateStr);
        else this.history.add(dateStr);
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            frequency: this.frequency,
            createdAt: this.createdAt,
            archived: this.archived,
            history: [...this.history],
        };
    }

    getCurrentStreak(today) {
        let streak = 0;
        let currentDate = today;

        while (this.history.has(currentDate)) {
            streak++;
            currentDate = addDays(currentDate, -1);
        }

        return streak;
    }

    getBestStreak() {
        if (this.history.size === 0) return 0;
        const dates = [...this.history].sort();

        let best = 1;
        let current = 1;

        for (let i = 1; i < dates.length; i++) {
            const prev = dates[i - 1];
            const curr = dates[i];

            const nextDay = addDays(prev, 1);

            if (curr === nextDay) {
                current++;
                best = Math.max(best, current);
            } else {
                current = 1;
            }
        }

        return best;
    }

    getCompletion(days, today) {
        let count = 0;

        for (let i = 0; i < days; i++) {
            const date = addDays(today, -i);

            if (this.history.has(date)) {
                count++;
            }
        }

        return count;
    }
}