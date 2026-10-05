import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

export const upload = multer({
    storage,
});


// Video and images are binary files. You can't send them as normal JSON. Multer processes multipart form data. It temporarily stores files in /public/temp.
// Then Cloudinary uploads them.


//________________________Why temporary storage________________________
//Because Multer first gives the backend a local file path.