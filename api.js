var express = require('express')
var fs = require('fs');
var html = fs.readFileSync('./index.html', 'utf8');

const Api = class{
    status = 'pause'
    videoId = ['IqYgNiZdfh4', 0]
    playlist = []
    idAdd = 1
    constructor(port){
        this.port = port
    }
    init(){
        var app = express()
    
        app.get('/', (req, res) => {
            res.write(html)
        })
        app.get('/status', (req, res) => {
            res.json({status:this.getStatus(), videoId:this.videoId, playlist:this.playlist})
        })
        app.get('/status/:newStatus', (req, res) => {
            if(req.params.newStatus == "play"){
                res.status(200).json({message:'ok'})
                this.setStatus(req.params.newStatus)

            }else if(req.params.newStatus == "pause"){
                res.status(200).json({message:'ok'})
                this.setStatus(req.params.newStatus)

            }else if(req.params.newStatus == "end"){
                this.skipMusic()
                res.status(200).json({message:'ok'})
                this.setStatus(req.params.newStatus)
            }else if(req.params.newStatus == "skip"){
                this.skipMusic()
                res.status(200).json({message:'ok'})
                this.setStatus('play')
            }
        })
    
        app.listen(this.port, () => {
        console.log(`API: Ligada! http://localhost:${this.port}`)
        })
    }
    
    addIdAdd(){
        this.idAdd = this.idAdd + 1
    }

    setStatus(newStatus){
        this.status = newStatus
    }
    getStatus(){
        return this.status
    }

    
    setVideoId(newVideoId){
        let id = this.idAdd
        this.addIdAdd()
        this.videoId = [newVideoId, id]
    }
    getVideoId(){
        return this.videoId
    }

    playMusic(newVideoId){
        if(this.getStatus()== "end" && this.playlist.length == 0){
            this.setVideoId(newVideoId)
            return
        }
        this.playlist.push([newVideoId, this.idAdd])
        this.addIdAdd()
        return
        
    }
    skipMusic(){
        if(this.playlist.length>0){
            this.videoId = this.playlist.shift()
        }else{
            this.videoId = ['',this.idAdd]
            this.addIdAdd()
        }
    }
}

module.exports = Api
