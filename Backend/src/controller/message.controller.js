import { membershipModel } from "../models/membership.model.js";
import { messageModel } from "../models/message.model.js";

export async function getWorkspaceMessageController(req, res){
    try{
    const workspace = req.params.workspaceId
    const user = req.user.id
    const memberCheck = await membershipModel.findOne({
        workspace : workspace,
        user : user
    })
    if(!memberCheck){
        return res.status(403).json({
            message : "Forbidden request"
        })
    }
    const messages = await messageModel.find({workspace:workspace}).populate("sender", "username")
    res.status(200).json({
        message : "Message Feteched Sucessfully",
        messages : messages
    })
}
catch(err){
    console.error("MESSAGE_ERROR", err.message)
    res.status(500).json({
        message : "Something Went Wrong"
    })

}
}