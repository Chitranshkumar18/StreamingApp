import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";


const getChannelStats = asyncHandler(async(req,res)=>{
    const userId = req.user?._id;

    if(!userId){
        throw new ApiError(401, "User is not logged in");
    }

    const videos = await Video.find({
        owner: userId
    });

    const totalVideos = videos.length;

    const totalSubscribers = await Subscription.countDocuments({
        channel: userId
    });

    const totalViews = videos.reduce(
        (total, video) => total + (video.views || 0),
        0
    );

    const totalLikes = await Like.countDocuments({
        video: { $in: videos.map(video => video._id) }
    });

    const stats = {
        totalVideos,
        totalSubscribers,
        totalViews,
        totalLikes
    };

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                stats,
                "Channel statistics fetched successfully"
            )
        );
})


const getChannelVideos = asyncHandler(async(req,res)=>{
    const userId = req.user?._id;

    if(!userId){
        throw new ApiError(401, "User is not logged in");
    }

    const videos = await Video.find({
        owner: userId
    })
    .populate("owner", "username avatar fullName")
    .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                videos || [],
                "Channel videos fetched successfully"
            )
        );
})


export{
    getChannelStats,
    getChannelVideos
}