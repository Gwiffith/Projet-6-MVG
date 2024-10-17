const Book = require('../Models/Book');

exports.createBook = (req, res, next) => {
    const book = new Book({
      ...req.body // Insère toutes les données du corps de la requête
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
    Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Livre modifié !'}))
      .catch(error => res.status(400).json({ error }));
  };

  exports.deleteBook = (req, res, next) => {
    Book.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Livre supprimé !'}))
      .catch(error => res.status(400).json({ error }));
  };

  exports.getAllBooks = (req, res, next) => {
    console.log('Requête GET reçue');
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