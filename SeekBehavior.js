export class SeekBehavior {
    update(enemy, dt, player) {
        //calculates direct path towards player
        let dx = player.x + player.width * 0.5 - (enemy.x + enemy.width * 0.5)
        let dy = player.y + player.height * 0.5 - (enemy.y + enemy.height * 0.5)
        const len = Math.hypot(dx, dy)

        if (len > 0) {
            dx = dx / len
            dy = dy / len

           enemy.x+= dx * enemy.speed * dt
           enemy.y+= dy * enemy.speed * dt
        }
    }
}