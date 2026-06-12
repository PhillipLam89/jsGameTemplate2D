import { EVENTS } from "./constants.js";

export class CollisionManger {
    constructor(collisionSystem, events) {
        this.collisionSystem = collisionSystem
        this.events = events
    }

    update(player, enemies) {
        this.checkPlayervsEnemies(player, enemies)
    }

    checkPlayervsEnemies(player, enemies) {
        for (const enemy of enemies) {
            if(!enemy.active) continue;
            if (this.collisionSystem.checkCircleCircle(player, enemy)) {
                enemy.active = false;
                const damageApplied = player.takeDamage(enemy.damage)
                if(damageApplied) this.events.emit(EVENTS.PLAYER_DAMAGED, player.health, player.maxHealth);
                this.events.emit(EVENTS.ENEMY_DIED, enemy)
            }
        }
    }
}