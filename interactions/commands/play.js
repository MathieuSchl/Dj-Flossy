const { ApplicationCommandOptionType } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
  data: {
    name: "play",
    description: "Play music in actual channel",
    voiceChannel: true,
    options: [
      {
        name: "song",
        description: "The song you want to play",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
  async execute(interaction, playlistRequest) {
    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply("You are not connected to a voice channel!"); // make sure we have a voice channel
    const song = interaction.options.getString("song", true); // we need input/query to play

    // let's defer the interaction as things can take time to process
    await interaction.deferReply();

    try {
      const getQueue = interaction.client.player.queues.get(channel);
      const queue = getQueue
        ? getQueue
        : interaction.client.player.queues.create(channel, { volume: 20, leaveOnEmpty: false }); //leaveOnEmpty

      if (!getQueue) await queue.connect(interaction.member.voice.channel, { deaf: true });

      //const playlistRe = new RegExp("https://www.youtube.com/playlist/");
      if (song.match(/https:\/\/(www\.)?youtube\.com\/playlist\?list=.{34}/)) {
        const playlistId = song.startsWith("https://www.youtube.com/playlist?list=")
          ? song.split("https://www.youtube.com/playlist?list=")[1]
          : song.startsWith("https://youtube.com/playlist?list=")
          ? song.split("https://youtube.com/playlist?list=")[1]
          : song;
        const playlist = await require("../../functions/searchPlaylist").run(playlistId);

        if (playlistRequest) playlist.sort((a, b) => 0.5 - Math.random());

        interaction.followUp(`Your playlist of ${playlist.length} has been added to the queue!`);
        for (const music of playlist) {
          await queue.play(music, {
            nodeOptions: {
              // nodeOptions are the options for guild node (aka your queue in simple word)
              metadata: interaction, // we can access this metadata object using queue.metadata later on
            },
          });
        }
      }

      const { track } = await queue.play(song, {
        nodeOptions: {
          // nodeOptions are the options for guild node (aka your queue in simple word)
          metadata: interaction, // we can access this metadata object using queue.metadata later on
        },
      });
      if (!getQueue) {
        queue.node.setVolume(2); //https://discord-player.js.org/docs/discord-player/class/GuildQueuePlayerNode?scrollTo=fm-setVolume
      }

      return interaction.followUp(`**${track.title}** enqueued!`);
    } catch (e) {
      // let's return error if something failed
      console.log(e);
      return interaction.followUp(`Something went wrong: ${e}`);
    }
  },
};
