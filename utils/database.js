import jwt from "jsonwebtoken";
import Request from "../database/model/request.js";
import UserClient from "../database/model/user-client.js";

const { ACCESS_USER_KEY: userKey } = process.env;

const saveReq = async (filmId, filmTitle, filmDate) => {
    const oldRequest = await Request.findOne({ filmId });
    if (oldRequest && oldRequest.total) {
        await Request.updateOne({ filmId }, {
            $set: {
                total: oldRequest.total + 1
            }
        });
    } else {
        const request = new Request({ filmId, filmTitle, date: filmDate, total: 1 });
        await request.save();
    }
};

// const getUserClientObj = async (encodedEmail) => {
//     const output = {
//         error: null,
//         user: null
//     };

//     try {
//         const decodedEmailObj = jwt.verify(encodedEmail, userKey);
//         const user = await UserClient.findOne({ email: decodedEmailObj.email });
//         output.user = user;
//         return output;
//     } catch (err) {
//         output.error = err;
//         return output;
//     }
// };

export { saveReq };