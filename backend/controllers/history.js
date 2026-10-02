const history =require("../models/meeting")


const getMeetingHistory=async(req,res)=>{
    try {
        const userId=req.user.id;
        console.log(userId);
        const meetings=await history.find({userid : userId});
        console.log(meetings[0]);
    
            return res.status(200).json({meetings : meetings});
        
       

    } catch (error) {
        res.status(500).json({message : "internal server error"})
    }
}
const postMeetingHistory=async(req,res)=>{
    try {
        const userId=req.user.id;
        console.log(userId);
        const meetingId=req.body.meetingId
        let newMeeting = new history({
            userid: userId,
            meetingId : meetingId
        })

        await newMeeting.save();
        return res.status(200)
        
       

    } catch (error) {
        res.status(500).json({message : "internal server error"})
    }
}

module.exports={
    getMeetingHistory,
    postMeetingHistory
}