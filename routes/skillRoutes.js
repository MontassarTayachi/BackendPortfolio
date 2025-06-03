// server/routes/skillRoutes.js
const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

// GET - Récupérer toutes les compétences
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find().sort({ order: 1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Ajouter une nouvelle compétence avec upload d'image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, shadowClass, order } = req.body;
    
    // Vérifier si une image a été téléchargée
    if (!req.file) {
      return res.status(400).json({ message: 'Une image est requise pour ajouter une compétence' });
    }
    
    // Créer l'URL de l'image
    const img = process.env.BaseUrl+`/uploads/skills/${req.file.filename}`;
    
    const newSkill = await Skill.create({
      name, 
      img, 
      shadowClass, 
      order: order || 0
    });
    
    res.status(201).json(newSkill);
  } catch (error) {
    // Si une erreur se produit, supprimer l'image téléchargée
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({ message: error.message });
  }
});

// PUT - Mettre à jour une compétence avec upload d'image
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, shadowClass, order } = req.body;
    
    // Récupérer la compétence existante
    const existingSkill = await Skill.findById(req.params.id);
    
    if (!existingSkill) {
      // Si le fichier a été téléchargé, le supprimer
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: 'Compétence non trouvée' });
    }
    
    // Gérer l'URL de l'image
    let img = existingSkill.img;
    
    // Si un nouveau fichier a été téléchargé
    if (req.file) {
      // Supprimer l'ancienne image si elle existe
      if (existingSkill.img) {
        const oldImagePath = path.join(__dirname, '..', existingSkill.img);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      // Mettre à jour avec la nouvelle URL d'image
      img = `/uploads/skills/${req.file.filename}`;
    }
    
    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      { 
        name, 
        img, 
        shadowClass, 
        order: order !== undefined ? order : existingSkill.order 
      },
      { new: true, runValidators: true }
    );
    
    res.json(updatedSkill);
  } catch (error) {
    // Si une erreur se produit, supprimer l'image téléchargée si elle existe
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({ message: error.message });
  }
});

// DELETE - Supprimer une compétence
router.delete('/:id', async (req, res) => {
  try {
    const deletedSkill = await Skill.findByIdAndDelete(req.params.id);
    
    if (!deletedSkill) {
      return res.status(404).json({ message: 'Compétence non trouvée' });
    }
    
    // Supprimer l'image associée si elle existe
    if (deletedSkill.img) {
      const imagePath = path.join(__dirname, '..', deletedSkill.img);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    res.json({ message: 'Compétence supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;