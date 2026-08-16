import { taskModel } from "../models/task.model.js";
import { workspaceModel } from "../models/workspace.model.js";
import { membershipModel } from "../models/membership.model.js";

export async function  createTaskController(req, res){
    try{
    const{title, description, assignedTo, priority } = req.body
    const workspace = req.params.workspaceId
    const userId = req.user.id
    const memberExist = await membershipModel.findOne({
        user : userId,
        workspace : workspace,
        
    })
    if(!memberExist){
        return res.status(403).json({
            message :"Forbidden request"
        })
    }
    const createTask = await taskModel.create({
        title,
        description,
        workspace : workspace,
        createdBy :userId,
        assignedTo : assignedTo,
        priority : priority
    })
    
res.status(201).json({
    message : "Task created successfully",
    createTask

})
    }
    catch(err){
        console.error("CREATE_TASK", err.message)
        res.status(500).json({
            message : "Something went wrong"
        })
    }

}
 export async function getWorkspaceTasks(req, res){
    try{
    const workspace = req.params.workspaceId
    const userId = req.user.id
    const isMemberExist = await membershipModel.findOne({
        user : userId,
        workspace : workspace
    })
    if(!isMemberExist){
        return res.status(403).json({
            message : "Forbidden request"
        })
    }
     const findTask = await taskModel.find({
        workspace : workspace
    })
    res.status(200).json({
        message : "Task feteched Sucessfully",
        findTask
    })
}
  catch(err){
        console.error("FIND_TASK", err.message)
        res.status(500).json({
            message : "Something went wrong"
        })
    }

 }