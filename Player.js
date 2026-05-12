import {GAME_WIDTH, GAME_HEIGHT} from './constants.js'
export class Player {
    constructor() {

        this.width = 164
        this.height = 164

        this.x = (GAME_WIDTH - this.width) / 2
        this.y = (GAME_HEIGHT - this.height) / 2

        this.speed = 100 //pixels moved per sec

        //upgrade multipliers
        this.speedMultiplier = 1

    }

    update(dt, keys) { //moves player
        let [dx, dy] = [0,0]

        if (keys['w'] || keys['arrowup']) dy -= 1 //moves upwards 
        if (keys['s'] || keys['arrowdown']) dy += 1
        if (keys['a'] || keys['arrowleft']) dx -= 1
        if (keys['d'] || keys['arrowright']) dx += 1


        if (dx || dy) {//makes diagonal movement not as fast
            const len = Math.sqrt(dx*dx + dy*dy) 
            dx = dx / len
            dy = dy / len

            //using dt allows consistent movement across all Frame Rates
            this.x+= dx * this.speed * this.speedMultiplier * dt
            this.y+= dy * this.speed * this.speedMultiplier * dt
        } 

        //keeping player in-bounds
        this.x = Math.min(GAME_WIDTH - this.width, this.x) //blocks rightwards
        if (0 > this.x) this.x  = 0  //blocks leftwards

        this.y = Math.min(GAME_HEIGHT - this.height, this.y) //blocks up
        if (0 > this.y) this.y  = 0  //blocks down
    }
    
}