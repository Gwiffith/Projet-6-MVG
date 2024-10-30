const bcrypt = require('bcrypt'); // Import de bcrypt pour le hachage des mots de passe
const jwt = require('jsonwebtoken'); // Import de jsonwebtoken pour les tokens
const User = require('../Models/User'); // Import de ton modèle User (chemin à ajuster si nécessaire)
const Joi = require('joi');

// Schéma de validation Joi
const userSchema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Veuillez entrer un email valide.',
      'string.empty': 'Le champ email ne peut pas être vide.',
    }),
    password: Joi.string().min(4).pattern(new RegExp('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])')).required()
      .messages({
        'string.min': 'Le mot de passe doit contenir au moins 8 caractères.',
        'string.pattern.base': 'Le mot de passe doit inclure une majuscule, un chiffre et un caractère spécial.',
        'string.empty': 'Le champ mot de passe ne peut pas être vide.',
      })
  });
  
  exports.signup = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
  
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
  
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(err => res.status(400).json({ error: 'L\'email est déjà utilisé.' }));
      })
      .catch(error => res.status(500).json({ error: 'Erreur serveur, veuillez réessayer plus tard.' }));
  };

  exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.JWT_SECRET,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };