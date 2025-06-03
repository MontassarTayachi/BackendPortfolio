// server/routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

// GET - Récupérer tous les projets
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Ajouter un nouveau projet avec upload d'image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, tags, demoLink, codeLink } = req.body;
    
    // Gérer les tags (convertir la chaîne en tableau si nécessaire)
    let parsedTags = tags;
    if (typeof tags === 'string') {
      try {
        parsedTags = JSON.parse(tags);
      } catch (e) {
        parsedTags = tags.split(',').map(tag => tag.trim());
      }
    }
    
    // Créer l'URL de l'image si un fichier a été téléchargé
    let imgUrl = '';
    if (req.file) {
      imgUrl =process.env.BaseUrl+`/uploads/projects/${req.file.filename}`;
    }
    
    const newProject = await Project.create({
      title, 
      description, 
      imgUrl, 
      category, 
      tags: parsedTags, 
      demoLink, 
      codeLink
    });
    
    res.status(201).json(newProject);
  } catch (error) {
    // Si une erreur se produit, supprimer l'image téléchargée si elle existe
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({ message: error.message });
  }
});

// PUT - Mettre à jour un projet avec upload d'image
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, tags, demoLink, codeLink } = req.body;
    
    // Gérer les tags (convertir la chaîne en tableau si nécessaire)
    let parsedTags = tags;
    if (typeof tags === 'string') {
      try {
        parsedTags = JSON.parse(tags);
      } catch (e) {
        parsedTags = tags.split(',').map(tag => tag.trim());
      }
    }
    
    // Récupérer le projet existant
    const existingProject = await Project.findById(req.params.id);
    
    if (!existingProject) {
      // Si le fichier a été téléchargé, le supprimer
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: 'Projet non trouvé' });
    }
    
    // Gérer l'URL de l'image
    let imgUrl = existingProject.imgUrl;
    
    // Si un nouveau fichier a été téléchargé
    if (req.file) {
      // Supprimer l'ancienne image si elle existe
      if (existingProject.imgUrl) {
        const oldImagePath = path.join(__dirname, '..', existingProject.imgUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      // Mettre à jour avec la nouvelle URL d'image
      imgUrl = `/uploads/projects/${req.file.filename}`;
    }
    
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { 
        title, 
        description, 
        imgUrl, 
        category, 
        tags: parsedTags, 
        demoLink, 
        codeLink 
      },
      { new: true, runValidators: true }
    );
    
    res.json(updatedProject);
  } catch (error) {
    // Si une erreur se produit, supprimer l'image téléchargée si elle existe
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({ message: error.message });
  }
});

// DELETE - Supprimer un projet
router.delete('/:id', async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    
    if (!deletedProject) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }
    
    // Supprimer l'image associée si elle existe
    if (deletedProject.imgUrl) {
      const imagePath = path.join(__dirname, '..', deletedProject.imgUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    res.json({ message: 'Projet supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;