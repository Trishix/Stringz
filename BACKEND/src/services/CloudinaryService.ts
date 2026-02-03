import { v2 as cloudinary, UploadApiResponse, UploadApiOptions } from 'cloudinary';
import dotenv from 'dotenv';
import Logger from '../utils/Logger';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export class CloudinaryService {
    public static async upload(localFilePath: string, folder: string = 'stringz', resource_type: 'image' | 'video' | 'auto' = 'auto'): Promise<UploadApiResponse> {
        try {
            if (!localFilePath) throw new Error("File path is required");

            const options: UploadApiOptions = {
                resource_type: resource_type,
                folder: folder
            };

            const response = await cloudinary.uploader.upload(localFilePath, options);
            return response;
        } catch (error) {
            Logger.error(`Cloudinary Upload Error: ${error}`);
            throw error;
        }
    }
}
