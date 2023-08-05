const { ApplicationCommandOptionType } = require("discord.js");
const { QueryType } = require("discord-player");

const choices = [
  {
    name: "Dj Senate",
    value: "PLVbUf78M1_yFtbcDRmIkLMRWwEY5JIwdL",
  },
  {
    name: "NCS",
    value: "PLRBp0Fe2GpgnK6tqqlVDbmTqQTF-6rrRj",
  },
];

function getPlaylistName(url) {
  for (const element of choices) {
    if (element.value === url) return element.name;
  }
  return "Name not find";
}

module.exports = {
  data: {
    name: "playlist",
    description: "play a playlist!",
    options: [
      {
        name: "playlist",
        description: "the playlist you want to play",
        type: ApplicationCommandOptionType.String,
        required: true,
        choices,
      },
    ],
  },
  async execute(interaction, playlistRequest) {
    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply("You are not connected to a voice channel!"); // make sure we have a voice channel
    const playlistUrl = interaction.options.getString("playlist", true); // we need input/query to play
    const playlistName = getPlaylistName(playlistUrl);

    // let's defer the interaction as things can take time to process
    await interaction.deferReply();

    const getQueue = interaction.client.player.queues.get(channel);
    const queue = getQueue ? getQueue : interaction.client.player.queues.create(channel, { volume: 20 }); //leaveOnEmpty

    if (!getQueue) await queue.connect(interaction.member.voice.channel, { deaf: true });

    const playlist = await require("../../functions/searchPlaylist").run(playlistUrl);

    playlist.sort((a, b) => 0.5 - Math.random());
    playlist.slice(0, 50);

    interaction.followUp(`Your playlist of **${playlistName}** has been added!`);
    for (const music of playlist) {
      await queue.play(music, {
        nodeOptions: {
          // nodeOptions are the options for guild node (aka your queue in simple word)
          metadata: interaction, // we can access this metadata object using queue.metadata later on
        },
      });
    }
  },
};
