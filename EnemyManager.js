import { enemyData } from "./enemyData.js"
import { Enemy } from "./Enemy.js"
import { ObjectPooler } from "./utils/ObjectPooler.js"
import { BehaviorFactory } from "./BehaviorFactory.js"

export class EnemyManager {
    constructor() {
        this.pools = {}
        const ENEMY_POOL_SIZE = 10

        //create pool for each enemy type

        for (const type in enemyData) {
            this.pools[type] = new ObjectPooler(() => {
                const data = enemyData[type]
                const behavior = BehaviorFactory.create(data.behaviorType)
                return new Enemy(data, behavior)
            },ENEMY_POOL_SIZE)
        }

        // this.pool = new ObjectPooler( () => {
        //    const data = enemyData.drifter
        //    const behavior = BehaviorFactory.create(data.behaviorType)
        //    return new Enemy(data, behavior)
        // }, ENEMY_POOL_SIZE)


    }
    spawn(type, x,y) {
        const pool = this.pools[type]

        if (!pool) {
            return null
        }
        const enemy =  pool.get()
        enemy.spawn(x,y)
        return enemy
    }
    getActiveEnemies() {
        const enemies = []
        for (const type in this.pools) {
            enemies.push(...this.pools[type].active)
        }
        return enemies
    }
    update(dt, player) {
        for (const type in this.pools) {
            this.pools[type].updateAll(dt, player)
        }
       
    }
    reset(){
        for (const type in this.pools) {
            this.pools[type].releaseAll()
        }
    }
}