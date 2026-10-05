import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
        videoFile:{
            type: String,// coudinary url
            required: true,
        },
        thumbnail:{
            type: String, // coudinary url
            required: true,
        },
        videoFilePublicId:{
            type: String,
        },
        thumbnailPublicId:{
            type: String,
        },
        title:{
            type: String,
            required: true,
        },
        description:{
            type: String,
            required: true,
        },
        duration:{
            type: Number,
            required: true,
        },
        views:{
            type: Number,
            default: 0,
        },
        isPublished:{
            type: Boolean,
            default: false,
        },
        owner:{
            type: Schema.Types.ObjectId,   //This is a MongoDB reference.
            ref: "User"
        }     

    },
    
    {
      timestamps:true
    }
)

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema);
