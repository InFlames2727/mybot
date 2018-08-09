const Discord = require('discord.js');
exports.run = function(client, message, args) {
  const embed = new Discord.RichEmbed()
  .setTitle("**Afk Modu!**\n")
  /*
   * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
   */
  .addField('Şu Kullanıcı Artık Afk Değil!;', message.author.username + '#' + message.author.discriminator)
  message.delete();
  /*
   * Takes a Date object, defaults to current date.
   */

  message.channel.send({embed});
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 1
};

exports.help = {
  name: 'geldim',
  description: 'Afk Modundan Cikmani Saglar',
  usage: 'geldim'
};