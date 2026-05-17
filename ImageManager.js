export class ImageManager {
    constructor() {
        this.images = {}
    }

    async load(name, path) {
      return new Promise((resolve) => {
            const img = new Image()
                img.src = path
            
            this.images[name] = {img: img, loaded:false}

            img.onload = () => {
                this.images[name].loaded = true
                resolve()
            }

            img.onerror = () => {
                console.log(`this img failed to load: ${name}, using fallback`)
                resolve() //resolves promise even if img fails to load since have fallback
            }
        })

    }

    get(name) {
            return this.images[name]?.loaded && this.images[name].img 
    }
        
    async loadAll() {
        await Promise.all([
             this.load('player', 'images/player.png')
        ])
       
        // await new Promise(resolve => setTimeout(resolve, 1111))
    }
}