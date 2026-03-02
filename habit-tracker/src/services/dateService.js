export function pad2(n) {
    return String(n).padStart(2, "0");
}

export function formatDateToStr(date) {
    const y = date.getFullYear();
    const m = pad2(date.getMonth() + 1);
    const d = pad2(date.getDate());
    return `${y}-${m}-${d}`;
}

export function todayStr() {
    return formatDateToStr(new Date());
}

export function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}