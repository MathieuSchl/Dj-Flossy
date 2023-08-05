module.exports.run = async (client) => {
  client.player.events.on("playerStart", (queue, track) => {
    // Emitted when the player starts to play a song
    queue.node.setVolume(50);
  });
};
