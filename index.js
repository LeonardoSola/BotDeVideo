const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

var express = require('express')
const ApiClass = require('./api')
const Api = new ApiClass(80)

const falas = require('./falas.json');
const fala = falas['Portuguese']
const config = require('./config.json');
var apiStatus = ''

const prefix = config.prefix

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    
    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const comando = args.shift().toLowerCase()
    const argumento = message.content.slice(comando.length + prefix.length + 1)

    const info = {message, args, comando,argumento}

    if(args[1]) var command = args[1].toLowerCase()
    
    if (!comandos[comando]) return

    var fazer = comandos[comando]
    var res = fazer(info)

    if (!res) return
    message.channel.send(res)

    //Command test!
})

const comandos = {
    play(info){
        Api.playMusic(info.argumento)
        return fala.playMusic
    },
    playskip(info){
        if(info.argumento.length<=2) return fala.errorPlay
        Api.setVideoId(info.argumento)
        return fala.playSkipMusic
    },
    skip(info){
        Api.skipMusic()
        return fala.skipMusic
    },
    pause(){
        Api.setStatus('pause')
    }
}



client.once('ready', async () => {
    console.log("Bot: Ligado!")
    Api.init()
});

client.login(config.token) 