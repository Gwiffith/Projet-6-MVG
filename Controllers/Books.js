const Book = require('../Models/Book');
const fs = require('fs');

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  
  const book = new Book({
    ...bookObject,
    userID: req.auth.userID,
    imageUrl: `${req.protocol}://${req.get('host')}/Images/${req.file.filename}`
  });
  book.save()
    .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
    .catch(error => res.status(400).json({ error }));
};

  exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
      .then(book => res.status(200).json(book))
      .catch(error => res.status(404).json({ error }));
};

  exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get('host')}/Images/${req.file.filename}`
    } : { ...req.body };
    
    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
      .then((book) => {
        if (book.userId != req.auth.userId) {
          res.status(401).json({ message : 'Not authorized'});
      } else {
        Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Livre modifié !'}))
      .catch(error => res.status(401).json({ error }));
        }
      })
      .catch((error) => {
        res.status(400).json({ error });
      })
    };

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})
      .then(book => {
        if (book.userId != req.auth.userId) {
          res.status(403).json({message: 'Not Authorized'});
        } else {
          const filename = book.imageUrl.split('/Images/')[1];
          fs.unlink(`Images/${filename}`, ()=> {
            Book.deleteOne({ _id: req.params.id })
            .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
            .catch(error => res.status(400).json({ error }));
            });
        }
      })
    .catch( error => {
      res.status(400).json({ error });
    });
};

  exports.getAllBooks = (req, res, next) => {
    Book.find()
      .then(books => {
        if (books.length === 0) {
          return res.status(200).json([]); // Retourne un tableau vide si aucun livre n'est trouvé
        }
        res.status(200).json(books);
      })
      .catch(error => {
        res.status(400).json({ error });
      });
  };

  exports.rateBook = (req, res, next) => {
    
    const userId = req.auth.userId;
    const bookId = req.params.id;
    const rating = req.body.rating; 
  
    // Vérifiez si la note est bien entre 0 et 5
    if (!rating || rating < 0 || rating > 5) {
      return res.status(400).json({ error: 'La note doit être comprise entre 0 et 5.' });
    }
  
    // Rechercher le livre par son ID
    Book.findOne({ _id: bookId })
      .then(book => {
        if (!book) {
          return res.status(400).json({ error: 'Livre non trouvé.' });
        }
  
        // Vérifier si l'utilisateur a déjà noté ce livre
        const alreadyRated = book.ratings.find(rating => rating.userId === userId);
        if (alreadyRated) {
          return res.status(400).json({ error: 'Vous avez déjà noté ce livre.' });
        }
  
        // Ajouter la nouvelle note
        const newRating = { userId, grade: rating };
        book.ratings.push(newRating)
        
        // Calcul de la note moyenne
      const totalRatings = book.ratings.length;
      const sumRatings = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);
      book.averageRating = (sumRatings / totalRatings).toFixed(1); // Arrondir à une décimale

      // Convertir `averageRating` en nombre
      book.averageRating = parseFloat(book.averageRating);

  
        // Sauvegarder le livre avec la nouvelle note
        return book.save()
          .then(() => {
            const bookWithId = { ...book._doc, id: book._id };
            delete bookWithId._id; // Supprime l'ancien champ _id pour correspondre au frontend
  
            res.status(200).json(
              bookWithId
            );
          })
          .catch(error => {
            console.error('Erreur lors de la sauvegarde du livre:', error);
            res.status(400).json({ error: 'Erreur lors de la sauvegarde du livre.' });
          });
      })
      .catch(error => {
        console.error('Erreur lors de la récupération du livre:', error);
        res.status(400).json({ error: 'Erreur lors de la récupération du livre.' });
      });
  };
  

// Contrôleur pour obtenir les livres les mieux notés
exports.getBestRatedBooks = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 }) // Trier les livres par note moyenne décroissante
    .limit(3) // Limiter à 3 livres
    .then(books => res.status(200).json(books)) // Renvoie les livres en réponse
    .catch(error => res.status(400).json({ error })); // En cas d'erreur
};
