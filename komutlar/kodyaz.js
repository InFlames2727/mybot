const Discord = require('discord.js');
exports.run = (client, message, args , msg) => {
  if (!message.guild) {
  const ozelmesajuyari = new Discord.RichEmbed()
  .setColor(0xFF0000)
  .setTimestamp()
  .setAuthor(message.author.username, message.author.avatarURL)
  .addField(':warning: Uyarı :warning:', '`Kodyaz` adlı komutu özel mesajlarda kullanamazsın.');
  return message.author.sendEmbed(ozelmesajuyari); }
	let mesaj = args.slice(0).join(' ');
	if (mesaj.length < 1) return message.reply('Kod yazmalısın.');
    message.delete()
  message.channel.sendCode("asciidoc", `${mesaj}`);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 2
};

exports.help = {
  name: 'kodyaz',
  description: 'Kod yazmaya yarar.',
  usage: 'kodyaz [kod içeriği]'
};