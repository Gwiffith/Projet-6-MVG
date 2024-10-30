const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// Utilisez le stockage en mémoire pour multer
const storage = multer.memoryStorage();

// Configurez multer pour utiliser le stockage en mémoire
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de taille (5MB par exemple)
  fileFilter: (req, file, cb) => {
    // Vérifiez si le type MIME est dans MIME_TYPES
    if (MIME_TYPES[file.mimetype]) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non supporté.'), false);
    }
  }
}).single('image');

// Middleware pour traiter l'image avec sharp
module.exports = (req, res, next) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return next(); // Aucun fichier à traiter
    }

    try {
      // Récupérez le nom sans l'extension
      const name = req.file.originalname.split(' ').join('_').split('.')[0];
      const timestamp = Date.now();
      const filename = `${name}_${timestamp}.webp`;

      // Créez le répertoire 'Images' s'il n'existe pas
      const imagesDir = path.join(__dirname, '../Images');
      if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir);
      }

      // Traitez l'image avec sharp
      await sharp(req.file.buffer)
        .webp({ quality: 80 }) // Convertissez en WebP avec une qualité de 80%
        .toFile(path.join(imagesDir, filename)); // Sauvegardez l'image dans le dossier 'Images'

      // Mettez à jour req.file pour les prochains middlewares
      req.file.filename = filename;
      req.file.path = `Images/${filename}`;

      next();
    } catch (error) {
      console.error("Erreur lors du traitement de l'image avec sharp :", error);
      return res.status(500).json({ error: "Erreur lors du traitement de l'image." });
    }
  });
};
