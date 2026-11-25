// scripts/import-csv.js
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Game = require("../models/games_models");
const { parse } = require("csv-parse/sync");

require("dotenv").config({
  path: path.resolve(__dirname, "..", ".env"), // go up one folder
});

const csv = fs.readFileSync(
  path.join(__dirname, "..", "boardgames_ranks.csv"),
  "utf-8",
);

const rows = parse(csv, { columns: true, skip_empty_lines: true, trim: true })
  .filter((r) => r.is_expansion === "0")
  .map((r) => ({
    bgg_id: +r.id,
    title: r.name,
    year: +r.yearpublished || null,
    rank: +r.rank || null,
    bayesAverage: +r.bayesaverage || null,
    isExpansion: false,
  }));

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

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
