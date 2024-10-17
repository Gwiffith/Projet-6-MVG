const express = require('express');

const router = express.Router();
const booksCtrl = require('../Controllers/Books');


// Route POST pour ajouter un livre
router.post('/', booksCtrl.createBook);
  
  // Route GET pour récupérer un livre via son ID
  router.get('/:id', booksCtrl.getOneBook);
  
  // Route PUT pour modifier un livre
  router.put('/:id', booksCtrl.modifyBook);
  
  // Route DELETE pour supprimer un livre
  router.delete('/:id', booksCtrl.deleteBook);
  
  // Route GET pour récupérer tous les livres
  router.get('/', booksCtrl.getAllBooks);


module.exports = router;