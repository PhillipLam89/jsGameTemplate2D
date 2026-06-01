import { SeekBehavior } from "./seekBehavior.js";
import { DriftBehavior } from "./DriftBehavior.js";
export class BehaviorFactory {
    static create(behaviorType) {
        switch(behaviorType) {
            case 'seek':
                return new SeekBehavior();
            case 'drift':
                return new DriftBehavior();
            default:
                console.log('default behavior')
                return new SeekBehavior()
        }
    }
}