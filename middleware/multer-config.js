const multer = require('multer');
const sharp = require('sharp');
const SharpMulter = require('sharp-multer');

const storage = SharpMulter({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  imageOptions:{
    filename: (req, file, callback) => {
      callback(null, file.originalname.split(' ').join('_') + Date.now());
    },
    fileFormat: "webp",
    resize: { width: 500, height: 400 },
      }
  
});

module.exports = multer({storage: storage}).single('image');