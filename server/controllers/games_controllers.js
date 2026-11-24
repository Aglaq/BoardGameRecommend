const authorization_token = process.env.API_KEY;
const API_URL = "https://boardgamegeek.com/xmlapi2/thing?id=167791&stats=1";
const { XMLParser } = require("fast-xml-parser");

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  isArray: (tagName) => ["item", "name"].includes(tagName),
});

class Game {
  async get_game(req, res) {
    try {
      const data = await fetch(API_URL, {
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
}

module.exports = new Game();
