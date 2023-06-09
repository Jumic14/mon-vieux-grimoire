const multer = require('multer');
const sharp = require('sharp');
const SharpMulter = require('sharp-multer');

const storage = SharpMulter({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  imageOptions:{
    fileFormat: "webp",
    resize: { width: 500, height: 400, resizeMode:  "contain" },
      }
  
});

module.exports = multer({storage: storage}).single('image');