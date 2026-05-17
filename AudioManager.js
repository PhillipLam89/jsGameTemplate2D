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
                alert(`sound of ${name} cant be loaded or played, will skip`)
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
        await Promise.all([
        this.load('pause', './audio/pause.mp3'),
        this.load('unpause', './audio/unpause.mp3'),
        this.load('button_hover', './audio/button_hover.mp3'),
        this.load('button_click', './audio/button_click.mp3')
        ])
    }
}