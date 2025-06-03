// server/models/Home.js
const mongoose = require('mongoose');

const HomeSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'Montassar Tayachi'
  },
  typedTexts: {
    type: [String],
    default: ["Full-Stack Developer", "Designed", "developed", "software systems"]
  },
  description: {
    type: String,
    required: true
  },
  cvLink: {
    type: String,
    default: "https://montassartayachi.github.io/My-CV/"
  }
}, { timestamps: true });

module.exports = mongoose.model('Home', HomeSchema);