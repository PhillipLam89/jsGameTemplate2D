export class UIManager {
    constructor(game) {
        this.game = game
        this.setupEventListeners()
    }
    setupEventListeners() {
        document.getElementById('playBtn').onclick = () => {
            this.game.startGame()
        }
        document.getElementById('resumeBtn').onclick = () => {
            this.game.resume()
        }      

        document.getElementById('quitBtn').onclick = () => {
            this.game.returnToMenu()
        }
        window.gameContainer.onmouseover = (e) => {
            e.target.tagName == 'BUTTON'  
                        &&
            this.game.audioManager.play('button_hover')            
        }  
        
        
        // document.querySelectorAll('button').forEach(btn => btn.onmouseover = () => {
        //     console.log(this.audioManager)
        //     this.audioManager.play('button_hover')
        // })
    }

    hideAllPanels() {
        document.querySelectorAll('.ui-panel').forEach(node => node.classList.remove('active'))
    }
    showPanel(panelID) {
        this.hideAllPanels()
        document.getElementById(panelID).classList.add('active')
    }

    showTimer(){
        const timerElement = document.getElementById('timer')
        if (timerElement) {
            timerElement.style.display = 'block'
        }
    }
    hideTimer(){
        const timerElement = document.getElementById('timer')
        if (timerElement) {
            timerElement.style.display = 'none'
        }     
    }
    updateTimer(time){
        const mins = ~~(time / 60)
        let secs = ~~(time % 60)
        if (secs < 10) secs = '0' + secs
        const timerElement = document.getElementById('timer')
        if (timerElement) timerElement.textContent = `${mins}:${secs}`
    }
}