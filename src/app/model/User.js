import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    channelName:{
        type:String,
        required:true,
    },
    channelId:{
        type:String,
        required:true
    }
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);