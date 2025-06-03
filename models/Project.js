// server/models/Project.js
const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imgUrl: {
    type: String
  },
  category: { 
    type: String
  },
  tags: {
    type: [String],
    default: []
  },
  demoLink: {
    type: String
  },
  codeLink: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);