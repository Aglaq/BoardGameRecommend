const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  bgg_id: { type: Number, unique: true },
  title: { type: String, required: true },
  year: { type: Number },
  minplayers: { type: Number },
  maxplayers: { type: Number },
  time: { type: Number }, // playingtime
  minage: { type: Number },
  bayesAverage: { type: Number },
  rank: { type: Number },
  image: { type: String }, // full image URL
  miniature: { type: String }, // thumbnail URL
  description: { type: String },
  isExpansion: { type: Boolean, default: false },
  complexity: { type: Number },
  categories: { type: [String], default: [] },
});

gameSchema.index({ minplayers: 1, maxplayers: 1 });
gameSchema.index({ rank: 1 });

module.exports = mongoose.model("Game", gameSchema);
