import Film from "../database/model/film.js";
import Question from "../database/model/question.js";
import Request from "../database/model/request.js";
import User from "../database/model/user.js";

// class Action {
//     constructor(text="", href="", className="") {
//         this.text = text;
//         this.href = href;
//         this.className = className;
//     }
// }

const filterData = (data=[], fields=[]) => {
    let output = [];
    for (let d of data) {
        let obj = {};
        for (let field of fields) {
            obj[field] = d[field]
        }
        output.push(obj);
    }
    return output;
};

// const actionObj = {
//     films: () => {
//         const actions = [
//             new Action("Approve", "/admin")
//         ]
//     }
// };

const collectionObj = {
    films: async () => {
        const films = await Film.find({}).exec();
        const fields = ["_id", "filmId", "filmTitle", "date", "url", "note"];
        const filtered = filterData(films, fields);
        return filtered;
    },
    questions: async () => {
        const questions = await Question.find({}).exec();
        const fields = ["_id", "email", "message", "date"];
        const filtered = filterData(questions, fields);
        return filtered;
    },
    requests: async () => {
        const requests = await Request.find({}).exec();
        const fields = ["_id", "filmId", "filmTitle", "date"];
        const filtered = filterData(requests, fields);
        return filtered;
    },
    users: async () => {
        const users = await User.find({}).exec();
        const fields = ["_id", "email", "password"];
        const filtered = filterData(users, fields);
        return filtered;
    },
    "": async () => ""
};

const collectionName = {
    films: () => Film,
    questions: () => Question,
    requests: () => Request,
    users: () => User,
    "": () => ""
}

export { collectionObj, collectionName };