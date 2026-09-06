import { taskModel } from "../models/task.model.js";
import { workspaceModel } from "../models/workspace.model.js";
import { membershipModel } from "../models/membership.model.js";
import e from "express";

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
    const filter = {workspace : workspace}
    
    if(req.query.status){
        filter.status = req.query.status
    }
    if(req.query.priority){
        filter.priority = req.query.priority
    }
    if(req.query.assignedTo){
        filter.assignedTo = req.query.assignedTo
    }
     const findTask = await taskModel.find(
      filter)
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

 export async function updateTaskStatusController(req, res){
    try{
    const {status} = req.body
    const workspace = req.params.workspaceId
    const task = req.params.taskId
    const user = req.user.id
    const memberShipCheck = await membershipModel.findOne({
        user : user,
        workspace : workspace

    })
        if(!memberShipCheck){
            return res.status(403).json({
                message : "Not Found"
            })
        }
        const updateTask = await taskModel.findByIdAndUpdate(
            task,
         {status},
          {new: true}
        )
        if(!updateTask){
            return res.status(404).json({
                message : "Not Updated"
            })
        }
        res.status(200).json({
            message : "update task successfully",
            updateTask
        })
    }
    catch(err){
        console.log("UPDATE_TASK", err.message)
        res.status(500).json({
            message : "Something went wrong"
        })
    }
 }
  export async function deleteTaskController(req, res){
    try{
        const user = req.user.id
        const workspace = req.params.workspaceId
        const task = req.params.taskId
        const membershipCheck = await membershipModel.findOne({
user : user,
workspace : workspace
        })
        if(!membershipCheck){
            return res.status(403).json({
                message : "Forbidden Request"
            })

        }
        const DeleteTask = await taskModel.findByIdAndDelete(task)
        if(!DeleteTask){
            return res.status(404).json({
                message : "Task not Found"
            })
        }
        res.status(200).json({
            message : "Task deleted Successfully",
            DeleteTask
        })
    }
    catch(err){
        console.error("DELETE_TASK", err.message)
        res.status(500).json({
            message : "Something went wrong"
        })
    }
  }