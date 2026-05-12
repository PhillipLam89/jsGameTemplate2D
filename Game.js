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
        this.lastTime = 0
        this.state = 'menu'

        this.init() //starts game loop via animationFrame
    }
    init() {
        this.resizeCanvas()
        window.addEventListener('resize', () => this.resizeCanvas())
        this.setupInput()
        this.setupUI()
        
        //starts counting time when gameloop starts
        this.lastTime = performance.now()


        //triggers first gameLoop call
        requestAnimationFrame((t) => this.gameLoop(t))
    }
    gameLoop(timeStamp) {
        const dt = Math.min( (timeStamp - this.lastTime) / 1000,   0.1)
       
        this.lastTime = timeStamp
        this.update(dt)
        
        this.render()
    
        requestAnimationFrame((t) => this.gameLoop(t))
    }
    update(dt) { //runs every frame
        if (this.state !== 'playing') return
        this.player.update(dt, this.keys)
    }
    render() {
        if (this.state == 'menu') {
            this.ctx.fillStyle  = '#0f3460'
            this.ctx.fillRect(0,0, this.canvas.width, this.canvas.height)
        } else {
            this.renderSystem.render(this.player)
        }
    }

    setupInput() {
        window.addEventListener('keydown', ({key}) => {
            this.keys[key.toLowerCase()] = true
            
            const ESC = this.keys['escape']
            const isPlaying = this.state == 'playing' && ESC 
            const isPaused = this.state == 'paused' && ESC 

            isPlaying && this.pause()
            isPaused && this.resume()



            //esc pauses game
            // if (key == 'Escape') {
            //     if (this.state == 'playing') {
            //         this.pause()
            //     } else if (this.state == 'paused') {
            //         this.resume()
            //     }
            // }
        })

        window.addEventListener('keyup', ({key}) => {
            this.keys[key.toLowerCase()] = false
          
        })

        //prevents key press bugs with right-click and tab-switchin
        window.addEventListener('contextmenu', () => {
            this.keys = {}          
        })   
        window.addEventListener('blur', () => {
            this.keys = {}          
        })                   
    }
    setupUI() {
        window.playBtn.onclick = () => this.startGame()
        window.resumeBtn.onclick = () => this.resume()
        window.quitBtn.onclick = () => this.quitToMenu()
    }
    hideAllPanels(){
        document.querySelectorAll('.ui-panel').forEach(node => node.classList.remove('active'))
    }
    startGame() {
        this.state = 'playing'
        this.hideAllPanels()
    }
    pause(){
        this.state = 'paused'
        window.pauseMenu.classList.add('active')
    }
    resume(){
        this.state = 'playing'
        window.pauseMenu.classList.remove('active')
    }
    quitToMenu(){
        this.returnToMenu()
    }
    returnToMenu(){
        this.state = 'menu'
        this.hideAllPanels()
        window.mainMenu.classList.add('active')
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

}