import { GAME_HEIGHT, GAME_WIDTH } from "./constants.js"
import { RenderSystem } from "./RenderSystem.js"
import { Player } from "./Player.js"
import { ImageManager } from "./ImageManager.js"
import { AudioManager } from "./AudioManager.js"
import { UIManager } from "./UIManager.js"
export class Game {
    constructor() {
        this.canvas = window.gameCanvas
        this.hitBoxOn = false

        this.imageManager = new ImageManager()
        this.audioManager = new AudioManager()

        this.renderSystem = new RenderSystem(this, this.canvas, this.imageManager)
        this.player = new Player(this)

        //keeps track of pressed keys
        this.keys = {tab:'off'}
        this.time = 0
        this.lastTime = 0
        this.state = 'menu';
  
    
        this.init() //starts game loop via animationFrame
    }
    async init() {
        const randomLoadTimes = [1000, 750, 1215, 1591, 1333, 1789]
        await Promise.all([
             this.imageManager.loadAll(),
             this.audioManager.loadAll(),
             this.uiManager = new UIManager(this) //gives access to Game class from UI_Manager
            //  new Promise(resolve => setTimeout(resolve, 1))
        ]);
              
        //loadin screen
       [await new Promise(resolve => setTimeout(resolve, 55))]

        this.uiManager.showPanel('mainMenu')

        
        this.setupInput()
        this.resizeCanvas()
        window.addEventListener('resize', () => this.resizeCanvas())
        // this.setupInput()

        
        //starts counting time when gameloop starts
        this.lastTime = performance.now()


        //triggers first gameLoop call
        requestAnimationFrame((t) => this.gameLoop(t))
    }
    gameLoop(timeStamp) {
        if (this.lastTime == 0) this.lastTime = timeStamp
        const dt = Math.min( (timeStamp - this.lastTime) / 1000,   0.1)
        this.lastTime = timeStamp
        
        if (this.state == 'playing') {
            this.time+= dt
            this.uiManager.updateTimer(this.time)
        }
        

        this.update(dt)
        this.renderSystem.render(this.state, this.player)
    
        requestAnimationFrame((t) => this.gameLoop(t))
    }
    update(dt) { //runs every frame
        if (this.state !== 'playing') return
        this.player.update(dt, this.keys)
    }


    setupInput() {
        window.addEventListener('keydown', ({key}) => {
            
            if (key == 'q') {
                this.hitBoxOn = !this.hitBoxOn
            }
            else this.keys[key.toLowerCase()] = true
            
            const ESC = this.keys['escape']
            const isPlaying = this.state == 'playing' && ESC 
            const isPaused = this.state == 'paused' && ESC 

            isPlaying && this.pause()
            isPaused && this.resume()

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


    startGame() {
         this.audioManager.play('button_click')
        this.state = 'playing'
        this.uiManager.hideAllPanels()
        this.time = 0
        this.uiManager.showTimer()

        //resets player position if restarted
        this.player.reset()

        this.lastTime = performance.now()
    }
    pause(){
        this.audioManager.play('pause')
        this.state = 'paused'
        this.uiManager.showPanel('pauseMenu')
    }
    resume(){
        this.audioManager.play('unpause')
        this.state = 'playing'
        this.uiManager.hideAllPanels()
    }

    returnToMenu(){
        this.audioManager.play('button_click')
        this.state = 'menu'
        this.uiManager.hideAllPanels()
        this.uiManager.hideTimer()
        this.uiManager.showPanel('mainMenu')
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