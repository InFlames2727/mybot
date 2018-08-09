const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');

var prefix = ayarlar.prefix;

exports.run = (client, message, params) => {
  const embed = new Discord.RichEmbed()
  .setDescription('')
  .setColor(0x00ffff)
  .addField("**» Yenilikler**", `vgs!starwars Komutu Eklendi Bakmak İçin *vgs!yardım* Yazınız. \nvgs!şanslısayım Komutu Eklendi Bakmak İçin *vgs!yardım* Yazınız. \nvgs!report Komutu Eklendi Bakmak İçin *vgs!yardım* Yazınız. \nvgs!kahkaha Komutu Eklendi Bakmak İçin *vgs!yardım* Yazınız. \nvgs!fortnite Komutu Eklendi Bakmak İçin *vgs!yardım* Yazınız. \nvgs!atatürk Komutu Eklendi Bakmak İçin *vgs!yardım* Yazınız. \n`)

 
  return message.channel.sendEmbed(embed);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['yeni', 'new', 'news', 'yenilikler'],
  permLevel: 0
};

exports.help = {
  name: 'yenilikler',
  description: 'Bota eklenen Yeni Komutları Ve Düzeltilen Hatalar Hakkında Bilgi Verir.',
  usage: 'yenilikler'
};
