const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const SharpMulter = require ('../middleware/multer-config');

const booksCtrl = require('../controllers/books');

router.get('/', booksCtrl.getAllBooks);
router.post('/', auth, SharpMulter, booksCtrl.createBook);
router.get('/bestrating', booksCtrl.getBestRatingBooks);
router.get('/:id', booksCtrl.getOneBook);
router.put('/:id', auth, SharpMulter, booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);
router.post('/:id/rating', auth, booksCtrl.rateBook);

module.exports = router; 