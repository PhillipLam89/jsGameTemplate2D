export class ObjectPooler {
    constructor(factoryFn, poolSize) { 
        //receives a func that returns a new enemy obj when called
        this.factoryFn = factoryFn 
        this.pool = [] //inactive objs, enemies, particles
        this.active = []  //ACTIVE objs, enemies, particles

        //pre-populate pool

        // for (const _ of poolSize) {
        //     this.pool.push(this.factoryFn()) //creates inactive enemy/particle in pool
        // }

        while (this.pool.length < poolSize) {
            this.pool.push(this.factoryFn())
        }
    }

    get() {
        let obj = null
        if (this.pool.length) {
            obj = this.pool.pop()
        } else {
            obj = this.factoryFn()
            console.log('no obj so made new 1')
        }

        this.active.push(obj)
        return obj;

    }
    updateAll(dt, ...args) {
        //update in reverse since we used array pop() 
        for (let i = this.active.length - 1; i >= 0; i--) {
             const obj = this.active[i]
             obj.update(dt, ...args)
             if (!obj.active) {
                this.release(obj)
             }
        }

    }
    release(obj) {
        const i = this.active.indexOf(obj)
        if (i > -1) {
            this.active.splice(indexedDB,1)
            obj.reset()
            this.pool.push(obj) //puts in inactive arr 
        }
    }
    releaseAll() {
   
        for (const obj of this.active) {
            obj.reset()
            this.pool.push(obj)
        }
        this.active = []

    }
}

