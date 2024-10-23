const express = require('express');
const router = express.Router();
const auth = require('../Middlewares/Auth');
const multer = require('../Middlewares/Multer-config');
const booksCtrl = require('../Controllers/Books');

// Route POST pour ajouter un livre (avec authentification et gestion des fichiers)
router.post('/', auth, multer, booksCtrl.createBook);

// Route GET pour récupérer tous les livres
router.get('/', booksCtrl.getAllBooks);

// Route GET pour obtenir les 3 livres les mieux notés
router.get('/bestrating', booksCtrl.getBestRatedBooks);

// Route GET pour récupérer un livre via son ID
router.get('/:id', booksCtrl.getOneBook);

// Route PUT pour modifier un livre (authentification requise)
router.put('/:id', auth, multer, booksCtrl.modifyBook);

// Route DELETE pour supprimer un livre (authentification requise)
router.delete('/:id', auth, booksCtrl.deleteBook);

// Route POST pour noter un livre (authentification requise)
router.post('/:id/rating', auth, multer, booksCtrl.rateBook);




module.exports = router;