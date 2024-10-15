const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  userId: { type: String, required: true }, // Identifiant de l'utilisateur qui a créé le livre
  title: { type: String, required: true }, // Titre du livre
  author: { type: String, required: true }, // Auteur du livre
  imageUrl: { type: String, required: true }, // URL de l'image de couverture
  year: { type: Number, required: true }, // Année de publication du livre
  genre: { type: String, required: true }, // Genre du livre
  ratings: [ // Tableau de notes attribuées par différents utilisateurs
    {
      userId: { type: String, required: true }, // Identifiant de l'utilisateur qui a noté le livre
      grade: { type: Number, required: true } // Note donnée au livre (entre 0 et 5 par exemple)
    }
  ],
  averageRating: { type: Number, required: true }, // Note moyenne du livre
});

module.exports = mongoose.model('Book', bookSchema);
