export class Enemy {
    constructor(data = {}) {
        this.data = data

        //psotion n dimensions
        // this.x = 0
        // this.y = 0
        // this.width = data.width
        // this.height = data. height

        // //stats
        // this.health = data.health
        // this.speed = data.speed
        // this.damage = data.damage
        // this.collisionRadius = data.collisionRadius

        Object.assign(this, data)
    }

    spawn(x,y) {
        this.x = x
        this.y = y
        this.health = this.data.health
    }

    update(dt, player) {
        //calculates direct path towards player
        let dx = player.x - this.x
        let dy = player.y - this.y
        const len = Math.hypot(dx, dy)

        if (len > 0) {
            dx = dx / len
            dy = dy / len

            this.x+= dx * this.speed * dt
            this.y+= dy * this.speed * dt
        }
    }
}