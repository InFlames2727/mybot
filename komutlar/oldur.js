const Discord = require('discord.js');
const client = new Discord.Client();

exports.run = (client, message) => {
 message.channel.send({embed: {
		  file:"http://www.imgim.com/imgum.png",
          color: 0xD97634,
      description: "**Öldün Allah rahmet eylesin, mekanı cennet olsun.**"
            }});
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['öldür'],
  permLevel: 0
};

exports.help = {
  name: 'öldür',
  description: 'Etiketlediğiniz kişiyi öldürürsünüz.',
  usage: 'öldür'
};
