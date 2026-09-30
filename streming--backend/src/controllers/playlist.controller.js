import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Playlist } from "../models/playlist.model.js";

const createPlaylist = asyncHandler(async(req,res)=>{
    const { name, description = "" } = req.body;

    if (!name?.trim()) {
        throw new ApiError(400, "Name is required");
    }

    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    const playlist = await Playlist.create({
        name: name.trim(),
        description: description.trim(),
        owner: userId
    });

    if (!playlist) {
        throw new ApiError(
            400,
            "Something went wrong while creating playlist"
        );
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                playlist,
                "Playlist created successfully"
            )
        );
})


const getUserPlaylists = asyncHandler(async(req,res)=>{
    const userId = req.params.userId || req.user?._id;

    if(!userId){
        throw new ApiError(400, "User ID is required");
    }

    const playlist = await Playlist.find({
        owner: userId
    }).populate("videos");

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlist || [],
                "Playlist fetched successfully"
            )
        )

})



const getPlaylistById = asyncHandler(async(req,res)=>{
    const { playlistId } = req.params;

    if (!playlistId) {
        throw new ApiError(400, "Playlist ID is required");
    }

    const playlist = await Playlist.findById(playlistId)
        .populate("owner", "username avatar fullName")
        .populate({
            path: "videos",
            populate: {
                path: "owner",
                select: "username avatar fullName"
            }
        });

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlist,
                "Playlist fetched successfully"
            )
        );
})


const addVideoToPlaylist = asyncHandler(async(req,res)=>{
   const playlistId = req.params.playlistId || req.body.playlistId;
   if(!playlistId){
    throw new ApiError(400, "playlist ID is required")
   }

   const videoId = req.params.videoId || req.body.videoId;
   if(!videoId){
    throw new ApiError(400, "video ID is required")
   }

   const playlist = await Playlist.findById(playlistId)
   if(!playlist){
    throw new ApiError(404, "playlist not found")
   }

   const userId = req.user?._id;
   if(!userId){
    throw new ApiError(400, "user is not login")
   }

   if(playlist.owner.toString() !== userId.toString()){
    throw new ApiError(400,"You are not authorized to add video to this playlist")
   }

   const video = await Video.findById(videoId)
   if(!video){
    throw new ApiError(404,"video not found")
   }

   if(playlist.videos.includes(videoId)){
    throw new ApiError(400,"video already exists in playlist")
   }
   
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $push: {
                videos: videoId
            }
        },
        {
            new: true
        }
    );

    if(!updatedPlaylist){
        throw new ApiError(400,"Something went wrong while adding video to playlist")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedPlaylist,
                "Video added to playlist successfully"
            )
        )
})


const removeVideoFromPlaylist = asyncHandler(async(req,res)=>{
    const playlistId = req.params.playlistId || req.body.playlistId;
    const videoId = req.params.videoId || req.body.videoId;

    if (!playlistId) {
        throw new ApiError(400, "Playlist id is required");
    }

    if (!videoId) {
        throw new ApiError(400, "Video id is required");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (req.user?._id.toString() !== playlist.owner.toString()) {
        throw new ApiError(
            403,
            "You are not authorized to remove video from this playlist"
        );
    }

    if (!playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video not found in playlist");
    }

    playlist.videos.pull(videoId);

    await playlist.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlist,
                "Video removed from playlist successfully"
            )
        );
})

const deletePlaylist = asyncHandler(async(req,res)=>{
   // playlistId lena.
   // Check karna playlistId provided hai.
   // Playlist database se find karna.
   // Check karna playlist exist karti hai ya nahi.
   // Check karna logged-in user playlist ka owner hai.
   // Playlist database se delete karna.
   // Delete successful hua ya nahi verify karna.
   // Success response return karna.

   const {playlistId} = req.params
   if(!playlistId){
    throw new ApiError(400,"playlist ID is required")
   }

   const playlist = await Playlist.findById(playlistId)
   if(!playlist){
    throw new ApiError(404,"playlist not found")
   }

   const userId = req.user?._id
   if(!userId){
    throw new ApiError(404, "user is not login")
   }

   if(playlist.owner.toString() !== userId.toString()){
    throw new ApiError(400,"you are not authorized to delete this playlist")
   }

   const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId)
   if(!deletedPlaylist){
    throw new ApiError(400,"something went wrong while deleting playlist")
   }

   return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            deletedPlaylist,
            "Playlist deleted successfully"
        )
    )

})


const updatePlaylist = asyncHandler(async(req,res)=>{
    // playlistId lena.
    // New playlist details lena:
    // name
    // description
    // Check karna playlistId provided hai.
    // Playlist database se find karna.
    // Check karna playlist exist karti hai ya nahi.
    // Check karna logged-in user playlist ka owner hai.
    // Jo fields update karni hain unko validate karna.
    // name provided hai to name update karna.
    // description provided hai to description update karna.
    // Updated playlist save karna.
    // Updated playlist return karna.

    const {playlistId} = req.params
    if(!playlistId){
        throw new ApiError(403,"playlistId is requried")
    }

    const {name,description} = req.body
    if(!name || !description){
        throw new ApiError(400, "name and description are required")
    }

    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404,"playlist not found")
    }

    if(playlist.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(400,"you are not authorized to update this playlist")
    }

    if (name === undefined && description === undefined) {
        throw new ApiError(
            400,
            "At least one field is required"
        );
    }

    if (name !== undefined && !name.trim()) {
        throw new ApiError(400, "Playlist name cannot be empty");
    }

    if (description !== undefined && !description.trim()) {
        throw new ApiError(400, "Playlist description cannot be empty");
    }

    const updateFields = {}
    if (name !== undefined) {
        updateFields.name = name.trim();
    }

    if (description !== undefined) {
        updateFields.description = description.trim();
    }


    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: updateFields
        },
        {
            new: true
        }
    )

    if(!updatedPlaylist){
        throw new ApiError(403,"something went wrong while updating playlist")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedPlaylist,
                "Playlist updated successfully"
            )
        )
})
    


export{
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist

}
