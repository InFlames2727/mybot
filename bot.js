const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');
const Jimp = require('jimp');
const db = require('quick.db');
const send = require('quick.hook')
require('./util/eventLoader')(client);

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};


let prefix = "vgs!";


client.on("message", message => {
  const dmchannel = client.channels.find("name", "dm");
  if (message.channel.type === "dm") {
      if (message.author.id === client.user.id) return;
      dmchannel.sendMessage("", {embed: {
              color: 3447003,
              title: `DM Atan Kişi: **${message.author.tag}**`,
              description: `Dm Mesajı: **${message.content}**`
            }})
  }
  if (message.channel.bot) return;
});

client.on("ready", () => {
  client.user.setGame(prefix + "yardım | Güncellemelerden Bot Bazen Çevirim Dışı OlaBilir! ") 
  console.log("Bağlandım!")   
});

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.on('message', msg => {
  if (msg.content.toLowerCase() === 'sa') {
    if (msg.guild.id == "264445053596991498") return;
        setTimeout(() => {
    }, 1000);//bekle
    msg.react('🇦')
    msg.react('🇸')
            setTimeout(() => {
    }, 1500);
    msg.reply('Aleyküm Selam!');
  }
});




client.on('message', msg => {
  if (msg.content.toLowerCase() === '<@442397076937244672>') {
        setTimeout(() => {
    }, 1000);//bekle
    msg.react('🇹')
    msg.react('🇲')
            setTimeout(() => {
    }, 1500);
    msg.reply('Botun Prefixi: vgs!');
  }
});




//dene

client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;

client.on('warn', e => {
  console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
  console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.on("guildMemberAdd", async member => {
  const channel = member.guild.channels.find('name', 'log');//log ismini ayarlıyacaksınız log adında kanal açın
  if (!channel) return;
        let username = member.user.username;
        if (channel === undefined || channel === null) return;
        if (channel.type === "text") {
            const bg = await Jimp.read("https://cdn.discordapp.com/attachments/450693709076365323/473184528148725780/guildAdd.png");
            const userimg = await Jimp.read(member.user.avatarURL);
            var font;
            if (member.user.tag.length < 15) font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);
            else if (member.user.tag.length > 15) font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
            else font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
            await bg.print(font, 430, 170, member.user.tag);
            await userimg.resize(362, 362);
            await bg.composite(userimg, 43, 26).write("./img/"+ member.id + ".png");
              setTimeout(function () {
                    channel.send(new Discord.Attachment("./img/" + member.id + ".png"));
              }, 1000);
              setTimeout(function () {
                fs.unlink("./img/" + member.id + ".png");
              }, 10000);
        }
    })

client.on("guildMemberRemove", async member => {
  const channel = member.guild.channels.find('name', 'log');//log ismini ayarlıyacaksınız log adında kanal açın
  if (!channel) return;
        let username = member.user.username;
        if (channel === undefined || channel === null) return;
        if (channel.type === "text") {            
                        const bg = await Jimp.read("https://cdn.discordapp.com/attachments/450693709076365323/473184546477572107/guildRemove.png");
            const userimg = await Jimp.read(member.user.avatarURL);
            var font;
            if (member.user.tag.length < 15) font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);
            else if (member.user.tag.length > 15) font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
            else font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
            await bg.print(font, 430, 170, member.user.tag);
            await userimg.resize(362, 362);
            await bg.composite(userimg, 43, 26).write("./img/"+ member.id + ".png");
              setTimeout(function () {
                    channel.send(new Discord.Attachment("./img/" + member.id + ".png"));
              }, 1000);
              setTimeout(function () {
                fs.unlink("./img/" + member.id + ".png");
              }, 10000);
        }
    })



client.on('message', msg => {
  if (msg.content === 'discord.gg') {
   msg.delete(30)
    msg.reply('Reklam Engellendi');
  }
});

client.on('message', msg => {
  if (msg.content === 'bb') {
    msg.reply('Görüşmek Üzere :hand_splayed::skin-tone-5:  ');
  }
});


client.on('message', message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  let command = message.content.split(' ')[0];
  command = command.slice(prefix.length);

  let args = message.content.split(' ').slice(1);

  if (command === 'tavsiyeni-gönder' || command === 'tavsiye') {
    let str = '<@348097494548348940>';//@silmeyin!
    let id = str.replace(/[<@348097494548348940>]/g, '');
    let mesaj = args.slice(0).join(' ');
    if (mesaj.length < 1) return message.reply(` ⚠ tavsiyeni yazmayı unuttun. ⚠ `);
    message.channel.sendEmbed(new Discord.RichEmbed()
    .setColor('RANDOM')
    .setDescription(''));
    const embed = new Discord.RichEmbed()
    .setColor('RANDOM')
    .setTitle('Tavsiye bilgileri;')
    .addField('Tavsiye:', mesaj, true)
    .addField('Kullanıcı adı:', message.author.tag, true)
    .addField('Kullanıcı kimliği:', message.author.id, true)
    .addField('Sunucu adı:', message.guild.name, true)
    .addField('Sunucu kimliği:', message.guild.id, true)
    client.fetchUser(id)
    .then(user => {user.send({embed})})
  }
});

client.on('guildCreate', guild => {
    let channel = client.channels.get("473534323656753152")
        const embed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setAuthor(`Giriş ${guild.name}`)
        .setThumbnail(guild.iconURL)
        .addField("Kurucu", guild.owner)
        .addField("Sunucu ID", guild.id, true)
        .addField("Toplam Kullanıcı", guild.memberCount, true)
        .addField("Toplam Kanal", guild.channels.size, true)
         channel.send(embed);
    });
client.on('guildDelete', guild => {
    let channel = client.channels.get("473534323656753152")
        const embed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setAuthor(`Çıkış ${guild.name}`)
        .setThumbnail(guild.iconURL)
        .addField("Kurucu", guild.owner)
        .addField("Sunucu ID", guild.id, true)
        .addField("Toplam Kullanıcı", guild.memberCount, true)
        .addField("Toplam Kanal", guild.channels.size, true)
         channel.send(embed);
    });

	client.on('message', message => {
if (message.content.toLowerCase() === prefix + "espiri") {
    var sans = ["Geçen gün geçmiş günlerimi aradım ama meşguldü.", "Yağmur yağmış kar peynir", "Dünya dönermiş ay da köfte…", "Bu erikson başka erik yok.", "Yıkanan Ton a ne denir Washington", "Hadi oyun oynayalım. Vazgeçtim oymadan oynayalım!", "Geçen gün kamyonu sürdüm Leonardo da Vinci.", "Doğumdan sonra çok kilo aldım. Doğduğumda 2 kiloydum şimdi 62.", "Adam 7 gün boyunca nezle olmuş. Sıkılmış bugün de Petek le olayım demiş.", "Yarasa yararlı bir hayvandır. Yararlı bir hayvan olmasaydı yaramasa derlerdi.", " Benim neden kardeşim yok baba  Seni görünce ikincisine cesaret edemedik.", "Osmanlıda kimseye borç takamıyordun mesela sikke sikke ödüyodun…", "Tatlı yiyip, tatlı konuşuluyorsa bundan sonra mantı yiyip mantıklı konuşacağız.", "Babamı sahura kaldırmayı unuttuk anneme masada ne eksik diyorum tuzluk mu diyor.", "+Okeyde kıza elin nasıl dedim. Ojeli dedi. Ben Şoka girdim. O Migrosa.", "Canım sıkkın kanka sonra gel"];
    var sonuc = sans[Math.floor((Math.random() * sans.length))];
    const embed = new Discord.RichEmbed()
    .addField(`***___Espri___***`, `${sonuc}`)
    return message.channel.sendEmbed(embed);
}
});

client.on('message', msg => {
if (msg.content.toLowerCase() === prefix + "sigara") {
  msg.react('🚬');
  msg.react('☁');
msg.channel.send('🚬☁☁☁')
.then(nmsg => nmsg.edit('🚬☁☁☁☁'))
.then(nmsg => nmsg.edit('🚬☁☁☁'))
.then(nmsg => nmsg.edit('🚬☁☁'))
.then(nmsg => nmsg.edit('🚬☁'))
.then(nmsg => nmsg.edit('🚬☁'))
.then(nmsg => nmsg.edit('**Sigaram bitti** | **Sigara İçmeyiniz.** :no_smoking: **Sigara Sağlığa Zararlıdır**'));
   msg.react('🚬')
  msg.react('☁')
}
});

client.on("message", msg => {
    const kufur = ["amk", "aq", "orospu", "oruspu", "oç", "sikerim", "yarrak", "piç", "amq", "sik", "amcık", "çocu", "sex", "seks", "amına", "meme", "anan", "oç", "öröspü", "anasını", "fuck"];
    if (kufur.some(word => msg.content.includes(word)) ) {
      if (msg.guild.id == "264445053596991498") return;
        msg.delete()
        msg.reply("Küfür etme!")
    }
});

client.on("message", msg => {
    const kufur = ["amk", "aq", "orospu", "oruspu", "oç", "sikerim", "yarrak", "piç", "amq", "sik", "amcık", "çocu", "sex", "seks", "amına", "meme", "anan", "oç", "öröspü", "anasını", "fuck"];
    if (kufur.some(word => msg.content.includes(word)) ) {
      if (msg.guild.id == "475964341586362379") return;
      if (msg.guild.id == "264445053596991498") return;
        msg.delete()
        msg.reply("Küfür etme!")
    }
});

//hataları sen çözersin artık dene bakım oldumu
client.on('message', message => {
if (message.content.toLowerCase() === prefix + "zekam") {
    var sans = ["11", "15", "20", "24", "28", "31", "39", "45", "49", "54", "58", "63", "67", "77", "73", "84", "80", "83", "96", "94", "99", "Albert Einstein mısın?"];
    var sonuc = sans[Math.floor((Math.random() * sans.length))];
    const embed = new Discord.RichEmbed()
    .addField(`***___Zekan___***`, `${sonuc}`)
    return message.channel.sendEmbed(embed);
}
});
  
 
 
 client.on("message", async message => {
    const args = message.content.substring(prefix.length).split(" ");
    const command = args.shift().toLowerCase();
if(command === "discrim") {
        const discrim = args[0] || message.author.discriminator;
        const users = client.users.filter(user => user.discriminator === discrim).map(user => user.tag);
        
        if (users < 1) {
const embed2 = new Discord.RichEmbed()
.setColor(3447003)
.setDescription(`${discrim} bulunamadı!`)
            return message.channel.send({embed2});
        } else {
           message.channel.send(`${users.join('\n')}`, { split: true })
        }
    }
});
 
 
 
 
 client.on("message", async message => {
    const args = message.content.substring(prefix.length).split(" ");
    const command = args.shift().toLowerCase();
    if (command === "ters") {
        const mapping = '¡"#$%⅋,)(*+\'-˙/0ƖᄅƐㄣϛ9ㄥ86:;<=>¿@∀qƆpƎℲפHIſʞ˥WNOԀQɹS┴∩ΛMX⅄Z[/]^_`ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz{|}~';
        // Start with the character '!'
        const OFFSET = '!'.charCodeAt(0);
        if (args.length < 1) {
            message.channel.send('Ters yazılacak yazıyı yazmalısın.');
        }

        message.channel.send(
            args.join(' ').split('')
            .map(c => c.charCodeAt(0) - OFFSET)
            .map(c => mapping[c] || ' ')
            .reverse().join('')
        )
    }
});
 

client.on('guildCreate', guild => {
  guild.owner.send('Beni Eklediğin İçin Teşekkürler | Komutlarıma vgs!yardım Yazarak Bakabilirsiniz | Discord Sunucuma Gidmek İçin [Tikla!]( https://goo.gl/fJg3z5)%27)')
})


let points = JSON.parse(fs.readFileSync('./xp.json', 'utf8'));

var f = [];
function factorial (n) {
  if (n == 0 || n == 1)
    return 1;
  if (f[n] > 0)
    return f[n];
  return f[n] = factorial(n-1) * n;
};
function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}

client.on("message", async message => {
  if (message.channel.type != "text") return;
  if (message.author.bot) return;
  if (message.guild.id == "449213518269513728") return; // DBL'deyse çalışmasın.

  var user = message.mentions.users.first() || message.author;
  if (!message.guild) user = message.author;

  if (!points[user.id]) points[user.id] = {
    points: 0,
    level: 0,
  };

  let userData = points[user.id];
  userData.points++;

  let curLevel = Math.floor(0.1 * Math.sqrt(userData.points));
  if (curLevel > userData.level) {
    userData.level = curLevel;
    var user = message.mentions.users.first() || message.author;
    if (message.guild.id == "264445053596991498") return;
    message.channel.send(`:up: **| ${user.username} level atladı!**`)
  }

  fs.writeFile('./xp.json', JSON.stringify(points), (err) => {
      if (err) console.error(err)
    })

  if (message.content.toLowerCase() === prefix + 'profil' || message.content.toLowerCase() === prefix + 'profile') {
    const level = new Discord.RichEmbed().setTitle(`${user.username}`).setDescription(`**Seviye:** ${userData.level}\n**GP:** ${userData.points}`).setColor("#ffff00").setFooter(``).setThumbnail(user.avatarURL)
    message.channel.send(`:pencil: **| ${user.username} adlı kullanıcının profil kartı**`)
    message.channel.send(level)
  }
});




client.on('message', message => {
    if (message.content.toLowerCase() === 'vgs!kedi') {
var request = require('request');

request('http://aws.random.cat/meow', function (error, response, body) {
    if (error) return console.log('Hata:', error);
    else if (!error) { 
        var info = JSON.parse(body);
  const foto = new Discord.RichEmbed()
  .setImage(info.file)
      message.channel.send(foto)
    }
})
    }
});









client.on('message', message => {
    if (message.content.toLowerCase() === 'köpek') {
var request = require('request');

request('https://random.dog/woof.json', function (error, response, body) {
    if (error) return console.log('Hata:', error);
    else if (!error) {
        var info = JSON.parse(body);
  const foto = new Discord.RichEmbed()
  .setImage(info.url)
      message.channel.send(foto)
    }
})
    }
});







client.on('message', async message => {
  if (message.content.toLowerCase() === prefix + 'döviz') {
var request = require('request');
request('https://www.doviz.com/api/v1/currencies/USD/latest', function (error, response, body) {
  if (error) return console.log('Hata:', error);
  else if (!error) { 
      var info = JSON.parse(body);
request('https://www.doviz.com/api/v1/currencies/EUR/latest', function (error, response, body) {
  if (error) return console.log('Hata:', error); 
  else if (!error) { 
      var euro = JSON.parse(body);

      let doviz = new Discord.RichEmbed()
      .setColor('RANDOM')
      .setFooter(`${message.author.username} tarafından istendi.`, message.author.avatarURL)
      .addField("💎 Döviz", `**💵 Dolar: **${info.buying} TL\n**💶 Euro: **${euro.buying} TL`)
     
      message.channel.send(doviz);
}
})
  }
})
  }
});




client.on("message", async message => {
    const args = message.content.substring(prefix.length).split(" ");
    const command = args.shift().toLowerCase();
    if (command === "vaporwave") {
        const mapping = '¡"#$%⅋,)(*+\'-˙/0ƖᄅƐㄣϛ9ㄥ86:;<=>¿@ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ[/]^_`ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ{|}~';
        const OFFSET = '!'.charCodeAt(0);
        if (args.length < 1) {
            message.channel.send('Estetik yazılacak yazıyı yazmalısın.');
        }

        message.channel.send(
            args.join(' ').split('')
            .map(c => c.charCodeAt(0) - OFFSET)
            .map(c => mapping[c] || ' ')
            .join('')
        )
    }
});











client.on("message", async message => {
  var user = message.mentions.users.first() || message.author;
    if (message.content.toLowerCase() === prefix + "wasted") {
      message.channel.startTyping();
        var user = message.mentions.users.first() || message.author;
        if (!message.guild) user = message.author;

        Jimp.read(user.avatarURL, (err, image) => {
            image.resize(295, 295)
            image.greyscale()
            image.gaussian(3)
            Jimp.read("https://cdn.glitch.com/b18a2fa6-68cb-49d5-9818-64c50dd0fdab%2F1.png?1529363616039", (err, avatar) => {
                avatar.resize(295, 295)
                image.composite(avatar, 4, 0).write(`./img/wasted/${client.user.id}-${user.id}.png`);
                setTimeout(function() {
                    message.channel.send(new Discord.Attachment(`./img/wasted/${client.user.id}-${user.id}.png`));
                }, 1000);
          message.channel.stopTyping();
            });
        });
    }
});




const GIFEncoder = require('gifencoder');

client.on("message", async message => {
  var user = message.mentions.users.first() || message.author;
    if (message.content.toLowerCase() === prefix + "trigger") {
        const options = {
            size: 256,
          
            frames: 16
        }

        message.channel.send("İşleniyor.. Lütfen bekleyiniz. ⏲").then(m => m.delete(1000));

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        const args = message.content.split(' ').slice(1);
        let member = message.mentions.users.first()
        if (args[0] === undefined) member = message.author;
        let avatarurl = member.avatarURL;
        if (['jpg', 'jpeg', 'gif', 'png', 'webp'].some(x => args.join(' ').includes(x))) {
            avatarurl = args.join(' ').replace(/gif|webp/g, 'png');
        }
        const base = new Jimp(options.size, options.size);
        const avatar = await Jimp.read(avatarurl);
        const text = await Jimp.read('https://cdn.glitch.com/a7d3b6b8-9b7a-4aab-9ee4-1db0c07ef1eb%2Ftriggered.png?1526842782410');
        const tint = await Jimp.read('https://cdn.glitch.com/5fed2789-b430-43c5-bf1b-a8dd32d46b97%2Fred.png?1527082445373');
        avatar.resize(320, 320);
        tint.scaleToFit(base.bitmap.width, base.bitmap.height);
        tint.opacity(0.2);
        text.scaleToFit(280, 60);
        const frames = [];
        const buffers = [];
        const encoder = new GIFEncoder(options.size, options.size);
        const stream = encoder.createReadStream();
        let temp;

        stream.on('data', async buffer => await buffers.push(buffer));
        stream.on('end', async () => {
            return await message.channel.send({
                files: [{
                    name: 'notechtriggered.gif',
                    attachment: Buffer.concat(buffers)
                }]
            });
        });
        for (let i = 0; i < options.frames; i++) {
            temp = base.clone();
            if (i === 0) {
                temp.composite(avatar, -16, -16);
            } else {
                temp.composite(avatar, -32 + getRandomInt(-16, 16), -32 + getRandomInt(-16, 16));
            }
            temp.composite(tint, 0, 0);
            if (i === 0) temp.composite(text, -10, 200);
            else temp.composite(text, -12 + getRandomInt(-8, 8), 200 + getRandomInt(-0, 12));
            frames.push(temp.bitmap.data);
        }
        encoder.start();
        encoder.setRepeat(0);
        encoder.setDelay(20);
        for (const frame of frames) {
            encoder.addFrame(frame);
        }
        encoder.finish();
    }
})








client.on("message", async message => {
  var user = message.mentions.users.first() || message.author;
    if (message.content.toLowerCase() === prefix + "sniper") {
        var user = message.mentions.users.first() || message.author;
        if (!message.guild) user = message.author;

        message.channel.send("İşleniyor.. Lütfen bekleyiniz. ⏲").then(m => m.delete(1000));

        Jimp.read(user.avatarURL, (err, image) => {
            image.resize(310, 325)
            image.greyscale()
            image.gaussian(3)
            Jimp.read("https://cdn.glitch.com/b18a2fa6-68cb-49d5-9818-64c50dd0fdab%2FPNGPIX-COM-Crosshair-PNG-Transparent-Image.png?1529363625811", (err, avatar) => {
                avatar.resize(310, 325)
                image.composite(avatar, 2, 0).write(`./img/snip/${client.user.id}-${user.id}.png`);
                setTimeout(function() {
                    message.channel.send(new Discord.Attachment(`./img/snip/${client.user.id}-${user.id}.png`));
                }, 1000);
            });

        });
    }
});








const table = require('table');
const arraySort = require('array-sort');

client.on("message", async message => {
  var user = message.mentions.users.first() || message.author;
    if (message.content.toLowerCase() === prefix + "davetler") {
        let invites = await message.guild.fetchInvites().catch(error => {
            return message.channel.send(`Davetleri görüntülemek için yetkim bulunmuyor.`);
        })
        invites = invites.array();
        arraySort(invites, 'uses', {
            reverse: true
        }); 
        let possibleInvites = [
            ['Kullanıcı', 'Kullanım']
        ]; 
        invites.forEach(function(invite) {
            possibleInvites.push([invite.inviter.username, invite.uses]);
        })
        const embed = new Discord.RichEmbed()
            .setColor("RANDOM")
            .addField('Oluşturulma Sıralaması', `\`\`\`${table.table(possibleInvites)}\`\`\``);
        message.channel.send(embed)
    }
});




client.on('message', message => {
  if (message.content.toLowerCase() === prefix + "şans") {
      var sans = ["💎|💳|⌛ - Malesef Kaybettin", "⌛|⌛|💎 - Tüh Be Tekrar Dene", "💳|💎|💳 - Hadi Be Az Kaldı", "💎|💎|💎 - Helal Sana Hepsini Tutturdun", "💎|⌛|⌛ - Az Kaldı Merak Etme", "💳|💳|💳 - Profesyonelsin Dostum", "💎|💳|⌛ - Birdaki Sefere", "⌛|⌛|⌛ - Bu İşte Ustasın Dostum"];
       var sonuc = sans[Math.floor((Math.random() * sans.length))];
    const embed = new Discord.RichEmbed()
    .addField(`***___Şans___***`, `${sonuc}`)
    return message.channel.sendEmbed(embed);
}
});









client.on("message", message => {
  if (message.author.bot) return;
 if (message.content.toLowerCase() === prefix + 'türkkahvesi')
    if (message.author.type !== "group") {
			 message.channel.send('Bağlanılıyor....').then(msg => {
            msg.react("☕").then((msgreaction) => msgreaction.message.edit(kahve))
        });
			message.delete()
      const kahve = new Discord.RichEmbed()
      .setImage("https://goo.gl/36DtWR")
      .setColor(Math.floor(Math.random() * (0xFFFFFF + 1)))
  };
});



    client.on('message', msg => {
  if (msg.content.toLowerCase() === prefix + 'ınflames') {
    if (msg.author.id !== ayarlar.sahip) {
        msg.channel.send('Kimliğin doğrulanıyor..')
        .then(nmsg => nmsg.edit('Sen InFlames değilsin.'));
    }else{
    msg.channel.send('InFlames yazılıyor....')
      .then(nmsg => nmsg.edit(':regional_indicator_i:'))
      .then(nmsg => nmsg.edit(':regional_indicator_i: :regional_indicator_n:'))
      .then(nmsg => nmsg.edit(':regional_indicator_i: :regional_indicator_n: :regional_indicator_f:'))
      .then(nmsg => nmsg.edit(':regional_indicator_i: :regional_indicator_n: :regional_indicator_f: :regional_indicator_l:'))
      .then(nmsg => nmsg.edit(':regional_indicator_i: :regional_indicator_n: :regional_indicator_f: :regional_indicator_l: :regional_indicator_a: :regional_indicator_m: :regional_indicator_e:'))
      .then(nmsg => nmsg.edit(':regional_indicator_i: :regional_indicator_n: :regional_indicator_f: :regional_indicator_l: :regional_indicator_a: :regional_indicator_m: :regional_indicator_e:'))
      .then(nmsg => nmsg.edit(':regional_indicator_i: :regional_indicator_n: :regional_indicator_f: :regional_indicator_l: :regional_indicator_a:  :regional_indicator_m: :regional_indicator_e: :regional_indicator_s:'));
  }
  }
});













client.on(`message`, msg => {
  if (msg.content.toLowerCase() === prefix + 'söz') {
    msg.delete();
    var Random = [
      'Herkes kendi kaderinin demircisidir',
      'Belki hiç bir şey yolunda gitmedi ama hiçbir şey de beni yolumdan etmedi!',
      'Gül biraz; bunca keder, bunca gözyaşı dinsin, gül biraz; şu gök kubbe kahkahanı işitsin. Her gidenin ardından koşmaya değmez hayat, gelecekleri bekle, gidecek varsın gitsin.',
      'Aşk davaya benzer, cefa çekmek de şahide. Şahidin yoksa davayı kazanamazsın ki!',
      'İnsan geride bıraktıklarını özler, sahip olduğundan sıkılır, ulaşamadığına tutulur. Genelde ulaşılmaz olan hep aşk olur.',
      'Salatalığın kabuğunu soymak, onun hıyar olduğu gerçeğini değiştirmez.',
      'Bu kadar yürekten çağırma beni. Bir gece ansızın gelebilirim. Beni bekliyorsan, uyumamışsan, sevinçten kapında ölebilirim.',
      'Nankör insan her şeyin fiyatını bilen hiçbir şeyin değerini bilmeyen kimsedir.',
      'Biz birbirimize dönmüş iki ayna gibiyiz. İçimizde binlerce olsa da görüntümüz bir biz sadece birbirimizi görürüz…',
      'Gittiğin yerde boşluk dolduran değil, gittiğin zaman boşluğu doldurulamayan ol.',
      'Eğer aç ve kimsesiz bir köpeği alıp bakar ve rahata kavuşturursanız sizi ısırmaz. İnsan ve köpek arasındaki temel fark budur.',
      'Bir ilişkiyi kadın başlatır, kadın bitirir. Ama başlatan ve bitiren aynı kadın olmayabilir.',
      'Bir tohum verdin çiçeğini al. Bir çekirdek verdin ağacını al. Bir dal verdin ormanını al. Dünyamı verdim sana bende kal.',
      'Yalnızca kültürlü insanlar öğrenmeyi sever cahiller ders vermeyi tercih eder.',
    ];
    var Sözver = Math.floor(Math.random()*Random.length);
    const söz = new Discord.RichEmbed()
    .setDescription(`${Random[Sözver]}`)
    .setColor(Math.floor(Math.random() * (0xFFFFFF + 1)))
    return msg.channel.sendEmbed(söz);
  }
});




client.on('message', msg => {
  if (msg.content.toLowerCase() === prefix + 'beşiktaş') {
    msg.delete();
    msg.channel.send({embed: {
        color:  0x000000,
        author: {
        },
        description: 'BEŞİKTAŞ :heart: :yellow_heart: :purple_heart:  :blue_heart: :yellow_heart: :purple_heart:',
        footer: {
        }
      }
    });
  }});




client.on('message', msg => {
  if (msg.content.toLowerCase() === 'beşiktaş')
    if (msg.author.type !== "group") {
      const beşiktaş = new Discord.RichEmbed()
      .setImage("https://goo.gl/KRfm45")
      .setColor(0x000000);
      return msg.channel.sendEmbed(beşiktaş);
  }
});

client.on('message', msg => {
  if (msg.content.toLowerCase() === 'fenerbahçe')
    if (msg.author.type !== "group") {
      const fenerbahçe = new Discord.RichEmbed()
      .setImage("https://goo.gl/uX2Sqa")
      .setColor(0xf2fc36);
      return msg.channel.sendEmbed(fenerbahçe);
  }
});

client.on('message', msg => {
  if (msg.content.toLowerCase() === 'galatasaray')
    if (msg.author.type !== "group") {
      const galatasaray = new Discord.RichEmbed()
      .setImage("https://goo.gl/7TLZ8H")
      .setColor(0xff3338);
      return msg.channel.sendEmbed(galatasaray);
  }
});

client.on('message', msg => {
  if (msg.content.toLowerCase() === '41kocaeli')
    if (msg.author.type !== "group") {
      const kocaelispor = new Discord.RichEmbed()
      .setImage("https://goo.gl/iXizxf")
      .setColor(0xff3338);
      return msg.channel.sendEmbed(kocaelispor);
  }
});

client.on('message', msg => {
  if (msg.content.toLowerCase() === 'trabzonspor')
    if (msg.author.type !== "group") {
      const trabzon = new Discord.RichEmbed()
      .setImage("https://goo.gl/q9AFbP")
      .setColor(0xff3338);
      return msg.channel.sendEmbed(trabzon);
  }
});

client.on('message', msg => {
  if (msg.content.toLowerCase() === 'başakşehir')
    if (msg.author.type !== "group") {
      const başakşehir = new Discord.RichEmbed()
      .setImage("https://goo.gl/3hC3wu")
      .setColor(0xff3338);
      return msg.channel.sendEmbed(başakşehir);
  }
});

client.on('message', msg => {
  if (msg.content.toLowerCase() === 'bursaspor')
    if (msg.author.type !== "group") {
      const bursaspor = new Discord.RichEmbed()
      .setImage("https://goo.gl/j5GC5E")
      .setColor(0xff3338);
      return msg.channel.sendEmbed(bursaspor);
  }
});

client.on('message', msg => {
  if (msg.content.toLowerCase() === 'karsspor')
    if (msg.author.type !== "group") {
      const karsspor = new Discord.RichEmbed()
      .setImage("https://cdn.discordapp.com/attachments/415626545538007073/442456119957389322/kars.jpg")
      .setColor(0x000000);
      return msg.channel.sendEmbed(karsspor);
  }
});





client.login(process.env.TOKEN);