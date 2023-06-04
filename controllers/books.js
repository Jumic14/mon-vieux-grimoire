const Book = require('../models/Book');
const fs = require('fs');

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject.userId;
  const book = new Book ({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  })
  console.log(bookObject)
  book.save()
  .then(() => {res.status(201).json({message: 'Post saved successfully!'});})
  .catch((error) => {res.status(400).json({error: error})})
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
  .then((book) => { res.status(200).json(book)})
  .catch((error) => { res.status(404).json({error: error})});
};

exports.modifyBook = (req, res, next) => {
   const bookObject = req.file ? {
       ...JSON.parse(req.body.book),
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   } : { ...req.body };
 
   delete bookObject._userId;
   Book.findOne({_id: req.params.id})
       .then((book) => {
           if (book.userId != req.auth.userId) {
               res.status(401).json({ message : 'Not authorized'});
           } else {
               Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
               .then(() => res.status(200).json({message : 'Objet modifié!'}))
               .catch(error => res.status(401).json({ error }));
           }
       })
       .catch((error) => {
           res.status(400).json({ error });
       });
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id})
  .then(book => {
      if (book.userId != req.auth.userId) {
          res.status(401).json({message: 'Not authorized'});
      } else {
          const filename = book.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
              Book.deleteOne({_id: req.params.id})
                  .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                  .catch(error => res.status(401).json({ error }));
          });
      }
  })
  .catch( error => {
      res.status(500).json({ error });
  });
};

exports.getAllBooks = (req, res, next) => {
  Book.find().then(
    (books) => {
      res.status(200).json(books);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.rateBook = (req, res, next) => {
  const newRating = {
    userId: req.auth.userId,
    grade: req.body.rating,
  }
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      console.log(book)
        book.ratings.push(newRating);
        let totalRating = 0;
        for (let i = 0; i < book.ratings.length; i++) {
          let currentRating = book.ratings[i].grade;
          totalRating += currentRating;
        }
        book.averageRating = totalRating / book.ratings.length;
     
    book.save()
    })
    .then((book) => {
      res.status(201).json(book)
    })
    .catch(error => res.status(500).json({ error: 'Une erreur s\'est produite lors de l\'évaluation du livre.' }));
};
