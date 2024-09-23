import mongoose from "mongoose";
const messageSchema=new mongoose.Schema({
    senderId:{type:mongoose.Types.ObjectId,ref:'User'},
    receiverId:{type:mongoose.Types.ObjectId,ref:'User'},
    message:{type:String,required:[true,'Message field is required']}
},{timestamps:true})

export const Message=mongoose.model('Message',messageSchema);