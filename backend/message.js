const mongoose=require('mongoose');
const schema= new mongoose.Schema({
    sender:{type:String,required:true},
    receiver:{type: String, required:true},
    message:String,
    image:String,
    video:String,
    time: { type: Date, default: Date.now }
});
const message=mongoose.model('message',schema);
module.exports=message;