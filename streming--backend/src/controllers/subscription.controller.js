import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {User} from "../models/user.model.js"
import {Subscription} from "../models/subscription.model.js"

const toggleSubscription = asyncHandler(async(req,res)=>{
    // 1. channelId lena.
    // 2. Check karna channelId provided hai.
    // 3. Logged-in user ki ID lena.
    // 4. Check karna user logged-in hai.
    // 5. Channel/User database se find karna.
    // 6. Check karna channel exist karta hai ya nahi.
    // 7. Check karna user khud ko subscribe na kar raha ho.
    // 8. Check karna subscription already exist karti hai ya nahi.
    // 9. Agar subscription exist karti hai:
    //    - Subscription delete karna.
    //    - Unsubscribed response return karna.
    // 10. Agar subscription exist nahi karti:
    //    - New subscription create karna.
    //    - Subscribed response return karna.
    // 1. channelId lena.
    const {channelId} = req.params;

    // 2. Check karna channelId provided hai.
    if(!channelId) {
        throw new ApiError(400,"Channel id is required");
    }
    
    // 3. Logged-in user ki ID lena.
    const userId = req.user?._id;

    // 4. Check karna user logged-in hai.
    if(!userId){
        throw new ApiError(401, "User is not logged in");
    }

    // 5. Channel/User database se find karna.
    const channel = await User.findById(channelId);

    // 6. Check karna channel exist karta hai ya nahi.
    if(!channel){
        throw new ApiError(404, "Channel not found");
    }

    // 7. Check karna user khud ko subscribe na kar raha ho.
    if(channelId.toString() === userId.toString()){
        throw new ApiError(400, "User cannot subscribe to itself");
    }

    // 8. Check karna subscription already exist karti hai ya nahi.
    const subscription = await Subscription.findOne({
        subscriber: userId,
        channel: channelId
    });

    // 9. Agar subscription exist karti hai:
    //    - Subscription delete karna.
    //    - Unsubscribed response return karna.
    if(subscription){
        const deletedSubscription =
            await Subscription.findByIdAndDelete(subscription._id);

        if(!deletedSubscription){
            throw new ApiError(
                500,
                "Something went wrong while unsubscribing"
            );
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                null,
                "Channel unsubscribed successfully"
            )
        );
    }

    // 10. Agar subscription exist nahi karti:
    //     - New subscription create karna.
    //     - Subscribed response return karna.
    const newSubscription = await Subscription.create({
        subscriber: userId,
        channel: channelId
    });

    if(!newSubscription){
        throw new ApiError(
            500,
            "Something went wrong while subscribing"
        );
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            newSubscription,
            "Channel subscribed successfully"
        )
    );
})


const getUserChannelSubscribers = asyncHandler(async(req,res)=>{
    const channelId = req.params.channelId || req.params.subscriberId || req.user?._id;
    if(!channelId){
        throw new ApiError(403, "Channel ID is required")
    }

    const channel = await User.findById(channelId);
    if(!channel){
        throw new ApiError(404, "Channel not found")
    }

    const subscribers = await Subscription.find({
        channel: channelId     
    }).populate("subscriber", "username avatar fullName");

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            subscribers || [],
            "Subscribers fetched successfully"
        ))
})


const getSubscribedChannels = asyncHandler(async(req,res)=>{
    const userId = req.params.subscriberId || req.params.channelId || req.user?._id;
    if(!userId){
        throw new ApiError (403,"User ID is required")
    }

    const subscribedChannels = await Subscription.find({
        subscriber: userId
    }).populate("channel", "username avatar fullName");

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            subscribedChannels || [],
            "Subscribed channels fetched successfully"
        )
    )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}