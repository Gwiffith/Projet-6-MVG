const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const BooksRoutes =require('./Routes/Books')
const userRoutes = require('./Routes/User');

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

app.use('/api/books', BooksRoutes);
app.use('/api/auth', userRoutes)
app.use('/Images', express.static(path.join(__dirname, 'Images')));

// Exporter l'application
module.exports = app;
