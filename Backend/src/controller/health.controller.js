import {membershipModel} from "../models/membership.model.js";
import {taskModel} from "../models/task.model.js";
import {detectedActionModel} from "../models/detectedAction.model.js";
export async function getHealthScoreController(req, res){
    try{
        const workspace = req.params.workspaceId;
        const user = req.user.id;
        const membershipCheck = await membershipModel.findOne({
            workspace : workspace,
            user : user
        })
        if(!membershipCheck){
            return res.status(403).json({
                message : "Forbidden Request"
            })
        }
        const totalTasks = await taskModel.countDocuments({workspace : workspace});
    const completeTasks = await taskModel.countDocuments({workspace, status: "completed"})
    const blockers = await detectedActionModel.countDocuments({workspace, action : "blocker"})
 const completeRate = totalTasks === 0 ? 0 : (completeTasks / totalTasks) * 100
  const healthScore = completeRate - (blockers *5)
  res.status(200).json({
    message : "feteched health score sucessfully",
    healthScore
  })
    }
    catch(err){
        console.error("HEALTH_SCORE_ERROR", err.message)
        res.status(500).json({
            message : "Something Went Wrong"
        })
    }
    
}