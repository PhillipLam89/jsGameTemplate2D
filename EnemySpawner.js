import { GAME_WIDTH, GAME_HEIGHT, ENEMY_SPAWN_INTERVAL, ENEMY_SPAWN_MARGIN } from "./constants.js";
import { enemyData } from "./enemyData.js";
export class EnemySpawner { //handles timing, spawn location, type
    constructor(enemyManager) {
        this.enemyManager = enemyManager
        this.spawnTimer = 0
        this.spawnInterval = ENEMY_SPAWN_INTERVAL
        this.enemyTypes = []
        // this.enemyTypes = Object.keys(enemyData)
        for (const type in enemyData) {
            this.enemyTypes.push(type)
        }
   
    }
    update(dt) {
        this.spawnTimer+= dt
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnWave()
            this.spawnTimer -= this.spawnInterval
        }
    }
    spawnWave(){
        const randomIndex = Math.floor(Math.random() * this.enemyTypes.length)
        const type = this.enemyTypes[randomIndex]

        //spawns at random edge
        const edge = Math.floor(Math.random() * 4)


        const arr = [{x:Math.random()* GAME_WIDTH, y:-ENEMY_SPAWN_MARGIN}, 
                     {x:GAME_WIDTH + ENEMY_SPAWN_MARGIN, y: Math.random() * GAME_HEIGHT}, 
                     {x:Math.random()* GAME_WIDTH,y:GAME_HEIGHT + ENEMY_SPAWN_MARGIN}, 
                     {x: -ENEMY_SPAWN_MARGIN, y: Math.random() * GAME_HEIGHT}
                    ]
       

        const {x,y} = arr[edge]

        this.enemyManager.spawn(type, x, y)
                
    }
    reset() {
        this.spawnTimer = 0
    }
}