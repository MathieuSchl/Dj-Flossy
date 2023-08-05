module.exports.run = async (client) => {
  client.player.events.on("playerError", (queue, error) => {
    // Emitted when the audio player errors while streaming audio track
    console.log(`Player error event: ${error.message}`);
    console.log(error);
  });
};
