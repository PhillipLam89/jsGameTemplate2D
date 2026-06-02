import { EVENTS } from "./constants.js"
export class UIManager {
    constructor(events) {
        this.events = events
        this.setupEventListeners()
        this.timerEl = window?.timer
       
    }
    setupEventListeners() {
        window.playBtn.onclick = () => {
            this.events.emit(EVENTS.GAME_START)
        }
        window.resumeBtn.onclick = () => {
             this.events.emit(EVENTS.GAME_RESUME)
        }      

        window.quitBtn.onclick = () => {
             this.events.emit(EVENTS.GAME_RETURN_TO_MENU)
        }
        window.gameContainer.onmouseover = (e) => {
            e.target.tagName == 'BUTTON'  
                        &&
            this.events.emit(EVENTS.SOUND, 'button_hover')          
        }  
        

    }

    hideAllPanels() {
        document.querySelectorAll('.ui-panel').forEach(node => node.classList.remove('active'))
    }
    showPanel(panelID) {
        this.hideAllPanels()
        document.getElementById(panelID)?.classList.add('active')
    }

    showTimer(){
        // const timerElement = document.getElementById('timer')
        if (this.timerEl) {
            this.timerEl.style.display = 'block'
        }
    }
    hideTimer(){
        // const timerElement = document.getElementById('timer')
        if (this.timerEl) {
            this.timerEl.style.display = 'none'
        }     
    }
    updateTimer(time){
        const mins = ~~(time / 60)
        let secs = ~~(time % 60)
            secs = (secs >= 10) ? secs : ('0' + secs)

        if (this.timerEl) this.timerEl.textContent = `${mins}:${secs}`
    }
}

