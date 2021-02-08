const Discord = require("discord.js");
const client = new Discord.Client();
const ayarlar = require("./ayarlar.json");
require("dotenv").config();
const mdt = require("axios").default;

var token = process.env.TOKEN;
var prefix = process.env.PREFIX;


const oyuncular = async(type) => {
    try {
        return mdt({
            url: `http://${ayarlar.ip}:${ayarlar.port}/${type}.json`,
            method: "get",
            timeout: 10000,
            responseType: "json"
        })
    } catch {
        console.log("\x1b[31mSunucuya bağlanamadım!\x1b[0m")
    }
}

const presence = async() => {
    let res = await oyuncular("players");
    client.user.setPresence({ activity: { name: `${res.data.length} kişi ile`, type: "PLAYING" }, status: "dnd" })
}

client.on("ready", async() => {
    console.log(`\x1b[32m${client.user.tag} olarak giriş yapıldı!\x1b[0m`)
    await presence();
    setInterval(async() => {
            await presence();
        }, 30000) // 30000ms = 30 saniyede bir tekrardan presence günceller.

})


client.on("message", async(message) => {
    let args = message.content.substring(prefix.length).split(" ");

    switch (args[0]) {
        case "oyunculistesi":
            let liste = [];
            let res = await oyuncular("players");
            const listeEmbed = new Discord.MessageEmbed()
                .setFooter("MDTStatus")
                .setColor("GREEN")
                .setAuthor("Bilmem ne rp sunucu listesi")
            res.data.forEach(player => {
                liste.push(`${player.name}`)
            })
            listeEmbed.setDescription(liste);
            message.channel.send(listeEmbed)
            break;
    }
})

client.login(token);