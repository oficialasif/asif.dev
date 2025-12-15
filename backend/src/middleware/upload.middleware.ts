import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

// File filter for images
const imageFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
};

// Configure multer
export const uploadSingle = multer({
    storage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
}).single('image');

export const uploadMultiple = multer({
    storage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit per file
    },
}).array('images', 10); // Max 10 images

export const uploadFields = multer({
    storage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
}).fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'images', maxCount: 10 },
    { name: 'cover', maxCount: 1 },
]);

// Export default upload instance for flexible usage
const upload = multer({
    storage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

export default upload;
