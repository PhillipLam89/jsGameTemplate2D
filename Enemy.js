import { GAME_WIDTH, GAME_HEIGHT, ENEMY_DESPAWN_MARGIN } from "./constants.js"
export class Enemy {
    constructor(data, behavior) {
        this.data = data
        
        //psotion n dimensions


        // Object.assign(this, data)
        this.behavior = behavior
        this.x = 0
        this.y = 0
        this.width = data.width
        this.height = data.height
        this.speed = data.speed
        this.damage = data.damage
        this.collisionRadius = data.collisionRadius
        this.active = false
        this.facingLeft = false
        this.oldX = 0
    }

    spawn(x,y) {
        this.x = x
        this.y = y
        this.health = this.data.health
        this.active = true
    }
    reset() {
        this.active = false
        this.health = this.data.health

        if (this.behavior.reset){
            this.behavior.reset();
        }
    }
    update(dt, player) {

        if (!this.active) return 

        //de-spawn enemy if off screen
        const isOffScreen = (this.x < -ENEMY_DESPAWN_MARGIN 
                                ||
                            this.x > GAME_WIDTH + ENEMY_DESPAWN_MARGIN
                                ||
                            this.y < -ENEMY_DESPAWN_MARGIN
                                ||
                            this.y > GAME_HEIGHT + ENEMY_DESPAWN_MARGIN)
      
        if (isOffScreen) {
            this.active = false
            return
        }    
        
        const oldX = this.x
        this.behavior.update(this, dt, player)

        this.facingLeft = (this.x < oldX) ? true : false 

    }
}