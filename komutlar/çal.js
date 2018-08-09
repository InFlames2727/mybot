const Discord = require('discord.js');
const { Client, Util } = require('discord.js');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const client = new Client({ disableEveryone: true });
const youtube = new YouTube('AIzaSyBjfpqLgO-cJPdcLi9fnMYQ7iGka0NPafA');
const queue = new Map();

async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	console.log(video);
	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`Sesli kanala giremiyorum: ${error}`);
			queue.delete(msg.guild.id);
			return msg.channel.send(`Sesli kanala giremiyorum: ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist) return undefined;
		else return msg.channel.send(`✅ **${song.title}** adlı şarkı kuyruğa eklendi!`);
	}
	return undefined;
}


function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	console.log(serverQueue.songs);

	
	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			if (reason === 'Akış yeterince hızlı üretilmiyor.') console.log('ŞARKI GEGE.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

	const embed = new Discord.RichEmbed()
	.setColor('RANDOM')
	.setDescription(`🎶 Şimdi Oynatılıyor: **[${song.title}](${song.url})**`)
	serverQueue.textChannel.send(embed);
}


exports.run = async(client, message, args) => {
  const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
  const searchString = args.slice(1).join(' ');
  const voiceChannel = message.member.voiceChannel;
  if (!voiceChannel) return message.channel.send('Müziği çalmak için bir sesli kanalda olmalısın!');
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has('CONNECT')) {
    return message.channel.send('Kanala bağlanamıyorum lütfen yetkilerimi gözden geçir!');
  }
  if (!permissions.has('SPEAK')) {
    return message.channel.send('Konuşamıyorum! Yetkilerimi lütfen gözden geçir !!');
  }

  if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
    const playlist = await youtube.getPlaylist(url);
    const videos = await playlist.getVideos();
    for (const video of Object.values(videos)) {
      const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
      await handleVideo(video2, message, voiceChannel, true); // eslint-disable-line no-await-in-loop
    }
	 return message.channel.send(`✅ Kuyruk: **${playlist.title}** adlı şarkı kuyruğa eklendi!`);
  } else {
    try {
      var video = await youtube.getVideo(url);
    } catch (error) {
      try {
        var videos = await youtube.searchVideos(searchString, 10);
        let index = 0;
	const embed = new Discord.RichEmbed()
	.setColor('RANDOM')
	.addField('Şarkı seçimi' , `${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}`)
	.setDescription('**Lütfen 1-10 arasında bir seçim yapın.**')
		 message.channel.send(embed)

        // eslint-disable-next-line max-depth
        try {
          var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 11, {
            maxMatches: 1,
		time: 10000,
            errors: ['time']
          });
        } catch (err) {
          console.error(err);
          return message.channel.send('Hiçbir değer girilmedi.. Komut iptal edildi');
        }
        const videoIndex = parseInt(response.first().content);
        var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
      } catch (err) {
        console.error(err);
        return message.channel.send('🆘 Hiçbir sonuç bulamadım.');
      }
    }
    return handleVideo(video, message, voiceChannel);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'çal',
  description: 'Müzik çalar.',
  usage: 'çal'
};