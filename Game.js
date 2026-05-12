import { GAME_HEIGHT, GAME_WIDTH } from "./constants.js"
import { RenderSystem } from "./RenderSystem.js"
import { Player } from "./Player.js"
import { ImageManager } from "./ImageManager.js"
export class Game {
    constructor() {
        this.canvas = window.gameCanvas
        this.ctx = this.canvas.getContext('2d')

        this.imageManager = new ImageManager()
        this.imageManager.loadAll()

        this.renderSystem = new RenderSystem(this.canvas, this.imageManager)
        this.player = new Player()

        //keeps track of pressed keys
        this.keys = {}
        this.lastTime;

        this.init() //starts game loop via animationFrame
    }
    init() {
        this.resizeCanvas()
        window.addEventListener('resize', () => this.resizeCanvas())
        this.setupInput()
        
        //starts counting time when gameloop starts
        this.lastTime = performance.now()


        //triggers first gameLoop call
        requestAnimationFrame((t) => this.gameLoop(t))
    }


    setupInput() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true
            
        })

        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false
          
        })

        //prevents key press bugs with right-click and tab-switchin
        window.addEventListener('contextmenu', () => {
            this.keys = {}          
        })   
        window.addEventListener('blur', () => {
            this.keys = {}          
        })                   
    }
    resizeCanvas() {
        const ratio = 16 / 9
        let w;
        let h;
        const margin = 35

        const availableWidth = window.innerWidth - (margin * 2)
        const availableHeight = window.innerHeight - (margin * 2)

        if (availableWidth / availableHeight > ratio) { //when window is too wide
            h = availableHeight
            w = h * ratio
        } else {
            w = availableWidth
            h = w / ratio
        }

        this.canvas.width = GAME_WIDTH
        this.canvas.height = GAME_HEIGHT

        this.canvas.style.width = w+'px'
        this.canvas.style.height = h+'px'
        this.canvas.style.margin = margin+'px'
    }
    gameLoop(timeStamp) {
        const dt = Math.min( (timeStamp - this.lastTime) / 1000,   0.1)
       
        this.lastTime = timeStamp
        this.update(dt)
        this.renderSystem.render(this.player)
        requestAnimationFrame((t) => this.gameLoop(t))
    }
    update(dt) { //runs every frame
        this.player.update(dt, this.keys)
    }
}