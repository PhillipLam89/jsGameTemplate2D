import { GAME_HEIGHT, GAME_WIDTH, ASPECT_RATIO, CANVAS_MARGIN, GAME_STATES, EVENTS } from "./constants.js"
import { EventEmitter } from "./EventEmitter.js"
import { RenderSystem } from "./RenderSystem.js"
import { Player } from "./Player.js"
import { ImageManager } from "./ImageManager.js"
import { AudioManager } from "./AudioManager.js"
import { UIManager } from "./UIManager.js"
import { EnemyManager } from "./EnemyManager.js"
import { EnemySpawner } from "./EnemySpawner.js"
import { CollisionSystem } from "./CollisionSystem.js"
import { CollisionManger } from "./CollisionManager.js"

export class Game {
    constructor() {
        this.canvas = window.gameCanvas
        this.hitBoxOn = false
        this.events = new EventEmitter()
        this.throttleFunc = function(func, limit)  {
          
            let inThrottle
            return (...args) => {
                if (!inThrottle) {
                func.apply(this, args)
               
                inThrottle = true
             
                setTimeout(() => inThrottle = false, limit)
                }
            }
    }

        this.imageManager = new ImageManager()
        this.audioManager = new AudioManager()
        this.uiManager = new UIManager(this.events) //handles panels, menus etc.
        this.enemyManager = new EnemyManager()
        this.enemySpawner = new EnemySpawner(this.enemyManager)

        this.renderSystem = new RenderSystem(this, this.canvas, this.imageManager)
        this.collisionSystem = new CollisionSystem()
        this.collisionManager = new CollisionManger(this.collisionSystem, this.events)
        this.player = new Player(this)

        //keeps track of pressed keys
        this.keys = {tab:'off'}
        this.time = 0
        this.lastTime = 0
        this.state = GAME_STATES.MENU;
  
    
        this.init() //starts game loop via animationFrame
    }
    async init() {
        const randomLoadTimes = [1000, 750, 1215, 1591, 1333, 1789]
        await Promise.all([
             this.imageManager.loadAll(),
             this.audioManager.loadAll(),

            //  new Promise(resolve => setTimeout(resolve, 1))
        ]);
        
        //register events so EventEmitter can play them thru AudioManager

        this.events.on(EVENTS.SOUND, (name) => this.audioManager.play(name))
        this.events.on(EVENTS.GAME_PAUSE, () => this.pause())
        this.events.on(EVENTS.GAME_START, () => this.startGame())
        this.events.on(EVENTS.GAME_RESUME, () => this.resume())
        this.events.on(EVENTS.GAME_RETURN_TO_MENU, () => this.returnToMenu())


        //player events

        this.events.on(EVENTS.PLAYER_DAMAGED, (health, maxHealth) => {
            this.events.emit(EVENTS.SOUND, 'player_hurt')
            this.uiManager.updateHealthBar(health, maxHealth)
        })

        this.uiManager.showPanel('mainMenu')

      
        this.setupInput()
        this.resizeCanvas()
        window.addEventListener('resize', this.throttleFunc(this.resizeCanvas, 100))
     

        //starts counting time when gameloop starts
        this.lastTime = performance.now()


        //triggers first gameLoop call
        requestAnimationFrame((t) => this.gameLoop(t))
    }
    gameLoop(timeStamp) {
        if (this.lastTime == 0) this.lastTime = timeStamp
        const dt = Math.min( (timeStamp - this.lastTime) / 1000,   0.1)
        this.lastTime = timeStamp
        
        if (this.state == GAME_STATES.PLAYING) {
            this.time+= dt
            this.uiManager.updateTimer(this.time)
        }
        
        const activeEnemies = this.enemyManager.getActiveEnemies()
        this.update(dt, activeEnemies)
        this.renderSystem.render(this.state, 
                                this.player,
                                activeEnemies)
    
        requestAnimationFrame((t) => this.gameLoop(t))
    }
    update(dt, activeEnemies) { //runs every frame
        if (this.state !== GAME_STATES.PLAYING) return
        this.player.update(dt, this.keys)
        this.enemyManager.update(dt, this.player)
        this.enemySpawner.update(dt)
        this.collisionManager.update(this.player, activeEnemies)
    }


    setupInput() {
        window.addEventListener('keydown', ({key}) => {
            
            if ('qQ'.includes(key)) {
                this.hitBoxOn = !this.hitBoxOn
            }
            else this.keys[key.toLowerCase()] = true
            
            const ESC = this.keys['escape']
            const isPlaying = this.state == GAME_STATES.PLAYING && ESC 
            const isPaused = this.state == GAME_STATES.PAUSED && ESC 

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
        this.events.emit(EVENTS.SOUND, 'button_click')
        this.state = GAME_STATES.PLAYING
        this.uiManager.hideAllPanels()
        this.time = 0  
        this.uiManager.showHUD()
        
                //resets player position if restarted
        this.player.reset()
        this.enemyManager.reset()
        this.enemySpawner.reset()

        //resets player to full hp when new game starts
        this.uiManager.updateHealthBar(this.player.health, this.player.maxHealth)
      




        this.lastTime = performance.now()
    }
    pause(){
        this.events.emit(EVENTS.SOUND, 'pause')
        this.state = GAME_STATES.PAUSED
        this.uiManager.showPanel('pauseMenu')
    }
    resume(){
         this.events.emit(EVENTS.SOUND, 'unpause')
        this.state = GAME_STATES.PLAYING
        this.uiManager.hideAllPanels()
    }

    returnToMenu(){
        this.events.emit(EVENTS.SOUND, 'button_click')
        this.state = 'menu'
        this.uiManager.hideAllPanels()
        this.uiManager.hideHUD()
        this.uiManager.showPanel('mainMenu')
    } 

    // playSound(name) {
    //     this.audioManager.play(name)
    // }

    resizeCanvas() {
     
        let w;
        let h;
        const margin = 35

        const availableWidth = window.innerWidth - (CANVAS_MARGIN * 2)
        const availableHeight = window.innerHeight - (CANVAS_MARGIN * 2)

        if (availableWidth / availableHeight > ASPECT_RATIO) { //when window is too wide
            h = availableHeight
            w = h * ASPECT_RATIO
        } else {
            w = availableWidth
            h = w / ASPECT_RATIO
        }

        this.canvas.width = GAME_WIDTH
        this.canvas.height = GAME_HEIGHT

        this.canvas.style.width = w+'px'
        this.canvas.style.height = h+'px'
        this.canvas.style.margin = CANVAS_MARGIN + 'px'
    }

}