import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Ensure cloudinary is configured in case env vars were loaded asynchronously
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });

        // upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        // file has been uploaded successfully
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return response;

    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
};

const extractPublicIdFromUrl = (urlOrPublicId) => {
    if (!urlOrPublicId || typeof urlOrPublicId !== "string") return null;

    const trimmed = urlOrPublicId.trim();
    if (!trimmed) return null;

    // If it's not a Cloudinary URL, treat it as a raw public ID
    if (!trimmed.includes("/upload/")) {
        const dotIndex = trimmed.lastIndexOf(".");
        return dotIndex !== -1 ? trimmed.substring(0, dotIndex) : trimmed;
    }

    try {
        const cleanUrl = trimmed.split("?")[0].split("#")[0];
        const uploadIndex = cleanUrl.indexOf("/upload/");
        if (uploadIndex === -1) return null;

        const pathAfterUpload = cleanUrl.substring(uploadIndex + "/upload/".length);
        const segments = pathAfterUpload.split("/");

        // If there's a version segment like 'v1234567890', the public ID starts after it
        const versionIndex = segments.findIndex((seg) => /^v\d+$/.test(seg));

        let publicPathSegments;
        if (versionIndex !== -1) {
            publicPathSegments = segments.slice(versionIndex + 1);
        } else {
            // Skip transformation segments if present before public ID
            let startIndex = 0;
            while (
                startIndex < segments.length - 1 &&
                (/^(?:[a-z]{1,2}_[a-zA-Z0-9_.-]+(?:,|$))+$/.test(segments[startIndex]) ||
                 segments[startIndex].includes(","))
            ) {
                startIndex++;
            }
            publicPathSegments = segments.slice(startIndex);
        }

        const fullPath = publicPathSegments.join("/");
        const lastDotIndex = fullPath.lastIndexOf(".");
        if (lastDotIndex !== -1) {
            return fullPath.substring(0, lastDotIndex);
        }
        return fullPath;
    } catch (error) {
        console.error("Error extracting Cloudinary public ID:", error);
        return null;
    }
};

const deleteFromCloudinary = async (publicIdOrUrl, resourceType = "image") => {
    try {
        if (!publicIdOrUrl) return null;

        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });

        const publicId = extractPublicIdFromUrl(publicIdOrUrl);
        if (!publicId) {
            console.error("Could not extract public ID for Cloudinary deletion:", publicIdOrUrl);
            return null;
        }

        const response = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
            invalidate: true
        });

        return response;
    } catch (error) {
        console.error(`Cloudinary deletion failed for ${resourceType} (${publicIdOrUrl}):`, error);
        return null;
    }
};

export {
    uploadOnCloudinary,
    uploadOnCloudinary as uploadCloudinary,
    deleteFromCloudinary,
    deleteFromCloudinary as deleteCloudinary,
    extractPublicIdFromUrl
};