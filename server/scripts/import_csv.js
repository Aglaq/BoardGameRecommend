// scripts/import-csv.js
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Game = require("../models/games_models");

require("dotenv").config({
  path: path.resolve(__dirname, "..", ".env"), // go up one folder
});

const csv = fs.readFileSync(
  path.join(__dirname, "..", "boardgames_ranks.csv"),
  "utf-8",
);

const rows = csv
  .split("\n")
  .slice(1) // skip header
  .map((line) => {
    const [id, name, year, rank, bayes, avg, rated, isExp] = line.split(",");
    return {
      bgg_id: +id,
      title: name?.replace(/^"|"$/g, ""),
      year: +year || null,
      rank: +rank || null,
      bayesAverage: +bayes || null,
      isExpansion: isExp === "1",
    };
  })
  .filter((r) => !r.isExpansion);

async function main() {
  await mongoose.connect(process.env.MONGO);

  // Bulk upsert (fast, ~5000 docs per operation)
  const ops = rows.map((r) => ({
    updateOne: {
      filter: { bgg_id: r.bgg_id },
      update: { $set: r },
      upsert: true,
    },
  }));

  // Mongoose bulkWrite in chunks to avoid memory issues
  for (let i = 0; i < ops.length; i += 5000) {
    await Game.bulkWrite(ops.slice(i, i + 5000));
    console.log(
      `Inserted/updated ${Math.min(i + 5000, ops.length)} / ${ops.length}`,
    );
  }

  await mongoose.disconnect();
  console.log("Done.");
}

main();
