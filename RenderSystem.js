import { GAME_WIDTH, GAME_HEIGHT, GRID_SIZE, GAME_STATES } from "./constants.js"

export class RenderSystem {
    constructor(game, canvas, imageManager) {
        this.game = game
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.imageManager = imageManager
    }
    render(state, player, enemies = []) {
     if (state == GAME_STATES.MENU) {
        this.renderMenuBackground()
     } else {
        this.ctx.fillStyle = 'chartreuse'
        this.ctx.fillRect(0,0,GAME_WIDTH,GAME_HEIGHT)  
        // the below drawing order puts enemies on top of game grid but under the player
        this.renderGrid()
        this.renderEnemies(enemies)
        this.renderPlayer(player)
     }

    }
    renderPlayer(player) {
        const playerImage = this.imageManager.get('player')

        if (playerImage ) {

            this.ctx.drawImage(playerImage, player.x, player.y, player.width, player.height)
   
            //hitbox square toggle
                if (this.game.hitBoxOn) {
                this.ctx.strokeStyle = 'deeppink'
                this.ctx.lineWidth = 2
                this.ctx.beginPath()
                this.ctx.rect( player.x, player.y, player.width , player.height )
                this.ctx.stroke()
            }



        } else {
     
            this.ctx.fillRect(player.x,player.y,player.width,player.height)


            this.ctx.strokeRect(player.x,player.y,player.width,player.height)
        }

    }

    renderEnemies(enemies) {
        for (const enemy of enemies) {
            this.ctx.fillStyle = 'deeppink'
            this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height)
        }
    }
    renderGrid() {
                   this.ctx.strokeStyle = 'blue'
        this.ctx.lineWidth = 3
              this.ctx.beginPath()
        for (let i = 0; i < GAME_WIDTH; i = i + GRID_SIZE) {
      
            this.ctx.moveTo(i,0)
            this.ctx.lineTo(i, GAME_HEIGHT)
            // this.ctx.stroke()
        }
        for (let i = 0; i < GAME_HEIGHT; i = i + GRID_SIZE) {
        
            this.ctx.moveTo(0,i)
            this.ctx.lineTo(GAME_WIDTH, i)
          
        }        
        this.ctx.stroke()
      
    }
    renderMenuBackground() {
            this.ctx.fillStyle  = '#0f3460'
            this.ctx.fillRect(0,0, GAME_WIDTH, GAME_HEIGHT) 
    }
}