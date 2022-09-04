import Film from "../database/model/film.js";
import Question from "../database/model/question.js";
import Request from "../database/model/request.js";
import User from "../database/model/user.js";

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

const sortCollection = (collections=[], option="oldest") => {
    const sorted = collections.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
    });
    option === "oldest" ? 0 : sorted.reverse();
    option === "popular" ? sorted.sort((a, b) => b.total - a.total) : 0;
    return sorted;
};

const searchCollection = (collections=[], pattern, property="") => {
    const filteredCollections = collections.filter((collection, i) => {
        const regex = new RegExp(pattern, "i");
        if (!property) {
            return collection.match(regex);
        }
        return collection[property].match(regex);
    });
    return filteredCollections;
};

const collectionObj = {
    films: async () => {
        const films = await Film.find({});
        const fields = ["_id", "filmId", "filmTitle", "date", "url", "note"];
        const filtered = filterData(films, fields);
        return filtered;
    },
    questions: async () => {
        const questions = await Question.find({});
        const fields = ["_id", "email", "message", "date"];
        const filtered = filterData(questions, fields);
        return filtered;
    },
    requests: async () => {
        const requests = await Request.find({});
        const fields = ["_id", "filmId", "filmTitle", "date", "total"];
        const filtered = filterData(requests, fields);
        return filtered;
    },
    users: async () => {
        const users = await User.find({});
        const fields = ["_id", "email", "password"];
        const filtered = filterData(users, fields);
        return filtered;
    },
    "": async () => []
};

const collectionName = {
    films: () => Film,
    questions: () => Question,
    requests: () => Request,
    users: () => User,
    "": () => {}
}

export { collectionObj, collectionName, sortCollection, searchCollection };