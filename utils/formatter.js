import dateFormat from "date-format";

const formatFilmDuration = (duration=0) => {
    const d = new Date();
    d.setHours(0, duration, 0, 0);
    let formatted = dateFormat("hh:mm", d).replace(":", "h ") + "m";
    return formatted;
};

export { formatFilmDuration };