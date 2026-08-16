import { workspaceModel } from "../models/workspace.model.js";
import { membershipModel } from "../models/membership.model.js";
import { userModel } from "../models/user.model.js";

 export async function workspaceCreateController(req, res){
    try{
    const{name, description}  = req.body

   const userId = req.user.id
    const workspace = await workspaceModel.create({
        name,
        description,
        owner : userId
    }) 
   
    
    const member = await membershipModel.create({
        user : userId,
        workspace : workspace.id,
        role : "admin"

    })
    res.status(201).json({
        message : "workspace created successfully",
        workspace
    })
    
    }catch(err){
        console.error("workspace error", err.message)
        res.status(500).json({
            message : "something went wrong"
        })

    }

}


 export async function getMyWorkSpaceController(req, res){
    try{
        const userId =  req.user.id
        const getMyWork = await membershipModel.find({
user : userId
        }).populate("workspace")

     res.status(200).json({
        message : "Workspace fetched successfully",
          workspace: getMyWork
            })
        }
    catch(err){
        console.error("GETMY_WORKSPACE", err.message)
        res.status(500).json({
            message : "Something went wrong"
        })

    }
}
export async function getWorkspaceByIdController(req, res){
    try{
        const workspaceId = req.params.workspaceId
        const userId = req.user.id
        const member = await membershipModel.findOne({
            user : userId,
            workspace : workspaceId
        })
        if(!member){
            return res.status(403).json({
                message : "you are not a member of this workspace"
            })
        }
        const memberFind = await workspaceModel.findById(workspaceId)
        if(!memberFind){
         return res.status(404).json({
            message : "workspace not found",
            
        
        })
        }
        res.status(200).json({
    message: "workspace fetched successfully",
    workspace: memberFind
})
    }catch(err){
        console.log("MEMBER_FIND_ERROR",err.message)
        res.status(500).json({
            message : "something went wrong"
        })

    }
}



export async function memberInviteController(req, res){
    try{
   const workspaceId = req.params.workspaceId
   const userId = req.user.id
   const {email, role} = req.body
    const member = await membershipModel.findOne({
        user : userId,
        workspace : workspaceId,
        role : "admin"
    })
    if(!member){
        return res.status(403).json({
            message : "Forbidden Request"
        })
    }

    const newUser = await userModel.findOne({email})
    if(!newUser){
        return res.status(404).json({
            message : "User not Found"
        })
    }
    const isAlreadyMember = await membershipModel.findOne({
        user : newUser.id,
        workspace : workspaceId
    })
    if(isAlreadyMember){
        return res.status(409).json({
            message : "Already a memeber"
        })
    }
   const  memberAdded = await membershipModel.create({
        user : newUser.id,
        workspace : workspaceId,
        role : role
    })
    res.status(201).json({
        message : "user added successfully",
        memberAdded
        
    })
}
catch(err){
    console.error("MEMBER_INVITE", err.message)
    res.status(500).json({
        message :"Something went Wrong"
    })

}
}