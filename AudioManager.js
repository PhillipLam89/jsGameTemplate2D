import {audioData} from './audioData.js'
export class AudioManager {
    constructor() {
        this.sounds = {}

    }
    load(name,path){
        
       return new Promise((resolve) => {
            const audio = new Audio(path)
            this.sounds[name] = {audio: audio, loaded:false}

            audio.onloadeddata = () => {
                this.sounds[name].loaded = true
                resolve()
            }
            audio.onerror = () => {
               
                resolve()
            }
        })

    }
    play(name){
        const sound = this.sounds[name]
        if (sound && sound.loaded) {
            sound.audio.currentTime = 0
            sound.audio.play()//this returns a promise, can catch its errs
                       .catch(err => {
                        console.log(`${name} is a ` + 'trash sound file fix it, cant play')
                       }) 
        }
    }

    async loadAll() {
        await Promise.all(audioData.map(({name, path}) => this.load(name,path)))
    }
}