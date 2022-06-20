// import dateFormat from "date-format";

// const formatFilmDuration = (duration=0) => {
//     const d = new Date();
//     d.setHours(0, duration, 0, 0);
//     let formatted = dateFormat("hh:mm", d).replace(":", "h ") + "m";
//     return formatted;
// };

const formatFilmDuration = (minutes=0) => {
    let hh = Math.floor(minutes / 60);
    let mm = minutes % 60;
    return `${hh}h ${mm}m`;
};

export { formatFilmDuration };