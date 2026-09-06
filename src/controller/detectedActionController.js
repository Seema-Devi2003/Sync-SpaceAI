import {membershipModel} from '../models/membership.model.js'
import { detectedActionModel} from '../models/detectedAction.model.js'
 export async function getDetectedActionController(req, res){
    try{
    const workspace = req.params.workspaceId
    const user = req.user.id
    const membershipCheck = await membershipModel.findOne({
        workspace : workspace,
        user : user
    })
if(!membershipCheck){
    return res.status(403).json({
        message : "Forbidden Request"
    })
}
  const action = await detectedActionModel.find({
    workspace : workspace
}).populate("createdBy", "username")
res.status(200).json({
    message : "Action fetched sucessfully",
    action
})
}
catch(err){
    console.error("DETECTED_ACTION", err.message)
    res.status(500).json({
        message : "Something Went Wrong"
    })
}
}

