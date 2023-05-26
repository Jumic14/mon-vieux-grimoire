const express = require('express');
const router = express.Router();

const Book = require('../models/Book');

router.post('/', (req, res, next) => {
    const book = new Book({
      ...req.body
    });
    book.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  });

router.get('/:id', (req, res, next) => {
Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
});

router.get('/', (req, res, next) => {
Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
});

module.exports = router; 