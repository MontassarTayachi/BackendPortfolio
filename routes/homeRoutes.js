// server/routes/homeRoutes.js
const express = require('express');
const router = express.Router();
const Home = require('../models/Home');

// GET - Récupérer le contenu de la page d'accueil
router.get('/', async (req, res) => {
  try {
    let home = await Home.findOne();
    
    // Si aucun contenu n'existe, en créer un par défaut
    if (!home) {
      home = await Home.create({
        title: 'Montassar Tayachi',
        typedTexts: ["Full-Stack Developer", "Designed", "developed", "software systems"],
        description: "Full Stack Developer specialized in mobile and web development, with strong expertise in React.js, Node.js, and Flutter. Experienced in creating innovative solutions, managing complex projects, and integrating APIs.",
        cvLink: "https://montassartayachi.github.io/My-CV/"
      });
    }
    
    res.json(home);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT - Mettre à jour le contenu de la page d'accueil
router.put('/', async (req, res) => {
  try {
    const { title, typedTexts, description, cvLink } = req.body;
    
    // Trouver et mettre à jour, ou créer s'il n'existe pas
    let home = await Home.findOne();
    
    if (home) {
      home = await Home.findByIdAndUpdate(
        home._id, 
        { title, typedTexts, description, cvLink },
        { new: true, runValidators: true }
      );
    } else {
      home = await Home.create({
        title, typedTexts, description, cvLink
      });
    }
    
    res.json(home);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;