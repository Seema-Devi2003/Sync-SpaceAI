import mongoose from 'mongoose'
 export async function connectToDB(){
    try{
    await mongoose.connect(process.env.MONGO_URI).
    then(()=>{
        console.log("connected to DB")
    })
}
catch(err){
    console.error("Database Error", err.message)
    process.exit(1) // Server is shut down if database connection fail
    
}
}