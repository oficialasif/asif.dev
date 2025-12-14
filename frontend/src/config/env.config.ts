// Environment Configuration for Admin Panel
// Copy these values to your .env.local file

export const ENV_TEMPLATE = `
# MongoDB Configuration
MONGODB_URI=mongodb+srv://asifmahmud802_db_user:xFUdOyyO8OpbZXtQ@cluster0.byj1yig.mongodb.net/portfolio?retryWrites=true&w=majority

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dn7ucxk8a
CLOUDINARY_API_KEY=125178649431355
CLOUDINARY_API_SECRET=t6F5xDWEwdWTBQuzO6tpARCmW6M

# Admin Authentication
ADMIN_PASSWORD=asif@admin123
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
NEXT_PUBLIC_ADMIN_ROUTE=/asif
`;

// Note: Create a .env.local file in the root directory and paste the above configuration
