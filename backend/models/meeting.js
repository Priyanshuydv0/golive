const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const MeetingSchema = new Schema({
    userid: {
        type: String,
    },
    meetingId: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }
})

const Meeting = mongoose.model("Meeting", MeetingSchema);
module.exports = Meeting; 