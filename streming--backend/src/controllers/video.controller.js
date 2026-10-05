import { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";


const getAllVideos = asyncHandler(async(req,res)=>{
   // Query parameters lena — jaise page, limit, query, sortBy, sortType. ------->>> req.query gets values from URL.
   //Pagination values validate/default karna.
   //Agar search query hai to title/description ke basis par filter banana.
   //Sirf published videos fetch karna.
   //Required fields ko populate karna, jaise owner.
   //Sorting apply karna.
   //Pagination apply karna.
   //Videos find karna.
   //Agar videos nahi hain to appropriate response dena.
   //Videos + pagination information return karna.


    // Query parameters
    const {
        page = 1,
        limit = 10,
        query,
        sortBy = "createdAt",
        sortType = "desc"
    } = req.query;

    // Pagination values
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (pageNumber < 1 || limitNumber < 1) {
        throw new ApiError(400, "Invalid pagination values");
    }

    // Filter
    const filter = {
        isPublished: true
    };

    if (query?.trim()) {
        filter.$or = [
            {
                title: {
                    $regex: query.trim(),
                    $options: "i"
                }
            },
            {
                description: {
                    $regex: query.trim(),
                    $options: "i"
                }
            }
        ];
    }

    // Sort
    const sortOrder = sortType === "asc" ? 1 : -1;

    // Pagination
    const skip = (pageNumber - 1) * limitNumber;

    // Find videos
    const videos = await Video.find(filter)
        .populate("owner", "username avatar")
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limitNumber);

    if (videos.length === 0) {
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {
                        videos: [],
                        pagination: {
                            currentPage: pageNumber,
                            limit: limitNumber,
                            totalVideos: 0,
                            totalPages: 0
                        }
                    },
                    "No videos found"
                )
            );
    }

    // Total videos
    const totalVideos = await Video.countDocuments(filter);

    const totalPages = Math.ceil(totalVideos / limitNumber);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    videos,
                    pagination: {
                        currentPage: pageNumber,
                        limit: limitNumber,
                        totalVideos,
                        totalPages
                    }
                },
                "Videos fetched successfully"
            )
        );
  

})


const publishAVideo = asyncHandler(async (req, res) => {


        // Request se video details lena:
        // videoFile
        // thumbnail
        // title
        // description
        // duration etc. — tumhare model ke according.
        // Logged-in user ki ID lena.
        // Check karna required fields available hain.
        // Video file available hai ya nahi check karna.
        // Thumbnail available hai ya nahi check karna.
        // Video file ko cloud storage par upload karna.
        // Thumbnail ko cloud storage par upload karna.
        // Upload ke baad returned URLs lena.
        // Video document create karna with:
        // title
        // description
        // videoFile URL
        // thumbnail URL
        // owner
        // duration etc.
        // Database mein video create karna.
        // Agar database creation fail ho to uploaded resources ko handle/cleanup karna.
        // Created video return karna.

    // 1. Request se video details lena:
    // videoFile, thumbnail, title, description, duration, isPublished
    const {
        title,
        description,
        duration = 0,
        isPublished= true
    } = req.body;

    // 2. Logged-in user ki ID lena
    const userId = req.user._id;

    // 3. Check karna required fields available hain
    if (
        !title?.trim() ||
        !description?.trim()
    ) {
        throw new ApiError(
            400,
            "Title and description are required"
        );
    }

    // 4. Video file available hai ya nahi check karna
    const videoFileLocalPath = req.files?.videoFile?.[0]?.path;

    if (!videoFileLocalPath) {
        throw new ApiError(400, "Video file is required");
    }

    // 5. Thumbnail available hai ya nahi check karna
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail is required");
    }

    // 6. Video file ko Cloudinary par upload karna
    const videoFile = await uploadOnCloudinary(videoFileLocalPath);

    if (!videoFile) {
        throw new ApiError(500, "Video upload failed");
    }

    // 7. Thumbnail ko Cloudinary par upload karna
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!thumbnail) {
        throw new ApiError(500, "Thumbnail upload failed");
    }

    // 8. Upload ke baad returned URLs lena
    const videoFileUrl = videoFile.secure_url;
    const thumbnailUrl = thumbnail.secure_url;
    const videoFilePublicId = videoFile.public_id;
    const thumbnailPublicId = thumbnail.public_id;

    // Parse isPublished status (defaulting to true for published videos)
    const publishedStatus = isPublished !== undefined
        ? (isPublished === true || isPublished === "true" || isPublished === 1 || isPublished === "1")
        : true;

    // 9. Video document create karna with:
    // title, description, videoFile URL,
    // thumbnail URL, owner, duration, isPublished
    const video = await Video.create({
        videoFile: videoFileUrl,
        thumbnail: thumbnailUrl,
        videoFilePublicId: videoFilePublicId,
        thumbnailPublicId: thumbnailPublicId,
        title: title.trim(),
        description: description.trim(),
        duration: Number(duration) || 0,
        isPublished: publishedStatus,
        owner: userId
    });

    // 10. Database mein video create karna
    // Video.create() already database mein document create karta hai

    // 11. Agar database creation fail ho to
    // uploaded resources ko handle/cleanup karna
    if (!video) {
        throw new ApiError(
            500,
            "Video could not be published"
        );
    }

    // 12. Created video return karna
    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                video,
                "Video published successfully"
            )
        );
});


const getVideoById = asyncHandler(async (req, res) => {

    // videoId lena
    // Check karna videoId provided hai
    // Video database se find karna
    // Check karna video exist karta hai ya nahi
    // Required related information populate karna
    // Video return karna

    // 1. videoId lena
    const { videoId } = req.params;

    // 2. Check karna videoId provided hai
    if (!videoId) {
        throw new ApiError(400, "videoId is required");
    }

    // 3. Video database se find karna
    const video = await Video.findById(videoId)
        .populate("owner", "username avatar");

    // 4. Check karna video exist karta hai ya nahi
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // 5. Required related information populate karna
    // owner already populate kiya gaya hai

    // 6. Video return karna
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                video,
                "Video fetched successfully"
            )
        );
});


const incrementVideoViews = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid or missing videoId");
    }

    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $inc: {
                views: 1
            }
        },
        {
            new: true
        }
    );

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    videoId: video._id,
                    views: video.views
                },
                "Video view counted successfully"
            )
        );
});



const updateVideo = asyncHandler(async (req, res) => {

    // videoId lena.
    // New video details lena:
    // title
    // description
    // thumbnail, agar update allowed hai.
    // Video exist karta hai ya nahi check karna.
    // Check karna logged-in user video ka owner hai.
    // Jo fields update karni hain unko validate karna.
    // Agar new thumbnail diya hai:
    // thumbnail upload karna
    // old thumbnail cleanup karna, agar tumhare storage setup mein required hai.
    // Video details update karna.
    // Updated video save karna.
    // Updated video return karna.

    // 1. videoId lena
    const { videoId } = req.params;

    if (!videoId) {
        throw new ApiError(400, "videoId is required");
    }

    // 2. New video details lena
    const {
        title,
        description
    } = req.body;

    // 3. Video exist karta hai ya nahi check karna
    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // 4. Check karna logged-in user video ka owner hai
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "You are not allowed to update this video"
        );
    }

    // 5. Jo fields update karni hain unko validate karna
    if (title !== undefined && !title.trim()) {
        throw new ApiError(400, "Title cannot be empty");
    }

    if (description !== undefined && !description.trim()) {
        throw new ApiError(400, "Description cannot be empty");
    }

    // 6. Agar new thumbnail diya hai:
    //    - thumbnail upload karna
    //    - old thumbnail cleanup karna
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (thumbnailLocalPath) {

        const newThumbnail = await uploadOnCloudinary(
            thumbnailLocalPath
        );

        if (!newThumbnail) {
            throw new ApiError(
                500,
                "Thumbnail upload failed"
            );
        }

        // New thumbnail URL set karna
        video.thumbnail = newThumbnail.secure_url;

        // Old thumbnail cleanup yahan kiya ja sakta hai
        // agar Cloudinary public_id available ho.
    }

    // 7. Video details update karna
    if (title !== undefined) {
        video.title = title.trim();
    }

    if (description !== undefined) {
        video.description = description.trim();
    }

    // 8. Updated video save karna
    await video.save();

    // 9. Updated video return karna
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                video,
                "Video updated successfully"
            )
        );
});



const deleteVideo = asyncHandler(async (req, res) => {
    // 1. videoId lena
    const { videoId } = req.params;

    if (!videoId?.trim() || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    // 2. Video find karna
    const video = await Video.findById(videoId);

    // 3. Check karna video exist karta hai ya nahi
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // 4. Check karna logged-in user owner hai
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "You are not allowed to delete this video"
        );
    }

    // 5. Cloud storage se associated files delete karna:
    //    - Video file
    const videoFileIdentifier = video.videoFilePublicId || video.videoFile;
    if (videoFileIdentifier) {
        const videoDeleteResponse = await deleteFromCloudinary(videoFileIdentifier, "video");
        if (!videoDeleteResponse || (videoDeleteResponse.result !== "ok" && videoDeleteResponse.result !== "not found")) {
            throw new ApiError(500, "Failed to delete video file from cloud storage");
        }
    }

    //    - Thumbnail
    const thumbnailIdentifier = video.thumbnailPublicId || video.thumbnail;
    if (thumbnailIdentifier) {
        const thumbnailDeleteResponse = await deleteFromCloudinary(thumbnailIdentifier, "image");
        if (!thumbnailDeleteResponse || (thumbnailDeleteResponse.result !== "ok" && thumbnailDeleteResponse.result !== "not found")) {
            throw new ApiError(500, "Failed to delete thumbnail from cloud storage");
        }
    }

    // 6. Video database se delete karna
    const deletedVideo = await Video.findByIdAndDelete(videoId);

    if (!deletedVideo) {
        throw new ApiError(
            500,
            "Failed to delete video from database"
        );
    }

    // 7. Success response return karna
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                null,
                "Video deleted successfully"
            )
        );
});




const togglePublishStatus = asyncHandler(async (req, res) => {

    // videoId lena.
    // Video find karna.
    // Check karna video exist karta hai ya nahi.
    // Check karna logged-in user owner hai.
    // Current isPublished status check karna.
    // Agar true hai → false karna.
    // Agar false hai → true karna.
    // Updated status save karna.
    // Updated video/status return karna.

    // 1. videoId lena
    const { videoId } = req.params;

    if (!videoId) {
        throw new ApiError(400, "videoId is required");
    }

    // 2. Video find karna
    const video = await Video.findById(videoId);

    // 3. Check karna video exist karta hai ya nahi
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // 4. Check karna logged-in user owner hai
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "You are not allowed to change publish status"
        );
    }

    // 5. Current isPublished status check karna

    // 6. Agar true hai → false
    // 7. Agar false hai → true
    video.isPublished = !video.isPublished;

    // 8. Updated status save karna
    await video.save();

    // 9. Updated video/status return karna
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    video,
                    isPublished: video.isPublished
                },
                video.isPublished
                    ? "Video published successfully"
                    : "Video unpublished successfully"
            )
        );
});



export{
    getAllVideos,
    getVideoById,
    incrementVideoViews,
    publishAVideo,
    updateVideo,
    deleteVideo,
    togglePublishStatus,

}