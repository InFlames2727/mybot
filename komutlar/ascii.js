const Discord = require('discord.js');
const Jimp = require('jimp');

exports.run = (client, message, args) => {
    var figlet = require('figlet');
    figlet(args.join(' '), function (err, data) {
      if (err) {
        console.log('Bir şeyler yanlış gitti...');
        console.dir(err);
        return;
      }
      message.delete()
      const embed = new Discord.RichEmbed()
      .setColor('RANDOM')
      .setTitle('Ascii;')
      .setDescription('\n' + data + '\n')
.setFooter('Vegas Bot', client.user.avatarURL)
      .setTimestamp()
      message.channel.send(embed);
        });
    };

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['ascii', 's�yle'],
  permLevel: 0
};

exports.help = {
  name: 'ascii',
  description: '�stedi�iniz �eyi bota yazd�r�r.',
  usage: 'yaz [yazd�rmak istedi�iniz �ey]'
};