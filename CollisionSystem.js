export class CollisionSystem {
    checkCircleCircle(a,b) {
        const ax = a.x + (a.width * 0.5)
        const ay = a.y + (a.height * 0.5)

        const bx = b.x + (b.width * 0.5)
        const by = b.y + (b.height * 0.5)

        const dx = ax - bx 
        const dy = ay - by
        const distSquared = dx**2 + dy**2

        const radSum = a.collisionRadius + b.collisionRadius
        return distSquared < radSum**2
    }
}