const authorization_token = process.env.API_KEY;
const API_URL = "https://boardgamegeek.com/xmlapi2";
const { XMLParser } = require("fast-xml-parser");
const Games = require("../models/games_models.js");

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  isArray: (tagName) => ["item", "name"].includes(tagName),
});

class Game {
  async getGame(req, res) {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ ok: false, error: "Invalid ID" });
    }
    try {
      const data = await fetch(API_URL + `/thing?id=${id}&stats=1`, {
        headers: { Authorization: `Bearer ${authorization_token}` },
      });

      const result = parser.parse(await data.text());
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
        rank: filtered.statistics.ratings.ranks.rank[0]?.value,
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

  async getHot(req, res) {
    try {
      const response = await fetch(API_URL + "/hotness", {
        headers: { Authorization: `Bearer ${authorization_token}` },
      });
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

  async getFiltered(req, res) {
    let {
      playTimeLow,
      playTimeHigh,
      numberOfPlayers,
      complexityLow,
      complexityHigh,
      score,
      category,
    } = req.params;

    try {
      complexityLow = parseFloat(req.body.complexityLow);
      complexityHigh = parseFloat(req.body.complexityHigh);
      playTimeLow = parseFloat(req.body.playTimeLow);
      playTimeHigh = parseFloat(req.body.playTimeHigh);
      numberOfPlayers = parseFloat(req.body.numberOfPlayers);
      let filter = {
        rank: { $ne: null },
        complexity: {
          $exists: true,
          $ne: null,
          $gte: complexityLow,
          $lte: complexityHigh,
        },
        time: {
          $exists: true,
          $ne: null,
          $gte: playTimeLow,
          $lte: playTimeHigh,
        },
      };
      // minplayers: { $lte: numberofPlayers },
      // maxplayers: { $gte: numberOfPlayers },
      // bayesAverage: {
      //   $exists: true,
      //   $ne: null,
      //   $gte: scoreLow,
      //   $lte: scoreHigh,
      // },

      const games = await Games.find(filter)
        .select("bgg_id")
        .sort({ rank: 1 })
        .limit(20)
        .lean();

      const ids = games.map((g) => g.bgg_id).join(",");
      const data = await fetch(API_URL + `/thing?id=${ids}&stats=1`, {
        headers: { Authorization: `Bearer ${authorization_token}` },
      });
      const result = parser.parse(await data.text());
      const filtered = result.items.item;
      let filtered_games = [];
      for (let i = 0; i < filtered.length; i++) {
        let element = {
          title: filtered[i].name[0].value,
          year: filtered[i].yearpublished.value,
          miniature: filtered[i].thumbnail,
          id: filtered[i].id,
        };
        filtered_games.push(element);
      }

      res.status(200).json({ ok: true, data: filtered_games });
    } catch (e) {
      res.status(500).json({
        ok: false,
        message: e.message,
      });
    }
  }
}

module.exports = new Game();
