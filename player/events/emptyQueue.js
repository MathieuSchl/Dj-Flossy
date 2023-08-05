module.exports.run = async (client) => {
  client.player.events.on("emptyQueue", (queue) => {
    // Emitted when the player queue has finished
    console.log("Queue finished!");
  });
};
