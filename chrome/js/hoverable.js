class Hoverable {
    constructor(divClass) {
        this.divClass = divClass;
        this.divImages = null;
        this.hoverables = null;
    }

    createHoverable() {
        let divImages = document.getElementsByClassName("divClass");

        let root = null;
        let divOverlay = null;
        let buttonHover = null;
        this.hoverables = [];

        for (let i in divImages.length) {
            root = divImages[0];

            divOverlay = document.createElement("div");
            divOverlay.classList.add("middle");
            root.appendChild(divOverlay);

            buttonHover = document.createElement("div");
            buttonHover.classList.add("button");
            divOverlay.appendChild(buttonHover);

            this.hoverables[i] = divOverlay;
        }
    }

    removeHoverable() {
        if (this.hoverables.length > 0) {
            for (let i in this.hoverables.length) {
                i.remove();
            }
        }
    }
}