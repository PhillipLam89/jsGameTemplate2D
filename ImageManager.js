export class ImageManager {
    constructor() {
        this.images = {}
    }
    load(name, path) {
        const img = new Image()
              img.src = path
        
        this.images[name] = {img: img, loaded:false}

        img.onload = () => {
            this.images[name].loaded = true
            console.log(`loaded: ${name}`)
        }

        img.onerror = () => {
            console.log(`this img failed to load: ${name}, using fallback`)
        }
    }
    get(name) {
        return this.images[name]?.loaded && this.images[name].img 
    }
    
    loadAll() {
        this.load('player', 'images/player.png')
    }
}