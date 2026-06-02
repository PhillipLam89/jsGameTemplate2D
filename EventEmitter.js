export class EventEmitter {
    constructor() {
        this.listeners = {} //holds all listeners
    }

    on(event, fn) {
        (this.listeners[event] ??= []).push(fn)
    }
    off(event, fn) {
        if (!this.listeners[event]) return
        this.listeners[event] = this.listeners[event].filter(func => func!= fn)
    }

    emit(event, ...args) {
        this.listeners[event]?.forEach(fn => fn(...args))
    }
}