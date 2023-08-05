const { Player } = require("discord-player");
const fs = require("fs");

module.exports.run = async (client) => {
  const player = new Player(client);
  client.player = player;
  await player.extractors.loadDefault();

  fs.readdir(__dirname + "/events/", (err, files) => {
    files.forEach((file) => {
      if (fs.existsSync(__dirname + "/events/" + file)) require(__dirname + "/events/" + file).run(client);
    });
  });
};
