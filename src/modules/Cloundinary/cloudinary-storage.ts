import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.config';

export const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: 'movies',
    resource_type: 'image',
    public_id: file.originalname.split('.')[0] + '-' + Date.now(),
  }),
});
