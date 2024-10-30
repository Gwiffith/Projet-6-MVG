require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const BooksRoutes =require('./Routes/Books')
const userRoutes = require('./Routes/User');

// Récupération des identifiants et de l'URI de base
const username = process.env.DB_USERNAME;
const password = encodeURIComponent(process.env.DB_PASSWORD); // Encodage du mot de passe
const baseUri = process.env.MONGODB_URI;


// Construction de l'URI complet avec identifiants
const fullUri = `mongodb+srv://${username}:${password}@${baseUri}`;

// Connexion à MongoDB
mongoose.connect(fullUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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
