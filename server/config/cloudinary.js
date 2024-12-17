const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: "dycpqrh2n", // Replace with your Cloudinary cloud name
    api_key: "887442727788494", // Replace with your Cloudinary API key
    api_secret: "iJ_zEPVps-knWZEDsMksgQSrfkA", // Replace with your Cloudinary API secret
});
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'banner_uploads', // Replace with your desired folder name in Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

const upload = require('multer')({ storage });

module.exports = { upload };
