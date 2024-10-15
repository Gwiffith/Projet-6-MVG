const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');

const Book = require('./Models/Book');

// Connexion à MongoDB
mongoose.connect('mongodb+srv://Gwiffith:6mG0VBpUqKVKYf3l@cluster0.9gpg8.mongodb.net/nomDeMaBase?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(error => console.log('Connexion à MongoDB échouée :', error));

// Middleware pour gérer les CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Liste des méthodes autorisées
  allowedHeaders: ['Content-Type', 'Authorization'], // Les headers autorisés
}));

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Route POST pour ajouter un livre
app.post('/api/books', (req, res, next) => {
  const book = new Book({
    ...req.body // Insère toutes les données du corps de la requête
  });
  book.save()
    .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
    .catch(error => res.status(400).json({ error }));
});

// Route GET pour récupérer un livre via son ID
app.get('/api/books/:id', (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
});

// Route PUT pour modifier un livre
app.put('/api/books/:id', (req, res, next) => {
  Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre modifié !'}))
    .catch(error => res.status(400).json({ error }));
});

// Route DELETE pour supprimer un livre
app.delete('/api/books/:id', (req, res, next) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre supprimé !'}))
    .catch(error => res.status(400).json({ error }));
});

// Route GET pour récupérer tous les livres
app.get('/api/books', (req, res, next) => {
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
});



// Exporter l'application
module.exports = app;
