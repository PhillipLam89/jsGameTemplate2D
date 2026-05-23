export class UIManager {
    constructor(game) {
        this.game = game
        this.setupEventListeners()
        this.timerEl = window?.timer
       
    }
    setupEventListeners() {
        window.playBtn.onclick = () => {
            this.game.startGame()
        }
        window.resumeBtn.onclick = () => {
            this.game.resume()
        }      

        window.quitBtn.onclick = () => {
            this.game.returnToMenu()
        }
        window.gameContainer.onmouseover = (e) => {
            e.target.tagName == 'BUTTON'  
                        &&
            this.game.playSound('button_hover')            
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