export default class Pane {
    constructor() {
        this.hidden = true;
        this.div = null;
        this.pilot = null;
        this.name = null;
        this.exitButton = null;
    }

    createPane() {
        this.div = document.createElement('div');
        this.div.id = 'sidePane';
        document.body.insertBefore(this.div, document.body.childNodes[0]);
        this.addExitOption();
        this.hidePane();
    }

    showPane(name) {
        this.div.style.display = 'block';
        this.hidden = false;
        this.name = name;
    }

    hidePane() {
        this.div.style.display = 'none';
        this.hidden = true;
        this.pilot = null;
    }

    updatePane(pilot) {
        if (pilot.name === this.name) {
            this.pilot = pilot;

        }
    }

    addExitOption() {
        this.exitButton = document.createElement('button');
        this.exitButton.id = 'exitButton';
        this.exitButton.innerText = 'Exit';
        let self = this;
        this.exitButton.onclick = () => {
            self.hidePane();
        };
        this.div.insertBefore(this.exitButton, this.div.childNodes[0]);
    }
}
