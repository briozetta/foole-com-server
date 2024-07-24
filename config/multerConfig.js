const multer=require('multer');
const upload = multer({
    dest: '/tmp',
    limits: { fileSize: 250 * 1024 }, // 250 KB
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'), false);
      }
    }
  });

  module.exports = upload;
