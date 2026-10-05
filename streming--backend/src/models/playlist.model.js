import mongoose from "mongoose";
const {Schema} = mongoose

const playlistSchema = new Schema(
    {
        name:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        videos:[
            {
                type:Schema.Types.ObjectId,
                ref:"Video"
            }
        ], // Playlist will contain the list of videos
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    },
    {timestamps:true}
)

export const Playlist = mongoose.model("Playlist",playlistSchema)