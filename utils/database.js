import Request from "../database/model/request.js";

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

export { saveReq };