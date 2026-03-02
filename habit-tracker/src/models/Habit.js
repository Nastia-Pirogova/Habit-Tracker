import {todayStr} from "../services/dateService.js";

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
}