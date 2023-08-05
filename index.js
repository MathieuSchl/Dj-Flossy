async function start() {
  const { Client, GatewayIntentBits } = require("discord.js");
  const fs = require("fs");
  require("dotenv").config();

  const TOKEN = process.env.DISCORD_TOKEN;
  const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

  fs.readdir(__dirname + "/events/", (err, files) => {
    files.forEach((file) => {
      if (fs.existsSync(__dirname + "/events/" + file)) require(__dirname + "/events/" + file).run(client);
    });
  });

  await require("./player/index").run(client);

  client.login(TOKEN).then(() => {
    require("./functions/loadCommands").run(client);
  });
}

start();
