const authorization_token = process.env.API_KEY;
const API_URL = "https://boardgamegeek.com/xmlapi2";
const { XMLParser } = require("fast-xml-parser");

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  isArray: (tagName) => ["item", "name"].includes(tagName),
});

class Game {
  async get_game(req, res) {
    try {
      const data = await fetch(API_URL + "/thing?id=167791&stats=1", {
        headers: { Authorization: `Bearer ${authorization_token}` },
      });
      const game = await data.text();
      const result = parser.parse(game);
      const filtered = result.items.item[0];
      const cat_array = filtered.link.map((cat) => cat.value);
      const final_data = {
        title: filtered.name[0].value,
        year: filtered.yearpublished.value,
        minplayers: filtered.minplayers.value,
        maxplayers: filtered.maxplayers.value,
        time: filtered.playingtime.value,
        minage: filtered.minage.value,
        averagescore: filtered.statistics.ratings.bayesaverage.value,
        rank: filtered.statistics.ratings.ranks.rank[0].value,
        image: filtered.image,
        miniature: filtered.thumbnail,
        description: filtered.description,
        categories: cat_array,
      };
      // res.json({ data: result.items.item });
      res.json({ ok: true, data: final_data });
    } catch (error) {
      console.log(error);
    }
  }

  async get_hot(req, res) {
    try {
      const response = await fetch(API_URL + "/hotness", {
        headers: { Authorization: `Bearer ${authorization_token}` },
      });
      // console.log(response);
      const xml = await response.text();
      const parsed = parser.parse(xml);
      const games = parsed.items.item;
      let hot_games = [];
      for (let i = 0; i < 12; i++) {
        let element = {
          title: games[i].name[0].value,
          year: games[i].yearpublished.value,
          miniature: games[i].thumbnail.value,
          id: games[i].id,
        };
        hot_games.push(element);
      }
      res.json({ ok: true, data: hot_games });
    } catch (error) {
      console.log(error);
    }
  }

  async get_filtered(req, res) {
    const fs = require("fs");
    const path = require("path");

    const csv = fs.readFileSync(
      path.join(__dirname, "..", "boardgames_ranks.csv"),
      "utf-8",
    );
    const rows = csv
      .split("\n")
      .slice(1)
      .map((line) => {
        const [id, name, year, rank, bayes, avg, rated, isExp] =
          line.split(",");
        return { id, name, year, rank, bayes, avg, rated, is_expansion: isExp };
      });

    const games = rows.filter((r) => r.is_expansion === "0");

    const ids = games
      .slice(0, 20)
      .map((g) => g.id)
      .join(",");
    try {
      const response = await fetch(API_URL + `/thing?id=${ids}&stats=1`, {
        headers: { Authorization: `Bearer ${authorization_token}` },
      });
      // console.log(response);

      const xml = await response.text();
      const parsed = parser.parse(xml);
      console.log(parsed);
      const games = parsed.items;

      res.json({ ok: true, data: games });
    } catch (error) {
      console.log(error);
    }
  }
}

// const url = `https://boardgamegeek.com/xmlapi2/thing?id=${batch}&type=boardgame`;
// // ...
// const items = []
//   .concat(data.items.item ?? [])
//   .filter((item) => item.type === "boardgame");

// const games = items.map((item) => ({
//   bggId: Number(item.id),
//   name: [].concat(item.name).find((n) => n.type === "primary")?.value,
//   year: Number(item.yearpublished?.value) || null,
//   minPlayers: Number(item.minplayers?.value) || null,
//   maxPlayers: Number(item.maxplayers?.value) || null,
//   description: item.description ?? "",
//   image: item.image ?? null,
// }));

// await Game.bulkWrite(
//   games.map((game) => ({
//     updateOne: {
//       filter: { bggId: game.bggId },
//       update: { $set: game },
//       upsert: true,
//     },
//   })),
// );

module.exports = new Game();
