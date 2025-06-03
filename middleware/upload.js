const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Créer les dossiers de destination s'ils n'existent pas
const createDestinationDirs = () => {
  const uploadsDir = path.join(__dirname, '../uploads');
  const projectsDir = path.join(uploadsDir, 'projects');
  const skillsDir = path.join(uploadsDir, 'skills');
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }
  
  if (!fs.existsSync(projectsDir)) {
    fs.mkdirSync(projectsDir);
  }
  
  if (!fs.existsSync(skillsDir)) {
    fs.mkdirSync(skillsDir);
  }
};

// Créer les dossiers au démarrage
createDestinationDirs();

// Configuration du stockage pour Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Déterminer le dossier de destination en fonction de la route
    let uploadPath = path.join(__dirname, '../uploads');
    
    if (req.originalUrl.includes('/api/projects')) {
      uploadPath = path.join(uploadPath, 'projects');
    } else if (req.originalUrl.includes('/api/skills')) {
      uploadPath = path.join(uploadPath, 'skills');
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Générer un nom de fichier unique avec timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Filtre pour n'accepter que les images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|svg|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées (jpeg, jpg, png, gif, svg, webp)'));
  }
};

// Exporter le middleware Multer configuré
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite à 5MB
  fileFilter: fileFilter
});

module.exports = upload;
