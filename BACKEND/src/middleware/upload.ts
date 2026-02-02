import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';

// Configure multer storage (temporary storage before Cloudinary)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/tmp'); // Use system tmp directory
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// File filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image or video! Please upload only images or videos.'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
    }
});

export default upload;
