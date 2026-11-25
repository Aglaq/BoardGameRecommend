const path = require("path");
const he = require("he");
const mongoose = require("mongoose");
const Game = require("../models/games_models");
const { XMLParser } = require("fast-xml-parser");

require("dotenv").config({
  path: path.resolve(__dirname, "..", ".env"),
});
he.decode("&mdash; &amp; &quot;"); // → "— & \""

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  isArray: (tag) => tag === "item",
});

const token = process.env.API_KEY;
const BATCH_SIZE = 20;
const DELAY_MS = 5000;
const MAX_RETRIES = 3;

async function fetchWithRetry(ids, attempt = 1) {
  const res = await fetch(
    `https://boardgamegeek.com/xmlapi2/thing?id=${ids}&stats=1`,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  if (res.status === 429 && attempt < MAX_RETRIES) {
    const wait = DELAY_MS * attempt; // 5s, 10s, 15s
    console.log(`Rate limited, retrying in ${wait / 1000}s...`);
    await new Promise((r) => setTimeout(r, wait));
    return fetchWithRetry(ids, attempt + 1);
  }

  return res;
}

async function backfill() {
  await mongoose.connect(process.env.MONGO);

  const games = await Game.find().select("bgg_id").lean();
  console.log(`Backfilling ${games.length} games...`);
  console.log(games[0]);
  for (let i = 0; i < games.length; i += BATCH_SIZE) {
    const batch = games.slice(i, i + BATCH_SIZE);
    const ids = batch.map((g) => g.bgg_id).join(",");

    try {
      const res = await fetchWithRetry(ids);

      if (!res.ok) {
        console.warn(`Batch ${i / BATCH_SIZE + 1} failed: ${res.status}`);
        continue;
      }

      const parsed = parser.parse(await res.text());

      const things = parsed.items?.item || [];
      console.log(things[0]);
      for (const thing of things) {
        if (thing["@_type"] !== "boardgame") continue;
        await Game.updateOne(
          { bgg_id: +thing["@_id"] },
          {
            $set: {
              minplayers: +thing.minplayers?.["@_value"] || null,
              maxplayers: +thing.maxplayers?.["@_value"] || null,
              time: +thing.playingtime?.["@_value"] || null,
              minage: +thing.minage?.["@_value"] || null,
              image: thing.image || null,
              miniature: thing.thumbnail || null,
              description: he.decode(thing.description || ""),
              complexity:
                +thing.statistics?.ratings?.averageweight?.["@_value"] || null,
              categories: (Array.isArray(thing.link)
                ? thing.link
                : [thing.link]
              )
                .filter((l) => l["@_type"] === "boardgamecategory")
                .map((l) => l["@_value"])
                .slice(0, 15),
            },
          },
        );
      }
    } catch (err) {
      console.warn(`Batch ${i / BATCH_SIZE + 1} error:`, err.message);
    }

    console.log(
      `Done ${Math.min(i + BATCH_SIZE, games.length)} / ${games.length}`,
    );
    await new Promise((r) => setTimeout(r, DELAY_MS));
  }

  await mongoose.disconnect();
  console.log("Backfill complete.");
}

backfill().catch((err) => {
  console.error(err);
  process.exit(1);
});
