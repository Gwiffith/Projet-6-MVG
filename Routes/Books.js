const express = require('express');
const router = express.Router();
const auth = require('../Middlewares/Auth');
const multer = require('../Middlewares/Multer-config');
const booksCtrl = require('../Controllers/Books');


// Route POST pour ajouter un livre
router.post('/', auth, multer, booksCtrl.createBook);
  
// Route GET pour récupérer un livre via son ID
  router.get('/:id', booksCtrl.getOneBook);
  
// Route PUT pour modifier un livre
  router.put('/:id', auth, multer, booksCtrl.modifyBook);
  
// Route DELETE pour supprimer un livre
  router.delete('/:id', auth, booksCtrl.deleteBook);
  
// Route GET pour récupérer tous les livres
  router.get('/', booksCtrl.getAllBooks);


module.exports = router;