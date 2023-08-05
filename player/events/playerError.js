module.exports.run = async (client) => {
  client.player.events.on("error", (queue, error) => {
    // Emitted when the player queue encounters error
    console.log(`General player error event: ${error.message}`);
    console.log(error);
  });
};
